# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: segment/v1/segment.proto

require 'google/protobuf'

require 'google/protobuf/timestamp_pb'
require 'auth/v1/auth_pb'
Google::Protobuf::DescriptorPool.generated_pool.build do
  add_message "rover.segment.v1.StaticSegment" do
    optional :id, :int32, 1
    optional :account_id, :int32, 2
    optional :title, :string, 3
    optional :size, :int64, 4
    optional :updated_at, :message, 5, "google.protobuf.Timestamp"
    optional :created_at, :message, 6, "google.protobuf.Timestamp"
  end
  add_message "rover.segment.v1.ListStaticSegmentRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :account_id, :int32, 2
    optional :order_by, :string, 3
    optional :page_size, :int32, 4
    optional :page_token, :string, 5
  end
  add_message "rover.segment.v1.ListStaticSegmentResponse" do
    repeated :segments, :message, 1, "rover.segment.v1.StaticSegment"
    optional :next_page_token, :string, 2
  end
  add_message "rover.segment.v1.GetStaticSegmentRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :id, :int32, 2
  end
  add_message "rover.segment.v1.GetStaticSegmentReply" do
    optional :segment, :message, 1, "rover.segment.v1.StaticSegment"
  end
  add_message "rover.segment.v1.CreateStaticSegmentRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :account_id, :int32, 2
    optional :title, :string, 3
  end
  add_message "rover.segment.v1.CreateStaticSegmentReply" do
    optional :segment, :message, 1, "rover.segment.v1.StaticSegment"
  end
  add_message "rover.segment.v1.DeleteStaticSegmentRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :id, :int32, 2
  end
  add_message "rover.segment.v1.DeleteStaticSegmentReply" do
  end
  add_message "rover.segment.v1.UpdateStaticSegmentIdsReply" do
    optional :segment, :message, 1, "rover.segment.v1.StaticSegment"
  end
  add_message "rover.segment.v1.GetStaticSegmentPushIdsRequest" do
    optional :segment_id, :int32, 1
  end
  add_message "rover.segment.v1.PushId" do
    optional :id, :string, 1
    optional :type, :enum, 2, "rover.segment.v1.PushIdType"
  end
  add_enum "rover.segment.v1.PushIdType" do
    value :ROVER, 0
    value :ALIAS, 1
  end
end

module Rover
  module Segment
    module V1
      StaticSegment = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.StaticSegment").msgclass
      ListStaticSegmentRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.ListStaticSegmentRequest").msgclass
      ListStaticSegmentResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.ListStaticSegmentResponse").msgclass
      GetStaticSegmentRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.GetStaticSegmentRequest").msgclass
      GetStaticSegmentReply = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.GetStaticSegmentReply").msgclass
      CreateStaticSegmentRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.CreateStaticSegmentRequest").msgclass
      CreateStaticSegmentReply = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.CreateStaticSegmentReply").msgclass
      DeleteStaticSegmentRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.DeleteStaticSegmentRequest").msgclass
      DeleteStaticSegmentReply = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.DeleteStaticSegmentReply").msgclass
      UpdateStaticSegmentIdsReply = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.UpdateStaticSegmentIdsReply").msgclass
      GetStaticSegmentPushIdsRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.GetStaticSegmentPushIdsRequest").msgclass
      PushId = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.PushId").msgclass
      PushIdType = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.segment.v1.PushIdType").enummodule
    end
  end
end
