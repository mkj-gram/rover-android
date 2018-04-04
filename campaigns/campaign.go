package campaigns

import "time"

type RateLimit struct {
	Frequency     int32  `json:"frequency"`
	WithinSeconds int32  `json:"within_seconds"`
	Limit         int32  `json:"limit"`
	Period        string `json:"period"`
}

type UpdateScheduledDeliverySettingsRequest struct {
	AccountId  int32 `db:"account_id"`
	CampaignId int32 `db:"campaign_id"`

	SegmentCondition string   `db:"segment_condition"`
	SegmentIds       []string `db:"-"`

	UiState string `db:"ui_state"`

	ScheduleDetails
}

type UpdateAutomatedDeliverySettingsRequest struct {
	AccountId  int32 `db:"account_id"`
	CampaignId int32 `db:"campaign_id"`

	SegmentCondition string   `db:"segment_condition"`
	SegmentIds       []string `db:"-"`

	UiState string `db:"ui_state"`

	AutomationDetails
}

type UpdateNotificationSettingsRequest struct {
	AccountId  int32 `db:"account_id"`
	CampaignId int32 `db:"campaign_id"`

	ExperienceId string `db:"experience_id"`

	UiState string `db:"ui_state"`

	NotificationDetails
}

type Campaign struct {
	AccountId int32 `db:"account_id"`

	CreatedAt time.Time `db:"created_at"`
	UpdatedAt time.Time `db:"updated_at"`

	CampaignId int32 `db:"id"`

	Name string `db:"name"`

	CampaignStatus string `db:"campaign_status"`
	CampaignType   string `db:"campaign_type"`

	ExperienceId string `db:"experience_id"`

	UiState string `db:"ui_state"`

	SegmentCondition string   `db:"segment_condition"`
	SegmentIds       []string `db:"-"`

	AutomationDetails
	NotificationDetails

	ScheduleDetails
	ScheduledDeliveryStatus string `db:"scheduled_delivery_status"`
}

type NotificationDetails struct {
	NotificationBody  string `db:"notification_body"`
	NotificationTitle string `db:"notification_title"`

	NotificationAttachmentUrl  string `db:"notification_attachment_url"`
	NotificationAttachmentType string `db:"notification_attachment_type"`

	NotificationTapBehaviorType             string `db:"notification_tap_behavior_type"`
	NotificationTapBehaviorPresentationType string `db:"notification_tap_behavior_presentation_type"`
	NotificationTapBehaviorUrl              string `db:"notification_tap_behavior_url"`

	NotificationIosContentAvailable   bool   `db:"notification_ios_content_available"`
	NotificationIosMutableContent     bool   `db:"notification_ios_mutable_content"`
	NotificationIosSound              string `db:"notification_ios_sound"`
	NotificationIosCategoryIdentifier string `db:"notification_ios_category_identifier"`
	NotificationIosThreadIdentifier   string `db:"notification_ios_thread_identifier"`

	NotificationAndroidChannelId string `db:"notification_android_channel_id"`
	NotificationAndroidSound     string `db:"notification_android_sound"`
	NotificationAndroidTag       string `db:"notification_android_tag"`

	NotificationExpiration int32 `db:"notification_expiration"`

	NotificationAttributes string `db:"notification_attributes"`

	NotificationAlertOptionPushNotification   bool `db:"notification_alert_option_push_notification"`
	NotificationAlertOptionNotificationCenter bool `db:"notification_alert_option_notification_center"`
	NotificationAlertOptionBadgeNumber        bool `db:"notification_alert_option_badge_number"`
}

type ScheduleDetails struct {
	ScheduledType               string     `db:"scheduled_type"`
	ScheduledTimestamp          *time.Time `db:"scheduled_timestamp"`
	ScheduledTimeZone           string     `db:"scheduled_time_zone"`
	ScheduledUseLocalDeviceTime bool       `db:"scheduled_use_local_device_time"`
}

type AutomationDetails struct {
	AutomatedMonday    bool `db:"automated_monday"`
	AutomatedTuesday   bool `db:"automated_tuesday"`
	AutomatedWednesday bool `db:"automated_wednesday"`
	AutomatedThursday  bool `db:"automated_thursday"`
	AutomatedFriday    bool `db:"automated_friday"`
	AutomatedSaturday  bool `db:"automated_saturday"`
	AutomatedSunday    bool `db:"automated_sunday"`

	AutomatedStartDate          string `db:"automated_start_date"`
	AutomatedEndDate            string `db:"automated_end_date"`
	AutomatedStartTime          int32  `db:"automated_start_time"`
	AutomatedEndTime            int32  `db:"automated_end_time"`
	AutomatedTimeZone           string `db:"automated_time_zone"`
	AutomatedUseLocalDeviceTime bool   `db:"automated_use_local_device_time"`
	AutomatedEventName          string `db:"automated_event_name"`
	AutomatedEventPredicates    string `db:"automated_event_predicates"`

	AutomatedFrequencySingleUse bool   `db:"automated_frequency_single_use"`
	AutomatedFrequencyLimits    string `db:"automated_frequency_limits"`
}
