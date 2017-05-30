// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var segment_v1_segment_pb = require('../../segment/v1/segment_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_segment_v1_CreateStaticSegmentReply(arg) {
  if (!(arg instanceof segment_v1_segment_pb.CreateStaticSegmentReply)) {
    throw new Error('Expected argument of type segment.v1.CreateStaticSegmentReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_segment_v1_CreateStaticSegmentReply(buffer_arg) {
  return segment_v1_segment_pb.CreateStaticSegmentReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_segment_v1_CreateStaticSegmentRequest(arg) {
  if (!(arg instanceof segment_v1_segment_pb.CreateStaticSegmentRequest)) {
    throw new Error('Expected argument of type segment.v1.CreateStaticSegmentRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_segment_v1_CreateStaticSegmentRequest(buffer_arg) {
  return segment_v1_segment_pb.CreateStaticSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_segment_v1_GetStaticSegmentPushIdsRequest(arg) {
  if (!(arg instanceof segment_v1_segment_pb.GetStaticSegmentPushIdsRequest)) {
    throw new Error('Expected argument of type segment.v1.GetStaticSegmentPushIdsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_segment_v1_GetStaticSegmentPushIdsRequest(buffer_arg) {
  return segment_v1_segment_pb.GetStaticSegmentPushIdsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_segment_v1_GetStaticSegmentReply(arg) {
  if (!(arg instanceof segment_v1_segment_pb.GetStaticSegmentReply)) {
    throw new Error('Expected argument of type segment.v1.GetStaticSegmentReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_segment_v1_GetStaticSegmentReply(buffer_arg) {
  return segment_v1_segment_pb.GetStaticSegmentReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_segment_v1_GetStaticSegmentRequest(arg) {
  if (!(arg instanceof segment_v1_segment_pb.GetStaticSegmentRequest)) {
    throw new Error('Expected argument of type segment.v1.GetStaticSegmentRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_segment_v1_GetStaticSegmentRequest(buffer_arg) {
  return segment_v1_segment_pb.GetStaticSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_segment_v1_ListStaticSegmentRequest(arg) {
  if (!(arg instanceof segment_v1_segment_pb.ListStaticSegmentRequest)) {
    throw new Error('Expected argument of type segment.v1.ListStaticSegmentRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_segment_v1_ListStaticSegmentRequest(buffer_arg) {
  return segment_v1_segment_pb.ListStaticSegmentRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_segment_v1_ListStaticSegmentResponse(arg) {
  if (!(arg instanceof segment_v1_segment_pb.ListStaticSegmentResponse)) {
    throw new Error('Expected argument of type segment.v1.ListStaticSegmentResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_segment_v1_ListStaticSegmentResponse(buffer_arg) {
  return segment_v1_segment_pb.ListStaticSegmentResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_segment_v1_PushId(arg) {
  if (!(arg instanceof segment_v1_segment_pb.PushId)) {
    throw new Error('Expected argument of type segment.v1.PushId');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_segment_v1_PushId(buffer_arg) {
  return segment_v1_segment_pb.PushId.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_segment_v1_UpdateStaticSegmentIdsReply(arg) {
  if (!(arg instanceof segment_v1_segment_pb.UpdateStaticSegmentIdsReply)) {
    throw new Error('Expected argument of type segment.v1.UpdateStaticSegmentIdsReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_segment_v1_UpdateStaticSegmentIdsReply(buffer_arg) {
  return segment_v1_segment_pb.UpdateStaticSegmentIdsReply.deserializeBinary(new Uint8Array(buffer_arg));
}


var SegmentService = exports.SegmentService = {
  listStaticSegments: {
    path: '/segment.v1.Segment/ListStaticSegments',
    requestStream: false,
    responseStream: false,
    requestType: segment_v1_segment_pb.ListStaticSegmentRequest,
    responseType: segment_v1_segment_pb.ListStaticSegmentResponse,
    requestSerialize: serialize_segment_v1_ListStaticSegmentRequest,
    requestDeserialize: deserialize_segment_v1_ListStaticSegmentRequest,
    responseSerialize: serialize_segment_v1_ListStaticSegmentResponse,
    responseDeserialize: deserialize_segment_v1_ListStaticSegmentResponse,
  },
  getStaticSegment: {
    path: '/segment.v1.Segment/GetStaticSegment',
    requestStream: false,
    responseStream: false,
    requestType: segment_v1_segment_pb.GetStaticSegmentRequest,
    responseType: segment_v1_segment_pb.GetStaticSegmentReply,
    requestSerialize: serialize_segment_v1_GetStaticSegmentRequest,
    requestDeserialize: deserialize_segment_v1_GetStaticSegmentRequest,
    responseSerialize: serialize_segment_v1_GetStaticSegmentReply,
    responseDeserialize: deserialize_segment_v1_GetStaticSegmentReply,
  },
  createStaticSegment: {
    path: '/segment.v1.Segment/CreateStaticSegment',
    requestStream: false,
    responseStream: false,
    requestType: segment_v1_segment_pb.CreateStaticSegmentRequest,
    responseType: segment_v1_segment_pb.CreateStaticSegmentReply,
    requestSerialize: serialize_segment_v1_CreateStaticSegmentRequest,
    requestDeserialize: deserialize_segment_v1_CreateStaticSegmentRequest,
    responseSerialize: serialize_segment_v1_CreateStaticSegmentReply,
    responseDeserialize: deserialize_segment_v1_CreateStaticSegmentReply,
  },
  updateStaticSegmentPushIds: {
    path: '/segment.v1.Segment/UpdateStaticSegmentPushIds',
    requestStream: true,
    responseStream: false,
    requestType: segment_v1_segment_pb.PushId,
    responseType: segment_v1_segment_pb.UpdateStaticSegmentIdsReply,
    requestSerialize: serialize_segment_v1_PushId,
    requestDeserialize: deserialize_segment_v1_PushId,
    responseSerialize: serialize_segment_v1_UpdateStaticSegmentIdsReply,
    responseDeserialize: deserialize_segment_v1_UpdateStaticSegmentIdsReply,
  },
  getStaticSegmentPushIds: {
    path: '/segment.v1.Segment/GetStaticSegmentPushIds',
    requestStream: false,
    responseStream: true,
    requestType: segment_v1_segment_pb.GetStaticSegmentPushIdsRequest,
    responseType: segment_v1_segment_pb.PushId,
    requestSerialize: serialize_segment_v1_GetStaticSegmentPushIdsRequest,
    requestDeserialize: deserialize_segment_v1_GetStaticSegmentPushIdsRequest,
    responseSerialize: serialize_segment_v1_PushId,
    responseDeserialize: deserialize_segment_v1_PushId,
  },
};

exports.SegmentClient = grpc.makeGenericClientConstructor(SegmentService);