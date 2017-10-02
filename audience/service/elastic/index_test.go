package elastic_test

import (
	"encoding/json"
	"os"
	"testing"
	"time"

	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	rtesting "github.com/roverplatform/rover/go/testing"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
	selastic "github.com/roverplatform/rover/audience/service/elastic"
	elastic "gopkg.in/olivere/elastic.v5"
)

func TestResponseMapping(t *testing.T) {
	var esResp elastic.SearchResult
	jsonFixture(t, &esResp, "testdata/query.response.json")

	tcases := []struct {
		in  *elastic.SearchResult
		exp *audience.QueryResponse
		err error
	}{
		{
			in:  &esResp,
			err: nil,
			exp: &audience.QueryResponse{
				TotalSize: 105707,
				Devices: []*audience.Device{
					{
						Id:                          "",
						AccountId:                   152,
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
						LocationCity:                "",
						LocationLatitude:            42.3264101,
						LocationLongitude:           -71.2835348,
						LocationRegion:              "",
						LocationStreet:              "",
						OsName:                      "Android",
						OsVersion:                   &audience.Version{4, 4, 2},
						Platform:                    audience.Platform_MOBILE,
						ProfileId:                   "59401bfe9cb3ac00079b0944",
						PushEnvironment:             "production",
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
						TimeZone:  "America/New_York",
						UpdatedAt: protoTs(t, parseTime(t, "2017-06-13T20:20:06Z")),
					},
					{
						Id:                          "",
						AccountId:                   152,
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
						LocationCity:                "",
						LocationLatitude:            42.3264399,
						LocationLongitude:           -71.2835464,
						LocationRegion:              "",
						LocationStreet:              "",
						OsName:                      "Android",
						OsVersion:                   &audience.Version{4, 4, 2},
						Platform:                    audience.Platform_MOBILE,
						ProfileId:                   "594137bbfa8e9000073d491e",
						PushEnvironment:             "production",
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
						TimeZone:  "America/New_York",
						UpdatedAt: protoTs(t, parseTime(t, "2017-07-24T18:39:14Z")),
					},
				},
				Profiles: []*audience.Profile{
					{
						Id:         "59401bfe9cb3ac00079b0944",
						AccountId:  152,
						Identifier: "",
						CreatedAt:  nil,
						UpdatedAt:  protoTs(t, parseTime(t, "2017-06-13T20:20:06Z")),
						Attributes: map[string]*audience.Value{
							"none": audience.NullVal,
							// TODO:
							"age":    audience.DoubleVal(12),
							"email":  audience.StringVal("hello@world.com"),
							"rate":   audience.DoubleVal(1.2),
							"gender": audience.BoolVal(true),
							"tags":   audience.StringArrayVal("roster_moves", "general_content", "stadium_updates"),
						},
					},
					{
						Id:         "594137bbfa8e9000073d491e",
						AccountId:  152,
						Identifier: "",
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
	}

	for _, tc := range tcases {
		t.Run("", func(t *testing.T) {
			var (
				exp, expErr = tc.exp, tc.err
				got, gotErr = selastic.MapResponse(&esResp)
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
