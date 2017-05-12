package postgres

import (
	"database/sql"

	"github.com/pkg/errors"

	"golang.org/x/net/context"

	"github.com/roverplatform/rover/auth/service"

	// NOTE: this is a postgres specific implementation so blank import is justified
	_ "github.com/lib/pq"
)

// ensure DB implements service.Backend
var _ service.Backend = (*DB)(nil)

// DB is postgres based service.Backend implementation
type DB struct {
	db *sql.DB
}

// Open open the db connection
func Open(dataSourceName string) (*DB, error) {
	db, err := sql.Open("postgres", dataSourceName)
	if err != nil {
		return nil, errors.Wrap(err, "Open")
	}

	return &DB{db: db}, nil
}

// DB method provides access to the underlying sql.DB
func (d *DB) DB() *sql.DB {
	return d.db
}

// Ping tests the connection with the DB
func (d *DB) Ping() error {
	return d.db.PingContext(context.TODO())
}

// Close the db connection
func (d *DB) Close() error {
	return d.db.Close()
}
