// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var campaigns_v1_campaigns_pb = require('../../campaigns/v1/campaigns_pb.js');
var auth_v1_auth_pb = require('../../auth/v1/auth_pb.js');
var protobuf_predicates_pb = require('../../protobuf/predicates_pb.js');
var protobuf_wrappers_pb = require('../../protobuf/wrappers_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_rover_campaigns_v1_ArchiveRequest(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.ArchiveRequest)) {
    throw new Error('Expected argument of type rover.campaigns.v1.ArchiveRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_ArchiveRequest(buffer_arg) {
  return campaigns_v1_campaigns_pb.ArchiveRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_ArchiveResponse(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.ArchiveResponse)) {
    throw new Error('Expected argument of type rover.campaigns.v1.ArchiveResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_ArchiveResponse(buffer_arg) {
  return campaigns_v1_campaigns_pb.ArchiveResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_CreateRequest(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.CreateRequest)) {
    throw new Error('Expected argument of type rover.campaigns.v1.CreateRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_CreateRequest(buffer_arg) {
  return campaigns_v1_campaigns_pb.CreateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_CreateResponse(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.CreateResponse)) {
    throw new Error('Expected argument of type rover.campaigns.v1.CreateResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_CreateResponse(buffer_arg) {
  return campaigns_v1_campaigns_pb.CreateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_DuplicateRequest(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.DuplicateRequest)) {
    throw new Error('Expected argument of type rover.campaigns.v1.DuplicateRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_DuplicateRequest(buffer_arg) {
  return campaigns_v1_campaigns_pb.DuplicateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_DuplicateResponse(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.DuplicateResponse)) {
    throw new Error('Expected argument of type rover.campaigns.v1.DuplicateResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_DuplicateResponse(buffer_arg) {
  return campaigns_v1_campaigns_pb.DuplicateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_GetRequest(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.GetRequest)) {
    throw new Error('Expected argument of type rover.campaigns.v1.GetRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_GetRequest(buffer_arg) {
  return campaigns_v1_campaigns_pb.GetRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_GetResponse(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.GetResponse)) {
    throw new Error('Expected argument of type rover.campaigns.v1.GetResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_GetResponse(buffer_arg) {
  return campaigns_v1_campaigns_pb.GetResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_ListRequest(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.ListRequest)) {
    throw new Error('Expected argument of type rover.campaigns.v1.ListRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_ListRequest(buffer_arg) {
  return campaigns_v1_campaigns_pb.ListRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_ListResponse(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.ListResponse)) {
    throw new Error('Expected argument of type rover.campaigns.v1.ListResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_ListResponse(buffer_arg) {
  return campaigns_v1_campaigns_pb.ListResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_PublishRequest(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.PublishRequest)) {
    throw new Error('Expected argument of type rover.campaigns.v1.PublishRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_PublishRequest(buffer_arg) {
  return campaigns_v1_campaigns_pb.PublishRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_PublishResponse(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.PublishResponse)) {
    throw new Error('Expected argument of type rover.campaigns.v1.PublishResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_PublishResponse(buffer_arg) {
  return campaigns_v1_campaigns_pb.PublishResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_RenameRequest(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.RenameRequest)) {
    throw new Error('Expected argument of type rover.campaigns.v1.RenameRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_RenameRequest(buffer_arg) {
  return campaigns_v1_campaigns_pb.RenameRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_RenameResponse(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.RenameResponse)) {
    throw new Error('Expected argument of type rover.campaigns.v1.RenameResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_RenameResponse(buffer_arg) {
  return campaigns_v1_campaigns_pb.RenameResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_SendTestRequest(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.SendTestRequest)) {
    throw new Error('Expected argument of type rover.campaigns.v1.SendTestRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_SendTestRequest(buffer_arg) {
  return campaigns_v1_campaigns_pb.SendTestRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_SendTestResponse(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.SendTestResponse)) {
    throw new Error('Expected argument of type rover.campaigns.v1.SendTestResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_SendTestResponse(buffer_arg) {
  return campaigns_v1_campaigns_pb.SendTestResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_UpdateAutomatedDeliverySettingsRequest(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.UpdateAutomatedDeliverySettingsRequest)) {
    throw new Error('Expected argument of type rover.campaigns.v1.UpdateAutomatedDeliverySettingsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_UpdateAutomatedDeliverySettingsRequest(buffer_arg) {
  return campaigns_v1_campaigns_pb.UpdateAutomatedDeliverySettingsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_UpdateAutomatedDeliverySettingsResponse(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.UpdateAutomatedDeliverySettingsResponse)) {
    throw new Error('Expected argument of type rover.campaigns.v1.UpdateAutomatedDeliverySettingsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_UpdateAutomatedDeliverySettingsResponse(buffer_arg) {
  return campaigns_v1_campaigns_pb.UpdateAutomatedDeliverySettingsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_UpdateNotificationSettingsRequest(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.UpdateNotificationSettingsRequest)) {
    throw new Error('Expected argument of type rover.campaigns.v1.UpdateNotificationSettingsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_UpdateNotificationSettingsRequest(buffer_arg) {
  return campaigns_v1_campaigns_pb.UpdateNotificationSettingsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_UpdateNotificationSettingsResponse(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.UpdateNotificationSettingsResponse)) {
    throw new Error('Expected argument of type rover.campaigns.v1.UpdateNotificationSettingsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_UpdateNotificationSettingsResponse(buffer_arg) {
  return campaigns_v1_campaigns_pb.UpdateNotificationSettingsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_UpdateScheduledDeliverySettingsRequest(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.UpdateScheduledDeliverySettingsRequest)) {
    throw new Error('Expected argument of type rover.campaigns.v1.UpdateScheduledDeliverySettingsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_UpdateScheduledDeliverySettingsRequest(buffer_arg) {
  return campaigns_v1_campaigns_pb.UpdateScheduledDeliverySettingsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_campaigns_v1_UpdateScheduledDeliverySettingsResponse(arg) {
  if (!(arg instanceof campaigns_v1_campaigns_pb.UpdateScheduledDeliverySettingsResponse)) {
    throw new Error('Expected argument of type rover.campaigns.v1.UpdateScheduledDeliverySettingsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_campaigns_v1_UpdateScheduledDeliverySettingsResponse(buffer_arg) {
  return campaigns_v1_campaigns_pb.UpdateScheduledDeliverySettingsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var CampaignsService = exports.CampaignsService = {
  //
  // CRUD
  //
  list: {
    path: '/rover.campaigns.v1.Campaigns/List',
    requestStream: false,
    responseStream: false,
    requestType: campaigns_v1_campaigns_pb.ListRequest,
    responseType: campaigns_v1_campaigns_pb.ListResponse,
    requestSerialize: serialize_rover_campaigns_v1_ListRequest,
    requestDeserialize: deserialize_rover_campaigns_v1_ListRequest,
    responseSerialize: serialize_rover_campaigns_v1_ListResponse,
    responseDeserialize: deserialize_rover_campaigns_v1_ListResponse,
  },
  get: {
    path: '/rover.campaigns.v1.Campaigns/Get',
    requestStream: false,
    responseStream: false,
    requestType: campaigns_v1_campaigns_pb.GetRequest,
    responseType: campaigns_v1_campaigns_pb.GetResponse,
    requestSerialize: serialize_rover_campaigns_v1_GetRequest,
    requestDeserialize: deserialize_rover_campaigns_v1_GetRequest,
    responseSerialize: serialize_rover_campaigns_v1_GetResponse,
    responseDeserialize: deserialize_rover_campaigns_v1_GetResponse,
  },
  create: {
    path: '/rover.campaigns.v1.Campaigns/Create',
    requestStream: false,
    responseStream: false,
    requestType: campaigns_v1_campaigns_pb.CreateRequest,
    responseType: campaigns_v1_campaigns_pb.CreateResponse,
    requestSerialize: serialize_rover_campaigns_v1_CreateRequest,
    requestDeserialize: deserialize_rover_campaigns_v1_CreateRequest,
    responseSerialize: serialize_rover_campaigns_v1_CreateResponse,
    responseDeserialize: deserialize_rover_campaigns_v1_CreateResponse,
  },
  duplicate: {
    path: '/rover.campaigns.v1.Campaigns/Duplicate',
    requestStream: false,
    responseStream: false,
    requestType: campaigns_v1_campaigns_pb.DuplicateRequest,
    responseType: campaigns_v1_campaigns_pb.DuplicateResponse,
    requestSerialize: serialize_rover_campaigns_v1_DuplicateRequest,
    requestDeserialize: deserialize_rover_campaigns_v1_DuplicateRequest,
    responseSerialize: serialize_rover_campaigns_v1_DuplicateResponse,
    responseDeserialize: deserialize_rover_campaigns_v1_DuplicateResponse,
  },
  rename: {
    path: '/rover.campaigns.v1.Campaigns/Rename',
    requestStream: false,
    responseStream: false,
    requestType: campaigns_v1_campaigns_pb.RenameRequest,
    responseType: campaigns_v1_campaigns_pb.RenameResponse,
    requestSerialize: serialize_rover_campaigns_v1_RenameRequest,
    requestDeserialize: deserialize_rover_campaigns_v1_RenameRequest,
    responseSerialize: serialize_rover_campaigns_v1_RenameResponse,
    responseDeserialize: deserialize_rover_campaigns_v1_RenameResponse,
  },
  publish: {
    path: '/rover.campaigns.v1.Campaigns/Publish',
    requestStream: false,
    responseStream: false,
    requestType: campaigns_v1_campaigns_pb.PublishRequest,
    responseType: campaigns_v1_campaigns_pb.PublishResponse,
    requestSerialize: serialize_rover_campaigns_v1_PublishRequest,
    requestDeserialize: deserialize_rover_campaigns_v1_PublishRequest,
    responseSerialize: serialize_rover_campaigns_v1_PublishResponse,
    responseDeserialize: deserialize_rover_campaigns_v1_PublishResponse,
  },
  archive: {
    path: '/rover.campaigns.v1.Campaigns/Archive',
    requestStream: false,
    responseStream: false,
    requestType: campaigns_v1_campaigns_pb.ArchiveRequest,
    responseType: campaigns_v1_campaigns_pb.ArchiveResponse,
    requestSerialize: serialize_rover_campaigns_v1_ArchiveRequest,
    requestDeserialize: deserialize_rover_campaigns_v1_ArchiveRequest,
    responseSerialize: serialize_rover_campaigns_v1_ArchiveResponse,
    responseDeserialize: deserialize_rover_campaigns_v1_ArchiveResponse,
  },
  sendTest: {
    path: '/rover.campaigns.v1.Campaigns/SendTest',
    requestStream: false,
    responseStream: false,
    requestType: campaigns_v1_campaigns_pb.SendTestRequest,
    responseType: campaigns_v1_campaigns_pb.SendTestResponse,
    requestSerialize: serialize_rover_campaigns_v1_SendTestRequest,
    requestDeserialize: deserialize_rover_campaigns_v1_SendTestRequest,
    responseSerialize: serialize_rover_campaigns_v1_SendTestResponse,
    responseDeserialize: deserialize_rover_campaigns_v1_SendTestResponse,
  },
  updateNotificationSettings: {
    path: '/rover.campaigns.v1.Campaigns/UpdateNotificationSettings',
    requestStream: false,
    responseStream: false,
    requestType: campaigns_v1_campaigns_pb.UpdateNotificationSettingsRequest,
    responseType: campaigns_v1_campaigns_pb.UpdateNotificationSettingsResponse,
    requestSerialize: serialize_rover_campaigns_v1_UpdateNotificationSettingsRequest,
    requestDeserialize: deserialize_rover_campaigns_v1_UpdateNotificationSettingsRequest,
    responseSerialize: serialize_rover_campaigns_v1_UpdateNotificationSettingsResponse,
    responseDeserialize: deserialize_rover_campaigns_v1_UpdateNotificationSettingsResponse,
  },
  updateScheduledDeliverySettings: {
    path: '/rover.campaigns.v1.Campaigns/UpdateScheduledDeliverySettings',
    requestStream: false,
    responseStream: false,
    requestType: campaigns_v1_campaigns_pb.UpdateScheduledDeliverySettingsRequest,
    responseType: campaigns_v1_campaigns_pb.UpdateScheduledDeliverySettingsResponse,
    requestSerialize: serialize_rover_campaigns_v1_UpdateScheduledDeliverySettingsRequest,
    requestDeserialize: deserialize_rover_campaigns_v1_UpdateScheduledDeliverySettingsRequest,
    responseSerialize: serialize_rover_campaigns_v1_UpdateScheduledDeliverySettingsResponse,
    responseDeserialize: deserialize_rover_campaigns_v1_UpdateScheduledDeliverySettingsResponse,
  },
  updateAutomatedDeliverySettings: {
    path: '/rover.campaigns.v1.Campaigns/UpdateAutomatedDeliverySettings',
    requestStream: false,
    responseStream: false,
    requestType: campaigns_v1_campaigns_pb.UpdateAutomatedDeliverySettingsRequest,
    responseType: campaigns_v1_campaigns_pb.UpdateAutomatedDeliverySettingsResponse,
    requestSerialize: serialize_rover_campaigns_v1_UpdateAutomatedDeliverySettingsRequest,
    requestDeserialize: deserialize_rover_campaigns_v1_UpdateAutomatedDeliverySettingsRequest,
    responseSerialize: serialize_rover_campaigns_v1_UpdateAutomatedDeliverySettingsResponse,
    responseDeserialize: deserialize_rover_campaigns_v1_UpdateAutomatedDeliverySettingsResponse,
  },
};

exports.CampaignsClient = grpc.makeGenericClientConstructor(CampaignsService);
