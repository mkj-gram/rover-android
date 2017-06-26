package mongo

import (
	"time"

	"github.com/roverplatform/rover/go/log"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type (
	DB struct {
		*profilesStore
		*devicesStore
	}

	Option func(s *mongoStore)

	mongoStore struct {
		db *mgo.Database

		log         log.Interface
		newObjectId func() bson.ObjectId
		timeNow     func() time.Time

		profiles         *mgo.Collection
		devices          *mgo.Collection
		profiles_schemas *mgo.Collection
	}
)

func NewDB(db *mgo.Database, options ...Option) *DB {
	ms := &mongoStore{
		db: db,

		profiles:         db.C("profiles"),
		profiles_schemas: db.C("profiles_schemas"),
		devices:          db.C("devices"),
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
		profilesStore: &profilesStore{ms},
		devicesStore:  &devicesStore{ms},
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
