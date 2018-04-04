-- +goose Up
--

alter table campaigns
  alter campaign_type set default 'UNKNOWN'
, alter campaign_type type text
    using case campaign_type
      when '1' then 'SCHEDULED_NOTIFICATION'
      when '2' then 'AUTOMATED_NOTIFICATION'
    end
, alter campaign_status set default 'DRAFT'
, alter campaign_status type text
    using case campaign_status
      when '1' then 'DRAFT'
      when '2' then 'PUBLISHED'
      when '3' then 'ARCHIVED'
    end
, alter segment_condition set default 'ALL'
, alter segment_condition type text
    using case segment_condition
      when '0' then 'ANY'
      when '1' then 'ALL'
    end
, alter notification_attachment_type set default 'UNKNOWN'
, alter notification_attachment_type type text
    using case notification_attachment_type
      when '1' then 'IMAGE'
      when '2' then 'AUDIO'
      when '3' then 'VIDEO'
    end
, alter notification_tap_behavior_type set default 'OPEN_EXPERIENCE'
, alter notification_tap_behavior_type type text
    using case notification_tap_behavior_type
      when '0' then 'OPEN_EXPERIENCE'
      when '1' then 'OPEN_APP'
      when '2' then 'OPEN_DEEP_LINK'
      when '3' then 'OPEN_WEBSITE'
    end
, alter notification_tap_behavior_presentation_type set default 'UNKNOWN'
, alter notification_tap_behavior_presentation_type type text
    using case notification_tap_behavior_presentation_type
      when '1' then 'IN_APP'
      when '2' then 'IN_BROWSER'
    end
, alter scheduled_type set default 'NOW'
, alter scheduled_type type text
    using case scheduled_type
      when '0' then 'NOW'
      when '1' then 'SCHEDULED'
    end
, alter scheduled_delivery_status set default 'UNKNOWN'
, alter scheduled_delivery_status type text
    using case scheduled_delivery_status
      when '1' then 'SCHEDULED'
      when '2' then 'INPROGRESS'
      when '3' then 'FINISHED'
    end
;

-- +goose Down
--

alter table campaigns
  alter campaign_type drop default
, alter campaign_type set default 0
, alter campaign_type type integer
    using (case campaign_type
      when 'SCHEDULED_NOTIFICATION' then 1
      when 'AUTOMATED_NOTIFICATION' then 2
      else 0
    end)::integer

, alter campaign_status drop default
, alter campaign_status set default 1::integer
, alter campaign_status type integer
    using case campaign_status
      when 'DRAFT'      then 1
      when 'PUBLISHED'  then 2
      when 'ARCHIVED'   then 3
    end
, alter segment_condition drop default
, alter segment_condition set default 1
, alter segment_condition type integer
    using case segment_condition
      when 'ANY'  then 0
      when 'ALL'  then 1
    end
, alter notification_attachment_type drop default
, alter notification_attachment_type set default 0
, alter notification_attachment_type type integer
    using case notification_attachment_type
      when 'IMAGE' then 1
      when 'AUDIO' then 2
      when 'VIDEO' then 3
    end
, alter notification_tap_behavior_type drop default
, alter notification_tap_behavior_type set default 0
, alter notification_tap_behavior_type type integer
    using case notification_tap_behavior_type
      when 'OPEN_EXPERIENCE' then 0
      when 'OPEN_APP'        then 1
      when 'OPEN_DEEP_LINK'  then 2
      when 'OPEN_WEBSITE'    then 3
    end
, alter notification_tap_behavior_presentation_type drop default
, alter notification_tap_behavior_presentation_type set default 0
, alter notification_tap_behavior_presentation_type type integer
    using case notification_tap_behavior_presentation_type
      when 'IN_APP'      then 1
      when 'IN_BROWSER'  then 2
    end
, alter scheduled_type drop default
, alter scheduled_type set default 0
, alter scheduled_type type integer
    using case scheduled_type
      when 'NOW'        then 0
      when 'SCHEDULED'  then 1
    end
, alter scheduled_delivery_status drop default
, alter scheduled_delivery_status set default 0
, alter scheduled_delivery_status type integer
    using case scheduled_delivery_status
      when 'SCHEDULED'  then 1
      when 'INPROGRESS' then 2
      when 'FINISHED'   then 3
    end
;
