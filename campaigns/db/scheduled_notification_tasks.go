package db

import (
	"context"
	"database/sql"
	"time"

	"github.com/lib/pq"
)

const (
	stateQueued    = "queued"
	stateCancelled = "cancelled"
)

type (
	ScheduledDeliveryStatus struct {
		JobId      int `db:"job_id"`
		AccountId  int `db:"account_id"`
		CampaignId int `db:"campaign_id"`

		State string `db:"state"`
	}

	CreateScheduledNotificationTask struct {
		// time to run task at
		RunAt time.Time `db:"run_at"`

		// optional ES scroll Id
		ScrollId string `db:"scroll_id"`

		CampaignId int `db:"campaign_id"`
		AccountId  int `db:"account_id"`

		DeviceIds pq.StringArray `db:"device_ids"`
		IsTest    bool           `db:"is_test"`

		// timezone offset
		TimezoneOffset int `db:"timezone_offset"`
	}

	ScheduledNotificationTask struct {
		JobId int `db:"job_id"`

		// queued|inprogress|cancelled|failed|completed
		State string    `db:"state"`
		RunAt time.Time `db:"run_at"`

		NumberOfAttempts int    `db:"number_of_attempts"`
		Error            string `db:"error"`

		// optional ES scroll Id
		ScrollId string `db:"scroll_id"`
		Forked   bool   `db:"forked"`

		CampaignId int `db:"campaign_id"`
		AccountId  int `db:"account_id"`

		// device ids
		DeviceIds *pq.StringArray `db:"device_ids"`
		IsTest    bool            `db:"is_test"`

		// timezone offset
		TimezoneOffset int `db:"timezone_offset"`
	}
)

type scheduledTasksStoreTx storeTx

func (tx *scheduledTasksStoreTx) Create(ctx context.Context, t CreateScheduledNotificationTask) (int64, error) {
	return ScheduledTaskCreate(tx.tx, ctx, t)
}

func (tx *scheduledTasksStoreTx) DeleteByCampaignId(ctx context.Context, acctId int32, id int64) (int64, error) {
	var (
		q = `
		DELETE
		  FROM scheduled_notification_tasks
		WHERE
		    campaign_id = $2
		AND account_id = $1
		AND is_test='f'
`
	)

	result, err := tx.tx.ExecContext(ctx, q, acctId, id)
	if err != nil {
		return 0, wrapError(err, "db.Exec")
	}

	n, err := result.RowsAffected()
	if err != nil {
		return 0, wrapError(err, "rowsAffected")
	}

	return n, nil
}

func (tx *scheduledTasksStoreTx) CancelAll(ctx context.Context, campaignId int32) (int64, error) {
	var (
		update = map[string]interface{}{
			"campaign_id":  campaignId,
			"updated_at":   TimeNow(),
			"state":        stateCancelled,
			"state_queued": stateQueued,
			"is_test":      false,
		}

		q = `
		UPDATE
			scheduled_notification_tasks
		SET
			     state = :state,
			updated_at = :updated_at
		WHERE
			    campaign_id = :campaign_id
			AND state = :state_queued
			AND is_test = :is_test
`
	)

	res, err := tx.tx.NamedExecContext(ctx, q, update)
	if err != nil {
		return 0, wrapError(err, "db.Exec")
	}

	n, err := res.RowsAffected()
	if err != nil {
		return 0, wrapError(err, "res.rowsAffected")
	}

	return n, nil
}

func (tx *scheduledTasksStoreTx) Reschedule(ctx context.Context, runAt time.Time, campaignId int32) (int64, error) {
	var (
		update = map[string]interface{}{
			"campaign_id":   campaignId,
			"run_at":        runAt,
			"status_queued": string(stateQueued),
			"is_test":       false,
		}

		// NOTE: `cast` function is used instead `::timestamptz`
		// so there's no conflict between named params and types
		q = `
		UPDATE
			scheduled_notification_tasks
		SET
			run_at = (cast(:run_at as timestamptz) + (timezone_offset * interval '1 second'))
		WHERE
		      campaign_id = :campaign_id
		  AND state = :status_queued
			AND is_test = :is_test
`
	)

	res, err := tx.tx.NamedExecContext(ctx, q, update)
	if err != nil {
		return 0, wrapError(err, "db.Exec")
	}

	n, err := res.RowsAffected()
	if err != nil {
		return 0, wrapError(err, "res.rowsAffected")
	}

	return n, nil
}

type scheduledTasksStore store

func (db *scheduledTasksStore) ListByCampaignId(ctx context.Context, acctId, id int64) ([]*ScheduledNotificationTask, error) {
	var (
		tasks []*ScheduledNotificationTask

		q = `
		SELECT
			job_id, state, run_at, number_of_attempts, error,
			scroll_id, forked, campaign_id, account_id, is_test, device_ids, timezone_offset
		FROM scheduled_notification_tasks
		WHERE
		    campaign_id = $2
		AND  account_id = $1
		ORDER by job_id, timezone_offset
`
	)

	err := db.db.SelectContext(ctx, &tasks, q, acctId, id)
	if err != nil {
		return nil, wrapError(err, "Select")
	}

	return tasks, nil
}

func (db *scheduledTasksStore) Create(ctx context.Context, t CreateScheduledNotificationTask) (int64, error) {
	return ScheduledTaskCreate(db.db, ctx, t)
}

func (db *scheduledTasksStore) ListDeliveryStatuses(ctx context.Context, campaignIds []int32) ([]ScheduledDeliveryStatus, error) {
	var (
		sds []ScheduledDeliveryStatus

		// NOTE: using `ANY(array)` is equal to `IN (array[0], array[1],...)`
		Q = `
		SELECT job_id, account_id, campaign_id, state
		FROM scheduled_notification_tasks
		WHERE
		      campaign_id = ANY($1)
		  AND is_test = 'f'
`
	)

	err := db.db.SelectContext(ctx, &sds, Q, pq.Array(campaignIds))
	if err != nil {
		return nil, wrapError(err, "db.Exec")
	}

	return sds, nil
}

func ScheduledTaskCreate(dbCtx namedQuerier, ctx context.Context, t CreateScheduledNotificationTask) (int64, error) {
	var (
		now = TimeNow()

		insert = map[string]interface{}{
			"state":              stateQueued,
			"run_at":             t.RunAt,
			"number_of_attempts": 0,  // t.NumberOfAttempts,
			"error":              "", // t.Error,
			"created_at":         now,
			"updated_at":         now,

			"is_test":         t.IsTest,
			"forked":          false,
			"scroll_id":       t.ScrollId,
			"campaign_id":     t.CampaignId,
			"account_id":      t.AccountId,
			"device_ids":      pq.StringArray(t.DeviceIds),
			"timezone_offset": t.TimezoneOffset,
		}

		q = `
		INSERT INTO scheduled_notification_tasks(
			state,
			run_at,
			number_of_attempts,
			error,

			is_test,
			forked,
			scroll_id,
			campaign_id,
			account_id,
			device_ids,
			timezone_offset
		)
		VALUES(
			:state,
			:run_at,
			:number_of_attempts,
			:error,

			:is_test,
			:forked,
			:scroll_id,
			:campaign_id,
			:account_id,
			:device_ids,
			:timezone_offset
		)
		RETURNING job_id
`
	)

	rows, err := dbCtx.NamedQuery(q, insert)
	if err != nil {
		return 0, wrapError(err, "db.Exec")
	}
	defer rows.Close()

	if !rows.Next() {
		return 0, wrapError(sql.ErrNoRows, "rows.Next")
	}

	var taskId int64
	if err := rows.Scan(&taskId); err != nil {
		return 0, wrapError(err, "rows.Scan")
	}

	return taskId, nil
}
