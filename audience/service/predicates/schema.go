package predicates

var (
	DeviceSchema = map[string]struct {
		MissingValue interface{}
	}{
		"device_id": {
			MissingValue: "",
		},
		"profile_identifier": {
			MissingValue: "",
		},
		"advertising_id": {
			MissingValue: "",
		},
		"app_build": {
			MissingValue: "",
		},
		"app_name": {
			MissingValue: "",
		},
		"app_namespace": {
			MissingValue: "",
		},
		"app_version": {
			MissingValue: "",
		},
		"carrier_name": {
			MissingValue: "",
		},
		"created_at": {
			MissingValue: nil,
		},
		"device_manufacturer": {
			MissingValue: "",
		},
		"device_model": {
			MissingValue: "",
		},
		"ip": {
			MissingValue: nil,
		},
		"is_background_enabled": {
			MissingValue: nil,
		},
		"is_bluetooth_enabled": {
			MissingValue: nil,
		},
		"is_cellular_enabled": {
			MissingValue: nil,
		},
		"is_location_monitoring_enabled": {
			MissingValue: nil,
		},
		"is_test_device": {
			MissingValue: nil,
		},
		"is_wifi_enabled": {
			MissingValue: nil,
		},
		"label": {
			MissingValue: "",
		},
		"locale_language": {
			MissingValue: "",
		},
		"locale_region": {
			MissingValue: "",
		},
		"locale_script": {
			MissingValue: "",
		},
		"location": {
			MissingValue: nil,
		},
		"location_accuracy": {
			MissingValue: int32(0),
		},
		"location_country": {
			MissingValue: "",
		},
		"location_state": {
			MissingValue: "",
		},
		"location_city": {
			MissingValue: "",
		},
		"location_latitude": {
			MissingValue: float64(0),
		},
		"location_longitude": {
			MissingValue: float64(0),
		},
		"location_updated_at": {
			MissingValue: nil,
		},
		"os_name": {
			MissingValue: "",
		},
		"os_version": {
			MissingValue: nil,
		},
		"platform": {
			MissingValue: "",
		},
		"notification_authorization": {
			MissingValue: "UNKNOWN",
		},
		"push_environment": {
			MissingValue: "",
		},
		"push_token_created_at": {
			MissingValue: nil,
		},
		"push_token_is_active": {
			MissingValue: nil,
		},
		"push_token_key": {
			MissingValue: "",
		},
		"push_token_unregistered_at": {
			MissingValue: "",
		},
		"push_token_updated_at": {
			MissingValue: nil,
		},
		"radio": {
			MissingValue: "",
		},
		"screen_height": {
			MissingValue: int64(0),
		},
		"screen_width": {
			MissingValue: int64(0),
		},
		"sdk_version": {
			MissingValue: nil,
		},
		"time_zone": {
			MissingValue: "",
		},
		"updated_at": {
			MissingValue: nil,
		},
	}

	ProfileSchema = map[string]struct {
		MissingValue interface{}
	}{
		"identifier": {
			MissingValue: "",
		},
		"updated_at": {
			MissingValue: nil,
		},
		"created_at": {
			MissingValue: nil,
		},
	}
)
