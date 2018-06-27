package db

import (
	"context"
	"database/sql"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"github.com/roverplatform/rover/campaigns"
)

func (db *campaignsStore) UpdateScheduledDeliverySettings(ctx context.Context, req *campaigns.UpdateScheduledDeliverySettingsRequest) (*campaigns.Campaign, error) {
	return UpdateScheduledDeliverySettings(db.db, ctx, req)
}

func (tx *campaignsStoreTx) UpdateScheduledDeliverySettings(ctx context.Context, req *campaigns.UpdateScheduledDeliverySettingsRequest) (*campaigns.Campaign, error) {
	return UpdateScheduledDeliverySettings(tx.tx, ctx, req)
}

type namedQuerier interface {
	NamedQuery(string, interface{}) (*sqlx.Rows, error)
}

func UpdateScheduledDeliverySettings(dbCtx namedQuerier, ctx context.Context, req *campaigns.UpdateScheduledDeliverySettingsRequest) (*campaigns.Campaign, error) {
	var (
		now = TimeNow()

		update = struct {
			AccountId  int32 `db:"account_id"`
			CampaignId int32 `db:"campaign_id"`

			SegmentCondition string         `db:"segment_condition"`
			SegmentIds       pq.StringArray `db:"segment_ids"`

			UiState string `db:"ui_state"`

			ScheduledType string     `db:"scheduled_type"`
			ScheduledDate *time.Time `db:"scheduled_date"`
			ScheduledTime *time.Time `db:"scheduled_time"`

			ScheduledTimeZone           string    `db:"scheduled_time_zone"`
			ScheduledUseLocalDeviceTime bool      `db:"scheduled_use_local_device_time"`
			UpdatedAt                   time.Time `db:"updated_at"`
		}{
			AccountId:        req.AccountId,
			CampaignId:       req.CampaignId,
			SegmentCondition: req.SegmentCondition,
			SegmentIds:       pq.StringArray(req.SegmentIds),
			UiState:          req.UiState,
			ScheduledType:    req.ScheduledType,
			ScheduledDate: func() *time.Time {
				if req.ScheduledDate == nil {
					return nil
				}
				var (
					day   = req.ScheduledDate.Day
					month = req.ScheduledDate.Month
					year  = req.ScheduledDate.Year
				)
				var date = time.Date(int(year), time.Month(month), int(day), 0, 0, 0, 0, time.UTC)
				return &date
			}(),
			ScheduledTime: func() *time.Time {
				if req.ScheduledTime == nil {
					return nil
				}
				var t = time.Date(0, 0, 0, 0, 0, int(*req.ScheduledTime), 0, time.UTC)
				return &t
			}(),
			ScheduledTimeZone:           req.ScheduledTimeZone,
			ScheduledUseLocalDeviceTime: req.ScheduledUseLocalDeviceTime,
			UpdatedAt:                   now,
		}

		q = `
			UPDATE campaigns
				SET
				 updated_at = :updated_at

				,ui_state = :ui_state

				,segment_ids = :segment_ids
				,segment_condition = :segment_condition

				,scheduled_type                  = :scheduled_type
				,scheduled_date					 = :scheduled_date
				,scheduled_time 				 = :scheduled_time
				,scheduled_time_zone             = :scheduled_time_zone
				,scheduled_use_local_device_time = :scheduled_use_local_device_time

				WHERE
				 account_id = :account_id
				 AND id = :campaign_id
			RETURNING *
		`
	)

	rows, err := dbCtx.NamedQuery(q, update)
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
