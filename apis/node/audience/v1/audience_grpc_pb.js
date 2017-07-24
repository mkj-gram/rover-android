// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var audience_v1_audience_pb = require('../../audience/v1/audience_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
var auth_v1_auth_pb = require('../../auth/v1/auth_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_CreateProfileRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.CreateProfileRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.CreateProfileRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_CreateProfileRequest(buffer_arg) {
  return audience_v1_audience_pb.CreateProfileRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_DeleteProfileRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.DeleteProfileRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.DeleteProfileRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_DeleteProfileRequest(buffer_arg) {
  return audience_v1_audience_pb.DeleteProfileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_Device(arg) {
  if (!(arg instanceof audience_v1_audience_pb.Device)) {
    throw new Error('Expected argument of type rover.audience.v1.Device');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_Device(buffer_arg) {
  return audience_v1_audience_pb.Device.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_GetDeviceRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetDeviceRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetDeviceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetDeviceRequest(buffer_arg) {
  return audience_v1_audience_pb.GetDeviceRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_GetProfileByIdentifierRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetProfileByIdentifierRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetProfileByIdentifierRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetProfileByIdentifierRequest(buffer_arg) {
  return audience_v1_audience_pb.GetProfileByIdentifierRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_Profile(arg) {
  if (!(arg instanceof audience_v1_audience_pb.Profile)) {
    throw new Error('Expected argument of type rover.audience.v1.Profile');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_Profile(buffer_arg) {
  return audience_v1_audience_pb.Profile.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_audience_v1_ProfileSchema(arg) {
  if (!(arg instanceof audience_v1_audience_pb.ProfileSchema)) {
    throw new Error('Expected argument of type rover.audience.v1.ProfileSchema');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_ProfileSchema(buffer_arg) {
  return audience_v1_audience_pb.ProfileSchema.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_UpdateDeviceGeofenceMonitoringRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceGeofenceMonitoringRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceGeofenceMonitoringRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceGeofenceMonitoringRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceGeofenceMonitoringRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_UpdateDeviceLocationRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceLocationRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceLocationRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceLocationRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceLocationRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_UpdateDeviceRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateDeviceRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateDeviceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateDeviceRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateDeviceRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_UpdateProfileIdentifierRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.UpdateProfileIdentifierRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.UpdateProfileIdentifierRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_UpdateProfileIdentifierRequest(buffer_arg) {
  return audience_v1_audience_pb.UpdateProfileIdentifierRequest.deserializeBinary(new Uint8Array(buffer_arg));
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


// Audience service is responsible for managing profiles & devices as well as static & dynamic segments.
var AudienceService = exports.AudienceService = {
  //
  // Profiles
  //
  //
  // CreateProfile creates a new empty profile under a given account.
  createProfile: {
    path: '/rover.audience.v1.Audience/CreateProfile',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.CreateProfileRequest,
    responseType: audience_v1_audience_pb.Profile,
    requestSerialize: serialize_rover_audience_v1_CreateProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_CreateProfileRequest,
    responseSerialize: serialize_rover_audience_v1_Profile,
    responseDeserialize: deserialize_rover_audience_v1_Profile,
  },
  //  DeleteProfile deletes a profile from db and all segments
  deleteProfile: {
    path: '/rover.audience.v1.Audience/DeleteProfile',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.DeleteProfileRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_DeleteProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_DeleteProfileRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // UpdateProfile updates profile with provided subset of attributes
  updateProfile: {
    path: '/rover.audience.v1.Audience/UpdateProfile',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateProfileRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_UpdateProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateProfileRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  updateProfileIdentifier: {
    path: '/rover.audience.v1.Audience/UpdateProfileIdentifier',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateProfileIdentifierRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_UpdateProfileIdentifierRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateProfileIdentifierRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // GetProfileByDeviceId returns a profile which is associated to the device id
  getProfileByDeviceId: {
    path: '/rover.audience.v1.Audience/GetProfileByDeviceId',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetProfileByDeviceIdRequest,
    responseType: audience_v1_audience_pb.Profile,
    requestSerialize: serialize_rover_audience_v1_GetProfileByDeviceIdRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetProfileByDeviceIdRequest,
    responseSerialize: serialize_rover_audience_v1_Profile,
    responseDeserialize: deserialize_rover_audience_v1_Profile,
  },
  getProfileByIdentifier: {
    path: '/rover.audience.v1.Audience/GetProfileByIdentifier',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetProfileByIdentifierRequest,
    responseType: audience_v1_audience_pb.Profile,
    requestSerialize: serialize_rover_audience_v1_GetProfileByIdentifierRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetProfileByIdentifierRequest,
    responseSerialize: serialize_rover_audience_v1_Profile,
    responseDeserialize: deserialize_rover_audience_v1_Profile,
  },
  // GetProfileSchema returns the currently tracked profiles schema by account id
  getProfileSchema: {
    path: '/rover.audience.v1.Audience/GetProfileSchema',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetProfileSchemaRequest,
    responseType: audience_v1_audience_pb.ProfileSchema,
    requestSerialize: serialize_rover_audience_v1_GetProfileSchemaRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetProfileSchemaRequest,
    responseSerialize: serialize_rover_audience_v1_ProfileSchema,
    responseDeserialize: deserialize_rover_audience_v1_ProfileSchema,
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
    responseType: audience_v1_audience_pb.Device,
    requestSerialize: serialize_rover_audience_v1_GetDeviceRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetDeviceRequest,
    responseSerialize: serialize_rover_audience_v1_Device,
    responseDeserialize: deserialize_rover_audience_v1_Device,
  },
  getDeviceByPushToken: {
    path: '/rover.audience.v1.Audience/GetDeviceByPushToken',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.GetDeviceByPushTokenRequest,
    responseType: audience_v1_audience_pb.Device,
    requestSerialize: serialize_rover_audience_v1_GetDeviceByPushTokenRequest,
    requestDeserialize: deserialize_rover_audience_v1_GetDeviceByPushTokenRequest,
    responseSerialize: serialize_rover_audience_v1_Device,
    responseDeserialize: deserialize_rover_audience_v1_Device,
  },
  createDevice: {
    path: '/rover.audience.v1.Audience/CreateDevice',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.CreateDeviceRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_CreateDeviceRequest,
    requestDeserialize: deserialize_rover_audience_v1_CreateDeviceRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // Device Updates
  updateDevice: {
    path: '/rover.audience.v1.Audience/UpdateDevice',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  updateDevicePushToken: {
    path: '/rover.audience.v1.Audience/UpdateDevicePushToken',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDevicePushTokenRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_UpdateDevicePushTokenRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDevicePushTokenRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  updateDeviceUnregisterPushToken: {
    path: '/rover.audience.v1.Audience/UpdateDeviceUnregisterPushToken',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceUnregisterPushTokenRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceUnregisterPushTokenRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceUnregisterPushTokenRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  updateDeviceLocation: {
    path: '/rover.audience.v1.Audience/UpdateDeviceLocation',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceLocationRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceLocationRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceLocationRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  updateDeviceGeofenceMonitoring: {
    path: '/rover.audience.v1.Audience/UpdateDeviceGeofenceMonitoring',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceGeofenceMonitoringRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceGeofenceMonitoringRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceGeofenceMonitoringRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  updateDeviceIBeaconMonitoring: {
    path: '/rover.audience.v1.Audience/UpdateDeviceIBeaconMonitoring',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateDeviceIBeaconMonitoringRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_UpdateDeviceIBeaconMonitoringRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateDeviceIBeaconMonitoringRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
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
  // SetDeviceProfile sets the profile the device belongs to
  setDeviceProfile: {
    path: '/rover.audience.v1.Audience/SetDeviceProfile',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.SetDeviceProfileRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_SetDeviceProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_SetDeviceProfileRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // DeleteDevice deletes device from the database and removes it from any segments
  deleteDevice: {
    path: '/rover.audience.v1.Audience/DeleteDevice',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.DeleteDeviceRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_DeleteDeviceRequest,
    requestDeserialize: deserialize_rover_audience_v1_DeleteDeviceRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

exports.AudienceClient = grpc.makeGenericClientConstructor(AudienceService);
