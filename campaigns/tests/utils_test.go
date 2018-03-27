package tests

import (
	"testing"

	"github.com/jackc/pgx"

	sn "github.com/roverplatform/rover/campaigns/que/scheduled_notifications"
)

func lockOne(t *testing.T, pool *pgx.ConnPool) *sn.Task {
	task, err := sn.LockOne(pool)
	if err != nil {
		t.Fatal("LockOne:", err)
	}

	return task
}

func createTask(t *testing.T, pool *pgx.ConnPool, task *sn.Task) int {
	t.Helper()

	row := pool.QueryRow(`
		INSERT INTO scheduled_notification_tasks(
			state, run_at, number_of_attempts, error,
			forked, scroll_id, campaign_id, account_id, device_ids, timezone_offset
		)VALUES(
			$1, $2, $3, $4, $5,
			$6, $7, $8, $9, $10
		) RETURNING job_id
	`,
		task.State, task.RunAt, task.NumberOfAttempts, task.Error,
		task.Forked, task.ScrollId, task.CampaignId, task.AccountId, task.DeviceIds, task.TimezoneOffset,
	)

	var jobId int
	if err := row.Scan(&jobId); err != nil {
		t.Fatal("row.Scan", err)
	}

	return jobId
}

func fetchTask(t *testing.T, pool *pgx.ConnPool, id int64) *sn.Task {
	t.Helper()

	var task sn.Task

	row := pool.QueryRow(`
		SELECT
			job_id, state, run_at, number_of_attempts, error,
			forked, scroll_id, campaign_id, account_id, device_ids, timezone_offset
		FROM scheduled_notification_tasks
		WHERE job_id = $1
	`, id)

	if err := row.Scan(
		&task.ID, &task.State, &task.RunAt, &task.NumberOfAttempts, &task.Error,
		&task.Forked, &task.ScrollId, &task.CampaignId, &task.AccountId, &task.DeviceIds, &task.TimezoneOffset,
	); err != nil {
		t.Fatal("row.Scan:", err)
	}

	return &task
}

func deleteTask(t *testing.T, pool *pgx.ConnPool, id int64) *sn.Task {
	t.Helper()

	var task sn.Task

	tag, err := pool.Exec(`
		DELETE FROM scheduled_notification_tasks
		WHERE job_id = $1
	`, id)
	if err != nil {
		t.Fatal("Exec:", err)
	}

	if tag.RowsAffected() == 0 {
		t.Fatal("RowsAffected:", tag.RowsAffected())
	}

	return &task
}
