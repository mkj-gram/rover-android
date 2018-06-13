// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var event_v1_schema_pb = require('../../event/v1/schema_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_rover_event_v1_GetSchemaRequest(arg) {
  if (!(arg instanceof event_v1_schema_pb.GetSchemaRequest)) {
    throw new Error('Expected argument of type rover.event.v1.GetSchemaRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_event_v1_GetSchemaRequest(buffer_arg) {
  return event_v1_schema_pb.GetSchemaRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_event_v1_GetSchemaResponse(arg) {
  if (!(arg instanceof event_v1_schema_pb.GetSchemaResponse)) {
    throw new Error('Expected argument of type rover.event.v1.GetSchemaResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_event_v1_GetSchemaResponse(buffer_arg) {
  return event_v1_schema_pb.GetSchemaResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var SchemaService = exports.SchemaService = {
  getSchema: {
    path: '/rover.event.v1.Schema/GetSchema',
    requestStream: false,
    responseStream: false,
    requestType: event_v1_schema_pb.GetSchemaRequest,
    responseType: event_v1_schema_pb.GetSchemaResponse,
    requestSerialize: serialize_rover_event_v1_GetSchemaRequest,
    requestDeserialize: deserialize_rover_event_v1_GetSchemaRequest,
    responseSerialize: serialize_rover_event_v1_GetSchemaResponse,
    responseDeserialize: deserialize_rover_event_v1_GetSchemaResponse,
  },
};

exports.SchemaClient = grpc.makeGenericClientConstructor(SchemaService);
