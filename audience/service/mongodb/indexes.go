package mongodb

import (
	"fmt"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func EnsureIndexes(db *mgo.Database) error {
	return EnsureIdempotentIndexes(db, false)
}

func EnsureIdempotentIndexes(db *mgo.Database, onlyIdempotent bool) error {

	var indexes = []struct {
		skip  bool
		coll  *mgo.Collection
		index mgo.Index
	}{
		// ProfileSchema
		{
			coll: db.C("profiles_schemas"),
			index: mgo.Index{
				Key:    []string{"account_id", "attribute"},
				Unique: true,
			},
		},

		// Profiles
		{
			coll: db.C("profiles"),
			index: mgo.Index{
				Key:    []string{"account_id", "identifier"},
				Unique: true,
				PartialFilterExpression: bson.M{
					"identifier": bson.M{"$exists": true},
				},
			},
		},

		// DeviceSchema
		{
			coll: db.C("devices_schemas"),
			index: mgo.Index{
				Key:    []string{"account_id", "attribute"},
				Unique: true,
			},
		},

		/// Devices
		{
			coll: db.C("devices"),
			index: mgo.Index{
				Key:    []string{"device_id", "account_id"},
				Unique: true,
			},
		},
		{
			// NOTE: this is a valid index, but it fails at being idempotent
			skip: onlyIdempotent,
			coll: db.C("devices"),
			index: mgo.Index{
				Key:    []string{"push_token_key", "account_id"},
				Unique: true,
				PartialFilterExpression: bson.M{
					"push_token_key": bson.M{"$exists": true, "$type": "string"},
				},
			},
		},
		{
			coll: db.C("devices"),
			index: mgo.Index{
				Key:    []string{"profile_id"},
				Unique: false,
			},
		},

		{
			coll: db.C("devices"),
			index: mgo.Index{
				Key:    []string{"account_id", "profile_identifier"},
				Unique: false,
			},
		},

		// dynamic_segments
		{
			coll: db.C("dynamic_segments"),
			index: mgo.Index{
				Key:    []string{"account_id"},
				Unique: false,
			},
		},
	}

	for _, idx := range indexes {
		if idx.skip {
			continue
		}
		if err := idx.coll.EnsureIndex(idx.index); err != nil {
			return wrapError(err, fmt.Sprintf("EnsureIndex: %q: %v", idx.coll.Name, idx.index.Key))
		}
	}

	return nil
}
