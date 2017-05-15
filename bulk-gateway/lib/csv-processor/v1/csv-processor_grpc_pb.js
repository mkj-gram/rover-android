// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var csv$processor_v1_csv$processor_pb = require('../../csv-processor/v1/csv-processor_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_rover_csv_processor_v1_CreateLoadJobReply(arg) {
  if (!(arg instanceof csv$processor_v1_csv$processor_pb.CreateLoadJobReply)) {
    throw new Error('Expected argument of type rover.csv_processor.v1.CreateLoadJobReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_csv_processor_v1_CreateLoadJobReply(buffer_arg) {
  return csv$processor_v1_csv$processor_pb.CreateLoadJobReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_csv_processor_v1_CreateLoadJobRequest(arg) {
  if (!(arg instanceof csv$processor_v1_csv$processor_pb.CreateLoadJobRequest)) {
    throw new Error('Expected argument of type rover.csv_processor.v1.CreateLoadJobRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_csv_processor_v1_CreateLoadJobRequest(buffer_arg) {
  return csv$processor_v1_csv$processor_pb.CreateLoadJobRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_csv_processor_v1_GetLoadJobReply(arg) {
  if (!(arg instanceof csv$processor_v1_csv$processor_pb.GetLoadJobReply)) {
    throw new Error('Expected argument of type rover.csv_processor.v1.GetLoadJobReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_csv_processor_v1_GetLoadJobReply(buffer_arg) {
  return csv$processor_v1_csv$processor_pb.GetLoadJobReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_csv_processor_v1_GetLoadJobRequest(arg) {
  if (!(arg instanceof csv$processor_v1_csv$processor_pb.GetLoadJobRequest)) {
    throw new Error('Expected argument of type rover.csv_processor.v1.GetLoadJobRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_csv_processor_v1_GetLoadJobRequest(buffer_arg) {
  return csv$processor_v1_csv$processor_pb.GetLoadJobRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var CsvProcessorService = exports.CsvProcessorService = {
  getLoadJob: {
    path: '/rover.csv_processor.v1.CsvProcessor/GetLoadJob',
    requestStream: false,
    responseStream: false,
    requestType: csv$processor_v1_csv$processor_pb.GetLoadJobRequest,
    responseType: csv$processor_v1_csv$processor_pb.GetLoadJobReply,
    requestSerialize: serialize_rover_csv_processor_v1_GetLoadJobRequest,
    requestDeserialize: deserialize_rover_csv_processor_v1_GetLoadJobRequest,
    responseSerialize: serialize_rover_csv_processor_v1_GetLoadJobReply,
    responseDeserialize: deserialize_rover_csv_processor_v1_GetLoadJobReply,
  },
  createLoadJob: {
    path: '/rover.csv_processor.v1.CsvProcessor/CreateLoadJob',
    requestStream: false,
    responseStream: false,
    requestType: csv$processor_v1_csv$processor_pb.CreateLoadJobRequest,
    responseType: csv$processor_v1_csv$processor_pb.CreateLoadJobReply,
    requestSerialize: serialize_rover_csv_processor_v1_CreateLoadJobRequest,
    requestDeserialize: deserialize_rover_csv_processor_v1_CreateLoadJobRequest,
    responseSerialize: serialize_rover_csv_processor_v1_CreateLoadJobReply,
    responseDeserialize: deserialize_rover_csv_processor_v1_CreateLoadJobReply,
  },
};

exports.CsvProcessorClient = grpc.makeGenericClientConstructor(CsvProcessorService);
