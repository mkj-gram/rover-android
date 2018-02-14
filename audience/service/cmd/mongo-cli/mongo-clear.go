package main

import (
	"flag"

	"golang.org/x/net/context"
)

type cmdMongoClear struct {
	mongoDSN string
}

func (cmd *cmdMongoClear) FlagSet() *flag.FlagSet {
	espFlags := flag.NewFlagSet("mongo:clear", flag.ExitOnError)
	espFlags.StringVar(&cmd.mongoDSN, "mongo-dsn", "", "mongo DB Data Source Name")

	return espFlags
}

func (cmd *cmdMongoClear) Run(ctx context.Context) error {
	if cmd.mongoDSN == "" {
		cmd.FlagSet().PrintDefaults()
		return nil
	}

	// Get collections
	var (
		sess, info       = dialMongo(cmd.mongoDSN)
		mdb              = sess.DB(info.Database)
		profiles         = mdb.C("profiles")
		devices          = mdb.C("devices")
		profiles_schemas = mdb.C("profiles_schemas")
		dynamic_segments = mdb.C("dynamic_segments")
	)

	// Drop collections
	gotErr := dropCollections(profiles, devices, profiles_schemas, dynamic_segments)
	if gotErr != nil {
		stderr.Fatalf("Drop Collections: %v", gotErr)
	}

	return nil
}
