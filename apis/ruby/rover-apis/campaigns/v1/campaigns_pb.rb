# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: campaigns/v1/campaigns.proto

require 'google/protobuf'

require 'auth/v1/auth_pb'
require 'protobuf/predicates_pb'
require 'protobuf/wrappers_pb'
require 'google/protobuf/timestamp_pb'
Google::Protobuf::DescriptorPool.generated_pool.build do
  add_message "rover.campaigns.v1.CampaignType" do
  end
  add_enum "rover.campaigns.v1.CampaignType.Enum" do
    value :UNKNOWN, 0
    value :SCHEDULED_NOTIFICATION, 1
    value :AUTOMATED_NOTIFICATION, 2
  end
  add_message "rover.campaigns.v1.CampaignStatus" do
  end
  add_enum "rover.campaigns.v1.CampaignStatus.Enum" do
    value :UNKNOWN, 0
    value :DRAFT, 1
    value :PUBLISHED, 2
    value :ARCHIVED, 3
  end
  add_message "rover.campaigns.v1.SegmentCondition" do
  end
  add_enum "rover.campaigns.v1.SegmentCondition.Enum" do
    value :ANY, 0
    value :ALL, 1
  end
  add_message "rover.campaigns.v1.NotificationTapBehaviorType" do
  end
  add_enum "rover.campaigns.v1.NotificationTapBehaviorType.Enum" do
    value :OPEN_EXPERIENCE, 0
    value :OPEN_APP, 1
    value :OPEN_DEEP_LINK, 2
    value :OPEN_WEBSITE, 3
  end
  add_message "rover.campaigns.v1.NotificationTapPresentationType" do
  end
  add_enum "rover.campaigns.v1.NotificationTapPresentationType.Enum" do
    value :UNKNOWN, 0
    value :IN_APP, 1
    value :IN_BROWSER, 2
  end
  add_message "rover.campaigns.v1.ScheduledType" do
  end
  add_enum "rover.campaigns.v1.ScheduledType.Enum" do
    value :NOW, 0
    value :SCHEDULED, 1
  end
  add_message "rover.campaigns.v1.ScheduledDeliveryStatus" do
  end
  add_enum "rover.campaigns.v1.ScheduledDeliveryStatus.Enum" do
    value :UNKNOWN, 0
    value :SCHEDULED, 1
    value :INPROGRESS, 2
    value :FINISHED, 3
  end
  add_message "rover.campaigns.v1.NotificationAttachmentType" do
  end
  add_enum "rover.campaigns.v1.NotificationAttachmentType.Enum" do
    value :UNKNOWN, 0
    value :IMAGE, 1
    value :AUDIO, 2
    value :VIDEO, 3
  end
  add_message "rover.campaigns.v1.RateLimit" do
    optional :limit, :int32, 1
    optional :interval_count, :int32, 2
    optional :interval_unit, :enum, 3, "rover.campaigns.v1.RateLimit.Unit"
  end
  add_enum "rover.campaigns.v1.RateLimit.Unit" do
    value :HOUR, 0
    value :DAY, 1
  end
  add_message "rover.campaigns.v1.Date" do
    optional :day, :int32, 1
    optional :month, :int32, 2
    optional :year, :int32, 3
  end
  add_message "rover.campaigns.v1.Campaign" do
    oneof :campaign do
      optional :scheduled_notification_campaign, :message, 1, "rover.campaigns.v1.ScheduledNotificationCampaign"
      optional :automated_notification_campaign, :message, 2, "rover.campaigns.v1.AutomatedNotificationCampaign"
    end
  end
  add_message "rover.campaigns.v1.CreateRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :name, :string, 2
    optional :campaign_type, :enum, 3, "rover.campaigns.v1.CampaignType.Enum"
  end
  add_message "rover.campaigns.v1.CreateResponse" do
    optional :campaign, :message, 1, "rover.campaigns.v1.Campaign"
  end
  add_message "rover.campaigns.v1.Cursor" do
    optional :orderBy, :message, 5, "rover.campaigns.v1.Cursor.OrderBy"
    oneof :take do
      optional :first, :int32, 1
      optional :last, :int32, 2
    end
    oneof :start do
      optional :after, :string, 3
      optional :before, :string, 4
    end
  end
  add_message "rover.campaigns.v1.Cursor.OrderBy" do
    optional :field, :enum, 1, "rover.campaigns.v1.Cursor.OrderBy.Field"
    optional :direction, :enum, 2, "rover.campaigns.v1.Cursor.OrderBy.Direction"
  end
  add_enum "rover.campaigns.v1.Cursor.OrderBy.Field" do
    value :ID, 0
    value :UPDATED_AT, 1
  end
  add_enum "rover.campaigns.v1.Cursor.OrderBy.Direction" do
    value :ASC, 0
    value :DESC, 1
  end
  add_message "rover.campaigns.v1.ListRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :campaign_type, :enum, 5, "rover.campaigns.v1.CampaignType.Enum"
    optional :campaign_status, :enum, 6, "rover.campaigns.v1.CampaignStatus.Enum"
    optional :keyword, :string, 7
    optional :page, :int32, 8
    optional :page_size, :int32, 9
    optional :cursor, :message, 10, "rover.campaigns.v1.Cursor"
  end
  add_message "rover.campaigns.v1.ListResponse" do
    repeated :campaigns, :message, 1, "rover.campaigns.v1.Campaign"
    optional :cursor, :message, 2, "rover.campaigns.v1.ListResponse.Cursor"
  end
  add_message "rover.campaigns.v1.ListResponse.Cursor" do
    repeated :tokens, :string, 1
    optional :total_count, :int64, 2
  end
  add_message "rover.campaigns.v1.GetRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :campaign_id, :int32, 2
  end
  add_message "rover.campaigns.v1.GetResponse" do
    optional :campaign, :message, 1, "rover.campaigns.v1.Campaign"
  end
  add_message "rover.campaigns.v1.ArchiveRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :campaign_id, :int32, 5
  end
  add_message "rover.campaigns.v1.ArchiveResponse" do
  end
  add_message "rover.campaigns.v1.DuplicateRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :campaign_id, :int32, 5
    optional :name, :string, 6
  end
  add_message "rover.campaigns.v1.DuplicateResponse" do
    optional :campaign, :message, 1, "rover.campaigns.v1.Campaign"
  end
  add_message "rover.campaigns.v1.RenameRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :campaign_id, :int32, 5
    optional :name, :string, 6
  end
  add_message "rover.campaigns.v1.RenameResponse" do
  end
  add_message "rover.campaigns.v1.PublishRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :campaign_id, :int32, 5
  end
  add_message "rover.campaigns.v1.PublishResponse" do
  end
  add_message "rover.campaigns.v1.SendTestRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :campaign_id, :int32, 5
    repeated :device_ids, :string, 6
  end
  add_message "rover.campaigns.v1.SendTestResponse" do
  end
  add_message "rover.campaigns.v1.UpdateNotificationSettingsRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :campaign_id, :int32, 5
    optional :experience_id, :string, 6
    optional :ui_state, :string, 10
    optional :notification_body, :string, 11
    optional :notification_title, :string, 12
    optional :notification_attachment_url, :string, 13
    optional :notification_attachment_type, :enum, 14, "rover.campaigns.v1.NotificationAttachmentType.Enum"
    optional :notification_tap_behavior_type, :enum, 15, "rover.campaigns.v1.NotificationTapBehaviorType.Enum"
    optional :notification_tap_behavior_presentation_type, :enum, 16, "rover.campaigns.v1.NotificationTapPresentationType.Enum"
    optional :notification_tap_behavior_url, :string, 17
    optional :notification_ios_content_available, :bool, 18
    optional :notification_ios_mutable_content, :bool, 19
    optional :notification_ios_sound, :string, 20
    optional :notification_ios_category_identifier, :string, 21
    optional :notification_ios_thread_identifier, :string, 22
    optional :notification_android_channel_id, :string, 23
    optional :notification_android_sound, :string, 24
    optional :notification_android_tag, :string, 25
    optional :notification_expiration, :int32, 26
    map :notification_attributes, :string, :string, 27
    optional :notification_alert_option_push_notification, :bool, 28
    optional :notification_alert_option_notification_center, :bool, 29
    optional :notification_alert_option_badge_number, :bool, 30
  end
  add_message "rover.campaigns.v1.UpdateNotificationSettingsResponse" do
    optional :campaign, :message, 1, "rover.campaigns.v1.Campaign"
  end
  add_message "rover.campaigns.v1.UpdateScheduledDeliverySettingsRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :campaign_id, :int32, 5
    optional :ui_state, :string, 10
    optional :segment_condition, :enum, 11, "rover.campaigns.v1.SegmentCondition.Enum"
    repeated :segment_ids, :string, 12
    optional :scheduled_type, :enum, 13, "rover.campaigns.v1.ScheduledType.Enum"
    optional :scheduled_date, :message, 14, "rover.campaigns.v1.Date"
    optional :scheduled_time, :message, 15, "rover.protobuf.Int32Value"
    optional :scheduled_time_zone, :string, 16
    optional :scheduled_use_local_device_time, :bool, 17
  end
  add_message "rover.campaigns.v1.UpdateScheduledDeliverySettingsResponse" do
    optional :campaign, :message, 1, "rover.campaigns.v1.Campaign"
  end
  add_message "rover.campaigns.v1.UpdateAutomatedDeliverySettingsRequest" do
    optional :auth_context, :message, 1, "rover.auth.v1.AuthContext"
    optional :campaign_id, :int32, 5
    optional :ui_state, :string, 10
    optional :segment_condition, :enum, 11, "rover.campaigns.v1.SegmentCondition.Enum"
    repeated :segment_ids, :string, 12
    optional :automated_monday, :bool, 13
    optional :automated_tuesday, :bool, 14
    optional :automated_wednesday, :bool, 15
    optional :automated_thursday, :bool, 16
    optional :automated_friday, :bool, 17
    optional :automated_saturday, :bool, 18
    optional :automated_sunday, :bool, 19
    optional :automated_start_date, :string, 20
    optional :automated_end_date, :string, 21
    optional :automated_start_time, :int32, 22
    optional :automated_end_time, :int32, 23
    optional :automated_time_zone, :string, 24
    optional :automated_use_local_device_time, :bool, 25
    optional :automated_event_name, :string, 26
    optional :automated_frequency_single_use, :bool, 29
    optional :automated_event_predicates, :message, 30, "rover.protobuf.PredicateAggregate"
    repeated :automated_frequency_limits, :message, 31, "rover.campaigns.v1.RateLimit"
  end
  add_message "rover.campaigns.v1.UpdateAutomatedDeliverySettingsResponse" do
    optional :campaign, :message, 1, "rover.campaigns.v1.Campaign"
  end
  add_message "rover.campaigns.v1.ScheduledNotificationCampaign" do
    optional :campaign_id, :int32, 1
    optional :name, :string, 2
    optional :campaign_status, :enum, 3, "rover.campaigns.v1.CampaignStatus.Enum"
    optional :experience_id, :string, 4
    optional :created_at, :message, 8, "google.protobuf.Timestamp"
    optional :updated_at, :message, 9, "google.protobuf.Timestamp"
    optional :ui_state, :string, 10
    optional :segment_condition, :enum, 11, "rover.campaigns.v1.SegmentCondition.Enum"
    repeated :segment_ids, :string, 12
    optional :notification_body, :string, 20
    optional :notification_title, :string, 21
    optional :notification_attachment_url, :string, 22
    optional :notification_attachment_type, :enum, 23, "rover.campaigns.v1.NotificationAttachmentType.Enum"
    optional :notification_tap_behavior_type, :enum, 24, "rover.campaigns.v1.NotificationTapBehaviorType.Enum"
    optional :notification_tap_behavior_presentation_type, :enum, 25, "rover.campaigns.v1.NotificationTapPresentationType.Enum"
    optional :notification_tap_behavior_url, :string, 26
    optional :notification_ios_content_available, :bool, 27
    optional :notification_ios_mutable_content, :bool, 28
    optional :notification_ios_sound, :string, 29
    optional :notification_ios_category_identifier, :string, 30
    optional :notification_ios_thread_identifier, :string, 31
    optional :notification_android_channel_id, :string, 32
    optional :notification_android_sound, :string, 33
    optional :notification_android_tag, :string, 34
    optional :notification_expiration, :int32, 35
    map :notification_attributes, :string, :string, 36
    optional :notification_alert_option_push_notification, :bool, 37
    optional :notification_alert_option_notification_center, :bool, 38
    optional :notification_alert_option_badge_number, :bool, 39
    optional :scheduled_type, :enum, 40, "rover.campaigns.v1.ScheduledType.Enum"
    optional :scheduled_date, :message, 41, "rover.campaigns.v1.Date"
    optional :scheduled_time, :message, 42, "rover.protobuf.Int32Value"
    optional :scheduled_time_zone, :string, 43
    optional :scheduled_use_local_device_time, :bool, 44
    optional :scheduled_delivery_status, :enum, 45, "rover.campaigns.v1.ScheduledDeliveryStatus.Enum"
  end
  add_message "rover.campaigns.v1.AutomatedNotificationCampaign" do
    optional :campaign_id, :int32, 1
    optional :name, :string, 2
    optional :campaign_status, :enum, 3, "rover.campaigns.v1.CampaignStatus.Enum"
    optional :experience_id, :string, 4
    optional :created_at, :message, 8, "google.protobuf.Timestamp"
    optional :updated_at, :message, 9, "google.protobuf.Timestamp"
    optional :ui_state, :string, 10
    optional :segment_condition, :enum, 11, "rover.campaigns.v1.SegmentCondition.Enum"
    repeated :segment_ids, :string, 12
    optional :notification_body, :string, 20
    optional :notification_title, :string, 21
    optional :notification_attachment_url, :string, 22
    optional :notification_attachment_type, :enum, 23, "rover.campaigns.v1.NotificationAttachmentType.Enum"
    optional :notification_tap_behavior_type, :enum, 24, "rover.campaigns.v1.NotificationTapBehaviorType.Enum"
    optional :notification_tap_behavior_presentation_type, :enum, 25, "rover.campaigns.v1.NotificationTapPresentationType.Enum"
    optional :notification_tap_behavior_url, :string, 26
    optional :notification_ios_content_available, :bool, 27
    optional :notification_ios_mutable_content, :bool, 28
    optional :notification_ios_sound, :string, 29
    optional :notification_ios_category_identifier, :string, 30
    optional :notification_ios_thread_identifier, :string, 31
    optional :notification_android_channel_id, :string, 32
    optional :notification_android_sound, :string, 33
    optional :notification_android_tag, :string, 34
    optional :notification_expiration, :int32, 35
    map :notification_attributes, :string, :string, 36
    optional :notification_alert_option_push_notification, :bool, 37
    optional :notification_alert_option_notification_center, :bool, 38
    optional :notification_alert_option_badge_number, :bool, 39
    optional :automated_monday, :bool, 46
    optional :automated_tuesday, :bool, 47
    optional :automated_wednesday, :bool, 48
    optional :automated_thursday, :bool, 49
    optional :automated_friday, :bool, 50
    optional :automated_saturday, :bool, 51
    optional :automated_sunday, :bool, 52
    optional :automated_start_date, :string, 53
    optional :automated_end_date, :string, 54
    optional :automated_start_time, :int32, 55
    optional :automated_end_time, :int32, 56
    optional :automated_time_zone, :string, 57
    optional :automated_use_local_device_time, :bool, 58
    optional :automated_event_name, :string, 59
    optional :automated_event_predicates, :message, 60, "rover.protobuf.PredicateAggregate"
    optional :automated_frequency_single_use, :bool, 61
    repeated :automated_frequency_limits, :message, 62, "rover.campaigns.v1.RateLimit"
  end
end

module Rover
  module Campaigns
    module V1
      CampaignType = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.CampaignType").msgclass
      CampaignType::Enum = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.CampaignType.Enum").enummodule
      CampaignStatus = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.CampaignStatus").msgclass
      CampaignStatus::Enum = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.CampaignStatus.Enum").enummodule
      SegmentCondition = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.SegmentCondition").msgclass
      SegmentCondition::Enum = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.SegmentCondition.Enum").enummodule
      NotificationTapBehaviorType = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.NotificationTapBehaviorType").msgclass
      NotificationTapBehaviorType::Enum = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.NotificationTapBehaviorType.Enum").enummodule
      NotificationTapPresentationType = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.NotificationTapPresentationType").msgclass
      NotificationTapPresentationType::Enum = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.NotificationTapPresentationType.Enum").enummodule
      ScheduledType = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.ScheduledType").msgclass
      ScheduledType::Enum = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.ScheduledType.Enum").enummodule
      ScheduledDeliveryStatus = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.ScheduledDeliveryStatus").msgclass
      ScheduledDeliveryStatus::Enum = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.ScheduledDeliveryStatus.Enum").enummodule
      NotificationAttachmentType = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.NotificationAttachmentType").msgclass
      NotificationAttachmentType::Enum = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.NotificationAttachmentType.Enum").enummodule
      RateLimit = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.RateLimit").msgclass
      RateLimit::Unit = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.RateLimit.Unit").enummodule
      Date = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.Date").msgclass
      Campaign = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.Campaign").msgclass
      CreateRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.CreateRequest").msgclass
      CreateResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.CreateResponse").msgclass
      Cursor = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.Cursor").msgclass
      Cursor::OrderBy = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.Cursor.OrderBy").msgclass
      Cursor::OrderBy::Field = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.Cursor.OrderBy.Field").enummodule
      Cursor::OrderBy::Direction = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.Cursor.OrderBy.Direction").enummodule
      ListRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.ListRequest").msgclass
      ListResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.ListResponse").msgclass
      ListResponse::Cursor = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.ListResponse.Cursor").msgclass
      GetRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.GetRequest").msgclass
      GetResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.GetResponse").msgclass
      ArchiveRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.ArchiveRequest").msgclass
      ArchiveResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.ArchiveResponse").msgclass
      DuplicateRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.DuplicateRequest").msgclass
      DuplicateResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.DuplicateResponse").msgclass
      RenameRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.RenameRequest").msgclass
      RenameResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.RenameResponse").msgclass
      PublishRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.PublishRequest").msgclass
      PublishResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.PublishResponse").msgclass
      SendTestRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.SendTestRequest").msgclass
      SendTestResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.SendTestResponse").msgclass
      UpdateNotificationSettingsRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.UpdateNotificationSettingsRequest").msgclass
      UpdateNotificationSettingsResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.UpdateNotificationSettingsResponse").msgclass
      UpdateScheduledDeliverySettingsRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.UpdateScheduledDeliverySettingsRequest").msgclass
      UpdateScheduledDeliverySettingsResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.UpdateScheduledDeliverySettingsResponse").msgclass
      UpdateAutomatedDeliverySettingsRequest = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.UpdateAutomatedDeliverySettingsRequest").msgclass
      UpdateAutomatedDeliverySettingsResponse = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.UpdateAutomatedDeliverySettingsResponse").msgclass
      ScheduledNotificationCampaign = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.ScheduledNotificationCampaign").msgclass
      AutomatedNotificationCampaign = Google::Protobuf::DescriptorPool.generated_pool.lookup("rover.campaigns.v1.AutomatedNotificationCampaign").msgclass
    end
  end
end
