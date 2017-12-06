package predicates

import (
	"github.com/pkg/errors"
	"github.com/roverplatform/rover/apis/go/audience/v1"
	"github.com/roverplatform/rover/go/protobuf/ptypes/timestamp"
	"math"
	"strings"
	"time"
)

var (
	TimeNow = time.Now

	// Use Toronto timezone as default zone where date/duration data should be compared with
	Zone = "America/Toronto"
)

func IsInDynamicSegment(segment *audience.DynamicSegment, device *audience.Device, profile *audience.Profile) (bool, error) {
	var (
		condition  = segment.GetPredicateAggregate().GetCondition()
		predicates = segment.GetPredicateAggregate().GetPredicates()
	)

	// First check all device attributes first
	for _, predicate := range predicates {
		var (
			isAttributeSet = false
			value          interface{}
			passed         = false
			err            error
			attribute_name = getAttributeNameFromPredicate(predicate)
		)

		switch predicate.GetSelector() {
		case audience.Predicate_ROVER_PROFILE:
			isAttributeSet = isProfileAttributeSet(profile, attribute_name)
			value = getProfileValue(profile, attribute_name)
		case audience.Predicate_CUSTOM_PROFILE:
			isAttributeSet = isProfileCustomAttributeSet(profile, attribute_name)
			value = getProfileCustomValue(profile, attribute_name)
		case audience.Predicate_DEVICE:
			isAttributeSet = isDeviceAttributeSet(device, attribute_name)
			value = getDeviceValue(device, attribute_name)
		default:
			return false, errors.Errorf("Unknown category type got %s", predicate.GetSelector().String())
		}

		switch p := predicate.GetValue().(type) {
		case *audience.Predicate_StringPredicate:
			passed, err = evalStringPredicate(p.StringPredicate, value, isAttributeSet)
		case *audience.Predicate_BoolPredicate:
			passed, err = evalBooleanPredicate(p.BoolPredicate, value, isAttributeSet)
		case *audience.Predicate_NumberPredicate:
			passed, err = evalNumberPredicate(p.NumberPredicate, value, isAttributeSet)
		case *audience.Predicate_DatePredicate:
			passed, err = evalDatePredicate(p.DatePredicate, value, isAttributeSet)
		case *audience.Predicate_VersionPredicate:
			passed, err = evalVersionPredicate(p.VersionPredicate, value, isAttributeSet)
		case *audience.Predicate_GeofencePredicate:
			passed, err = evalGeofencePredicate(p.GeofencePredicate, value, isAttributeSet)
		case *audience.Predicate_DoublePredicate:
			passed, err = evalDoublePredicate(p.DoublePredicate, value, isAttributeSet)
		case *audience.Predicate_StringArrayPredicate:
			passed, err = evalStringArrayPredicate(p.StringArrayPredicate, value, isAttributeSet)
		case *audience.Predicate_DurationPredicate:
			passed, err = evalDurationPredicate(p.DurationPredicate, value)

		default:
			passed = false
			err = errors.Errorf("Unknown predicate %T", predicate.GetValue())
		}

		if err != nil {
			return false, errors.Errorf("Could not eval predicate %v %v", predicate, err)
		}

		if condition == audience.PredicateAggregate_ALL && !passed {
			return false, nil
		}

		if condition == audience.PredicateAggregate_ANY && passed {
			return true, nil
		}
	}

	// Everything must have passed here
	return true, nil

}

// Helper method to pull out the attribute name from the predicate
func getAttributeNameFromPredicate(predicate *audience.Predicate) string {
	switch p := predicate.GetValue().(type) {
	case *audience.Predicate_StringPredicate:
		return p.StringPredicate.GetAttributeName()
	case *audience.Predicate_BoolPredicate:
		return p.BoolPredicate.GetAttributeName()
	case *audience.Predicate_NumberPredicate:
		return p.NumberPredicate.GetAttributeName()
	case *audience.Predicate_DatePredicate:
		return p.DatePredicate.GetAttributeName()
	case *audience.Predicate_VersionPredicate:
		return p.VersionPredicate.GetAttributeName()
	case *audience.Predicate_GeofencePredicate:
		return p.GeofencePredicate.GetAttributeName()
	case *audience.Predicate_DoublePredicate:
		return p.DoublePredicate.GetAttributeName()
	case *audience.Predicate_StringArrayPredicate:
		return p.StringArrayPredicate.GetAttributeName()
	case *audience.Predicate_DurationPredicate:
		return p.DurationPredicate.GetAttributeName()
	default:
		return ""
	}
}

// Given an attribute name lookup and pull out the custom value from the profile
func getProfileCustomValue(profile *audience.Profile, attribute_name string) interface{} {
	val, ok := profile.GetAttributes()[attribute_name]
	if !ok {
		return nil
	}

	value, _ := val.Value()

	return value
}

// Given an attribute name lookup and pull out the rover value from the profile
func getProfileValue(profile *audience.Profile, attribute_name string) interface{} {
	switch attribute_name {
	case "identifier":
		return profile.GetIdentifier()
	case "created_at":
		return profile.GetCreatedAt()
	case "updated_at":
		return profile.GetUpdatedAt()
	default:
		return nil
	}
}

func getDeviceValue(device *audience.Device, attribute_name string) interface{} {
	switch attribute_name {
	case "created_at":
		return device.GetCreatedAt()
	case "updated_at":
		return device.GetUpdatedAt()
	case "is_test_device":
		return device.GetIsTestDevice()
	case "label":
		return device.GetLabel()
	case "push_environment":
		return device.GetPushEnvironment()
	case "push_token_key":
		return device.GetPushTokenKey()
	case "push_token_is_active":
		return device.GetPushTokenIsActive()
	case "push_token_created_at":
		return device.GetPushTokenCreatedAt()
	case "push_token_updated_at":
		return device.GetPushTokenUpdatedAt()
	case "push_token_unregistered_at":
		return device.GetPushTokenUnregisteredAt()
	case "app_name":
		return device.GetAppName()
	case "app_version":
		return device.GetAppVersion()
	case "app_build":
		return device.GetAppBuild()
	case "app_namespace":
		return device.GetAppNamespace()
	case "device_manufacturer":
		return device.GetDeviceManufacturer()
	case "device_model":
		return device.GetDeviceModel()
	case "os_name":
		return device.GetOsName()
	case "os_version":
		return device.GetOsVersion()
	case "sdk_version":
		v, ok := device.GetFrameworks()["io.rover.Rover"]
		if !ok {
			return nil
		}
		return v
	case "locale_language":
		return device.GetLocaleLanguage()
	case "locale_region":
		return device.GetLocaleRegion()
	case "locale_script":
		return device.GetLocaleScript()
	case "is_wifi_enabled":
		return device.GetIsWifiEnabled()
	case "is_cellular_enabled":
		return device.GetIsCellularEnabled()
	case "screen_width":
		return device.GetScreenWidth()
	case "screen_height":
		return device.GetScreenHeight()
	case "carrier_name":
		return device.GetCarrierName()
	case "radio":
		return device.GetRadio()
	case "time_zone":
		return device.GetTimeZone()
	case "platform":
		return device.GetPlatform()
	case "is_background_enabled":
		return device.GetIsBackgroundEnabled()
	case "is_location_monitoring_enabled":
		return device.GetIsLocationMonitoringEnabled()
	case "is_bluetooth_enabled":
		return device.GetIsBluetoothEnabled()
	case "advertising_id":
		return device.GetAdvertisingId()
	case "ip":
		return device.GetIp()
	case "location":
		location := &latlng{latitude: device.GetLocationLatitude(), longitude: device.GetLocationLongitude()}
		return location
	case "location_accuracy":
		return device.GetLocationAccuracy()
	case "location_longitude":
		return device.GetLocationLongitude()
	case "location_latitude":
		return device.GetLocationLatitude()
	case "location_updated_at":
		return device.GetLocationUpdatedAt()
	case "location_country":
		return ""
		// TODO: return device.GetLocationCountry()
	case "location_region":
		return device.GetLocationRegion()
	case "location_city":
		return device.GetLocationCity()
	case "location_street":
		return device.GetLocationStreet()
	case "region_monitoring_mode":
		return device.GetRegionMonitoringMode()
	case "ibeacon_monitoring_regions_updated_at":
		return device.GetIbeaconMonitoringRegionsUpdatedAt()
	case "geofence_monitoring_regions_updated_at":
		return device.GetGeofenceMonitoringRegionsUpdatedAt()
	default:
		return nil
	}
}

func isProfileCustomAttributeSet(profile *audience.Profile, attribute_name string) bool {
	_, ok := profile.GetAttributes()[attribute_name]
	return ok
}

func isProfileAttributeSet(profile *audience.Profile, attribute_name string) bool {
	switch attribute_name {
	case "identifier":
		return profile.GetIdentifier() != ""
	case "created_at":
		return profile.GetCreatedAt() != nil
	case "updated_at":
		return profile.GetUpdatedAt() != nil
	default:
		return false
	}
}

func isDeviceAttributeSet(device *audience.Device, attribute_name string) bool {

	schema, ok := DeviceSchema[attribute_name]

	if !ok {
		return false
	}

	value := getDeviceValue(device, attribute_name)

	return schema.MissingValue != value
}

func evalVersionPredicate(predicate *audience.VersionPredicate, value interface{}, isAttributeSet bool) (bool, error) {
	if predicate.GetOp() == audience.VersionPredicate_IS_SET {
		return isAttributeSet, nil
	} else if predicate.GetOp() == audience.VersionPredicate_IS_UNSET {
		return !isAttributeSet, nil
	} else if val, ok := value.(*audience.Version); ok {
		switch predicate.GetOp() {
		case audience.VersionPredicate_IS_EQUAL:
			compare := predicate.GetValue()
			return val.GetMajor() == compare.GetMajor() && val.GetMinor() == compare.GetMinor() && val.GetRevision() == compare.GetRevision(), nil
		case audience.VersionPredicate_IS_NOT_EQUAL:
			compare := predicate.GetValue()
			return !(val.GetMajor() == compare.GetMajor() && val.GetMinor() == compare.GetMinor() && val.GetRevision() == compare.GetRevision()), nil
		case audience.VersionPredicate_IS_GREATER_THAN:
			compare := predicate.GetValue()
			return val.GetMajor() > compare.GetMajor() ||
				val.GetMajor() == compare.GetMajor() && val.GetMinor() > compare.GetMinor() ||
				val.GetMajor() == compare.GetMajor() && val.GetMinor() == compare.GetMinor() && val.GetRevision() > compare.GetRevision(), nil
		case audience.VersionPredicate_IS_GREATER_THAN_OR_EQUAL:
			compare := predicate.GetValue()
			return val.GetMajor() > compare.GetMajor() ||
				val.GetMajor() == compare.GetMajor() && val.GetMinor() > compare.GetMinor() ||
				val.GetMajor() == compare.GetMajor() && val.GetMinor() == compare.GetMinor() && val.GetRevision() >= compare.GetRevision(), nil
		case audience.VersionPredicate_IS_LESS_THAN:
			compare := predicate.GetValue()
			return val.GetMajor() < compare.GetMajor() ||
				val.GetMajor() == compare.GetMajor() && val.GetMinor() < compare.GetMinor() ||
				val.GetMajor() == compare.GetMajor() && val.GetMinor() == compare.GetMinor() && val.GetRevision() < compare.GetRevision(), nil
		case audience.VersionPredicate_IS_LESS_THAN_OR_EQUAL:
			compare := predicate.GetValue()
			return val.GetMajor() < compare.GetMajor() ||
				val.GetMajor() == compare.GetMajor() && val.GetMinor() < compare.GetMinor() ||
				val.GetMajor() == compare.GetMajor() && val.GetMinor() == compare.GetMinor() && val.GetRevision() <= compare.GetRevision(), nil
		case audience.VersionPredicate_IS_BETWEEN:

			compareGreater := predicate.GetValue()
			compareLess := predicate.GetValue2()

			isGreaterThanOrEqual := val.GetMajor() > compareGreater.GetMajor() ||
				val.GetMajor() == compareGreater.GetMajor() && val.GetMinor() > compareGreater.GetMinor() ||
				val.GetMajor() == compareGreater.GetMajor() && val.GetMinor() == compareGreater.GetMinor() && val.GetRevision() >= compareGreater.GetRevision()

			isLessThanOrEqual := val.GetMajor() < compareLess.GetMajor() ||
				val.GetMajor() == compareLess.GetMajor() && val.GetMinor() < compareLess.GetMinor() ||
				val.GetMajor() == compareLess.GetMajor() && val.GetMinor() == compareLess.GetMinor() && val.GetRevision() <= compareLess.GetRevision()

			return isGreaterThanOrEqual && isLessThanOrEqual, nil

		default:
			return false, errors.Errorf("VersionPredicate OP: \"%s\" is not a valid operation", predicate.GetOp().String())
		}
	} else if value == nil {
		return false, nil
	} else {
		return false, errors.Errorf("Value was not of type *audience.Version instead got %T", value)
	}
}

func evalDurationPredicate(predicate *audience.DurationPredicate, value interface{}) (bool, error) {
	if val, ok := value.(*timestamp.Timestamp); ok {
		var (
			utcPredTime  time.Time
			utcPredTime1 time.Time
		)
		valDate := time.Unix(val.Seconds, int64(val.Nanos)).UTC()
		op := predicate.GetOp()

		loc, err := time.LoadLocation(Zone)
		if err != nil {
			return false, err
		}

		timezoneTime := TimeNow().In(loc)

		// Subtract # of days
		targetDay := timezoneTime.Add(-time.Duration(predicate.GetValue().Duration*24*60*60) * time.Second)

		/*
			ie. first seen is more than 8 days ago,
			let timeNow = Nov 1, 2017 6:20 PM Toronto/America
			Want values less than Oct 24, 2017 04:00:00 UTC

			targetDay = Oct 24, 2017 18:20:00 Toronto/America
			predDate = Oct 24, 2017 00:00:00 Toronto/America
			utcPredTime = Oct 24, 2017 04:00:00 UTC

			value < utcPredTime
			<-----------o
			_____________________________
						|				|
			more than 8 days ago		Nov 1
		*/

		/*
			ie. first seen is less than 2 days ago, (all values from the start of yesterday til now)
			let timeNow = Nov 1, 2017 3:38 PM Toronto/America
			Want values more than Oct 31, 2017 04:00:00 UTC

			targetDay = Oct 31, 2017 15:38:00 Toronto/America
			predDate1 = Oct 31, 2017 00:00:00 Toronto/America
			utcPredTime1 = Oct 31, 2017 04:00:00 UTC
			utcPredTime <= value
						x---------->
			_________________________
						|			|
			less than 2 days ago	Nov 1
		*/
		predDate := time.Date(targetDay.Year(), targetDay.Month(), targetDay.Day(), 0, 0, 0, 0, time.UTC)
		utcPredTime, err = timeZoneToUTC(predDate)
		if err != nil {
			return false, err
		}

		if op == audience.DurationPredicate_IS_GREATER_THAN || op == audience.DurationPredicate_IS_EQUAL {
			targetDay1 := targetDay.AddDate(0, 0, 1)
			predDate1 := time.Date(targetDay1.Year(), targetDay1.Month(), targetDay1.Day(), 0, 0, 0, 0, time.UTC)
			utcPredTime1, err = timeZoneToUTC(predDate1)
			if err != nil {
				return false, err
			}
		}

		switch op {
		case audience.DurationPredicate_IS_LESS_THAN:
			return valDate.Before(utcPredTime), nil
		case audience.DurationPredicate_IS_GREATER_THAN:
			return (valDate.After(utcPredTime1) || valDate.Equal(utcPredTime1)), nil
		case audience.DurationPredicate_IS_EQUAL:
			/*
				`first seen exactly 1 day ago`
				time.Now() = Nov 1, 2017 3:38 PM UTC

				1. Subtract # of days
				Nov 1, 2017 3:38 PM subtract 1 days  = Oct 31, 2017 3:38 PM

				2. Truncate this new day and get range of day
				Oct 31, 2017 00:00:00   -> Nov 1, 2017 00:00:00

				3. Convert this range into UTC from timezone && Search for values within this range
				Oct 31, 2017 04:00:00 UTC <= value < Nov 1, 2017 04:00:00 UTC
			*/
			return (valDate.After(utcPredTime) || valDate.Equal(utcPredTime)) && valDate.Before(utcPredTime1), nil
		default:
			return false, errors.Errorf("DurationPredicate OP: \"%s\" is not a valid operation", op.String())
		}

		return false, nil
	} else if value == nil {
		return false, nil
	} else {
		return false, errors.Errorf("Value was not of type *timestamp.Timestamp instead got %T", value)
	}
}

func timeZoneToUTC(t time.Time) (time.Time, error) {
	// Convert time to Zone then add/subtract back timezone offset for UTC time
	loc, err := time.LoadLocation(Zone)
	if err != nil {
		return t, err
	}

	return time.Date(t.Year(), t.Month(), t.Day(), t.Hour(), t.Minute(), t.Second(), t.Nanosecond(), loc).UTC(), nil
}

func evalDatePredicate(predicate *audience.DatePredicate, value interface{}, isAttributeSet bool) (bool, error) {
	if val, ok := value.(*timestamp.Timestamp); ok {
		op := predicate.GetOp()

		if op == audience.DatePredicate_IS_UNSET {
			return !isAttributeSet, nil
		} else if op == audience.DatePredicate_IS_SET {
			return isAttributeSet, nil
		} else {
			valDate := time.Unix(val.Seconds, int64(val.Nanos)).UTC()
			date := time.Date(int(predicate.GetValue().Year), time.Month(int(predicate.GetValue().Month)), int(predicate.GetValue().Day), 0, 0, 0, 0, time.UTC)

			var (
				utcPredTime  time.Time
				utcPredTime1 time.Time
				err          error
			)

			if op == audience.DatePredicate_IS_BEFORE || op == audience.DatePredicate_IS_ON {
				predDate := date.Truncate(time.Duration(24*60*60) * time.Second)
				utcPredTime1, err = timeZoneToUTC(predDate)
				if err != nil {
					return false, err
				}
			}

			if op == audience.DatePredicate_IS_AFTER || op == audience.DatePredicate_IS_ON {
				predDate := date.AddDate(0, 0, 1).Truncate(time.Duration(24*60*60) * time.Second)
				utcPredTime, err = timeZoneToUTC(predDate)
				if err != nil {
					return false, err
				}
			}

			switch op {
			case audience.DatePredicate_IS_AFTER:
				/*
					After Oct 30, 2017
					Oct 31, 2017 04:00:00 <= values
				*/
				return (valDate.After(utcPredTime) || valDate.Equal(utcPredTime)), nil
			case audience.DatePredicate_IS_BEFORE:
				/*
					Before Oct 30, 2017
					 values < Oct 30, 2017 04:00:00
				*/
				return valDate.Before(utcPredTime1), nil
			case audience.DatePredicate_IS_ON:
				/*
					ie. Predicate Value = Oct 30, 2017
					 Oct-30-2017 4:00:00:00 UTC <= valDate (UTC) < Oct-31-2017 4:00:00:00 UTC
				*/
				return (valDate.After(utcPredTime1) || valDate.Equal(utcPredTime1)) && valDate.Before(utcPredTime), nil
			default:
				return false, errors.Errorf("DatePredicate OP: \"%s\" is not a valid operation", op.String())
			}
		}
		return false, nil
	} else if value == nil {
		return false, nil
	} else {
		return false, errors.Errorf("Value was not of type *timestamp.Timestamp instead got %T", value)
	}

}

func evalDoublePredicate(predicate *audience.DoublePredicate, value interface{}, isAttributeSet bool) (bool, error) {
	if predicate.GetOp() == audience.DoublePredicate_IS_UNSET {
		return !isAttributeSet, nil
	} else if predicate.GetOp() == audience.DoublePredicate_IS_SET {
		return isAttributeSet, nil
	} else if val, ok := value.(float64); ok {
		switch predicate.GetOp() {
		case audience.DoublePredicate_IS_EQUAL:
			return val == predicate.GetValue(), nil
		case audience.DoublePredicate_IS_NOT_EQUAL:
			return val != predicate.GetValue(), nil
		case audience.DoublePredicate_IS_GREATER_THAN:
			return val > predicate.GetValue(), nil
		case audience.DoublePredicate_IS_LESS_THAN:
			return val < predicate.GetValue(), nil
		case audience.DoublePredicate_IS_BETWEEN:
			return predicate.GetValue() <= val && val <= predicate.GetValue2(), nil
		default:
			return false, errors.Errorf("DoublePredicate OP: \"%s\" is not a valid operation", predicate.GetOp().String())
		}
	} else if value == nil {
		return false, nil
	} else {
		return false, errors.Errorf("Value was not of type float64 instead got %T", value)
	}
}

func evalNumberPredicate(predicate *audience.NumberPredicate, value interface{}, isAttributeSet bool) (bool, error) {

	// We accept both int32 and int64 as input but compare only int64 to int64
	v32, ok32 := value.(int32)
	v64, ok64 := value.(int64)

	if predicate.GetOp() == audience.NumberPredicate_IS_UNSET {
		return !isAttributeSet, nil
	} else if predicate.GetOp() == audience.NumberPredicate_IS_SET {
		return isAttributeSet, nil
	} else if ok32 || ok64 {
		val := int64(v32)
		if ok64 {
			val = v64
		}

		switch predicate.GetOp() {
		case audience.NumberPredicate_IS_EQUAL:
			return val == predicate.GetValue(), nil
		case audience.NumberPredicate_IS_NOT_EQUAL:
			return val != predicate.GetValue(), nil
		case audience.NumberPredicate_IS_GREATER_THAN:
			return predicate.GetValue() > val, nil
		case audience.NumberPredicate_IS_LESS_THAN:
			return predicate.GetValue() < val, nil
		case audience.NumberPredicate_IS_BETWEEN:
			return predicate.GetValue() <= val && val <= predicate.GetValue2(), nil
		default:
			return false, errors.Errorf("NumberPredicate OP: \"%s\" is not a valid operation", predicate.GetOp().String())
		}
	} else if value == nil {
		return false, nil
	} else {
		return false, errors.Errorf("Value was not of type int instead got %T", value)
	}
}

func evalStringPredicate(predicate *audience.StringPredicate, value interface{}, isAttributeSet bool) (bool, error) {

	if predicate.GetOp() == audience.StringPredicate_IS_SET {
		return isAttributeSet, nil
	} else if predicate.GetOp() == audience.StringPredicate_IS_UNSET {
		return !isAttributeSet, nil
	} else if v, ok := value.(string); ok {
		switch predicate.GetOp() {
		case audience.StringPredicate_IS_EQUAL:
			return v == predicate.GetValue(), nil
		case audience.StringPredicate_IS_NOT_EQUAL:
			return v != predicate.GetValue(), nil
		case audience.StringPredicate_STARTS_WITH:
			return strings.HasPrefix(v, predicate.GetValue()), nil
		case audience.StringPredicate_ENDS_WITH:
			return strings.HasSuffix(v, predicate.GetValue()), nil
		case audience.StringPredicate_CONTAINS:
			return strings.Contains(v, predicate.GetValue()), nil
		case audience.StringPredicate_DOES_NOT_CONTAIN:
			return !strings.Contains(v, predicate.GetValue()), nil
		default:
			return false, errors.Errorf("StringPredicate OP: \"%s\" is not a valid operation", predicate.GetOp().String())
		}
	} else if value == nil {
		return false, nil
	} else {
		return false, errors.Errorf("Value was not a string. Instead got %T", value)
	}
}

func evalGeofencePredicate(predicate *audience.GeofencePredicate, value interface{}, isAttributeSet bool) (bool, error) {
	if predicate.GetOp() == audience.GeofencePredicate_IS_SET {
		return isAttributeSet, nil
	} else if predicate.GetOp() == audience.GeofencePredicate_IS_UNSET {
		return !isAttributeSet, nil
	} else if point, ok := value.(*latlng); ok {
		switch predicate.GetOp() {
		case audience.GeofencePredicate_IS_OUTSIDE:
			return !point.Within(predicate.GetValue().GetLatitude(), predicate.GetValue().GetLongitude(), float64(predicate.GetValue().GetRadius())), nil
		case audience.GeofencePredicate_IS_WITHIN:
			return point.Within(predicate.GetValue().GetLatitude(), predicate.GetValue().GetLongitude(), float64(predicate.GetValue().GetRadius())), nil
		default:
			return false, errors.Errorf("GeofencePredicate OP: \"%s\" is not a valid operation", predicate.GetOp().String())
		}
	} else if value == nil {
		return false, nil
	} else {
		return false, errors.Errorf("Value was not a LatLng. Instead got %T", value)
	}
}

func arrayContains(value string, list []string) bool {
	for _, v := range list {
		if value == v {
			return true
		}
	}

	return false
}

func arrayContainsCount(contains []string, list []string) int {
	var containsCount = 0
	for _, v := range contains {
		if arrayContains(v, list) {
			containsCount += 1
		}
	}

	return containsCount
}

func evalStringArrayPredicate(predicate *audience.StringArrayPredicate, value interface{}, isAttributeSet bool) (bool, error) {
	if predicate.GetOp() == audience.StringArrayPredicate_IS_SET {
		return isAttributeSet, nil
	} else if predicate.GetOp() == audience.StringArrayPredicate_IS_UNSET {
		return !isAttributeSet, nil
	} else if val, ok := value.([]string); ok {
		switch predicate.GetOp() {
		case audience.StringArrayPredicate_CONTAINS_ANY:
			return arrayContainsCount(predicate.GetValue(), val) > 0, nil

		case audience.StringArrayPredicate_DOES_NOT_CONTAIN_ANY:
			return arrayContainsCount(predicate.GetValue(), val) == 0, nil

		case audience.StringArrayPredicate_CONTAINS_ALL:
			return arrayContainsCount(predicate.GetValue(), val) == len(predicate.GetValue()), nil

		case audience.StringArrayPredicate_DOES_NOT_CONTAIN_ALL:
			return arrayContainsCount(predicate.GetValue(), val) < len(predicate.GetValue()), nil

		default:
			return false, errors.Errorf("StringArrayPredicate OP: \"%s\" is not a valid operation", predicate.GetOp().String())
		}
	} else if value == nil {
		return false, nil
	} else {
		return false, errors.Errorf("Value was not a string array instead got %T", value)
	}
}

func evalBooleanPredicate(predicate *audience.BoolPredicate, value interface{}, isAttributeSet bool) (bool, error) {
	switch predicate.GetOp() {
	case audience.BoolPredicate_IS_EQUAL:
		if val, ok := value.(bool); ok {
			return val == predicate.GetValue(), nil
		} else {
			return false, errors.Errorf("Value was not a boolean instead got %T", value)
		}
	case audience.BoolPredicate_IS_SET:
		return isAttributeSet, nil
	case audience.BoolPredicate_IS_UNSET:
		return !isAttributeSet, nil
	default:
		return false, errors.Errorf("BooleanPredicate OP: \"%s\" is not a valid operation", predicate.GetOp().String())
	}
}

// Private type that defines a latlng point
type latlng struct {
	latitude  float64
	longitude float64
}

// Implementation of the haversine formula https://en.wikipedia.org/wiki/Haversine_formula to calculate distance in meters
// between two latlng points
func haversine(lonFrom float64, latFrom float64, lonTo float64, latTo float64) (distance float64) {
	var deltaLat = (latTo - latFrom) * (math.Pi / 180)
	var deltaLon = (lonTo - lonFrom) * (math.Pi / 180)

	var a = math.Sin(deltaLat/2)*math.Sin(deltaLat/2) +
		math.Cos(latFrom*(math.Pi/180))*math.Cos(latTo*(math.Pi/180))*
			math.Sin(deltaLon/2)*math.Sin(deltaLon/2)
	var c = 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	// Earth radius 6378100
	distance = 6378100 * c

	return
}

func (g *latlng) Within(latitude float64, longitude float64, radius float64) bool {
	distance := haversine(longitude, latitude, g.longitude, g.latitude)
	return distance <= radius
}
