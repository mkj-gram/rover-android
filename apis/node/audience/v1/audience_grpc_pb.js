// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var audience_v1_audience_pb = require('../../audience/v1/audience_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var auth_v1_auth_pb = require('../../auth/v1/auth_pb.js');
var protobuf_wrappers_pb = require('../../protobuf/wrappers_pb.js');

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

function serialize_rover_audience_v1_DeviceIsInDynamicSegmentRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.DeviceIsInDynamicSegmentRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.DeviceIsInDynamicSegmentRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_DeviceIsInDynamicSegmentRequest(buffer_arg) {
  return audience_v1_audience_pb.DeviceIsInDynamicSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_DeviceIsInDynamicSegmentResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.DeviceIsInDynamicSegmentResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.DeviceIsInDynamicSegmentResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_DeviceIsInDynamicSegmentResponse(buffer_arg) {
  return audience_v1_audience_pb.DeviceIsInDynamicSegmentResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_GetDeviceSchemaRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetDeviceSchemaRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetDeviceSchemaRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetDeviceSchemaRequest(buffer_arg) {
  return audience_v1_audience_pb.GetDeviceSchemaRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetDeviceSchemaResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetDeviceSchemaResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.GetDeviceSchemaResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetDeviceSchemaResponse(buffer_arg) {
  return audience_v1_audience_pb.GetDeviceSchemaResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetDevicesTotalCountRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetDevicesTotalCountRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetDevicesTotalCountRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetDevicesTotalCountRequest(buffer_arg) {
  return audience_v1_audience_pb.GetDevicesTotalCountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetDevicesTotalCountResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetDevicesTotalCountResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.GetDevicesTotalCountResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetDevicesTotalCountResponse(buffer_arg) {
  return audience_v1_audience_pb.GetDevicesTotalCountResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_GetFieldSuggestionRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetFieldSuggestionRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetFieldSuggestionRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetFieldSuggestionRequest(buffer_arg) {
  return audience_v1_audience_pb.GetFieldSuggestionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetFieldSuggestionResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetFieldSuggestionResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.GetFieldSuggestionResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetFieldSuggestionResponse(buffer_arg) {
  return audience_v1_audience_pb.GetFieldSuggestionResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_GetProfilesTotalCountRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetProfilesTotalCountRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetProfilesTotalCountRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetProfilesTotalCountRequest(buffer_arg) {
  return audience_v1_audience_pb.GetProfilesTotalCountRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_GetProfilesTotalCountResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetProfilesTotalCountResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.GetProfilesTotalCountResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetProfilesTotalCountResponse(buffer_arg) {
  return audience_v1_audience_pb.GetProfilesTotalCountResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_IsInDynamicSegmentRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.IsInDynamicSegmentRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.IsInDynamicSegmentRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_IsInDynamicSegmentRequest(buffer_arg) {
  return audience_v1_audience_pb.IsInDynamicSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_IsInDynamicSegmentResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.IsInDynamicSegmentResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.IsInDynamicSegmentResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_IsInDynamicSegmentResponse(buffer_arg) {
  return audience_v1_audience_pb.IsInDynamicSegmentResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_ListProfilesByIdentifiersRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ListProfilesByIdentifiersRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.ListProfilesByIdentifiersRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ListProfilesByIdentifiersRequest(buffer_arg) {
  return audience_v1_audience_pb.ListProfilesByIdentifiersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_ListProfilesByIdentifiersResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ListProfilesByIdentifiersResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.ListProfilesByIdentifiersResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ListProfilesByIdentifiersResponse(buffer_arg) {
  return audience_v1_audience_pb.ListProfilesByIdentifiersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_QueryRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.QueryRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.QueryRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_QueryRequest(buffer_arg) {
  return audience_v1_audience_pb.QueryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_QueryResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.QueryResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.QueryResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_QueryResponse(buffer_arg) {
  return audience_v1_audience_pb.QueryResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_SetDeviceProfileIdentifierRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.SetDeviceProfileIdentifierRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.SetDeviceProfileIdentifierRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_SetDeviceProfileIdentifierRequest(buffer_arg) {
  return audience_v1_audience_pb.SetDeviceProfileIdentifierRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_SetDeviceProfileIdentifierResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.SetDeviceProfileIdentifierResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.SetDeviceProfileIdentifierResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_SetDeviceProfileIdentifierResponse(buffer_arg) {
  return audience_v1_audience_pb.SetDeviceProfileIdentifierResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_TagProfileRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.TagProfileRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.TagProfileRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_TagProfileRequest(buffer_arg) {
  return audience_v1_audience_pb.TagProfileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_TagProfileResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.TagProfileResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.TagProfileResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_TagProfileResponse(buffer_arg) {
  return audience_v1_audience_pb.TagProfileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceAppBadgeNumberRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceAppBadgeNumberRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceAppBadgeNumberRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceAppBadgeNumberRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceAppBadgeNumberRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceAppBadgeNumberResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceAppBadgeNumberResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceAppBadgeNumberResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceAppBadgeNumberResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceAppBadgeNumberResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceCustomAttributesRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceCustomAttributesRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceCustomAttributesRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceCustomAttributesRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceCustomAttributesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceCustomAttributesResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceCustomAttributesResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceCustomAttributesResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceCustomAttributesResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceCustomAttributesResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_UpdateDeviceLabelPropertyRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceLabelPropertyRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceLabelPropertyRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceLabelPropertyRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceLabelPropertyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceLabelPropertyResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceLabelPropertyResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceLabelPropertyResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceLabelPropertyResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceLabelPropertyResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_UpdateDeviceTestPropertyRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceTestPropertyRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceTestPropertyRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceTestPropertyRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceTestPropertyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDeviceTestPropertyResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceTestPropertyResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceTestPropertyResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceTestPropertyResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceTestPropertyResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_UpdateDynamicSegmentArchiveStatusRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDynamicSegmentArchiveStatusRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDynamicSegmentArchiveStatusRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDynamicSegmentArchiveStatusRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDynamicSegmentArchiveStatusRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_UpdateDynamicSegmentArchiveStatusResponse(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDynamicSegmentArchiveStatusResponse)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDynamicSegmentArchiveStatusResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDynamicSegmentArchiveStatusResponse(buffer_arg) {
  return audience_v1_audience_pb.UpdateDynamicSegmentArchiveStatusResponse.deserializeBinary(new Uint8Array(buffer_arg));
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
  // Append a list of tags to the profiles `tags` attribute
  tagProfile: {
    path: '/rover.audience.v1.Audience/TagProfile',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.TagProfileRequest,
    responseType: audience_v1_audience_pb.TagProfileResponse,
    requestSerialize: serialize_rover_audience_v1_TagProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_TagProfileRequest,
    responseSerialize: serialize_rover_audience_v1_TagProfileResponse,
    responseDeserialize: deserialize_rover_audience_v1_TagProfileResponse,
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
  // deprecated (use GetProfile)
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
  listProfilesByIdentifiers: {
    path: '/rover.audience.v1.Audience/ListProfilesByIdentifiers',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.ListProfilesByIdentifiersRequest,
    responseType: audience_v1_audience_pb.ListProfilesByIdentifiersResponse,
    requestSerialize: serialize_rover_audience_v1_ListProfilesByIdentifiersRequest,
    requestDeserialize: deserialize_rover_audience_v1_ListProfilesByIdentifiersRequest,
    responseSerialize: serialize_rover_audience_v1_ListProfilesByIdentifiersResponse,
    responseDeserialize: deserialize_rover_audience_v1_ListProfilesByIdentifiersResponse,
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
  updateDeviceCustomAttributes: {
    path: '/rover.audience.v1.Audience/UpdateDeviceCustomAttributes',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceCustomAttributesRequest,
    responseType: audience_v1_audience_pb.UpdateDeviceCustomAttributesResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceCustomAttributesRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceCustomAttributesRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDeviceCustomAttributesResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDeviceCustomAttributesResponse,
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
  // Test devices
  updateDeviceTestProperty: {
    path: '/rover.audience.v1.Audience/UpdateDeviceTestProperty',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceTestPropertyRequest,
    responseType: audience_v1_audience_pb.UpdateDeviceTestPropertyResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceTestPropertyRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceTestPropertyRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDeviceTestPropertyResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDeviceTestPropertyResponse,
  },
  updateDeviceLabelProperty: {
    path: '/rover.audience.v1.Audience/UpdateDeviceLabelProperty',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceLabelPropertyRequest,
    responseType: audience_v1_audience_pb.UpdateDeviceLabelPropertyResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceLabelPropertyRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceLabelPropertyRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDeviceLabelPropertyResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDeviceLabelPropertyResponse,
  },
  // Badge Number
  updateDeviceAppBadgeNumber: {
    path: '/rover.audience.v1.Audience/UpdateDeviceAppBadgeNumber',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceAppBadgeNumberRequest,
    responseType: audience_v1_audience_pb.UpdateDeviceAppBadgeNumberResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceAppBadgeNumberRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceAppBadgeNumberRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDeviceAppBadgeNumberResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDeviceAppBadgeNumberResponse,
  },
  // Lists
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
  // TODO:
  // rpc ListTestDevices(ListTestDevicesRequest) returns (ListTestDeviecesResponse);
  setDeviceProfileIdentifier: {
    path: '/rover.audience.v1.Audience/SetDeviceProfileIdentifier',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.SetDeviceProfileIdentifierRequest,
    responseType: audience_v1_audience_pb.SetDeviceProfileIdentifierResponse,
    requestSerialize: serialize_rover_audience_v1_SetDeviceProfileIdentifierRequest,
    requestDeserialize: deserialize_rover_audience_v1_SetDeviceProfileIdentifierRequest,
    responseSerialize: serialize_rover_audience_v1_SetDeviceProfileIdentifierResponse,
    responseDeserialize: deserialize_rover_audience_v1_SetDeviceProfileIdentifierResponse,
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
  // GetDeviceSchema returns description of device attributes
  getDeviceSchema: {
    path: '/rover.audience.v1.Audience/GetDeviceSchema',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetDeviceSchemaRequest,
    responseType: audience_v1_audience_pb.GetDeviceSchemaResponse,
    requestSerialize: serialize_rover_audience_v1_GetDeviceSchemaRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetDeviceSchemaRequest,
    responseSerialize: serialize_rover_audience_v1_GetDeviceSchemaResponse,
    responseDeserialize: deserialize_rover_audience_v1_GetDeviceSchemaResponse,
  },
  //
  // DynamicSegments
  //
  //
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
  // Updates
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
  updateDynamicSegmentArchiveStatus: {
    path: '/rover.audience.v1.Audience/UpdateDynamicSegmentArchiveStatus',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDynamicSegmentArchiveStatusRequest,
    responseType: audience_v1_audience_pb.UpdateDynamicSegmentArchiveStatusResponse,
    requestSerialize: serialize_rover_audience_v1_UpdateDynamicSegmentArchiveStatusRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDynamicSegmentArchiveStatusRequest,
    responseSerialize: serialize_rover_audience_v1_UpdateDynamicSegmentArchiveStatusResponse,
    responseDeserialize: deserialize_rover_audience_v1_UpdateDynamicSegmentArchiveStatusResponse,
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
  // Checks if a provided device and profile would satisfy the dynamic segment
  // Doesn't mean the device / profile needs to exist
  isInDynamicSegment: {
    path: '/rover.audience.v1.Audience/IsInDynamicSegment',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.IsInDynamicSegmentRequest,
    responseType: audience_v1_audience_pb.IsInDynamicSegmentResponse,
    requestSerialize: serialize_rover_audience_v1_IsInDynamicSegmentRequest,
    requestDeserialize: deserialize_rover_audience_v1_IsInDynamicSegmentRequest,
    responseSerialize: serialize_rover_audience_v1_IsInDynamicSegmentResponse,
    responseDeserialize: deserialize_rover_audience_v1_IsInDynamicSegmentResponse,
  },
  // Checks if a specific device is within a dynamic segment
  deviceIsInDynamicSegment: {
    path: '/rover.audience.v1.Audience/DeviceIsInDynamicSegment',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.DeviceIsInDynamicSegmentRequest,
    responseType: audience_v1_audience_pb.DeviceIsInDynamicSegmentResponse,
    requestSerialize: serialize_rover_audience_v1_DeviceIsInDynamicSegmentRequest,
    requestDeserialize: deserialize_rover_audience_v1_DeviceIsInDynamicSegmentRequest,
    responseSerialize: serialize_rover_audience_v1_DeviceIsInDynamicSegmentResponse,
    responseDeserialize: deserialize_rover_audience_v1_DeviceIsInDynamicSegmentResponse,
  },
  //
  // CounterCaches
  //
  getProfilesTotalCount: {
    path: '/rover.audience.v1.Audience/GetProfilesTotalCount',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetProfilesTotalCountRequest,
    responseType: audience_v1_audience_pb.GetProfilesTotalCountResponse,
    requestSerialize: serialize_rover_audience_v1_GetProfilesTotalCountRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetProfilesTotalCountRequest,
    responseSerialize: serialize_rover_audience_v1_GetProfilesTotalCountResponse,
    responseDeserialize: deserialize_rover_audience_v1_GetProfilesTotalCountResponse,
  },
  getDevicesTotalCount: {
    path: '/rover.audience.v1.Audience/GetDevicesTotalCount',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetDevicesTotalCountRequest,
    responseType: audience_v1_audience_pb.GetDevicesTotalCountResponse,
    requestSerialize: serialize_rover_audience_v1_GetDevicesTotalCountRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetDevicesTotalCountRequest,
    responseSerialize: serialize_rover_audience_v1_GetDevicesTotalCountResponse,
    responseDeserialize: deserialize_rover_audience_v1_GetDevicesTotalCountResponse,
  },
  query: {
    path: '/rover.audience.v1.Audience/Query',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.QueryRequest,
    responseType: audience_v1_audience_pb.QueryResponse,
    requestSerialize: serialize_rover_audience_v1_QueryRequest,
    requestDeserialize: deserialize_rover_audience_v1_QueryRequest,
    responseSerialize: serialize_rover_audience_v1_QueryResponse,
    responseDeserialize: deserialize_rover_audience_v1_QueryResponse,
  },
  //
  // Field Suggestions
  //
  getFieldSuggestion: {
    path: '/rover.audience.v1.Audience/GetFieldSuggestion',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetFieldSuggestionRequest,
    responseType: audience_v1_audience_pb.GetFieldSuggestionResponse,
    requestSerialize: serialize_rover_audience_v1_GetFieldSuggestionRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetFieldSuggestionRequest,
    responseSerialize: serialize_rover_audience_v1_GetFieldSuggestionResponse,
    responseDeserialize: deserialize_rover_audience_v1_GetFieldSuggestionResponse,
  },
};

exports.AudienceClient = grpc.makeGenericClientConstructor(AudienceService);
