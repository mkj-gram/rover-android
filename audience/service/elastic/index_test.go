package elastic_test

import (
	"encoding/json"
	"os"
	"testing"
	"time"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	selastic "github.com/roverplatform/rover/audience/service/elastic"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	rtesting "github.com/roverplatform/rover/go/testing"
	elastic "gopkg.in/olivere/elastic.v5"
)

func TestResponseMapping(t *testing.T) {
	var (
		esResp                 elastic.SearchResult
		esRespDuplicateProfile elastic.SearchResult
	)

	jsonFixture(t, &esResp, "testdata/query.response.json")
	jsonFixture(t, &esRespDuplicateProfile, "testdata/query-duplicate-profile.response.json")

	tcases := []struct {
		desc string
		in   *elastic.SearchResult
		exp  *audience.QueryResponse
		err  error
	}{
		{
			desc: "maps response",
			in:   &esResp,
			err:  nil,
			exp: &audience.QueryResponse{
				TotalSize: 105707,
				Devices: []*audience.Device{
					{
						Id:        "",
						AccountId: 152,
						Attributes: map[string]*audience.Value{
							"fresh-find":   audience.BoolVal(true),
							"string-value": audience.StringVal("fidget spinner"),
						},
						AdvertisingId:               "fc19eac9-df79-45f8-84c5-3aa22a374491",
						AppBuild:                    "",
						AppName:                     "",
						AppNamespace:                "com.oneup.redskins",
						AppVersion:                  "",
						CarrierName:                 "",
						CreatedAt:                   nil,
						DeviceId:                    "9431B69F-F5F2-4375-9B06-E5F6033FDC0F",
						DeviceManufacturer:          "samsung",
						DeviceModel:                 "GT-I9190",
						Ip:                          "108.20.175.24",
						IsBackgroundEnabled:         true,
						IsBluetoothEnabled:          false,
						IsCellularEnabled:           false,
						IsLocationMonitoringEnabled: true,
						IsTestDevice:                false,
						IsWifiEnabled:               false,
						Label:                       "label_1",
						LocaleLanguage:              "en",
						LocaleRegion:                "us",
						LocaleScript:                "",
						LocationAccuracy:            20,
						LocationLatitude:            42.3264101,
						LocationLongitude:           -71.2835348,
						LocationCountry:             "",
						LocationState:               "",
						LocationCity:                "",
						LocationUpdatedAt:           protoTs(t, parseTime(t, "2017-06-13T20:20:06Z")),
						OsName:                      "Android",
						OsVersion:                   &audience.Version{4, 4, 2},
						Platform:                    audience.Platform_MOBILE,
						ProfileId:                   "59401bfe9cb3ac00079b0944",
						PushEnvironment:             audience.PushEnvironment_PRODUCTION,
						PushTokenCreatedAt:          nil,
						PushTokenIsActive:           false,
						PushTokenKey:                "",
						PushTokenUnregisteredAt:     nil,
						PushTokenUpdatedAt:          nil,
						Radio:                       "",
						ScreenHeight:                0,
						ScreenWidth:                 0,
						Frameworks: map[string]*audience.Version{
							"io.rover.Rover": {1, 12, 3},
						},
						TimeZone:                  "America/New_York",
						NotificationAuthorization: audience.NotificationAuthorization_AUTHORIZED,
						UpdatedAt:                 protoTs(t, parseTime(t, "2017-06-13T20:20:06Z")),
					},
					{
						Id:                          "",
						AccountId:                   152,
						ProfileIdentifier:           "hello",
						AdvertisingId:               "fc19eac9-df79-45f8-84c5-3aa22a374491",
						AppBuild:                    "",
						AppName:                     "",
						AppNamespace:                "com.oneup.redskins",
						AppVersion:                  "",
						CarrierName:                 "",
						CreatedAt:                   nil,
						DeviceId:                    "01E40D76-D181-4689-88DE-15BF4F0D2059",
						DeviceManufacturer:          "samsung",
						DeviceModel:                 "GT-I9190",
						Ip:                          "108.20.175.24",
						IsBackgroundEnabled:         true,
						IsBluetoothEnabled:          false,
						IsCellularEnabled:           false,
						IsLocationMonitoringEnabled: true,
						IsTestDevice:                false,
						IsWifiEnabled:               false,
						Label:                       "label_2",
						LocaleLanguage:              "en",
						LocaleRegion:                "us",
						LocaleScript:                "",
						LocationAccuracy:            265,
						LocationLatitude:            42.3264399,
						LocationLongitude:           -71.2835464,
						LocationCountry:             "",
						LocationState:               "",
						LocationCity:                "",
						LocationUpdatedAt:           protoTs(t, parseTime(t, "2017-06-13T20:20:06Z")),
						OsName:                      "Android",
						OsVersion:                   &audience.Version{4, 4, 2},
						Platform:                    audience.Platform_MOBILE,
						ProfileId:                   "594137bbfa8e9000073d491e",
						PushEnvironment:             audience.PushEnvironment_PRODUCTION,
						PushTokenCreatedAt:          nil,
						PushTokenIsActive:           false,
						PushTokenKey:                "",
						PushTokenUnregisteredAt:     nil,
						PushTokenUpdatedAt:          nil,
						Radio:                       "",
						ScreenHeight:                0,
						ScreenWidth:                 0,
						Frameworks: map[string]*audience.Version{
							"io.rover.Rover": {1, 15, 1},
						},
						NotificationAuthorization: audience.NotificationAuthorization_UNKNOWN,
						TimeZone:                  "America/New_York",
						UpdatedAt:                 protoTs(t, parseTime(t, "2017-07-24T18:39:14Z")),
					},
				},
				Profiles: []*audience.Profile{
					{
						Id:         "594137bbfa8e9000073d491e",
						AccountId:  152,
						Identifier: "hello",
						CreatedAt:  nil,
						UpdatedAt:  protoTs(t, parseTime(t, "2017-07-24T18:39:14Z")),

						Attributes: map[string]*audience.Value{
							"tags": audience.StringArrayVal("game_updates"),
						},
					},
				},
				ScrollId: "",
			},
		},
		{
			desc: "deduplicates profiles",
			in:   &esRespDuplicateProfile,
			err:  nil,
			exp: &audience.QueryResponse{
				TotalSize: 2,
				Devices: []*audience.Device{
					{
						Id:                          "",
						DeviceId:                    "16CDD064-760C-4F3D-A128-3859E9E692C7",
						AccountId:                   85,
						ProfileId:                   "59f3311b3e1fae00018f1fcd",
						CreatedAt:                   protoTs(t, parseTime(t, "2017-10-27T12:43:18Z")),
						UpdatedAt:                   protoTs(t, parseTime(t, "2017-11-23T00:03:27Z")),
						IsTestDevice:                false,
						Label:                       "",
						Attributes:                  nil,
						PushEnvironment:             audience.PushEnvironment_PRODUCTION,
						PushTokenKey:                "F418BCD467F53ADFAXJSJSJS4E8ED271F0CC1493A0C6EEB6880DF8587A68220F",
						PushTokenIsActive:           true,
						PushTokenCreatedAt:          protoTs(t, parseTime(t, "2017-10-27T12:43:45Z")),
						PushTokenUpdatedAt:          protoTs(t, parseTime(t, "2017-10-27T12:43:45Z")),
						PushTokenUnregisteredAt:     nil,
						AppName:                     "",
						AppVersion:                  "",
						AppBuild:                    "",
						AppNamespace:                "com.yinzcam.nfl.colts",
						DeviceManufacturer:          "Apple",
						DeviceModel:                 "iPhone 8 Plus",
						OsName:                      "iOS",
						OsVersion:                   &audience.Version{Major: 11, Minor: 0, Revision: 0},
						Frameworks:                  map[string]*audience.Version{"io.rover.Rover": {Major: 1, Minor: 8, Revision: 0}},
						LocaleLanguage:              "en",
						LocaleRegion:                "us",
						LocaleScript:                "",
						IsWifiEnabled:               false,
						IsCellularEnabled:           false,
						ScreenWidth:                 0,
						ScreenHeight:                0,
						CarrierName:                 "verizon",
						Radio:                       "",
						TimeZone:                    "America/Indianapolis",
						Platform:                    1,
						IsBackgroundEnabled:         true,
						IsLocationMonitoringEnabled: true,
						IsBluetoothEnabled:          true,
						AdvertisingId:               "CFE2D5BF-228D-44B1-92C7-0C92D8204EC6",
						Ip:                          "157.130.99.154",
						NotificationAuthorization:          0,
						LocationAccuracy:                   65,
						LocationLatitude:                   39.850747605710495,
						LocationLongitude:                  -86.28539541969405,
						LocationCity:                       "",
						LocationUpdatedAt:                  nil,
						RegionMonitoringMode:               0,
						IbeaconMonitoringRegionsUpdatedAt:  nil,
						IbeaconMonitoringRegions:           []*audience.IBeaconRegion(nil),
						GeofenceMonitoringRegionsUpdatedAt: nil,
						GeofenceMonitoringRegions:          []*audience.GeofenceRegion(nil),
						ProfileIdentifier:                  "b2a709b7-67a6-408a-ac54-cd5df8a8d09a",
					},
					{
						Id:                          "",
						DeviceId:                    "2840176F-0D54-4A82-9067-30A9FC5822F6",
						AccountId:                   85,
						ProfileId:                   "59f3311b3e1fae00018f1fcd",
						CreatedAt:                   protoTs(t, parseTime(t, "2017-10-27T16:03:13Z")),
						UpdatedAt:                   protoTs(t, parseTime(t, "2017-11-23T00:03:34Z")),
						IsTestDevice:                false,
						Label:                       "",
						Attributes:                  map[string]*audience.Value(nil),
						PushEnvironment:             audience.PushEnvironment_PRODUCTION,
						PushTokenKey:                "F2765E7E27900C7370CD78562C23453256AEF9F40118522C3E25D884679DA403",
						PushTokenIsActive:           true,
						PushTokenCreatedAt:          protoTs(t, parseTime(t, "2017-10-27T16:03:26Z")),
						PushTokenUpdatedAt:          protoTs(t, parseTime(t, "2017-10-27T16:03:26Z")),
						PushTokenUnregisteredAt:     nil,
						AppName:                     "",
						AppVersion:                  "",
						AppBuild:                    "",
						AppNamespace:                "com.yinzcam.nfl.colts",
						DeviceManufacturer:          "Apple",
						DeviceModel:                 "iPhone 8 Plus",
						OsName:                      "iOS",
						OsVersion:                   &audience.Version{Major: 11, Minor: 0, Revision: 0},
						Frameworks:                  map[string]*audience.Version{"io.rover.Rover": {Major: 1, Minor: 8, Revision: 0}},
						LocaleLanguage:              "en",
						LocaleRegion:                "us",
						LocaleScript:                "",
						IsWifiEnabled:               false,
						IsCellularEnabled:           false,
						ScreenWidth:                 0,
						ScreenHeight:                0,
						CarrierName:                 "verizon",
						Radio:                       "",
						TimeZone:                    "America/Indianapolis",
						Platform:                    1,
						IsBackgroundEnabled:         true,
						IsLocationMonitoringEnabled: true,
						IsBluetoothEnabled:          true,
						AdvertisingId:               "CFE2D5BF-228D-44B1-92C7-0C92D8204EC6",
						Ip:                          "157.130.99.154",
						NotificationAuthorization:          0,
						LocationAccuracy:                   165,
						LocationLatitude:                   39.85071871053182,
						LocationLongitude:                  -86.28542039360563,
						LocationCity:                       "",
						LocationUpdatedAt:                  nil,
						RegionMonitoringMode:               0,
						IbeaconMonitoringRegionsUpdatedAt:  nil,
						IbeaconMonitoringRegions:           []*audience.IBeaconRegion(nil),
						GeofenceMonitoringRegionsUpdatedAt: nil,
						GeofenceMonitoringRegions:          []*audience.GeofenceRegion(nil),
						ProfileIdentifier:                  "b2a709b7-67a6-408a-ac54-cd5df8a8d09a",
					},
				},
				Profiles: []*audience.Profile{
					{
						Id:         "59f3311b3e1fae00018f1fcd",
						AccountId:  85,
						Identifier: "b2a709b7-67a6-408a-ac54-cd5df8a8d09a",
						Attributes: map[string]*audience.Value{
							"tags": audience.StringArrayVal(
								"breaking_news",
								"contest_rewards",
								"live_programming",
								"injury_reports",
								"team_news",
								"game_updates",
								"stadium_updates",
							),
						},
						CreatedAt: protoTs(t, parseTime(t, "2017-10-27T13:14:03Z")),
						UpdatedAt: protoTs(t, parseTime(t, "2017-10-27T13:14:03Z")),
					},
				},
			},
		},
	}

	for _, tc := range tcases {
		t.Run(tc.desc, func(t *testing.T) {
			var (
				exp, expErr = tc.exp, tc.err
				got, gotErr = selastic.MapResponse(tc.in)
			)

			if diff := rtesting.Diff(got, exp, gotErr, expErr); diff != nil {
				t.Error("Diff:\n", rtesting.Difff(diff))
			}
		})
	}
}

func jsonFixture(t *testing.T, val interface{}, fixturePath string) {
	t.Helper()

	f, err := os.Open(fixturePath)
	if err != nil {
		t.Fatal("testdata:", err)
	}

	var (
		dec = json.NewDecoder(f)
	)

	if err := dec.Decode(&val); err != nil {
		t.Fatalf("decode:", err)
	}
}

func parseTime(t *testing.T, str string) time.Time {
	t.Helper()
	ts, err := time.Parse(time.RFC3339Nano, str)
	if err != nil {
		t.Fatal("parseTime:", err)
	}

	return ts
}

func protoTs(t *testing.T, ti time.Time) *timestamp.Timestamp {
	t.Helper()
	ts, err := timestamp.TimestampProto(ti)
	if err != nil {
		t.Fatal("protoTs:", err)
	}
	return ts
}

func TestMapAggregateResponse(t *testing.T) {
	var esResp elastic.AggregationBucketKeyItems
	jsonFixture(t, &esResp, "testdata/agg.response.json")

	tcases := []struct {
		in  *elastic.AggregationBucketKeyItems
		exp *audience.GetFieldSuggestionResponse
		err error
	}{
		{
			in:  &esResp,
			err: nil,
			exp: &audience.GetFieldSuggestionResponse{
				Suggestions: []string{"result1", "result2", "result3"},
			},
		},
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp = tc.exp
				got = selastic.MapFieldAggregateResponse(tc.in)
			)
			if diff := rtesting.Diff(exp, got, nil, nil); diff != nil {
				t.Error("Diff:\n", rtesting.Difff(diff))
			}
		})
	}
}
