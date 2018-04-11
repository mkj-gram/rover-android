package scylla

import (
	"context"

	"github.com/gocql/gocql"
	"github.com/pkg/errors"
	"github.com/scylladb/gocqlx"
	"github.com/scylladb/gocqlx/qb"
)

const tableName = "notification_settings"

type NotificationSettings struct {
	CampaignId int32 `json:"campaign_id"`
	// TODO don't think we need account id
	AccountID int32 `json:"account_id"`

	ExperienceId string `json:"experience_id"`

	AttachmentUrl string `json:"attachment_url"`
	// TODO custom enum?
	AttachmentType string `json:"attachment_type"`

	// TODO custom enum?
	TapBehaviorType string `json:"tap_behavior_type"`
	// TODO custom enum?
	TapBehaviorPresentationType string `json:"tap_behavior_presentation_type"`
	TapBehaviorUrl              string `json:"tap_behavior_url"`

	IosContentAvailable   bool   `json:"ios_content_available"`
	IosMutableContent     bool   `json:"ios_mutable_content"`
	IosSound              string `json:"ios_sound"`
	IosCategoryIdentifier string `json:"ios_category_identifier"`
	IosThreadIdentifier   string `json:"ios_thread_identifier"`

	AndroidChannelId string `json:"android_channel_id"`
	AndroidSound     string `json:"android_sound"`
	AndroidTag       string `json:"android_tag"`

	// number of ahead of now
	Expiration int32 `json:"expiration"`

	Attributes map[string]string `json:"attributes"`

	// Should a  be sent
	AlertOptionPushNotification bool `json:"alert_option_push_notification"`
	// Should the  appear in the  center
	AlertOptionNotificationCenter bool `json:"alert_option_notification_center"`
	// Should the  increase the badge count
	AlertOptionBadgeNumber bool `json:"alert_option_badge_number"`
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
