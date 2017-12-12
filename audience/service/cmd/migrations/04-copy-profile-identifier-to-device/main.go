// ms-12:
// migration copies profile.identifier -> device(s).profile_identifier
package main

import (
	"flag"
	"log"
	"os"
	"time"

	"github.com/roverplatform/rover/audience/service/mongodb"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var (
	mongoDSN  = flag.String("mongo-dsn", "", "mongo DSN")
	batchSize = flag.Int("batch-size", 1000, "insert batch size")

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

		devicesColl  = db.C("devices")
		profilesColl = db.C("profiles")

		profile mongodb.Profile

		bulk = devicesColl.Bulk()

		Q        = profilesColl.Find(nil)
		total, _ = Q.Count()

		count, prev int
		currBatch   int

		since = time.Now()
		t     = time.NewTicker(2 * time.Second)
	)

	stdout.Println("EnsureIndexes:")
	if err := mongodb.EnsureIdempotentIndexes(db, true); err != nil {
		stderr.Fatalln("ensureIndexes", err)
	}

	stdout.Println("Starting:")
	for iter := Q.Iter(); iter.Next(&profile); {
		var (
			selector = bson.M{"profile_id": profile.Id, "profile_identifier": bson.M{"$exists": false}}
			update   = bson.M{"$set": bson.M{
				"profile_identifier": profile.Identifier,
			}}
		)

		if err := iter.Err(); err != nil {
			stderr.Println("[profile2device] profiles.Iter:", err)
			continue
		}

		select {
		case <-t.C:
			var (
				now     = time.Now()
				dt      = now.Sub(since)
				dp      = count - prev
				remains = total - count
				rate    = float32(dp) / float32(dt)
				eta     = time.Duration(float32(remains)/rate) / time.Second
			)

			since, prev = now, count

			stdout.Printf("done=%.2f%% remains=%v rate=%v/s eta=%v\n", float32(count)/float32(total)*100, remains, (rate * float32(time.Second)), time.Duration(eta)*time.Second)
		default:
		}

		bulk.UpdateAll(selector, update)

		currBatch++
		count++

		if count%(*batchSize) == 0 {
			if _, err := bulk.Run(); err != nil {
				if err, ok := err.(*mgo.BulkError); ok {
					for _, err := range err.Cases() {
						if !mgo.IsDup(err.Err) {
							stderr.Fatalf("bulk.Insert: %s: %v", devicesColl.Name, err)
						}
					}
				}
			}

			// new bulk
			bulk = devicesColl.Bulk()
			currBatch = 0
		}
	}

	// ensure last batch is written
	if currBatch > 0 {
		if _, err := bulk.Run(); err != nil {
			if err, ok := err.(*mgo.BulkError); ok {
				for _, err := range err.Cases() {
					if !mgo.IsDup(err.Err) {
						stderr.Fatalf("bulk.Insert: %s: %v", devicesColl.Name, err)
					}
				}
			}
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
