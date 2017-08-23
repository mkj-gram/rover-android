package mongodb

import (
	"context"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type devicesCounterCaches struct {
	*mongoStore
}

func (s *devicesCounterCaches) GetDevicesTotalCount(ctx context.Context, account_id int32) (int64, error) {
	c := &IntCounter{s.devices_counts()}
	val, err := c.Get(account_id)
	return val, wrapError(err, "devices_counts")
}

type profilesCounterCaches struct {
	*mongoStore
}

func (s *profilesCounterCaches) GetProfilesTotalCount(ctx context.Context, account_id int32) (int64, error) {
	c := &IntCounter{s.profiles_counts()}
	val, err := c.Get(account_id)
	return val, wrapError(err, "profiles_counts")
}

// > db.devices.aggregate([ {"$group" : {_id:"$account_id", value:{$sum:1}}}, { $sort: { _id: 1 }} ])
// { "_id" : 1, "value" : 216 }
// { "_id" : 2, "value" : 58 }
// ...
// { "_id" : 30, "value" : 456765 }

// IntCounter implements a mongo backed counter cache
type IntCounter struct {
	coll *mgo.Collection
}

func (cc *IntCounter) Add(key int32, delta int64) error {
	_, err := cc.coll.UpsertId(key,
		bson.M{"$inc": bson.M{"value": delta}},
	)
	return wrapError(err, "coll.Upsert")
}

func (cc *IntCounter) Sub(key int32, delta int64) error {
	return cc.Add(key, -delta)
}

func (cc *IntCounter) Get(key int32) (int64, error) {
	var record bson.M

	if err := cc.coll.FindId(key).One(&record); err != nil {
		return 0, wrapError(err, "coll.FindId")
	}

	switch val := record["value"].(type) {
	case int:
		return int64(val), nil
	case int64:
		return val, nil
	}

	errorf("counter_cache: invalid: %v", record)
	return 0, nil
}

func (cc *IntCounter) Set(key int32, val int64) error {
	_, err := cc.coll.UpsertId(key,
		bson.M{"$set": bson.M{"value": val}},
	)
	return wrapError(err, "coll.Upsert")
}

func RefreshCache(coll, cacheColl *mgo.Collection) error {
	var (
		pipe = coll.Pipe([]bson.M{
			{"$group": bson.M{
				"_id": "$account_id", "value": bson.M{"$sum": 1}},
			},
		})

		resp []bson.M
	)

	// since accounts number is order of 10^3 it's ok to load all at once
	if err := pipe.All(&resp); err != nil {
		return wrapError(err, "fetch")
	}

	bulk := cacheColl.Bulk()
	for i := range resp {
		bulk.Upsert(bson.M{"_id": resp[i]["_id"]}, resp[i])
	}
	bulk.Unordered()
	_, err := bulk.Run()

	return wrapError(err, "insert")
}
