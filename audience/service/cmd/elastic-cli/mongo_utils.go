package main

import (
	"github.com/roverplatform/rover/audience/service/mongodb"
	mgo "gopkg.in/mgo.v2"
)

func dialMongo(dsn string) (*mgo.Session, *mgo.DialInfo) {
	dialInfo, err := mongodb.ParseURL(dsn)
	if err != nil {
		stderr.Fatalln("mongodb:", err)
	}

	sess, err := mgo.DialWithInfo(dialInfo)
	if err != nil {
		stderr.Fatalf("mgo.Dial: DSN=%q error=%q", dsn, err)
	}

	return sess, dialInfo
}

func getProfileSchemas(db *mgo.Database) map[int][]*mongodb.SchemaAttribute {
	var (
		attrs []*mongodb.SchemaAttribute
		m     = make(map[int][]*mongodb.SchemaAttribute)
	)

	err := db.C("profiles_schemas").Find(nil).Sort("account_id").All(&attrs)
	if err != nil {
		stderr.Fatalln("mongo.Find:", err)
	}

	for _, attr := range attrs {
		m[int(attr.AccountId)] = append(m[int(attr.AccountId)], attr)
	}

	return m
}
