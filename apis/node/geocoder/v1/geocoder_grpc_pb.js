// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var geocoder_v1_geocoder_pb = require('../../geocoder/v1/geocoder_pb.js');

function serialize_rover_geocoder_v1_ReverseGeocodeRequest(arg) {
  if (!(arg instanceof geocoder_v1_geocoder_pb.ReverseGeocodeRequest)) {
    throw new Error('Expected argument of type rover.geocoder.v1.ReverseGeocodeRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_geocoder_v1_ReverseGeocodeRequest(buffer_arg) {
  return geocoder_v1_geocoder_pb.ReverseGeocodeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_geocoder_v1_ReverseGeocodeResponse(arg) {
  if (!(arg instanceof geocoder_v1_geocoder_pb.ReverseGeocodeResponse)) {
    throw new Error('Expected argument of type rover.geocoder.v1.ReverseGeocodeResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_geocoder_v1_ReverseGeocodeResponse(buffer_arg) {
  return geocoder_v1_geocoder_pb.ReverseGeocodeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var GeocoderService = exports.GeocoderService = {
  reverseGeocode: {
    path: '/rover.geocoder.v1.Geocoder/ReverseGeocode',
    requestStream: false,
    responseStream: false,
    requestType: geocoder_v1_geocoder_pb.ReverseGeocodeRequest,
    responseType: geocoder_v1_geocoder_pb.ReverseGeocodeResponse,
    requestSerialize: serialize_rover_geocoder_v1_ReverseGeocodeRequest,
    requestDeserialize: deserialize_rover_geocoder_v1_ReverseGeocodeRequest,
    responseSerialize: serialize_rover_geocoder_v1_ReverseGeocodeResponse,
    responseDeserialize: deserialize_rover_geocoder_v1_ReverseGeocodeResponse,
  },
};

exports.GeocoderClient = grpc.makeGenericClientConstructor(GeocoderService);
