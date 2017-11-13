package elastic

import "github.com/roverplatform/rover/audience/service/mongodb"

func DeviceMapping() M {
	return M{
		"device": M{
			// Meta
			// https://www.elastic.co/guide/en/elasticsearch/reference/5.5/mapping-all-field.html
			"_all": M{"enabled": false},
			"_parent": M{
				"type": "profile",
			},
			"properties": M{
				"account_id": M{"type": "integer"},

				"device_id": M{"type": "keyword"},

				"profile_id": M{"type": "keyword"},

				"created_at": M{"type": "date"},
				"updated_at": M{"type": "date"},

				"is_test_device": M{"type": "boolean"},
				"label":          M{"type": "string"},

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

				"location_accuracy":   M{"type": "integer"},
				"location_region":     M{"type": "keyword"},
				"location_city":       M{"type": "keyword"},
				"location_street":     M{"type": "keyword"},
				"location_updated_at": M{"type": "date"},

				// map<string, Version> frameworks 		 :M{"type": ""},

				// maps to frameworks[io.rover.Rover]
				"sdk_version": M{
					"properties": M{
						"major":    M{"type": "integer"},
						"minor":    M{"type": "integer"},
						"revision": M{"type": "integer"},
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
	}
}

func ProfileMapping(profileAttributesMapping M) M {
	return M{
		// Profile
		"profile": M{
			// disable dynamic mapping updates
			// https://www.elastic.co/guide/en/elasticsearch/reference/5.5/dynamic.html
			//
			// false - Newly detected fields are ignored. These fields will not be
			// indexed so will not be searchable but will still appear in the _source
			// field of returned hits. These fields will not be added to the mapping,
			// new fields must be added explicitly.
			"dynamic": false,
			// Meta
			"_all": M{"enabled": false},
			// Props
			"properties": M{
				"id":         M{"type": "keyword"}, // {"$oid": "aaaaaaaaaaaaaaaaaaaaaa01"},
				"account_id": M{"type": "integer"},
				"identifier": M{"type": "keyword"}, // "78e19dbf-8c0b-47a5-b28f-444444444444",
				"created_at": M{"type": "date"},    //{"$date": "2016-08-22T19:05:53.102Z"},
				"updated_at": M{"type": "date"},    //{"$date": "2016-08-22T19:05:53.102Z"},
				"attributes": M{
					"properties": profileAttributesMapping,
				},
			},
		},
	}
}

func ProfileAttributesMapping(attrs []*mongodb.SchemaAttribute) M {
	var mapping = M{}

	for _, attr := range attrs {
		switch attr.AttributeType {
		case "bool":
			mapping[attr.Attribute] = M{"type": "boolean"}
		case "integer":
			mapping[attr.Attribute] = M{"type": "integer"}
		case "double":
			mapping[attr.Attribute] = M{"type": "double"}
		case "string":
			mapping[attr.Attribute] = M{"type": "keyword"}
		case "array[string]":
			mapping[attr.Attribute] = M{"type": "keyword"}
		case "null":
			// TODO: how is it mapped
			// mapping[attr.Attribute] = M{"type": "text"}
		case "timestamp":
			mapping[attr.Attribute] = M{"type": "date"}
		default:
			panic("unknown type:" + attr.AttributeType)
		}
	}

	return mapping
}
