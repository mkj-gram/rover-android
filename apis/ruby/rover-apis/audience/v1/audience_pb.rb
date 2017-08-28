# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: audience/v1/audience.proto

require 'google/protobuf'

require 'google/protobuf/timestamp_pb'
require 'auth/v1/auth_pb'
Google::Protobuf::DescriptorPool.generated_pool.build do
  add_message "rover.audience.v1.GetProfileRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :profile_id, :string, 2
  end
  add_message "rover.audience.v1.GetProfileResponse" do
    optional :profile, :message, 1, "rover.audience.v1.Profile"
  end
  add_message "rover.audience.v1.CreateProfileRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
  end
  add_message "rover.audience.v1.CreateProfileResponse" do
    optional :profile, :message, 1, "rover.audience.v1.Profile"
  end
  add_message "rover.audience.v1.DeleteProfileRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :profile_id, :string, 2
  end
  add_message "rover.audience.v1.DeleteProfileResponse" do
  end
  add_message "rover.audience.v1.UpdateProfileRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :profile_id, :string, 2
    map :attributes, :string, :message, 5, "rover.audience.v1.ValueUpdates"
  end
  add_message "rover.audience.v1.UpdateProfileResponse" do
  end
  add_message "rover.audience.v1.UpdateProfileIdentifierRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :profile_id, :string, 2
    optional :identifier, :string, 3
  end
  add_message "rover.audience.v1.UpdateProfileIdentifierResponse" do
  end
  add_message "rover.audience.v1.GetProfileByDeviceIdRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
  end
  add_message "rover.audience.v1.GetProfileByDeviceIdResponse" do
    optional :profile, :message, 1, "rover.audience.v1.Profile"
  end
  add_message "rover.audience.v1.GetProfileByIdentifierRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :identifier, :string, 2
  end
  add_message "rover.audience.v1.GetProfileByIdentifierResponse" do
    optional :profile, :message, 1, "rover.audience.v1.Profile"
  end
  add_message "rover.audience.v1.ListProfilesByIdsRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    repeated :profile_ids, :string, 2
  end
  add_message "rover.audience.v1.ListProfilesByIdsResponse" do
    repeated :profiles, :message, 2, "rover.audience.v1.Profile"
  end
  add_message "rover.audience.v1.ListProfilesByIdentifiersRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    repeated :profile_identifiers, :string, 2
  end
  add_message "rover.audience.v1.ListProfilesByIdentifiersResponse" do
    repeated :profiles, :message, 2, "rover.audience.v1.Profile"
  end
  add_message "rover.audience.v1.GetProfileSchemaRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
  end
  add_message "rover.audience.v1.GetProfileSchemaResponse" do
    optional :schema, :message, 1, "rover.audience.v1.ProfileSchema"
  end
  add_message "rover.audience.v1.ProfileSchema" do
    repeated :attributes, :message, 10, "rover.audience.v1.SchemaAttribute"
  end
  add_message "rover.audience.v1.Profile" do
    optional :id, :string, 1
    optional :account_id, :int32, 2
    optional :identifier, :string, 3
    map :attributes, :string, :message, 4, "rover.audience.v1.Value"
    optional :created_at, :message, 5, "google.protobuf.Timestamp"
    optional :updated_at, :message, 6, "google.protobuf.Timestamp"
  end
  add_message "rover.audience.v1.GetDeviceRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
  end
  add_message "rover.audience.v1.GetDeviceResponse" do
    optional :device, :message, 1, "rover.audience.v1.Device"
  end
  add_message "rover.audience.v1.GetDeviceByPushTokenRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :push_token_key, :string, 2
  end
  add_message "rover.audience.v1.GetDeviceByPushTokenResponse" do
    optional :device, :message, 1, "rover.audience.v1.Device"
  end
  add_message "rover.audience.v1.CreateDeviceRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :profile_id, :string, 2
    optional :device_id, :string, 3
  end
  add_message "rover.audience.v1.CreateDeviceResponse" do
  end
  add_message "rover.audience.v1.UpdateDevicePushTokenRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    optional :push_token_key, :string, 3
    optional :push_environment, :string, 4
  end
  add_message "rover.audience.v1.UpdateDevicePushTokenResponse" do
  end
  add_message "rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
  end
  add_message "rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse" do
  end
  add_message "rover.audience.v1.UpdateDeviceLocationRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    optional :location_accuracy, :int32, 3
    optional :location_latitude, :double, 4
    optional :location_longitude, :double, 5
  end
  add_message "rover.audience.v1.UpdateDeviceLocationResponse" do
  end
  add_message "rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    repeated :regions, :message, 3, "rover.audience.v1.GeofenceRegion"
  end
  add_message "rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse" do
  end
  add_message "rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    repeated :regions, :message, 3, "rover.audience.v1.IBeaconRegion"
  end
  add_message "rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse" do
  end
  add_message "rover.audience.v1.UpdateDeviceTestPropertyRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    optional :is_test_device, :bool, 3
  end
  add_message "rover.audience.v1.UpdateDeviceTestPropertyResponse" do
  end
  add_message "rover.audience.v1.DeleteDeviceRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
  end
  add_message "rover.audience.v1.DeleteDeviceResponse" do
  end
  add_message "rover.audience.v1.SetDeviceProfileRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    optional :profile_id, :string, 3
  end
  add_message "rover.audience.v1.SetDeviceProfileResponse" do
  end
  add_message "rover.audience.v1.ListDevicesByProfileIdRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :profile_id, :string, 2
  end
  add_message "rover.audience.v1.ListDevicesByProfileIdResponse" do
    repeated :devices, :message, 1, "rover.audience.v1.Device"
  end
  add_message "rover.audience.v1.ListDevicesByProfileIdentifierRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :identifier, :string, 2
  end
  add_message "rover.audience.v1.ListDevicesByProfileIdentifierResponse" do
    repeated :devices, :message, 1, "rover.audience.v1.Device"
  end
  add_message "rover.audience.v1.GetDeviceSchemaRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
  end
  add_message "rover.audience.v1.GetDeviceSchemaResponse" do
    optional :schema, :message, 1, "rover.audience.v1.DeviceSchema"
  end
  add_message "rover.audience.v1.DeviceSchema" do
    repeated :attributes, :message, 1, "rover.audience.v1.SchemaAttribute"
  end
  add_message "rover.audience.v1.UpdateDeviceRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    optional :push_environment, :string, 10
    optional :push_token_key, :string, 11
    optional :app_name, :string, 12
    optional :app_version, :string, 13
    optional :app_build, :string, 14
    optional :app_namespace, :string, 15
    optional :device_manufacturer, :string, 16
    optional :os_name, :string, 17
    optional :os_version, :message, 18, "rover.audience.v1.Version"
    optional :device_model, :string, 19
    map :frameworks, :string, :message, 20, "rover.audience.v1.Version"
    optional :locale_language, :string, 21
    optional :locale_region, :string, 22
    optional :locale_script, :string, 23
    optional :is_wifi_enabled, :bool, 24
    optional :is_cellular_enabled, :bool, 25
    optional :screen_width, :int32, 26
    optional :screen_height, :int32, 27
    optional :carrier_name, :string, 28
    optional :radio, :string, 29
    optional :time_zone, :string, 30
    optional :platform, :enum, 31, "rover.audience.v1.Platform"
    optional :is_background_enabled, :bool, 32
    optional :is_location_monitoring_enabled, :bool, 33
    optional :is_bluetooth_enabled, :bool, 34
    optional :advertising_id, :string, 35
    optional :ip, :string, 36
    optional :region_monitoring_mode, :enum, 37, "rover.audience.v1.Device.RegionMonitoringMode"
  end
  add_message "rover.audience.v1.UpdateDeviceResponse" do
  end
  add_message "rover.audience.v1.Device" do
    optional :id, :string, 1
    optional :device_id, :string, 2
    optional :account_id, :int32, 3
    optional :profile_id, :string, 4
    optional :created_at, :message, 5, "google.protobuf.Timestamp"
    optional :updated_at, :message, 6, "google.protobuf.Timestamp"
    optional :is_test_device, :bool, 7
    optional :push_environment, :string, 10
    optional :push_token_key, :string, 11
    optional :push_token_is_active, :bool, 12
    optional :push_token_created_at, :message, 13, "google.protobuf.Timestamp"
    optional :push_token_updated_at, :message, 14, "google.protobuf.Timestamp"
    optional :push_token_unregistered_at, :message, 15, "google.protobuf.Timestamp"
    optional :app_name, :string, 16
    optional :app_version, :string, 17
    optional :app_build, :string, 18
    optional :app_namespace, :string, 19
    optional :device_manufacturer, :string, 20
    optional :device_model, :string, 23
    optional :os_name, :string, 21
    optional :os_version, :message, 22, "rover.audience.v1.Version"
    map :frameworks, :string, :message, 24, "rover.audience.v1.Version"
    optional :locale_language, :string, 25
    optional :locale_region, :string, 26
    optional :locale_script, :string, 27
    optional :is_wifi_enabled, :bool, 28
    optional :is_cellular_enabled, :bool, 29
    optional :screen_width, :int32, 30
    optional :screen_height, :int32, 31
    optional :carrier_name, :string, 32
    optional :radio, :string, 33
    optional :time_zone, :string, 34
    optional :platform, :enum, 35, "rover.audience.v1.Platform"
    optional :is_background_enabled, :bool, 36
    optional :is_location_monitoring_enabled, :bool, 37
    optional :is_bluetooth_enabled, :bool, 38
    optional :advertising_id, :string, 39
    optional :ip, :string, 40
    optional :location_accuracy, :int32, 41
    optional :location_latitude, :double, 42
    optional :location_longitude, :double, 43
    optional :location_region, :string, 44
    optional :location_city, :string, 45
    optional :location_street, :string, 46
    optional :region_monitoring_mode, :enum, 47, "rover.audience.v1.Device.RegionMonitoringMode"
    optional :ibeacon_monitoring_regions_updated_at, :message, 48, "google.protobuf.Timestamp"
    repeated :ibeacon_monitoring_regions, :message, 49, "rover.audience.v1.IBeaconRegion"
    optional :geofence_monitoring_regions_updated_at, :message, 50, "google.protobuf.Timestamp"
    repeated :geofence_monitoring_regions, :message, 51, "rover.audience.v1.GeofenceRegion"
  end
  add_enum "rover.audience.v1.Device.RegionMonitoringMode" do
    value :UNDEFINED, 0
    value :ROVER, 1
    value :GIMBAL, 2
  end
  add_message "rover.audience.v1.IBeaconRegion" do
    optional :uuid, :string, 1
    optional :major, :int32, 2
    optional :minor, :int32, 3
  end
  add_message "rover.audience.v1.GeofenceRegion" do
    optional :id, :string, 1
    optional :latitude, :double, 2
    optional :longitude, :double, 3
    optional :radius, :int32, 4
  end
  add_message "rover.audience.v1.ValueUpdates" do
    repeated :values, :message, 1, "rover.audience.v1.ValueUpdate"
  end
  add_message "rover.audience.v1.ValueUpdate" do
    optional :update_type, :enum, 1, "rover.audience.v1.ValueUpdate.UpdateType"
    optional :value, :message, 2, "rover.audience.v1.Value"
  end
  add_enum "rover.audience.v1.ValueUpdate.UpdateType" do
    value :SET, 0
    value :ADD, 3
    value :REMOVE, 4
  end
  add_message "rover.audience.v1.Value" do
    oneof :value_type do
      optional :boolean_value, :bool, 1
      optional :integer_value, :int64, 2
      optional :double_value, :double, 3
      optional :string_value, :string, 4
      optional :string_array_value, :message, 5, "rover.audience.v1.Value.StringArray"
      optional :null_value, :enum, 7, "rover.audience.v1.Null"
      optional :timestamp_value, :message, 8, "google.protobuf.Timestamp"
    end
  end
  add_message "rover.audience.v1.Value.StringArray" do
    repeated :values, :string, 1
  end
  add_message "rover.audience.v1.SchemaAttribute" do
    optional :account_id, :int32, 1
    optional :id, :string, 2
    optional :attribute, :string, 3
    optional :label, :string, 4
    optional :attribute_type, :string, 5
    optional :path, :string, 6
    optional :created_at, :message, 7, "google.protobuf.Timestamp"
  end
  add_message "rover.audience.v1.Version" do
    optional :major, :int32, 1
    optional :minor, :int32, 2
    optional :revision, :int32, 3
  end
  add_message "rover.audience.v1.GetProfilesTotalCountRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
  end
  add_message "rover.audience.v1.GetProfilesTotalCountResponse" do
    optional :total, :int64, 1
  end
  add_message "rover.audience.v1.GetDevicesTotalCountRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
  end
  add_message "rover.audience.v1.GetDevicesTotalCountResponse" do
    optional :total, :int64, 1
  end
  add_message "rover.audience.v1.CreateDynamicSegmentRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :title, :string, 2
    optional :predicate_aggregate, :message, 3, "rover.audience.v1.PredicateAggregate"
  end
  add_message "rover.audience.v1.CreateDynamicSegmentResponse" do
    optional :segment, :message, 1, "rover.audience.v1.DynamicSegment"
  end
  add_message "rover.audience.v1.GetDynamicSegmentByIdRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :segment_id, :string, 2
  end
  add_message "rover.audience.v1.GetDynamicSegmentByIdResponse" do
    optional :segment, :message, 1, "rover.audience.v1.DynamicSegment"
  end
  add_message "rover.audience.v1.UpdateDynamicSegmentTitleRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :segment_id, :string, 2
    optional :title, :string, 3
  end
  add_message "rover.audience.v1.UpdateDynamicSegmentTitleResponse" do
  end
  add_message "rover.audience.v1.UpdateDynamicSegmentPredicatesRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :segment_id, :string, 2
    optional :predicate_aggregate, :message, 3, "rover.audience.v1.PredicateAggregate"
  end
  add_message "rover.audience.v1.UpdateDynamicSegmentPredicatesResponse" do
  end
  add_message "rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :segment_id, :string, 2
    optional :archived, :bool, 3
  end
  add_message "rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse" do
  end
  add_message "rover.audience.v1.ListDynamicSegmentsRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
  end
  add_message "rover.audience.v1.ListDynamicSegmentsResponse" do
    repeated :segments, :message, 1, "rover.audience.v1.DynamicSegment"
  end
  add_message "rover.audience.v1.DynamicSegment" do
    optional :id, :string, 1
    optional :account_id, :int32, 2
    optional :created_at, :message, 3, "google.protobuf.Timestamp"
    optional :updated_at, :message, 4, "google.protobuf.Timestamp"
    optional :title, :string, 5
    optional :is_archived, :bool, 6
    optional :segment_size, :int64, 7
    optional :predicate_aggregate, :message, 8, "rover.audience.v1.PredicateAggregate"
  end
  add_message "rover.audience.v1.StringPredicate" do
    optional :op, :enum, 1, "rover.audience.v1.StringPredicate.Op"
    optional :attribute_name, :string, 2
    optional :value, :string, 3
  end
  add_enum "rover.audience.v1.StringPredicate.Op" do
    value :IS_UNSET, 0
    value :IS_SET, 1
    value :IS_EQUAL, 2
    value :IS_NOT_EQUAL, 3
    value :STARTS_WITH, 4
    value :ENDS_WITH, 5
    value :CONTAINS, 6
    value :DOES_NOT_CONTAIN, 7
  end
  add_message "rover.audience.v1.BoolPredicate" do
    optional :op, :enum, 1, "rover.audience.v1.BoolPredicate.Op"
    optional :attribute_name, :string, 2
    optional :value, :bool, 3
  end
  add_enum "rover.audience.v1.BoolPredicate.Op" do
    value :IS_UNSET, 0
    value :IS_SET, 1
    value :IS_EQUAL, 2
  end
  add_message "rover.audience.v1.NumberPredicate" do
    optional :op, :enum, 1, "rover.audience.v1.NumberPredicate.Op"
    optional :attribute_name, :string, 2
    optional :value, :int64, 3
    optional :value2, :int64, 4
  end
  add_enum "rover.audience.v1.NumberPredicate.Op" do
    value :IS_UNSET, 0
    value :IS_SET, 1
    value :IS_EQUAL, 2
    value :IS_NOT_EQUAL, 3
    value :IS_GREATER_THAN, 4
    value :IS_LESS_THAN, 5
    value :IS_BETWEEN, 6
  end
  add_message "rover.audience.v1.DatePredicate" do
    optional :op, :enum, 1, "rover.audience.v1.DatePredicate.Op"
    optional :attribute_name, :string, 2
    optional :value, :message, 3, "google.protobuf.Timestamp"
    optional :value2, :message, 4, "google.protobuf.Timestamp"
  end
  add_enum "rover.audience.v1.DatePredicate.Op" do
    value :IS_UNSET, 0
    value :IS_SET, 1
    value :IS_EQUAL, 2
    value :IS_NOT_EQUAL, 3
    value :IS_GREATER_THAN, 4
    value :IS_LESS_THAN, 5
    value :IS_BETWEEN, 6
    value :IS_AFTER, 7
    value :IS_BEFORE, 8
    value :IS_ON, 9
  end
  add_message "rover.audience.v1.GeofencePredicate" do
    optional :op, :enum, 1, "rover.audience.v1.GeofencePredicate.Op"
    optional :attribute_name, :string, 2
    optional :value, :message, 3, "rover.audience.v1.GeofencePredicate.Location"
  end
  add_message "rover.audience.v1.GeofencePredicate.Location" do
    optional :longitude, :double, 1
    optional :latitude, :double, 2
    optional :radius, :int32, 3
    optional :name, :string, 4
  end
  add_enum "rover.audience.v1.GeofencePredicate.Op" do
    value :IS_UNSET, 0
    value :IS_SET, 1
    value :IS_OUTSIDE, 2
    value :IS_WITHIN, 3
  end
  add_message "rover.audience.v1.VersionPredicate" do
    optional :op, :enum, 1, "rover.audience.v1.VersionPredicate.Op"
    optional :attribute_name, :string, 2
    optional :value, :message, 3, "rover.audience.v1.Version"
    optional :value2, :message, 4, "rover.audience.v1.Version"
  end
  add_enum "rover.audience.v1.VersionPredicate.Op" do
    value :IS_UNSET, 0
    value :IS_SET, 1
    value :IS_EQUAL, 2
    value :IS_NOT_EQUAL, 3
    value :IS_GREATER_THAN, 4
    value :IS_LESS_THAN, 5
    value :IS_BETWEEN, 6
    value :IS_GREATER_THAN_OR_EQUAL, 7
    value :IS_LESS_THAN_OR_EQUAL, 8
  end
  add_message "rover.audience.v1.PredicateAggregate" do
    optional :condition, :enum, 1, "rover.audience.v1.PredicateAggregate.Condition"
    repeated :predicates, :message, 2, "rover.audience.v1.Predicate"
  end
  add_enum "rover.audience.v1.PredicateAggregate.Condition" do
    value :ANY, 0
    value :ALL, 1
  end
  add_message "rover.audience.v1.Predicate" do
    optional :model, :enum, 1, "rover.audience.v1.Predicate.Model"
    oneof :value do
      optional :string_predicate, :message, 2, "rover.audience.v1.StringPredicate"
      optional :bool_predicate, :message, 3, "rover.audience.v1.BoolPredicate"
      optional :number_predicate, :message, 4, "rover.audience.v1.NumberPredicate"
      optional :date_predicate, :message, 5, "rover.audience.v1.DatePredicate"
      optional :version_predicate, :message, 6, "rover.audience.v1.VersionPredicate"
      optional :geofence_predicate, :message, 7, "rover.audience.v1.GeofencePredicate"
    end
  end
  add_enum "rover.audience.v1.Predicate.Model" do
    value :PROFILE, 0
    value :DEVICE, 1
  end
  add_message "rover.audience.v1.QueryRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :predicate_aggregate, :message, 2, "rover.audience.v1.PredicateAggregate"
    oneof :iterator do
      optional :page_iterator, :message, 3, "rover.audience.v1.QueryRequest.PageIterator"
      optional :cursor_iterator, :message, 4, "rover.audience.v1.QueryRequest.CursorIterator"
    end
  end
  add_message "rover.audience.v1.QueryRequest.PageIterator" do
    optional :page, :int32, 1
    optional :size, :int32, 2
  end
  add_message "rover.audience.v1.QueryRequest.CursorIterator" do
    optional :id, :string, 1
  end
  add_message "rover.audience.v1.QueryResponse" do
    optional :total_size, :int64, 1
    repeated :profiles, :message, 2, "rover.audience.v1.Profile"
    repeated :devices, :message, 3, "rover.audience.v1.Device"
    optional :cursor_id, :string, 9
  end
  add_enum "rover.audience.v1.Platform" do
    value :UNDEFINED, 0
    value :MOBILE, 1
    value :WEB, 2
  end
  add_enum "rover.audience.v1.Null" do
    value :NULL, 0
  end
end

module Rover
  module Audience
    module V1
      GetProfileRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfileRequest").msgclass
      GetProfileResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfileResponse").msgclass
      CreateProfileRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.CreateProfileRequest").msgclass
      CreateProfileResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.CreateProfileResponse").msgclass
      DeleteProfileRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.DeleteProfileRequest").msgclass
      DeleteProfileResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.DeleteProfileResponse").msgclass
      UpdateProfileRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateProfileRequest").msgclass
      UpdateProfileResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateProfileResponse").msgclass
      UpdateProfileIdentifierRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateProfileIdentifierRequest").msgclass
      UpdateProfileIdentifierResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateProfileIdentifierResponse").msgclass
      GetProfileByDeviceIdRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfileByDeviceIdRequest").msgclass
      GetProfileByDeviceIdResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfileByDeviceIdResponse").msgclass
      GetProfileByIdentifierRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfileByIdentifierRequest").msgclass
      GetProfileByIdentifierResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfileByIdentifierResponse").msgclass
      ListProfilesByIdsRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ListProfilesByIdsRequest").msgclass
      ListProfilesByIdsResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ListProfilesByIdsResponse").msgclass
      ListProfilesByIdentifiersRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ListProfilesByIdentifiersRequest").msgclass
      ListProfilesByIdentifiersResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ListProfilesByIdentifiersResponse").msgclass
      GetProfileSchemaRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfileSchemaRequest").msgclass
      GetProfileSchemaResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfileSchemaResponse").msgclass
      ProfileSchema = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ProfileSchema").msgclass
      Profile = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Profile").msgclass
      GetDeviceRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetDeviceRequest").msgclass
      GetDeviceResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetDeviceResponse").msgclass
      GetDeviceByPushTokenRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetDeviceByPushTokenRequest").msgclass
      GetDeviceByPushTokenResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetDeviceByPushTokenResponse").msgclass
      CreateDeviceRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.CreateDeviceRequest").msgclass
      CreateDeviceResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.CreateDeviceResponse").msgclass
      UpdateDevicePushTokenRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDevicePushTokenRequest").msgclass
      UpdateDevicePushTokenResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDevicePushTokenResponse").msgclass
      UpdateDeviceUnregisterPushTokenRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest").msgclass
      UpdateDeviceUnregisterPushTokenResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse").msgclass
      UpdateDeviceLocationRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceLocationRequest").msgclass
      UpdateDeviceLocationResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceLocationResponse").msgclass
      UpdateDeviceGeofenceMonitoringRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest").msgclass
      UpdateDeviceGeofenceMonitoringResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse").msgclass
      UpdateDeviceIBeaconMonitoringRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest").msgclass
      UpdateDeviceIBeaconMonitoringResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse").msgclass
      UpdateDeviceTestPropertyRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceTestPropertyRequest").msgclass
      UpdateDeviceTestPropertyResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceTestPropertyResponse").msgclass
      DeleteDeviceRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.DeleteDeviceRequest").msgclass
      DeleteDeviceResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.DeleteDeviceResponse").msgclass
      SetDeviceProfileRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.SetDeviceProfileRequest").msgclass
      SetDeviceProfileResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.SetDeviceProfileResponse").msgclass
      ListDevicesByProfileIdRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ListDevicesByProfileIdRequest").msgclass
      ListDevicesByProfileIdResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ListDevicesByProfileIdResponse").msgclass
      ListDevicesByProfileIdentifierRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ListDevicesByProfileIdentifierRequest").msgclass
      ListDevicesByProfileIdentifierResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ListDevicesByProfileIdentifierResponse").msgclass
      GetDeviceSchemaRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetDeviceSchemaRequest").msgclass
      GetDeviceSchemaResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetDeviceSchemaResponse").msgclass
      DeviceSchema = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.DeviceSchema").msgclass
      UpdateDeviceRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceRequest").msgclass
      UpdateDeviceResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceResponse").msgclass
      Device = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Device").msgclass
      Device::RegionMonitoringMode = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Device.RegionMonitoringMode").enummodule
      IBeaconRegion = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.IBeaconRegion").msgclass
      GeofenceRegion = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GeofenceRegion").msgclass
      ValueUpdates = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ValueUpdates").msgclass
      ValueUpdate = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ValueUpdate").msgclass
      ValueUpdate::UpdateType = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ValueUpdate.UpdateType").enummodule
      Value = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Value").msgclass
      Value::StringArray = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Value.StringArray").msgclass
      SchemaAttribute = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.SchemaAttribute").msgclass
      Version = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Version").msgclass
      GetProfilesTotalCountRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfilesTotalCountRequest").msgclass
      GetProfilesTotalCountResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfilesTotalCountResponse").msgclass
      GetDevicesTotalCountRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetDevicesTotalCountRequest").msgclass
      GetDevicesTotalCountResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetDevicesTotalCountResponse").msgclass
      CreateDynamicSegmentRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.CreateDynamicSegmentRequest").msgclass
      CreateDynamicSegmentResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.CreateDynamicSegmentResponse").msgclass
      GetDynamicSegmentByIdRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetDynamicSegmentByIdRequest").msgclass
      GetDynamicSegmentByIdResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetDynamicSegmentByIdResponse").msgclass
      UpdateDynamicSegmentTitleRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDynamicSegmentTitleRequest").msgclass
      UpdateDynamicSegmentTitleResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDynamicSegmentTitleResponse").msgclass
      UpdateDynamicSegmentPredicatesRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDynamicSegmentPredicatesRequest").msgclass
      UpdateDynamicSegmentPredicatesResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDynamicSegmentPredicatesResponse").msgclass
      UpdateDynamicSegmentArchiveStatusRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest").msgclass
      UpdateDynamicSegmentArchiveStatusResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse").msgclass
      ListDynamicSegmentsRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ListDynamicSegmentsRequest").msgclass
      ListDynamicSegmentsResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ListDynamicSegmentsResponse").msgclass
      DynamicSegment = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.DynamicSegment").msgclass
      StringPredicate = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.StringPredicate").msgclass
      StringPredicate::Op = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.StringPredicate.Op").enummodule
      BoolPredicate = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.BoolPredicate").msgclass
      BoolPredicate::Op = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.BoolPredicate.Op").enummodule
      NumberPredicate = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.NumberPredicate").msgclass
      NumberPredicate::Op = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.NumberPredicate.Op").enummodule
      DatePredicate = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.DatePredicate").msgclass
      DatePredicate::Op = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.DatePredicate.Op").enummodule
      GeofencePredicate = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GeofencePredicate").msgclass
      GeofencePredicate::Location = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GeofencePredicate.Location").msgclass
      GeofencePredicate::Op = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GeofencePredicate.Op").enummodule
      VersionPredicate = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.VersionPredicate").msgclass
      VersionPredicate::Op = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.VersionPredicate.Op").enummodule
      PredicateAggregate = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.PredicateAggregate").msgclass
      PredicateAggregate::Condition = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.PredicateAggregate.Condition").enummodule
      Predicate = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Predicate").msgclass
      Predicate::Model = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Predicate.Model").enummodule
      QueryRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.QueryRequest").msgclass
      QueryRequest::PageIterator = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.QueryRequest.PageIterator").msgclass
      QueryRequest::CursorIterator = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.QueryRequest.CursorIterator").msgclass
      QueryResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.QueryResponse").msgclass
      Platform = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Platform").enummodule
      Null = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Null").enummodule
    end
  end
end
