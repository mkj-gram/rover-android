# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: audience/v1/audience.proto

require 'google/protobuf'

require 'google/protobuf/timestamp_pb'
require 'google/protobuf/empty_pb'
require 'auth/v1/auth_pb'
Google::Protobuf::DescriptorPool.generated_pool.build do
  add_message "rover.audience.v1.CreateProfileRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
  end
  add_message "rover.audience.v1.DeleteProfileRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :profile_id, :string, 2
  end
  add_message "rover.audience.v1.UpdateProfileRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :profile_id, :string, 2
    map :attributes, :string, :message, 5, "rover.audience.v1.ValueUpdates"
  end
  add_message "rover.audience.v1.UpdateProfileIdentifierRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :profile_id, :string, 2
    optional :identifier, :string, 3
  end
  add_message "rover.audience.v1.GetProfileByDeviceIdRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
  end
  add_message "rover.audience.v1.GetProfileByIdentifierRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :identifier, :string, 2
  end
  add_message "rover.audience.v1.GetProfileSchemaRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
  end
  add_message "rover.audience.v1.Profile" do
    optional :id, :string, 1
    optional :account_id, :int32, 2
    optional :identifier, :string, 3
    map :attributes, :string, :message, 4, "rover.audience.v1.Value"
    optional :created_at, :message, 5, "google.protobuf.Timestamp"
    optional :updated_at, :message, 6, "google.protobuf.Timestamp"
  end
  add_message "rover.audience.v1.ProfileSchema" do
    repeated :attributes, :message, 10, "rover.audience.v1.SchemaAttribute"
  end
  add_message "rover.audience.v1.GetDeviceRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
  end
  add_message "rover.audience.v1.GetDeviceByPushTokenRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_token_key, :string, 2
  end
  add_message "rover.audience.v1.CreateDeviceRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :profile_id, :string, 2
    optional :device_id, :string, 3
  end
  add_message "rover.audience.v1.UpdateDevicePushTokenRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    optional :device_token_key, :string, 3
    optional :aps_environment, :string, 4
  end
  add_message "rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
  end
  add_message "rover.audience.v1.UpdateDeviceLocationRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    optional :location_accuracy, :int32, 3
    optional :location_latitude, :double, 4
    optional :location_longitude, :double, 5
  end
  add_message "rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    repeated :regions, :message, 3, "rover.audience.v1.GeofenceRegion"
  end
  add_message "rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    repeated :regions, :message, 3, "rover.audience.v1.IBeaconRegion"
  end
  add_message "rover.audience.v1.DeleteDeviceRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
  end
  add_message "rover.audience.v1.SetDeviceProfileRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    optional :profile_id, :string, 3
  end
  add_message "rover.audience.v1.ListDevicesByProfileIdRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :profile_id, :string, 2
  end
  add_message "rover.audience.v1.ListDevicesByProfileIdResponse" do
    repeated :devices, :message, 1, "rover.audience.v1.Device"
  end
  add_message "rover.audience.v1.UpdateDeviceRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :device_id, :string, 2
    optional :aps_environment, :string, 10
    optional :device_token_key, :string, 11
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
  add_message "rover.audience.v1.Device" do
    optional :id, :string, 1
    optional :device_id, :string, 2
    optional :account_id, :int32, 3
    optional :profile_id, :string, 4
    optional :created_at, :message, 5, "google.protobuf.Timestamp"
    optional :updated_at, :message, 6, "google.protobuf.Timestamp"
    optional :aps_environment, :string, 10
    optional :device_token_key, :string, 11
    optional :device_token_is_active, :bool, 12
    optional :device_token_created_at, :message, 13, "google.protobuf.Timestamp"
    optional :device_token_updated_at, :message, 14, "google.protobuf.Timestamp"
    optional :device_token_unregistered_at, :message, 15, "google.protobuf.Timestamp"
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
    optional :attribute_type, :string, 4
    optional :path, :string, 5
    optional :created_at, :message, 10, "google.protobuf.Timestamp"
  end
  add_message "rover.audience.v1.Version" do
    optional :major, :int32, 1
    optional :minor, :int32, 2
    optional :revision, :int32, 3
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
      CreateProfileRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.CreateProfileRequest").msgclass
      DeleteProfileRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.DeleteProfileRequest").msgclass
      UpdateProfileRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateProfileRequest").msgclass
      UpdateProfileIdentifierRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateProfileIdentifierRequest").msgclass
      GetProfileByDeviceIdRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfileByDeviceIdRequest").msgclass
      GetProfileByIdentifierRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfileByIdentifierRequest").msgclass
      GetProfileSchemaRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetProfileSchemaRequest").msgclass
      Profile = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Profile").msgclass
      ProfileSchema = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ProfileSchema").msgclass
      GetDeviceRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetDeviceRequest").msgclass
      GetDeviceByPushTokenRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.GetDeviceByPushTokenRequest").msgclass
      CreateDeviceRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.CreateDeviceRequest").msgclass
      UpdateDevicePushTokenRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDevicePushTokenRequest").msgclass
      UpdateDeviceUnregisterPushTokenRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest").msgclass
      UpdateDeviceLocationRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceLocationRequest").msgclass
      UpdateDeviceGeofenceMonitoringRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest").msgclass
      UpdateDeviceIBeaconMonitoringRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest").msgclass
      DeleteDeviceRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.DeleteDeviceRequest").msgclass
      SetDeviceProfileRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.SetDeviceProfileRequest").msgclass
      ListDevicesByProfileIdRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ListDevicesByProfileIdRequest").msgclass
      ListDevicesByProfileIdResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.ListDevicesByProfileIdResponse").msgclass
      UpdateDeviceRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.UpdateDeviceRequest").msgclass
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
      Platform = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Platform").enummodule
      Null = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.audience.v1.Null").enummodule
    end
  end
end
