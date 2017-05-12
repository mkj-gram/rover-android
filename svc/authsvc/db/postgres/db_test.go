// +build integration

package postgres_test

import (
	"os"
	"testing"

	_ "github.com/lib/pq"
	"github.com/roverplatform/rover/svc/authsvc/db/postgres"
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
		wantErr bool
	}{
		{
			name: "valid connection",
			d:    dbConnect(t, testDSN),
		},
		{
			name:    "error: invalid connection",
			d:       dbConnect(t, "postgres://localhost:5432/?user=invaid_user&sslmode=disable"),
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var err = tt.d.Ping()

			if tt.wantErr && err == nil {
				t.Error("error expected")
			}
		})
	}
}
