package mockdata

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
)

func Generate(accountId int32, size int32) *audience.QueryResponse {
	var (
		profiles = make([]*audience.Profile, size, size)
		devices  = make([]*audience.Device, size, size)
	)

	// return a bunch of random data
	for index, _ := range profiles {
		profiles[index] = &audience.Profile{}
		p := profiles[index]
		p.AccountId = accountId
		p.Id = fmt.Sprintf("38101292%d", index)
		p.Attributes = map[string]*audience.Value{
			"first-name": audience.StringVal(RandomFirstName()),
			"last-name":  audience.StringVal(RandomLastName()),
			"arr":        audience.StringArrayVal("hello", "world", "testtheWorld", "gotaDLL"),
			"is-good":    audience.BoolVal(true),
			"age":        audience.IntegerVal(rand.Int63()),
			"likelihood": audience.DoubleVal(rand.Float64()),
		}
		p.CreatedAt, _ = timestamp.TimestampProto(time.Now())
		p.UpdatedAt, _ = timestamp.TimestampProto(time.Now())
	}

	for index, _ := range devices {
		devices[index] = &audience.Device{}
		d := devices[index]
		d.UpdatedAt, _ = timestamp.TimestampProto(time.Now())
		d.CreatedAt, _ = timestamp.TimestampProto(time.Now())
		d.Id = "abc"
		d.ProfileId = fmt.Sprintf("38101292%d", index)
		d.DeviceId = fmt.Sprintf("839i2n282822%d", index)
		d.AccountId = accountId
		d.CreatedAt, _ = timestamp.TimestampProto(time.Now())
		d.UpdatedAt, _ = timestamp.TimestampProto(time.Now())
		d.IsTestDevice = false
		d.PushEnvironment = "production"
		d.AppName = "Billy Bee Honey"
		d.AppVersion = RandomAppVersion()
		d.AppBuild = RandomAppBuild()
		d.AppNamespace = "com.billybee"
		d.DeviceManufacturer = RandomManufacturer()
		d.DeviceModel = RandomDeviceModel()
		d.OsName = "iOS"
		d.OsVersion = &audience.Version{
			Major:    int32(1 + rand.Intn(10)),
			Minor:    int32(1 + rand.Intn(5)),
			Revision: int32(1 + rand.Intn(6)),
		}

		d.Frameworks = map[string]*audience.Version{
			"io.rover.Rover": &audience.Version{
				Major:    int32(1 + rand.Intn(1)),
				Minor:    int32(1 + rand.Intn(5)),
				Revision: int32(1 + rand.Intn(6)),
			},
		}
		d.LocaleLanguage = "en"
		d.LocaleRegion = "us"
		d.LocaleScript = "Hans"
		d.CarrierName = "rogers"
		d.TimeZone = "America/Toronto"
		d.Platform = audience.Platform_MOBILE
		d.IsWifiEnabled = true
		d.IsCellularEnabled = false
		d.ScreenWidth = 320
		d.ScreenHeight = 480
		d.Radio = "LTE"
		d.IsBluetoothEnabled = true
		d.AdvertisingId = "13F56082-25AC-47F2-A553-8C1C96468C5D"
		d.Ip = "206.248.180.234"
		d.LocationLatitude = 43.6414
		d.LocationLongitude = -79.3894
		d.PushTokenIsActive = false
		d.RegionMonitoringMode = 2
		d.IsBackgroundEnabled = true
		d.IsLocationMonitoringEnabled = false
	}

	return &audience.QueryResponse{
		TotalSize: 10282,
		Profiles:  profiles,
		Devices:   devices,
	}
}
