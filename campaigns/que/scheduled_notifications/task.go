package scheduled_notifications

import (
	"sync"
	"time"

	"github.com/jackc/pgx"
	"github.com/pkg/errors"
)

var (
	TimeNow = time.Now

	// MaxAttempts sets the number of attempts
	// a task should be retried before giving up
	// and marking the task as failed
	MaxAttempts = 10
)

type TaskState string

const (
	TaskStateQueued     = TaskState("queued")
	TaskStateInProgress = TaskState("inprogress")
	TaskStateCompleted  = TaskState("completed")
	TaskStateFailed     = TaskState("failed")
	TaskStateCancelled  = TaskState("cancelled")
)

type Task struct {
	// ID is the unique database ID of the Job. It is ignored on job creation.
	ID int64

	// <queued, in-progress, completed, failed, cancelled>
	State string

	// time to run task at
	RunAt time.Time

	NumberOfAttempts int

	Error string

	// campaign specific attrs

	// forked marks job as one that already created child job
	// forked jobs need not to create more child jobs
	Forked bool

	// optional ES scroll Id
	ScrollId string

	// Campaign id
	CampaignId int

	AccountId int

	// Test device ids
	DeviceIds []string

	// timezone offset
	TimezoneOffset int

	mu      sync.Mutex
	deleted bool
	pool    *pgx.ConnPool
	conn    *pgx.Conn
}

// Done releases the Postgres advisory lock on the job and returns the database
// connection to the pool.
func (j *Task) Done() {
	j.mu.Lock()
	defer j.mu.Unlock()

	if j.conn == nil || j.pool == nil {
		// already marked as done
		return
	}

	var ok bool
	// Swallow this error because we don't want an unlock failure to cause
	// work to stop.
	_ = j.conn.QueryRow("unlockSNT", j.ID).Scan(&ok)

	j.pool.Release(j.conn)
	j.pool = nil
	j.conn = nil
}

func (j *Task) SetError(msg string) error {

	var (
		errCount  = j.NumberOfAttempts + 1
		backoff   = intPow(int(errCount), 4) + 3 // TODO: configurable delay
		failed    = errCount >= MaxAttempts
		nextRunAt = TimeNow().Add(time.Duration(backoff) * time.Second).Truncate(time.Millisecond)
	)

	tag, err := j.conn.Exec("errorSNT", j.RunAt, j.ID,
		errCount, nextRunAt, msg, failed)

	if err != nil {
		return errors.Wrap(err, "conn.Exec")
	}

	if tag.RowsAffected() != 1 {
		return pgx.ErrNoRows
	}

	j.RunAt = nextRunAt
	j.Error = msg
	j.NumberOfAttempts = errCount

	return nil
}

func (j *Task) SetState(state TaskState) error {
	_, err := j.conn.Exec("stateSNT", j.RunAt, j.ID, state)
	if err != nil {
		return errors.Wrap(err, "conn.Exec")
	}
	return nil
}

func (j *Task) Fork(ScrollId string) (int64, error) {
	tx, err := j.conn.Begin()
	if err != nil {
		return 0, errors.Wrap(err, "conn.Begin")
	}

	defer func() {
		// TODO: log error
		tx.Rollback()
	}()

	if _, err := tx.Exec("forkSNT", j.RunAt, j.ID, true); err != nil {
		return 0, errors.Wrap(err, "task.Fork")
	}

	var t = Task{
		// ID:
		// Stae: "queued",
		// RunAt: now()
		// NumberOfAttempts: 0,
		// Error:            "",

		Forked:         false,
		ScrollId:       ScrollId,
		CampaignId:     j.CampaignId,
		AccountId:      j.AccountId,
		DeviceIds:      nil,
		TimezoneOffset: j.TimezoneOffset,

		conn: j.conn,
		pool: j.pool,
	}

	// TODO: does it need special types?
	rows, err := tx.Query("insertSNT",
		"queued", j.RunAt, t.NumberOfAttempts, t.Error,
		t.Forked, t.ScrollId, t.CampaignId, t.DeviceIds, t.TimezoneOffset,
		t.AccountId,
	)
	if err != nil {
		return 0, errors.Wrap(err, "tx.Query")
	}

	defer rows.Close()

	if !rows.Next() {
		return 0, errors.Wrap(pgx.ErrNoRows, "rows.Next")
	}

	if err := rows.Scan(&t.ID); err != nil {
		return 0, errors.Wrap(err, "rows.Scan")
	}

	// must be closed before closing tx
	rows.Close()

	if err := tx.Commit(); err != nil {
		return 0, errors.Wrap(err, "tx.Commit")
	}

	j.Forked = true

	return t.ID, nil
}
