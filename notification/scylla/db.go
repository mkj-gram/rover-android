package scylla

import (
	"github.com/gocql/gocql"
	"github.com/pkg/errors"
)

type store struct {
	session *gocql.Session
}

type DB struct {
	session *gocql.Session

	notificationSettingStore *notificationSettingsStore
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

func NewFromSession(session *gocql.Session) *DB {
	return &DB{
		session:                  session,
		notificationSettingStore: &notificationSettingsStore{session: session},
	}
}

func (db *DB) Close() error {
	if db.session.Closed() {
		return errors.New("db has already been closed")
	}

	db.session.Close()
	return nil
}

func (db *DB) NotificationSettingsStore() *notificationSettingsStore {
	return db.notificationSettingStore
}
