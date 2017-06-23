// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var segment_v1_segment_pb = require('../../segment/v1/segment_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var auth_v1_auth_pb = require('../../auth/v1/auth_pb.js');

function serialize_rover_segment_v1_CreateStaticSegmentReply(arg) {
  if (!(arg instanceof segment_v1_segment_pb.CreateStaticSegmentReply)) {
    throw new Error('Expected argument of type rover.segment.v1.CreateStaticSegmentReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_CreateStaticSegmentReply(buffer_arg) {
  return segment_v1_segment_pb.CreateStaticSegmentReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_CreateStaticSegmentRequest(arg) {
  if (!(arg instanceof segment_v1_segment_pb.CreateStaticSegmentRequest)) {
    throw new Error('Expected argument of type rover.segment.v1.CreateStaticSegmentRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_CreateStaticSegmentRequest(buffer_arg) {
  return segment_v1_segment_pb.CreateStaticSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_DeleteStaticSegmentReply(arg) {
  if (!(arg instanceof segment_v1_segment_pb.DeleteStaticSegmentReply)) {
    throw new Error('Expected argument of type rover.segment.v1.DeleteStaticSegmentReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_DeleteStaticSegmentReply(buffer_arg) {
  return segment_v1_segment_pb.DeleteStaticSegmentReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_DeleteStaticSegmentRequest(arg) {
  if (!(arg instanceof segment_v1_segment_pb.DeleteStaticSegmentRequest)) {
    throw new Error('Expected argument of type rover.segment.v1.DeleteStaticSegmentRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_DeleteStaticSegmentRequest(buffer_arg) {
  return segment_v1_segment_pb.DeleteStaticSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_GetStaticSegmentPushIdsReply(arg) {
  if (!(arg instanceof segment_v1_segment_pb.GetStaticSegmentPushIdsReply)) {
    throw new Error('Expected argument of type rover.segment.v1.GetStaticSegmentPushIdsReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_GetStaticSegmentPushIdsReply(buffer_arg) {
  return segment_v1_segment_pb.GetStaticSegmentPushIdsReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_GetStaticSegmentPushIdsRequest(arg) {
  if (!(arg instanceof segment_v1_segment_pb.GetStaticSegmentPushIdsRequest)) {
    throw new Error('Expected argument of type rover.segment.v1.GetStaticSegmentPushIdsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_GetStaticSegmentPushIdsRequest(buffer_arg) {
  return segment_v1_segment_pb.GetStaticSegmentPushIdsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_GetStaticSegmentReply(arg) {
  if (!(arg instanceof segment_v1_segment_pb.GetStaticSegmentReply)) {
    throw new Error('Expected argument of type rover.segment.v1.GetStaticSegmentReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_GetStaticSegmentReply(buffer_arg) {
  return segment_v1_segment_pb.GetStaticSegmentReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_GetStaticSegmentRequest(arg) {
  if (!(arg instanceof segment_v1_segment_pb.GetStaticSegmentRequest)) {
    throw new Error('Expected argument of type rover.segment.v1.GetStaticSegmentRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_GetStaticSegmentRequest(buffer_arg) {
  return segment_v1_segment_pb.GetStaticSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_IsInStaticSegmentReply(arg) {
  if (!(arg instanceof segment_v1_segment_pb.IsInStaticSegmentReply)) {
    throw new Error('Expected argument of type rover.segment.v1.IsInStaticSegmentReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_IsInStaticSegmentReply(buffer_arg) {
  return segment_v1_segment_pb.IsInStaticSegmentReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_IsInStaticSegmentRequest(arg) {
  if (!(arg instanceof segment_v1_segment_pb.IsInStaticSegmentRequest)) {
    throw new Error('Expected argument of type rover.segment.v1.IsInStaticSegmentRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_IsInStaticSegmentRequest(buffer_arg) {
  return segment_v1_segment_pb.IsInStaticSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_ListStaticSegmentRequest(arg) {
  if (!(arg instanceof segment_v1_segment_pb.ListStaticSegmentRequest)) {
    throw new Error('Expected argument of type rover.segment.v1.ListStaticSegmentRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_ListStaticSegmentRequest(buffer_arg) {
  return segment_v1_segment_pb.ListStaticSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_ListStaticSegmentResponse(arg) {
  if (!(arg instanceof segment_v1_segment_pb.ListStaticSegmentResponse)) {
    throw new Error('Expected argument of type rover.segment.v1.ListStaticSegmentResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_ListStaticSegmentResponse(buffer_arg) {
  return segment_v1_segment_pb.ListStaticSegmentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_PushId(arg) {
  if (!(arg instanceof segment_v1_segment_pb.PushId)) {
    throw new Error('Expected argument of type rover.segment.v1.PushId');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_PushId(buffer_arg) {
  return segment_v1_segment_pb.PushId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_segment_v1_UpdateStaticSegmentIdsReply(arg) {
  if (!(arg instanceof segment_v1_segment_pb.UpdateStaticSegmentIdsReply)) {
    throw new Error('Expected argument of type rover.segment.v1.UpdateStaticSegmentIdsReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_segment_v1_UpdateStaticSegmentIdsReply(buffer_arg) {
  return segment_v1_segment_pb.UpdateStaticSegmentIdsReply.deserializeBinary(new Uint8Array(buffer_arg));
}


var SegmentService = exports.SegmentService = {
  listStaticSegments: {
    path: '/rover.segment.v1.Segment/ListStaticSegments',
    requestStream: false,
    responseStream: false,
    requestType: segment_v1_segment_pb.ListStaticSegmentRequest,
    responseType: segment_v1_segment_pb.ListStaticSegmentResponse,
    requestSerialize: serialize_rover_segment_v1_ListStaticSegmentRequest,
    requestDeserialize: deserialize_rover_segment_v1_ListStaticSegmentRequest,
    responseSerialize: serialize_rover_segment_v1_ListStaticSegmentResponse,
    responseDeserialize: deserialize_rover_segment_v1_ListStaticSegmentResponse,
  },
  getStaticSegment: {
    path: '/rover.segment.v1.Segment/GetStaticSegment',
    requestStream: false,
    responseStream: false,
    requestType: segment_v1_segment_pb.GetStaticSegmentRequest,
    responseType: segment_v1_segment_pb.GetStaticSegmentReply,
    requestSerialize: serialize_rover_segment_v1_GetStaticSegmentRequest,
    requestDeserialize: deserialize_rover_segment_v1_GetStaticSegmentRequest,
    responseSerialize: serialize_rover_segment_v1_GetStaticSegmentReply,
    responseDeserialize: deserialize_rover_segment_v1_GetStaticSegmentReply,
  },
  createStaticSegment: {
    path: '/rover.segment.v1.Segment/CreateStaticSegment',
    requestStream: false,
    responseStream: false,
    requestType: segment_v1_segment_pb.CreateStaticSegmentRequest,
    responseType: segment_v1_segment_pb.CreateStaticSegmentReply,
    requestSerialize: serialize_rover_segment_v1_CreateStaticSegmentRequest,
    requestDeserialize: deserialize_rover_segment_v1_CreateStaticSegmentRequest,
    responseSerialize: serialize_rover_segment_v1_CreateStaticSegmentReply,
    responseDeserialize: deserialize_rover_segment_v1_CreateStaticSegmentReply,
  },
  deleteStaticSegment: {
    path: '/rover.segment.v1.Segment/DeleteStaticSegment',
    requestStream: false,
    responseStream: false,
    requestType: segment_v1_segment_pb.DeleteStaticSegmentRequest,
    responseType: segment_v1_segment_pb.DeleteStaticSegmentReply,
    requestSerialize: serialize_rover_segment_v1_DeleteStaticSegmentRequest,
    requestDeserialize: deserialize_rover_segment_v1_DeleteStaticSegmentRequest,
    responseSerialize: serialize_rover_segment_v1_DeleteStaticSegmentReply,
    responseDeserialize: deserialize_rover_segment_v1_DeleteStaticSegmentReply,
  },
  updateStaticSegmentPushIds: {
    path: '/rover.segment.v1.Segment/UpdateStaticSegmentPushIds',
    requestStream: true,
    responseStream: false,
    requestType: segment_v1_segment_pb.PushId,
    responseType: segment_v1_segment_pb.UpdateStaticSegmentIdsReply,
    requestSerialize: serialize_rover_segment_v1_PushId,
    requestDeserialize: deserialize_rover_segment_v1_PushId,
    responseSerialize: serialize_rover_segment_v1_UpdateStaticSegmentIdsReply,
    responseDeserialize: deserialize_rover_segment_v1_UpdateStaticSegmentIdsReply,
  },
  getStaticSegmentPushIds: {
    path: '/rover.segment.v1.Segment/GetStaticSegmentPushIds',
    requestStream: false,
    responseStream: false,
    requestType: segment_v1_segment_pb.GetStaticSegmentPushIdsRequest,
    responseType: segment_v1_segment_pb.GetStaticSegmentPushIdsReply,
    requestSerialize: serialize_rover_segment_v1_GetStaticSegmentPushIdsRequest,
    requestDeserialize: deserialize_rover_segment_v1_GetStaticSegmentPushIdsRequest,
    responseSerialize: serialize_rover_segment_v1_GetStaticSegmentPushIdsReply,
    responseDeserialize: deserialize_rover_segment_v1_GetStaticSegmentPushIdsReply,
  },
  isInStaticSegment: {
    path: '/rover.segment.v1.Segment/IsInStaticSegment',
    requestStream: false,
    responseStream: false,
    requestType: segment_v1_segment_pb.IsInStaticSegmentRequest,
    responseType: segment_v1_segment_pb.IsInStaticSegmentReply,
    requestSerialize: serialize_rover_segment_v1_IsInStaticSegmentRequest,
    requestDeserialize: deserialize_rover_segment_v1_IsInStaticSegmentRequest,
    responseSerialize: serialize_rover_segment_v1_IsInStaticSegmentReply,
    responseDeserialize: deserialize_rover_segment_v1_IsInStaticSegmentReply,
  },
};

exports.SegmentClient = grpc.makeGenericClientConstructor(SegmentService);
