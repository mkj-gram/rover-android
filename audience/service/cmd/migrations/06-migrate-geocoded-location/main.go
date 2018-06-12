package main

import (
	"context"
	"flag"
	"log"
	"os"
	"time"

	"google.golang.org/grpc"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/roverplatform/rover/apis/go/geocoder/v1"
	"github.com/roverplatform/rover/audience/service/mongodb"
)

var (
	mongoDSN = flag.String("mongo-dsn", "", "mongo DSN")

	geocoderServiceDsn = flag.String("geocoder-service-dsn", "geocoder:5100", "Geocoder Service DSN")

	stdout = log.New(os.Stdout, "", log.Ltime)
	stderr = log.New(os.Stderr, "error: ", log.Ltime|log.Lshortfile)
)

func main() {
	flag.Parse()

	if *mongoDSN == "" || *geocoderServiceDsn == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}

	var (
		sess, info = dialMongo(*mongoDSN)
		db         = sess.DB(info.Database)

		devicesColl = db.C("devices")

		query = bson.M{
			"location_longitude": bson.M{"$ne": 0},
			"location_latitude":  bson.M{"$ne": 0},
		}

		device *mongodb.Device

		totalUpdated int = 0
	)
	// Context
	ctx, cancelFunc := context.WithCancel(context.Background())
	defer cancelFunc()

	// Geocoding
	geocoderConn, err := grpc.Dial(*geocoderServiceDsn, grpc.WithInsecure())
	if err != nil {
		stderr.Fatal(err)
	}
	geocoderClient := geocoder.NewGeocoderClient(geocoderConn)

	iterator := devicesColl.Find(query).Iter()
	for iterator.Next(&device) {

		if device.LocationLatitude == 0 && device.LocationLongitude == 0 {
			continue
		}

		geocodeResponse, err := geocoderClient.ReverseGeocode(ctx, &geocoder.ReverseGeocodeRequest{
			Latitude:  device.LocationLatitude,
			Longitude: device.LocationLongitude,
		})

		if err != nil {
			stderr.Print(err)
			continue
		}

		update := bson.M{}
		update["location_country"] = geocodeResponse.GetCountry()
		update["location_state"] = geocodeResponse.GetState()
		update["location_city"] = geocodeResponse.GetCity()
		update["updated_at"] = time.Now()

		err = devicesColl.Update(bson.M{"_id": device.Id}, bson.M{"$set": update})

		if err != nil {
			stderr.Print(err)
			continue
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
