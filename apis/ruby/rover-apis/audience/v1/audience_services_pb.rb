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
          rpc :GetProfile, GetProfileRequest, GetProfileResponse
          rpc :CreateProfile, CreateProfileRequest, CreateProfileResponse
          #  DeleteProfile deletes a profile from db and all segments
          rpc :DeleteProfile, DeleteProfileRequest, DeleteProfileResponse
          # UpdateProfile updates profile with provided subset of attributes
          rpc :UpdateProfile, UpdateProfileRequest, UpdateProfileResponse
          rpc :UpdateProfileIdentifier, UpdateProfileIdentifierRequest, UpdateProfileIdentifierResponse
          # GetProfileByDeviceId returns a profile which is associated to the device id
          rpc :GetProfileByDeviceId, GetProfileByDeviceIdRequest, GetProfileByDeviceIdResponse
          rpc :GetProfileByIdentifier, GetProfileByIdentifierRequest, GetProfileByIdentifierResponse
          rpc :ListProfilesByIds, ListProfilesByIdsRequest, ListProfilesByIdsResponse
          rpc :ListProfilesByIdentifiers, ListProfilesByIdentifiersRequest, ListProfilesByIdentifiersResponse
          # GetProfileSchema returns the currently tracked profiles schema by account id
          rpc :GetProfileSchema, GetProfileSchemaRequest, GetProfileSchemaResponse
          #
          # Devices
          #
          #
          # GetDevice returns the device for a given device id
          rpc :GetDevice, GetDeviceRequest, GetDeviceResponse
          rpc :GetDeviceByPushToken, GetDeviceByPushTokenRequest, GetDeviceByPushTokenResponse
          rpc :CreateDevice, CreateDeviceRequest, CreateDeviceResponse
          # Device Updates
          rpc :UpdateDevice, UpdateDeviceRequest, UpdateDeviceResponse
          rpc :UpdateDevicePushToken, UpdateDevicePushTokenRequest, UpdateDevicePushTokenResponse
          rpc :UpdateDeviceUnregisterPushToken, UpdateDeviceUnregisterPushTokenRequest, UpdateDeviceUnregisterPushTokenResponse
          rpc :UpdateDeviceLocation, UpdateDeviceLocationRequest, UpdateDeviceLocationResponse
          rpc :UpdateDeviceGeofenceMonitoring, UpdateDeviceGeofenceMonitoringRequest, UpdateDeviceGeofenceMonitoringResponse
          rpc :UpdateDeviceIBeaconMonitoring, UpdateDeviceIBeaconMonitoringRequest, UpdateDeviceIBeaconMonitoringResponse
          # Test devices
          rpc :UpdateDeviceTestProperty, UpdateDeviceTestPropertyRequest, UpdateDeviceTestPropertyResponse
          # Lists
          rpc :ListDevicesByProfileId, ListDevicesByProfileIdRequest, ListDevicesByProfileIdResponse
          rpc :ListDevicesByProfileIdentifier, ListDevicesByProfileIdentifierRequest, ListDevicesByProfileIdentifierResponse
          # SetDeviceProfile sets the profile the device belongs to
          rpc :SetDeviceProfile, SetDeviceProfileRequest, SetDeviceProfileResponse
          # DeleteDevice deletes device from the database and removes it from any segments
          rpc :DeleteDevice, DeleteDeviceRequest, DeleteDeviceResponse
          # GetDeviceSchema returns description of device attributes
          rpc :GetDeviceSchema, GetDeviceSchemaRequest, GetDeviceSchemaResponse
          #
          # DynamicSegments
          #
          #
          # GetDynamicSegmentById returns a single static segment by id
          rpc :GetDynamicSegmentById, GetDynamicSegmentByIdRequest, GetDynamicSegmentByIdResponse
          # ListDynamicSegments returns a list of static segments by account_id.
          rpc :ListDynamicSegments, ListDynamicSegmentsRequest, ListDynamicSegmentsResponse
          # CreateDynamicSegment creates a new static segment by account_id and a title
          rpc :CreateDynamicSegment, CreateDynamicSegmentRequest, CreateDynamicSegmentResponse
          # Updates
          rpc :UpdateDynamicSegmentTitle, UpdateDynamicSegmentTitleRequest, UpdateDynamicSegmentTitleResponse
          rpc :UpdateDynamicSegmentArchiveStatus, UpdateDynamicSegmentArchiveStatusRequest, UpdateDynamicSegmentArchiveStatusResponse
          rpc :UpdateDynamicSegmentPredicates, UpdateDynamicSegmentPredicatesRequest, UpdateDynamicSegmentPredicatesResponse
          # Checks if a provided device and profile would satisfy the dynamic segment
          # Doesn't mean the device / profile needs to exist
          rpc :IsInDynamicSegment, IsInDynamicSegmentRequest, IsInDynamicSegmentResponse
          # Checks if a specific device is within a dynamic segment
          rpc :DeviceIsInDynamicSegment, DeviceIsInDynamicSegmentRequest, DeviceIsInDynamicSegmentResponse
          #
          # CounterCaches
          #
          rpc :GetProfilesTotalCount, GetProfilesTotalCountRequest, GetProfilesTotalCountResponse
          rpc :GetDevicesTotalCount, GetDevicesTotalCountRequest, GetDevicesTotalCountResponse
          rpc :Query, QueryRequest, QueryResponse
        end

        Stub = Service.rpc_stub_class
      end
    end
  end
end
