INSERT INTO notification_settings (campaign_id, account_id, attributes) VALUES(1,1, {'hello': '123'});

INSERT INTO notification_settings
  (campaign_id, account_id, attachment_type, tap_behavior_type, tap_behavior_presentation_type)
  VALUES (2,1, 'AUDIO', 'OPEN_EXPERIENCE', 'IN_BROWSER');