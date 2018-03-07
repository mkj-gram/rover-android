package db

import (
	"context"
	"database/sql"
	"time"

	"github.com/lib/pq"
	"github.com/roverplatform/rover/campaigns"
)

var (
	Defaults = struct {
		PageSize int32
		Page     int32
	}{
		PageSize: 25,
		Page:     0,
	}
)

type (
	campaign struct {
		campaigns.Campaign

		SegmentIds pq.StringArray `db:"segment_ids"`
	}

	ListParams struct {
		AccountId      int32
		CampaignType   int32
		CampaignStatus int32
		// filter
		Keyword string

		// paging
		Page     int32
		PageSize int32
	}
)

func (c *campaign) fromDB() error {
	if len(c.SegmentIds) > 0 {
		c.Campaign.SegmentIds = []string(c.SegmentIds)
	}
	return nil
}

func (db *DB) OneById(ctx context.Context, account_id, id int32) (*campaigns.Campaign, error) {
	var c campaign

	err := db.db.GetContext(ctx,
		&c,
		`SELECT *
			FROM campaigns
			WHERE
				id = $1
				and account_id = $2
		`,
		id, account_id)

	if err != nil {
		return nil, wrapError(err, "db.Get")
	}

	if err := c.fromDB(); err != nil {
		return nil, wrapError(err, "fromDB")
	}

	return &c.Campaign, nil
}

func (db *DB) List(ctx context.Context, params ListParams) ([]*campaigns.Campaign, error) {
	var (
		args = map[string]interface{}{
			"account_id": params.AccountId,
		}

		q = `
			SELECT *
				FROM campaigns
				WHERE
					account_id = :account_id
		`
	)

	if params.CampaignStatus > 0 {
		q += ` AND campaign_status = :campaign_status`
		args["campaign_status"] = params.CampaignStatus
	}

	if params.CampaignType > 0 {
		q += ` AND campaign_type = :campaign_type `
		args["campaign_type"] = params.CampaignType
	}

	if params.Keyword != "" {
		q += ` AND name ILIKE :search `
		args["search"] = "%" + params.Keyword + "%"
	}

	q += `
		ORDER BY
			created_at desc,
			id desc
	`

	var pageSize = Defaults.PageSize
	q += ` LIMIT :limit`
	if params.PageSize > 0 {
		pageSize = params.PageSize
	}
	args["limit"] = pageSize

	if params.Page > 0 {
		q += ` OFFSET :offset`
		args["offset"] = pageSize * (params.Page - 1)
	}

	rows, err := db.db.NamedQueryContext(ctx, q, args)
	if err != nil {
		return nil, wrapError(err, "db.Query")
	}

	defer rows.Close()

	var cx []*campaigns.Campaign
	for rows.Next() {
		var c campaign
		if err := rows.StructScan(&c); err != nil {
			return nil, wrapError(err, "rows.Scan")
		}

		if err := c.fromDB(); err != nil {
			return nil, wrapError(err, "fromDB")
		}

		cx = append(cx, &c.Campaign)
	}

	return cx, nil
}

func (db *DB) Create(ctx context.Context, accountId int32, name string, campaignType int32) (*campaigns.Campaign, error) {
	var (
		now = TimeNow()

		c = campaign{
			Campaign: campaigns.Campaign{
				CreatedAt: now,
				UpdatedAt: now,

				AccountId: accountId,

				Name:         name,
				CampaignType: campaignType,
			},
		}
	)

	row, err := db.db.NamedQueryContext(ctx, `
		INSERT
			INTO campaigns(
				account_id, campaign_type, name,
				created_at, updated_at
			)
			VALUES(
				:account_id, :campaign_type, :name,
				:created_at, :updated_at
			)

			RETURNING
				id, campaign_status
	`, c)

	if err != nil {
		return nil, wrapError(err, "campaigns.Insert")
	}

	defer row.Close()
	if !row.Next() {
		return nil, wrapError(sql.ErrNoRows, "campaigns.Next")
	}

	if err := row.Scan(&c.CampaignId, &c.CampaignStatus); err != nil {
		return nil, wrapError(err, "row.Scan")
	}

	return &c.Campaign, nil
}

func (db *DB) UpdateStatus(ctx context.Context, accountId, campaignId, status int32) error {
	var (
		now = TimeNow()

		args = map[string]interface{}{
			"campaign_status": status,
			"account_id":      accountId,
			"campaign_id":     campaignId,
			"updated_at":      now,
		}

		q = `
			UPDATE campaigns
				SET
					campaign_status = :campaign_status
					,updated_at			= :updated_at
				WHERE
					account_id = :account_id
					AND			id = :campaign_id
			`
	)

	res, err := db.db.NamedExecContext(ctx, q, args)
	if err != nil {
		return wrapError(err, "db.Exec")
	}

	n, err := res.RowsAffected()
	if err != nil {
		return wrapError(err, "res.RowsAffected")
	}

	if n == 0 {
		return wrapError(sql.ErrNoRows, "db.Update")
	}

	return nil
}

func (db *DB) Rename(ctx context.Context, accountId int32, campaignId int32, name string) error {
	var (
		now = TimeNow()

		args = map[string]interface{}{
			"name":        name,
			"account_id":  accountId,
			"campaign_id": campaignId,
			"updated_at":  now,
		}

		q = `
		UPDATE campaigns
			SET
				 name				= :name
				,updated_at = :updated_at
			WHERE
				account_id = :account_id
				AND			id = :campaign_id
			`
	)

	res, err := db.db.NamedExecContext(ctx, q, args)
	if err != nil {
		return wrapError(err, "db.Exec")
	}

	n, err := res.RowsAffected()
	if err != nil {
		return wrapError(err, "res.RowsAffected")
	}

	if n == 0 {
		return wrapError(sql.ErrNoRows, "db.Update")
	}

	return nil
}

func (db *DB) Insert(ctx context.Context, c campaigns.Campaign) (*campaigns.Campaign, error) {
	var (
		now = TimeNow()

		// TODO: fromCampaign

		args = map[string]interface{}{
			"account_id":    c.AccountId,
			"name":          c.Name,
			"campaign_type": c.CampaignType,
			"created_at":    now,
			"updated_at":    now,
		}

		q = `
		INSERT INTO campaigns(
			account_id,
			name,
			campaign_type,
			created_at,
			updated_at
		)
		VALUES(
			:account_id,
			:name,
			:campaign_type,
			:created_at,
			:updated_at
		)
		RETURNING *
	`
	)

	var rows, err = db.db.NamedQueryContext(ctx, q, args)
	if err != nil {
		return nil, wrapError(err, "db.NamedQueryContext")
	}
	defer rows.Close()

	if !rows.Next() {
		return nil, wrapError(sql.ErrNoRows, "rows.Next")
	}

	var inserted campaign
	if err := rows.StructScan(&inserted); err != nil {
		return nil, wrapError(err, "rows.StructScan")
	}

	return &inserted.Campaign, nil
}

func (db *DB) UpdateNotificationSettings(ctx context.Context, req *campaigns.UpdateNotificationSettingsRequest) (*campaigns.Campaign, error) {
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

	return &updated.Campaign, nil

}

func (db *DB) UpdateAutomatedDeliverySettings(ctx context.Context, req *campaigns.UpdateAutomatedDeliverySettingsRequest) error {
	var (
		now = TimeNow()

		update = struct {
			*campaigns.UpdateAutomatedDeliverySettingsRequest
			SegmentIds pq.StringArray `db:"segment_ids"`
			UpdatedAt  time.Time      `db:"updated_at"`
		}{
			UpdateAutomatedDeliverySettingsRequest: req,

			SegmentIds: req.SegmentIds,
			UpdatedAt:  now,
		}

		q = `
  UPDATE campaigns
   SET
     updated_at = :updated_at

    ,ui_state = :ui_state

    ,segment_condition = :segment_condition
    ,segment_ids = :segment_ids

    ,automated_monday    = :automated_monday
    ,automated_tuesday   = :automated_tuesday
    ,automated_wednesday = :automated_wednesday
    ,automated_thursday  = :automated_thursday
    ,automated_friday    = :automated_friday
    ,automated_saturday  = :automated_saturday
    ,automated_sunday    = :automated_sunday

    ,automated_start_date            = :automated_start_date
    ,automated_end_date              = :automated_end_date

    ,automated_start_time            = :automated_start_time
    ,automated_end_time              = :automated_end_time

    ,automated_time_zone             = :automated_time_zone
    ,automated_use_local_device_time = :automated_use_local_device_time

    ,automated_event_name            = :automated_event_name
    ,automated_event_predicates      = :automated_event_predicates

    ,automated_frequency_single_use  = :automated_frequency_single_use
    ,automated_frequency_limits      = :automated_frequency_limits

   WHERE
     account_id = :account_id
     AND id = :campaign_id
`
	)

	res, err := db.db.NamedExecContext(ctx, q, update)
	if err != nil {
		return wrapError(err, "db.Exec")
	}

	n, err := res.RowsAffected()
	if err != nil {
		return wrapError(err, "res.rowsAffected")
	}

	if n == 0 {
		return wrapError(sql.ErrNoRows, "db.Update")
	}

	return nil
}

func (db *DB) UpdateScheduledDeliverySettings(ctx context.Context, req *campaigns.UpdateScheduledDeliverySettingsRequest) error {
	var (
		now = TimeNow()

		update = struct {
			*campaigns.UpdateScheduledDeliverySettingsRequest
			SegmentIds pq.StringArray `db:"segment_ids"`
			UpdatedAt  time.Time      `db:"updated_at"`
		}{
			UpdateScheduledDeliverySettingsRequest: req,

			SegmentIds: pq.StringArray(req.SegmentIds),
			UpdatedAt:  now,
		}

		q = `
  UPDATE campaigns
   SET
     updated_at = :updated_at

    ,ui_state = :ui_state

    ,segment_ids = :segment_ids
    ,segment_condition = :segment_condition

    ,scheduled_type                  = :scheduled_type
    ,scheduled_timestamp             = :scheduled_timestamp
    ,scheduled_time_zone             = :scheduled_time_zone
    ,scheduled_use_local_device_time = :scheduled_use_local_device_time

   WHERE
     account_id = :account_id
     AND id = :campaign_id
`
	)

	res, err := db.db.NamedExecContext(ctx, q, update)
	if err != nil {
		return wrapError(err, "db.Exec")
	}

	n, err := res.RowsAffected()
	if err != nil {
		return wrapError(err, "res.rowsAffected")
	}

	if n == 0 {
		return wrapError(sql.ErrNoRows, "db.Update")
	}

	return nil
}
