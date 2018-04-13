package scylla

import (
	"context"
	"fmt"

	"github.com/gocql/gocql"
	"github.com/pkg/errors"
	"github.com/scylladb/gocqlx"
	"github.com/scylladb/gocqlx/qb"
)

const tableName = "notification_settings"

type AttachmentType string

// isAttachmentType checks if the AttachmentType is a valid value
func isAttachmentType(val AttachmentType) bool {
	return val == AttachmentType_NONE ||
		val == AttachmentType_AUDIO ||
		val == AttachmentType_IMAGE ||
		val == AttachmentType_VIDEO
}

const (
	AttachmentType_NONE  AttachmentType = ""
	AttachmentType_IMAGE AttachmentType = "IMAGE"
	AttachmentType_AUDIO AttachmentType = "AUDIO"
	AttachmentType_VIDEO AttachmentType = "VIDEO"
)

type TapBehaviorType string

func isTapBehaviorType(val TapBehaviorType) bool {
	return val == TapBehaviorType_OPEN_EXPERIENCE ||
		val == TapBehaviorType_OPEN_APP ||
		val == TapBehaviorType_OPEN_DEEP_LINK ||
		val == TapBehaviorType_OPEN_WEBSITE
}

const (
	TapBehaviorType_OPEN_EXPERIENCE TapBehaviorType = "OPEN_EXPERIENCE"
	TapBehaviorType_OPEN_APP        TapBehaviorType = "OPEN_APP"
	TapBehaviorType_OPEN_DEEP_LINK  TapBehaviorType = "OPEN_DEEP_LINK"
	TapBehaviorType_OPEN_WEBSITE    TapBehaviorType = "OPEN_WEBSITE"
)

type TapBehaviorPresentationType string

func isTapBehaviorPresentationType(val TapBehaviorPresentationType) bool {
	return val == TapBehaviorPresentationType_UNKNOWN ||
		val == TapBehaviorPresentationType_IN_APP ||
		val == TapBehaviorPresentationType_IN_BROWSER
}

const (
	TapBehaviorPresentationType_UNKNOWN    TapBehaviorPresentationType = "UNKNOWN"
	TapBehaviorPresentationType_IN_APP     TapBehaviorPresentationType = "IN_APP"
	TapBehaviorPresentationType_IN_BROWSER TapBehaviorPresentationType = "IN_BROWSER"
)

type NotificationSettings struct {
	CampaignId int32 `db:"campaign_id"`
	AccountID  int32 `db:"account_id"`

	ExperienceId string `db:"experience_id"`

	AttachmentUrl  string         `db:"attachment_url"`
	AttachmentType AttachmentType `db:"attachment_type"`

	TapBehaviorType             TapBehaviorType             `db:"tap_behavior_type"`
	TapBehaviorPresentationType TapBehaviorPresentationType `db:"tap_behavior_presentation_type"`
	TapBehaviorUrl              string                      `db:"tap_behavior_url"`

	IosContentAvailable   bool   `db:"ios_content_available"`
	IosMutableContent     bool   `db:"ios_mutable_content"`
	IosSound              string `db:"ios_sound"`
	IosCategoryIdentifier string `db:"ios_category_identifier"`
	IosThreadIdentifier   string `db:"ios_thread_identifier"`

	AndroidChannelId string `db:"android_channel_id"`
	AndroidSound     string `db:"android_sound"`
	AndroidTag       string `db:"android_tag"`

	// seconds from to expire the push notification. Empty value is considered never to expire
	Expiration int32 `db:"expiration"`

	Attributes map[string]string `db:"attributes"`

	// Should a  be sent
	AlertOptionPushNotification bool `db:"alert_option_push_notification"`
	// Should the  appear in the  center
	AlertOptionNotificationCenter bool `db:"alert_option_notification_center"`
	// Should the  increase the badge count
	AlertOptionBadgeNumber bool `db:"alert_option_badge_number"`
}

func (n *NotificationSettings) Valid() error {

	if isAttachmentType(n.AttachmentType) == false {
		return NewValidationError(fmt.Sprintf("unsupported attachment_type got: %s", n.AttachmentType))
	}

	if isTapBehaviorType(n.TapBehaviorType) == false {
		return NewValidationError(fmt.Sprintf("unsupported tap_behavior_type got: %s", n.TapBehaviorType))
	}

	if isTapBehaviorPresentationType(n.TapBehaviorPresentationType) == false {
		return NewValidationError(fmt.Sprintf("unsupported tap_behavior_presentation_type got: %s", n.TapBehaviorPresentationType))
	}

	if n.AttachmentType != AttachmentType_NONE && n.AttachmentUrl == "" {
		return NewValidationError("attachment_url must be present when attachment_type is set")
	}

	if n.TapBehaviorType == TapBehaviorType_OPEN_EXPERIENCE && n.ExperienceId == "" {
		return NewValidationError("experience id must be present when tap_behavior_type is open experience")
	}
	if (n.TapBehaviorType == TapBehaviorType_OPEN_WEBSITE || n.TapBehaviorType == TapBehaviorType_OPEN_DEEP_LINK) &&
		n.TapBehaviorUrl == "" {
		return NewValidationError("tap_behavior_url  must be present when tap_behavior_type is open website or open deeplink")
	}

	if n.TapBehaviorType == TapBehaviorType_OPEN_WEBSITE && n.TapBehaviorPresentationType == TapBehaviorPresentationType_UNKNOWN {
		return NewValidationError("tap_behavior_presentation_type must be present when tap_behavior_type is open website")
	}

	return nil
}

type notificationSettingsStore store

func (c *notificationSettingsStore) OneById(ctx context.Context, campaignId int32) (*NotificationSettings, error) {

	// Build the statement
	stmt, names := qb.Select(tableName).Where(qb.Eq("campaign_id")).Limit(1).ToCql()

	// Fill in the query named params with values
	q := gocqlx.Query(c.session.Query(stmt).WithContext(ctx), names).BindMap(qb.M{
		"campaign_id": campaignId,
	})
	defer q.Release()

	var settings NotificationSettings
	if err := gocqlx.Get(&settings, q.Query); err != nil {
		if err == gocql.ErrNotFound {
			return nil, ErrNotFound
		}
		return nil, errors.Wrap(err, "db.Get")
	}

	return &settings, nil
}

func (c *notificationSettingsStore) Create(ctx context.Context, settings NotificationSettings) error {

	if err := settings.Valid(); err != nil {
		return err
	}

	stmt, names := qb.Insert(tableName).Columns(
		"campaign_id",
		"account_id",
		"experience_id",
		"attachment_url",
		"attachment_type",
		"tap_behavior_type",
		"tap_behavior_presentation_type",
		"tap_behavior_url",
		"ios_content_available",
		"ios_mutable_content",
		"ios_sound",
		"ios_category_identifier",
		"ios_thread_identifier",
		"android_channel_id",
		"android_sound",
		"android_tag",
		"expiration",
		"attributes",
		"alert_option_push_notification",
		"alert_option_notification_center",
		"alert_option_badge_number",
	).ToCql()

	q := gocqlx.Query(c.session.Query(stmt), names).BindStruct(&settings)

	if err := q.ExecRelease(); err != nil {
		return errors.Wrap(err, "Exec")
	}

	return nil
}
