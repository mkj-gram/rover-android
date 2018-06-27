package db

import (
	"context"
	"database/sql"
	"time"

	"github.com/lib/pq"
	"github.com/roverplatform/rover/campaigns"
)

func (db *campaignsStore) UpdateAutomatedDeliverySettings(ctx context.Context, req *campaigns.UpdateAutomatedDeliverySettingsRequest) (*campaigns.Campaign, error) {
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
