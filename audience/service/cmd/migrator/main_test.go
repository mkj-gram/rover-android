package main

import (
	"encoding/hex"
	"io"
	"math/rand"
	"os"
	"strings"
	"testing"
	"time"

	"gopkg.in/mgo.v2/bson"

	"github.com/go-test/deep"
	"github.com/roverplatform/rover/audience/service/mongodb"
)

func TestConversion_Device(t *testing.T) {
	// override
	objectID = tNewObjectIdFunc(t, 0)

	tcases := []struct {
		customer map[string]interface{}
		exp      interface{}
		expErr   error
	}{
		{
			customer: read(t, open(t, "testdata/customer-57ec6f.json")),

			exp: []interface{}{

				map[string]interface{}{
					"_id":        bson.ObjectIdHex("0194fdc2fa2ffcc041d3ff12"),
					"device_id":  "9B48E7E3-1992-4F8A-A47A-434B522384B5",
					"account_id": int64(30),
					"profile_id": bson.ObjectIdHex("57ec6f434794ea0035dddc31"),

					"created_at": parseTime(t, "2016-09-29T01:32:51.052Z"),
					"updated_at": parseTime(t, "2016-09-29T01:32:51.062Z"),

					"advertising_id": "8BC1242B-3FE3-49D1-80CF-3BE9469CEC30",
					"app_namespace":  "com.yinzcam.testnavtest",

					"is_background_enabled": true,
					"is_bluetooth_enabled":  true,

					"os_name":          "iOS",
					"aps_environment":  "production",
					"device_token_key": "EF20600869F5065CEFF36871BCBE0461BD5C9A2B44E207765114A3E35009C99C",

					"carrier_name":           "verizon",
					"region_monitoring_mode": "ROVER",
					"locale_language":        "en",
					"locale_region":          "us",
					"ip":                     "108.39.156.65",

					"is_location_monitoring_enabled": false,
					"device_manufacturer":            "Apple",
					"device_model":                   "iPhone5,3",
					// IGNORED
					// "notifications_enabled":       nil,
					"os_version": map[string]interface{}{"major": 10, "minor": 3, "revision": 2},
					"platform":   "MOBILE",

					"frameworks": map[string]interface{}{
						"Rover": map[string]interface{}{"major": 1, "minor": 6, "revision": 2},
					},
					"time_zone": "America/New_York",

					"geofence_monitoring_regions":            []interface{}{},
					"geofence_monitoring_regions_updated_at": nil,
					"ibeacon_monitoring_regions":             []interface{}{},
					"ibeacon_monitoring_regions_updated_at":  nil,
				},
				map[string]interface{}{
					"_id":        bson.ObjectIdHex("045b73c86e4ff95ff662a5ee"),
					"account_id": int64(30),
					"profile_id": bson.ObjectIdHex("57ec6f434794ea0035dddc31"),
					"device_id":  "A6DEE670-F245-44DB-94B6-87E00D0DED5B",

					"created_at": parseTime(t, "2016-09-29T01:32:51.052Z"),
					"updated_at": parseTime(t, "2016-10-02T23:29:08.035Z"),

					"ip": "1.2.3.4",

					"advertising_id": "37F012EF-2024-490B-8D7F-8070FBDE50C2",
					"app_namespace":  "com.torontomapleleafs.MapleLeafs",

					"is_background_enabled": true,
					"is_bluetooth_enabled":  false,

					"os_name":          "iOS",
					"os_version":       map[string]interface{}{"major": 9, "minor": 3, "revision": 1},
					"aps_environment":  "production",
					"device_token_key": "34adf34614e18dfc6e6bc593e41e309cacc42ce26a13cb3aee328bf554a32547",

					"carrier_name":           "telus",
					"region_monitoring_mode": "ROVER",
					"locale_language":        "en",
					"locale_region":          "ca",

					"location_accuracy":   int64(65),
					"location_latitude":   54.52263462912342,
					"location_longitude":  -128.6036643460808,
					"location_updated_at": parseTime(t, "2016-10-15T00:03:19.17Z"),

					"is_location_monitoring_enabled": true,
					"device_manufacturer":            "Apple",
					"device_model":                   "iPhone4,1",
					// IGNORED
					// "notifications_enabled":       nil,
					"platform": "MOBILE",

					"frameworks": map[string]interface{}{
						"Rover": map[string]interface{}{"major": 1, "minor": 0, "revision": 0},
					},
					"time_zone": "America/Vancouver",

					"geofence_monitoring_regions": []interface{}{
						map[string]interface{}{
							"id":        "33.531937:-112.261187:50",
							"latitude":  33.531937,
							"longitude": -112.261187,
							"radius":    int64(50),
						},
						map[string]interface{}{
							"id":        "39.969408:-83.005884:50",
							"latitude":  39.969408,
							"longitude": -83.005884,
							"radius":    int64(50),
						},
					},
					"geofence_monitoring_regions_updated_at": parseTime(t, "2016-10-15T00:03:19.171Z"),
					"ibeacon_monitoring_regions_updated_at":  parseTime(t, "2016-10-15T00:03:19.171Z"),
					"ibeacon_monitoring_regions": []interface{}{
						map[string]interface{}{
							"uuid":  "B1BF7EFA-BA25-41DB-87CC-54C1461305A0",
							"major": -1,
							"minor": -1,
						},
						map[string]interface{}{
							"uuid":  "B435CE53-9EC2-4B20-99D1-070FEF1CDA2E",
							"major": -1,
							"minor": -1,
						},
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp, expErr = tc.exp, tc.expErr
				got, gotErr = toDevices(tc.customer)
			)

			if expErr != nil || gotErr != nil {
				if diff := deep.Equal(expErr, gotErr); diff != nil {
					t.Error("Diff:\n", strings.Join(diff, "\n"))
				}
				return
			}

			if diff := deep.Equal(exp, got); diff != nil {
				t.Error("Diff:\n", strings.Join(diff, "\n"))
			}
		})
	}
}

func TestConversion_Profile(t *testing.T) {

	var (
		createdAt = time.Now().Truncate(time.Millisecond)
	)

	// override globals
	objectID = tNewObjectIdFunc(t, 0)
	timeNow = func() time.Time { return createdAt }
	sortKeys = true

	tcases := []struct {
		customer map[string]interface{}

		expErr    error
		exp       interface{}
		expSchema interface{}
	}{
		{
			customer: read(t, open(t, "testdata/customer-57ec6f.json")),

			exp: map[string]interface{}{
				"_id":        bson.ObjectIdHex("57ec6f434794ea0035dddc31"),
				"account_id": int64(30),

				"created_at": parseTime(t, "2016-09-29T01:32:51.052Z"),
				"updated_at": parseTime(t, "2017-05-25T23:48:57.069Z"),

				"attributes": map[string]interface{}{
					"phone_number": "911",
					"tags":         []interface{}{"hello", "world"},
					"last_name":    "last name",
					"first_name":   "first name",
					"age":          int64(10),
					"gender":       "undefined",
					"email":        "email@example.com",
				},
			},

			expSchema: []interface{}{
				map[string]interface{}{
					"_id":            bson.ObjectIdHex("0194fdc2fa2ffcc041d3ff12"),
					"created_at":     createdAt,
					"account_id":     int64(30),
					"attribute":      "age",
					"attribute_type": "integer",
				},
				map[string]interface{}{
					"_id":            bson.ObjectIdHex("045b73c86e4ff95ff662a5ee"),
					"created_at":     createdAt,
					"account_id":     int64(30),
					"attribute":      "email",
					"attribute_type": "string",
				},
				map[string]interface{}{
					"_id":            bson.ObjectIdHex("e82abdf44a2d0b75fb180daf"),
					"created_at":     createdAt,
					"account_id":     int64(30),
					"attribute":      "first_name",
					"attribute_type": "string",
				},
				map[string]interface{}{
					"_id":            bson.ObjectIdHex("48a79ee0b10d394651850fd4"),
					"created_at":     createdAt,
					"account_id":     int64(30),
					"attribute":      "gender",
					"attribute_type": "string",
				},
				map[string]interface{}{
					"_id":            bson.ObjectIdHex("a178892ee285ece151145578"),
					"created_at":     createdAt,
					"account_id":     int64(30),
					"attribute":      "last_name",
					"attribute_type": "string",
				},
				map[string]interface{}{
					"_id":            bson.ObjectIdHex("0875d64ee2d3d0d0de6bf8f9"),
					"created_at":     createdAt,
					"account_id":     int64(30),
					"attribute":      "phone_number",
					"attribute_type": "string",
				},
				map[string]interface{}{
					"_id":            bson.ObjectIdHex("b44ce85ff044c6b1f83b8e88"),
					"created_at":     createdAt,
					"account_id":     int64(30),
					"attribute":      "tags",
					"attribute_type": "array[string]",
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp, expErr            = tc.exp, tc.expErr
				got, gotSchema, gotErr = toProfile(tc.customer, schemaCache)
			)

			if expErr != nil || gotErr != nil {
				if diff := deep.Equal(expErr, gotErr); diff != nil {
					t.Error("Diff:\n", strings.Join(diff, "\n"))
				}
				return
			}

			if diff := deep.Equal(exp, got); diff != nil {
				t.Error("Diff:\n", strings.Join(diff, "\n"))
			}

			if diff := deep.Equal(tc.expSchema, gotSchema); diff != nil {
				t.Error("Diff:\n", strings.Join(diff, "\n"))
			}
		})
	}
}

func open(t *testing.T, path string) io.Reader {
	f, err := os.Open(path)
	if err != nil {
		t.Fatal("os.Open:", err)
	}

	return f
}

func read(t *testing.T, r io.Reader) map[string]interface{} {
	var (
		d   = mongodb.NewJSONBSONDecoder(r)
		doc = make(map[string]interface{})
	)

	if err := d.Decode(&doc); err != nil {
		t.Fatal("r.Decode:", err)
	}

	return doc
}

func parseTime(t *testing.T, str string) time.Time {
	ts, err := time.Parse(time.RFC3339Nano, str)
	if err != nil {
		t.Fatal("parseTime:", err)
	}

	return ts
}

// predictable object id generator
func tNewObjectIdFunc(t *testing.T, seed int64) func() bson.ObjectId {
	var rnd = rand.New(rand.NewSource(seed))

	return func() bson.ObjectId {
		// keys must be 12 bytes long
		var bs [12]byte
		n, err := rnd.Read(bs[:])
		if err != nil {
			t.Fatalf("tNewObjectIdFunc: %v", err)
		}

		return bson.ObjectIdHex(hex.EncodeToString(bs[:n]))
	}
}
