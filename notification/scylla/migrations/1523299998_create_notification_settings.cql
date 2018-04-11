CREATE TABLE IF NOT EXISTS notification_settings (
  campaign_id int PRIMARY KEY,
  account_id int,

  experience_id text,

  attachment_url text,
  attachment_type text,

  tap_behavior_type text,

  tap_behavior_presentation_type text,
  tap_behavior_url text,

  ios_content_available boolean,
  ios_mutable_content boolean,
  ios_sound text,
  ios_category_identifier text,
  ios_thread_identifier text,

  android_channel_id text,
  android_sound text,
  android_tag text,

  expiration int,

  attributes map<text,text>,

  alert_option_push_notification boolean,
  alert_option_notification_center boolean,
  alert_option_badge_number boolean
);