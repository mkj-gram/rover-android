// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var notification_v1_notification_pb = require('../../notification/v1/notification_pb.js');
var auth_v1_auth_pb = require('../../auth/v1/auth_pb.js');
var protobuf_version_pb = require('../../protobuf/version_pb.js');

function serialize_rover_notification_v1_SendCampaignNotificationRequest(arg) {
  if (!(arg instanceof notification_v1_notification_pb.SendCampaignNotificationRequest)) {
    throw new Error('Expected argument of type rover.notification.v1.SendCampaignNotificationRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_SendCampaignNotificationRequest(buffer_arg) {
  return notification_v1_notification_pb.SendCampaignNotificationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_SendCampaignNotificationResponse(arg) {
  if (!(arg instanceof notification_v1_notification_pb.SendCampaignNotificationResponse)) {
    throw new Error('Expected argument of type rover.notification.v1.SendCampaignNotificationResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_SendCampaignNotificationResponse(buffer_arg) {
  return notification_v1_notification_pb.SendCampaignNotificationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var NotificationService = exports.NotificationService = {
  sendCampaignNotification: {
    path: '/rover.notification.v1.Notification/SendCampaignNotification',
    requestStream: false,
    responseStream: false,
    requestType: notification_v1_notification_pb.SendCampaignNotificationRequest,
    responseType: notification_v1_notification_pb.SendCampaignNotificationResponse,
    requestSerialize: serialize_rover_notification_v1_SendCampaignNotificationRequest,
    requestDeserialize: deserialize_rover_notification_v1_SendCampaignNotificationRequest,
    responseSerialize: serialize_rover_notification_v1_SendCampaignNotificationResponse,
    responseDeserialize: deserialize_rover_notification_v1_SendCampaignNotificationResponse,
  },
};

exports.NotificationClient = grpc.makeGenericClientConstructor(NotificationService);
