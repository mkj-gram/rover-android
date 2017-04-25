# Generated by the protocol buffer compiler.  DO NOT EDIT!
# Source: segment/v1/segment.proto for package 'rover.segment.v1'

require 'grpc'
require 'rover/segment/v1/segment_pb'

module Rover
  module Segment
    module V1
      module Segment
        class Service

          include GRPC::GenericService

          self.marshal_class_method = :encode
          self.unmarshal_class_method = :decode
          self.service_name = 'rover.segment.v1.Segment'

          rpc :ListStaticSegments, ListStaticSegmentRequest, ListStaticSegmentResponse
          rpc :GetStaticSegment, GetStaticSegmentRequest, GetStaticSegmentReply
          rpc :CreateStaticSegment, CreateStaticSegmentRequest, CreateStaticSegmentReply
          rpc :DestroyStaticSegment, DestroyStaticSegmentRequest, DestroyStaticSegmentReply
          rpc :UpdateStaticSegmentPushIds, stream(PushId), UpdateStaticSegmentIdsReply
          rpc :GetStaticSegmentPushIds, GetStaticSegmentPushIdsRequest, stream(PushId)
        end

        Stub = Service.rpc_stub_class
      end
    end
  end
end
