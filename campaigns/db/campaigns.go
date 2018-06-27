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

		SegmentIds    pq.StringArray `db:"segment_ids"`
		ScheduledDate *time.Time     `db:"scheduled_date"`
		ScheduledTime *time.Time     `db:"scheduled_time"`
	}

	ListResult struct {
		Campaigns  []*campaigns.Campaign
		TotalCount int64
	}

	ListParams struct {
		AccountId      int32
		CampaignType   string
		CampaignStatus string
		// filter
		Keyword string

		// paging
		Page     int32
		PageSize int32

		// cursor
		Cursor *campaigns.Cursor
	}
)

func (c *campaign) fromDB() error {
	if len(c.SegmentIds) > 0 {
		c.Campaign.SegmentIds = []string(c.SegmentIds)
	}

	if c.ScheduledDate != nil {
		var year, month, day = c.ScheduledDate.Date()
		c.Campaign.ScheduledDate = &campaigns.Date{
			Year:  int32(year),
			Month: int32(month),
			Day:   int32(day),
		}
	}

	if c.ScheduledTime != nil {
		var seconds = int32(c.ScheduledTime.Second() + c.ScheduledTime.Minute()*60 + c.ScheduledTime.Hour()*3600)
		c.Campaign.ScheduledTime = &seconds
	}

	return nil
}

type campaignsStore store
type campaignsStoreTx storeTx

func (db *campaignsStore) OneById(ctx context.Context, accountId, id int32) (*campaigns.Campaign, error) {
	var c campaign

	err := db.db.GetContext(ctx,
		&c,
		`SELECT *
			FROM campaigns
			WHERE
				id = $1
				and account_id = $2
		`,
		id, accountId)

	if err != nil {
		return nil, wrapError(err, "db.Get")
	}

	if err := c.fromDB(); err != nil {
		return nil, wrapError(err, "fromDB")
	}

	return &c.Campaign, nil
}

func (db *campaignsStore) List(ctx context.Context, params ListParams) (*ListResult, error) {
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

		result ListResult
	)

	if params.CampaignStatus != "UNKNOWN" {
		q += ` AND campaign_status = :campaign_status`
		args["campaign_status"] = params.CampaignStatus
	}

	if params.CampaignType != "UNKNOWN" {
		q += ` AND campaign_type = :campaign_type `
		args["campaign_type"] = params.CampaignType
	}

	if params.Keyword != "" {
		q += ` AND name ILIKE :search `
		args["search"] = "%" + params.Keyword + "%"
	}

	// no cursor? basic pagination then
	if params.Cursor == nil {
		q += `
			order by created_at desc, id desc
		`
		var pageSize = Defaults.PageSize
		q += ` LIMIT :limit`
		if params.PageSize > 0 {
			pageSize = params.PageSize
		}
		args["limit"] = pageSize

		if params.Page > 0 {
			q += ` OFFSET :offset`
			args["offset"] = pageSize * params.Page
		}
	} else {
		var cur = newCursor(params.Cursor)
		cur.Bind(args)

		var (
			curQ   = cur.SQL(q)
			countQ = curQ + ` select count(*) from campaigns_matched`
		)

		q = curQ + ` select * from campaigns_cursor`

		rows, err := db.db.NamedQueryContext(ctx, countQ, args)
		if err != nil {
			return nil, wrapError(err, "db.Query")
		}

		defer rows.Close()

		if !rows.Next() {
			return nil, wrapError(sql.ErrNoRows, "cursor: TotalCount: next")
		}

		if err := rows.Scan(&result.TotalCount); err != nil {
			return nil, wrapError(err, "cursor: TotalCount: scan")
		}
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

	result.Campaigns = cx

	return &result, nil
}

func (db *campaignsStore) Create(ctx context.Context, accountId int32, name string, campaignType string) (*campaigns.Campaign, error) {
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

			RETURNING *
	`, c)

	if err != nil {
		return nil, wrapError(err, "campaigns.Insert")
	}

	defer row.Close()
	if !row.Next() {
		return nil, wrapError(sql.ErrNoRows, "campaigns.Next")
	}

	if err := row.StructScan(&c); err != nil {
		return nil, wrapError(err, "row.Scan")
	}

	if err := c.fromDB(); err != nil {
		return nil, wrapError(err, "fromDB")
	}

	return &c.Campaign, nil
}

func (db *campaignsStore) Rename(ctx context.Context, accountId int32, campaignId int32, name string) error {
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

func (db *campaignsStore) Duplicate(ctx context.Context, acctId, campaignId int32, name string) (*campaigns.Campaign, error) {
	var (
		now = TimeNow()

		args = map[string]interface{}{
			"account_id":  acctId,
			"campaign_id": campaignId,
			"name":        name,
			"created_at":  now,
			"updated_at":  now,
		}

		q = `
		INSERT INTO campaigns(
			account_id

			,created_at
			,updated_at

			,name

			,campaign_type
			--,campaign_status

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
			-- ,scheduled_time
			-- ,scheduled_date
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
			,automated_event_predicates

			,automated_frequency_single_use
			,automated_frequency_limits
		)
		SELECT
			account_id

			,:created_at
			,:updated_at

			,(case :name when '' then concat(name, ' Copy') else :name end)

			,campaign_type
			--,campaign_status

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
			-- ,scheduled_time
			-- ,scheduled_date
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
			,automated_event_predicates

			,automated_frequency_single_use
			,automated_frequency_limits

		FROM campaigns
		WHERE id = :campaign_id and account_id = :account_id
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

	if err := inserted.fromDB(); err != nil {
		return nil, wrapError(err, "fromDb")
	}

	return &inserted.Campaign, nil
}
