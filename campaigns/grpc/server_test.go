package campaigns_grpc_test

import (
	"context"
	"io/ioutil"
	"testing"
	"time"

	"github.com/lib/pq"
	"github.com/namsral/flag"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	campaignspb "github.com/roverplatform/rover/apis/go/campaigns/v1"
	"github.com/roverplatform/rover/apis/go/protobuf/predicates"
	"github.com/roverplatform/rover/apis/go/protobuf/wrappers"
	"github.com/roverplatform/rover/campaigns/db"
	"github.com/roverplatform/rover/campaigns/db/testdb"
	campaigns_grpc "github.com/roverplatform/rover/campaigns/grpc"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	rtesting "github.com/roverplatform/rover/go/testing"
	"github.com/roverplatform/rover/go/zoneinfo"
)

type (
	Task = db.ScheduledNotificationTask
)

var (
	Diff  = rtesting.Diff
	Difff = rtesting.Difff

	tCfg struct {
		DSN string

		migration struct {
			Path string
			Cmd  string
			Args string
		}

		fixtures struct {
			Path string
		}
	}

	// NOTE: Postgres only allows microsecond resolution: nanoseconds are zeroed for compatibility
	// https://github.com/lib/pq/issues/227
	//
	timeCreatedAt = time.Now().Truncate(time.Millisecond)
	timeUpdatedAt = timeCreatedAt

	createdAt, _ = timestamp.TimestampProto(timeCreatedAt)
	updatedAt    = createdAt
)

func init() {
	flag.StringVar(&tCfg.DSN, "test-db-dsn", ``, "test DSN")

	flag.StringVar(&tCfg.fixtures.Path, "fixtures-path", `../db/testdata/fixtures.sql`, "path to migrations")

	flag.StringVar(&tCfg.migration.Path, "migration-path", `../db/migrations`, "path to migrations")
	flag.StringVar(&tCfg.migration.Cmd, "migration-cmd", `up`, "migration cmd")
	flag.StringVar(&tCfg.migration.Args, "migration-args", ``, "migration args")

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

func ts(t testing.TB, ts string) *timestamp.Timestamp {
	t.Helper()
	tt, err := time.Parse(time.RFC3339Nano, ts)
	if err != nil {
		t.Fatal("time.Parse:", err)
	}

	protoTs, err := timestamp.TimestampProto(tt)
	if err != nil {
		t.Fatal("toTimestamp:", err)
	}

	return protoTs
}

func ts2(t *testing.T, s string) time.Time {
	t.Helper()

	tsv, err := time.Parse(time.RFC3339, s)
	if err != nil {
		t.Fatal(err)
	}

	return tsv
}

func readFile(t *testing.T, path string) []byte {
	t.Helper()
	data, err := ioutil.ReadFile(path)
	if err != nil {
		t.Fatal("readFile:", err)
	}

	return data
}

func TestCampaigns(t *testing.T) {
	var pgdb, closeDB = dbOpen(t, tCfg.DSN)
	defer closeDB()

	tDb := testdb.DB{
		MigrationPath: tCfg.migration.Path,
		DB:            pgdb.DB(),
		TB:            t,
	}

	var m = tCfg.migration
	t.Logf("Migrations: cmd=%q path=%q", m.Cmd, m.Path)
	tDb.MigrationStatus()
	if m.Path != "" && m.Cmd != "" {
		if err := tDb.Migrate(m.Cmd, m.Args); err != nil {
			t.Fatalf("db.Migrate: %v", err)
		}
	} else {
		t.Logf("Migrations: skipping")
	}

	// tDb.Exec(`SELECT set_config('log_statement', 'all', false)`)
	tDb.Exec(`TRUNCATE table campaigns, scheduled_notification_tasks RESTART IDENTITY;`)
	tDb.Exec(`SELECT pg_catalog.setval('campaigns_id_seq', 9999, true);`)
	tDb.Exec(string(readFile(t, tCfg.fixtures.Path)))

	db.TimeNow = func() time.Time { return timeCreatedAt }

	t.Run("List+Options", test_List_Options)
	t.Run("List", test_List)
	t.Run("Get", test_Get)
	t.Run("Create", test_Create)
	t.Run("Rename", test_Rename)
	t.Run("Duplicate", test_Duplicate)

	t.Run("Archive", test_Archive)
	t.Run("Publish", test_Publish)

	t.Run("SendTest", test_SendTest)

	t.Run("UpdateNotificationSettings", test_UpdateNotificationSettings)

	t.Run("UpdateAutomatedDeliverySettings", test_UpdateAutomatedDeliverySettings)

	t.Run("UpdateScheduledDeliverySettings", test_UpdateScheduledDeliverySettings)
	t.Run("UpdateScheduledDeliverySettings/Published", test_UpdateScheduledDeliverySettings_Published)

	t.Run("Load", test_LoadCampaign)
}

func test_List_Options(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = campaigns_grpc.Server{DB: db}
	)

	defer closeDB()

	tests := []struct {
		name string

		req *campaignspb.ListRequest
		exp []int

		expErr error
	}{
		{
			name: "lists campaigns",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
			},

			exp: []int{3, 2, 1},
		},

		{
			name: "limit: 1",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				PageSize:    1,
			},
			exp: []int{3},
		},

		{
			name: "limit: +page",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				PageSize:    1,
				Page:        2,
			},
			exp: []int{1},
		},

		{
			name: "limit:2 +page:0",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				PageSize:    2,
				Page:        0,
			},
			exp: []int{3, 2},
		},
		{
			name: "limit:1 +page:1",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				PageSize:    1,
				Page:        1,
			},
			exp: []int{2},
		},
		{
			name: "limit: +account id",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 2},
				PageSize:    2,
			},
			exp: []int{1001, 1000},
		},

		{
			name: "keyword: filters",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Keyword:     "C2",
			},
			exp: []int{2},
		},

		{
			name: "keyword: injection free",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				Keyword:     "C1 or account_id = 1",
			},
			exp: nil,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				exp, expErr  = tt.exp, tt.expErr
				resp, gotErr = svc.List(ctx, tt.req)
				got          []int
			)

			if diff := Diff(nil, nil, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}

			for _, c := range resp.Campaigns {
				switch cc := c.Campaign.(type) {
				case *campaignspb.Campaign_AutomatedNotificationCampaign:
					got = append(got, int(cc.AutomatedNotificationCampaign.CampaignId))
				case *campaignspb.Campaign_ScheduledNotificationCampaign:
					got = append(got, int(cc.ScheduledNotificationCampaign.CampaignId))
				default:
					t.Fatalf("unknown: %T=%v\n", c, c)
				}
			}

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))

			}
		})
	}
}

func test_List(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = campaigns_grpc.Server{DB: db}
	)

	defer closeDB()

	tests := []struct {
		name string

		req *campaignspb.ListRequest
		exp *campaignspb.ListResponse

		expErr error
	}{
		{
			name: "error: validation",
			req:  &campaignspb.ListRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validate: auth_context: is required. account_id: is required."),
		},

		{
			name: "lists campaigns",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
			},

			exp: &campaignspb.ListResponse{
				Campaigns: []*campaignspb.Campaign{
					&campaignspb.Campaign{
						&campaignspb.Campaign_ScheduledNotificationCampaign{
							&campaignspb.ScheduledNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

								CampaignId:     3,
								Name:           "c3",
								CampaignStatus: campaignspb.CampaignStatus_DRAFT,

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								// TODO
								// ScheduledDeliveryStatus: 1,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,
							},
						},
					},
					&campaignspb.Campaign{
						&campaignspb.Campaign_AutomatedNotificationCampaign{
							&campaignspb.AutomatedNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

								CampaignId:     2,
								Name:           "c2",
								CampaignStatus: campaignspb.CampaignStatus_DRAFT,

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
					&campaignspb.Campaign{
						&campaignspb.Campaign_AutomatedNotificationCampaign{
							&campaignspb.AutomatedNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

								CampaignId:     1,
								Name:           "c1",
								CampaignStatus: campaignspb.CampaignStatus_DRAFT,

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
				},
			},
		},
		{
			name: "list draft automated notification campaigns",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 3},

				CampaignStatus: campaignspb.CampaignStatus_DRAFT,
				CampaignType:   campaignspb.CampaignType_AUTOMATED_NOTIFICATION,
			},

			exp: &campaignspb.ListResponse{
				Campaigns: []*campaignspb.Campaign{
					{
						Campaign: &campaignspb.Campaign_AutomatedNotificationCampaign{
							AutomatedNotificationCampaign: &campaignspb.AutomatedNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

								CampaignId:     10,
								Name:           "c10",
								CampaignStatus: campaignspb.CampaignStatus_DRAFT,

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
				},
			},
		},
		{
			name: "list published automated notification campaigns",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 3},

				CampaignStatus: campaignspb.CampaignStatus_PUBLISHED,
				CampaignType:   campaignspb.CampaignType_AUTOMATED_NOTIFICATION,
			},

			exp: &campaignspb.ListResponse{
				Campaigns: []*campaignspb.Campaign{
					{
						Campaign: &campaignspb.Campaign_AutomatedNotificationCampaign{
							AutomatedNotificationCampaign: &campaignspb.AutomatedNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

								CampaignId:     11,
								Name:           "c11",
								CampaignStatus: campaignspb.CampaignStatus_PUBLISHED,

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
				},
			},
		},
		{
			name: "list archived automated notification campaigns",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 3},

				CampaignStatus: campaignspb.CampaignStatus_ARCHIVED,
				CampaignType:   campaignspb.CampaignType_AUTOMATED_NOTIFICATION,
			},

			exp: &campaignspb.ListResponse{
				Campaigns: []*campaignspb.Campaign{
					{
						Campaign: &campaignspb.Campaign_AutomatedNotificationCampaign{
							AutomatedNotificationCampaign: &campaignspb.AutomatedNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

								CampaignId:     12,
								Name:           "c12",
								CampaignStatus: campaignspb.CampaignStatus_ARCHIVED,

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
				},
			},
		},
		{
			name: "list all automated notification campaigns",
			req: &campaignspb.ListRequest{
				AuthContext: &auth.AuthContext{AccountId: 3},

				CampaignType: campaignspb.CampaignType_AUTOMATED_NOTIFICATION,
			},

			exp: &campaignspb.ListResponse{
				Campaigns: []*campaignspb.Campaign{
					{
						Campaign: &campaignspb.Campaign_AutomatedNotificationCampaign{
							AutomatedNotificationCampaign: &campaignspb.AutomatedNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

								CampaignId:     12,
								Name:           "c12",
								CampaignStatus: campaignspb.CampaignStatus_ARCHIVED,

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
					{
						Campaign: &campaignspb.Campaign_AutomatedNotificationCampaign{
							AutomatedNotificationCampaign: &campaignspb.AutomatedNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

								CampaignId:     11,
								Name:           "c11",
								CampaignStatus: campaignspb.CampaignStatus_PUBLISHED,

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
					{
						Campaign: &campaignspb.Campaign_AutomatedNotificationCampaign{
							AutomatedNotificationCampaign: &campaignspb.AutomatedNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

								CampaignId:     10,
								Name:           "c10",
								CampaignStatus: campaignspb.CampaignStatus_DRAFT,

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.List(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}
		})
	}
}

func test_Get(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = campaigns_grpc.Server{DB: db}
	)

	defer closeDB()

	tests := []struct {
		desc string

		req *campaignspb.GetRequest
		exp *campaignspb.GetResponse

		expErr error
	}{

		{
			desc: "error: validation",
			req:  &campaignspb.GetRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validate: auth_context: is required. account_id: is required. campaign_id: is required."),
		},
		{
			desc: "error: not found",

			req: &campaignspb.GetRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  404,
			},

			expErr: status.Errorf(codes.NotFound, "db.OneById: db.Get: sql: no rows in result set"),
		},
		{
			desc: "returns campaign",

			req: &campaignspb.GetRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  1,
			},

			expErr: nil,
			exp: &campaignspb.GetResponse{
				Campaign: &campaignspb.Campaign{
					Campaign: &campaignspb.Campaign_AutomatedNotificationCampaign{
						AutomatedNotificationCampaign: &campaignspb.AutomatedNotificationCampaign{
							CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
							UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

							CampaignId:     1,
							Name:           "c1",
							CampaignStatus: campaignspb.CampaignStatus_DRAFT,

							SegmentCondition: campaignspb.SegmentCondition_ALL,

							NotificationExpiration:                  -1,
							NotificationAlertOptionPushNotification: true,

							AutomatedMonday:    true,
							AutomatedTuesday:   true,
							AutomatedWednesday: true,
							AutomatedThursday:  true,
							AutomatedFriday:    true,
							AutomatedSaturday:  true,
							AutomatedSunday:    true,

							AutomatedFrequencySingleUse: true,
						},
					},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.desc, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.Get(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}
		})
	}

}

func test_Create(t *testing.T) {
	var (
		ctx = context.Background()

		db, closeDB = dbOpen(t, tCfg.DSN)

		svc = campaigns_grpc.Server{DB: db}
	)
	defer closeDB()

	tests := []struct {
		name string

		req *campaignspb.CreateRequest
		exp *campaignspb.CreateResponse

		expErr error
	}{
		{
			name: "error: validation",
			req:  &campaignspb.CreateRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validate: auth_context: is required. account_id: is required. campaign_type: is required. name: is required."),
		},

		{
			name: "creates automated campaign",
			req: &campaignspb.CreateRequest{
				AuthContext:  &auth.AuthContext{AccountId: 1},
				CampaignType: campaignspb.CampaignType_AUTOMATED_NOTIFICATION,
				Name:         "an automated campaign",
			},

			exp: &campaignspb.CreateResponse{
				Campaign: &campaignspb.Campaign{
					&campaignspb.Campaign_AutomatedNotificationCampaign{
						&campaignspb.AutomatedNotificationCampaign{
							CreatedAt: createdAt,
							UpdatedAt: updatedAt,

							CampaignId:     10000,
							Name:           "an automated campaign",
							CampaignStatus: campaignspb.CampaignStatus_DRAFT,

							SegmentCondition:                        campaignspb.SegmentCondition_ALL,
							NotificationExpiration:                  -1,
							NotificationAlertOptionPushNotification: true,
							AutomatedFrequencySingleUse:             true,

							AutomatedMonday:    true,
							AutomatedTuesday:   true,
							AutomatedWednesday: true,
							AutomatedThursday:  true,
							AutomatedFriday:    true,
							AutomatedSaturday:  true,
							AutomatedSunday:    true,
						},
					},
				},
			},
		},

		{
			name: "creates scheduled campaign",
			req: &campaignspb.CreateRequest{
				AuthContext:  &auth.AuthContext{AccountId: 1},
				CampaignType: campaignspb.CampaignType_SCHEDULED_NOTIFICATION,
				Name:         "a scheduled campaign",
			},

			exp: &campaignspb.CreateResponse{
				Campaign: &campaignspb.Campaign{
					&campaignspb.Campaign_ScheduledNotificationCampaign{
						&campaignspb.ScheduledNotificationCampaign{
							CreatedAt: createdAt,
							UpdatedAt: updatedAt,

							CampaignId:     10001,
							Name:           "a scheduled campaign",
							CampaignStatus: campaignspb.CampaignStatus_DRAFT,

							SegmentCondition:                        campaignspb.SegmentCondition_ALL,
							NotificationExpiration:                  -1,
							NotificationAlertOptionPushNotification: true,
						},
					},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.Create(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}
		})
	}
}

func test_Rename(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = campaigns_grpc.Server{DB: db}
	)

	defer closeDB()

	type expect struct {
		exp *campaign
		err error
	}

	tests := []struct {
		name string

		req *campaignspb.RenameRequest
		exp *campaignspb.RenameResponse

		before, after *expect

		expErr error
	}{
		{
			name: "error: validation",
			req:  &campaignspb.RenameRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validate: auth_context: is required. account_id: is required. campaign_id: is required. name: is required."),
		},

		{
			name: "error: not found",

			req: &campaignspb.RenameRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  404,
				Name:        "new name",
			},

			expErr: status.Errorf(codes.NotFound, "db.Rename: db.Update: sql: no rows in result set"),
		},

		{
			name: "renames a campaign",
			req: &campaignspb.RenameRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  10000,
				Name:        "A renamed campaign",
			},

			before: &expect{
				exp: &campaign{
					AccountId: 1,
					Campaign: &campaignspb.Campaign{
						&campaignspb.Campaign_AutomatedNotificationCampaign{
							&campaignspb.AutomatedNotificationCampaign{
								CreatedAt: createdAt,
								UpdatedAt: updatedAt,

								CampaignId:       10000,
								CampaignStatus:   campaignspb.CampaignStatus_DRAFT,
								Name:             "an automated campaign",
								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
				},
			},

			after: &expect{
				exp: &campaign{
					AccountId: 1,
					Campaign: &campaignspb.Campaign{
						&campaignspb.Campaign_AutomatedNotificationCampaign{
							&campaignspb.AutomatedNotificationCampaign{
								CreatedAt: createdAt,
								UpdatedAt: updatedAt,

								CampaignId:       10000,
								CampaignStatus:   campaignspb.CampaignStatus_DRAFT,
								Name:             "A renamed campaign",
								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
				},
			},

			exp: &campaignspb.RenameResponse{},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				acctId = tt.req.GetAuthContext().GetAccountId()
				cId    = tt.req.CampaignId
			)

			if tt.before != nil {
				var (
					exp, expErr = tt.before.exp, tt.before.err
					got, gotErr = campaignById(context.TODO(), db, acctId, cId)
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("Before: Diff:\n%v", Difff(diff))
				}
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.Rename(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", Difff(diff))
			}

			if tt.after != nil {
				var (
					exp, expErr = tt.after.exp, tt.after.err
					got, gotErr = campaignById(context.TODO(), db, acctId, cId)
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("After: Diff:\n%v", Difff(diff))
				}
			}
		})
	}
}

func test_Duplicate(t *testing.T) {
	var (
		ctx = context.Background()

		db, closeDB = dbOpen(t, tCfg.DSN)

		svc = campaigns_grpc.Server{DB: db}
	)
	defer closeDB()

	tests := []struct {
		name string

		req *campaignspb.DuplicateRequest
		exp *campaignspb.DuplicateResponse

		expErr error
	}{
		{
			name: "error: validation",
			req:  &campaignspb.DuplicateRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validate: auth_context: is required. account_id: is required. campaign_id: is required."),
		},

		{
			name: "error: not found",

			req: &campaignspb.DuplicateRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  404,
				Name:        "new name",
			},

			expErr: status.Errorf(codes.NotFound, "db.OneById: db.Get: sql: no rows in result set"),
		},

		{
			name: "duplicates automated campaign",
			req: &campaignspb.DuplicateRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  10000,
				Name:        "a duplicated automated campaign",
			},

			exp: &campaignspb.DuplicateResponse{
				Campaign: &campaignspb.Campaign{
					&campaignspb.Campaign_AutomatedNotificationCampaign{
						&campaignspb.AutomatedNotificationCampaign{
							CreatedAt: createdAt,
							UpdatedAt: updatedAt,

							CampaignId:     10002,
							Name:           "a duplicated automated campaign",
							CampaignStatus: campaignspb.CampaignStatus_DRAFT,

							SegmentCondition: campaignspb.SegmentCondition_ALL,

							NotificationExpiration:                  -1,
							NotificationAlertOptionPushNotification: true,

							AutomatedMonday:    true,
							AutomatedTuesday:   true,
							AutomatedWednesday: true,
							AutomatedThursday:  true,
							AutomatedFriday:    true,
							AutomatedSaturday:  true,
							AutomatedSunday:    true,

							AutomatedFrequencySingleUse: true,
						},
					},
				},
			},
		},

		{
			name: "duplicates scheduled campaign",
			req: &campaignspb.DuplicateRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  10001,
				Name:        "a duplicated scheduled campaign",
			},

			exp: &campaignspb.DuplicateResponse{
				Campaign: &campaignspb.Campaign{
					&campaignspb.Campaign_ScheduledNotificationCampaign{
						&campaignspb.ScheduledNotificationCampaign{
							CreatedAt: createdAt,
							UpdatedAt: updatedAt,

							CampaignId:     10003,
							Name:           "a duplicated scheduled campaign",
							CampaignStatus: campaignspb.CampaignStatus_DRAFT,

							SegmentCondition: campaignspb.SegmentCondition_ALL,

							NotificationExpiration:                  -1,
							NotificationAlertOptionPushNotification: true,
						},
					},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.Duplicate(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}
		})
	}
}

func test_Archive(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = campaigns_grpc.Server{DB: db}
	)

	defer closeDB()

	type expect struct {
		exp *campaign
		err error
	}

	tests := []struct {
		name string

		req *campaignspb.ArchiveRequest
		exp *campaignspb.ArchiveResponse

		before, after *expect

		expErr error
	}{
		{
			name: "error: validation",
			req:  &campaignspb.ArchiveRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validate: auth_context: is required. account_id: is required. campaign_id: is required."),
		},

		{
			name: "error: not found",

			req: &campaignspb.ArchiveRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  404,
			},

			expErr: status.Errorf(codes.NotFound, "campaigns.UpdateStatus: db.Update: sql: no rows in result set"),
		},

		{
			name: "archives the campaign",
			req: &campaignspb.ArchiveRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  1,
			},

			before: &expect{
				exp: &campaign{
					AccountId: 1,
					Campaign: &campaignspb.Campaign{
						&campaignspb.Campaign_AutomatedNotificationCampaign{
							&campaignspb.AutomatedNotificationCampaign{
								CampaignId:       1,
								CampaignStatus:   campaignspb.CampaignStatus_DRAFT,
								Name:             "c1",
								CreatedAt:        ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt:        ts(t, "2017-05-04T16:26:25.445494+00:00"),
								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
				},
			},

			after: &expect{
				exp: &campaign{
					AccountId: 1,
					Campaign: &campaignspb.Campaign{
						&campaignspb.Campaign_AutomatedNotificationCampaign{
							&campaignspb.AutomatedNotificationCampaign{
								CampaignId:       1,
								CampaignStatus:   campaignspb.CampaignStatus_ARCHIVED,
								Name:             "c1",
								CreatedAt:        ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt:        updatedAt,
								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
				},
			},

			exp: &campaignspb.ArchiveResponse{},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				acctId = tt.req.GetAuthContext().GetAccountId()
				cId    = tt.req.CampaignId
			)

			if tt.before != nil {
				var (
					exp, expErr = tt.before.exp, tt.before.err
					got, gotErr = campaignById(context.TODO(), db, acctId, cId)
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("Before: Diff:\n%v", Difff(diff))
				}
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.Archive(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", Difff(diff))
			}

			if tt.after != nil {
				var (
					exp, expErr = tt.after.exp, tt.after.err
					got, gotErr = campaignById(context.TODO(), db, acctId, cId)
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("After: Diff:\n%v", Difff(diff))
				}
			}
		})
	}
}

func test_Publish(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = campaigns_grpc.Server{DB: db}
	)

	defer closeDB()

	type expect struct {
		exp *campaign
		err error
	}

	tests := []struct {
		name string

		req *campaignspb.PublishRequest
		exp *campaignspb.PublishResponse

		before, after *expect

		expErr error
	}{
		{
			name: "error: validation",
			req:  &campaignspb.PublishRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validate: auth_context: is required. account_id: is required. campaign_id: is required."),
		},

		{
			name: "error: not found",

			req: &campaignspb.PublishRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  404,
			},

			expErr: status.Errorf(codes.NotFound, "campaigns.UpdateStatus: db.Update: sql: no rows in result set"),
		},

		{
			name: "automated: publishes",
		},

		{
			name: "scheduled: publishes",
			req: &campaignspb.PublishRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  3,
			},

			before: &expect{
				exp: &campaign{
					AccountId: 1,
					Campaign: &campaignspb.Campaign{
						&campaignspb.Campaign_ScheduledNotificationCampaign{
							&campaignspb.ScheduledNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494Z"),
								UpdatedAt: ts(t, "2017-05-04T16:26:25.445494Z"),

								CampaignId:     3,
								CampaignStatus: campaignspb.CampaignStatus_DRAFT,
								Name:           "c3",

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,
							},
						},
					},
				},
			},

			after: &expect{
				exp: &campaign{
					AccountId: 1,
					Campaign: &campaignspb.Campaign{
						&campaignspb.Campaign_ScheduledNotificationCampaign{
							&campaignspb.ScheduledNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: updatedAt,

								CampaignId:     3,
								CampaignStatus: campaignspb.CampaignStatus_PUBLISHED,
								Name:           "c3",

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,
							},
						},
					},
				},
			},

			exp: &campaignspb.PublishResponse{},
		},

		{
			name: "error: scheduled: second publish fails",
			req: &campaignspb.PublishRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  3,
			},

			before: &expect{
				exp: &campaign{
					AccountId: 1,
					Campaign: &campaignspb.Campaign{
						&campaignspb.Campaign_ScheduledNotificationCampaign{
							&campaignspb.ScheduledNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494Z"),
								UpdatedAt: updatedAt,

								CampaignId:     3,
								CampaignStatus: campaignspb.CampaignStatus_PUBLISHED,
								Name:           "c3",

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,
							},
						},
					},
				},
			},

			after: &expect{
				exp: &campaign{
					AccountId: 1,
					Campaign: &campaignspb.Campaign{
						&campaignspb.Campaign_ScheduledNotificationCampaign{
							&campaignspb.ScheduledNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: updatedAt,

								CampaignId:     3,
								CampaignStatus: campaignspb.CampaignStatus_PUBLISHED,
								Name:           "c3",

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,
							},
						},
					},
				},
			},

			expErr: status.Errorf(codes.NotFound, "campaigns.UpdateStatus: db.Update: sql: no rows in result set"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				acctId = tt.req.GetAuthContext().GetAccountId()
				cId    = tt.req.CampaignId
			)

			if tt.before != nil {
				var (
					exp, expErr = tt.before.exp, tt.before.err
					got, gotErr = campaignById(context.TODO(), db, acctId, cId)
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("Before: Diff:\n%v", Difff(diff))
				}
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.Publish(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", Difff(diff))
			}

			if tt.after != nil {
				var (
					exp, expErr = tt.after.exp, tt.after.err
					got, gotErr = campaignById(context.TODO(), db, acctId, cId)
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("After: Diff:\n%v", Difff(diff))
				}
			}
		})
	}
}

func test_SendTest(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = campaigns_grpc.Server{DB: db}
	)

	defer closeDB()

	type expect struct {
		Tasks []*Task
		err   error
	}

	tests := []struct {
		name string

		req *campaignspb.SendTestRequest
		exp *campaignspb.SendTestResponse

		after *expect

		expErr error
	}{
		{
			name: "error: validation",
			req:  &campaignspb.SendTestRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validate: auth_context: is required. account_id: is required. campaign_id: is required."),
		},

		{
			name: "error: validation: empty device_ids",
			req: &campaignspb.SendTestRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  1,
			},

			expErr: status.Errorf(codes.InvalidArgument, "validate: device_ids: must not be empty."),
		},

		{
			name: "schedules task to publis",
			req: &campaignspb.SendTestRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  1,
				DeviceIds:   []string{"a", "b", "c"},
			},

			after: &expect{
				Tasks: []*Task{
					&Task{
						AccountId:  1,
						CampaignId: 1,

						IsTest: true,

						RunAt:     timeUpdatedAt,
						State:     "queued",
						DeviceIds: &pq.StringArray{"a", "b", "c"},
					},
				},
			},

			exp: &campaignspb.SendTestResponse{},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				acctId     = tt.req.GetAuthContext().GetAccountId()
				campaignId = tt.req.CampaignId
			)

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.SendTest(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", Difff(diff))
			}

			if tt.after != nil {
				var (
					exp, expErr = tt.after.Tasks, tt.after.err
					got, gotErr = campaignTasks(context.TODO(), db, acctId, campaignId)
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("After: Diff:\n%v", Difff(diff))
				}
			}
		})
	}
}

func test_UpdateNotificationSettings(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = campaigns_grpc.Server{DB: db}
	)

	defer closeDB()

	type expect struct {
		exp *campaign
		err error
	}

	tests := []struct {
		name string

		req *campaignspb.UpdateNotificationSettingsRequest
		exp *campaignspb.UpdateNotificationSettingsResponse

		before *expect

		expErr error
	}{
		{
			name: "error: validation",
			req:  &campaignspb.UpdateNotificationSettingsRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validate: auth_context: is required. account_id: is required. campaign_id: is required."),
		},

		{
			name: "error: not found",

			req: &campaignspb.UpdateNotificationSettingsRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  404,
			},

			expErr: status.Errorf(codes.NotFound, "campaigns.OneById: db.Get: sql: no rows in result set"),
		},

		{
			name: "updates the campaign",
			req: &campaignspb.UpdateNotificationSettingsRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  2,

				UiState:                                   "this is my state",
				NotificationBody:                          "body",
				NotificationTitle:                         "title",
				NotificationAttachmentUrl:                 "https://www.rover.io/logo.png",
				NotificationAttachmentType:                campaignspb.NotificationAttachmentType_IMAGE,
				NotificationTapBehaviorType:               campaignspb.NotificationTapBehaviorType_OPEN_APP,
				NotificationTapBehaviorPresentationType:   campaignspb.NotificationTapPresentationType_UNKNOWN,
				NotificationTapBehaviorUrl:                "https://google.ca",
				NotificationIosContentAvailable:           false,
				NotificationIosMutableContent:             false,
				NotificationIosSound:                      "default",
				NotificationIosCategoryIdentifier:         "ios-id",
				NotificationIosThreadIdentifier:           "ios-thread-id",
				NotificationAndroidChannelId:              "android-channel-id",
				NotificationAndroidSound:                  "default",
				NotificationAndroidTag:                    "android-tag",
				NotificationExpiration:                    3600,
				NotificationAttributes:                    map[string]string{"my-custom-attr": "hi"},
				NotificationAlertOptionPushNotification:   true,
				NotificationAlertOptionNotificationCenter: true,
				NotificationAlertOptionBadgeNumber:        false,
			},

			before: &expect{
				exp: &campaign{
					AccountId: 1,
					Campaign: &campaignspb.Campaign{
						Campaign: &campaignspb.Campaign_AutomatedNotificationCampaign{
							AutomatedNotificationCampaign: &campaignspb.AutomatedNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

								CampaignId: 2,
								// CampaignType:     int32(campaignspb.CampaignType_AUTOMATED_NOTIFICATION),
								CampaignStatus:   campaignspb.CampaignStatus_DRAFT,
								Name:             "c2",
								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
				},
			},

			exp: &campaignspb.UpdateNotificationSettingsResponse{
				Campaign: &campaignspb.Campaign{
					Campaign: &campaignspb.Campaign_AutomatedNotificationCampaign{
						AutomatedNotificationCampaign: &campaignspb.AutomatedNotificationCampaign{
							CampaignId:       2,
							CampaignStatus:   campaignspb.CampaignStatus_DRAFT,
							Name:             "c2",
							CreatedAt:        ts(t, "2017-05-04T16:26:25.445494+00:00"),
							UpdatedAt:        updatedAt,
							SegmentCondition: campaignspb.SegmentCondition_ALL,

							UiState: "this is my state",

							NotificationBody:                          "body",
							NotificationTitle:                         "title",
							NotificationAttachmentUrl:                 "https://www.rover.io/logo.png",
							NotificationAttachmentType:                campaignspb.NotificationAttachmentType_IMAGE,
							NotificationTapBehaviorType:               campaignspb.NotificationTapBehaviorType_OPEN_APP,
							NotificationTapBehaviorPresentationType:   campaignspb.NotificationTapPresentationType_UNKNOWN,
							NotificationTapBehaviorUrl:                "https://google.ca",
							NotificationIosContentAvailable:           false,
							NotificationIosMutableContent:             false,
							NotificationIosSound:                      "default",
							NotificationIosCategoryIdentifier:         "ios-id",
							NotificationIosThreadIdentifier:           "ios-thread-id",
							NotificationAndroidChannelId:              "android-channel-id",
							NotificationAndroidSound:                  "default",
							NotificationAndroidTag:                    "android-tag",
							NotificationExpiration:                    3600,
							NotificationAttributes:                    map[string]string{"my-custom-attr": "hi"},
							NotificationAlertOptionPushNotification:   true,
							NotificationAlertOptionNotificationCenter: true,
							NotificationAlertOptionBadgeNumber:        false,

							AutomatedMonday:    true,
							AutomatedTuesday:   true,
							AutomatedWednesday: true,
							AutomatedThursday:  true,
							AutomatedFriday:    true,
							AutomatedSaturday:  true,
							AutomatedSunday:    true,

							AutomatedFrequencySingleUse: true,
						},
					},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				acctId = tt.req.GetAuthContext().GetAccountId()
				cId    = tt.req.CampaignId
			)

			if tt.before != nil {
				var (
					exp, expErr = tt.before.exp, tt.before.err
					got, gotErr = campaignById(context.TODO(), db, acctId, cId)
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("Before: Diff:\n%v", Difff(diff))
				}
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.UpdateNotificationSettings(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", Difff(diff))
			}
		})
	}
}

func test_UpdateAutomatedDeliverySettings(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = campaigns_grpc.Server{DB: db}
	)

	defer closeDB()

	type expect struct {
		exp *campaign
		err error
	}

	tests := []struct {
		name string

		req *campaignspb.UpdateAutomatedDeliverySettingsRequest
		exp *campaignspb.UpdateAutomatedDeliverySettingsResponse

		before *expect

		expErr error
	}{
		{
			name: "error: validation",
			req:  &campaignspb.UpdateAutomatedDeliverySettingsRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validate: auth_context: is required. account_id: is required. campaign_id: is required."),
		},

		{
			name: "error: not found",

			req: &campaignspb.UpdateAutomatedDeliverySettingsRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  404,
			},

			expErr: status.Errorf(codes.NotFound, "campaigns.UpdateAutomatedDeliverySettings: rows.Next: sql: no rows in result set"),
		},

		{
			name: "updates the delivery settings",
			req: &campaignspb.UpdateAutomatedDeliverySettingsRequest{
				AuthContext: &auth.AuthContext{AccountId: 2},
				CampaignId:  4,

				UiState: `{"progress_percentage": 90}`,

				SegmentCondition: campaignspb.SegmentCondition_ALL,
				SegmentIds:       []string{"1", "2", "3"},

				AutomatedMonday:    true,
				AutomatedTuesday:   true,
				AutomatedWednesday: true,
				AutomatedThursday:  true,
				AutomatedFriday:    true,
				AutomatedSaturday:  true,
				AutomatedSunday:    true,

				AutomatedStartDate: "2018-01-01",
				AutomatedEndDate:   "2019-01-01",

				AutomatedStartTime: 1,
				AutomatedEndTime:   2,

				AutomatedTimeZone:           "America/Toronto",
				AutomatedUseLocalDeviceTime: true,

				AutomatedEventName: "test event",
				AutomatedEventPredicates: &predicates.PredicateAggregate{
					Condition: predicates.PredicateAggregate_ALL,
					Predicates: []*predicates.Predicate{
						{
							Value: &predicates.Predicate_StringPredicate{
								StringPredicate: &predicates.StringPredicate{
									Selector:      "profile",
									AttributeName: "hello",
									Op:            predicates.StringPredicate_CONTAINS,
									Value:         "ello",
								},
							},
						},
					},
				},

				AutomatedFrequencySingleUse: true,
				AutomatedFrequencyLimits: []*campaignspb.RateLimit{
					{
						IntervalUnit: campaignspb.RateLimit_DAY,
					},
				},
			},

			before: &expect{
				exp: &campaign{
					AccountId: 2,
					Campaign: &campaignspb.Campaign{
						Campaign: &campaignspb.Campaign_AutomatedNotificationCampaign{
							AutomatedNotificationCampaign: &campaignspb.AutomatedNotificationCampaign{
								CampaignId:     4,
								CampaignStatus: campaignspb.CampaignStatus_DRAFT,
								Name:           "c4",
								CreatedAt:      ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt:      ts(t, "2017-05-04T16:26:25.445494+00:00"),

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								AutomatedMonday:    true,
								AutomatedTuesday:   true,
								AutomatedWednesday: true,
								AutomatedThursday:  true,
								AutomatedFriday:    true,
								AutomatedSaturday:  true,
								AutomatedSunday:    true,

								AutomatedFrequencySingleUse: true,
							},
						},
					},
				},
			},

			exp: &campaignspb.UpdateAutomatedDeliverySettingsResponse{
				Campaign: &campaignspb.Campaign{
					Campaign: &campaignspb.Campaign_AutomatedNotificationCampaign{
						AutomatedNotificationCampaign: &campaignspb.AutomatedNotificationCampaign{
							CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
							UpdatedAt: updatedAt,

							CampaignId:     4,
							CampaignStatus: campaignspb.CampaignStatus_DRAFT,
							Name:           "c4",

							UiState: `{"progress_percentage": 90}`,

							SegmentCondition: campaignspb.SegmentCondition_ALL,
							SegmentIds:       []string{"1", "2", "3"},

							NotificationExpiration:                  -1,
							NotificationAlertOptionPushNotification: true,

							AutomatedMonday:    true,
							AutomatedTuesday:   true,
							AutomatedWednesday: true,
							AutomatedThursday:  true,
							AutomatedFriday:    true,
							AutomatedSaturday:  true,
							AutomatedSunday:    true,

							AutomatedStartDate:          "2018-01-01",
							AutomatedEndDate:            "2019-01-01",
							AutomatedStartTime:          1,
							AutomatedEndTime:            2,
							AutomatedTimeZone:           "America/Toronto",
							AutomatedUseLocalDeviceTime: true,
							AutomatedEventName:          "test event",

							AutomatedEventPredicates: &predicates.PredicateAggregate{
								Condition: predicates.PredicateAggregate_ALL,
								Predicates: []*predicates.Predicate{
									{
										Value: &predicates.Predicate_StringPredicate{
											StringPredicate: &predicates.StringPredicate{
												Selector:      "profile",
												AttributeName: "hello",
												Op:            predicates.StringPredicate_CONTAINS,
												Value:         "ello",
											},
										},
									},
								},
							},

							AutomatedFrequencySingleUse: true,
							AutomatedFrequencyLimits: []*campaignspb.RateLimit{
								{
									IntervalUnit: campaignspb.RateLimit_DAY,
								},
							},
						},
					},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				cId    = tt.req.CampaignId
				acctId = tt.req.GetAuthContext().GetAccountId()
			)

			if tt.before != nil {
				var (
					exp, expErr = tt.before.exp, tt.before.err
					got, gotErr = campaignById(context.TODO(), db, acctId, cId)
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("Before: Diff:\n%v", Difff(diff))
				}
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.UpdateAutomatedDeliverySettings(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", Difff(diff))
			}
		})
	}
}

func test_UpdateScheduledDeliverySettings(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = campaigns_grpc.Server{
			DB: db,
		}
	)

	defer closeDB()

	type expect struct {
		Campaign *campaign
		err      error
	}

	tests := []struct {
		name string

		req *campaignspb.UpdateScheduledDeliverySettingsRequest
		exp *campaignspb.UpdateScheduledDeliverySettingsResponse

		before *expect

		expErr error
	}{
		{
			name: "error: validation",
			req:  &campaignspb.UpdateScheduledDeliverySettingsRequest{},

			expErr: status.Errorf(codes.InvalidArgument, "validate: auth_context: is required. account_id: is required. campaign_id: is required."),
		},

		{
			name: "error: not found",

			req: &campaignspb.UpdateScheduledDeliverySettingsRequest{
				AuthContext: &auth.AuthContext{AccountId: 1},
				CampaignId:  404,
			},

			expErr: status.Errorf(codes.NotFound, "campaigns.OneById: db.Get: sql: no rows in result set"),
		},

		{
			name: "error: status=archived: update denied",

			req: &campaignspb.UpdateScheduledDeliverySettingsRequest{
				AuthContext: &auth.AuthContext{AccountId: 2},
				CampaignId:  9,
			},

			expErr: status.Errorf(codes.FailedPrecondition, "CampaignStatus: ARCHIVED"),
		},

		{
			name: "draft: updates the delivery settings",
			req: &campaignspb.UpdateScheduledDeliverySettingsRequest{
				AuthContext: &auth.AuthContext{AccountId: 2},
				CampaignId:  5,

				SegmentIds:       []string{"1", "2"},
				SegmentCondition: campaignspb.SegmentCondition_ALL,

				UiState: `{"hello": "world"}`,

				ScheduledType:               campaignspb.ScheduledType_SCHEDULED,
				ScheduledDate:               &campaignspb.Date{Year: 2017, Month: 5, Day: 4},
				ScheduledTime:               &wrappers.Int32Value{Value: 59185},
				ScheduledTimeZone:           "America/Toronto",
				ScheduledUseLocalDeviceTime: true,
			},

			before: &expect{
				Campaign: &campaign{
					AccountId: 2,
					Campaign: &campaignspb.Campaign{
						Campaign: &campaignspb.Campaign_ScheduledNotificationCampaign{
							ScheduledNotificationCampaign: &campaignspb.ScheduledNotificationCampaign{
								CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
								UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

								CampaignId:     5,
								CampaignStatus: campaignspb.CampaignStatus_DRAFT,
								Name:           "c5",

								SegmentCondition: campaignspb.SegmentCondition_ALL,

								NotificationExpiration:                  -1,
								NotificationAlertOptionPushNotification: true,

								ScheduledType: campaignspb.ScheduledType_NOW,
							},
						},
					},
				},
			},

			exp: &campaignspb.UpdateScheduledDeliverySettingsResponse{

				Campaign: &campaignspb.Campaign{
					Campaign: &campaignspb.Campaign_ScheduledNotificationCampaign{
						ScheduledNotificationCampaign: &campaignspb.ScheduledNotificationCampaign{
							CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
							UpdatedAt: updatedAt,

							CampaignId:     5,
							CampaignStatus: campaignspb.CampaignStatus_DRAFT,
							Name:           "c5",

							SegmentIds:       []string{"1", "2"},
							SegmentCondition: campaignspb.SegmentCondition_ALL,

							UiState: `{"hello": "world"}`,

							NotificationExpiration:                  -1,
							NotificationAlertOptionPushNotification: true,

							ScheduledType:               campaignspb.ScheduledType_SCHEDULED,
							ScheduledTimeZone:           "America/Toronto",
							ScheduledDate:               &campaignspb.Date{Year: 2017, Month: 5, Day: 4},
							ScheduledTime:               &wrappers.Int32Value{Value: 59185},
							ScheduledUseLocalDeviceTime: true,
						},
					},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				cId    = tt.req.CampaignId
				acctId = tt.req.GetAuthContext().GetAccountId()
			)

			if tt.before != nil {
				var (
					exp, expErr = tt.before.Campaign, tt.before.err
					got, gotErr = campaignById(context.TODO(), db, acctId, cId)
				)

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("Before: Diff:\n%v", Difff(diff))
				}
			}

			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = svc.UpdateScheduledDeliverySettings(ctx, tt.req)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", Difff(diff))
			}
		})
	}
}

func test_UpdateScheduledDeliverySettings_Published(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
		svc         = campaigns_grpc.Server{
			DB: db,
		}
	)

	defer closeDB()

	type expect struct {
		Campaign *campaignspb.Campaign
		Tasks    []*Task
		Err      error
	}

	tests := []struct {
		name string

		req    *campaignspb.UpdateScheduledDeliverySettingsRequest
		expErr error

		before, after *expect
	}{

		{
			name: "use_local_device_time=false, sheduled_type=scheduled: updates the timestamp",
			req: &campaignspb.UpdateScheduledDeliverySettingsRequest{
				AuthContext: &auth.AuthContext{AccountId: 2},
				CampaignId:  8,

				ScheduledType: campaignspb.ScheduledType_SCHEDULED,
				// ScheduledTimestamp:          ts(t, "2017-05-04T16:26:25.445494+00:00"),
				ScheduledTime:               &wrappers.Int32Value{Value: 16*3600 + 26*60 + 25},
				ScheduledDate:               &campaignspb.Date{Day: 04, Month: 05, Year: 2017},
				ScheduledTimeZone:           "America/Toronto",
				ScheduledUseLocalDeviceTime: false,
			},

			after: &expect{
				Campaign: &campaignspb.Campaign{
					Campaign: &campaignspb.Campaign_ScheduledNotificationCampaign{
						ScheduledNotificationCampaign: &campaignspb.ScheduledNotificationCampaign{
							CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
							UpdatedAt: updatedAt,

							CampaignId:     8,
							CampaignStatus: campaignspb.CampaignStatus_PUBLISHED,
							Name:           "c8",

							NotificationExpiration:                  -1,
							NotificationAlertOptionPushNotification: true,

							ScheduledType:     campaignspb.ScheduledType_SCHEDULED,
							ScheduledTimeZone: "America/Toronto",
							// ScheduledTimestamp: ts(t, "2017-05-04T16:26:25.445494Z"),
							ScheduledTime: &wrappers.Int32Value{Value: 16*3600 + 26*60 + 25},
							ScheduledDate: &campaignspb.Date{Day: 04, Month: 05, Year: 2017},
						},
					},
				},

				Tasks: []*Task{
					{
						AccountId:  2,
						CampaignId: 8,
						DeviceIds:  nil,
						RunAt:      ts2(t, "2017-05-04T16:26:25.000000-04:00"),
						State:      "queued",
					},
				},
			},
		},

		{
			name: "use_local_device_time=false, sheduled_type=now: updates the timestamp",
			req: &campaignspb.UpdateScheduledDeliverySettingsRequest{
				AuthContext: &auth.AuthContext{AccountId: 2},
				CampaignId:  8,

				ScheduledType:               campaignspb.ScheduledType_NOW,
				ScheduledTimeZone:           "America/Toronto",
				ScheduledUseLocalDeviceTime: false,
			},

			after: &expect{
				Campaign: &campaignspb.Campaign{
					Campaign: &campaignspb.Campaign_ScheduledNotificationCampaign{
						ScheduledNotificationCampaign: &campaignspb.ScheduledNotificationCampaign{
							CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
							UpdatedAt: updatedAt,

							CampaignId:     8,
							CampaignStatus: campaignspb.CampaignStatus_PUBLISHED,
							Name:           "c8",

							NotificationExpiration:                  -1,
							NotificationAlertOptionPushNotification: true,

							ScheduledType:     campaignspb.ScheduledType_NOW,
							ScheduledTimeZone: "America/Toronto",
							// ScheduledTimestamp:          nil,
							ScheduledUseLocalDeviceTime: false,
						},
					},
				},

				Tasks: []*Task{
					{
						AccountId:  2,
						CampaignId: 8,
						DeviceIds:  nil,
						RunAt:      timeUpdatedAt,
						State:      "queued",
					},
				},
			},
		},

		{
			name: "use_local_device_time=true: scheduled_type=now: creates task scheduled for NOW",
			req: &campaignspb.UpdateScheduledDeliverySettingsRequest{
				AuthContext: &auth.AuthContext{AccountId: 2},
				CampaignId:  8,

				ScheduledType:     campaignspb.ScheduledType_NOW,
				ScheduledTimeZone: "America/Toronto",
			},

			after: &expect{
				Campaign: &campaignspb.Campaign{
					Campaign: &campaignspb.Campaign_ScheduledNotificationCampaign{
						ScheduledNotificationCampaign: &campaignspb.ScheduledNotificationCampaign{
							CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
							UpdatedAt: updatedAt,

							CampaignId:     8,
							CampaignStatus: campaignspb.CampaignStatus_PUBLISHED,
							Name:           "c8",

							NotificationExpiration:                  -1,
							NotificationAlertOptionPushNotification: true,

							ScheduledType:     campaignspb.ScheduledType_NOW,
							ScheduledTimeZone: "America/Toronto",
							// ScheduledTimestamp:          nil,
						},
					},
				},

				Tasks: []*Task{
					{
						AccountId:  2,
						CampaignId: 8,
						DeviceIds:  nil,
						RunAt:      timeUpdatedAt,
						State:      "queued",
					},
				},
			},
		},

		{
			name: "use_local_device_time=true, scheduled_type=scheduled: creates tasks scheduled for ScheduledTimestamp",
			req: &campaignspb.UpdateScheduledDeliverySettingsRequest{
				AuthContext: &auth.AuthContext{AccountId: 2},
				CampaignId:  8,

				ScheduledType:               campaignspb.ScheduledType_SCHEDULED,
				ScheduledTimeZone:           "America/Toronto",
				ScheduledUseLocalDeviceTime: true,
				// ScheduledTimestamp:          ts(t, "2017-05-04T16:26:25.445494Z"),
				ScheduledTime: &wrappers.Int32Value{Value: 16*3600 + 26*60 + 25},
				ScheduledDate: &campaignspb.Date{Day: 04, Month: 05, Year: 2017},
			},

			after: &expect{
				Campaign: &campaignspb.Campaign{
					Campaign: &campaignspb.Campaign_ScheduledNotificationCampaign{
						ScheduledNotificationCampaign: &campaignspb.ScheduledNotificationCampaign{
							CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
							UpdatedAt: updatedAt,

							Name:           "c8",
							CampaignId:     8,
							CampaignStatus: campaignspb.CampaignStatus_PUBLISHED,

							NotificationExpiration:                  -1,
							NotificationAlertOptionPushNotification: true,

							ScheduledType:               campaignspb.ScheduledType_SCHEDULED,
							ScheduledTimeZone:           "America/Toronto",
							ScheduledUseLocalDeviceTime: true,
							// ScheduledTimestamp:          ts(t, "2017-05-04T16:26:25.445494Z"),
							ScheduledTime: &wrappers.Int32Value{Value: 16*3600 + 26*60 + 25},
							ScheduledDate: &campaignspb.Date{Day: 04, Month: 05, Year: 2017},
						},
					},
				},

				// TODO: will this break once DST is over?
				// note hardcoded -04:00 tz
				Tasks: tasksInTimezones(ts2(t, "2017-05-04T16:26:25.000000-04:00").UTC(), zoneinfo.UniqueOffsets, 2, 8),
			},
		},

		{
			name: "use_local_device_time=false: deletes in timezone and creates single task",
			req: &campaignspb.UpdateScheduledDeliverySettingsRequest{
				AuthContext: &auth.AuthContext{AccountId: 2},
				CampaignId:  8,

				ScheduledType:               campaignspb.ScheduledType_SCHEDULED,
				ScheduledTimeZone:           "America/Toronto",
				ScheduledUseLocalDeviceTime: false,
				// ScheduledTimestamp:          ts(t, "2017-05-04T16:26:25.445494Z"),
				ScheduledTime: &wrappers.Int32Value{Value: 16*3600 + 26*60 + 25},
				ScheduledDate: &campaignspb.Date{Day: 04, Month: 05, Year: 2017},
			},

			after: &expect{
				Campaign: &campaignspb.Campaign{
					Campaign: &campaignspb.Campaign_ScheduledNotificationCampaign{
						ScheduledNotificationCampaign: &campaignspb.ScheduledNotificationCampaign{
							CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
							UpdatedAt: updatedAt,

							Name:           "c8",
							CampaignId:     8,
							CampaignStatus: campaignspb.CampaignStatus_PUBLISHED,

							NotificationExpiration:                  -1,
							NotificationAlertOptionPushNotification: true,

							ScheduledType:               campaignspb.ScheduledType_SCHEDULED,
							ScheduledTimeZone:           "America/Toronto",
							ScheduledUseLocalDeviceTime: false,
							// ScheduledTimestamp:          ts(t, "2017-05-04T16:26:25.445494Z"),
							ScheduledTime: &wrappers.Int32Value{Value: 16*3600 + 26*60 + 25},
							ScheduledDate: &campaignspb.Date{Day: 04, Month: 05, Year: 2017},
						},
					},
				},

				Tasks: []*Task{
					{
						AccountId:      2,
						CampaignId:     8,
						RunAt:          ts2(t, "2017-05-04T16:26:25.000000-04:00"),
						State:          "queued",
						TimezoneOffset: 0,
					},
				},
			},
		},
	}

	_, err := svc.Publish(ctx, &campaignspb.PublishRequest{
		AuthContext: &auth.AuthContext{AccountId: 2},
		CampaignId:  8,
	})

	if err != nil {
		t.Fatal("Publish:", err)
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.req == nil {
				t.Skip("TODO")
			}

			var (
				campaignId = tt.req.CampaignId
				acctId     = tt.req.GetAuthContext().GetAccountId()

				check = func(stage string, exp *expect) {
					var (
						got = &expect{}
						err error
						c   *campaign
					)
					c, err = campaignById(context.TODO(), db, acctId, campaignId)
					if err != nil {
						t.Fatal(err)
					}

					got.Campaign = c.Campaign

					got.Tasks, err = campaignTasks(context.TODO(), db, acctId, campaignId)
					if err != nil {
						t.Fatal(err)
					}

					if diff := Diff(exp, got, nil, nil); diff != nil {
						t.Errorf(stage+":Diff:\n%v", Difff(diff))
					}
				}
			)

			if tt.before != nil {
				check("Before", tt.before)
			}

			var (
				expErr    = tt.expErr
				_, gotErr = svc.UpdateScheduledDeliverySettings(ctx, tt.req)
			)

			if diff := Diff(nil, nil, expErr, gotErr); diff != nil {
				t.Errorf("Diff:\n%v", Difff(diff))
			}

			if tt.after != nil {
				check("After", tt.after)
			}
		})
	}
}

func test_LoadCampaign(t *testing.T) {
	var (
		ctx         = context.Background()
		db, closeDB = dbOpen(t, tCfg.DSN)
	)

	defer closeDB()

	type req struct{ accountId, campaignId int32 }

	tests := []struct {
		desc string

		req req
		exp *campaign

		expErr error
	}{
		{
			desc: "loads the scheduled campaign",

			req: req{2, 1000},
			exp: &campaign{
				AccountId: 2,
				Campaign: &campaignspb.Campaign{
					Campaign: &campaignspb.Campaign_ScheduledNotificationCampaign{
						ScheduledNotificationCampaign: &campaignspb.ScheduledNotificationCampaign{
							CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
							UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

							CampaignId: 1000,

							Name: "c10",

							CampaignStatus: campaignspb.CampaignStatus_DRAFT,

							SegmentCondition: campaignspb.SegmentCondition_ALL,
							SegmentIds:       []string{"1", "2", "3"},

							UiState: `{"progres_percentage": 90}`,

							ExperienceId:     "123455",
							NotificationBody: "notification body",

							NotificationTitle: "notification title",

							NotificationAttachmentUrl:   "http://example.com/id.png",
							NotificationAttachmentType:  campaignspb.NotificationAttachmentType_IMAGE,
							NotificationTapBehaviorType: campaignspb.NotificationTapBehaviorType_OPEN_APP,
							NotificationTapBehaviorUrl:  "http://rover.io/homepage",

							NotificationTapBehaviorPresentationType: campaignspb.NotificationTapPresentationType_IN_APP,
							NotificationIosContentAvailable:         true,

							NotificationIosMutableContent:     true,
							NotificationIosSound:              "none",
							NotificationIosCategoryIdentifier: "advertizing",
							NotificationIosThreadIdentifier:   "12345",

							NotificationAndroidChannelId: "12345",
							NotificationAndroidSound:     "none",
							NotificationAndroidTag:       "a tag",

							NotificationExpiration: 3600,
							NotificationAttributes: map[string]string{
								"a": "b",
								"c": "d",
							},

							NotificationAlertOptionPushNotification:   true,
							NotificationAlertOptionNotificationCenter: true,
							NotificationAlertOptionBadgeNumber:        true,

							ScheduledType: campaignspb.ScheduledType_SCHEDULED,
							ScheduledDate: &campaignspb.Date{
								Year:  2017,
								Month: 5,
								Day:   4,
							},
							ScheduledTime:               &wrappers.Int32Value{Value: 66819},
							ScheduledTimeZone:           "America/Toronto",
							ScheduledUseLocalDeviceTime: true,
							ScheduledDeliveryStatus:     0,
						},
					},
				},
			},
		},

		{
			desc: "loads the automated campaign",

			req: req{2, 1001},
			exp: &campaign{
				AccountId: 2,
				Campaign: &campaignspb.Campaign{
					Campaign: &campaignspb.Campaign_AutomatedNotificationCampaign{
						AutomatedNotificationCampaign: &campaignspb.AutomatedNotificationCampaign{
							CreatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),
							UpdatedAt: ts(t, "2017-05-04T16:26:25.445494+00:00"),

							CampaignId: 1001,

							Name: "c10",

							CampaignStatus: campaignspb.CampaignStatus_DRAFT,

							SegmentCondition: campaignspb.SegmentCondition_ALL,
							SegmentIds:       []string{"1", "2", "3"},

							UiState: `{"progres_percentage": 90}`,

							ExperienceId:     "123455",
							NotificationBody: "notification body",

							NotificationTitle: "notification title",

							NotificationAttachmentUrl:   "http://example.com/id.png",
							NotificationAttachmentType:  campaignspb.NotificationAttachmentType_IMAGE,
							NotificationTapBehaviorType: campaignspb.NotificationTapBehaviorType_OPEN_APP,
							NotificationTapBehaviorUrl:  "http://rover.io/homepage",

							NotificationTapBehaviorPresentationType: campaignspb.NotificationTapPresentationType_IN_APP,
							NotificationIosContentAvailable:         true,

							NotificationIosMutableContent:     true,
							NotificationIosSound:              "none",
							NotificationIosCategoryIdentifier: "advertizing",
							NotificationIosThreadIdentifier:   "12345",

							NotificationAndroidChannelId: "12345",
							NotificationAndroidSound:     "none",
							NotificationAndroidTag:       "a tag",

							NotificationExpiration: 3600,
							NotificationAttributes: map[string]string{
								"a": "b",
								"c": "d",
							},

							NotificationAlertOptionPushNotification:   true,
							NotificationAlertOptionNotificationCenter: true,
							NotificationAlertOptionBadgeNumber:        true,

							AutomatedMonday:    true,
							AutomatedTuesday:   true,
							AutomatedWednesday: true,
							AutomatedThursday:  true,
							AutomatedFriday:    true,
							AutomatedSaturday:  true,
							AutomatedSunday:    true,

							AutomatedStartDate:          "2018-01-01",
							AutomatedEndDate:            "2019-01-01",
							AutomatedStartTime:          1,
							AutomatedEndTime:            2,
							AutomatedTimeZone:           "America/Toronto",
							AutomatedUseLocalDeviceTime: true,
							AutomatedEventName:          "an event",

							AutomatedFrequencySingleUse: true,

							AutomatedFrequencyLimits: []*campaignspb.RateLimit{
								{
									Limit:         1,
									IntervalCount: 60,
									IntervalUnit:  campaignspb.RateLimit_HOUR,
								},
								{
									Limit:         10,
									IntervalCount: 60,
									IntervalUnit:  campaignspb.RateLimit_DAY,
								},
							},
						},
					},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.desc, func(t *testing.T) {
			var (
				exp, expErr = tt.exp, tt.expErr
				got, gotErr = campaignById(ctx, db, tt.req.accountId, tt.req.campaignId)
			)

			if diff := Diff(exp, got, expErr, gotErr); diff != nil {
				t.Fatalf("\nDiff:\n%v", Difff(diff))
			}
		})
	}
}

// a helper type to also ensure proper AccountId
type campaign struct {
	AccountId int32
	*campaignspb.Campaign
}

// campaignById is a helper to return helper campaign value
// the reason to have this helper is because there's no public API that returns single campaignspb.Campaign
func campaignById(ctx context.Context, db *db.DB, accountId, campaignId int32) (*campaign, error) {
	c, err := db.CampaignsStore().OneById(ctx, accountId, campaignId)
	if err != nil {
		return nil, err
	}

	var got campaignspb.Campaign
	if err = campaigns_grpc.CampaignToProto(c, &got); err != nil {
		return nil, err
	}

	return &campaign{
		AccountId: c.AccountId,
		Campaign:  &got,
	}, nil
}

// campaignById is a helper to return helper campaign value
// the reason to have this helper is because there's no public API that returns single campaignspb.Campaign
func campaignTasks(ctx context.Context, db *db.DB, accountId, campaignId int32) ([]*Task, error) {
	tasks, err := db.ScheduledTasksStore().ListByCampaignId(ctx, int64(accountId), int64(campaignId))
	if err != nil {
		return nil, err
	}

	for i := range tasks {
		// unpredictable
		tasks[i].JobId = 0
	}

	return tasks, nil
}

func tasksInTimezones(runAt time.Time, offsets []int, acctId, campaignId int32) []*Task {
	var tasks []*Task
	for _, offset := range offsets {

		tasks = append(tasks, &Task{
			AccountId:  int(acctId),
			CampaignId: int(campaignId),

			JobId: 0, //
			State: "queued",

			TimezoneOffset: int(offset),
			RunAt:          runAt.Add(-time.Duration(offset) * time.Second),
		})
	}

	return tasks
}
