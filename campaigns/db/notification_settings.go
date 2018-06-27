package db

import (
	"context"
	"database/sql"
	"time"

	"github.com/roverplatform/rover/campaigns"
)

func (db *campaignsStore) UpdateNotificationSettings(ctx context.Context, req *campaigns.UpdateNotificationSettingsRequest) (*campaigns.Campaign, error) {
	var (
		now = TimeNow()

		update = struct {
			*campaigns.UpdateNotificationSettingsRequest
			UpdatedAt time.Time `db:"updated_at"`
		}{
			UpdateNotificationSettingsRequest: req,
			UpdatedAt:                         now,
		}

		q = `
		UPDATE campaigns
			SET
				 updated_at = :updated_at

				,experience_id = :experience_id
				,ui_state = :ui_state

				,notification_body = :notification_body
				,notification_title = :notification_title
				,notification_attachment_url = :notification_attachment_url

				,notification_attachment_type = :notification_attachment_type

				,notification_tap_behavior_type = :notification_tap_behavior_type
				,notification_tap_behavior_url = :notification_tap_behavior_url
				,notification_tap_behavior_presentation_type = :notification_tap_behavior_presentation_type

				,notification_ios_content_available = :notification_ios_content_available
				,notification_ios_mutable_content = :notification_ios_mutable_content
				,notification_ios_sound = :notification_ios_sound
				,notification_ios_category_identifier = :notification_ios_category_identifier
				,notification_ios_thread_identifier = :notification_ios_thread_identifier

				,notification_android_channel_id = :notification_android_channel_id
				,notification_android_sound = :notification_android_sound
				,notification_android_tag = :notification_android_tag

				,notification_expiration = :notification_expiration

				,notification_attributes = :notification_attributes

				,notification_alert_option_push_notification = :notification_alert_option_push_notification
				,notification_alert_option_notification_center = :notification_alert_option_notification_center
				,notification_alert_option_badge_number = :notification_alert_option_badge_number

			WHERE
				account_id = :account_id
				AND id = :campaign_id

		RETURNING *
	`
	)

	rows, err := db.db.NamedQueryContext(ctx, q, update)
	if err != nil {
		return nil, wrapError(err, "db.Exec")
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, wrapError(sql.ErrNoRows, "rows.Next")
	}

	var updated campaign
	if err := rows.StructScan(&updated); err != nil {
		return nil, wrapError(err, "rows.StructScan")
	}

	if err := updated.fromDB(); err != nil {
		return nil, wrapError(err, "fromDB")
	}

	return &updated.Campaign, nil

}
