package db

import (
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"
)

var (
	TimeNow = time.Now
)

type (
	store struct {
		db *sqlx.DB
	}

	storeTx struct {
		tx *sqlx.Tx
	}

	DB struct {
		store               *store
		campaignsStore      *campaignsStore
		scheduledTasksStore *scheduledTasksStore
	}

	Tx struct {
		tx                    *storeTx
		campaignsStoreTx      *campaignsStoreTx
		scheduledTasksStoreTx *scheduledTasksStoreTx
	}
)

// Open db connection given the DSN
func Open(dsn string) (*DB, error) {
	db, err := sqlx.Open("postgres", dsn)
	if err != nil {
		return nil, wrapError(err, "sql.Open")
	}

	var s = &store{db}

	return &DB{
		store:               s,
		campaignsStore:      (*campaignsStore)(s),
		scheduledTasksStore: (*scheduledTasksStore)(s),
	}, nil
}

// DB provides access to the underlying sql.DB
func (d *DB) DB() *sql.DB {
	return d.store.db.DB
}

func (d *DB) Close() error {
	return d.store.db.Close()
}

func (d *DB) Begin() (*Tx, error) {
	tx, err := d.store.db.Beginx()
	if err != nil {
		return nil, wrapError(err, "db.Begin")
	}

	var s = &storeTx{tx}

	return &Tx{
		tx:                    s,
		campaignsStoreTx:      (*campaignsStoreTx)(s),
		scheduledTasksStoreTx: (*scheduledTasksStoreTx)(s),
	}, nil
}

func (tx *Tx) Commit() error {
	return tx.tx.tx.Commit()
}

func (tx *Tx) Rollback() error {
	return tx.tx.tx.Rollback()
}

func (d *DB) CampaignsStore() *campaignsStore           { return d.campaignsStore }
func (d *DB) ScheduledTasksStore() *scheduledTasksStore { return d.scheduledTasksStore }

func (d *Tx) CampaignsStore() *campaignsStoreTx           { return d.campaignsStoreTx }
func (d *Tx) ScheduledTasksStore() *scheduledTasksStoreTx { return d.scheduledTasksStoreTx }
