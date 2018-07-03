package domain

import (
	"time"
)

// Notification Sent

type NotificationSentChannel string

const (
	NotificationSentChannel_NOTIFICATION_CENTER = "notification-center"
	NotificationSentChannel_PUSH                = "push"
)

type NotificationSentResult string

const (
	NotificationSentResult_DELIVERED   = "delivered"
	NotificationSentResult_UNREACHABLE = "unreachable"
	NotificationSentResult_INVALID     = "invalid"
)

type NotificationSentRecord struct {
	Timestamp  time.Time
	AccountID  int
	CampaignID int
	Channel    NotificationSentChannel
	Result     NotificationSentResult

	DeviceID string
}

func (record *NotificationSentRecord) IsValid() (bool, error) {
	if record.AccountID == 0 {
		return false, NewInvalidError("AccountID", "is required")
	}

	if record.CampaignID == 0 {
		return false, NewInvalidError("CampaignID", "is required")
	}

	if record.DeviceID == "" {
		return false, NewInvalidError("DeviceID", "is required")
	}

	return true, nil
}

// Notification Opens

type NotificationOpenSource string

const (
	NotificationOpenSource_PUSH                NotificationOpenSource = "push"
	NotificationOpenSource_NOTIFICATION_CENTER NotificationOpenSource = "notification-center"
)

type NotificationOpenSubSource string

const (
	NotificationOpenSubSource_NONE = ""
	// Push sub-source
	NotificationOpenSubSource_DIRECT     = "direct"
	NotificationOpenSubSource_INFLUENCED = "influenced"
)

type NotificationOpenedRecord struct {
	Timestamp  time.Time
	AccountID  int
	CampaignID int
	Source     NotificationOpenSource
	SubSource  NotificationOpenSubSource

	DeviceID string
}

func (record *NotificationOpenedRecord) IsValid() (bool, error) {
	if record.AccountID == 0 {
		return false, NewInvalidError("AccountID", "is required")
	}

	if record.CampaignID == 0 {
		return false, NewInvalidError("CampaignID", "is required")
	}

	if record.DeviceID == "" {
		return false, NewInvalidError("DeviceID", "is required")
	}

	if record.Source == NotificationOpenSource_NOTIFICATION_CENTER && record.SubSource != NotificationOpenSubSource_NONE {
		return false, NewInvalidError("SubSource", "must be NONE when Source is NOTIFICATION_CENTER")
	}

	return true, nil
}
