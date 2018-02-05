package mongodb

import (
	"time"

	"github.com/roverplatform/rover/go/log"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type (
	DB struct {
		store *mongoStore

		*profilesStore
		*devicesStore
		*dynamicSegmentsStore
	}

	Option func(s *mongoStore)

	mongoStore struct {
		dbName string
		sess   *mgo.Session

		log         log.Interface
		newObjectId func() bson.ObjectId
		timeNow     func() time.Time
	}
)

func New(db *mgo.Database, options ...Option) *DB {
	sess := db.Session
	ms := &mongoStore{
		sess:   sess,
		dbName: db.Name,
	}

	for _, op := range options {
		op(ms)
	}

	if ms.newObjectId == nil {
		ms.newObjectId = bson.NewObjectId
	}

	if ms.log == nil {
		ms.log = log.NewLog(log.Error)
	}

	if ms.timeNow == nil {
		ms.timeNow = time.Now
	}

	return &DB{
		store: ms,

		profilesStore:        &profilesStore{ms},
		devicesStore:         &devicesStore{ms},
		dynamicSegmentsStore: &dynamicSegmentsStore{ms},
	}
}

func (db DB) SetModeStrong() {
	db.store.sess.SetMode(mgo.Strong, false)
}

func (db DB) ModeRefresh() {
	db.store.sess.Refresh()
}

// Set the mgo session to majority
// https://docs.mongodb.com/manual/reference/write-concern/
// Requests acknowledgement that write operations have propagated to the majority of voting nodes, including the primary.
func (db DB) SetSafeMode() {
	db.store.sess.SetSafe(&mgo.Safe{WMode: "majority"})
}

func (db *DB) Close() {
	db.store.sess.Close()
}

// make sure to close
func (db *DB) Copy() *DB {
	sess := db.store.sess.Copy()

	ms := &mongoStore{
		sess:   sess,
		dbName: db.store.dbName,

		log:         db.store.log,
		timeNow:     db.store.timeNow,
		newObjectId: db.store.newObjectId,
	}

	return &DB{
		store: ms,

		profilesStore:        &profilesStore{ms},
		devicesStore:         &devicesStore{ms},
		dynamicSegmentsStore: &dynamicSegmentsStore{ms},
	}
}

func WithObjectIDFunc(fn func() bson.ObjectId) Option {
	return func(s *mongoStore) {
		s.newObjectId = fn
	}
}

func WithTimeFunc(fn func() time.Time) Option {
	return func(s *mongoStore) {
		s.timeNow = fn
	}
}

func WithLogger(l log.Interface) Option {
	return func(s *mongoStore) {
		s.log = l
	}
}

func (ds *mongoStore) devices() *mgo.Collection {
	return ds.sess.DB(ds.dbName).C("devices")
}

func (ds *mongoStore) profiles() *mgo.Collection {
	return ds.sess.DB(ds.dbName).C("profiles")
}

func (ds *mongoStore) profiles_schemas() *mgo.Collection {
	return ds.sess.DB(ds.dbName).C("profiles_schemas")
}

func (ds *mongoStore) devices_schemas() *mgo.Collection {
	return ds.sess.DB(ds.dbName).C("devices_schemas")
}

func (ds *mongoStore) dynamic_segments() *mgo.Collection {
	return ds.sess.DB(ds.dbName).C("dynamic_segments")
}
