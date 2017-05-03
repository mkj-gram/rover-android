package postgres

import (
	"database/sql"

	"github.com/pkg/errors"

	"golang.org/x/net/context"

	auth "github.com/roverplatform/rover/go/apis/auth/v1"
	"github.com/roverplatform/rover/svc/authsvc"

	// NOTE: this is a postgres specific implementation so blank import is justified
	_ "github.com/lib/pq"
)

var _ authsvc.Backend = (*DB)(nil)

// DB implementation
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

// DB lets access underlying sql.DB
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

func (db *DB) AuthenticateToken(context.Context, *auth.AuthenticateRequest) (*auth.AuthContext, error) {
	panic("not implemented")
}
