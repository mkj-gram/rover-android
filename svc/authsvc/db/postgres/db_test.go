// +build integration

package postgres

import (
	"database/sql"
	"io/ioutil"
	"os"
	"testing"
	"time"

	"github.com/lib/pq"
	_ "github.com/lib/pq"
	"github.com/pkg/errors"
	"golang.org/x/net/context"

	"github.com/go-test/deep"

	auth "github.com/roverplatform/rover/go/apis/auth/v1"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	"github.com/roverplatform/rover/svc/authsvc"
)

var _ authsvc.DB = (*DB)(nil)

var (
	testDSN        = `postgres://postgres:postgres@localhost:5432/authsvc_test?sslmode=disable`
	migrationsPath = "../../db/migrations/postgres"

	// NOTE: Postgres only allows microsecond resolution: nanoseconds are zeroed
	// https://github.com/lib/pq/issues/227
	createTime, _ = time.Parse(time.RFC3339Nano, "2017-05-04T16:26:25.445494000+00:00")
	updateTime, _ = time.Parse(time.RFC3339Nano, "2017-05-04T16:26:26.445495000+00:00")
	otherTime, _  = time.Parse(time.RFC3339Nano, "2017-05-04T17:26:25.445494000+00:00")
	expiredAt, _  = time.Parse(time.RFC3339Nano, "2016-05-05T16:26:25.445494000+00:00")
)

func dbConnect(t *testing.T, dsn string) *DB {
	db, err := Open(dsn)
	if err != nil {
		t.Fatal("setup:", err)
	}

	return db
}

func ts(t *testing.T, ti time.Time) *timestamp.Timestamp {
	ts, err := timestamp.TimestampProto(ti)
	if err != nil {
		t.Fatal("timestamp:", err)
	}

	return ts
}

func execSQL(t *testing.T, db *sql.DB, sql string) {
	_, err := db.Exec(sql)
	if err != nil {
		if pqerr := err.(*pq.Error); pqerr != nil {
			t.Fatal("db.Exec:", pqerr, pqerr.Detail, pqerr.Hint)
		}
		t.Fatal("db.Exec:", err)
	}
}

func readFile(t *testing.T, path string) []byte {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		t.Fatal("readFile:", err)
	}

	return data
}

func TestDB(t *testing.T) {
	// if testDSN = os.Getenv("TEST_DSN"); testDSN == "" {
	if dsn := os.Getenv("TEST_DSN"); dsn == "" {
		t.Skipf("Skipping: TEST_DSN unset")
	}

	var db = dbConnect(t, testDSN)

	execSQL(t, db.DB(), `
		TRUNCATE table accounts, users, user_sessions, tokens;

		-- restart counters; required for expectations
		SELECT pg_catalog.setval('accounts_id_seq', 1, true);
		SELECT pg_catalog.setval('users_id_seq', 1, true);
`)

	execSQL(t, db.DB(), string(readFile(t, "../../db/postgres/testdata/fixtures.sql")))

	t.Run("GetUserById", testDB_GetUserById)
	t.Run("FindUserByEmail", testDB_FindUserByEmail)

	t.Run("FindSessionByKey", testDB_FindUserSessionByKey)
}

func TestDB_Ping(t *testing.T) {

	tests := []struct {
		name    string
		d       *DB
		wantErr error
	}{
		{
			name: "valid connection",
			d:    dbConnect(t, testDSN),
		},
		{
			name:    "invalid connection",
			d:       dbConnect(t, "postgres://localhost:5432/?user=invaid_user&sslmode=disable"),
			wantErr: &pq.Error{Message: `role "invaid_user" does not exist`},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var err = tt.d.Ping()

			if diff := deep.Equal(err, tt.wantErr); diff != nil {
				t.Error("error:", diff)
			}
		})
	}
}

func testDB_GetUserById(t *testing.T) {
	var db = dbConnect(t, testDSN)

	type args struct {
		ctx context.Context
		id  int
	}
	tests := []struct {
		name    string
		args    args
		want    *authsvc.User
		wantErr error
	}{

		{
			name:    "getting a non-existant user",
			wantErr: errors.Wrap(sql.ErrNoRows, "Scan"),

			args: args{
				context.Background(),
				-1,
			},
		},

		{
			name: "getting an existing user",

			args: args{
				context.Background(),
				2,
			},

			want: &authsvc.User{
				User: auth.User{
					Id:               2,
					AccountId:        1,
					Name:             "user2",
					Email:            "user2@example.com",
					PermissionScopes: []string{},
					CreatedAt:        ts(t, otherTime),
					UpdatedAt:        ts(t, otherTime),
				},
				PasswordDigest: []byte("$2a$10$0tUJdIURcBTXV0KaVGexw.TBUUc8GRjuhjWsxXybIQaoQLVn/ksBa"),
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := db.GetUserById(tt.args.ctx, tt.args.id)

			if diff := deep.Equal(err, tt.wantErr); diff != nil {
				t.Error("error:", diff)
				return
			}
			if diff := deep.Equal(got, tt.want); diff != nil {
				t.Error(diff)
			}
		})
	}
}

func testDB_FindUserByEmail(t *testing.T) {
	var db = dbConnect(t, testDSN)

	type args struct {
		ctx   context.Context
		email string
	}
	tests := []struct {
		name    string
		args    args
		want    *authsvc.User
		wantErr error
	}{

		{
			name:    "getting a non-existant user",
			wantErr: errors.Wrap(sql.ErrNoRows, "Scan"),

			args: args{context.Background(),
				"non-existant@email.com",
			},
		},

		{
			name: "getting an existing user",

			args: args{context.Background(),
				"user2@example.com",
			},

			want: &authsvc.User{
				User: auth.User{
					Id:               2,
					AccountId:        1,
					Name:             "user2",
					Email:            "user2@example.com",
					PermissionScopes: []string{},
					CreatedAt:        ts(t, otherTime),
					UpdatedAt:        ts(t, otherTime),
				},
				PasswordDigest: []byte("$2a$10$0tUJdIURcBTXV0KaVGexw.TBUUc8GRjuhjWsxXybIQaoQLVn/ksBa"),
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := db.FindUserByEmail(tt.args.ctx, tt.args.email)

			if diff := deep.Equal(err, tt.wantErr); diff != nil {
				t.Error("error:", diff)
				return
			}
			if diff := deep.Equal(got, tt.want); diff != nil {
				t.Error(diff)
			}
		})
	}
}

func testDB_FindUserSessionByKey(t *testing.T) {
	var db = dbConnect(t, testDSN)

	type args struct {
		ctx context.Context
		key string
	}
	tests := []struct {
		name    string
		args    args
		want    *auth.UserSession
		wantErr error
	}{
		{
			name: "finds session",

			args: args{context.Background(),
				`EXPIREDSESSION`,
			},

			want: &auth.UserSession{
				UserId:      1,
				Key:         `EXPIREDSESSION`,
				ExpiresAt:   ts(t, expiredAt),
				LastSeen_IP: "127.0.0.1",

				CreatedAt: ts(t, createTime),
				UpdatedAt: ts(t, createTime),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := db.FindSessionByKey(tt.args.ctx, tt.args.key)

			if diff := deep.Equal((err), tt.wantErr); diff != nil {
				t.Error("error:", diff)
				return
			}

			if diff := deep.Equal(got, tt.want); diff != nil {
				t.Error(diff)
			}
		})
	}
}
