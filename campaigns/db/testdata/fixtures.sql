-- first 9999 campaigns ids are reserved for fixtures

INSERT INTO campaigns
 (id, account_id, campaign_status, campaign_type, name, created_at, updated_at)
VALUES
 (1, 1, 1, 2, 'c1', '2017-05-04T16:26:25.445494','2017-05-04T16:26:25.445494Z')
,(2, 1, 1, 2, 'c2', '2017-05-04T16:26:25.445494','2017-05-04T16:26:25.445494Z')
,(3, 1, 1, 1, 'c3', '2017-05-04T16:26:25.445494','2017-05-04T16:26:25.445494Z')

,(4, 2, 1, 2, 'c4', '2017-05-04T16:26:25.445494','2017-05-04T16:26:25.445494Z')
,(5, 2, 1, 1, 'c5', '2017-05-04T16:26:25.445494','2017-05-04T16:26:25.445494Z')
;



-- scheduled notification campaign
INSERT INTO campaigns
(
 id
,account_id

,created_at
,updated_at

,name

,campaign_type
,campaign_status

,segment_condition
,segment_ids
,ui_state
,experience_id

,notification_body
,notification_title
,notification_attachment_url
,notification_attachment_type
,notification_tap_behavior_type
,notification_tap_behavior_url
,notification_tap_behavior_presentation_type
,notification_ios_content_available
,notification_ios_mutable_content
,notification_ios_sound
,notification_ios_category_identifier
,notification_ios_thread_identifier
,notification_android_channel_id
,notification_android_sound
,notification_android_tag
,notification_expiration
,notification_attributes

,notification_alert_option_push_notification
,notification_alert_option_notification_center
,notification_alert_option_badge_number

,scheduled_type
,scheduled_timestamp
,scheduled_time_zone
,scheduled_use_local_device_time
,scheduled_delivery_status

)VALUES(
--  id         SERIAL PRIMARY KEY
1000
-- ,account_id integer not null
,2

-- ,created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
,'2017-05-04T16:26:25.445494'

-- ,updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
,'2017-05-04T16:26:25.445494'
-- ,name
,'c10'
--
-- ,campaign_type
,1
-- ,campaign_status                               aft
,1
-- ,segment_condition
, 1
-- ,segment_ids
,'{1, 2, 3}'
-- ,ui_state
,'{"progres_percentage": 90}'
-- ,experience_id
,'123455'
-- ,notification_body
,'notification body'
-- ,notification_title
,'notification title'
-- ,notification_attachment_url
,'http://example.com/id.png'
-- ,notification_attachment_type
,1
-- ,notification_tap_behavior_type
,1
-- ,notification_tap_behavior_url
,'http://rover.io/homepage'
-- ,notification_tap_behavior_presentation_type
,1
-- ,notification_ios_content_available
, true
-- ,notification_ios_mutable_content
, true
-- ,notification_ios_sound
, 'none'
-- ,notification_ios_category_identifier
, 'advertizing'
-- ,notification_ios_thread_identifier
, '12345'
-- ,notification_android_channel_id
, '12345'
-- ,notification_android_sound
, 'none'
-- ,notification_android_tag
, 'a tag'
-- ,notification_expiration
, 3600
-- ,notification_attributes
, '{"a": "b", "c": "d"}'
--
-- ,notification_alert_option_push_notification
, true
-- ,notification_alert_option_notification_center
, true
-- ,notification_alert_option_badge_number
, true
--
--
-- ,scheduled_type
, 1
-- ,scheduled_timestamp
, '2017-05-04T16:26:25.445494'
-- ,scheduled_time_zone
, 'America/Toronto'
-- ,scheduled_use_local_device_time
, true
-- ,scheduled_delivery_status
, 0
--
--
-- -- ,automated_monday
-- , true
-- -- ,automated_tuesday
-- , true
-- -- ,automated_wednesday
-- , true
-- -- ,automated_thursday
-- , true
-- -- ,automated_friday
-- , true
-- -- ,automated_saturday
-- , true
-- -- ,automated_sunday
-- , true

-- -- ,automated_start_date
-- , '2018-01-01'
-- -- ,automated_end_date
-- , '2019-01-01'
-- -- ,automated_start_time
-- , 3600
-- -- ,automated_end_time
-- , 7200
-- -- ,automated_time_zone
-- , 'America/Toronto'
-- -- ,automated_use_local_device_time
-- , false
--
-- -- ,automated_event_name
-- , 'an event'
-- -- ,automated_frequency_single_use
-- , false
-- -- ,automated_frequency_limits
-- , '{}'
)
;

--
--
-- automated notification campaign
--
--
INSERT INTO campaigns
(
 id
,account_id

,created_at
,updated_at

,name

,campaign_type
,campaign_status

,segment_condition
,segment_ids
,ui_state
,experience_id

,notification_body
,notification_title
,notification_attachment_url
,notification_attachment_type
,notification_tap_behavior_type
,notification_tap_behavior_url
,notification_tap_behavior_presentation_type
,notification_ios_content_available
,notification_ios_mutable_content
,notification_ios_sound
,notification_ios_category_identifier
,notification_ios_thread_identifier
,notification_android_channel_id
,notification_android_sound
,notification_android_tag
,notification_expiration
,notification_attributes

,notification_alert_option_push_notification
,notification_alert_option_notification_center
,notification_alert_option_badge_number

-- ,scheduled_type
-- ,scheduled_timestamp
-- ,scheduled_time_zone
-- ,scheduled_use_local_device_time
-- ,scheduled_delivery_status

,automated_monday
,automated_tuesday
,automated_wednesday
,automated_thursday
,automated_friday
,automated_saturday
,automated_sunday

,automated_start_date
,automated_end_date
,automated_start_time
,automated_end_time
,automated_time_zone
,automated_use_local_device_time

,automated_event_name
,automated_frequency_single_use
,automated_frequency_limits

)VALUES(
--  id         SERIAL PRIMARY KEY
1001
-- ,account_id integer not null
,2

-- ,created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
,'2017-05-04T16:26:25.445494'

-- ,updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
,'2017-05-04T16:26:25.445494'
-- ,name
,'c10'
--
-- ,campaign_type
,2
-- ,campaign_status
,1
-- ,segment_condition
,1
-- ,segment_ids
,'{1, 2, 3}'
-- ,ui_state
,'{"progres_percentage": 90}'
-- ,experience_id
,'123455'
-- ,notification_body
,'notification body'
-- ,notification_title
,'notification title'
-- ,notification_attachment_url
,'http://example.com/id.png'
-- ,notification_attachment_type
,1
-- ,notification_tap_behavior_type
,1
-- ,notification_tap_behavior_url
,'http://rover.io/homepage'
-- ,notification_tap_behavior_presentation_type
,1
-- ,notification_ios_content_available
, true
-- ,notification_ios_mutable_content
, true
-- ,notification_ios_sound
, 'none'
-- ,notification_ios_category_identifier
, 'advertizing'
-- ,notification_ios_thread_identifier
, '12345'
-- ,notification_android_channel_id
, '12345'
-- ,notification_android_sound
, 'none'
-- ,notification_android_tag
, 'a tag'
-- ,notification_expiration
, 3600
-- ,notification_attributes
, '{"a": "b", "c": "d"}'
--
-- ,notification_alert_option_push_notification
, true
-- ,notification_alert_option_notification_center
, true
-- ,notification_alert_option_badge_number
, true
--
--
-- -- ,scheduled_type
-- , 1
-- -- ,scheduled_timestamp
-- , 3600
-- -- ,scheduled_time_zone
-- , 'America/Toronto'
-- -- ,scheduled_use_local_device_time
-- , false
-- -- ,scheduled_delivery_status
-- , 0
-- --
--
-- ,automated_monday
, true
-- ,automated_tuesday
, true
-- ,automated_wednesday
, true
-- ,automated_thursday
, true
-- ,automated_friday
, true
-- ,automated_saturday
, true
-- ,automated_sunday
, true

-- ,automated_start_date
, '2018-01-01'
-- ,automated_end_date
, '2019-01-01'
-- ,automated_start_time
, 1
-- ,automated_end_time
, 2
-- ,automated_time_zone
, 'America/Toronto'
-- ,automated_use_local_device_time
, true

-- ,automated_event_name
, 'an event'
-- ,automated_frequency_single_use
, true
-- ,automated_frequency_limits
,
'[
{"limit": 1,"interval_count": 60, "interval_unit": 0},
{"limit": 10,"interval_count": 60, "interval_unit": 1}
]'
)
;
