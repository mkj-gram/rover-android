# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: protobuf/version.proto

require 'google/protobuf'

Google::Protobuf::DescriptorPool.generated_pool.build do
  add_message "rover.protobuf.Version" do
    optional :major, :int32, 1
    optional :minor, :int32, 2
    optional :revision, :int32, 3
  end
end

module Rover
  module Protobuf
    Version = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.protobuf.Version").msgclass
  end
end
