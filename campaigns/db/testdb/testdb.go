package testdb

import (
	"database/sql"
	"testing"

	"github.com/lib/pq"
	"github.com/pressly/goose"
)

type DB struct {
	DB *sql.DB
	TB testing.TB

	MigrationPath string
}

func (db *DB) Exec(sql string) sql.Result {
	var t = db.TB

	t.Helper()
	res, err := db.DB.Exec(sql)
	if err != nil {
		if pqerr, ok := err.(*pq.Error); ok {
			t.Fatal("db.Exec:", pqerr, pqerr.Detail, pqerr.Hint)
		}
		t.Fatal("db.Exec:", err)
	}

	return res
}

func (db *DB) Migrate(cmd, args string) error {
	return goose.Run(cmd, db.DB, db.MigrationPath, args)
}
func (db *DB) MigrationStatus() error {
	return goose.Status(db.DB, db.MigrationPath)
}
