// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var notification_v1_notification_pb = require('../../notification/v1/notification_pb.js');
var auth_v1_auth_pb = require('../../auth/v1/auth_pb.js');
var protobuf_version_pb = require('../../protobuf/version_pb.js');
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');

function serialize_rover_notification_v1_CreateAndroidPlatformRequest(arg) {
  if (!(arg instanceof notification_v1_notification_pb.CreateAndroidPlatformRequest)) {
    throw new Error('Expected argument of type rover.notification.v1.CreateAndroidPlatformRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_CreateAndroidPlatformRequest(buffer_arg) {
  return notification_v1_notification_pb.CreateAndroidPlatformRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_CreateAndroidPlatformResponse(arg) {
  if (!(arg instanceof notification_v1_notification_pb.CreateAndroidPlatformResponse)) {
    throw new Error('Expected argument of type rover.notification.v1.CreateAndroidPlatformResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_CreateAndroidPlatformResponse(buffer_arg) {
  return notification_v1_notification_pb.CreateAndroidPlatformResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_CreateIosPlatformRequest(arg) {
  if (!(arg instanceof notification_v1_notification_pb.CreateIosPlatformRequest)) {
    throw new Error('Expected argument of type rover.notification.v1.CreateIosPlatformRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_CreateIosPlatformRequest(buffer_arg) {
  return notification_v1_notification_pb.CreateIosPlatformRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_CreateIosPlatformResponse(arg) {
  if (!(arg instanceof notification_v1_notification_pb.CreateIosPlatformResponse)) {
    throw new Error('Expected argument of type rover.notification.v1.CreateIosPlatformResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_CreateIosPlatformResponse(buffer_arg) {
  return notification_v1_notification_pb.CreateIosPlatformResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_DeleteNotificationRequest(arg) {
  if (!(arg instanceof notification_v1_notification_pb.DeleteNotificationRequest)) {
    throw new Error('Expected argument of type rover.notification.v1.DeleteNotificationRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_DeleteNotificationRequest(buffer_arg) {
  return notification_v1_notification_pb.DeleteNotificationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_DeleteNotificationResponse(arg) {
  if (!(arg instanceof notification_v1_notification_pb.DeleteNotificationResponse)) {
    throw new Error('Expected argument of type rover.notification.v1.DeleteNotificationResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_DeleteNotificationResponse(buffer_arg) {
  return notification_v1_notification_pb.DeleteNotificationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_GetAndroidPlatformRequest(arg) {
  if (!(arg instanceof notification_v1_notification_pb.GetAndroidPlatformRequest)) {
    throw new Error('Expected argument of type rover.notification.v1.GetAndroidPlatformRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_GetAndroidPlatformRequest(buffer_arg) {
  return notification_v1_notification_pb.GetAndroidPlatformRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_GetAndroidPlatformResponse(arg) {
  if (!(arg instanceof notification_v1_notification_pb.GetAndroidPlatformResponse)) {
    throw new Error('Expected argument of type rover.notification.v1.GetAndroidPlatformResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_GetAndroidPlatformResponse(buffer_arg) {
  return notification_v1_notification_pb.GetAndroidPlatformResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_GetIosPlatformRequest(arg) {
  if (!(arg instanceof notification_v1_notification_pb.GetIosPlatformRequest)) {
    throw new Error('Expected argument of type rover.notification.v1.GetIosPlatformRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_GetIosPlatformRequest(buffer_arg) {
  return notification_v1_notification_pb.GetIosPlatformRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_GetIosPlatformResponse(arg) {
  if (!(arg instanceof notification_v1_notification_pb.GetIosPlatformResponse)) {
    throw new Error('Expected argument of type rover.notification.v1.GetIosPlatformResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_GetIosPlatformResponse(buffer_arg) {
  return notification_v1_notification_pb.GetIosPlatformResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_GetNotificationRequest(arg) {
  if (!(arg instanceof notification_v1_notification_pb.GetNotificationRequest)) {
    throw new Error('Expected argument of type rover.notification.v1.GetNotificationRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_GetNotificationRequest(buffer_arg) {
  return notification_v1_notification_pb.GetNotificationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_GetNotificationResponse(arg) {
  if (!(arg instanceof notification_v1_notification_pb.GetNotificationResponse)) {
    throw new Error('Expected argument of type rover.notification.v1.GetNotificationResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_GetNotificationResponse(buffer_arg) {
  return notification_v1_notification_pb.GetNotificationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_ListNotificationsRequest(arg) {
  if (!(arg instanceof notification_v1_notification_pb.ListNotificationsRequest)) {
    throw new Error('Expected argument of type rover.notification.v1.ListNotificationsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_ListNotificationsRequest(buffer_arg) {
  return notification_v1_notification_pb.ListNotificationsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_ListNotificationsResponse(arg) {
  if (!(arg instanceof notification_v1_notification_pb.ListNotificationsResponse)) {
    throw new Error('Expected argument of type rover.notification.v1.ListNotificationsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_ListNotificationsResponse(buffer_arg) {
  return notification_v1_notification_pb.ListNotificationsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

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

function serialize_rover_notification_v1_UpdateAndroidPlatformPushCredentialsRequest(arg) {
  if (!(arg instanceof notification_v1_notification_pb.UpdateAndroidPlatformPushCredentialsRequest)) {
    throw new Error('Expected argument of type rover.notification.v1.UpdateAndroidPlatformPushCredentialsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_UpdateAndroidPlatformPushCredentialsRequest(buffer_arg) {
  return notification_v1_notification_pb.UpdateAndroidPlatformPushCredentialsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_UpdateAndroidPlatformPushCredentialsResponse(arg) {
  if (!(arg instanceof notification_v1_notification_pb.UpdateAndroidPlatformPushCredentialsResponse)) {
    throw new Error('Expected argument of type rover.notification.v1.UpdateAndroidPlatformPushCredentialsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_UpdateAndroidPlatformPushCredentialsResponse(buffer_arg) {
  return notification_v1_notification_pb.UpdateAndroidPlatformPushCredentialsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_UpdateIosPlatformPushCertificateRequest(arg) {
  if (!(arg instanceof notification_v1_notification_pb.UpdateIosPlatformPushCertificateRequest)) {
    throw new Error('Expected argument of type rover.notification.v1.UpdateIosPlatformPushCertificateRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_UpdateIosPlatformPushCertificateRequest(buffer_arg) {
  return notification_v1_notification_pb.UpdateIosPlatformPushCertificateRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_UpdateIosPlatformPushCertificateResponse(arg) {
  if (!(arg instanceof notification_v1_notification_pb.UpdateIosPlatformPushCertificateResponse)) {
    throw new Error('Expected argument of type rover.notification.v1.UpdateIosPlatformPushCertificateResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_UpdateIosPlatformPushCertificateResponse(buffer_arg) {
  return notification_v1_notification_pb.UpdateIosPlatformPushCertificateResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_UpdateNotificationReadStatusRequest(arg) {
  if (!(arg instanceof notification_v1_notification_pb.UpdateNotificationReadStatusRequest)) {
    throw new Error('Expected argument of type rover.notification.v1.UpdateNotificationReadStatusRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_UpdateNotificationReadStatusRequest(buffer_arg) {
  return notification_v1_notification_pb.UpdateNotificationReadStatusRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_rover_notification_v1_UpdateNotificationReadStatusResponse(arg) {
  if (!(arg instanceof notification_v1_notification_pb.UpdateNotificationReadStatusResponse)) {
    throw new Error('Expected argument of type rover.notification.v1.UpdateNotificationReadStatusResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_rover_notification_v1_UpdateNotificationReadStatusResponse(buffer_arg) {
  return notification_v1_notification_pb.UpdateNotificationReadStatusResponse.deserializeBinary(new Uint8Array(buffer_arg));
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
  // 
  listNotifications: {
    path: '/rover.notification.v1.Notification/ListNotifications',
    requestStream: false,
    responseStream: false,
    requestType: notification_v1_notification_pb.ListNotificationsRequest,
    responseType: notification_v1_notification_pb.ListNotificationsResponse,
    requestSerialize: serialize_rover_notification_v1_ListNotificationsRequest,
    requestDeserialize: deserialize_rover_notification_v1_ListNotificationsRequest,
    responseSerialize: serialize_rover_notification_v1_ListNotificationsResponse,
    responseDeserialize: deserialize_rover_notification_v1_ListNotificationsResponse,
  },
  getNotification: {
    path: '/rover.notification.v1.Notification/GetNotification',
    requestStream: false,
    responseStream: false,
    requestType: notification_v1_notification_pb.GetNotificationRequest,
    responseType: notification_v1_notification_pb.GetNotificationResponse,
    requestSerialize: serialize_rover_notification_v1_GetNotificationRequest,
    requestDeserialize: deserialize_rover_notification_v1_GetNotificationRequest,
    responseSerialize: serialize_rover_notification_v1_GetNotificationResponse,
    responseDeserialize: deserialize_rover_notification_v1_GetNotificationResponse,
  },
  updateNotificationReadStatus: {
    path: '/rover.notification.v1.Notification/UpdateNotificationReadStatus',
    requestStream: false,
    responseStream: false,
    requestType: notification_v1_notification_pb.UpdateNotificationReadStatusRequest,
    responseType: notification_v1_notification_pb.UpdateNotificationReadStatusResponse,
    requestSerialize: serialize_rover_notification_v1_UpdateNotificationReadStatusRequest,
    requestDeserialize: deserialize_rover_notification_v1_UpdateNotificationReadStatusRequest,
    responseSerialize: serialize_rover_notification_v1_UpdateNotificationReadStatusResponse,
    responseDeserialize: deserialize_rover_notification_v1_UpdateNotificationReadStatusResponse,
  },
  deleteNotification: {
    path: '/rover.notification.v1.Notification/DeleteNotification',
    requestStream: false,
    responseStream: false,
    requestType: notification_v1_notification_pb.DeleteNotificationRequest,
    responseType: notification_v1_notification_pb.DeleteNotificationResponse,
    requestSerialize: serialize_rover_notification_v1_DeleteNotificationRequest,
    requestDeserialize: deserialize_rover_notification_v1_DeleteNotificationRequest,
    responseSerialize: serialize_rover_notification_v1_DeleteNotificationResponse,
    responseDeserialize: deserialize_rover_notification_v1_DeleteNotificationResponse,
  },
  // Crud
  // rpc ListPlatforms(ListPlatformsRequest) returns (ListPlatformResponse);
  //
  // rpc ListIosPlatforms(ListIosPlatformsRequest) returns (ListIosPlatformsResponse);
  getIosPlatform: {
    path: '/rover.notification.v1.Notification/GetIosPlatform',
    requestStream: false,
    responseStream: false,
    requestType: notification_v1_notification_pb.GetIosPlatformRequest,
    responseType: notification_v1_notification_pb.GetIosPlatformResponse,
    requestSerialize: serialize_rover_notification_v1_GetIosPlatformRequest,
    requestDeserialize: deserialize_rover_notification_v1_GetIosPlatformRequest,
    responseSerialize: serialize_rover_notification_v1_GetIosPlatformResponse,
    responseDeserialize: deserialize_rover_notification_v1_GetIosPlatformResponse,
  },
  createIosPlatform: {
    path: '/rover.notification.v1.Notification/CreateIosPlatform',
    requestStream: false,
    responseStream: false,
    requestType: notification_v1_notification_pb.CreateIosPlatformRequest,
    responseType: notification_v1_notification_pb.CreateIosPlatformResponse,
    requestSerialize: serialize_rover_notification_v1_CreateIosPlatformRequest,
    requestDeserialize: deserialize_rover_notification_v1_CreateIosPlatformRequest,
    responseSerialize: serialize_rover_notification_v1_CreateIosPlatformResponse,
    responseDeserialize: deserialize_rover_notification_v1_CreateIosPlatformResponse,
  },
  updateIosPlatformPushCertificate: {
    path: '/rover.notification.v1.Notification/UpdateIosPlatformPushCertificate',
    requestStream: false,
    responseStream: false,
    requestType: notification_v1_notification_pb.UpdateIosPlatformPushCertificateRequest,
    responseType: notification_v1_notification_pb.UpdateIosPlatformPushCertificateResponse,
    requestSerialize: serialize_rover_notification_v1_UpdateIosPlatformPushCertificateRequest,
    requestDeserialize: deserialize_rover_notification_v1_UpdateIosPlatformPushCertificateRequest,
    responseSerialize: serialize_rover_notification_v1_UpdateIosPlatformPushCertificateResponse,
    responseDeserialize: deserialize_rover_notification_v1_UpdateIosPlatformPushCertificateResponse,
  },
  // rpc ListAndroidPlatform(ListAndroidPlatformRequest) returns(ListAndroidPlatformResponse);
  createAndroidPlatform: {
    path: '/rover.notification.v1.Notification/CreateAndroidPlatform',
    requestStream: false,
    responseStream: false,
    requestType: notification_v1_notification_pb.CreateAndroidPlatformRequest,
    responseType: notification_v1_notification_pb.CreateAndroidPlatformResponse,
    requestSerialize: serialize_rover_notification_v1_CreateAndroidPlatformRequest,
    requestDeserialize: deserialize_rover_notification_v1_CreateAndroidPlatformRequest,
    responseSerialize: serialize_rover_notification_v1_CreateAndroidPlatformResponse,
    responseDeserialize: deserialize_rover_notification_v1_CreateAndroidPlatformResponse,
  },
  getAndroidPlatform: {
    path: '/rover.notification.v1.Notification/GetAndroidPlatform',
    requestStream: false,
    responseStream: false,
    requestType: notification_v1_notification_pb.GetAndroidPlatformRequest,
    responseType: notification_v1_notification_pb.GetAndroidPlatformResponse,
    requestSerialize: serialize_rover_notification_v1_GetAndroidPlatformRequest,
    requestDeserialize: deserialize_rover_notification_v1_GetAndroidPlatformRequest,
    responseSerialize: serialize_rover_notification_v1_GetAndroidPlatformResponse,
    responseDeserialize: deserialize_rover_notification_v1_GetAndroidPlatformResponse,
  },
  updateAndroidPlatformPushCredentials: {
    path: '/rover.notification.v1.Notification/UpdateAndroidPlatformPushCredentials',
    requestStream: false,
    responseStream: false,
    requestType: notification_v1_notification_pb.UpdateAndroidPlatformPushCredentialsRequest,
    responseType: notification_v1_notification_pb.UpdateAndroidPlatformPushCredentialsResponse,
    requestSerialize: serialize_rover_notification_v1_UpdateAndroidPlatformPushCredentialsRequest,
    requestDeserialize: deserialize_rover_notification_v1_UpdateAndroidPlatformPushCredentialsRequest,
    responseSerialize: serialize_rover_notification_v1_UpdateAndroidPlatformPushCredentialsResponse,
    responseDeserialize: deserialize_rover_notification_v1_UpdateAndroidPlatformPushCredentialsResponse,
  },
};

exports.NotificationClient = grpc.makeGenericClientConstructor(NotificationService);
