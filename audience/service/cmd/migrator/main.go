package main

import (
	"flag"
	"fmt"
	"log"
	"net/url"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/roverplatform/rover/audience/service/mongodb"
)

type Stats struct {
	NDups            int
	Tcustomers       int
	Tprofiles        int
	Tdevices         int
	TprofilesSchemas int
	Rate             float32
	Dur              time.Duration
	TDur             time.Duration
}

var (
	srcDSN    = flag.String("src-dsn", "", "source mongo DSN")
	destDSN   = flag.String("dest-dsn", "", "dest mongo DSN")
	batchSize = flag.Int("batchSize", 10000, "batch size")

	ensureIndex = flag.Bool("ensure-index", false, "ensure required indexes in dest DB")

	accountIds = flag.String("account-ids", "", "comma separated list of account ids to scope data migration to")

	timeNow  (func() time.Time)
	objectID (func() bson.ObjectId)
	sortKeys bool

	stdout = log.New(os.Stdout, "", log.Ltime)
	stderr = log.New(os.Stderr, "error: ", log.Ltime|log.Lshortfile)

	schemaCache = map[string]bool{}
)

func main() {

	flag.Parse()

	if *srcDSN == "" || *destDSN == "" {
		flag.PrintDefaults()
		os.Exit(1)
	}

	// ensure index and exit
	// needs to be run after the migration
	if *ensureIndex {
		destSess, err := mgo.Dial(*destDSN)
		if err != nil {
			stderr.Fatalln("dest:", err)
		}

		if err := mongodb.EnsureIndexes(destSess.DB(dbName(*destDSN))); err != nil {
			stderr.Fatalln("destDB:", err)
		}

		stdout.Println("Done")
		os.Exit(0)
	}

	timeNow = time.Now
	objectID = bson.NewObjectId

	srcSess, err := mgo.Dial(*srcDSN)
	if err != nil {
		stderr.Fatalln("src:", err)
	}

	destSess, err := mgo.Dial(*destDSN)
	if err != nil {
		stderr.Fatalln("dest:", err)
	}

	var (
		started  = time.Now()
		lastTime = started
		now      time.Time

		srcDb  = srcSess.DB(dbName(*srcDSN))
		destDb = destSess.DB(dbName(*destDSN))

		profiles_batch         = make([]interface{}, 0, *batchSize)
		devices_batch          = make([]interface{}, 0, *batchSize)
		profiles_schemas_batch = make([]interface{}, 0, *batchSize)

		stats Stats

		customersColl = srcDb.C("customers")

		profilesColl        = destDb.C("profiles")
		devicesColl         = destDb.C("devices")
		profilesSchemasColl = destDb.C("profiles_schemas")

		srcQ bson.M
	)

	if *accountIds != "" {
		var acctIds []int

		for _, str := range strings.Split(*accountIds, ",") {
			id, err := strconv.Atoi(str)
			if err != nil {
				stderr.Fatalln(err)
			}

			acctIds = append(acctIds, id)
		}

		srcQ = bson.M{
			"account_id": bson.M{"$in": acctIds},
		}
	}

	stdout.Println("Query:", srcQ)

	srcIter := customersColl.Find(srcQ).Iter()

	for !srcIter.Done() {
		var data map[string]interface{}
		if !srcIter.Next(&data) {
			if err := srcIter.Err(); err != nil {
				stderr.Panicln("iter.Next:", err)
			}
		}

		const N = 10000

		if stats.Tcustomers%N == 0 {
			now = time.Now()
			stats.Dur = now.Sub(lastTime)
			stats.Rate = (N / (float32(stats.Dur) / float32(time.Second)))
			lastTime = now
			stats.TDur = now.Sub(started)
			stdout.Printf("%+v", stats)
		}

		devices, err := toDevices(data)
		if err != nil {
			stderr.Printf("devices: %v %+v\n", err, data)
		} else {
			devices_batch = append(devices_batch, devices...)
		}

		profile, profileSchemas, err := toProfile(data, schemaCache)
		if err != nil {
			stderr.Printf("profile: %v %+v\n", err, data)
		} else {
			profiles_batch = append(profiles_batch, profile)
			profiles_schemas_batch = append(profiles_schemas_batch, profileSchemas...)
		}

		stats.Tcustomers += 1
		stats.Tprofiles += 1
		stats.Tdevices += len(devices)
		stats.TprofilesSchemas += len(profileSchemas)

		if len(profiles_batch) >= *batchSize {
			bulkInsert(&stats, profilesColl, profiles_batch...)
			bulkInsert(&stats, profilesSchemasColl, profiles_schemas_batch...)
			bulkInsert(&stats, devicesColl, devices_batch...)

			profiles_batch = profiles_batch[:0]
			profiles_schemas_batch = profiles_schemas_batch[:0]
			devices_batch = devices_batch[:0]
		}
	}

	stdout.Printf("Done: %+v", stats)
}

func bulkInsert(stats *Stats, coll *mgo.Collection, batch ...interface{}) {
	bulk := coll.Bulk()
	bulk.Unordered()
	bulk.Insert(batch...)
	_, err := bulk.Run()
	if err != nil {
		if err, ok := err.(*mgo.BulkError); ok {
			for _, err := range err.Cases() {
				if !mgo.IsDup(err.Err) {
					stderr.Fatalf("bulk.Insert: %s: %v: %v", coll.Name, err, batch[err.Index])
				}
			}
		}
	}
}

func dbName(dsn string) string {
	u, err := url.Parse(dsn)
	if err != nil {
		stderr.Panicln("url.Parse:", err)
	}

	return strings.TrimLeft(u.Path, "/")
}

// 7820052 "_id"
// 7820052 "account_id"
// 7211553 "age"
// 175329 "created_at"
// 7820050 "devices"
// 7820052 "document_bucket"
// 7059620 "email"
// 7058614 "first_name"
// 3224 "first_visit_at"
// 7059609 "gender"
// 1105276 "identifier"
// 254139 "imported"
// 7573329 "inbox_updated_at"
//    1 "last_location_visit_at"
//    1 "last_location_visit_id"
// 7058599 "last_name"
// 3224 "last_place_visit_at"
// 3224 "last_place_visit_id"
// 1015 "location"
// 1000 "name"
// 7058595 "phone_number"
// 7301091 "tags"
//  102 "total_location_visits"
// 5411 "total_place_visits"
// 5964749 "traits"
// 5338027 "updated_at"

func toProfile(data map[string]interface{}, schemaCache map[string]bool) (interface{}, []interface{}, error) {
	var (
		profileAttrs = map[string]bool{
			"_id":        true,
			"account_id": true,
			"created_at": true,
			"updated_at": true,
			"identifier": true,
		}

		ignoreAttrs = map[string]bool{
			"document_bucket":        true,
			"devices":                true,
			"inbox_updated_at":       true,
			"first_visit_at":         true,
			"last_location_visit_at": true,
			"last_location_visit_id": true,
			"last_place_visit_at":    true,
			"last_place_visit_id":    true,
			"total_location_visits":  true,
			"total_place_visits":     true,

			"name":     true,
			"location": true,

			// 1. take all attributes from traits and move into attributes
			// 2. looks like all of traits are empty
			"traits": true,
		}

		attrSchema = map[string]string{
			"imported":     "bool",
			"email":        "string",
			"tags":         "array[string]",
			"last_name":    "string",
			"first_name":   "string",
			"phone_number": "string",
			"age":          "integer",
			"gender":       "string",
		}

		schema []interface{}

		profile           = make(map[string]interface{})
		profileAttributes = make(map[string]interface{})
		keys              = make([]string, 0, len(data))
	)

	for k := range data {
		keys = append(keys, k)
	}

	if sortKeys {
		sort.Strings(keys)
	}

	for i := range keys {
		var k, v = keys[i], data[keys[i]]

		if _, ok := ignoreAttrs[k]; ok {
			continue
		}

		if _, ok := profileAttrs[k]; ok {
			profile[k] = v
			continue
		}

		if typ, ok := attrSchema[k]; ok {
			profileAttributes[k] = v

			key := fmt.Sprintf("%s:%s", data["account_id"], k)
			if _, ok := schemaCache[key]; ok {
				continue
			}

			schemaCache[key] = true
			schema = append(schema, map[string]interface{}{
				"_id":            objectID(),
				"account_id":     data["account_id"],
				"attribute":      k,
				"attribute_type": typ,
				"created_at":     timeNow(),
			})
			continue
		}

		stderr.Printf("unexpected attr: %s: %v", k, v)
	}

	profile["attributes"] = profileAttributes

	return profile, schema, nil
}

func toDevices(data map[string]interface{}) ([]interface{}, error) {
	switch devices := data["devices"].(type) {
	case nil:
		return nil, nil
	case []interface{}:
		var newDevices = make([]interface{}, 0, len(devices))
		for _, device := range devices {
			m, ok := device.(map[string]interface{})
			if !ok {
				continue
			}

			var device = toDevice(m, data)

			newDevices = append(newDevices, device)
		}
		return newDevices, nil

	}

	return nil, nil
}

// 265977 _id
// 245760 aid
// 119392 created_at
// 164273 updated_at
// 265977 app_identifier
// 265977 background_enabled
// 204803 beacon_regions_monitoring
// 191472 beacon_regions_monitoring_updated_at
// 265977 bluetooth_enabled
// 265836 carrier
// 265977 development
// 204836 geofence_regions_monitoring
// 192227 geofence_regions_monitoring_updated_at
// 163860 gimbal_mode
// 100438 ip
// 265976 locale_lang
// 265976 locale_region
// 204855 location
// 265977 location_monitoring_enabled
// 265976 manufacturer
// 265976 model
// 265977 os_name
// 265977 os_version
// 265977 platform
// 265977 sdk_version
// 265976 time_zone
// 253121 token
// TODO: ignore:
// 238233 notifications_enabled
// 132067 remote_notifications_enabled

func toVersion(vstr string) map[string]interface{} {
	var (
		vals = strings.Split(vstr, ".")
		ver  = make(map[string]interface{})
	)

	for i, k := range []string{"major", "minor", "revision"} {
		if i >= len(vals) {
			ver[k] = 0
			continue
		}

		var err error
		ver[k], err = strconv.Atoi(vals[i])
		if err != nil {
			stderr.Printf("%s: %v", vstr, err)
		}
	}

	return ver
}

func toDevice(oldDevice map[string]interface{}, customer map[string]interface{}) map[string]interface{} {
	var (
		od = oldDevice
		m  = make(map[string]interface{})
	)

	m["_id"] = objectID()

	m["account_id"] = customer["account_id"]
	m["profile_id"] = customer["_id"]
	m["device_id"] = od["_id"]

	m["created_at"] = od["created_at"]
	m["updated_at"] = od["updated_at"]

	if m["created_at"] == nil {
		m["created_at"] = customer["created_at"]
	}
	if m["updated_at"] == nil {
		m["updated_at"] = customer["updated_at"]
	}

	m["app_namespace"] = od["app_identifier"]

	m["advertising_id"] = od["aid"]
	m["push_token_key"] = od["token"]

	m["is_background_enabled"] = od["background_enabled"]
	m["is_bluetooth_enabled"] = od["bluetooth_enabled"]

	m["carrier_name"] = od["carrier"]
	m["ip"] = od["ip"]

	if os_name, ok := od["os_name"].(string); ok {
		switch os_name {
		case "Android":
			m["push_environment"] = "production"
		case "iOS":
			if v, ok := od["development"].(bool); ok && v == true {
				m["push_environment"] = "development"
			} else {
				m["push_environment"] = "production"
			}
		default:
			// log?
		}
	}

	m["os_name"] = od["os_name"]
	if _, ok := od["radio"]; ok {
		m["radio"] = od["radio"]
	}

	if ver, ok := od["os_version"].(string); ok {
		m["os_version"] = toVersion(ver)
	}

	m["region_monitoring_mode"] = "ROVER" //od["gimbal_mode"]
	m["locale_language"] = od["locale_lang"]
	m["locale_region"] = od["locale_region"]

	if loc, ok := od["location"].(map[string]interface{}); ok {
		m["location_accuracy"] = loc["accuracy"]
		m["location_longitude"] = loc["longitude"]
		m["location_latitude"] = loc["latitude"]
		m["location_updated_at"] = loc["timestamp"]
	}

	m["is_location_monitoring_enabled"] = od["location_monitoring_enabled"]

	m["device_manufacturer"] = od["manufacturer"]
	m["device_model"] = od["model"]

	// ignored
	//  od["notifications_enabled"]

	if val, ok := od["platform"]; ok {
		var p = "WEB"
		if val == "Android" || val == "iOS" {
			p = "MOBILE"
		}
		m["platform"] = p
	}

	if val, ok := od["sdk_version"].(string); ok {
		m["frameworks"] = map[string]interface{}{
			"io.rover.Rover": toVersion(val),
		}
	}

	m["time_zone"] = od["time_zone"]

	if val, ok := od["beacon_regions_monitoring"].([]interface{}); ok {
		m["ibeacon_monitoring_regions"] = toIbeaconRegions(val)
	}
	m["ibeacon_monitoring_regions_updated_at"] = od["beacon_regions_monitoring_updated_at"]

	m["geofence_monitoring_regions"] = od["geofence_regions_monitoring"]
	m["geofence_monitoring_regions_updated_at"] = od["geofence_regions_monitoring_updated_at"]

	return m
}

func toIbeaconRegions(regions []interface{}) []interface{} {
	var regs = make([]interface{}, len(regions))
	for i, val := range regions {
		reg, ok := val.(map[string]interface{})
		if !ok {
			stderr.Printf("iBeaconRegions: %#v\n", regions)
			continue
		}
		regs[i] = map[string]interface{}{
			"uuid":  reg["uuid"],
			"major": majmin(reg["major_number"]),
			"minor": majmin(reg["minor_number"]),
		}
	}

	return regs
}

func majmin(val interface{}) int {
	switch vv := val.(type) {
	case nil:
		return -1
	case string:
		v, _ := strconv.Atoi(vv)
		return v
	case int:
		return int(vv)
	case int32:
		return int(vv)
	case int64:
		return int(vv)
	default:
		return 0
	}
}
