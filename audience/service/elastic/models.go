package elastic

import (
	"time"

	"github.com/roverplatform/rover/audience/service/mongodb"
)

var (
	TimeFormat = time.RFC3339
)

// ProfileDoc maps mongo representation into ES representation
func ProfileDoc(p *mongodb.Profile) M {
	var m = M{
		"id":         p.Id.Hex(),
		"account_id": p.AccountId,
		"identifier": p.Identifier,
		"created_at": TimeDoc(p.CreatedAt),
		"updated_at": TimeDoc(p.UpdatedAt),

		"attributes": p.Attributes,
	}

	return m
}

func TimeDoc(t *time.Time) interface{} {
	if t == nil {
		return nil
	}

	return t.Format(TimeFormat)
}

func VersionDoc(v *mongodb.Version) interface{} {
	if v == nil {
		return nil
	}

	return M{
		"major":    v.Major,
		"minor":    v.Minor,
		"revision": v.Revision,
	}
}

func DeviceDoc(d *mongodb.Device) M {
	var m = M{
		"account_id": d.AccountId,
		"device_id":  d.DeviceId,
		"profile_id": d.ProfileId,

		"created_at": TimeDoc(d.CreatedAt),
		"updated_at": TimeDoc(d.UpdatedAt),

		"is_test_device":             d.IsTestDevice,
		"label":                      d.Label,
		"push_environment":           d.PushEnvironment,
		"push_token_key":             d.PushTokenKey,
		"push_token_is_active":       d.PushTokenIsActive,
		"push_token_created_at":      TimeDoc(d.PushTokenCreatedAt),
		"push_token_updated_at":      TimeDoc(d.PushTokenUpdatedAt),
		"push_token_unregistered_at": TimeDoc(d.PushTokenUnregisteredAt),

		"app_name":            d.AppName,
		"app_version":         d.AppVersion,
		"app_build":           d.AppBuild,
		"app_namespace":       d.AppNamespace,
		"device_manufacturer": d.DeviceManufacturer,
		"device_model":        d.DeviceModel,
		"os_name":             d.OsName,
		//
		"os_version": VersionDoc(d.OsVersion),

		"locale_language": d.LocaleLanguage,
		"locale_region":   d.LocaleRegion,
		"locale_script":   d.LocaleScript,

		"is_wifi_enabled":     d.IsWifiEnabled,
		"is_cellular_enabled": d.IsCellularEnabled,

		"screen_width":  d.ScreenWidth,
		"screen_height": d.ScreenHeight,

		"carrier_name": d.CarrierName,
		"radio":        d.Radio,
		"time_zone":    d.TimeZone,
		"platform":     d.Platform,

		"is_background_enabled":          d.IsBackgroundEnabled,
		"is_location_monitoring_enabled": d.IsLocationMonitoringEnabled,
		"is_bluetooth_enabled":           d.IsBluetoothEnabled,

		"advertising_id": d.AdvertisingId,

		"location_latitude":  d.LocationLatitude,
		"location_longitude": d.LocationLongitude,

		"location_accuracy":   d.LocationAccuracy,
		"location_region":     d.LocationRegion,
		"location_city":       d.LocationCity,
		"location_street":     d.LocationStreet,
		"location_updated_at": d.LocationUpdatedAt,

		// map<string, Version> frameworks 		 :M{"type": ""},

		// RegionMonitoringMode region_monitoring_mode = 47;
		//
		// google.protobuf.Timestamp ibeacon_monitoring_regions_updated_at = 48;
		// repeated IBeaconRegion ibeacon_monitoring_regions = 49;
		//
		// google.protobuf.Timestamp geofence_monitoring_regions_updated_at = 50;
		// repeated GeofenceRegion geofence_monitoring_regions = 51;

	}

	if d.NotificationAuthorization == "" {
		m["notification_authorization"] = "UNKNOWN"
	} else {
		m["notification_authorization"] = d.NotificationAuthorization
	}

	if d.LocationLongitude != float64(0) && d.LocationLatitude != float64(0) {
		// https://www.elastic.co/guide/en/elasticsearch/reference/5.5/geo-point.html
		m["location"] = M{"lat": d.LocationLatitude, "lon": d.LocationLongitude}
	}

	// NOTE: key is encoded as dots aren't allowed in mongo map keys
	if sdk, ok := d.Frameworks["io%2Erover%2ERover"]; ok {
		m["sdk_version"] = VersionDoc(sdk)
	} else if sdk, ok := d.Frameworks["io.rover.Rover"]; ok {
		m["sdk_version"] = VersionDoc(sdk)
	}

	if d.Ip != "" {
		m["ip"] = d.Ip
	}

	return m
}
