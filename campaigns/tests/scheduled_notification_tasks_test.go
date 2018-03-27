package tests

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/jackc/pgx"
	"github.com/namsral/flag"

	"github.com/golang/mock/gomock"
	"github.com/pkg/errors"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	audiencepb "github.com/roverplatform/rover/apis/go/audience/v1"
	audience_mocks "github.com/roverplatform/rover/apis/go/audience/v1/mock"
	authpb "github.com/roverplatform/rover/apis/go/auth/v1"
	notificationpb "github.com/roverplatform/rover/apis/go/notification/v1"
	notification_mocks "github.com/roverplatform/rover/apis/go/notification/v1/mock"
	"github.com/roverplatform/rover/campaigns"
	db "github.com/roverplatform/rover/campaigns/db"
	"github.com/roverplatform/rover/campaigns/db/testdb"
	"github.com/roverplatform/rover/campaigns/jobs"
	sn "github.com/roverplatform/rover/campaigns/que/scheduled_notifications"
	campaigns_mocks "github.com/roverplatform/rover/campaigns/tests/mocks"
	rtesting "github.com/roverplatform/rover/go/testing"
)

var (
	Diff  = rtesting.Diff
	Difff = rtesting.Difff
)

var (
	_ = audiencepb.NullType
	_ = authpb.NewAuthClient

	tCfg struct {
		PG struct {
			DSN      string
			Fixtures struct {
				Path string
			}
			Migration struct {
				Path string
				Cmd  string
				Arg  string
			}
		}
	}
)

func init() {
	flag.StringVar(&tCfg.PG.DSN, "test-db-dsn", "", "Postgres DSN")
	flag.StringVar(&tCfg.PG.Migration.Path, "migration-path", "../db/migrations/", "PG's migrations")
	flag.StringVar(&tCfg.PG.Migration.Cmd, "migration-cmd", "", "migration cmd: up|redo|...")
	flag.StringVar(&tCfg.PG.Migration.Arg, "migration-arg", "", "migration cmd args")

	flag.Parse()
}

func dbOpen(t testing.TB, dsn string) (*db.DB, func() error) {
	t.Helper()
	pgdb, err := db.Open(dsn)
	if err != nil {
		t.Fatal("setup:", err)
	}

	if _, err := pgdb.DB().Exec(`SELECT set_config('log_statement', 'all', false)`); err != nil {
		t.Fatal("Enable logging:", err)
	}

	return pgdb, pgdb.Close
}

const campaigns_index = "test_campaigns_audience_index"

func TestTasks(t *testing.T) {
	t.Logf("config: %+v", tCfg)

	//
	// Setup PG
	//
	var pgdb, closeDB = dbOpen(t, tCfg.PG.DSN)
	defer closeDB()

	var tDb = testdb.DB{
		MigrationPath: tCfg.PG.Migration.Path,
		DB:            pgdb.DB(),
		TB:            t,
	}

	var m = tCfg.PG.Migration
	t.Logf("Migrations: cmd=%q path=%q", m.Cmd, m.Path)
	tDb.MigrationStatus()
	if m.Path != "" && m.Cmd != "" {
		if err := tDb.Migrate(m.Cmd, m.Arg); err != nil {
			t.Fatalf("db.Migrate: %v", err)
		}
	} else {
		t.Logf("Migrations: skipping")
	}

	tDb.Exec(`TRUNCATE scheduled_notification_tasks RESTART IDENTITY;`)

	t.Run("ScheduledNotificationTasks", test_ScheduledNotificationTasks)
}

func test_ScheduledNotificationTasks(t *testing.T) {
	_, err := db.Open(tCfg.PG.DSN)
	if err != nil {
		t.Fatal("db.Open:", err)
	}

	pgxcfg, err := pgx.ParseURI(tCfg.PG.DSN)
	if err != nil {
		t.Fatal("pgx.ParseURI:", err)
	}

	pgpool, err := pgx.NewConnPool(pgx.ConnPoolConfig{
		// default is 5
		// but since processed tasks are never released back to not be picked up again
		// increase the number to a large number to accomodate more tasks
		MaxConnections: 1000,
		ConnConfig:     pgxcfg,
	})
	if err != nil {
		t.Fatal("pgx.NewConnPool:", err)
	}

	if err := sn.PrepareStatements(pgpool); err != nil {
		t.Fatal("PrepareStatements:", err)
	}

	defer pgpool.Close()

	type (
		args struct {
			Task               *sn.Task
			AudienceClient     *audience_mocks.MockAudienceClient
			NotificationClient *notification_mocks.MockNotificationClient
			CampaignsStore     *campaigns_mocks.MockCampaignsStore
		}

		given struct {
			Task     *sn.Task
			MockFunc func(args)
		}

		expect struct {
			Task, Forked *sn.Task
			Result       *jobs.Result

			Err error
		}
	)

	jobs.BatchSize = 2

	var (
		iterator = &audiencepb.QueryRequest_ScrollIterator_{
			ScrollIterator: &audiencepb.QueryRequest_ScrollIterator{
				Operation: &audiencepb.QueryRequest_ScrollIterator_StartScroll_{
					StartScroll: &audiencepb.QueryRequest_ScrollIterator_StartScroll{
						BatchSize: int32(jobs.BatchSize),
					},
				},
			},
		}

		campaignWithSegments = &campaigns.Campaign{
			CampaignId:       1,
			SegmentCondition: int32(audiencepb.PredicateAggregate_ALL),
			SegmentIds:       []string{"abc", "efg"},
		}

		notFoundErr = status.Errorf(codes.NotFound, "not found")

		// truncate to PG's precision
		now = time.Now().Truncate(time.Millisecond)
	)

	sn.TimeNow = func() time.Time {
		return now
	}

	var (
		tcases = []struct {
			desc string
			gvn  *given

			expErr error

			after *expect
		}{
			{
				desc: "error: campaign not found",
				gvn: &given{
					Task: &sn.Task{
						ID:               1,
						Error:            "",
						Forked:           false,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateQueued),

						AccountId:      1,
						CampaignId:     1,
						DeviceIds:      nil,
						TimezoneOffset: 0,
					},

					MockFunc: func(m args) {
						m.CampaignsStore.EXPECT().
							OneById(context.Background(), int32(1), int32(1)).
							Return(
								nil,
								notFoundErr,
							)
					},
				},

				expErr: errors.Wrap(notFoundErr, "CampaignsStore.OneById"),

				after: &expect{
					Task: &sn.Task{
						ID:               1,
						Error:            "CampaignsStore.OneById: rpc error: code = NotFound desc = not found",
						Forked:           false,
						NumberOfAttempts: 1,
						RunAt:            now.Add(4 * time.Second),
						State:            string(sn.TaskStateInProgress),

						AccountId:      1,
						CampaignId:     1,
						DeviceIds:      nil,
						TimezoneOffset: 0,
					},
				},
			},

			{
				desc: "with deviceIds but audience returns no devices",
				gvn: &given{
					Task: &sn.Task{
						ID:               2,
						Error:            "",
						Forked:           false,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateQueued),

						AccountId:      1,
						CampaignId:     1,
						DeviceIds:      []string{"a", "b"},
						TimezoneOffset: 0,
					},

					MockFunc: func(m args) {
						var (
							authCtx = &authpb.AuthContext{
								AccountId:        1,
								PermissionScopes: []string{"server"},
							}

							ctx = context.Background()
						)

						m.CampaignsStore.EXPECT().
							OneById(ctx, int32(1), int32(1)).
							Return(campaignWithSegments, nil)

						for _, deviceId := range []string{"a", "b"} {
							m.AudienceClient.EXPECT().
								GetDevice(ctx,
									&audiencepb.GetDeviceRequest{
										AuthContext: authCtx,
										DeviceId:    deviceId,
									},
								).
								Return(
									nil,
									notFoundErr,
								)
						}
					},
				},

				expErr: nil,

				after: &expect{
					Task: &sn.Task{
						ID:               2,
						Error:            "",
						Forked:           false,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateCompleted),

						AccountId:      1,
						CampaignId:     1,
						DeviceIds:      []string{"a", "b"},
						TimezoneOffset: 0,
					},
				},
			},

			{
				desc: "with deviceIds",
				gvn: &given{
					Task: &sn.Task{
						ID:               3,
						Error:            "",
						Forked:           false,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateQueued),

						AccountId:      1,
						CampaignId:     1,
						DeviceIds:      []string{"a", "b"},
						TimezoneOffset: 0,
					},

					MockFunc: func(m args) {
						var (
							authCtx = &authpb.AuthContext{
								AccountId:        1,
								PermissionScopes: []string{"server"},
							}

							ctx = context.Background()
						)

						m.CampaignsStore.EXPECT().
							OneById(ctx, int32(1), int32(1)).
							Return(campaignWithSegments, nil)

						m.AudienceClient.EXPECT().
							GetDevice(ctx,
								&audiencepb.GetDeviceRequest{
									AuthContext: authCtx,
									DeviceId:    "a",
								},
							).
							Return(
								&audiencepb.GetDeviceResponse{
									Device: &audiencepb.Device{
										DeviceId:          "a",
										ProfileIdentifier: "ap",
									},
								},
								nil,
							)

						m.AudienceClient.EXPECT().
							GetDevice(ctx,
								&audiencepb.GetDeviceRequest{
									AuthContext: authCtx,
									DeviceId:    "b",
								},
							).
							Return(
								&audiencepb.GetDeviceResponse{
									Device: &audiencepb.Device{
										DeviceId:          "b",
										ProfileIdentifier: "bp",
									},
								},
								nil,
							)

						m.AudienceClient.EXPECT().
							ListProfilesByIdentifiers(ctx,
								&audiencepb.ListProfilesByIdentifiersRequest{
									AuthContext:        authCtx,
									ProfileIdentifiers: []string{"ap", "bp"},
								},
							).
							Return(
								&audiencepb.ListProfilesByIdentifiersResponse{
									Profiles: []*audiencepb.Profile{
										&audiencepb.Profile{
											Identifier: "ap",
										},
										&audiencepb.Profile{
											Identifier: "bp",
										},
									},
								},
								nil,
							)

						m.NotificationClient.EXPECT().
							SendCampaignNotification(ctx, &notificationpb.SendCampaignNotificationRequest{
								AuthContext:  authCtx,
								CampaignId:   1,
								ExperienceId: "",
								Messages: []*notificationpb.SendCampaignNotificationRequest_Message{
									&notificationpb.SendCampaignNotificationRequest_Message{DeviceId: "a"},
									&notificationpb.SendCampaignNotificationRequest_Message{DeviceId: "b"},
								},
							}).
							Return(&notificationpb.SendCampaignNotificationResponse{}, nil)
					},
				},

				expErr: nil,

				after: &expect{
					Task: &sn.Task{
						ID:               3,
						Error:            "",
						Forked:           false,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateCompleted),

						AccountId:      1,
						CampaignId:     1,
						DeviceIds:      []string{"a", "b"},
						TimezoneOffset: 0,
					},
				},
			},

			{
				desc: "with segment_ids; signle task",
				gvn: &given{
					Task: &sn.Task{
						ID:               4,
						Error:            "",
						Forked:           false,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateQueued),

						AccountId:      1,
						CampaignId:     1,
						TimezoneOffset: 0,
					},

					MockFunc: func(m args) {
						var (
							authCtx = &authpb.AuthContext{
								AccountId:        1,
								PermissionScopes: []string{"server"},
							}

							ctx = context.Background()
						)

						m.CampaignsStore.EXPECT().
							OneById(ctx, int32(1), int32(1)).
							Return(campaignWithSegments, nil)

						m.AudienceClient.EXPECT().
							Query(ctx,
								&audiencepb.QueryRequest{
									AuthContext: authCtx,

									Query: &audiencepb.QueryRequest_QuerySegments_{
										QuerySegments: &audiencepb.QueryRequest_QuerySegments{
											Condition: audiencepb.PredicateAggregate_ALL,
											Ids:       []string{"abc", "efg"},
										},
									},

									Iterator: iterator,
								},
							).
							Return(
								&audiencepb.QueryResponse{
									ScrollId:  "",
									TotalSize: 2,
									Devices: []*audiencepb.Device{
										&audiencepb.Device{DeviceId: "a"},
										&audiencepb.Device{DeviceId: "b"},
									},
								},
								nil,
							)

						m.NotificationClient.EXPECT().
							SendCampaignNotification(ctx, &notificationpb.SendCampaignNotificationRequest{
								AuthContext:  authCtx,
								CampaignId:   1,
								ExperienceId: "",
								Messages: []*notificationpb.SendCampaignNotificationRequest_Message{
									&notificationpb.SendCampaignNotificationRequest_Message{DeviceId: "a"},
									&notificationpb.SendCampaignNotificationRequest_Message{DeviceId: "b"},
								},
							}).
							Return(&notificationpb.SendCampaignNotificationResponse{}, nil)
					},
				},

				expErr: nil,

				after: &expect{
					Task: &sn.Task{
						ID:               4,
						Error:            "",
						Forked:           false,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateCompleted),

						AccountId:      1,
						CampaignId:     1,
						DeviceIds:      nil,
						TimezoneOffset: 0,
					},
				},
			},

			{
				desc: "with segment_ids; forks a child task",
				gvn: &given{
					Task: &sn.Task{
						ID:               5,
						Error:            "",
						Forked:           false,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateQueued),

						AccountId:      1,
						CampaignId:     1,
						TimezoneOffset: 0,
					},

					MockFunc: func(m args) {
						var (
							authCtx = &authpb.AuthContext{
								AccountId:        1,
								PermissionScopes: []string{"server"},
							}

							ctx = context.Background()
						)

						m.CampaignsStore.EXPECT().
							OneById(ctx, int32(1), int32(1)).
							Return(campaignWithSegments, nil)

						m.AudienceClient.EXPECT().
							Query(ctx,
								&audiencepb.QueryRequest{
									AuthContext: authCtx,

									Query: &audiencepb.QueryRequest_QuerySegments_{
										QuerySegments: &audiencepb.QueryRequest_QuerySegments{
											Condition: audiencepb.PredicateAggregate_ALL,
											Ids:       []string{"abc", "efg"},
										},
									},

									Iterator: iterator,
								},
							).
							Return(
								&audiencepb.QueryResponse{
									ScrollId:  "scroll_id#01",
									TotalSize: 4,
									Devices: []*audiencepb.Device{
										&audiencepb.Device{DeviceId: "a"},
										&audiencepb.Device{DeviceId: "b"},
									},
								},
								nil,
							)

						m.NotificationClient.EXPECT().
							SendCampaignNotification(ctx, &notificationpb.SendCampaignNotificationRequest{
								AuthContext:  authCtx,
								CampaignId:   1,
								ExperienceId: "",
								Messages: []*notificationpb.SendCampaignNotificationRequest_Message{
									&notificationpb.SendCampaignNotificationRequest_Message{DeviceId: "a"},
									&notificationpb.SendCampaignNotificationRequest_Message{DeviceId: "b"},
								},
							}).
							Return(&notificationpb.SendCampaignNotificationResponse{}, nil)
					},
				},

				expErr: nil,

				after: &expect{
					Task: &sn.Task{
						ID:               5,
						Error:            "",
						Forked:           true,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateCompleted),

						AccountId:      1,
						CampaignId:     1,
						DeviceIds:      nil,
						TimezoneOffset: 0,
					},
					Forked: &sn.Task{
						ID:               6,
						Error:            "",
						Forked:           false,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateQueued),

						ScrollId:       "scroll_id#01",
						AccountId:      1,
						CampaignId:     1,
						DeviceIds:      nil,
						TimezoneOffset: 0,
					},
				},
			},

			{
				desc: "works a child task",
				gvn: &given{

					Task: nil,

					MockFunc: func(m args) {
						var (
							authCtx = &authpb.AuthContext{
								AccountId:        1,
								PermissionScopes: []string{"server"},
							}

							ctx = context.Background()
						)

						m.CampaignsStore.EXPECT().
							OneById(ctx, int32(1), int32(1)).
							Return(campaignWithSegments, nil)

						m.AudienceClient.EXPECT().
							Query(ctx,
								&audiencepb.QueryRequest{
									AuthContext: authCtx,

									Iterator: &audiencepb.QueryRequest_ScrollIterator_{
										ScrollIterator: &audiencepb.QueryRequest_ScrollIterator{
											Operation: &audiencepb.QueryRequest_ScrollIterator_Next_{
												Next: &audiencepb.QueryRequest_ScrollIterator_Next{
													ScrollId: "scroll_id#01",
												},
											},
										},
									},
								},
							).
							Return(
								&audiencepb.QueryResponse{
									ScrollId:  "",
									TotalSize: 2,
									Devices: []*audiencepb.Device{
										&audiencepb.Device{DeviceId: "a"},
										&audiencepb.Device{DeviceId: "b"},
									},
								},
								nil,
							)

						m.NotificationClient.EXPECT().
							SendCampaignNotification(ctx, &notificationpb.SendCampaignNotificationRequest{
								AuthContext:  authCtx,
								CampaignId:   1,
								ExperienceId: "",
								Messages: []*notificationpb.SendCampaignNotificationRequest_Message{
									&notificationpb.SendCampaignNotificationRequest_Message{DeviceId: "a"},
									&notificationpb.SendCampaignNotificationRequest_Message{DeviceId: "b"},
								},
							}).
							Return(&notificationpb.SendCampaignNotificationResponse{}, nil)
					},
				},

				expErr: nil,

				after: &expect{
					Task: &sn.Task{
						ID:               6,
						Forked:           false,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateCompleted),

						ScrollId:       "scroll_id#01",
						AccountId:      1,
						CampaignId:     1,
						DeviceIds:      nil,
						TimezoneOffset: 0,
					},
				},
			},

			{
				desc: "error: audience.Query returns non-retryable error",
				gvn: &given{
					Task: &sn.Task{
						ID:               7,
						Error:            "",
						Forked:           false,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateQueued),
						ScrollId:         "scroll_id#02",

						AccountId:      1,
						CampaignId:     1,
						TimezoneOffset: 0,
					},

					MockFunc: func(m args) {
						var (
							authCtx = &authpb.AuthContext{
								AccountId:        1,
								PermissionScopes: []string{"server"},
							}

							ctx = context.Background()
						)

						m.CampaignsStore.EXPECT().
							OneById(ctx, int32(1), int32(1)).
							Return(campaignWithSegments, nil)

						m.AudienceClient.EXPECT().
							Query(ctx,
								&audiencepb.QueryRequest{
									AuthContext: authCtx,

									Iterator: &audiencepb.QueryRequest_ScrollIterator_{
										ScrollIterator: &audiencepb.QueryRequest_ScrollIterator{
											Operation: &audiencepb.QueryRequest_ScrollIterator_Next_{
												Next: &audiencepb.QueryRequest_ScrollIterator_Next{
													ScrollId: "scroll_id#02",
												},
											},
										},
									},
								},
							).
							Return(
								nil,
								status.Error(codes.DataLoss, "fatal"),
							)
					},
				},

				expErr: errors.Wrap(status.Error(codes.DataLoss, "fatal"), "NextBatch: audience.Query"),

				after: &expect{
					Task: &sn.Task{
						ID:               7,
						Forked:           false,
						Error:            "NextBatch: audience.Query: rpc error: code = DataLoss desc = fatal",
						NumberOfAttempts: 1,
						RunAt:            now.Add(4 * time.Second),
						State:            string(sn.TaskStateFailed),

						ScrollId:       "scroll_id#02",
						AccountId:      1,
						CampaignId:     1,
						DeviceIds:      nil,
						TimezoneOffset: 0,
					},
				},
			},

			{
				desc: "error: audience.Query returns retryable error",
				gvn: &given{
					Task: &sn.Task{
						ID:               8,
						Error:            "",
						Forked:           false,
						NumberOfAttempts: 0,
						RunAt:            now,
						State:            string(sn.TaskStateQueued),
						ScrollId:         "scroll_id#03",

						AccountId:      1,
						CampaignId:     1,
						TimezoneOffset: 0,
					},

					MockFunc: func(m args) {
						var (
							authCtx = &authpb.AuthContext{
								AccountId:        1,
								PermissionScopes: []string{"server"},
							}

							ctx = context.Background()
						)

						m.CampaignsStore.EXPECT().
							OneById(ctx, int32(1), int32(1)).
							Return(campaignWithSegments, nil)

						m.AudienceClient.EXPECT().
							Query(ctx,
								&audiencepb.QueryRequest{
									AuthContext: authCtx,

									Iterator: &audiencepb.QueryRequest_ScrollIterator_{
										ScrollIterator: &audiencepb.QueryRequest_ScrollIterator{
											Operation: &audiencepb.QueryRequest_ScrollIterator_Next_{
												Next: &audiencepb.QueryRequest_ScrollIterator_Next{
													ScrollId: "scroll_id#03",
												},
											},
										},
									},
								},
							).
							Return(
								nil,
								status.Error(codes.DeadlineExceeded, "timeout"),
							)
					},
				},

				expErr: errors.Wrap(status.Error(codes.DeadlineExceeded, "timeout"), "NextBatch: audience.Query"),

				after: &expect{
					Task: &sn.Task{
						ID:               8,
						Forked:           false,
						Error:            "NextBatch: audience.Query: rpc error: code = DeadlineExceeded desc = timeout",
						NumberOfAttempts: 1,
						RunAt:            now.Add(4 * time.Second),
						State:            string(sn.TaskStateInProgress),

						ScrollId:       "scroll_id#03",
						AccountId:      1,
						CampaignId:     1,
						DeviceIds:      nil,
						TimezoneOffset: 0,
					},
				},
			},
		}
	)

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			if tc.gvn == nil {
				t.Skip("TODO")
				return
			}

			var (
				ctl = gomock.NewController(t)

				// mocks collection
				m = args{
					AudienceClient:     audience_mocks.NewMockAudienceClient(ctl),
					NotificationClient: notification_mocks.NewMockNotificationClient(ctl),
					CampaignsStore:     campaigns_mocks.NewMockCampaignsStore(ctl),
				}

				// instantiate job with mocks
				job = jobs.ScheduledNotificationJob{
					AudienceClient:     m.AudienceClient,
					NotificationClient: m.NotificationClient,
					CampaignsStore:     m.CampaignsStore,
				}
			)

			if tc.gvn.Task != nil {
				// TODO: task is coupled with connection and pool
				// and they're both unexported fields
				// therefore in order to have a valid task value it gets inserted into db
				// and fetched back with LockOne call
				_ = createTask(t, pgpool, tc.gvn.Task)
			}

			var task = lockOne(t, pgpool)
			if task == nil {
				t.Fatal("task expected")
			}

			// never release tasks, so they don't get picked up more than once
			// defer task.Done()
			//

			m.Task = task
			// setup mocks for the test case
			tc.gvn.MockFunc(m)

			var (
				exp, expErr = tc.after, tc.expErr
				gotErr      = job.Do(context.TODO(), task)
				got         = &expect{
					Task: fetchTask(t, pgpool, int64(exp.Task.ID)),
				}
			)

			if exp.Forked != nil {
				got.Forked = fetchTask(t, pgpool, int64(exp.Forked.ID))
			}

			// check the expectations
			ctl.Finish()

			if diff := Diff(nil, nil, expErr, gotErr); diff != nil {
				t.Errorf("\nDiff: \n%v\n", Difff(diff))
			}

			if tc.after != nil {
				if diff := Diff(exp, got, nil, nil); diff != nil {
					t.Errorf("\nDiff: \n%v\n", Difff(diff))
				}
			}
		})
	}
}

func toJSON(t *testing.T, v interface{}) []byte {
	data, err := json.Marshal(v)
	if err != nil {
		t.Fatalf("json.Marshal: %v", err)
	}
	return data
}
