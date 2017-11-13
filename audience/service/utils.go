package service

import "github.com/roverplatform/rover/apis/go/audience/v1"

func hardcodedDeviceSchema(acctID int32) []*audience.SchemaAttribute {
	return []*audience.SchemaAttribute{
		{AccountId: acctID, AttributeType: "timestamp", Attribute: "created_at", Label: "Created At", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "timestamp", Attribute: "updated_at", Label: "Updated At", Id: "", Path: ""},

		{AccountId: acctID, AttributeType: "timestamp", Attribute: "push_token_updated_at", Label: "Push Token Updated At", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "timestamp", Attribute: "push_token_unregistered_at", Label: "Push Token Unregistered At", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "push_environment", Label: "Push Environment", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "push_token_key", Label: "Push Token", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "bool", Attribute: "push_token_is_active", Label: "Push Token Is Active", Id: "", Path: ""},

		{AccountId: acctID, AttributeType: "string", Attribute: "app_name", Label: "App Name", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "app_version", Label: "App Version", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "app_build", Label: "App Build", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "app_namespace", Label: "App Namespace", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "device_manufacturer", Label: "Device Manufacturer", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "device_model", Label: "Device Model", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "os_name", Label: "Os Name", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "locale_language", Label: "Locale Language", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "locale_region", Label: "Locale Region", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "locale_script", Label: "Locale Script", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "bool", Attribute: "is_wifi_enabled", Label: "Wifi Enabled", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "bool", Attribute: "is_cellular_enabled", Label: "Cellular Enabled", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "int32", Attribute: "screen_width", Label: "Screen Width", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "int32", Attribute: "screen_height", Label: "Screen Height", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "carrier_name", Label: "Carrier", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "radio", Label: "Radio", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "time_zone", Label: "Time Zone", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "bool", Attribute: "is_background_enabled", Label: "Background Enabled", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "bool", Attribute: "is_location_monitoring_enabled", Label: "Location Monitoring Enabled", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "bool", Attribute: "is_bluetooth_enabled", Label: "Bluetooth Enabled", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "advertising_id", Label: "Advertising Id", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "ip", Label: "IP", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "geopoint", Attribute: "location", Label: "Location", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "int32", Attribute: "location_accuracy", Label: "Location Accuracy", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "double", Attribute: "location_latitude", Label: "Location Latitude", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "double", Attribute: "location_longitude", Label: "Location Longitude", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "location_region", Label: "Location Region", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "location_city", Label: "Location City", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "timestamp", Attribute: "location_updated_at", Label: "Location Updated At", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "string", Attribute: "location_street", Label: "Location Street", Id: "", Path: ""},
		{AccountId: acctID, AttributeType: "version", Attribute: "os_version", Label: "Os Version", Id: "", Path: ""},
		// sdk_version is a temporary workaround for frameworks
		// which points to frameworks["io.rover.Rover"] value
		{AccountId: acctID, AttributeType: "version", Attribute: "sdk_version", Label: "SDK Version", Id: "", Path: ""},
	}
}

// TODO:
// this requries additional design/planning: only simple types for now
// map<string, Version> frameworks = 24;
// {AttributeType:"regionmonitoringmode", Attribute:"region_monitoring_mode", AccountId: acct_id, Label: acct_id, Id: "", Path: "" },
// {AttributeType:"platform", Attribute:"platform", AccountId: acct_id, Label: acct_id, Id: "", Path: "" },
//
// RegionMonitoringMode region_monitoring_mode = 47;
//
// google.protobuf.Timestamp ibeacon_monitoring_regions_updated_at = 48;
// repeated IBeaconRegion ibeacon_monitoring_regions = 49;
//
// google.protobuf.Timestamp geofence_monitoring_regions_updated_at = 50;
// repeated GeofenceRegion geofence_monitoring_regions = 51;
