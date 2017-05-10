// +build integration

package postgres_test

import (
	"os"
	"testing"

	"github.com/lib/pq"
	_ "github.com/lib/pq"
	"github.com/roverplatform/rover/svc/authsvc/db/postgres"

	"github.com/go-test/deep"
)

var (
	testDSN = `postgres://postgres:postgres@localhost:5432/authsvc_test?sslmode=disable`
)

func init() {
	if dsn := os.Getenv("TEST_DSN"); dsn != "" {
		testDSN = dsn
	}
}

func TestDB_Ping(t *testing.T) {
	dbConnect := func(t *testing.T, dsn string) *postgres.DB {
		db, err := postgres.Open(dsn)
		if err != nil {
			t.Fatal("setup:", err)
		}

		return db
	}

	tests := []struct {
		name    string
		d       *postgres.DB
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
