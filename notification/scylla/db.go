package scylla

import (
	"github.com/gocql/gocql"
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/go/cql"
)

var TimeUUID = gocql.TimeUUID

type store struct {
	session *gocql.Session
}

type DB struct {
	session *gocql.Session

	notificationSettingsStore *notificationSettingsStore
	notificationsStore        *notificationsStore
}

func New(hosts []string, clusterOptions []ClusterOption) (*DB, error) {
	cluster := gocql.NewCluster(hosts...)
	cluster.Consistency = gocql.Quorum

	// Apply cluster config options
	for _, op := range clusterOptions {
		op(cluster)
	}

	session, err := cluster.CreateSession()
	if err != nil {
		return nil, err
	}

	return NewFromSession(session), nil
}

func Open(dsn string) (*DB, error) {
	session, err := cql.Open(dsn)
	if err != nil {
		return nil, err
	}

	return NewFromSession(session), nil
}

func NewFromSession(session *gocql.Session) *DB {
	return &DB{
		session:                   session,
		notificationSettingsStore: &notificationSettingsStore{session: session},
		notificationsStore:        &notificationsStore{session: session},
	}
}

func (db *DB) Session() *gocql.Session {
	return db.session
}
func (db *DB) Ping() error {
	return db.session.
		Query("SELECT count(*) FROM system.local WHERE key='local' limit 1").
		Exec()
}

func (db *DB) Close() error {
	if db.session.Closed() {
		return errors.New("db has already been closed")
	}

	db.session.Close()
	return nil
}

func (db *DB) NotificationSettingsStore() *notificationSettingsStore {
	return db.notificationSettingsStore
}

func (db *DB) NotificationsStore() *notificationsStore {
	return db.notificationsStore
}
