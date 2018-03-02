package main

import (
	"crypto/rand"
	"encoding/csv"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"strings"
	"time"

	"github.com/pkg/errors"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/roverplatform/rover/audience/service/mongodb"
)

var (
	mongoDSN    = flag.String("mongo-dsn", "", "mongo DSN")
	csvFilePath = flag.String("csv-file-path", "", "path to csv file")
	accountId   = flag.Int("account-id", 0, "account id to import tokens to")

	stdout = log.New(os.Stdout, "", log.Ltime)
	stderr = log.New(os.Stderr, "Err: ", log.Ltime|log.Lshortfile)
)

func main() {
	flag.Parse()

	if *mongoDSN == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}

	if *csvFilePath == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}

	if *accountId == 0 {
		flag.PrintDefaults()
		os.Exit(1)
	}

	var (
		sess, info = dialMongo(*mongoDSN)

		db = sess.DB(info.Database)
	)

	/*
		Devices that have been imported have "imported": Date property. Ensure the devices_schemas has this
	*/
	err := ensureSchemaAttribute(db.C("devices_schemas"), *accountId, "imported", "timestamp", "Imported")
	if err != nil {
		stderr.Fatalf("Failed to add 'imported' to device schema: %s", err.Error())
	}

	file, err := os.Open(*csvFilePath)
	if err != nil {
		stderr.Fatalf("Failed to open csv file: %v", err)
	}

	defer file.Close()

	reader := csv.NewReader(file)

	var (
		linecount = 0
		inserted  = 0
		errored   = 0
	)

	for {

		row, err := reader.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			stderr.Printf("Failed to read line: [%d], %v\n", linecount, err)
			continue
		}

		linecount++

		if len(row) != 2 {
			stderr.Printf("Row: [%d] must have 2 columns got: %d", linecount, len(row))
			continue
		}

		/*
			CSV file structure
			PushToken,OsType
		*/
		var (
			pushToken = row[0]
			osType    = row[1]

			now = time.Now()
		)

		if osType != "Android" && osType != "iOS" {
			stderr.Printf("Row: [%d] undetermined os type: %s", linecount, osType)
			continue
		}

		device := mongodb.Device{
			Id:        bson.NewObjectId(),
			AccountId: int32(*accountId),
			DeviceId:  pseudoUuid(),
			CreatedAt: &now,
			UpdatedAt: &now,

			Attributes: map[string]interface{}{
				"imported": &now,
			},

			PushEnvironment:         "production",
			PushTokenKey:            pushToken,
			PushTokenIsActive:       true,
			PushTokenCreatedAt:      &now,
			PushTokenUpdatedAt:      &now,
			PushTokenUnregisteredAt: nil,

			OsName: osType,
		}

		err = db.C("devices").Insert(device)
		if err != nil {
			stderr.Printf("Row: [%d] failed to be inserted: %v", linecount, err)
			errored++
		} else {
			inserted++
		}

		if linecount%1000 == 0 {
			stdout.Println("Read:", linecount)
		}
	}

	stdout.Printf("Done! Read: %d, Inserted: %d, Errored: %d", linecount, inserted, errored)
}

func ensureSchemaAttribute(col *mgo.Collection, accountId int, attribute string, attributeType string, label string) error {
	var schemaAttribute mongodb.SchemaAttribute

	err := col.Find(bson.M{"account_id": accountId, "attribute": attribute}).One(&schemaAttribute)
	if err != nil {
		if err == mgo.ErrNotFound {
			return createSchemaAttribute(col, accountId, attribute, attributeType, label)
		} else {
			return err
		}
	}

	if schemaAttribute.AttributeType != attributeType {
		return errors.Errorf("SchemaAttribute exists but has a different type want: %s got: %s", attributeType, schemaAttribute.AttributeType)
	}

	return nil
}

func createSchemaAttribute(col *mgo.Collection, accountId int, attribute string, attributeType string, label string) error {
	schemaAttribute := mongodb.SchemaAttribute{
		Id:            bson.NewObjectId(),
		AccountId:     int32(accountId),
		Attribute:     attribute,
		AttributeType: attributeType,
		Label:         label,
		CreatedAt:     time.Now(),
	}

	return col.Insert(schemaAttribute)
}

func pseudoUuid() (uuid string) {

	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		stderr.Println("Error: ", err)
		return
	}

	uuid = strings.ToUpper(fmt.Sprintf("%X-%X-%X-%X-%X", b[0:4], b[4:6], b[6:8], b[8:10], b[10:]))

	return
}
