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

function serialize_rover_audience_v1_GetProfileByDeviceIdRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.GetProfileByDeviceIdRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.GetProfileByDeviceIdRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_GetProfileByDeviceIdRequest(buffer_arg) {
  return audience_v1_audience_pb.GetProfileByDeviceIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_PutDeviceRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.PutDeviceRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.PutDeviceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_PutDeviceRequest(buffer_arg) {
  return audience_v1_audience_pb.PutDeviceRequest.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_rover_audience_v1_SetDevicePushTokenRequest(arg) {
  if (!(arg instanceof audience_v1_audience_pb.SetDevicePushTokenRequest)) {
    throw new Error('Expected argument of type rover.audience.v1.SetDevicePushTokenRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_audience_v1_SetDevicePushTokenRequest(buffer_arg) {
  return audience_v1_audience_pb.SetDevicePushTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
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
    responseType: audience_v1_audience_pb.Profile,
    requestSerialize: serialize_rover_audience_v1_DeleteProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_DeleteProfileRequest,
    responseSerialize: serialize_rover_audience_v1_Profile,
    responseDeserialize: deserialize_rover_audience_v1_Profile,
  },
  // UpdateProfile updates profile with provided subset of attributes
  updateProfile: {
    path: '/rover.audience.v1.Audience/UpdateProfile',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.UpdateProfileRequest,
    responseType: audience_v1_audience_pb.Profile,
    requestSerialize: serialize_rover_audience_v1_UpdateProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_UpdateProfileRequest,
    responseSerialize: serialize_rover_audience_v1_Profile,
    responseDeserialize: deserialize_rover_audience_v1_Profile,
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
  // CreateDevice creates a an "empty" device under a given account.
  createDevice: {
    path: '/rover.audience.v1.Audience/CreateDevice',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.CreateDeviceRequest,
    responseType: audience_v1_audience_pb.Device,
    requestSerialize: serialize_rover_audience_v1_CreateDeviceRequest,
    requestDeserialize: deserialize_rover_audience_v1_CreateDeviceRequest,
    responseSerialize: serialize_rover_audience_v1_Device,
    responseDeserialize: deserialize_rover_audience_v1_Device,
  },
  // DeleteDevice deletes device from the database and removes it from any segments
  deleteDevice: {
    path: '/rover.audience.v1.Audience/DeleteDevice',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.DeleteDeviceRequest,
    responseType: audience_v1_audience_pb.Device,
    requestSerialize: serialize_rover_audience_v1_DeleteDeviceRequest,
    requestDeserialize: deserialize_rover_audience_v1_DeleteDeviceRequest,
    responseSerialize: serialize_rover_audience_v1_Device,
    responseDeserialize: deserialize_rover_audience_v1_Device,
  },
  // PutDevice updates the device
  putDevice: {
    path: '/rover.audience.v1.Audience/PutDevice',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.PutDeviceRequest,
    responseType: audience_v1_audience_pb.Device,
    requestSerialize: serialize_rover_audience_v1_PutDeviceRequest,
    requestDeserialize: deserialize_rover_audience_v1_PutDeviceRequest,
    responseSerialize: serialize_rover_audience_v1_Device,
    responseDeserialize: deserialize_rover_audience_v1_Device,
  },
  // SetDevicePushToken
  setDevicePushToken: {
    path: '/rover.audience.v1.Audience/SetDevicePushToken',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.SetDevicePushTokenRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_rover_audience_v1_SetDevicePushTokenRequest,
    requestDeserialize: deserialize_rover_audience_v1_SetDevicePushTokenRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  // PutDevice updates the device
  setDeviceProfile: {
    path: '/rover.audience.v1.Audience/SetDeviceProfile',
    requestStream: false,
    responseStream: false,
    requestType: audience_v1_audience_pb.SetDeviceProfileRequest,
    responseType: audience_v1_audience_pb.Device,
    requestSerialize: serialize_rover_audience_v1_SetDeviceProfileRequest,
    requestDeserialize: deserialize_rover_audience_v1_SetDeviceProfileRequest,
    responseSerialize: serialize_rover_audience_v1_Device,
    responseDeserialize: deserialize_rover_audience_v1_Device,
  },
};

exports.AudienceClient = grpc.makeGenericClientConstructor(AudienceService);
