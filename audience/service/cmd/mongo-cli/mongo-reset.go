package main

import (
	"flag"

	"golang.org/x/net/context"
	"gopkg.in/mgo.v2/bson"
)

type cmdMongoReset struct {
	accountID int
	mongoDSN  string
}

func (cmd *cmdMongoReset) FlagSet() *flag.FlagSet {
	espFlags := flag.NewFlagSet("mongo:reset", flag.ExitOnError)
	espFlags.IntVar(&cmd.accountID, "account-id", -1, "Account to purge data")
	espFlags.StringVar(&cmd.mongoDSN, "mongo-dsn", "", "mongo DB Data Source Name")

	return espFlags
}

func (cmd *cmdMongoReset) Run(ctx context.Context) error {
	if cmd.accountID < 0 || cmd.mongoDSN == "" {
		cmd.FlagSet().PrintDefaults()
		return nil
	}

	// Create named collection values
	var (
		sess, info      = dialMongo(cmd.mongoDSN)
		mdb             = sess.DB(info.Database)
		profiles        = mdb.C("profiles")
		devices         = mdb.C("devices")
		profilesSchemas = mdb.C("profiles_schemas")
	)

	if _, err := profiles.RemoveAll(bson.M{"account_id": cmd.accountID}); err != nil {
		stderr.Fatalf("Remove profiles")
	}

	if _, err := devices.RemoveAll(bson.M{"account_id": cmd.accountID}); err != nil {
		stderr.Fatalf("Remove devices")
	}

	if _, err := profilesSchemas.RemoveAll(bson.M{"account_id": cmd.accountID}); err != nil {
		stderr.Fatalf("Remove profiles schemas")
	}

	return nil
}
