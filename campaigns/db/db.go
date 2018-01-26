package db

import (
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"
)

var (
	TimeNow = time.Now
)

// DB is postgres based service.Backend implementation
type DB struct {
	db *sqlx.DB
}

// Open db connection given the DSN
func Open(dsn string) (*DB, error) {
	db, err := sqlx.Open("postgres", dsn)
	if err != nil {
		return nil, wrapError(err, "sql.Open")
	}

	return &DB{db: db}, nil
}

// DB provides access to the underlying sql.DB
func (d *DB) DB() *sql.DB {
	return d.db.DB
}

func (d *DB) Close() error {
	return d.db.Close()
}
