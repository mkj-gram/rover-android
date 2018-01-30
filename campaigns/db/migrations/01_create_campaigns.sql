-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied


CREATE TABLE campaigns (
 id         SERIAL PRIMARY KEY
,account_id integer not null

,created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
,updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL

,name                                          TEXT NOT NULL

,campaign_type                                 integer NOT NULL
,campaign_status                               integer NOT NULL default 1 -- draft

,segment_condition                             integer    default 1
,segment_ids                                   text[]     default '{}'

,ui_state                                      text       default ''

,experience_id                                 text        default ''

,notification_body                             text       default ''
,notification_title                            text       default ''
,notification_attachment_url                   text       default ''
,notification_attachment_type                  integer     default 0
,notification_tap_behavior_type                integer     default 0
,notification_tap_behavior_url                 text        default ''
,notification_tap_behavior_presentation_type   integer     default 0
,notification_ios_content_available            boolean    default FALSE
,notification_ios_mutable_content              boolean    default FALSE
,notification_ios_sound                        text       default ''
,notification_ios_category_identifier          text       default ''
,notification_ios_thread_identifier            text       default ''
,notification_android_channel_id               text       default ''
,notification_android_sound                    text       default ''
,notification_android_tag                      text       default ''
,notification_expiration                       integer    default -1
,notification_attributes                       text       default ''


,notification_alert_option_push_notification   boolean    default true
,notification_alert_option_notification_center boolean    default false
,notification_alert_option_badge_number        boolean    default false


,scheduled_type                                integer    default 0
,scheduled_timestamp                           timestamp WITHOUT TIME ZONE default NULL
,scheduled_time_zone                           text       default ''
,scheduled_use_local_device_time               boolean    default false
,scheduled_delivery_status                     integer    default 0


,automated_monday                              boolean    default true
,automated_tuesday                             boolean    default true
,automated_wednesday                           boolean    default true
,automated_thursday                            boolean    default true
,automated_friday                              boolean    default true
,automated_saturday                            boolean    default true
,automated_sunday                              boolean    default true

,automated_start_date                          text       default ''
,automated_end_date                            text       default ''
,automated_start_time                          integer    default 0
,automated_end_time                            integer    default 0
,automated_time_zone                           text       default ''
,automated_use_local_device_time               boolean    default FALSE

,automated_event_name                          text       default ''
,automated_event_predicates                    text       default ''

,automated_frequency_single_use                boolean    default true
,automated_frequency_limits                    text       default ''

);

CREATE INDEX on campaigns (account_id);


-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
--

DROP TABLE campaigns
;
