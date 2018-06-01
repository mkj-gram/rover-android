package schema

import (
	"database/sql"
	"time"

	"github.com/pkg/errors"
)

func Open(url string, options ...Option) (*DB, error) {
	sqlDB, err := sql.Open("postgres", url)
	if err != nil {
		return nil, errors.Wrap(err, "sql.Open")
	}

	var db = &DB{sql: sqlDB, now: time.Now}

	for _, op := range options {
		op(db)
	}

	return db, nil
}
