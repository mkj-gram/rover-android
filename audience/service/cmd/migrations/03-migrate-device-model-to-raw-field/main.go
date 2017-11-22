package main

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"log"
	"os"
	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/roverplatform/rover/audience/service/mongodb"
)

var (
	mongoDSN                    = flag.String("mongo-dsn", "", "mongo DSN")
	deviceModelMappingsFilename = flag.String("device-model-mappings-file", "", "device model mappings json file")

	stdout = log.New(os.Stdout, "", log.Ltime)
	stderr = log.New(os.Stderr, "error: ", log.Ltime|log.Lshortfile)
)

func main() {

	flag.Parse()

	if *mongoDSN == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}

	// we need a mappings file
	if *deviceModelMappingsFilename == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}

	var (
		deviceModelMappings map[string]string

		sess, info = dialMongo(*mongoDSN)

		db = sess.DB(info.Database)

		devicesColl = db.C("devices")

		query  = bson.M{}
		device *mongodb.Device

		totalUpdated int = 0
	)

	modelMappingsFile, err := ioutil.ReadFile(*deviceModelMappingsFilename)
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(modelMappingsFile, &deviceModelMappings)
	if err != nil {
		log.Fatal(err)
	}

	iter := devicesColl.Find(query).Iter()

	for iter.Next(&device) {

		update := bson.M{}

		// If we were successful in matching
		if commonName, ok := deviceModelMappings[device.DeviceModel]; ok {
			update["device_model"] = commonName
			update["device_model_raw"] = device.DeviceModel
		} else if device.DeviceModelRaw == "" {
			// Just copy over if it hasn't been copied before
			update["device_model_raw"] = device.DeviceModel
		}

		// Skip if there is no updates required
		if len(update) == 0 {
			continue
		}

		update["updated_at"] = time.Now()

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
