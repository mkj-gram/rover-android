# Generated by the protocol buffer compiler.  DO NOT EDIT!
# Source: audience/v1/audience.proto for package 'rover.audience.v1'

require 'grpc'
require 'audience/v1/audience_pb'

module Rover
  module Audience
    module V1
      module Audience
        # Audience service is responsible for managing profiles & devices as well as static & dynamic segments.
        class Service

          include GRPC::GenericService

          self.marshal_class_method = :encode
          self.unmarshal_class_method = :decode
          self.service_name = 'rover.audience.v1.Audience'

          #
          # Profiles
          #
          #
          # CreateProfile creates a new empty profile under a given account.
          rpc :CreateProfile, CreateProfileRequest, Profile
          #  DeleteProfile deletes a profile from db and all segments
          rpc :DeleteProfile, DeleteProfileRequest, Google::Protobuf::Empty
          # UpdateProfile updates profile with provided subset of attributes
          rpc :UpdateProfile, UpdateProfileRequest, Google::Protobuf::Empty
          rpc :UpdateProfileIdentifier, UpdateProfileIdentifierRequest, Google::Protobuf::Empty
          # GetProfileByDeviceId returns a profile which is associated to the device id
          rpc :GetProfileByDeviceId, GetProfileByDeviceIdRequest, Profile
          rpc :GetProfileByIdentifier, GetProfileByIdentifierRequest, Profile
          # GetProfileSchema returns the currently tracked profiles schema by account id
          rpc :GetProfileSchema, GetProfileSchemaRequest, ProfileSchema
          #
          # Devices
          #
          #
          # GetDevice returns the device for a given device id
          rpc :GetDevice, GetDeviceRequest, Device
          rpc :CreateDevice, CreateDeviceRequest, Google::Protobuf::Empty
          # Device Updates
          rpc :UpdateDevice, UpdateDeviceRequest, Google::Protobuf::Empty
          rpc :UpdateDevicePushToken, UpdateDevicePushTokenRequest, Google::Protobuf::Empty
          rpc :UpdateDeviceUnregisterPushToken, UpdateDeviceUnregisterPushTokenRequest, Google::Protobuf::Empty
          rpc :UpdateDeviceLocation, UpdateDeviceLocationRequest, Google::Protobuf::Empty
          rpc :UpdateDeviceGeofenceMonitoring, UpdateDeviceGeofenceMonitoringRequest, Google::Protobuf::Empty
          rpc :UpdateDeviceIBeaconMonitoring, UpdateDeviceIBeaconMonitoringRequest, Google::Protobuf::Empty
          # Lists
          rpc :ListDevicesByProfileId, ListDevicesByProfileIdRequest, ListDevicesByProfileIdResponse
          # SetDeviceProfile sets the profile the device belongs to
          rpc :SetDeviceProfile, SetDeviceProfileRequest, Google::Protobuf::Empty
          # DeleteDevice deletes device from the database and removes it from any segments
          rpc :DeleteDevice, DeleteDeviceRequest, Google::Protobuf::Empty
        end

        Stub = Service.rpc_stub_class
      end
    end
  end
end
