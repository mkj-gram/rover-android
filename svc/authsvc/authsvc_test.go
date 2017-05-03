// +build integration

package authsvc_test

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"math/rand"
	"os"
	"testing"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"

	"github.com/lib/pq"
	"golang.org/x/net/context"

	"github.com/go-test/deep"

	auth "github.com/roverplatform/rover/go/apis/auth/v1"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	"github.com/roverplatform/rover/svc/authsvc"
	"github.com/roverplatform/rover/svc/authsvc/db/postgres"
)

var (
	_ authsvc.Backend = (*postgres.DB)(nil)
)

var (
	testDSN        = `postgres://postgres:postgres@localhost:5432/authsvc_test?sslmode=disable`
	migrationsPath = "db/migrations/postgres"

	// NOTE: Postgres only allows microsecond resolution: nanoseconds are zeroed for compatibility
	// https://github.com/lib/pq/issues/227
	createdAt, _ = time.Parse(time.RFC3339Nano, "2017-05-04T16:26:25.445494000+00:00")
	updatedAt, _ = time.Parse(time.RFC3339Nano, "2017-05-04T16:26:26.445495000+00:00")
	otherTime, _ = time.Parse(time.RFC3339Nano, "2017-05-04T17:26:25.445494000+00:00")
)

var testHashes = map[string]string{
	"s3cR3t":    "$2a$10$ad5Ck9xH2z4/NtIkQtvJ6OazpXNOFeVLZANMBUMlqOyke3l82FaO6",
	"s3cR3t2":   "$2a$10$4z9/n/if/POObOcLw1l3yulRff96jSg.BvDCHkaW54amvtgH67fjG",
	"superpass": "$2a$10$ks1VmZFoct73WZfJZyDhnuvv9gWIgGsHfiE5P9bV02PsiBlesrrey",
}

var testHasher = func(pass []byte) ([]byte, error) {
	hash, ok := testHashes[string(pass)]
	if !ok {
		return nil, fmt.Errorf("failed to get hash for password %q", string(pass))
	}
	return []byte(hash), nil
}

func dbConnect(t *testing.T, dsn string) *postgres.DB {
	db, err := postgres.Open(dsn)
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

func TestAuthsvc(t *testing.T) {
	// if testDSN = os.Getenv("TEST_DSN"); testDSN == "" {
	if dsn := os.Getenv("TEST_DSN"); dsn == "" {
		t.Skipf("Skipping: TEST_DSN unset")
	}

	var db = dbConnect(t, testDSN)

	authsvc.TimeNow = func() time.Time {
		return createdAt
	}

	authsvc.GenerateFromPassword = testHasher

	// set the seeded random source
	// makes SecretKey predictable: ie for testing generated SecretKey
	// for session/tokens
	// authsvc.RandRead = rand.New(rand.NewSource(1)).Read

	execSQL(t, db.DB(), `
		TRUNCATE table accounts, users, user_sessions, tokens;

		-- restart counters; required for expectations
		SELECT pg_catalog.setval('accounts_id_seq', 1, true);
		SELECT pg_catalog.setval('users_id_seq', 1, true);
`)

	execSQL(t, db.DB(), string(readFile(t, "db/postgres/testdata/fixtures.sql")))

	t.Run("GetAccount", testAuthsvc_GetAccount)
	t.Run("CreateAccount", testAuthsvc_CreateAccount)
	t.Run("CreateAccountWithTokens", testAuthsvc_CreateAccount_DefaultTokens)
	t.Run("UpdateAccount", testAuthsvc_UpdateAccount)

	t.Run("GetUser", testAuthsvc_GetUser)
	t.Run("CreateUser", testAuthsvc_CreateUser)
	t.Run("UpdateUser", testAuthsvc_UpdateUser)

	t.Run("CreateUserSession", testAuthsvc_CreateUserSession)

	t.Run("AuthenticateUserSession", testAuthsvc_AuthenticateUserSession)
	t.Run("AuthenticateToken", testAuthsvc_AuthenticateToken)
}

func testAuthsvc_CreateAccount(t *testing.T) {
	var db = dbConnect(t, testDSN)
	var svc = authsvc.Server{DB: db}
	defer db.Close()

	type args struct {
		ctx context.Context
		r   *auth.CreateAccountRequest
	}
	tests := []struct {
		name    string
		args    args
		want    *auth.Account
		wantErr error
	}{{

		name: "creating an account",

		args: args{context.Background(),
			&auth.CreateAccountRequest{
				Name: "AnAccount",
			},
		},

		want: &auth.Account{
			Id:        3,
			Name:      "AnAccount",
			CreatedAt: ts(t, createdAt),
			UpdatedAt: ts(t, createdAt),
		},
	}, {

		name:    "creating an account with a duplicate name",
		wantErr: grpc.Errorf(codes.Unknown, `db.CreateAccount: Scan: pq: duplicate key value violates unique constraint "accounts_name_key"`),

		args: args{context.Background(),
			&auth.CreateAccountRequest{
				Name: "AnAccount",
			},
		},
	},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			got, err := svc.CreateAccount(tt.args.ctx, tt.args.r)
			if diff := deep.Equal(err, tt.wantErr); diff != nil {
				t.Fatal("error:", diff)
				return
			}
			if diff := deep.Equal(got, tt.want); diff != nil {
				t.Error(diff)
			}
		})
	}
}

func testAuthsvc_CreateAccount_DefaultTokens(t *testing.T) {
	var db = dbConnect(t, testDSN)
	var svc = authsvc.Server{DB: db}
	defer db.Close()

	authsvc.RandRead = rand.New(rand.NewSource(1)).Read

	type args struct {
		ctx context.Context
		r   *auth.CreateAccountRequest
	}

	tests := []struct {
		name       string
		args       args
		want       *auth.Account
		wantTokens []*auth.Token
		wantErr    error
	}{{

		name: "account default tokens",

		args: args{context.Background(),
			&auth.CreateAccountRequest{
				Name: "someaccount",
			},
		},

		want: &auth.Account{
			Id:        5,
			Name:      "someaccount",
			CreatedAt: ts(t, createdAt),
			UpdatedAt: ts(t, createdAt),
		},
		wantTokens: []*auth.Token{
			&auth.Token{
				AccountId:        5,
				Key:              "52fdfc072182654f163f5f0f9a621d729566c74d",
				PermissionScopes: []string{"web"},
				CreatedAt:        ts(t, createdAt),
				UpdatedAt:        ts(t, createdAt),
			},
			&auth.Token{
				AccountId:        5,
				Key:              "10037c4d7bbb0407d1e2c64981855ad8681d0d86",
				PermissionScopes: []string{"sdk"},
				CreatedAt:        ts(t, createdAt),
				UpdatedAt:        ts(t, createdAt),
			},
			&auth.Token{
				AccountId:        5,
				Key:              "d1e91e00167939cb6694d2c422acd208a0072939",
				PermissionScopes: []string{"server"},
				CreatedAt:        ts(t, createdAt),
				UpdatedAt:        ts(t, createdAt),
			},
		},
	},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {

			got, err := svc.CreateAccount(tt.args.ctx, tt.args.r)
			if diff := deep.Equal(err, tt.wantErr); diff != nil {
				t.Fatal("error:", diff)
				return
			}
			if diff := deep.Equal(got, tt.want); diff != nil {
				t.Error(diff)
			}
			{
				got, err := db.FindTokensByAccountId(tt.args.ctx, int(tt.want.Id))
				if err != nil {
					t.Fatal("account tokens:", err)
				}

				if diff := deep.Equal(got, tt.wantTokens); diff != nil {
					t.Error(diff)
				}
			}
		})
	}
}

func testAuthsvc_GetAccount(t *testing.T) {
	var db = dbConnect(t, testDSN)
	defer db.Close()
	var svc = authsvc.Server{DB: db}

	type args struct {
		ctx context.Context
		r   *auth.GetAccountRequest
	}

	tests := []struct {
		name    string
		args    args
		want    *auth.Account
		wantErr error
	}{{

		name: "get non existant account",
		args: args{
			ctx: context.Background(),
			r: &auth.GetAccountRequest{
				AccountId: -1,
			},
		},
		wantErr: grpc.Errorf(codes.NotFound, `db.GetAccount: account_id=-1`),
	}, {

		name: "get an existing account",
		args: args{
			ctx: context.Background(),
			r: &auth.GetAccountRequest{
				AccountId: 1,
			},
		},
		want: &auth.Account{
			Id:        1,
			Name:      "firstAcct",
			CreatedAt: ts(t, createdAt),
			UpdatedAt: ts(t, createdAt),
		},
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.GetAccount(tt.args.ctx, tt.args.r)

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

func testAuthsvc_UpdateAccount(t *testing.T) {
	var db = dbConnect(t, testDSN)
	defer db.Close()
	var svc = authsvc.Server{DB: db}

	var now = time.Now().Truncate(time.Microsecond).UTC()

	authsvc.TimeNow = func() time.Time {
		return now
	}

	type args struct {
		ctx context.Context
		r   *auth.UpdateAccountRequest
	}
	tests := []struct {
		name    string
		args    args
		want    *auth.Account
		wantErr error
	}{{

		name:    "update non-existing account",
		wantErr: grpc.Errorf(codes.NotFound, `db.UpdateAccount: account_id=-1`),

		args: args{
			ctx: context.Background(),
			r: &auth.UpdateAccountRequest{
				AccountId: -1,
				Name:      "hello!",
			},
		},
	}, {

		name: "update existing account",

		args: args{
			ctx: context.Background(),
			r: &auth.UpdateAccountRequest{
				AccountId: 1,
				Name:      "updatedAccount",
			},
		},
		want: &auth.Account{
			Id:        1,
			Name:      "updatedAccount",
			CreatedAt: ts(t, createdAt),
			UpdatedAt: ts(t, now),
		},
	},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.UpdateAccount(tt.args.ctx, tt.args.r)

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

func testAuthsvc_GetUser(t *testing.T) {
	var db = dbConnect(t, testDSN)
	defer db.Close()
	var svc = authsvc.Server{DB: db}

	type args struct {
		ctx context.Context
		r   *auth.GetUserRequest
	}
	tests := []struct {
		name    string
		args    args
		want    *auth.User
		wantErr error
	}{{

		name:    "error: getting a non-existant user",
		wantErr: grpc.Errorf(codes.NotFound, "db.GetUserById: user_id=-1 account_id=0"),

		args: args{context.Background(),
			&auth.GetUserRequest{
				UserId: -1,
			},
		},
	}, {

		name:    "error: getting a user belonging to non-existing account",
		wantErr: grpc.Errorf(codes.NotFound, "AccountId: user_id=1 account_id=-1: mismatch"),

		args: args{context.Background(),
			&auth.GetUserRequest{
				UserId:    1,
				AccountId: -1,
			},
		},
	}, {

		name: "getting an existing user",

		args: args{context.Background(),
			&auth.GetUserRequest{
				AccountId: 1,
				UserId:    1,
			},
		},

		want: &auth.User{
			Id:               1,
			AccountId:        1,
			Name:             "user1",
			Email:            "user1@example.com",
			PermissionScopes: []string{},
			CreatedAt:        ts(t, createdAt),
			UpdatedAt:        ts(t, createdAt),
		},
	}}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.GetUser(tt.args.ctx, tt.args.r)

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

func testAuthsvc_CreateUser(t *testing.T) {
	var db = dbConnect(t, testDSN)
	defer db.Close()
	var svc = authsvc.Server{
		DB: db,
	}

	authsvc.TimeNow = func() time.Time {
		return createdAt
	}

	type args struct {
		ctx context.Context
		r   *auth.CreateUserRequest
	}
	tests := []struct {
		name    string
		args    args
		want    *authsvc.User
		wantErr error
	}{
		{
			name: "creating a user",
			args: args{
				context.Background(),
				&auth.CreateUserRequest{
					AccountId: 1,
					Email:     "user@example.com",
					Name:      "user",
					Password:  "s3cR3t",
				},
			},
			want: &authsvc.User{
				User: auth.User{
					Id:               3,
					AccountId:        1,
					Name:             "user",
					Email:            "user@example.com",
					PermissionScopes: []string{"admin"},
					CreatedAt:        ts(t, createdAt),
					UpdatedAt:        ts(t, createdAt),
				},
				PasswordDigest: []byte("$2a$10$ad5Ck9xH2z4/NtIkQtvJ6OazpXNOFeVLZANMBUMlqOyke3l82FaO6"),
			},
		},

		{
			name:    "error: requires a valid email",
			wantErr: grpc.Errorf(codes.InvalidArgument, `validate: account_id=1: email: is invalid`),

			args: args{context.Background(),
				&auth.CreateUserRequest{
					AccountId: 1,
					Email:     "user.example.com",
					Name:      "user",
					Password:  "s3cR3t",
				},
			},
		},
		{
			name:    "error: requires unique email",
			wantErr: grpc.Errorf(codes.Unknown, `db.CreateUser: account_id=1: Scan: pq: duplicate key value violates unique constraint "users_email_key"`),

			args: args{context.Background(),
				&auth.CreateUserRequest{
					AccountId: 1,
					Email:     "user@example.com",
					Name:      "user",
					Password:  "s3cR3t",
				},
			},
		},
		{

			name:    "error: password is too short",
			wantErr: grpc.Errorf(codes.InvalidArgument, `validate: account_id=1: password: is too short`),

			args: args{context.Background(),
				&auth.CreateUserRequest{
					AccountId: 1,
					Email:     "hello@example.com",
					Name:      "user name",
					Password:  "2shrt",
				},
			},
		},

		{
			name:    "error: requires account_id",
			wantErr: grpc.Errorf(codes.Unknown, `db.CreateUser: account_id=0: Scan: pq: insert or update on table "users" violates foreign key constraint "users_account_id_fkey"`),

			args: args{context.Background(),
				&auth.CreateUserRequest{
					Email:    "hello@example.com",
					Name:     "user",
					Password: "s3cR3t",
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.CreateUser(tt.args.ctx, tt.args.r)

			if err != nil || tt.wantErr != nil {
				if diff := deep.Equal(err, tt.wantErr); diff != nil {
					t.Error("error:", diff)
				}
				return
			}

			if diff := deep.Equal(*got, tt.want.User); diff != nil {
				t.Error(diff)
			}

			{ // also check the authsvc.User
				got, err := db.GetUserById(tt.args.ctx, int(got.Id))
				if err != nil {
					t.Error("unexpected:", err)
				}

				if diff := deep.Equal(got, tt.want); diff != nil {
					t.Error(diff)
				}
			}
		})
	}
}

func testAuthsvc_UpdateUser(t *testing.T) {
	var db = dbConnect(t, testDSN)
	defer db.Close()
	var svc = authsvc.Server{
		DB: db,
	}

	authsvc.TimeNow = func() time.Time {
		return updatedAt
	}

	type args struct {
		ctx context.Context
		r   *auth.UpdateUserRequest
	}
	tests := []struct {
		name    string
		args    args
		want    *authsvc.User
		wantErr error
	}{
		{

			name:    "error: requires password",
			wantErr: grpc.Errorf(codes.InvalidArgument, `validate: user_id=-1: password: is too short`),

			args: args{
				context.Background(),
				&auth.UpdateUserRequest{
					AccountId: 1,
					UserId:    -1,
					Email:     "newemail@example.com",
				},
			},
		},
		{

			name:    "error: update non-existing user",
			wantErr: grpc.Errorf(codes.NotFound, `db.UpdateUser: account_id=1 user_id=-1`),

			args: args{
				context.Background(),
				&auth.UpdateUserRequest{
					AccountId: 1,
					UserId:    -1,
					Email:     "newemail@example.com",
					Password:  "s3cR3t",
				},
			},
		},
		{

			name:    "error: existing user for a non-existing account",
			wantErr: grpc.Errorf(codes.NotFound, "db.UpdateUser: account_id=-1 user_id=1"),

			args: args{context.Background(),
				&auth.UpdateUserRequest{
					Password:  "s3cR3t",
					AccountId: -1,
					UserId:    1,
					Email:     "newemail@example.com",
				},
			},
		},
		{

			name:    "error: non-existing account and user",
			wantErr: grpc.Errorf(codes.NotFound, "db.UpdateUser: account_id=-1 user_id=-1"),

			args: args{context.Background(),
				&auth.UpdateUserRequest{
					Password:  "s3cR3t",
					AccountId: -1,
					UserId:    -1,
					Email:     "newemail@example.com",
				},
			},
		},
		{

			name:    "error: existing email",
			wantErr: grpc.Errorf(codes.Unknown, `db.UpdateUser: account_id=1 user_id=1: Scan: pq: duplicate key value violates unique constraint "users_email_key"`),

			args: args{context.Background(),
				&auth.UpdateUserRequest{
					Password:  "s3cR3t",
					AccountId: 1,
					UserId:    1,
					Email:     "user2@example.com",
				},
			},
		},
		{

			name: "updates user",

			args: args{context.Background(),
				&auth.UpdateUserRequest{
					AccountId: 1,
					UserId:    1,

					Password: "s3cR3t2",
					Email:    "user1+newemail@example.com",
				},
			},

			want: &authsvc.User{
				User: auth.User{
					Id:               1,
					AccountId:        1,
					Email:            "user1+newemail@example.com",
					CreatedAt:        ts(t, createdAt.UTC()),
					UpdatedAt:        ts(t, updatedAt),
					PermissionScopes: []string{},
				},
				PasswordDigest: []byte("$2a$10$4z9/n/if/POObOcLw1l3yulRff96jSg.BvDCHkaW54amvtgH67fjG"),
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.UpdateUser(tt.args.ctx, tt.args.r)

			if err != nil || tt.wantErr != nil {
				if diff := deep.Equal(err, tt.wantErr); diff != nil {
					t.Error("error:", diff)
				}
				return
			}

			if diff := deep.Equal(got, &tt.want.User); diff != nil {
				t.Error(diff)
			}

			{ // also check the authsvc.User
				got, err := db.GetUserById(tt.args.ctx, int(got.Id))
				if err != nil {
					t.Error("unexpected:", err)
				}

				if diff := deep.Equal(got, tt.want); diff != nil {
					t.Error(diff)
				}
			}
		})
	}
}

func testAuthsvc_CreateUserSession(t *testing.T) {
	var db = dbConnect(t, testDSN)
	defer db.Close()
	var svc = authsvc.Server{DB: db}

	var now = time.Now().Truncate(time.Microsecond).UTC()

	authsvc.TimeNow = func() time.Time {
		return now
	}

	authsvc.RandRead = rand.New(rand.NewSource(1)).Read

	type args struct {
		ctx context.Context
		r   *auth.CreateUserSessionRequest
	}
	tests := []struct {
		name    string
		args    args
		want    *auth.UserSession
		wantErr error
	}{
		{
			name: "creates a session",

			args: args{context.Background(),
				&auth.CreateUserSessionRequest{
					Email:       "user@example.com",
					Password:    "s3cR3t",
					LastSeen_IP: "2001:db8A:1234:0000:0000:0000:0000:0000",
				},
			},

			want: &auth.UserSession{
				UserId:      3,
				Key:         `52fdfc072182654f163f5f0f9a621d729566c74d`,
				ExpiresAt:   ts(t, now.Add(authsvc.SessionDuration)),
				LastSeen_IP: "2001:db8A:1234:0000:0000:0000:0000:0000",

				CreatedAt: ts(t, now),
				UpdatedAt: ts(t, now),
			},
		},

		{
			name: "allows multiple session",

			args: args{context.Background(),
				&auth.CreateUserSessionRequest{
					Password:    "s3cR3t",
					Email:       "user@example.com",
					LastSeen_IP: "2001:db8A:1234:0000:0000:0000:0000:0000",
				},
			},

			want: &auth.UserSession{
				UserId:      3,
				Key:         `10037c4d7bbb0407d1e2c64981855ad8681d0d86`,
				ExpiresAt:   ts(t, now.Add(authsvc.SessionDuration)),
				LastSeen_IP: "2001:db8A:1234:0000:0000:0000:0000:0000",

				CreatedAt: ts(t, now),
				UpdatedAt: ts(t, now),
			},
		},

		{
			name: "cretes with blank last_seen_IP",

			args: args{context.Background(),
				&auth.CreateUserSessionRequest{
					Password:    "s3cR3t",
					Email:       "user@example.com",
					LastSeen_IP: "",
				},
			},

			want: &auth.UserSession{
				UserId:      3,
				Key:         `d1e91e00167939cb6694d2c422acd208a0072939`,
				ExpiresAt:   ts(t, now.Add(authsvc.SessionDuration)),
				LastSeen_IP: "",

				CreatedAt: ts(t, now),
				UpdatedAt: ts(t, now),
			},
		},

		{
			name:    "error: requires password",
			wantErr: grpc.Errorf(codes.Unauthenticated, `CompareHashAndPassword: user_id=3: crypto/bcrypt: hashedPassword is not the hash of the given password`),

			args: args{context.Background(),
				&auth.CreateUserSessionRequest{
					Email:       "user@example.com",
					LastSeen_IP: "2001:db8A:1234:0000:0000:0000:0000:0000",
				},
			},
		},

		{
			name:    "error: wrong password",
			wantErr: grpc.Errorf(codes.Unauthenticated, `CompareHashAndPassword: user_id=3: crypto/bcrypt: hashedPassword is not the hash of the given password`),

			args: args{context.Background(),
				&auth.CreateUserSessionRequest{
					Password:    "s3cR3t2",
					Email:       "user@example.com",
					LastSeen_IP: "2001:db8A:1234:0000:0000:0000:0000:0000",
				},
			},
		},

		{
			name:    "error: email not found",
			wantErr: grpc.Errorf(codes.NotFound, `db.FindUserByEmail`),

			args: args{context.Background(),
				&auth.CreateUserSessionRequest{
					Password:    "s3cR3t2",
					Email:       "non-existing@example.com",
					LastSeen_IP: "2001:db8A:1234:0000:0000:0000:0000:0000",
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.CreateUserSession(tt.args.ctx, tt.args.r)

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

func testAuthsvc_AuthenticateUserSession(t *testing.T) {
	var db = dbConnect(t, testDSN)
	defer db.Close()
	var svc = authsvc.Server{DB: db}

	var sess, err = db.FindSessionByKey(context.Background(), `52fdfc072182654f163f5f0f9a621d729566c74d`)
	if err != nil {
		t.Fatal("unexpected:", err)
	}

	var now = time.Now().Truncate(time.Microsecond).UTC()

	authsvc.TimeNow = func() time.Time {
		return now
	}

	type args struct {
		ctx context.Context
		r   *auth.AuthenticateRequest
	}
	tests := []struct {
		name        string
		args        args
		want        *auth.AuthContext
		wantSession *auth.UserSession
		wantErr     error
	}{
		{
			name: "authenticates session",
			args: args{context.Background(),
				&auth.AuthenticateRequest{
					Key: `52fdfc072182654f163f5f0f9a621d729566c74d`,
				},
			},

			want: &auth.AuthContext{
				AccountId:        1,
				UserId:           3,
				PermissionScopes: []string{"admin"},
			},

			wantSession: &auth.UserSession{
				UserId:      3,
				Key:         `52fdfc072182654f163f5f0f9a621d729566c74d`,
				LastSeen_IP: "2001:db8A:1234:0000:0000:0000:0000:0000",
				CreatedAt:   sess.CreatedAt,
				UpdatedAt:   ts(t, now),
				ExpiresAt:   ts(t, now.Add(authsvc.SessionDuration)),
			},
		},

		{
			name:    "error: doesn't auth expired session",
			wantErr: grpc.Errorf(codes.NotFound, `UserSession: user_id=1: expired`),

			args: args{context.Background(),
				&auth.AuthenticateRequest{
					Key: `EXPIREDSESSION`,
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.AuthenticateUserSession(tt.args.ctx, tt.args.r)

			if err != nil || tt.wantErr != nil {
				if diff := deep.Equal(err, tt.wantErr); diff != nil {
					t.Error("error:", diff)
				}
				return
			}

			if diff := deep.Equal(got, tt.want); diff != nil {
				t.Error(diff)
			}

			{
				got, err := svc.DB.FindSessionByKey(tt.args.ctx, tt.args.r.Key)

				if err != nil {
					t.Fatalf("unexpected:", err)
				}

				if diff := deep.Equal(got, tt.wantSession); diff != nil {
					t.Error("session", diff)
				}
			}
		})
	}
}
func testAuthsvc_AuthenticateToken(t *testing.T) {
	var db = dbConnect(t, testDSN)
	defer db.Close()
	var svc = authsvc.Server{DB: db}

	var tok, err = db.FindTokenByKey(context.Background(), `token1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`)
	if err != nil {
		t.Fatal("unexpected:", err)
	}

	authsvc.RandRead = rand.New(rand.NewSource(1)).Read

	type args struct {
		ctx context.Context
		r   *auth.AuthenticateRequest
	}
	tests := []struct {
		name      string
		args      args
		want      *auth.AuthContext
		wantToken *auth.Token
		wantErr   error
	}{
		{
			name: "authenticates Token",
			args: args{context.Background(),
				&auth.AuthenticateRequest{
					Key: `token1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
				},
			},

			want: &auth.AuthContext{
				AccountId:        1,
				UserId:           0,
				PermissionScopes: []string{"web"},
			},

			wantToken: &auth.Token{
				AccountId:        1,
				Key:              `token1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
				PermissionScopes: []string{"web"},
				CreatedAt:        tok.CreatedAt,
				UpdatedAt:        tok.UpdatedAt,
			},
		},

		{
			name:    "error: doesn't auth non-existing token",
			wantErr: grpc.Errorf(codes.NotFound, `db.FindTokenByKey: non-existant`),

			args: args{context.Background(),
				&auth.AuthenticateRequest{
					Key: `non-existant`,
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.AuthenticateToken(tt.args.ctx, tt.args.r)

			if err != nil || tt.wantErr != nil {
				if diff := deep.Equal(err, tt.wantErr); diff != nil {
					t.Error("error:", diff)
				}
				return
			}

			if diff := deep.Equal(got, tt.want); diff != nil {
				t.Error(diff)
			}

			{
				got, err := svc.DB.FindTokenByKey(tt.args.ctx, tt.args.r.Key)

				if err != nil {
					t.Fatalf("unexpected:", err)
				}

				if diff := deep.Equal(got, tt.wantToken); diff != nil {
					t.Error("wantToken:", diff)
				}
			}
		})
	}
}
