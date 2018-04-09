package postgres

import (
	"database/sql"
	"time"

	"github.com/pkg/errors"
)

var TimeNow func() time.Time = func() time.Time {
	return time.Now().UTC()
}

type (
	store struct {
		db *sql.DB
	}

	DB struct {
		db *sql.DB

		androidPlatformStore *androidPlatformStore
		iosPlatformStore     *iosPlatformStore
	}
)

func Open(dsn string) (*DB, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, errors.Wrap(err, "sql.Open")
	}

	shared := &store{db}
	return &DB{
		db: db,

		androidPlatformStore: (*androidPlatformStore)(shared),
		iosPlatformStore:     (*iosPlatformStore)(shared),
	}, nil
}

func (db *DB) DB() *sql.DB {
	return db.db
}

func (db *DB) Close() error {
	return db.db.Close()
}

func (db *DB) IosPlatformStore() *iosPlatformStore {
	return db.iosPlatformStore
}

func (db *DB) AndroidPlatformStore() *androidPlatformStore {
	return db.androidPlatformStore
}
