package main

import (
	"io"

	"github.com/roverplatform/rover/audience/service/mongodb"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"os"
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

func dropCollections(colls ...*mgo.Collection) error {
	for _, coll := range colls {
		if err := coll.DropCollection(); err != nil {
			if err.Error() == "ns not found" {
				continue
			} else {
				return err
			}
		}
	}
	return nil
}

func loadFixture(coll *mgo.Collection, fixturePath string) error {
	f, err := os.Open(fixturePath)
	if err != nil {
		return err
	}

	docs, err := decodeBSON(f)
	if err != nil {
		return err
	}

	if err := coll.Insert(docs...); err != nil {
		return err
	}
	return nil
}

func decodeBSON(r io.Reader) ([]interface{}, error) {
	var (
		docs []interface{}
		dec  = mongodb.NewJSONBSONDecoder(r)
	)

	for {
		var doc bson.M
		if err := dec.Decode(&doc); err != nil {
			if err == io.EOF {
				return docs, nil
			}

			return nil, err
		}

		docs = append(docs, doc)
	}
}
