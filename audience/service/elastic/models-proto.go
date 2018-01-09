package elastic

import (
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	"time"

	audience "github.com/roverplatform/rover/apis/go/audience/v1"
)

type Device struct {
	AccountID                   int32      `json:"account_id"`
	Attributes                  M          `json:"attributes"`
	AdvertisingID               string     `json:"advertising_id"`
	AppBuild                    string     `json:"app_build"`
	AppName                     string     `json:"app_name"`
	AppNamespace                string     `json:"app_namespace"`
	AppVersion                  string     `json:"app_version"`
	CarrierName                 string     `json:"carrier_name"`
	CreatedAt                   *time.Time `json:"created_at"`
	DeviceID                    string     `json:"device_id"`
	DeviceManufacturer          string     `json:"device_manufacturer"`
	DeviceModel                 string     `json:"device_model"`
	IP                          string     `json:"ip"`
	NotificationAuthorization   string     `json:"notification_authorization"`
	IsBackgroundEnabled         bool       `json:"is_background_enabled"`
	IsBluetoothEnabled          bool       `json:"is_bluetooth_enabled"`
	IsCellularEnabled           bool       `json:"is_cellular_enabled"`
	IsLocationMonitoringEnabled bool       `json:"is_location_monitoring_enabled"`
	IsTestDevice                bool       `json:"is_test_device"`
	IsWifiEnabled               bool       `json:"is_wifi_enabled"`
	Label                       string     `json:"label"`
	LocaleLanguage              string     `json:"locale_language"`
	LocaleRegion                string     `json:"locale_region"`
	LocaleScript                string     `json:"locale_script"`
	Location                    *struct {
		Lat float64 `json:"lat"`
		Lon float64 `json:"lon"`
	} `json:"location"`
	LocationAccuracy  int32      `json:"location_accuracy"`
	LocationLatitude  float64    `json:"location_latitude"`
	LocationLongitude float64    `json:"location_longitude"`
	LocationCountry   string     `json:"location_country"`
	LocationState     string     `json:"location_state"`
	LocationCity      string     `json:"location_city"`
	LocationUpdatedAt *time.Time `json:"location_updated_at"`
	// deprecated
	LocationRegion string `json:"location_region"`
	// deprecated
	LocationStreet string `json:"location_street"`

	OsName    string `json:"os_name"`
	OsVersion *struct {
		Major    int32 `json:"major"`
		Minor    int32 `json:"minor"`
		Revision int32 `json:"revision"`
	} `json:"os_version"`
	Platform string `json:"platform"`
	// deprecated
	ProfileID               string     `json:"profile_id"`
	PushEnvironment         string     `json:"push_environment"`
	PushTokenCreatedAt      *time.Time `json:"push_token_created_at"`
	PushTokenIsActive       bool       `json:"push_token_is_active"`
	PushTokenKey            string     `json:"push_token_key"`
	PushTokenUnregisteredAt *time.Time `json:"push_token_unregistered_at"`
	PushTokenUpdatedAt      *time.Time `json:"push_token_updated_at"`
	Radio                   string     `json:"radio"`

	ScreenHeight int32 `json:"screen_height"`
	ScreenWidth  int32 `json:"screen_width"`

	SdkVersion *struct {
		Major    int32 `json:"major"`
		Minor    int32 `json:"minor"`
		Revision int32 `json:"revision"`
	} `json:"sdk_version"`
	TimeZone  string     `json:"time_zone"`
	UpdatedAt *time.Time `json:"updated_at"`

	ProfileIdentifier string   `json:"profile_identifier"`
	Profile           *Profile `json:"profile"`
}

func (d *Device) toProto(proto *audience.Device) error {
	// proto.Id = d.I

	proto.DeviceId = d.DeviceID
	proto.ProfileId = d.ProfileID
	proto.AccountId = d.AccountID
	proto.ProfileIdentifier = d.ProfileIdentifier
	proto.Attributes = attributesToProto(d.Attributes)

	proto.AdvertisingId = d.AdvertisingID

	proto.CreatedAt, _ = timeToProto(d.CreatedAt)
	proto.UpdatedAt, _ = timeToProto(d.UpdatedAt)

	proto.IsTestDevice = d.IsTestDevice
	proto.PushEnvironment = d.PushEnvironment
	proto.PushTokenKey = d.PushTokenKey

	proto.AppName = d.AppName
	proto.AppVersion = d.AppVersion
	proto.AppBuild = d.AppBuild
	proto.AppNamespace = d.AppNamespace
	proto.DeviceManufacturer = d.DeviceManufacturer
	proto.OsName = d.OsName
	if d.OsVersion != nil {
		proto.OsVersion = &audience.Version{
			Major:    d.OsVersion.Major,
			Minor:    d.OsVersion.Minor,
			Revision: d.OsVersion.Revision,
		}
	}

	proto.DeviceModel = d.DeviceModel

	if d.SdkVersion != nil {
		proto.Frameworks = map[string]*audience.Version{
			"io.rover.Rover": &audience.Version{
				Major:    d.SdkVersion.Major,
				Minor:    d.SdkVersion.Minor,
				Revision: d.SdkVersion.Revision,
			},
		}
	}

	proto.Label = d.Label
	proto.LocaleLanguage = d.LocaleLanguage
	proto.LocaleRegion = d.LocaleRegion
	proto.LocaleScript = d.LocaleScript
	proto.IsWifiEnabled = d.IsWifiEnabled
	proto.IsCellularEnabled = d.IsCellularEnabled
	proto.ScreenWidth = d.ScreenWidth
	proto.ScreenHeight = d.ScreenHeight
	proto.CarrierName = d.CarrierName
	proto.Radio = d.Radio
	proto.TimeZone = d.TimeZone

	proto.Platform = audience.Platform(audience.Platform_value[d.Platform])

	proto.IsBackgroundEnabled = d.IsBackgroundEnabled
	proto.IsLocationMonitoringEnabled = d.IsLocationMonitoringEnabled
	proto.IsBluetoothEnabled = d.IsBluetoothEnabled

	proto.Ip = d.IP

	proto.PushTokenIsActive = d.PushTokenIsActive
	proto.PushTokenUpdatedAt, _ = timeToProto(d.PushTokenUpdatedAt)
	proto.PushTokenCreatedAt, _ = timeToProto(d.PushTokenCreatedAt)

	proto.PushTokenUnregisteredAt, _ = timeToProto(d.PushTokenUnregisteredAt)

	proto.LocationAccuracy = d.LocationAccuracy
	proto.LocationLongitude = d.LocationLongitude
	proto.LocationLatitude = d.LocationLatitude
	proto.LocationCountry = d.LocationCountry
	proto.LocationState = d.LocationState
	proto.LocationCity = d.LocationCity
	proto.LocationCity = d.LocationCity
	proto.LocationUpdatedAt, _ = timeToProto(d.LocationUpdatedAt)

	proto.NotificationAuthorization = audience.NotificationAuthorization(audience.NotificationAuthorization_value[d.NotificationAuthorization])

	// TODO:
	// proto.RegionMonitoringMode = audience.Device_RegionMonitoringMode(audience.Device_RegionMonitoringMode_value[d.RegionMonitoringMode])

	// proto.IbeaconMonitoringRegions = d.IbeaconMonitoringRegions
	// proto.IbeaconMonitoringRegionsUpdatedAt, _ = timeToProto(d.IbeaconMonitoringRegionsUpdatedAt)
	//
	// proto.GeofenceMonitoringRegions = d.GeofenceMonitoringRegions
	// proto.GeofenceMonitoringRegionsUpdatedAt, _ = timeToProto(d.GeofenceMonitoringRegionsUpdatedAt)

	return nil
}

func timeToProto(ts *time.Time) (*timestamp.Timestamp, error) {
	if ts == nil {
		return nil, nil
	}

	pts, err := timestamp.TimestampProto(*ts)
	if err != nil {
		return nil, err
	}

	return pts, nil
}

type Profile struct {
	Id         string     `json:"id"`
	Identifier string     `json:"identifier"`
	AccountId  int32      `json:"account_id"`
	CreatedAt  *time.Time `json:"created_at"`
	UpdatedAt  *time.Time `json:"updated_at"`

	Attributes M `json:"attributes"`
}

func (p *Profile) toProto(proto *audience.Profile) error {
	proto.AccountId = p.AccountId
	proto.Identifier = p.Identifier
	proto.Id = p.Id

	proto.CreatedAt, _ = timeToProto(p.CreatedAt)
	proto.UpdatedAt, _ = timeToProto(p.UpdatedAt)

	proto.Attributes = attributesToProto(p.Attributes)

	return nil
}

func attributesToProto(attributes M) map[string]*audience.Value {
	if attributes == nil || len(attributes) == 0 {
		return nil
	}

	var proto = make(map[string]*audience.Value)

	for k, v := range attributes {
		var val audience.Value
		if err := val.Load(v); err != nil {
			panic(err)
		}

		proto[k] = &val
	}

	return proto
}
