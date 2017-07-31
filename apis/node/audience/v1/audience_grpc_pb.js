// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var audience_v1_audience_pb = require('../../audience/v1/audience_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var auth_v1_auth_pb = require('../../auth/v1/auth_pb.js');

function serialize_rover_audience_v1_ArchiveDynamicSegmentByIdRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ArchiveDynamicSegmentByIdRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.ArchiveDynamicSegmentByIdRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ArchiveDynamicSegmentByIdRequest(buffer_arg) {
  return audience_v1_audience_pb.ArchiveDynamicSegmentByIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_ArchiveDynamicSegmentByIdResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ArchiveDynamicSegmentByIdResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.ArchiveDynamicSegmentByIdResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ArchiveDynamicSegmentByIdResponse(buffer_arg) {
  return audience_v1_audience_pb.ArchiveDynamicSegmentByIdResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_CreateDeviceRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.CreateDeviceRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.CreateDeviceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_CreateDeviceRequest(buffer_arg) {
  return audience_v1_audience_pb.CreateDeviceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_CreateDeviceResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.CreateDeviceResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.CreateDeviceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_CreateDeviceResponse(buffer_arg) {
  return audience_v1_audience_pb.CreateDeviceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_CreateDynamicSegmentRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.CreateDynamicSegmentRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.CreateDynamicSegmentRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_CreateDynamicSegmentRequest(buffer_arg) {
  return audience_v1_audience_pb.CreateDynamicSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_CreateDynamicSegmentResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.CreateDynamicSegmentResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.CreateDynamicSegmentResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_CreateDynamicSegmentResponse(buffer_arg) {
  return audience_v1_audience_pb.CreateDynamicSegmentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_CreateProfileRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.CreateProfileRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.CreateProfileRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_CreateProfileRequest(buffer_arg) {
  return audience_v1_audience_pb.CreateProfileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_CreateProfileResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.CreateProfileResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.CreateProfileResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_CreateProfileResponse(buffer_arg) {
  return audience_v1_audience_pb.CreateProfileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_DeleteDeviceRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.DeleteDeviceRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.DeleteDeviceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_DeleteDeviceRequest(buffer_arg) {
  return audience_v1_audience_pb.DeleteDeviceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_DeleteDeviceResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.DeleteDeviceResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.DeleteDeviceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_DeleteDeviceResponse(buffer_arg) {
  return audience_v1_audience_pb.DeleteDeviceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_DeleteProfileRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.DeleteProfileRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.DeleteProfileRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_DeleteProfileRequest(buffer_arg) {
  return audience_v1_audience_pb.DeleteProfileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_DeleteProfileResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.DeleteProfileResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.DeleteProfileResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_DeleteProfileResponse(buffer_arg) {
  return audience_v1_audience_pb.DeleteProfileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetDeviceByPushTokenRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetDeviceByPushTokenRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetDeviceByPushTokenRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetDeviceByPushTokenRequest(buffer_arg) {
  return audience_v1_audience_pb.GetDeviceByPushTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetDeviceByPushTokenResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetDeviceByPushTokenResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.GetDeviceByPushTokenResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetDeviceByPushTokenResponse(buffer_arg) {
  return audience_v1_audience_pb.GetDeviceByPushTokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetDeviceRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetDeviceRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetDeviceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetDeviceRequest(buffer_arg) {
  return audience_v1_audience_pb.GetDeviceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetDeviceResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetDeviceResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.GetDeviceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetDeviceResponse(buffer_arg) {
  return audience_v1_audience_pb.GetDeviceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetDynamicSegmentByIdRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetDynamicSegmentByIdRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetDynamicSegmentByIdRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetDynamicSegmentByIdRequest(buffer_arg) {
  return audience_v1_audience_pb.GetDynamicSegmentByIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetDynamicSegmentByIdResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetDynamicSegmentByIdResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.GetDynamicSegmentByIdResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetDynamicSegmentByIdResponse(buffer_arg) {
  return audience_v1_audience_pb.GetDynamicSegmentByIdResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetProfileByDeviceIdRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetProfileByDeviceIdRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetProfileByDeviceIdRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetProfileByDeviceIdRequest(buffer_arg) {
  return audience_v1_audience_pb.GetProfileByDeviceIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetProfileByDeviceIdResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetProfileByDeviceIdResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.GetProfileByDeviceIdResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetProfileByDeviceIdResponse(buffer_arg) {
  return audience_v1_audience_pb.GetProfileByDeviceIdResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetProfileByIdentifierRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetProfileByIdentifierRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetProfileByIdentifierRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetProfileByIdentifierRequest(buffer_arg) {
  return audience_v1_audience_pb.GetProfileByIdentifierRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetProfileByIdentifierResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetProfileByIdentifierResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.GetProfileByIdentifierResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetProfileByIdentifierResponse(buffer_arg) {
  return audience_v1_audience_pb.GetProfileByIdentifierResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetProfileRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetProfileRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetProfileRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetProfileRequest(buffer_arg) {
  return audience_v1_audience_pb.GetProfileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetProfileResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetProfileResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.GetProfileResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetProfileResponse(buffer_arg) {
  return audience_v1_audience_pb.GetProfileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetProfileSchemaRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetProfileSchemaRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetProfileSchemaRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetProfileSchemaRequest(buffer_arg) {
  return audience_v1_audience_pb.GetProfileSchemaRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetProfileSchemaResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetProfileSchemaResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.GetProfileSchemaResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetProfileSchemaResponse(buffer_arg) {
  return audience_v1_audience_pb.GetProfileSchemaResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_ListDevicesByProfileIdRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ListDevicesByProfileIdRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.ListDevicesByProfileIdRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ListDevicesByProfileIdRequest(buffer_arg) {
  return audience_v1_audience_pb.ListDevicesByProfileIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_ListDevicesByProfileIdResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ListDevicesByProfileIdResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.ListDevicesByProfileIdResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ListDevicesByProfileIdResponse(buffer_arg) {
  return audience_v1_audience_pb.ListDevicesByProfileIdResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_ListDevicesByProfileIdentifierRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ListDevicesByProfileIdentifierRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.ListDevicesByProfileIdentifierRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ListDevicesByProfileIdentifierRequest(buffer_arg) {
  return audience_v1_audience_pb.ListDevicesByProfileIdentifierRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_ListDevicesByProfileIdentifierResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ListDevicesByProfileIdentifierResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.ListDevicesByProfileIdentifierResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ListDevicesByProfileIdentifierResponse(buffer_arg) {
  return audience_v1_audience_pb.ListDevicesByProfileIdentifierResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_ListDynamicSegmentsRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ListDynamicSegmentsRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.ListDynamicSegmentsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ListDynamicSegmentsRequest(buffer_arg) {
  return audience_v1_audience_pb.ListDynamicSegmentsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_ListDynamicSegmentsResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ListDynamicSegmentsResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.ListDynamicSegmentsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ListDynamicSegmentsResponse(buffer_arg) {
  return audience_v1_audience_pb.ListDynamicSegmentsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_ListProfilesByIdsRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ListProfilesByIdsRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.ListProfilesByIdsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ListProfilesByIdsRequest(buffer_arg) {
  return audience_v1_audience_pb.ListProfilesByIdsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_ListProfilesByIdsResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ListProfilesByIdsResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.ListProfilesByIdsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ListProfilesByIdsResponse(buffer_arg) {
  return audience_v1_audience_pb.ListProfilesByIdsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_SetDeviceProfileRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.SetDeviceProfileRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.SetDeviceProfileRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_SetDeviceProfileRequest(buffer_arg) {
  return audience_v1_audience_pb.SetDeviceProfileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_SetDeviceProfileResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.SetDeviceProfileResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.SetDeviceProfileResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_SetDeviceProfileResponse(buffer_arg) {
  return audience_v1_audience_pb.SetDeviceProfileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceGeofenceMonitoringRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceGeofenceMonitoringRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceGeofenceMonitoringRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceGeofenceMonitoringRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceGeofenceMonitoringResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceGeofenceMonitoringResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceGeofenceMonitoringResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceGeofenceMonitoringResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceGeofenceMonitoringResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceIBeaconMonitoringRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceIBeaconMonitoringRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceIBeaconMonitoringRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceIBeaconMonitoringRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceIBeaconMonitoringRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceIBeaconMonitoringResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceIBeaconMonitoringResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceIBeaconMonitoringResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceIBeaconMonitoringResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceIBeaconMonitoringResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceLocationRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceLocationRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceLocationRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceLocationRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceLocationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceLocationResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceLocationResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceLocationResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceLocationResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceLocationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDevicePushTokenRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDevicePushTokenRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDevicePushTokenRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDevicePushTokenRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDevicePushTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDevicePushTokenResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDevicePushTokenResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDevicePushTokenResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDevicePushTokenResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDevicePushTokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceUnregisterPushTokenRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceUnregisterPushTokenRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceUnregisterPushTokenRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceUnregisterPushTokenRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceUnregisterPushTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceUnregisterPushTokenResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceUnregisterPushTokenResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceUnregisterPushTokenResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceUnregisterPushTokenResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceUnregisterPushTokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDynamicSegmentPredicatesRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDynamicSegmentPredicatesRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDynamicSegmentPredicatesRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDynamicSegmentPredicatesRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDynamicSegmentPredicatesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDynamicSegmentPredicatesResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDynamicSegmentPredicatesResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDynamicSegmentPredicatesResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDynamicSegmentPredicatesResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDynamicSegmentPredicatesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDynamicSegmentTitleRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDynamicSegmentTitleRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDynamicSegmentTitleRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDynamicSegmentTitleRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDynamicSegmentTitleRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDynamicSegmentTitleResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDynamicSegmentTitleResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDynamicSegmentTitleResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDynamicSegmentTitleResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDynamicSegmentTitleResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateProfileIdentifierRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateProfileIdentifierRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateProfileIdentifierRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateProfileIdentifierRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateProfileIdentifierRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateProfileIdentifierResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateProfileIdentifierResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateProfileIdentifierResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateProfileIdentifierResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateProfileIdentifierResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateProfileRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateProfileRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateProfileRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateProfileRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateProfileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateProfileResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateProfileResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateProfileResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateProfileResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateProfileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// Audience service is responsible for managing profiles & devices as well as static & dynamic segments.
var AudienceService = exports.AudienceService = {
  //
  // Profiles
  //
  //
  // CreateProfile creates a new empty profile under a given account.
  getProfile: {
    path: '/rover.audience.v1.Audience/GetProfile',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetProfileRequest,
    responseType: audience_v1_audience_pb.GetProfileResponse,
    requestSerialize: serialize_rover_audience_v1_GetProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetProfileRequest,
    responseSerialize: serialize_rover_audience_v1_GetProfileResponse,
    responseDeserialize: deserialize_rover_audience_v1_GetProfileResponse,
  },
  createProfile: {
    path: '/rover.audience.v1.Audience/CreateProfile',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.CreateProfileRequest,
    responseType: audience_v1_audience_pb.CreateProfileResponse,
    requestSerialize: serialize_rover_audience_v1_CreateProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_CreateProfileRequest,
    responseSerialize: serialize_rover_audience_v1_CreateProfileResponse,
    responseDeserialize: deserialize_rover_audience_v1_CreateProfileResponse,
  },
  //  DeleteProfile deletes a profile from db and all segments
  deleteProfile: {
    path: '/rover.audience.v1.Audience/DeleteProfile',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.DeleteProfileRequest,
    responseType: audience_v1_audience_pb.DeleteProfileResponse,
    requestSerialize: serialize_rover_audience_v1_DeleteProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_DeleteProfileRequest,
    responseSerialize: serialize_rover_audience_v1_DeleteProfileResponse,
    responseDeserialize: deserialize_rover_audience_v1_DeleteProfileResponse,
  },
  // UpdateProfile updates profile with provided subset of attributes
  updateProfile: {
    path: '/rover.audience.v1.Audience/UpdateProfile',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateProfileRequest,
    responseType: audience_v1_audience_pb.UpdateProfileResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateProfileRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateProfileResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateProfileResponse,
  },
  updateProfileIdentifier: {
    path: '/rover.audience.v1.Audience/UpdateProfileIdentifier',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateProfileIdentifierRequest,
    responseType: audience_v1_audience_pb.UpdateProfileIdentifierResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateProfileIdentifierRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateProfileIdentifierRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateProfileIdentifierResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateProfileIdentifierResponse,
  },
  // GetProfileByDeviceId returns a profile which is associated to the device id
  getProfileByDeviceId: {
    path: '/rover.audience.v1.Audience/GetProfileByDeviceId',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetProfileByDeviceIdRequest,
    responseType: audience_v1_audience_pb.GetProfileByDeviceIdResponse,
    requestSerialize: serialize_rover_audience_v1_GetProfileByDeviceIdRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetProfileByDeviceIdRequest,
    responseSerialize: serialize_rover_audience_v1_GetProfileByDeviceIdResponse,
    responseDeserialize: deserialize_rover_audience_v1_GetProfileByDeviceIdResponse,
  },
  getProfileByIdentifier: {
    path: '/rover.audience.v1.Audience/GetProfileByIdentifier',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetProfileByIdentifierRequest,
    responseType: audience_v1_audience_pb.GetProfileByIdentifierResponse,
    requestSerialize: serialize_rover_audience_v1_GetProfileByIdentifierRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetProfileByIdentifierRequest,
    responseSerialize: serialize_rover_audience_v1_GetProfileByIdentifierResponse,
    responseDeserialize: deserialize_rover_audience_v1_GetProfileByIdentifierResponse,
  },
  listProfilesByIds: {
    path: '/rover.audience.v1.Audience/ListProfilesByIds',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.ListProfilesByIdsRequest,
    responseType: audience_v1_audience_pb.ListProfilesByIdsResponse,
    requestSerialize: serialize_rover_audience_v1_ListProfilesByIdsRequest,
    requestDeserialize: deserialize_rover_audience_v1_ListProfilesByIdsRequest,
    responseSerialize: serialize_rover_audience_v1_ListProfilesByIdsResponse,
    responseDeserialize: deserialize_rover_audience_v1_ListProfilesByIdsResponse,
  },
  // GetProfileSchema returns the currently tracked profiles schema by account id
  getProfileSchema: {
    path: '/rover.audience.v1.Audience/GetProfileSchema',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetProfileSchemaRequest,
    responseType: audience_v1_audience_pb.GetProfileSchemaResponse,
    requestSerialize: serialize_rover_audience_v1_GetProfileSchemaRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetProfileSchemaRequest,
    responseSerialize: serialize_rover_audience_v1_GetProfileSchemaResponse,
    responseDeserialize: deserialize_rover_audience_v1_GetProfileSchemaResponse,
  },
  //
  // Devices
  //
  //
  // GetDevice returns the device for a given device id
  getDevice: {
    path: '/rover.audience.v1.Audience/GetDevice',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetDeviceRequest,
    responseType: audience_v1_audience_pb.GetDeviceResponse,
    requestSerialize: serialize_rover_audience_v1_GetDeviceRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetDeviceRequest,
    responseSerialize: serialize_rover_audience_v1_GetDeviceResponse,
    responseDeserialize: deserialize_rover_audience_v1_GetDeviceResponse,
  },
  getDeviceByPushToken: {
    path: '/rover.audience.v1.Audience/GetDeviceByPushToken',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetDeviceByPushTokenRequest,
    responseType: audience_v1_audience_pb.GetDeviceByPushTokenResponse,
    requestSerialize: serialize_rover_audience_v1_GetDeviceByPushTokenRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetDeviceByPushTokenRequest,
    responseSerialize: serialize_rover_audience_v1_GetDeviceByPushTokenResponse,
    responseDeserialize: deserialize_rover_audience_v1_GetDeviceByPushTokenResponse,
  },
  createDevice: {
    path: '/rover.audience.v1.Audience/CreateDevice',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.CreateDeviceRequest,
    responseType: audience_v1_audience_pb.CreateDeviceResponse,
    requestSerialize: serialize_rover_audience_v1_CreateDeviceRequest,
    requestDeserialize: deserialize_rover_audience_v1_CreateDeviceRequest,
    responseSerialize: serialize_rover_audience_v1_CreateDeviceResponse,
    responseDeserialize: deserialize_rover_audience_v1_CreateDeviceResponse,
  },
  // Device Updates
  updateDevice: {
    path: '/rover.audience.v1.Audience/UpdateDevice',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceRequest,
    responseType: audience_v1_audience_pb.UpdateDeviceResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDeviceResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDeviceResponse,
  },
  updateDevicePushToken: {
    path: '/rover.audience.v1.Audience/UpdateDevicePushToken',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDevicePushTokenRequest,
    responseType: audience_v1_audience_pb.UpdateDevicePushTokenResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDevicePushTokenRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDevicePushTokenRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDevicePushTokenResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDevicePushTokenResponse,
  },
  updateDeviceUnregisterPushToken: {
    path: '/rover.audience.v1.Audience/UpdateDeviceUnregisterPushToken',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceUnregisterPushTokenRequest,
    responseType: audience_v1_audience_pb.UpdateDeviceUnregisterPushTokenResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceUnregisterPushTokenRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceUnregisterPushTokenRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDeviceUnregisterPushTokenResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDeviceUnregisterPushTokenResponse,
  },
  updateDeviceLocation: {
    path: '/rover.audience.v1.Audience/UpdateDeviceLocation',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceLocationRequest,
    responseType: audience_v1_audience_pb.UpdateDeviceLocationResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceLocationRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceLocationRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDeviceLocationResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDeviceLocationResponse,
  },
  updateDeviceGeofenceMonitoring: {
    path: '/rover.audience.v1.Audience/UpdateDeviceGeofenceMonitoring',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceGeofenceMonitoringRequest,
    responseType: audience_v1_audience_pb.UpdateDeviceGeofenceMonitoringResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceGeofenceMonitoringRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceGeofenceMonitoringRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDeviceGeofenceMonitoringResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDeviceGeofenceMonitoringResponse,
  },
  updateDeviceIBeaconMonitoring: {
    path: '/rover.audience.v1.Audience/UpdateDeviceIBeaconMonitoring',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceIBeaconMonitoringRequest,
    responseType: audience_v1_audience_pb.UpdateDeviceIBeaconMonitoringResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceIBeaconMonitoringRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceIBeaconMonitoringRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDeviceIBeaconMonitoringResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDeviceIBeaconMonitoringResponse,
  },
  // Lists
  listDevicesByProfileId: {
    path: '/rover.audience.v1.Audience/ListDevicesByProfileId',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.ListDevicesByProfileIdRequest,
    responseType: audience_v1_audience_pb.ListDevicesByProfileIdResponse,
    requestSerialize: serialize_rover_audience_v1_ListDevicesByProfileIdRequest,
    requestDeserialize: deserialize_rover_audience_v1_ListDevicesByProfileIdRequest,
    responseSerialize: serialize_rover_audience_v1_ListDevicesByProfileIdResponse,
    responseDeserialize: deserialize_rover_audience_v1_ListDevicesByProfileIdResponse,
  },
  listDevicesByProfileIdentifier: {
    path: '/rover.audience.v1.Audience/ListDevicesByProfileIdentifier',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.ListDevicesByProfileIdentifierRequest,
    responseType: audience_v1_audience_pb.ListDevicesByProfileIdentifierResponse,
    requestSerialize: serialize_rover_audience_v1_ListDevicesByProfileIdentifierRequest,
    requestDeserialize: deserialize_rover_audience_v1_ListDevicesByProfileIdentifierRequest,
    responseSerialize: serialize_rover_audience_v1_ListDevicesByProfileIdentifierResponse,
    responseDeserialize: deserialize_rover_audience_v1_ListDevicesByProfileIdentifierResponse,
  },
  // SetDeviceProfile sets the profile the device belongs to
  setDeviceProfile: {
    path: '/rover.audience.v1.Audience/SetDeviceProfile',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.SetDeviceProfileRequest,
    responseType: audience_v1_audience_pb.SetDeviceProfileResponse,
    requestSerialize: serialize_rover_audience_v1_SetDeviceProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_SetDeviceProfileRequest,
    responseSerialize: serialize_rover_audience_v1_SetDeviceProfileResponse,
    responseDeserialize: deserialize_rover_audience_v1_SetDeviceProfileResponse,
  },
  // DeleteDevice deletes device from the database and removes it from any segments
  deleteDevice: {
    path: '/rover.audience.v1.Audience/DeleteDevice',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.DeleteDeviceRequest,
    responseType: audience_v1_audience_pb.DeleteDeviceResponse,
    requestSerialize: serialize_rover_audience_v1_DeleteDeviceRequest,
    requestDeserialize: deserialize_rover_audience_v1_DeleteDeviceRequest,
    responseSerialize: serialize_rover_audience_v1_DeleteDeviceResponse,
    responseDeserialize: deserialize_rover_audience_v1_DeleteDeviceResponse,
  },
  //
  // DynamicSegments
  //
  //
  // CreateDynamicSegment creates a new static segment by account_id and a title
  createDynamicSegment: {
    path: '/rover.audience.v1.Audience/CreateDynamicSegment',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.CreateDynamicSegmentRequest,
    responseType: audience_v1_audience_pb.CreateDynamicSegmentResponse,
    requestSerialize: serialize_rover_audience_v1_CreateDynamicSegmentRequest,
    requestDeserialize: deserialize_rover_audience_v1_CreateDynamicSegmentRequest,
    responseSerialize: serialize_rover_audience_v1_CreateDynamicSegmentResponse,
    responseDeserialize: deserialize_rover_audience_v1_CreateDynamicSegmentResponse,
  },
  // GetDynamicSegmentById returns a single static segment by id
  getDynamicSegmentById: {
    path: '/rover.audience.v1.Audience/GetDynamicSegmentById',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetDynamicSegmentByIdRequest,
    responseType: audience_v1_audience_pb.GetDynamicSegmentByIdResponse,
    requestSerialize: serialize_rover_audience_v1_GetDynamicSegmentByIdRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetDynamicSegmentByIdRequest,
    responseSerialize: serialize_rover_audience_v1_GetDynamicSegmentByIdResponse,
    responseDeserialize: deserialize_rover_audience_v1_GetDynamicSegmentByIdResponse,
  },
  updateDynamicSegmentTitle: {
    path: '/rover.audience.v1.Audience/UpdateDynamicSegmentTitle',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDynamicSegmentTitleRequest,
    responseType: audience_v1_audience_pb.UpdateDynamicSegmentTitleResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDynamicSegmentTitleRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDynamicSegmentTitleRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDynamicSegmentTitleResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDynamicSegmentTitleResponse,
  },
  updateDynamicSegmentPredicates: {
    path: '/rover.audience.v1.Audience/UpdateDynamicSegmentPredicates',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDynamicSegmentPredicatesRequest,
    responseType: audience_v1_audience_pb.UpdateDynamicSegmentPredicatesResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDynamicSegmentPredicatesRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDynamicSegmentPredicatesRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDynamicSegmentPredicatesResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDynamicSegmentPredicatesResponse,
  },
  // ArchiveDynamicSegmentById archive a segment given an id
  archiveDynamicSegmentById: {
    path: '/rover.audience.v1.Audience/ArchiveDynamicSegmentById',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.ArchiveDynamicSegmentByIdRequest,
    responseType: audience_v1_audience_pb.ArchiveDynamicSegmentByIdResponse,
    requestSerialize: serialize_rover_audience_v1_ArchiveDynamicSegmentByIdRequest,
    requestDeserialize: deserialize_rover_audience_v1_ArchiveDynamicSegmentByIdRequest,
    responseSerialize: serialize_rover_audience_v1_ArchiveDynamicSegmentByIdResponse,
    responseDeserialize: deserialize_rover_audience_v1_ArchiveDynamicSegmentByIdResponse,
  },
  // ListDynamicSegments returns a list of static segments by account_id.
  listDynamicSegments: {
    path: '/rover.audience.v1.Audience/ListDynamicSegments',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.ListDynamicSegmentsRequest,
    responseType: audience_v1_audience_pb.ListDynamicSegmentsResponse,
    requestSerialize: serialize_rover_audience_v1_ListDynamicSegmentsRequest,
    requestDeserialize: deserialize_rover_audience_v1_ListDynamicSegmentsRequest,
    responseSerialize: serialize_rover_audience_v1_ListDynamicSegmentsResponse,
    responseDeserialize: deserialize_rover_audience_v1_ListDynamicSegmentsResponse,
  },
};

exports.AudienceClient = grpc.makeGenericClientConstructor(AudienceService);
