package main

import (
	"context"

	"flag"
	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"gopkg.in/mgo.v2/bson"
	"os"
)

type cmdDown struct {
	mongoDSN string
}

func (cmd *cmdDown) FlagSet() *flag.FlagSet {
	espFlags := flag.NewFlagSet("down", flag.ExitOnError)
	espFlags.StringVar(&cmd.mongoDSN, "mongo-dsn", "", "mongo DB Data Source Name")

	return espFlags
}

func (cmd *cmdDown) Run(ctx context.Context) error {
	if cmd.mongoDSN == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}

	var (
		sess, info = dialMongo(cmd.mongoDSN)

		db = sess.DB(info.Database)

		dynamicSegmentsColl = db.C("dynamic_segments")

		query   = bson.M{}
		segment mongodb.DynamicSegment

		totalUpdated int = 0
	)

	iter := dynamicSegmentsColl.Find(query).Iter()

	for iter.Next(&segment) {

		// Loop through predicates and convert the selector to custom profile
		var hasChanges = false

		if segment.PredicateAggregate == nil {
			continue
		}

		for _, predicate := range segment.PredicateAggregate.Predicates {
			if predicate.Selector == audience.Predicate_CUSTOM_DEVICE {
				hasChanges = true

				predicate.Selector = audience.Predicate_CUSTOM_PROFILE
			}
		}

		// Skip this predicate since it doesn't have any changes
		if hasChanges == false {
			continue
		}

		err := dynamicSegmentsColl.Update(bson.M{"_id": segment.Id}, segment)
		if err != nil {
			return err
		}

		totalUpdated++
		stdout.Printf("Updated: %d\n", totalUpdated)

	}

	stdout.Printf("Done!")

	return nil
}
