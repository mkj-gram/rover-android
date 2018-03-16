# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: csv-processor/v1/csv-processor.proto

require 'google/protobuf'

require 'google/protobuf/timestamp_pb'
require 'auth/v1/auth_pb'
Google::Protobuf::DescriptorPool.generated_pool.build do
  add_message "rover.csv_processor.v1.GCSObject" do
    optional :project_id, :string, 1
    optional :bucket, :string, 2
    optional :file_id, :string, 3
  end
  add_message "rover.csv_processor.v1.LoadJob" do
    optional :id, :int32, 1
    optional :account_id, :int32, 2
    optional :type, :enum, 3, "rover.csv_processor.v1.JobType"
    optional :status, :enum, 4, "rover.csv_processor.v1.JobStatus"
    optional :progress, :int32, 5
    optional :created_at, :message, 6, "google.protobuf.Timestamp"
    optional :failed_reason, :string, 7
  end
  add_message "rover.csv_processor.v1.SegmentLoadJobConfig" do
    optional :account_id, :int32, 1
    optional :segment_id, :int32, 2
    optional :csv, :message, 3, "rover.csv_processor.v1.GCSObject"
  end
  add_message "rover.csv_processor.v1.SegmentLoadJobWithCsvFileConfig" do
    optional :account_id, :int32, 1
    optional :static_segment_id, :int32, 2
    optional :csv_file_id, :int32, 3
  end
  add_message "rover.csv_processor.v1.ProfileLoadJobConfig" do
    optional :account_id, :int32, 1
    optional :csv_file_id, :int32, 2
    repeated :schema, :message, 3, "rover.csv_processor.v1.ProfileLoadJobConfig.Schema"
  end
  add_message "rover.csv_processor.v1.ProfileLoadJobConfig.Schema" do
    optional :type, :string, 1
    optional :field, :string, 2
    optional :description, :string, 3
  end
  add_message "rover.csv_processor.v1.ProfileTagJobConfig" do
    optional :account_id, :int32, 1
    optional :csv_file_id, :int32, 2
    repeated :tags, :string, 3
  end
  add_message "rover.csv_processor.v1.GetLoadJobRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :load_job_id, :int32, 2
    optional :queue_version, :int32, 3
  end
  add_message "rover.csv_processor.v1.GetLoadJobReply" do
    optional :job, :message, 1, "rover.csv_processor.v1.LoadJob"
  end
  add_message "rover.csv_processor.v1.CreateLoadJobRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :type, :enum, 2, "rover.csv_processor.v1.JobType"
    oneof :job_config do
      optional :segment_load_job_config, :message, 3, "rover.csv_processor.v1.SegmentLoadJobConfig"
      optional :segment_load_job_with_csv_file_config, :message, 4, "rover.csv_processor.v1.SegmentLoadJobWithCsvFileConfig"
      optional :profile_load_job_config, :message, 5, "rover.csv_processor.v1.ProfileLoadJobConfig"
      optional :profile_tag_job_config, :message, 6, "rover.csv_processor.v1.ProfileTagJobConfig"
    end
  end
  add_message "rover.csv_processor.v1.CreateLoadJobReply" do
    optional :job, :message, 1, "rover.csv_processor.v1.LoadJob"
  end
  add_enum "rover.csv_processor.v1.JobType" do
    value :SEGMENT, 0
    value :SEGMENT_WITH_CSV_FILE, 1
    value :PROFILE_IMPORT, 2
    value :PROFILE_TAG, 3
  end
  add_enum "rover.csv_processor.v1.JobStatus" do
    value :UNKNOWN, 0
    value :ENQUEUED, 1
    value :PROCESSING, 2
    value :FAILED, 3
    value :COMPLETED, 4
  end
end

module Rover
  module CsvProcessor
    module V1
      GCSObject = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.GCSObject").msgclass
      LoadJob = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.LoadJob").msgclass
      SegmentLoadJobConfig = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.SegmentLoadJobConfig").msgclass
      SegmentLoadJobWithCsvFileConfig = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.SegmentLoadJobWithCsvFileConfig").msgclass
      ProfileLoadJobConfig = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.ProfileLoadJobConfig").msgclass
      ProfileLoadJobConfig::Schema = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.ProfileLoadJobConfig.Schema").msgclass
      ProfileTagJobConfig = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.ProfileTagJobConfig").msgclass
      GetLoadJobRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.GetLoadJobRequest").msgclass
      GetLoadJobReply = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.GetLoadJobReply").msgclass
      CreateLoadJobRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.CreateLoadJobRequest").msgclass
      CreateLoadJobReply = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.CreateLoadJobReply").msgclass
      JobType = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.JobType").enummodule
      JobStatus = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.csv_processor.v1.JobStatus").enummodule
    end
  end
end
