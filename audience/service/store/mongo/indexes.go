package mongo

import (
	"fmt"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func EnsureIndexes(db *mgo.Database) error {

	var indexes = []struct {
		coll  *mgo.Collection
		index mgo.Index
	}{
		// ProfileSchema
		{
			db.C("profiles_schemas"),
			mgo.Index{
				Key:    []string{"account_id", "attribute"},
				Unique: true,
			},
		},

		// Profiles
		{
			db.C("profiles"),
			mgo.Index{
				Key:    []string{"account_id", "identifier"},
				Unique: true,
				PartialFilterExpression: bson.M{
					"identifier": bson.M{"$exists": true},
				},
			},
		},
		/// Devices
		{
			db.C("devices"),
			mgo.Index{
				Key:    []string{"device_id", "account_id"},
				Unique: true,
			},
		},
		{
			db.C("devices"),
			mgo.Index{
				Key:    []string{"device_token_key", "account_id"},
				Unique: true,
				PartialFilterExpression: bson.M{
					"device_token_key": bson.M{"$exists": true, "$type": "string"},
				},
			},
		},
		{
			db.C("devices"),
			mgo.Index{
				Key:    []string{"profile_id"},
				Unique: false,
			},
		},
	}

	for _, idx := range indexes {
		if err := idx.coll.EnsureIndex(idx.index); err != nil {
			return wrapError(err, fmt.Sprintf("EnsureIndex: %q: %v", idx.coll.Name, idx.index.Key))
		}
	}

	return nil
}
