package main

import (
	"flag"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"os"
)

var (
	mongoDSN = flag.String("mongo-dsn", "", "mongo DSN")

	stdout = log.New(os.Stdout, "", log.Ltime)
	stderr = log.New(os.Stderr, "error: ", log.Ltime|log.Lshortfile)
)

func main() {

	flag.Parse()

	if *mongoDSN == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}

	var (
		sess, info = dialMongo(*mongoDSN)

		db = sess.DB(info.Database)

		devicesColl = db.C("devices")

		query  = bson.M{"created_at": nil}
		device *mongodb.Device

		totalUpdated int = 0
	)

	stdout.Println("Query:", query)

	iter := devicesColl.Find(query).Iter()

	for iter.Next(&device) {

		createdAt := device.ProfileId.Time()

		update := bson.M{
			"created_at": createdAt,
		}

		if device.UpdatedAt == nil {
			update["updated_at"] = createdAt
		}

		err := devicesColl.Update(bson.M{"_id": device.Id}, bson.M{"$set": update})
		if err != nil {
			stderr.Print(err)
		}

		totalUpdated++

		if totalUpdated%1000 == 0 {
			stdout.Printf("Updated: %d\n", totalUpdated)
		}

	}

	stdout.Printf("Done!")
}

func dialMongo(dsn string) (*mgo.Session, *mgo.DialInfo) {
	stdout.Println("Connecting to mongo")

	dialInfo, err := mongodb.ParseURL(dsn)
	if err != nil {
		stderr.Fatalln("mongodb:", err)
	}

	sess, err := mgo.DialWithInfo(dialInfo)
	if err != nil {
		stderr.Fatalf("mgo.Dial: DSN=%q error=%q", dsn, err)
	}

	stdout.Println("Connected to mongo")
	return sess, dialInfo
}
