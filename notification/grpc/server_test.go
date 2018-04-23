package grpc_test

import (
	Base64 "encoding/base64"
	"io/ioutil"
	"testing"
	"time"

	"github.com/namsral/flag"

	// TODO: move to db package?
	"github.com/roverplatform/rover/campaigns/db/testdb"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	rtesting "github.com/roverplatform/rover/go/testing"
	postgres "github.com/roverplatform/rover/notification/postgres"
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
	flag.StringVar(&tCfg.DSN, "postgres-test-dsn", ``, "test DSN")

	flag.StringVar(&tCfg.fixtures.Path, "fixtures-path", `../postgres/testdata/fixtures.sql`, "path to migrations")

	flag.StringVar(&tCfg.migration.Path, "migration-path", `../postgres/migrations`, "path to migrations")
	flag.StringVar(&tCfg.migration.Cmd, "migration-cmd", `up`, "migration cmd")
	flag.StringVar(&tCfg.migration.Args, "migration-args", ``, "migration args")

	flag.Parse()
}

func dbOpen(t testing.TB, dsn string) (*postgres.DB, func() error) {
	t.Helper()
	db, err := postgres.Open(dsn)
	if err != nil {
		t.Fatal("setup:", err)
	}

	if _, err := db.DB().Exec(`SELECT set_config('log_statement', 'all', false)`); err != nil {
		t.Fatal("Enable logging:", err)
	}

	return db, db.Close
}

func ts(t testing.TB, tt time.Time) *timestamp.Timestamp {
	t.Helper()

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

func base64(data []byte) string {
	return Base64.StdEncoding.EncodeToString(data)
}

func readFile(t *testing.T, path string) []byte {
	t.Helper()
	data, err := ioutil.ReadFile(path)
	if err != nil {
		t.Fatal("readFile:", err)
	}

	return data
}

func certP12(t *testing.T, path string) []byte {
	t.Helper()
	return readFile(t, path)
}

func TestPlatforms(t *testing.T) {
	t.Logf("Config: %v", tCfg)

	var db, cleanup = dbOpen(t, tCfg.DSN)
	defer cleanup()

	tDb := testdb.DB{
		MigrationPath: tCfg.migration.Path,
		DB:            db.DB(),
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
	tDb.Exec(`TRUNCATE table ios_platforms, android_platforms RESTART IDENTITY;`)
	tDb.Exec(`SELECT pg_catalog.setval('ios_platforms_id_seq', 999, true);`)
	tDb.Exec(`SELECT pg_catalog.setval('android_platforms_id_seq', 999, true);`)
	tDb.Exec(string(readFile(t, tCfg.fixtures.Path)))

	postgres.TimeNow = func() time.Time { return timeUpdatedAt }

	t.Run("GetIosPlatform", test_Ios_GetIosPlatform)
	t.Run("CreateIosPlatform", test_Ios_CreateIosPlatform)
	t.Run("UpdatePushCredentials", test_Ios_UpdatePushCredentials)

	t.Run("Android_GetPlatform", test_Android_GetPlatform)
	t.Run("Android_CreatePlatform", test_Android_CreatePlatform)
	t.Run("Android_UpdatePushCredentials", test_Android_UpdatePushCredentials)
}
