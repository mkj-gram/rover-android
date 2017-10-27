// +build integration

package worker_test

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"os"
	"strings"
	"testing"

	"golang.org/x/net/context"

	"cloud.google.com/go/pubsub"

	"github.com/pkg/errors"

	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/elastic"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"github.com/roverplatform/rover/audience/service/worker"
	rlog "github.com/roverplatform/rover/go/log"
	rtesting "github.com/roverplatform/rover/go/testing"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	es5 "gopkg.in/olivere/elastic.v5"
)

type M = map[string]interface{}

var (
	_ = ioutil.Discard

	acctIdx = func(s string) string {
		return "test_account_" + s
	}

	mongoDSN = "mongodb://mongo:27017/service_worker_test"
	esDSN    = "http://elastic5:9200/"

	difff = rtesting.Difff
	Diff  = rtesting.Diff
)

func TestWorker(t *testing.T) {
	var (
		l    = log.New(os.Stdout, "elastic:", 0)
		rLog = rlog.New(rlog.Error)
	)

	esClient, err := es5.NewClient(
		es5.SetURL(strings.Split(esDSN, ",")...),
		es5.SetTraceLog(l),
		es5.SetSniff(false),
		// es5.SetGzip(false),
	)
	if err != nil {
		t.Fatal("elastic.NewClient:", err)
	}

	var (
		ctx = context.TODO()

		db = dialMongo(t, mongoDSN)

		ES = &elastic.BulkHandler{
			Client: esClient,
		}

		w = worker.Worker{
			Log:          rLog,
			DB:           db,
			Bulk:         ES,
			AccountIndex: acctIdx,
		}
	)

	//
	// Cleanup
	//
	_, err = esClient.PerformRequest(ctx, "DELETE", "/"+acctIdx("*"), nil, nil)
	if err != nil {
		t.Fatal("deleteIndex:", err)
	}

	truncateColl(t, db.C("devices"), db.C("profiles"), db.C("profiles_schemas"), db.C("devices_schemas"))

	//
	// Setup State
	//
	loadFixture(t, db.C("devices"), "../testdata/devices.json")
	loadFixture(t, db.C("profiles"), "../testdata/profiles.json")
	loadFixture(t, db.C("profiles_schemas"), "testdata/profiles_schemas.json")
	loadFixture(t, db.C("devices_schemas"), "testdata/devices_schemas.json")

	createMapping := func(t *testing.T, idx, esType string, body M) {
		t.Helper()
		_, err = esClient.PutMapping().Index(idx).Type(esType).BodyJson(body).Do(ctx)
		if err != nil {
			t.Fatal("mapping:", err)
		}
	}

	_, err = esClient.CreateIndex(acctIdx("1")).Do(ctx)
	if err != nil {
		t.Fatal("index:", err)
	}

	createMapping(t, acctIdx("1"), "device", elastic.DeviceMapping(M{}))
	createMapping(t, acctIdx("1"), "profile", elastic.ProfileMapping(M{}))

	resp, err := esClient.PerformRequest(ctx, "POST", "/_bulk", nil, string(readFile(t, "testdata/index.json")))
	if err != nil {
		t.Fatal("index:", err, resp)
	}

	// RunTest

	type expect struct {
		err  error
		val  interface{}
		path string
	}

	type response struct {
		Code int
		Body M
	}

	tcases := []struct {
		desc string
		req  *pubsub.Message

		before, exp, after *expect
	}{
		{
			desc: "error: empty batch",
			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{}),
			},

			exp: &expect{
				err: errors.Wrapf(worker.InvalidArgument, "empty batch"),
				val: nil,
			},
		},

		{
			//
			// Profile Schema Update
			//
			desc: "profile schema update",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"account_id": "1",
						"event":      "updated",
						"model":      "profileSchema",
					},
				}),
			},

			before: &expect{
				path: "/test_account_1/profile/_mapping",
				val: response{
					Code: 200,
					Body: M{
						"test_account_1": M{
							"mappings": M{
								"profile": M{
									"dynamic": "false",
									// Meta
									"_all": M{"enabled": false},
									// Props
									"properties": M{
										"id":         M{"type": "keyword"},
										"account_id": M{"type": "integer"},
										"created_at": M{"type": "date"},
										"identifier": M{"type": "keyword"},
										"updated_at": M{"type": "date"},

										"attributes": M{
											"type": "object",
										},
									},
								},
							},
						},
					},
				},
			},

			after: &expect{
				path: "/test_account_1/profile/_mapping",
				val: response{
					Code: 200,
					Body: M{
						"test_account_1": M{
							"mappings": M{
								"profile": M{
									"dynamic": "false",
									// Meta
									"_all": M{"enabled": false},
									// Props
									"properties": M{
										"id":         M{"type": "keyword"},
										"account_id": M{"type": "integer"},
										"created_at": M{"type": "date"},
										"identifier": M{"type": "keyword"},
										"updated_at": M{"type": "date"},
										"attributes": M{
											"properties": M{
												"arr":     M{"type": "keyword"},
												"bool":    M{"type": "boolean"},
												"double":  M{"type": "double"},
												"integer": M{"type": "integer"},
												"string":  M{"type": "keyword"},
												"ts":      M{"type": "date"},
											},
										},
									},
								},
							},
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			//
			// Device Schema Update
			//
			desc: "device schema update",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"account_id": "1",
						"event":      "updated",
						"model":      "deviceSchema",
					},
				}),
			},

			before: &expect{
				path: "/test_account_1/device/_mapping",
				val: response{
					Code: 200,
					Body: M{
						"test_account_1": M{
							"mappings": M{
								"device": M{
									// Meta
									// https://www.elastic.co/guide/en/elasticsearch/reference/5.5/mapping-all-field.html
									"_all":     M{"enabled": false},
									"_parent":  M{"type": "profile"},
									"_routing": M{"required": true},
									"properties": M{
										"account_id": M{"type": "integer"},

										"device_id": M{"type": "keyword"},

										"profile_id": M{"type": "keyword"},

										"created_at": M{"type": "date"},
										"updated_at": M{"type": "date"},

										"is_test_device": M{"type": "boolean"},
										"label":          M{"type": "text"},

										"push_environment":           M{"type": "keyword"},
										"push_token_key":             M{"type": "keyword"},
										"push_token_is_active":       M{"type": "boolean"},
										"push_token_created_at":      M{"type": "date"},
										"push_token_updated_at":      M{"type": "date"},
										"push_token_unregistered_at": M{"type": "date"},

										"app_name":            M{"type": "keyword"},
										"app_version":         M{"type": "keyword"},
										"app_build":           M{"type": "keyword"},
										"app_namespace":       M{"type": "keyword"},
										"device_manufacturer": M{"type": "keyword"},
										"device_model":        M{"type": "keyword"},
										"os_name":             M{"type": "keyword"},
										//
										"os_version": M{
											"properties": M{
												"major":    M{"type": "integer"},
												"minor":    M{"type": "integer"},
												"revision": M{"type": "integer"},
											},
										},

										"locale_language": M{"type": "keyword"},
										"locale_region":   M{"type": "keyword"},
										"locale_script":   M{"type": "keyword"},

										"is_wifi_enabled":     M{"type": "boolean"},
										"is_cellular_enabled": M{"type": "boolean"},

										"screen_width":  M{"type": "integer"},
										"screen_height": M{"type": "integer"},

										"carrier_name": M{"type": "keyword"},
										"radio":        M{"type": "keyword"},
										"time_zone":    M{"type": "keyword"},
										"platform":     M{"type": "keyword"},

										"is_background_enabled":          M{"type": "boolean"},
										"is_location_monitoring_enabled": M{"type": "boolean"},
										"is_bluetooth_enabled":           M{"type": "boolean"},

										"advertising_id": M{"type": "keyword"},

										"ip": M{"type": "ip"},

										// https://www.elastic.co/guide/en/elasticsearch/reference/5.5/geo-point.html
										"location": M{"type": "geo_point"},

										"location_latitude":  M{"type": "double"},
										"location_longitude": M{"type": "double"},

										"location_accuracy": M{"type": "integer"},
										"location_region":   M{"type": "keyword"},
										"location_city":     M{"type": "keyword"},
										"location_street":   M{"type": "keyword"},

										// map<string, Version> frameworks 		 :M{"type": ""},

										// maps to frameworks[io.rover.Rover]
										"sdk_version": M{
											"properties": M{
												"major":    M{"type": "integer"},
												"minor":    M{"type": "integer"},
												"revision": M{"type": "integer"},
											},
										},

										"attributes": M{
											"type": "object",
										},

										// RegionMonitoringMode region_monitoring_mode = 47;
										//
										// google.protobuf.Timestamp ibeacon_monitoring_regions_updated_at = 48;
										// repeated IBeaconRegion ibeacon_monitoring_regions = 49;
										//
										// google.protobuf.Timestamp geofence_monitoring_regions_updated_at = 50;
										// repeated GeofenceRegion geofence_monitoring_regions = 51;

									},
								},
							},
						},
					},
				},
			},

			after: &expect{
				path: "/test_account_1/device/_mapping",
				val: response{
					Code: 200,
					Body: M{
						"test_account_1": M{
							"mappings": M{
								"device": M{
									// Meta
									// https://www.elastic.co/guide/en/elasticsearch/reference/5.5/mapping-all-field.html
									"_all":     M{"enabled": false},
									"_parent":  M{"type": "profile"},
									"_routing": M{"required": true},
									"properties": M{
										"account_id": M{"type": "integer"},

										"device_id": M{"type": "keyword"},

										"profile_id": M{"type": "keyword"},

										"created_at": M{"type": "date"},
										"updated_at": M{"type": "date"},

										"is_test_device": M{"type": "boolean"},
										"label":          M{"type": "text"},

										"push_environment":           M{"type": "keyword"},
										"push_token_key":             M{"type": "keyword"},
										"push_token_is_active":       M{"type": "boolean"},
										"push_token_created_at":      M{"type": "date"},
										"push_token_updated_at":      M{"type": "date"},
										"push_token_unregistered_at": M{"type": "date"},

										"app_name":            M{"type": "keyword"},
										"app_version":         M{"type": "keyword"},
										"app_build":           M{"type": "keyword"},
										"app_namespace":       M{"type": "keyword"},
										"device_manufacturer": M{"type": "keyword"},
										"device_model":        M{"type": "keyword"},
										"os_name":             M{"type": "keyword"},
										//
										"os_version": M{
											"properties": M{
												"major":    M{"type": "integer"},
												"minor":    M{"type": "integer"},
												"revision": M{"type": "integer"},
											},
										},

										"locale_language": M{"type": "keyword"},
										"locale_region":   M{"type": "keyword"},
										"locale_script":   M{"type": "keyword"},

										"is_wifi_enabled":     M{"type": "boolean"},
										"is_cellular_enabled": M{"type": "boolean"},

										"screen_width":  M{"type": "integer"},
										"screen_height": M{"type": "integer"},

										"carrier_name": M{"type": "keyword"},
										"radio":        M{"type": "keyword"},
										"time_zone":    M{"type": "keyword"},
										"platform":     M{"type": "keyword"},

										"is_background_enabled":          M{"type": "boolean"},
										"is_location_monitoring_enabled": M{"type": "boolean"},
										"is_bluetooth_enabled":           M{"type": "boolean"},

										"advertising_id": M{"type": "keyword"},

										"ip": M{"type": "ip"},

										// https://www.elastic.co/guide/en/elasticsearch/reference/5.5/geo-point.html
										"location": M{"type": "geo_point"},

										"location_latitude":  M{"type": "double"},
										"location_longitude": M{"type": "double"},

										"location_accuracy": M{"type": "integer"},
										"location_region":   M{"type": "keyword"},
										"location_city":     M{"type": "keyword"},
										"location_street":   M{"type": "keyword"},

										// map<string, Version> frameworks 		 :M{"type": ""},

										// maps to frameworks[io.rover.Rover]
										"sdk_version": M{
											"properties": M{
												"major":    M{"type": "integer"},
												"minor":    M{"type": "integer"},
												"revision": M{"type": "integer"},
											},
										},

										"attributes": M{
											"properties": M{
												"arr":     M{"type": "keyword"},
												"bool":    M{"type": "boolean"},
												"double":  M{"type": "double"},
												"integer": M{"type": "integer"},
												"string":  M{"type": "keyword"},
												"ts":      M{"type": "date"},
											},
										},

										// RegionMonitoringMode region_monitoring_mode = 47;
										//
										// google.protobuf.Timestamp ibeacon_monitoring_regions_updated_at = 48;
										// repeated IBeaconRegion ibeacon_monitoring_regions = 49;
										//
										// google.protobuf.Timestamp geofence_monitoring_regions_updated_at = 50;
										// repeated GeofenceRegion geofence_monitoring_regions = 51;

									},
								},
							},
						},
					},
				},
			},

			exp: &expect{},
		},

		//
		// Set Device Profile
		//
		{
			desc: "verify: device belongs to the old profile",

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000000?parent=000000000000000000000aa1",
				// err: &es5.Error{Status: 404},
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000000",
						"_parent":  "000000000000000000000aa1",
						"_routing": "000000000000000000000aa1",
						"_version": 1.0,
						"found":    true,
						"_source": M{
							"profile_id": "000000000000000000000aa1",
						}},
				},
			},
		},

		{
			desc: "verify: old new profile doesn't have the device",

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000000?parent=000000000000000000000aa2",
				err:  &es5.Error{Status: 404},
			},
		},

		{
			desc: "transfers device between profiles",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"account_id":     "1",
						"event":          "SetDeviceProfile",
						"model":          "device",
						"old_profile_id": "000000000000000000000aa1",
						"profile_id":     "000000000000000000000aa2",
						"device_id":      "D00000000000000000000000",
					},
				}),
			},

			exp: &expect{},
		},

		{
			desc: "verify: device deleted from old profile",

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000000?parent=000000000000000000000aa1",
				err:  &es5.Error{Status: 404},
			},
		},

		{
			desc: "verify: device indexed with new profile",

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000000?parent=000000000000000000000aa2",
				// err: &es5.Error{Status: 404},
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000000",
						"_version": 1.0,
						"_routing": "000000000000000000000aa2",
						"_parent":  "000000000000000000000aa2",
						"found":    true,
						"_source": M{
							"account_id":                     1.0,
							"advertising_id":                 "",
							"app_build":                      "",
							"app_name":                       "",
							"app_namespace":                  "",
							"app_version":                    "",
							"carrier_name":                   "",
							"created_at":                     "2017-06-14T15:44:18Z",
							"device_id":                      "D00000000000000000000000",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_bluetooth_enabled":           false,
							"is_cellular_enabled":            false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_wifi_enabled":                false,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",

							"location_latitude":  0.0,
							"location_longitude": 0.0,

							"location_accuracy":          0.0,
							"location_city":              "",
							"location_region":            "",
							"location_street":            "",
							"location_updated_at":        nil,
							"os_name":                    "",
							"os_version":                 nil,
							"platform":                   "",
							"notification_authorization": "UNKNOWN",
							"profile_id":                 "000000000000000000000aa2",
							"push_environment":           "",
							"push_token_created_at":      nil,
							"push_token_is_active":       false,
							"push_token_key":             "",
							"push_token_unregistered_at": nil,
							"push_token_updated_at":      nil,
							"radio":                      "",
							"screen_height":              0.0,
							"screen_width":               0.0,
							"time_zone":                  "",
							"updated_at":                 "2017-06-14T15:44:18Z",
						},
					},
				},
			},
		},

		//
		// Delete Device
		//
		{
			desc: "deletes device",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"account_id": "1",
						"event":      "deleted",
						"model":      "device",
						"profile_id": "000000000000000000000add",
						"device_id":  "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDDD",
					},
				}),
			},

			before: &expect{
				path: "/test_account_1/device/DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDDD?parent=000000000000000000000add",
				// err: &es5.Error{Status: 404},
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDDD",
						"_parent":  "000000000000000000000add",
						"_routing": "000000000000000000000add",
						"_version": 1.0,
						"found":    true,
						"_source": M{
							"profile_id": "000000000000000000000add",
						}},
				},
			},

			after: &expect{
				path: "/test_account_1/device/DDDDDDDD-DDDD-DDDD-DDDD-DDDDDDDDDDDD?parent=000000000000000000000add",
				err:  &es5.Error{Status: 404},
			},

			exp: &expect{},
		},

		//
		// Update Device
		//
		{
			desc: "device gets indexed",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"account_id": "1",
						"event":      "updated",
						"model":      "device",
						"profile_id": "000000000000000000000aa2",
						"device_id":  "D00000000000000000000002",
					},
				}),
			},

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000002?parent=000000000000000000000aa2",
				err:  &es5.Error{Status: 404},
			},

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000002?parent=000000000000000000000aa2",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000002",
						"_version": 1.0,
						"_routing": "000000000000000000000aa2",
						"_parent":  "000000000000000000000aa2",
						"found":    true,
						"_source": M{
							"account_id":                     1.0,
							"advertising_id":                 "",
							"app_build":                      "",
							"app_name":                       "",
							"app_namespace":                  "",
							"app_version":                    "",
							"carrier_name":                   "",
							"created_at":                     "2017-06-14T15:44:18Z",
							"device_id":                      "D00000000000000000000002",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_bluetooth_enabled":           false,
							"is_cellular_enabled":            false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_wifi_enabled":                false,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",

							"location_latitude":  0.0,
							"location_longitude": 0.0,

							"location_accuracy":          0.0,
							"location_city":              "",
							"location_region":            "",
							"location_street":            "",
							"location_updated_at":        nil,
							"os_name":                    "",
							"os_version":                 nil,
							"platform":                   "",
							"notification_authorization": "UNKNOWN",
							"profile_id":                 "000000000000000000000aa2",
							"push_environment":           "",
							"push_token_created_at":      nil,
							"push_token_is_active":       false,
							"push_token_key":             "",
							"push_token_unregistered_at": nil,
							"push_token_updated_at":      nil,
							"radio":                      "",
							"screen_height":              0.0,
							"screen_width":               0.0,
							"time_zone":                  "",
							"updated_at":                 "2017-06-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			desc: "device gets indexed with location",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"account_id": "1",
						"event":      "updated",
						"model":      "device",
						"profile_id": "bbbbbbbbbbbbbbbbbbbbbbbb",
						"device_id":  "AAAAABBBBBBCCCCCCC",
					},
				}),
			},

			before: &expect{
				path: "/test_account_1/device/AAAAABBBBBBCCCCCCC?parent=bbbbbbbbbbbbbbbbbbbbbbbb",
				err:  &es5.Error{Status: 404},
			},

			after: &expect{
				path: "/test_account_1/device/AAAAABBBBBBCCCCCCC?parent=bbbbbbbbbbbbbbbbbbbbbbbb",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "AAAAABBBBBBCCCCCCC",
						"_version": 1.0,
						"_routing": "bbbbbbbbbbbbbbbbbbbbbbbb",
						"_parent":  "bbbbbbbbbbbbbbbbbbbbbbbb",
						"found":    true,
						"_source": M{
							"account_id":                     1.0,
							"advertising_id":                 "",
							"app_build":                      "",
							"app_name":                       "",
							"app_namespace":                  "",
							"app_version":                    "",
							"carrier_name":                   "",
							"created_at":                     "2017-06-14T15:44:18Z",
							"device_id":                      "AAAAABBBBBBCCCCCCC",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_bluetooth_enabled":           false,
							"is_cellular_enabled":            false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_wifi_enabled":                false,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",

							"location":           M{"lat": 23.23, "lon": -83.2923},
							"location_latitude":  23.23,
							"location_longitude": -83.2923,

							"location_accuracy":          0.0,
							"location_city":              "",
							"location_region":            "",
							"location_street":            "",
							"location_updated_at":        nil,
							"os_name":                    "",
							"os_version":                 nil,
							"platform":                   "",
							"notification_authorization": "UNKNOWN",
							"profile_id":                 "bbbbbbbbbbbbbbbbbbbbbbbb",
							"push_environment":           "",
							"push_token_created_at":      nil,
							"push_token_is_active":       false,
							"push_token_key":             "",
							"push_token_unregistered_at": nil,
							"push_token_updated_at":      nil,
							"radio":                      "",
							"screen_height":              0.0,
							"screen_width":               0.0,
							"time_zone":                  "",
							"updated_at":                 "2017-06-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},

		//
		// Creates Device
		//

		{
			desc: "created device gets indexed",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"account_id": "1",
						"event":      "created",
						"model":      "device",
						"profile_id": "000000000000000000000aa3",
						"device_id":  "D00000000000000000000003",
					},
				}),
			},

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000003?parent=000000000000000000000aa3",
				err:  &es5.Error{Status: 404},
			},

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000003?parent=000000000000000000000aa3",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000003",
						"_version": 1.0,
						"_routing": "000000000000000000000aa3",
						"_parent":  "000000000000000000000aa3",
						"found":    true,
						"_source": M{
							"account_id":                     1.0,
							"advertising_id":                 "",
							"app_build":                      "",
							"app_name":                       "",
							"app_namespace":                  "",
							"app_version":                    "",
							"carrier_name":                   "",
							"created_at":                     "2017-06-14T15:44:18Z",
							"device_id":                      "D00000000000000000000003",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_bluetooth_enabled":           false,
							"is_cellular_enabled":            false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_wifi_enabled":                false,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",

							"location_latitude":  0.0,
							"location_longitude": 0.0,

							"location_accuracy":          0.0,
							"location_city":              "",
							"location_region":            "",
							"location_street":            "",
							"location_updated_at":        nil,
							"os_name":                    "",
							"os_version":                 nil,
							"platform":                   "",
							"notification_authorization": "UNKNOWN",
							"profile_id":                 "000000000000000000000aa3",
							"push_environment":           "",
							"push_token_created_at":      nil,
							"push_token_is_active":       false,
							"push_token_key":             "",
							"push_token_unregistered_at": nil,
							"push_token_updated_at":      nil,
							"radio":                      "",
							"screen_height":              0.0,
							"screen_width":               0.0,
							"time_zone":                  "",
							"updated_at":                 "2017-06-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			//
			// Create Profile
			//
			desc: "created profile gets indexed",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"account_id": "1",
						"event":      "created",
						"model":      "profile",
						"id":         "aaaaaaaaaaaaaaaaaaaaaa99",
					},
				}),
			},

			before: &expect{
				path: "/test_account_1/profile/aaaaaaaaaaaaaaaaaaaaaa99",
				err:  &es5.Error{Status: 404},
			},

			after: &expect{
				path: "/test_account_1/profile/aaaaaaaaaaaaaaaaaaaaaa99",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "profile",
						"_id":      "aaaaaaaaaaaaaaaaaaaaaa99",
						"_version": 1.0,
						"found":    true,
						"_source": M{
							"account_id": 1.0,
							"id":         "aaaaaaaaaaaaaaaaaaaaaa99",
							"identifier": "78e19dbf-8c0b-47a5-b28f-444444444444",
							"created_at": "2016-08-22T19:05:53Z",
							"updated_at": "2016-08-22T19:05:53Z",
							"attributes": M{
								"bool":   true,
								"string": "hello world",
								// NOTE: unmarshalling into M only produces floats
								"integer": 42.0,
								"double":  42.42,
								"null":    nil,
								"ts":      "2016-08-22T19:05:53.102Z",
								"arr":     []interface{}{"hello"},
							},
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			//
			// Update Profile
			//
			desc: "updated profile gets indexed",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"account_id": "1",
						"event":      "updated",
						"model":      "profile",
						"id":         "aaaaaaaaaaaaaaaaaaaaaa99",
					},
				}),
			},

			after: &expect{
				path: "/test_account_1/profile/aaaaaaaaaaaaaaaaaaaaaa99",
				val: response{
					Code: 200,
					Body: M{
						"_index": "test_account_1",
						"_type":  "profile",
						"_id":    "aaaaaaaaaaaaaaaaaaaaaa99",
						// Updates version
						"_version": 2.0,
						"found":    true,
						"_source": M{
							"account_id": 1.0,
							"id":         "aaaaaaaaaaaaaaaaaaaaaa99",
							"identifier": "78e19dbf-8c0b-47a5-b28f-444444444444",
							"created_at": "2016-08-22T19:05:53Z",
							"updated_at": "2016-08-22T19:05:53Z",
							"attributes": M{
								"bool":   true,
								"string": "hello world",
								// NOTE: unmarshalling into M only produces floats
								"integer": 42.0,
								"double":  42.42,
								"null":    nil,
								"ts":      "2016-08-22T19:05:53.102Z",
								"arr":     []interface{}{"hello"},
							},
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			//
			// Deleted Profile
			//
			desc: "deleted profile gets deleted",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"account_id": "1",
						"event":      "deleted",
						"model":      "profile",
						"id":         "aaaaaaaaaaaaaaaaaaaaaa99",
					},
				}),
			},

			before: &expect{
				path: "/test_account_1/profile/aaaaaaaaaaaaaaaaaaaaaa99",
				val: response{
					Code: 200,
					Body: M{
						"_index": "test_account_1",
						"_type":  "profile",
						"_id":    "aaaaaaaaaaaaaaaaaaaaaa99",
						// Updates version
						"_version": 2.0,
						"found":    true,
						"_source": M{
							"account_id": 1.0,
							"id":         "aaaaaaaaaaaaaaaaaaaaaa99",
							"identifier": "78e19dbf-8c0b-47a5-b28f-444444444444",
							"created_at": "2016-08-22T19:05:53Z",
							"updated_at": "2016-08-22T19:05:53Z",
							"attributes": M{
								"bool":   true,
								"string": "hello world",
								// NOTE: unmarshalling into M only produces floats
								"integer": 42.0,
								"double":  42.42,
								"null":    nil,
								"ts":      "2016-08-22T19:05:53.102Z",
								"arr":     []interface{}{"hello"},
							},
						},
					},
				},
			},

			after: &expect{
				path: "/test_account_1/profile/aaaaaaaaaaaaaaaaaaaaaa99",
				err:  &es5.Error{Status: 404},
			},

			exp: &expect{},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			if e := tc.before; e != nil {
				var (
					exp, expErr  = e.val, e.err
					resp, gotErr = esClient.PerformRequest(ctx, "GET", e.path, nil, nil)
					got          = response{
						Code: resp.StatusCode,
					}
				)

				if gotErr == nil {
					got.Body = parseJSON(t, resp.Body)
				}

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("Before:\n%v", difff(diff))
				}
			}

			if tc.req != nil {
				var (
					expErr = tc.exp.err
					gotErr = w.Handle(ctx, tc.req)
				)

				if diff := Diff(nil, nil, expErr, gotErr); diff != nil {
					t.Errorf("Diff:\n%v", difff(diff))
				}
			}

			if e := tc.after; e != nil {
				var (
					exp, expErr  = e.val, e.err
					resp, gotErr = esClient.PerformRequest(ctx, "GET", e.path, nil, nil)
					got          = response{
						Code: resp.StatusCode,
					}
				)

				if gotErr == nil {
					got.Body = parseJSON(t, resp.Body)
				}

				if diff := Diff(exp, got, expErr, gotErr); diff != nil {
					t.Errorf("After:\n%v", difff(diff))
				}
			}
		})
	}
}

func dialMongo(t testing.TB, dsn string) *mgo.Database {
	t.Helper()

	info, err := mgo.ParseURL(dsn)
	if err != nil {
		t.Fatal("url.Parse:", err)
	}

	sess, err := mgo.DialWithInfo(info)
	if err != nil {
		t.Fatalf("dialMongo: %v", err)
	}

	return sess.DB(info.Database)
}

func toJSON(t *testing.T, v interface{}) []byte {
	t.Helper()

	data, err := json.Marshal(v)
	if err != nil {
		t.Fatal("unexpected:", err)
	}

	return data
}

func parseJSON(t *testing.T, v []byte) M {
	t.Helper()

	var m M

	err := json.Unmarshal(v, &m)
	if err != nil {
		t.Log("parseJSON:", err)
	}

	return m
}

func readFile(t *testing.T, fixturePath string) []byte {
	data, err := ioutil.ReadFile(fixturePath)
	if err != nil {
		t.Fatal("ReadFile:")
	}

	return data
}

func truncateColl(t *testing.T, colls ...*mgo.Collection) {
	for _, coll := range colls {
		if err := coll.DropCollection(); err != nil {
			if err.Error() == "ns not found" {
				continue
			}
			t.Fatal("truncate:", err)
		}
	}
}

func loadFixture(t *testing.T, coll *mgo.Collection, fixturePath string) {
	f, err := os.Open(fixturePath)
	if err != nil {
		t.Fatal("testdata:", err)
	}

	docs, err := decodeBSON(f)
	if err != nil {
		t.Fatal("testdata: decodeBSON:", err)
	}

	if err := coll.Insert(docs...); err != nil {
		t.Fatal("testdata: insert:", err)
	}
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
