// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var analytics_analytics_pb = require('../analytics/analytics_pb.js');
var auth_v1_auth_pb = require('../auth/v1/auth_pb.js');

function serialize_rover_analytics_GetNotificationOpenedByDateReportRequest(arg) {
  if (!(arg instanceof analytics_analytics_pb.GetNotificationOpenedByDateReportRequest)) {
    throw new Error('Expected argument of type rover.analytics.GetNotificationOpenedByDateReportRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_analytics_GetNotificationOpenedByDateReportRequest(buffer_arg) {
  return analytics_analytics_pb.GetNotificationOpenedByDateReportRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_analytics_GetNotificationOpenedByDateReportResponse(arg) {
  if (!(arg instanceof analytics_analytics_pb.GetNotificationOpenedByDateReportResponse)) {
    throw new Error('Expected argument of type rover.analytics.GetNotificationOpenedByDateReportResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_analytics_GetNotificationOpenedByDateReportResponse(buffer_arg) {
  return analytics_analytics_pb.GetNotificationOpenedByDateReportResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_analytics_GetNotificationOpenedReportRequest(arg) {
  if (!(arg instanceof analytics_analytics_pb.GetNotificationOpenedReportRequest)) {
    throw new Error('Expected argument of type rover.analytics.GetNotificationOpenedReportRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_analytics_GetNotificationOpenedReportRequest(buffer_arg) {
  return analytics_analytics_pb.GetNotificationOpenedReportRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_analytics_GetNotificationOpenedReportResponse(arg) {
  if (!(arg instanceof analytics_analytics_pb.GetNotificationOpenedReportResponse)) {
    throw new Error('Expected argument of type rover.analytics.GetNotificationOpenedReportResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_analytics_GetNotificationOpenedReportResponse(buffer_arg) {
  return analytics_analytics_pb.GetNotificationOpenedReportResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_analytics_GetNotificationSentReportRequest(arg) {
  if (!(arg instanceof analytics_analytics_pb.GetNotificationSentReportRequest)) {
    throw new Error('Expected argument of type rover.analytics.GetNotificationSentReportRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_analytics_GetNotificationSentReportRequest(buffer_arg) {
  return analytics_analytics_pb.GetNotificationSentReportRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_analytics_GetNotificationSentReportResponse(arg) {
  if (!(arg instanceof analytics_analytics_pb.GetNotificationSentReportResponse)) {
    throw new Error('Expected argument of type rover.analytics.GetNotificationSentReportResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_analytics_GetNotificationSentReportResponse(buffer_arg) {
  return analytics_analytics_pb.GetNotificationSentReportResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var AnalyticsService = exports.AnalyticsService = {
  // Notification Open Reports
  getNotificationOpenedReport: {
    path: '/rover.analytics.Analytics/GetNotificationOpenedReport',
    requestStream: false,
    responseStream: false,
    requestType: analytics_analytics_pb.GetNotificationOpenedReportRequest,
    responseType: analytics_analytics_pb.GetNotificationOpenedReportResponse,
    requestSerialize: serialize_rover_analytics_GetNotificationOpenedReportRequest,
    requestDeserialize: deserialize_rover_analytics_GetNotificationOpenedReportRequest,
    responseSerialize: serialize_rover_analytics_GetNotificationOpenedReportResponse,
    responseDeserialize: deserialize_rover_analytics_GetNotificationOpenedReportResponse,
  },
  getNotificationOpenedByDateReport: {
    path: '/rover.analytics.Analytics/GetNotificationOpenedByDateReport',
    requestStream: false,
    responseStream: false,
    requestType: analytics_analytics_pb.GetNotificationOpenedByDateReportRequest,
    responseType: analytics_analytics_pb.GetNotificationOpenedByDateReportResponse,
    requestSerialize: serialize_rover_analytics_GetNotificationOpenedByDateReportRequest,
    requestDeserialize: deserialize_rover_analytics_GetNotificationOpenedByDateReportRequest,
    responseSerialize: serialize_rover_analytics_GetNotificationOpenedByDateReportResponse,
    responseDeserialize: deserialize_rover_analytics_GetNotificationOpenedByDateReportResponse,
  },
  // Notification Sent Reports
  getNotificationSentReport: {
    path: '/rover.analytics.Analytics/GetNotificationSentReport',
    requestStream: false,
    responseStream: false,
    requestType: analytics_analytics_pb.GetNotificationSentReportRequest,
    responseType: analytics_analytics_pb.GetNotificationSentReportResponse,
    requestSerialize: serialize_rover_analytics_GetNotificationSentReportRequest,
    requestDeserialize: deserialize_rover_analytics_GetNotificationSentReportRequest,
    responseSerialize: serialize_rover_analytics_GetNotificationSentReportResponse,
    responseDeserialize: deserialize_rover_analytics_GetNotificationSentReportResponse,
  },
};

exports.AnalyticsClient = grpc.makeGenericClientConstructor(AnalyticsService);
