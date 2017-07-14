// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var files_v1_files_pb = require('../../files/v1/files_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
var auth_v1_auth_pb = require('../../auth/v1/auth_pb.js');

function serialize_rover_files_v1_DeleteCsvFileRequest(arg) {
  if (!(arg instanceof files_v1_files_pb.DeleteCsvFileRequest)) {
    throw new Error('Expected argument of type rover.files.v1.DeleteCsvFileRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_files_v1_DeleteCsvFileRequest(buffer_arg) {
  return files_v1_files_pb.DeleteCsvFileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_files_v1_DeleteCsvFileResponse(arg) {
  if (!(arg instanceof files_v1_files_pb.DeleteCsvFileResponse)) {
    throw new Error('Expected argument of type rover.files.v1.DeleteCsvFileResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_files_v1_DeleteCsvFileResponse(buffer_arg) {
  return files_v1_files_pb.DeleteCsvFileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_files_v1_GetCsvFileRequest(arg) {
  if (!(arg instanceof files_v1_files_pb.GetCsvFileRequest)) {
    throw new Error('Expected argument of type rover.files.v1.GetCsvFileRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_files_v1_GetCsvFileRequest(buffer_arg) {
  return files_v1_files_pb.GetCsvFileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_files_v1_GetCsvFileResponse(arg) {
  if (!(arg instanceof files_v1_files_pb.GetCsvFileResponse)) {
    throw new Error('Expected argument of type rover.files.v1.GetCsvFileResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_files_v1_GetCsvFileResponse(buffer_arg) {
  return files_v1_files_pb.GetCsvFileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_files_v1_ListCsvFilesRequest(arg) {
  if (!(arg instanceof files_v1_files_pb.ListCsvFilesRequest)) {
    throw new Error('Expected argument of type rover.files.v1.ListCsvFilesRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_files_v1_ListCsvFilesRequest(buffer_arg) {
  return files_v1_files_pb.ListCsvFilesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_files_v1_ListCsvFilesResponse(arg) {
  if (!(arg instanceof files_v1_files_pb.ListCsvFilesResponse)) {
    throw new Error('Expected argument of type rover.files.v1.ListCsvFilesResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_files_v1_ListCsvFilesResponse(buffer_arg) {
  return files_v1_files_pb.ListCsvFilesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_files_v1_UploadCsvFileRequest(arg) {
  if (!(arg instanceof files_v1_files_pb.UploadCsvFileRequest)) {
    throw new Error('Expected argument of type rover.files.v1.UploadCsvFileRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_files_v1_UploadCsvFileRequest(buffer_arg) {
  return files_v1_files_pb.UploadCsvFileRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_files_v1_UploadCsvFileResponse(arg) {
  if (!(arg instanceof files_v1_files_pb.UploadCsvFileResponse)) {
    throw new Error('Expected argument of type rover.files.v1.UploadCsvFileResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_files_v1_UploadCsvFileResponse(buffer_arg) {
  return files_v1_files_pb.UploadCsvFileResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var FilesService = exports.FilesService = {
  listCsvFiles: {
    path: '/rover.files.v1.Files/ListCsvFiles',
    requestStream: false,
    responseStream: false,
    requestType: files_v1_files_pb.ListCsvFilesRequest,
    responseType: files_v1_files_pb.ListCsvFilesResponse,
    requestSerialize: serialize_rover_files_v1_ListCsvFilesRequest,
    requestDeserialize: deserialize_rover_files_v1_ListCsvFilesRequest,
    responseSerialize: serialize_rover_files_v1_ListCsvFilesResponse,
    responseDeserialize: deserialize_rover_files_v1_ListCsvFilesResponse,
  },
  getCsvFile: {
    path: '/rover.files.v1.Files/GetCsvFile',
    requestStream: false,
    responseStream: false,
    requestType: files_v1_files_pb.GetCsvFileRequest,
    responseType: files_v1_files_pb.GetCsvFileResponse,
    requestSerialize: serialize_rover_files_v1_GetCsvFileRequest,
    requestDeserialize: deserialize_rover_files_v1_GetCsvFileRequest,
    responseSerialize: serialize_rover_files_v1_GetCsvFileResponse,
    responseDeserialize: deserialize_rover_files_v1_GetCsvFileResponse,
  },
  deleteCsvFile: {
    path: '/rover.files.v1.Files/DeleteCsvFile',
    requestStream: false,
    responseStream: false,
    requestType: files_v1_files_pb.DeleteCsvFileRequest,
    responseType: files_v1_files_pb.DeleteCsvFileResponse,
    requestSerialize: serialize_rover_files_v1_DeleteCsvFileRequest,
    requestDeserialize: deserialize_rover_files_v1_DeleteCsvFileRequest,
    responseSerialize: serialize_rover_files_v1_DeleteCsvFileResponse,
    responseDeserialize: deserialize_rover_files_v1_DeleteCsvFileResponse,
  },
  uploadCsvFile: {
    path: '/rover.files.v1.Files/UploadCsvFile',
    requestStream: true,
    responseStream: false,
    requestType: files_v1_files_pb.UploadCsvFileRequest,
    responseType: files_v1_files_pb.UploadCsvFileResponse,
    requestSerialize: serialize_rover_files_v1_UploadCsvFileRequest,
    requestDeserialize: deserialize_rover_files_v1_UploadCsvFileRequest,
    responseSerialize: serialize_rover_files_v1_UploadCsvFileResponse,
    responseDeserialize: deserialize_rover_files_v1_UploadCsvFileResponse,
  },
};

exports.FilesClient = grpc.makeGenericClientConstructor(FilesService);
