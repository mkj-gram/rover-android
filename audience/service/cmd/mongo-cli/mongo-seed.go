package main

import (
	"flag"

	"golang.org/x/net/context"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	mongod "github.com/roverplatform/rover/audience/service/mongodb"
)

type cmdMongoSeed struct {
	accountID        int
	devices          int
	sourceMongoDSN   string
	receiverMongoDSN string
	sourceAccountID  int
}

func (cmd *cmdMongoSeed) FlagSet() *flag.FlagSet {
	espFlags := flag.NewFlagSet("mongo:seed", flag.ExitOnError)
	espFlags.IntVar(&cmd.accountID, "account-id", -1, "Account to populate devices")
	espFlags.IntVar(&cmd.devices, "devices", -1, "Number of devices to populate")
	espFlags.StringVar(&cmd.sourceMongoDSN, "source-mongo-dsn", "", "mongo DB Data Source Name")
	espFlags.StringVar(&cmd.receiverMongoDSN, "receiver-mongo-dsn", "", "mongo DB Data Receiver Name")
	espFlags.IntVar(&cmd.sourceAccountID, "source-account-id", 110, "Account ID to seed data from")

	return espFlags
}

func addDevicesAndProfiles(acctID int, srcAcctID int, devices int, srcDevicesColl *mgo.Collection, rcvrDevicesColl *mgo.Collection, srcProfilesColl *mgo.Collection, rcvrProfilesColl *mgo.Collection) {
	var (
		item  *mongod.Device
		dev   *mongod.Device
		count = 0
	)

	// Read values from src account (Default: account 110 as it has a lot of data)
	documents := srcDevicesColl.Find(bson.M{"account_id": srcAcctID})

	items := documents.Iter()
	for items.Next(&item) {
		// Ensure document is not in receiver
		if err := rcvrDevicesColl.Find(bson.M{"device_id": item.DeviceId, "account_id": acctID}).One(&dev); err != nil {
			if err.Error() == "not found" {
				// Update fields in document
				item.AccountId = int32(acctID)
				item.Id = bson.NewObjectId()

				// Create new objectID
				profileID := item.ProfileId
				genProfileID := bson.NewObjectId()
				item.ProfileId = genProfileID

				addProfile(acctID, srcAcctID, profileID, genProfileID, srcProfilesColl, rcvrProfilesColl)

				// Add document to receiver
				err := rcvrDevicesColl.Insert(item)
				if err != nil {
					stderr.Fatalf("Add device document to receiver: %v", err)
				}

				count++
			} else {
				stderr.Fatalf("Check device document in receiver: %v", err)
			}
		}

		if count == devices {
			return
		}
	}
	if items.Done() == true {
		stderr.Fatalf("Not enough devices in source Mongo")
	}

	return
}

func addProfile(acctID int, srcAcctID int, profileID bson.ObjectId, genProfileID bson.ObjectId, srcProfilesColl *mgo.Collection, rcvrProfilesColl *mgo.Collection) {
	var prof *mongod.Profile

	// Check if document in rcvr
	if err := rcvrProfilesColl.Find(bson.M{"account_id": acctID, "_id": genProfileID}).One(&prof); err != nil {
		if err.Error() == "not found" {
			// Find document from source
			if err := srcProfilesColl.Find(bson.M{"account_id": srcAcctID, "_id": profileID}).One(&prof); err != nil {
				if err.Error() == "not found" {
					stderr.Fatalf("Profile: %v not found", profileID)
				}
				stderr.Fatalf("Source Profile fetch document: %v", err)
			}

			// Update field
			prof.AccountId = int32(acctID)
			prof.Id = genProfileID

			// Add document to receiver
			err := rcvrProfilesColl.Insert(prof)
			if err != nil {
				stderr.Fatalf("Add document to receiver: %v", err)
			}
		}
	}

}

func addProfileSchemas(acctID int, srcAcctID int, srcProfilesSchemasColl *mgo.Collection, rcvrProfilesSchemasColl *mgo.Collection) {
	var item *mongod.SchemaAttribute
	var rcvrItem *mongod.SchemaAttribute

	// Read values from src account (Default: account 110 as it has a lot of data)
	documents := srcProfilesSchemasColl.Find(bson.M{"account_id": srcAcctID})

	items := documents.Iter()

	for items.Next(&item) {
		// Check if document in receiver
		err := rcvrProfilesSchemasColl.Find(bson.M{"account_id": acctID, "attribute": item.Attribute}).One(&rcvrItem)
		if err != nil {
			if err.Error() == "not found" {
				// Update fields in document
				item.AccountId = int32(acctID)
				item.Id = bson.NewObjectId()

				// Add to receiver
				err := rcvrProfilesSchemasColl.Insert(item)
				if err != nil {
					stderr.Fatalf("Add profile schema document to receiver: %v", err)
				}
			} else {
				stderr.Fatalf("Find profile schema in receiver: %v", err)
			}
		} else {
			// If document exists, check if attribute_type is same, else end operation
			if item.AttributeType != rcvrItem.AttributeType {
				stderr.Fatalf("Expected type: '%s' but got type: '%s' for attribute: '%s'", rcvrItem.AttributeType, item.AttributeType, item.Attribute)
			}
		}
	}
}

func (cmd *cmdMongoSeed) Run(ctx context.Context) error {
	if cmd.accountID < 0 || cmd.devices < 0 || cmd.sourceMongoDSN == "" || cmd.receiverMongoDSN == "" {
		cmd.FlagSet().PrintDefaults()
		return nil
	}

	// Connect to source and receiver DB
	srcSess, srcInfo := dialMongo(cmd.sourceMongoDSN)
	srcDB := srcSess.DB(srcInfo.Database)

	rcvrSess, rcvrInfo := dialMongo(cmd.receiverMongoDSN)
	rcvrDB := rcvrSess.DB(rcvrInfo.Database)

	stdout.Println("Connected to Source and Receiver DBs")

	var (
		rcvrProfilesColl        = rcvrDB.C("profiles")
		rcvrDevicesColl         = rcvrDB.C("devices")
		rcvrProfilesSchemasColl = rcvrDB.C("profiles_schemas")

		srcProfilesColl        = srcDB.C("profiles")
		srcDevicesColl         = srcDB.C("devices")
		srcProfilesSchemasColl = srcDB.C("profiles_schemas")
	)

	// Add profile schemas
	addProfileSchemas(cmd.accountID, cmd.sourceAccountID, srcProfilesSchemasColl, rcvrProfilesSchemasColl)

	// Add device and profile documents
	addDevicesAndProfiles(cmd.accountID, cmd.sourceAccountID, cmd.devices, srcDevicesColl, rcvrDevicesColl, srcProfilesColl, rcvrProfilesColl)

	return nil
}
