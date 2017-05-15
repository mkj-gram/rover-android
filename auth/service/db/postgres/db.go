package postgres

import (
	"database/sql"

	"github.com/roverplatform/rover/auth/service"
)

// ensure DB implements service.Backend
var _ service.Backend = (*DB)(nil)

// DB is postgres based service.Backend implementation
type DB struct {
	db *sql.DB
}

// Open open the db connection
func Open(db *sql.DB) (*DB, error) {
	return &DB{db: db}, nil
}

// DB method provides access to the underlying sql.DB
func (d *DB) DB() *sql.DB {
	return d.db
}
