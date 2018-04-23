# Generated by the protocol buffer compiler.  DO NOT EDIT!
# Source: notification/v1/notification.proto for package 'rover.notification.v1'

require 'grpc'
require 'notification/v1/notification_pb'

module Rover
  module Notification
    module V1
      module Notification
        class Service

          include GRPC::GenericService

          self.marshal_class_method = :encode
          self.unmarshal_class_method = :decode
          self.service_name = 'rover.notification.v1.Notification'

          rpc :SendCampaignNotification, SendCampaignNotificationRequest, SendCampaignNotificationResponse
          # 
          rpc :ListNotifications, ListNotificationsRequest, ListNotificationsResponse
          # Crud
          # rpc ListPlatforms(ListPlatformsRequest) returns (ListPlatformResponse);
          #
          # rpc ListIosPlatforms(ListIosPlatformsRequest) returns (ListIosPlatformsResponse);
          rpc :GetIosPlatform, GetIosPlatformRequest, GetIosPlatformResponse
          rpc :CreateIosPlatform, CreateIosPlatformRequest, CreateIosPlatformResponse
          rpc :UpdateIosPlatformPushCertificate, UpdateIosPlatformPushCertificateRequest, UpdateIosPlatformPushCertificateResponse
          # rpc ListAndroidPlatform(ListAndroidPlatformRequest) returns(ListAndroidPlatformResponse);
          rpc :CreateAndroidPlatform, CreateAndroidPlatformRequest, CreateAndroidPlatformResponse
          rpc :GetAndroidPlatform, GetAndroidPlatformRequest, GetAndroidPlatformResponse
          rpc :UpdateAndroidPlatformPushCredentials, UpdateAndroidPlatformPushCredentialsRequest, UpdateAndroidPlatformPushCredentialsResponse
        end

        Stub = Service.rpc_stub_class
      end
    end
  end
end
