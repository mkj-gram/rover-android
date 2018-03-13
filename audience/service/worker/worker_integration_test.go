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

	"cloud.google.com/go/pubsub"
	"github.com/pkg/errors"
	"golang.org/x/net/context"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	es5 "gopkg.in/olivere/elastic.v5"

	"github.com/roverplatform/rover/audience/service"
	"github.com/roverplatform/rover/audience/service/elastic"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"github.com/roverplatform/rover/audience/service/worker"
	rlog "github.com/roverplatform/rover/go/log"
	rtesting "github.com/roverplatform/rover/go/testing"
)

type M = map[string]interface{}

var (
	_ = ioutil.Discard

	acctIdx = func(s string) string {
		return "test_account_" + s
	}

	mongoDSN = "mongodb://mongo:27017/audience_worker_test"
	esDSN    = "http://elastic5:9200/"

	difff = rtesting.Difff
	Diff  = rtesting.Diff
)

func TestWorker(t *testing.T) {
	var (
		elasticOut = createFile(t, "elastic.test.log")
		elasticLog = log.New(elasticOut, "", 0)
	)

	t.Log("Elastic log:", elasticOut.Name())

	esClient, err := es5.NewClient(
		es5.SetURL(strings.Split(esDSN, ",")...),
		es5.SetTraceLog(elasticLog),
		es5.SetSniff(false),
		// es5.SetGzip(false),
	)
	if err != nil {
		t.Fatal("elastic.NewClient:", err)
	}

	var (
		ctx = context.TODO()

		db = dialMongo(t, mongoDSN)

		w = worker.Worker{
			Log: rlog.New(rlog.Error),
			DB:  db,
			Bulk: &elastic.BulkHandler{
				Client: esClient,
			},
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
	loadFixture(t, db.C("devices"), "testdata/devices.bson.json")
	loadFixture(t, db.C("profiles"), "testdata/profiles.bson.json")
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

	createMapping(t, acctIdx("1"), "device", elastic.DeviceV2Mapping(M{}, M{}))

	//resp, err := esClient.PerformRequest(ctx, "POST", "/_bulk", nil, string(readFile(t, "testdata/index.json")))
	//if err != nil {
	//	t.Fatal("index:", err, resp)
	//}

	// RunTest

	type expect struct {
		err  error
		val  interface{}
		path string
		body []byte
	}

	type response struct {
		Code int
		Body M
	}

	tcases := []struct {
		desc               string
		req                *pubsub.Message
		beforeRun          func()
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
									"dynamic": "false",
									"_all":    M{"enabled": false},
									"properties": M{
										"account_id": M{"type": "integer"},

										"profile_identifier": M{"type": "keyword"},
										"profile": M{
											"properties": M{
												"id":         M{"type": "keyword"},
												"account_id": M{"type": "integer"},
												"identifier": M{"type": "keyword"},
												"created_at": M{"type": "date"},
												"updated_at": M{"type": "date"},
												"attributes": M{"type": "object"},
											},
										},

										"attributes": M{"type": "object"},

										"device_id": M{"type": "keyword"},

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
										"location":            M{"type": "geo_point"},
										"location_updated_at": M{"type": "date"},

										"location_latitude":  M{"type": "double"},
										"location_longitude": M{"type": "double"},

										"location_accuracy": M{"type": "integer"},
										"location_country":  M{"type": "keyword"},
										"location_state":    M{"type": "keyword"},
										"location_city":     M{"type": "keyword"},

										"notification_authorization": M{"type": "keyword"},

										"sdk_version": M{
											"properties": M{
												"major":    M{"type": "integer"},
												"minor":    M{"type": "integer"},
												"revision": M{"type": "integer"},
											},
										},
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
									"dynamic": "false",
									"_all":    M{"enabled": false},
									"properties": M{
										"account_id": M{"type": "integer"},

										"profile_identifier": M{"type": "keyword"},
										"profile": M{
											"properties": M{
												"id":         M{"type": "keyword"},
												"account_id": M{"type": "integer"},
												"identifier": M{"type": "keyword"},
												"created_at": M{"type": "date"},
												"updated_at": M{"type": "date"},
												"attributes": M{
													"properties": M{
														"arr":     M{"type": "keyword"},
														"bool":    M{"type": "boolean"},
														"double":  M{"type": "double"},
														"ts":      M{"type": "date"},
														"string":  M{"type": "keyword"},
														"integer": M{"type": "integer"},
													},
												},
											},
										},

										"attributes": M{
											"properties": M{
												"arr":     M{"type": "keyword"},
												"bool":    M{"type": "boolean"},
												"double":  M{"type": "double"},
												"ts":      M{"type": "date"},
												"string":  M{"type": "keyword"},
												"integer": M{"type": "integer"},
											},
										},

										"device_id": M{"type": "keyword"},

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
										"location":            M{"type": "geo_point"},
										"location_updated_at": M{"type": "date"},

										"location_latitude":  M{"type": "double"},
										"location_longitude": M{"type": "double"},

										"location_accuracy": M{"type": "integer"},
										"location_country":  M{"type": "keyword"},
										"location_state":    M{"type": "keyword"},
										"location_city":     M{"type": "keyword"},

										"notification_authorization": M{"type": "keyword"},

										"sdk_version": M{
											"properties": M{
												"major":    M{"type": "integer"},
												"minor":    M{"type": "integer"},
												"revision": M{"type": "integer"},
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
			desc: "device created with profile",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":      "created",
						"model":      "device",
						"device_id":  "D00000000000000000000001",
						"account_id": "1",
					},
				}),
			},

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000001",
				err:  &es5.Error{Status: 404},
			},

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000001",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000001",
						"_version": 1.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"arr":     []interface{}{"a", "b", "c"},
								"bool":    false,
								"double":  11.1,
								"integer": 1.0,
								"null":    nil,
								"string":  "SOMETHING",
								"ts":      "2017-10-14T15:44:18.497Z",
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000001",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_bluetooth_enabled":           true,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            false,
							"is_wifi_enabled":                true,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "Canada",
							"location_state":                 "Ontario",
							"location_city":                  "Toronto",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile": M{
								"account_id": 1.0,
								"attributes": M{
									"arr":     []interface{}{"hello"},
									"bool":    true,
									"double":  42.42,
									"integer": 42.0,
									"null":    nil,
									"string":  "hello world",
									"ts":      "2016-08-22T19:05:53.102Z",
								},
								"created_at": "2016-08-22T19:05:53Z",
								"id":         "d00000000000000000000001",
								"identifier": "p2",
								"updated_at": "2016-08-22T19:05:53Z",
							},
							"profile_identifier":         "p2",
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
							"updated_at":                 "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},
		{
			desc: "device created with no profile",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":      "created",
						"model":      "device",
						"device_id":  "D00000000000000000000002",
						"account_id": "1",
					},
				}),
			},

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000002",
				err:  &es5.Error{Status: 404},
			},

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000002",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000002",
						"_version": 1.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"bool": true,
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000002",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile":                        nil,
							"profile_identifier":             "",
							"push_environment":               "",
							"push_token_created_at":          nil,
							"push_token_is_active":           false,
							"push_token_key":                 "",
							"push_token_unregistered_at":     nil,
							"push_token_updated_at":          nil,
							"radio":                          "",
							"screen_height":                  0.0,
							"screen_width":                   0.0,
							"time_zone":                      "",
							"updated_at":                     "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},
		{
			desc: "device created with profile identifier but no matching profile",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":      "created",
						"model":      "device",
						"device_id":  "D00000000000000000000003",
						"account_id": "1",
					},
				}),
			},

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000003",
				err:  &es5.Error{Status: 404},
			},

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000003",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000003",
						"_version": 1.0,
						"found":    true,
						"_source": M{
							"account_id":                     1.0,
							"advertising_id":                 "",
							"app_build":                      "",
							"app_name":                       "",
							"app_namespace":                  "",
							"app_version":                    "",
							"attributes":                     M{},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000003",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile":                        nil,
							"profile_identifier":             "does not exist",
							"push_environment":               "",
							"push_token_created_at":          nil,
							"push_token_is_active":           false,
							"push_token_key":                 "",
							"push_token_unregistered_at":     nil,
							"push_token_updated_at":          nil,
							"radio":                          "",
							"screen_height":                  0.0,
							"screen_width":                   0.0,
							"time_zone":                      "",
							"updated_at":                     "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			desc: "profile created with an existing device",

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000003",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000003",
						"_version": 1.0,
						"found":    true,
						"_source": M{
							"account_id":                     1.0,
							"advertising_id":                 "",
							"app_build":                      "",
							"app_name":                       "",
							"app_namespace":                  "",
							"app_version":                    "",
							"attributes":                     M{},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000003",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile":                        nil,
							"profile_identifier":             "does not exist",
							"push_environment":               "",
							"push_token_created_at":          nil,
							"push_token_is_active":           false,
							"push_token_key":                 "",
							"push_token_unregistered_at":     nil,
							"push_token_updated_at":          nil,
							"radio":                          "",
							"screen_height":                  0.0,
							"screen_width":                   0.0,
							"time_zone":                      "",
							"updated_at":                     "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			beforeRun: func() {
				// Create a new device in mongo with the profile identifier "does not exist"
				loadFixture(t, db.C("profiles"), "testdata/profile-00.bson.json")
			},

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":      "created",
						"model":      "profile",
						"id":         "5a3d24672659df520c068068",
						"identifier": "does not exist",
						"account_id": "1",
					},
				}),
			},

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000003",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000003",
						"_version": 2.0,
						"found":    true,
						"_source": M{
							"account_id":                     1.0,
							"advertising_id":                 "",
							"app_build":                      "",
							"app_name":                       "",
							"app_namespace":                  "",
							"app_version":                    "",
							"attributes":                     M{},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000003",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile": M{
								"account_id": 1.0,
								"id":         "5a3d24672659df520c068068",
								"identifier": "does not exist",
								"created_at": "2016-08-22T19:05:53Z",
								"updated_at": "2016-08-22T19:05:53Z",
								"attributes": M{
									"string": "funky-town",
									"arr":    []interface{}{"nsync"},
								},
							},
							"profile_identifier":         "does not exist",
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
							"updated_at":                 "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			desc: "profile created with no devices should not fail",

			beforeRun: func() {
				// Create a new device in mongo with the profile identifier "does not exist"
				loadFixture(t, db.C("profiles"), "testdata/profile-01.bson.json")
			},

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":      "created",
						"model":      "profile",
						"id":         "5a3d3b78951724b6b55f5389",
						"account_id": "1",
					},
				}),
			},

			exp: &expect{},
		},

		{
			desc: "profile deleted with no devices should not fail",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":      "deleted",
						"model":      "profile",
						"id":         "5a3d3b78951724b6b55f5389",
						"identifier": "BNANANAAMNAMNAMANMANMANAM",
						"account_id": "1",
					},
				}),
			},

			exp: &expect{},
		},

		{
			desc: "profile updated without an identifier should not fail",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":      "deleted",
						"model":      "profile",
						"id":         "",
						"identifier": "",
						"account_id": "1",
					},
				}),
			},

			exp: &expect{},
		},

		{
			desc: "profile deleted with associated device",

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000003",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000003",
						"_version": 2.0,
						"found":    true,
						"_source": M{
							"account_id":                     1.0,
							"advertising_id":                 "",
							"app_build":                      "",
							"app_name":                       "",
							"app_namespace":                  "",
							"app_version":                    "",
							"attributes":                     M{},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000003",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile": M{
								"account_id": 1.0,
								"id":         "5a3d24672659df520c068068",
								"identifier": "does not exist",
								"created_at": "2016-08-22T19:05:53Z",
								"updated_at": "2016-08-22T19:05:53Z",
								"attributes": M{
									"string": "funky-town",
									"arr":    []interface{}{"nsync"},
								},
							},
							"profile_identifier":         "does not exist",
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
							"updated_at":                 "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			beforeRun: func() {
				err := db.C("profiles").Remove(bson.M{"_id": bson.ObjectIdHex("5a3d24672659df520c068068")})
				if err != nil {
					t.Fatal(err)
				}
			},

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":      "deleted",
						"model":      "profile",
						"id":         "5a3d24672659df520c068068",
						"identifier": "does not exist",
						"account_id": "1",
					},
				}),
			},

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000003",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000003",
						"_version": 3.0,
						"found":    true,
						"_source": M{
							"account_id":                     1.0,
							"advertising_id":                 "",
							"app_build":                      "",
							"app_name":                       "",
							"app_namespace":                  "",
							"app_version":                    "",
							"attributes":                     M{},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000003",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile":                        nil,
							"profile_identifier":             "does not exist",
							"push_environment":               "",
							"push_token_created_at":          nil,
							"push_token_is_active":           false,
							"push_token_key":                 "",
							"push_token_unregistered_at":     nil,
							"push_token_updated_at":          nil,
							"radio":                          "",
							"screen_height":                  0.0,
							"screen_width":                   0.0,
							"time_zone":                      "",
							"updated_at":                     "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			desc: "device sets profile with no associated profile",

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000002",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000002",
						"_version": 1.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"bool": true,
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000002",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile":                        nil,
							"profile_identifier":             "",
							"push_environment":               "",
							"push_token_created_at":          nil,
							"push_token_is_active":           false,
							"push_token_key":                 "",
							"push_token_unregistered_at":     nil,
							"push_token_updated_at":          nil,
							"radio":                          "",
							"screen_height":                  0.0,
							"screen_width":                   0.0,
							"time_zone":                      "",
							"updated_at":                     "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			beforeRun: func() {
				err := db.C("devices").Update(bson.M{"device_id": "D00000000000000000000002", "account_id": 1}, bson.M{"$set": bson.M{"profile_identifier": "honey-water-tea"}})
				if err != nil {
					t.Fatal(err)
				}
			},

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":                  "SetDeviceProfileIdentifier",
						"model":                  "device",
						"old_profile_identifier": "",
						"profile_identifier":     "honey-water-tea",
						"device_id":              "D00000000000000000000002",
						"account_id":             "1",
					},
				}),
			},

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000002",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000002",
						"_version": 2.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"bool": true,
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000002",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile":                        nil,
							"profile_identifier":             "honey-water-tea",
							"push_environment":               "",
							"push_token_created_at":          nil,
							"push_token_is_active":           false,
							"push_token_key":                 "",
							"push_token_unregistered_at":     nil,
							"push_token_updated_at":          nil,
							"radio":                          "",
							"screen_height":                  0.0,
							"screen_width":                   0.0,
							"time_zone":                      "",
							"updated_at":                     "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			desc: "device sets profile to identified profile",

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000002",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000002",
						"_version": 2.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"bool": true,
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000002",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile":                        nil,
							"profile_identifier":             "honey-water-tea",
							"push_environment":               "",
							"push_token_created_at":          nil,
							"push_token_is_active":           false,
							"push_token_key":                 "",
							"push_token_unregistered_at":     nil,
							"push_token_updated_at":          nil,
							"radio":                          "",
							"screen_height":                  0.0,
							"screen_width":                   0.0,
							"time_zone":                      "",
							"updated_at":                     "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			beforeRun: func() {
				err := db.C("devices").Update(bson.M{"device_id": "D00000000000000000000002", "account_id": 1}, bson.M{"$set": bson.M{"profile_identifier": "p2"}})
				if err != nil {
					t.Fatal(err)
				}
			},

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":                  "SetDeviceProfileIdentifier",
						"model":                  "device",
						"old_profile_identifier": "",
						"profile_identifier":     "p2",
						"device_id":              "D00000000000000000000002",
						"account_id":             "1",
					},
				}),
			},

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000002",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000002",
						"_version": 3.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"bool": true,
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000002",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile": M{
								"id":         "d00000000000000000000001",
								"identifier": "p2",
								"account_id": 1.0,
								"updated_at": "2016-08-22T19:05:53Z",
								"created_at": "2016-08-22T19:05:53Z",
								"attributes": M{
									"arr":     []interface{}{"hello"},
									"bool":    true,
									"null":    nil,
									"string":  "hello world",
									"double":  42.42,
									"integer": 42.0,
									"ts":      "2016-08-22T19:05:53.102Z",
								},
							},
							"profile_identifier":         "p2",
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
							"updated_at":                 "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			desc: "device switches from identified profile to anonymous",

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000002",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000002",
						"_version": 3.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"bool": true,
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000002",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile": M{
								"id":         "d00000000000000000000001",
								"identifier": "p2",
								"account_id": 1.0,
								"updated_at": "2016-08-22T19:05:53Z",
								"created_at": "2016-08-22T19:05:53Z",
								"attributes": M{
									"arr":     []interface{}{"hello"},
									"bool":    true,
									"null":    nil,
									"string":  "hello world",
									"double":  42.42,
									"integer": 42.0,
									"ts":      "2016-08-22T19:05:53.102Z",
								},
							},
							"profile_identifier":         "p2",
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
							"updated_at":                 "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			beforeRun: func() {
				err := db.C("devices").Update(bson.M{"device_id": "D00000000000000000000002", "account_id": 1}, bson.M{"$set": bson.M{"profile_identifier": ""}})
				if err != nil {
					t.Fatal(err)
				}
			},

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":                  "SetDeviceProfileIdentifier",
						"model":                  "device",
						"old_profile_identifier": "p2",
						"profile_identifier":     "",
						"device_id":              "D00000000000000000000002",
						"account_id":             "1",
					},
				}),
			},

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000002",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000002",
						"_version": 4.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"bool": true,
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000002",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile":                        nil,
							"profile_identifier":             "",
							"push_environment":               "",
							"push_token_created_at":          nil,
							"push_token_is_active":           false,
							"push_token_key":                 "",
							"push_token_unregistered_at":     nil,
							"push_token_updated_at":          nil,
							"radio":                          "",
							"screen_height":                  0.0,
							"screen_width":                   0.0,
							"time_zone":                      "",
							"updated_at":                     "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			desc: "profile is updated and should update associated devices",

			before: &expect{
				path: "/test_account_1/device/D00000000000000000000001",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000001",
						"_version": 1.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"arr":     []interface{}{"a", "b", "c"},
								"bool":    false,
								"double":  11.1,
								"integer": 1.0,
								"null":    nil,
								"string":  "SOMETHING",
								"ts":      "2017-10-14T15:44:18.497Z",
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000001",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_bluetooth_enabled":           true,
							"is_cellular_enabled":            false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_wifi_enabled":                true,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "Canada",
							"location_state":                 "Ontario",
							"location_city":                  "Toronto",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile": M{
								"account_id": 1.0,
								"attributes": M{
									"arr":     []interface{}{"hello"},
									"bool":    true,
									"double":  42.42,
									"integer": 42.0,
									"null":    nil,
									"string":  "hello world",
									"ts":      "2016-08-22T19:05:53.102Z",
								},
								"created_at": "2016-08-22T19:05:53Z",
								"id":         "d00000000000000000000001",
								"identifier": "p2",
								"updated_at": "2016-08-22T19:05:53Z",
							},
							"profile_identifier":         "p2",
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
							"updated_at":                 "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			beforeRun: func() {
				err := db.C("profiles").Update(bson.M{"account_id": 1, "identifier": "p2"}, bson.M{"$set": bson.M{"attributes.string": "let's dance", "attributes.arr": []string{"bose", "qc35"}}})
				if err != nil {
					t.Fatal(err)
				}
			},

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":      "updated",
						"model":      "profile",
						"identifier": "p2",
						"account_id": "1",
					},
				}),
			},

			after: &expect{
				path: "/test_account_1/device/D00000000000000000000001",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "D00000000000000000000001",
						"_version": 2.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"arr":     []interface{}{"a", "b", "c"},
								"bool":    false,
								"double":  11.1,
								"integer": 1.0,
								"null":    nil,
								"string":  "SOMETHING",
								"ts":      "2017-10-14T15:44:18.497Z",
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "D00000000000000000000001",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_bluetooth_enabled":           true,
							"is_cellular_enabled":            false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_wifi_enabled":                true,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "Canada",
							"location_state":                 "Ontario",
							"location_city":                  "Toronto",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile": M{
								"account_id": 1.0,
								"attributes": M{
									"arr":     []interface{}{"bose", "qc35"},
									"bool":    true,
									"double":  42.42,
									"integer": 42.0,
									"null":    nil,
									"string":  "let's dance",
									"ts":      "2016-08-22T19:05:53.102Z",
								},
								"created_at": "2016-08-22T19:05:53Z",
								"id":         "d00000000000000000000001",
								"identifier": "p2",
								"updated_at": "2016-08-22T19:05:53Z",
							},
							"profile_identifier":         "p2",
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
							"updated_at":                 "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			desc: "device update event should create device if it does not exist in es",

			before: &expect{
				path: "/test_account_1/device/BNSSS000001",
				err:  &es5.Error{Status: 404},
			},

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":      "updated",
						"model":      "device",
						"device_id":  "BNSSS000001",
						"account_id": "1",
					},
				}),
			},

			after: &expect{
				path: "/test_account_1/device/BNSSS000001",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "BNSSS000001",
						"_version": 1.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"string": "hello",
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "BNSSS000001",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_bluetooth_enabled":           true,
							"is_wifi_enabled":                true,
							"is_cellular_enabled":            false,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile":                        nil,
							"profile_identifier":             "",
							"push_environment":               "",
							"push_token_created_at":          nil,
							"push_token_is_active":           false,
							"push_token_key":                 "",
							"push_token_unregistered_at":     nil,
							"push_token_updated_at":          nil,
							"radio":                          "",
							"screen_height":                  0.0,
							"screen_width":                   0.0,
							"time_zone":                      "",
							"updated_at":                     "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			desc: "device updated preserves nullable values",

			before: &expect{
				path: "/test_account_1/device/BNSSS000001",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "BNSSS000001",
						"_version": 1.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"string": "hello",
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "BNSSS000001",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            false,
							"is_wifi_enabled":                true,
							"is_bluetooth_enabled":           true,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile":                        nil,
							"profile_identifier":             "",
							"push_environment":               "",
							"push_token_created_at":          nil,
							"push_token_is_active":           false,
							"push_token_key":                 "",
							"push_token_unregistered_at":     nil,
							"push_token_updated_at":          nil,
							"radio":                          "",
							"screen_height":                  0.0,
							"screen_width":                   0.0,
							"time_zone":                      "",
							"updated_at":                     "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			beforeRun: func() {
				err := db.C("devices").Update(bson.M{"account_id": 1, "device_id": "BNSSS000001"}, bson.M{"$set": bson.M{"is_bluetooth_enabled": nil, "is_wifi_enabled": nil, "is_cellular_enabled": nil}})
				if err != nil {
					t.Error(err)
				}
			},

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":      "updated",
						"model":      "device",
						"device_id":  "BNSSS000001",
						"account_id": "1",
					},
				}),
			},

			after: &expect{
				path: "/test_account_1/device/BNSSS000001",
				val: response{
					Code: 200,
					Body: M{
						"_index":   "test_account_1",
						"_type":    "device",
						"_id":      "BNSSS000001",
						"_version": 2.0,
						"found":    true,
						"_source": M{
							"account_id":     1.0,
							"advertising_id": "",
							"app_build":      "",
							"app_name":       "",
							"app_namespace":  "",
							"app_version":    "",
							"attributes": M{
								"string": "hello",
							},
							"carrier_name":                   "",
							"created_at":                     "2017-10-14T15:44:18Z",
							"device_id":                      "BNSSS000001",
							"device_manufacturer":            "",
							"device_model":                   "",
							"is_background_enabled":          false,
							"is_location_monitoring_enabled": false,
							"is_test_device":                 false,
							"is_cellular_enabled":            nil,
							"is_wifi_enabled":                nil,
							"is_bluetooth_enabled":           nil,
							"label":                          "",
							"locale_language":                "",
							"locale_region":                  "",
							"locale_script":                  "",
							"location_accuracy":              0.0,
							"location_country":               "",
							"location_state":                 "",
							"location_city":                  "",
							"location_latitude":              0.0,
							"location_longitude":             0.0,
							"location_updated_at":            nil,
							"notification_authorization":     "UNKNOWN",
							"os_name":                        "",
							"os_version":                     nil,
							"platform":                       "",
							"profile":                        nil,
							"profile_identifier":             "",
							"push_environment":               "",
							"push_token_created_at":          nil,
							"push_token_is_active":           false,
							"push_token_key":                 "",
							"push_token_unregistered_at":     nil,
							"push_token_updated_at":          nil,
							"radio":                          "",
							"screen_height":                  0.0,
							"screen_width":                   0.0,
							"time_zone":                      "",
							"updated_at":                     "2017-10-14T15:44:18Z",
						},
					},
				},
			},

			exp: &expect{},
		},

		{
			desc: "multiple devices created with multiple profiles",

			req: &pubsub.Message{
				Data: toJSON(t, []service.Message{
					{
						"event":      "created",
						"model":      "device",
						"device_id":  "MULTI01",
						"account_id": "1",
					},
					{
						"event":      "created",
						"model":      "device",
						"device_id":  "MULTI02",
						"account_id": "1",
					},
				}),
			},

			after: &expect{
				path: "/test_account_1/device/_mget",
				body: toJSON(t, M{
					"ids": []string{"MULTI01", "MULTI02"},
				}),
				val: response{
					Code: 200,
					Body: M{
						"docs": []interface{}{
							M{
								"_index":   "test_account_1",
								"_type":    "device",
								"_id":      "MULTI01",
								"_version": 2.0, // Version 2.0 because p2 was created in earlier test which triggered an index of this device
								"found":    true,
								"_source": M{
									"account_id":                     1.0,
									"advertising_id":                 "",
									"app_build":                      "",
									"app_name":                       "",
									"app_namespace":                  "",
									"app_version":                    "",
									"attributes":                     M{},
									"carrier_name":                   "",
									"created_at":                     "2017-10-14T15:44:18Z",
									"device_id":                      "MULTI01",
									"device_manufacturer":            "",
									"device_model":                   "",
									"is_background_enabled":          false,
									"is_bluetooth_enabled":           nil,
									"is_cellular_enabled":            nil,
									"is_location_monitoring_enabled": false,
									"is_test_device":                 false,
									"is_wifi_enabled":                nil,
									"label":                          "",
									"locale_language":                "",
									"locale_region":                  "",
									"locale_script":                  "",
									"location_accuracy":              0.0,
									"location_city":                  "",
									"location_country":               "",
									"location_latitude":              0.0,
									"location_longitude":             0.0,
									"location_state":                 "",
									"location_updated_at":            nil,
									"notification_authorization":     "UNKNOWN",
									"os_name":                        "",
									"os_version":                     nil,
									"platform":                       "",
									"profile": M{
										"account_id": 1.0,
										"attributes": M{
											"arr":     []interface{}{"bose", "qc35"},
											"bool":    true,
											"double":  42.42,
											"integer": 42.0,
											"null":    nil,
											"string":  "let's dance",
											"ts":      "2016-08-22T19:05:53.102Z",
										},
										"created_at": "2016-08-22T19:05:53Z",
										"id":         "d00000000000000000000001",
										"identifier": "p2",
										"updated_at": "2016-08-22T19:05:53Z",
									},
									"profile_identifier":         "p2",
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
									"updated_at":                 "2017-10-14T15:44:18Z",
								},
							},
							M{
								"_index":   "test_account_1",
								"_type":    "device",
								"_id":      "MULTI02",
								"_version": 1.0,
								"found":    true,
								"_source": M{
									"account_id":                     1.0,
									"advertising_id":                 "",
									"app_build":                      "",
									"app_name":                       "",
									"app_namespace":                  "",
									"app_version":                    "",
									"attributes":                     M{},
									"carrier_name":                   "",
									"created_at":                     "2017-10-14T15:44:18Z",
									"device_id":                      "MULTI02",
									"device_manufacturer":            "",
									"device_model":                   "",
									"is_background_enabled":          false,
									"is_bluetooth_enabled":           nil,
									"is_cellular_enabled":            nil,
									"is_location_monitoring_enabled": false,
									"is_test_device":                 false,
									"is_wifi_enabled":                nil,
									"label":                          "",
									"locale_language":                "",
									"locale_region":                  "",
									"locale_script":                  "",
									"location_accuracy":              0.0,
									"location_city":                  "",
									"location_country":               "",
									"location_latitude":              0.0,
									"location_longitude":             0.0,
									"location_state":                 "",
									"location_updated_at":            nil,
									"notification_authorization":     "UNKNOWN",
									"os_name":                        "",
									"os_version":                     nil,
									"platform":                       "",
									"profile": M{
										"account_id": 1.0,
										"attributes": M{},
										"created_at": "2016-08-22T19:05:53Z",
										"id":         "d00000000000000000000002",
										"identifier": "p3",
										"updated_at": "2016-08-22T19:05:53Z",
									},
									"profile_identifier":         "p3",
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
									"updated_at":                 "2017-10-14T15:44:18Z",
								},
							},
						},
					},
				},
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

			if run := tc.beforeRun; run != nil {
				run()
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
					resp, gotErr = esClient.PerformRequest(ctx, "GET", e.path, nil, string(e.body))
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

func createFile(t *testing.T, name string) *os.File {
	f, err := os.Create(name)
	if err != nil {
		t.Fatal("createFile:", err)
	}

	return f
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
