# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: pushy/v1/pushy.proto

require 'google/protobuf'

require 'common/v1/response_pb'
Google::Protobuf::DescriptorPool.generated_pool.build do
  add_message "pushy.v1.Device" do
    optional :id, :string, 1
    optional :token, :string, 2
    optional :account_id, :int32, 3
    optional :app_identifier, :string, 4
    optional :platform, :enum, 5, "pushy.v1.Device.Platform"
  end
  add_enum "pushy.v1.Device.Platform" do
    value :IOS, 0
    value :ANDROID, 1
  end
  add_message "pushy.v1.IosPlatform" do
    optional :id, :int32, 1
    optional :account_id, :int32, 2
    optional :bundle_id, :string, 3
    optional :certificate_password, :string, 4
    optional :certifcate, :string, 5
  end
  add_message "pushy.v1.AndroidPlatform" do
    optional :id, :int32, 1
    optional :account_id, :int32, 2
    optional :package_name, :string, 3
    optional :sender_id, :string, 4
    optional :messaging_token, :string, 5
    optional :api_key, :string, 6
  end
  add_message "pushy.v1.GetDeviceRequest" do
    optional :id, :string, 1
  end
  add_message "pushy.v1.GetDeviceResponse" do
    optional :device, :message, 1, "pushy.v1.Device"
  end
  add_message "pushy.v1.CreateDeviceRequest" do
    optional :device, :message, 1, "pushy.v1.Device"
  end
  add_message "pushy.v1.CreateDeviceResponse" do
    optional :result, :message, 1, "common.v1.OperationResult"
    optional :device, :message, 2, "pushy.v1.Device"
  end
  add_message "pushy.v1.DeleteDeviceRequest" do
    optional :id, :string, 1
  end
  add_message "pushy.v1.DeleteDeviceResponse" do
    optional :result, :message, 1, "common.v1.OperationResult"
  end
  add_message "pushy.v1.UpdateDeviceRequest" do
    optional :id, :string, 1
    optional :device, :message, 2, "pushy.v1.Device"
  end
  add_message "pushy.v1.UpdateDeviceResponse" do
    optional :result, :message, 1, "common.v1.OperationResult"
  end
  add_message "pushy.v1.GetIosPlatformRequest" do
    optional :id, :int32, 1
  end
  add_message "pushy.v1.GetIosPlatformResponse" do
    optional :result, :message, 1, "common.v1.OperationResult"
    optional :ios_platform, :message, 2, "pushy.v1.IosPlatform"
  end
  add_message "pushy.v1.CreateIosPlatformRequest" do
    optional :ios_platform, :message, 1, "pushy.v1.IosPlatform"
  end
  add_message "pushy.v1.CreateIosPlatformResponse" do
    optional :result, :message, 1, "common.v1.OperationResult"
    optional :ios_platform, :message, 2, "pushy.v1.IosPlatform"
  end
  add_message "pushy.v1.DeleteIosPlatformRequest" do
    optional :id, :int32, 1
  end
  add_message "pushy.v1.DeleteIosPlatformResponse" do
    optional :result, :message, 1, "common.v1.OperationResult"
  end
  add_message "pushy.v1.UpdateIosPlatformRequest" do
    optional :id, :int32, 1
    optional :platform, :message, 2, "pushy.v1.IosPlatform"
  end
  add_message "pushy.v1.UpdateIosPlatformResponse" do
    optional :result, :message, 1, "common.v1.OperationResult"
    optional :platform, :message, 2, "pushy.v1.IosPlatform"
  end
  add_message "pushy.v1.GetAndroidPlatformRequest" do
    optional :id, :int32, 1
  end
  add_message "pushy.v1.GetAndroidPlatformResponse" do
    optional :result, :message, 1, "common.v1.OperationResult"
    optional :platform, :message, 2, "pushy.v1.AndroidPlatform"
  end
  add_message "pushy.v1.CreateAndroidPlatformRequest" do
    optional :platform, :message, 1, "pushy.v1.AndroidPlatform"
  end
  add_message "pushy.v1.CreateAndroidPlatformResponse" do
    optional :result, :message, 1, "common.v1.OperationResult"
    optional :platform, :message, 2, "pushy.v1.AndroidPlatform"
  end
  add_message "pushy.v1.DeleteAndroidPlatformRequest" do
    optional :id, :int32, 1
  end
  add_message "pushy.v1.DeleteAndroidPlatformResponse" do
    optional :result, :message, 1, "common.v1.OperationResult"
  end
  add_message "pushy.v1.UpdateAndroidPlatformRequest" do
    optional :id, :int32, 1
    optional :platform, :message, 2, "pushy.v1.AndroidPlatform"
  end
  add_message "pushy.v1.UpdateAndroidPlatformResponse" do
    optional :result, :message, 1, "common.v1.OperationResult"
    optional :platform, :message, 2, "pushy.v1.AndroidPlatform"
  end
  add_message "pushy.v1.SendNotificationRequest" do
    optional :id, :string, 1
    optional :to, :string, 2
    optional :notification_text, :string, 3
    optional :title, :string, 4
    optional :sound, :string, 5
    optional :badge, :int32, 6
    optional :priority, :string, 7
    optional :collapse_key, :string, 8
    optional :payload, :string, 9
    optional :content_available, :bool, 10
    optional :mutable_content, :bool, 11
    optional :time_to_live, :int32, 12
  end
  add_message "pushy.v1.SendNotificationResponse" do
    optional :result, :message, 1, "common.v1.OperationResult"
  end
  add_message "pushy.v1.SendNotificationResult" do
    optional :result, :message, 1, "common.v1.OperationResult"
    repeated :success_ids, :string, 2
    repeated :failed_ids, :string, 3
  end
end

module Pushy
  module V1
    Device = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.Device").msgclass
    Device::Platform = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.Device.Platform").enummodule
    IosPlatform = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.IosPlatform").msgclass
    AndroidPlatform = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.AndroidPlatform").msgclass
    GetDeviceRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.GetDeviceRequest").msgclass
    GetDeviceResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.GetDeviceResponse").msgclass
    CreateDeviceRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.CreateDeviceRequest").msgclass
    CreateDeviceResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.CreateDeviceResponse").msgclass
    DeleteDeviceRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.DeleteDeviceRequest").msgclass
    DeleteDeviceResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.DeleteDeviceResponse").msgclass
    UpdateDeviceRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.UpdateDeviceRequest").msgclass
    UpdateDeviceResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.UpdateDeviceResponse").msgclass
    GetIosPlatformRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.GetIosPlatformRequest").msgclass
    GetIosPlatformResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.GetIosPlatformResponse").msgclass
    CreateIosPlatformRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.CreateIosPlatformRequest").msgclass
    CreateIosPlatformResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.CreateIosPlatformResponse").msgclass
    DeleteIosPlatformRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.DeleteIosPlatformRequest").msgclass
    DeleteIosPlatformResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.DeleteIosPlatformResponse").msgclass
    UpdateIosPlatformRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.UpdateIosPlatformRequest").msgclass
    UpdateIosPlatformResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.UpdateIosPlatformResponse").msgclass
    GetAndroidPlatformRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.GetAndroidPlatformRequest").msgclass
    GetAndroidPlatformResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.GetAndroidPlatformResponse").msgclass
    CreateAndroidPlatformRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.CreateAndroidPlatformRequest").msgclass
    CreateAndroidPlatformResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.CreateAndroidPlatformResponse").msgclass
    DeleteAndroidPlatformRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.DeleteAndroidPlatformRequest").msgclass
    DeleteAndroidPlatformResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.DeleteAndroidPlatformResponse").msgclass
    UpdateAndroidPlatformRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.UpdateAndroidPlatformRequest").msgclass
    UpdateAndroidPlatformResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.UpdateAndroidPlatformResponse").msgclass
    SendNotificationRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.SendNotificationRequest").msgclass
    SendNotificationResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.SendNotificationResponse").msgclass
    SendNotificationResult = Google::Protobuf::DescriptorPool.generated_pool.lookup("pushy.v1.SendNotificationResult").msgclass
  end
end
