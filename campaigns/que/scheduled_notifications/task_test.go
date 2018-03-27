package scheduled_notifications_test

import (
	"fmt"
	"testing"
	"time"

	"github.com/jackc/pgx"
	"github.com/namsral/flag"

	"github.com/roverplatform/rover/campaigns/db"
	"github.com/roverplatform/rover/campaigns/db/testdb"
	sn "github.com/roverplatform/rover/campaigns/que/scheduled_notifications"
	rtesting "github.com/roverplatform/rover/go/testing"
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
)

func init() {
	flag.StringVar(&tCfg.DSN, "test-db-dsn", ``, "test DSN")

	flag.StringVar(&tCfg.fixtures.Path, "fixtures-path", `../db/testdata/fixtures.sql`, "path to migrations")

	flag.StringVar(&tCfg.migration.Path, "migration-path", `../../db/migrations`, "path to migrations")
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

func TestTask(t *testing.T) {
	t.Logf("Config: %v", tCfg)
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

	tDb.Exec("TRUNCATE TABLE scheduled_notification_tasks")

	t.Run("ScheduledNotificationTask", test_ScheduledNotificationTask)
}

func test_ScheduledNotificationTask(t *testing.T) {
	pgxcfg, err := pgx.ParseURI(tCfg.DSN)
	if err != nil {
		t.Fatal("pgx.ParseURI:", err)
	}

	pgpool, err := pgx.NewConnPool(pgx.ConnPoolConfig{ConnConfig: pgxcfg})

	if err != nil {
		t.Fatal("pgx.NewConnPool:", err)
	}

	defer pgpool.Close()

	if err := sn.PrepareStatements(pgpool); err != nil {
		t.Fatal("PrepareStatements:", err)
	}

	t.Run("No Tasks", func(t *testing.T) {
		j, err := sn.LockOne(pgpool)
		if err != nil {
			t.Fatal("LockOne:", err)
		}

		if j != nil {
			t.Fatalf("Unexpected Task")
		}
	})

	createdAt, err := time.Parse(time.RFC3339, "2017-05-04T16:26:25.445494Z")
	if err != nil {
		t.Fatal("time.Parse", err)
	}

	t.Run("Submit task", func(t *testing.T) {

		var tt = sn.Task{
			State:            string(sn.TaskStateQueued),
			RunAt:            createdAt,
			NumberOfAttempts: 0,
			Error:            "error",

			Forked:         false,
			ScrollId:       "scroll_id",
			CampaignId:     1,
			AccountId:      2,
			DeviceIds:      []string{"1", "2", "3"},
			TimezoneOffset: 10,
		}

		_, err := pgpool.Exec("insertSNT",
			tt.State,
			tt.RunAt,
			tt.NumberOfAttempts,
			tt.Error,

			tt.Forked,
			tt.ScrollId,
			tt.CampaignId,
			tt.DeviceIds,
			tt.TimezoneOffset,
			tt.AccountId,
		)

		if err != nil {
			t.Fatal(err)
		}
	})

	t.Run("Locks Inserted Task", func(t *testing.T) {
		j, err := sn.LockOne(pgpool)
		if err != nil {
			t.Fatal("LockOne:", err)
		}

		if j == nil {
			t.Fatalf("Expected Task")
		}

		// release task
		defer j.Done()

		t.Run("Doesn't lock already locked", func(t *testing.T) {
			j, err := sn.LockOne(pgpool)
			if err != nil {
				t.Fatal("LockOne:", err)
			}

			if j != nil {
				t.Fatalf("UnExpected Task")
			}
		})

		var (
			got = j
			exp = &sn.Task{
				ID:               j.ID,
				State:            "queued",
				RunAt:            createdAt,
				NumberOfAttempts: 0,
				Error:            "error",

				Forked:         false,
				ScrollId:       "scroll_id",
				CampaignId:     1,
				AccountId:      2,
				DeviceIds:      []string{"1", "2", "3"},
				TimezoneOffset: 10,
			}
		)

		if diff := Diff(exp, got, nil, nil); diff != nil {
			t.Fatal("Diff:\n", Difff(diff))
		}

		t.Run("Forks child", func(t *testing.T) {
			childId, err := j.Fork("next_scroll_id")
			if err != nil {
				t.Fatal(err)
			}

			var (
				got = fetchTask(t, pgpool, childId)

				exp = &sn.Task{
					ID:               childId,
					State:            "queued",
					RunAt:            createdAt,
					NumberOfAttempts: 0,
					Error:            "",

					Forked:         false,
					ScrollId:       "next_scroll_id",
					CampaignId:     1,
					AccountId:      2,
					DeviceIds:      nil,
					TimezoneOffset: 10,
				}
			)

			if diff := Diff(exp, got, nil, nil); diff != nil {
				t.Fatal("Diff:\n", Difff(diff))
			}
		})

		t.Run("SetState", func(t *testing.T) {
			if err := j.SetState(sn.TaskStateInProgress); err != nil {
				t.Fatal(err)
			}
		})

		// setError changes run_at time so no updates will be performed after
		t.Run("SetError", func(t *testing.T) {
			if err := j.SetError("another error"); err != nil {
				t.Fatal(err)
			}
		})

		t.Run("verify error", func(t *testing.T) {
			var (
				got = fetchTask(t, pgpool, j.ID)

				exp = &sn.Task{
					ID:               j.ID,
					State:            "inprogress",
					RunAt:            got.RunAt,
					NumberOfAttempts: 1,
					Error:            "another error",

					Forked:         true,
					ScrollId:       "scroll_id",
					CampaignId:     1,
					AccountId:      2,
					DeviceIds:      []string{"1", "2", "3"},
					TimezoneOffset: 10,
				}
			)

			if diff := Diff(exp, got, nil, nil); diff != nil {
				t.Fatalf("Diff:\n%v", Difff(diff))
			}
		})

		t.Run("state=failed", func(t *testing.T) {
			for i := 0; j.NumberOfAttempts < sn.MaxAttempts; i += 1 {
				if err := j.SetError(fmt.Sprintf("error %d", j.NumberOfAttempts+1)); err != nil {
					t.Fatal(err)
				}
			}

			var (
				got = fetchTask(t, pgpool, j.ID)

				exp = &sn.Task{
					ID:               j.ID,
					State:            "failed",
					RunAt:            got.RunAt,
					NumberOfAttempts: sn.MaxAttempts,
					Error:            "error 10",

					Forked:         true,
					ScrollId:       "scroll_id",
					CampaignId:     1,
					AccountId:      2,
					DeviceIds:      []string{"1", "2", "3"},
					TimezoneOffset: 10,
				}
			)

			if diff := Diff(exp, got, nil, nil); diff != nil {
				t.Fatalf("Diff:\n%v", Difff(diff))
			}
		})
	})
}

func fetchTask(t *testing.T, pool *pgx.ConnPool, id int64) *sn.Task {
	t.Helper()

	var task sn.Task

	row := pool.QueryRow(`
		SELECT
			job_id, state, run_at, number_of_attempts, error,
			forked, scroll_id, campaign_id, account_id, device_ids, timezone_offset
		FROM scheduled_notification_tasks
		WHERE job_id = $1
	`, id)

	if err := row.Scan(
		&task.ID, &task.State, &task.RunAt, &task.NumberOfAttempts, &task.Error,
		&task.Forked, &task.ScrollId, &task.CampaignId, &task.AccountId, &task.DeviceIds, &task.TimezoneOffset,
	); err != nil {
		t.Fatal("row.Scan:", err)
	}

	return &task
}
