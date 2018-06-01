package schema

import "time"

type Option func(db *DB)

func WithTimeFunc(tfunc func() time.Time) Option {
	return func(db *DB) {
		db.now = tfunc
	}
}
