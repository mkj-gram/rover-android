# Generated by the protocol buffer compiler.  DO NOT EDIT!
# Source: pushy/v1/pushy.proto for package 'pushy.v1'

require 'grpc'
require 'pushy/v1/pushy_pb'

module Pushy
  module V1
    module PushyService
      class Service

        include GRPC::GenericService

        self.marshal_class_method = :encode
        self.unmarshal_class_method = :decode
        self.service_name = 'pushy.v1.PushyService'

        # push
        rpc :SendNotification, SendNotificationRequest, SendNotificationResponse
        rpc :SendNotificationStream, stream(SendNotificationRequest), SendNotificationResult
        # Device rpc crud calls
        rpc :GetDevice, GetDeviceRequest, GetDeviceResponse
        rpc :CreateDevice, CreateDeviceRequest, CreateDeviceResponse
        rpc :DeleteDevice, DeleteDeviceRequest, DeleteDeviceResponse
        rpc :UpdateDevice, UpdateDeviceRequest, UpdateDeviceResponse
        # ios platform crud calls
        rpc :GetIosPlatform, GetIosPlatformRequest, GetIosPlatformResponse
        rpc :CreateIosPlatform, CreateIosPlatformRequest, CreateIosPlatformResponse
        rpc :DeleteIosPlatform, DeleteIosPlatformRequest, DeleteIosPlatformResponse
        rpc :UpdateIosPlatform, UpdateIosPlatformRequest, UpdateIosPlatformResponse
        # android platform crud calls
        rpc :GetAndroidPlatform, GetAndroidPlatformRequest, GetAndroidPlatformResponse
        rpc :CreateAndroidPlatform, CreateAndroidPlatformRequest, CreateAndroidPlatformResponse
        rpc :DeleteAndroidPlatform, DeleteAndroidPlatformRequest, DeleteAndroidPlatformResponse
        rpc :UpdateAndroidPlatform, UpdateAndroidPlatformRequest, UpdateAndroidPlatformResponse
      end

      Stub = Service.rpc_stub_class
    end
  end
end
