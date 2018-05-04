package scheduled_notifications

import (
	"github.com/jackc/pgx"
	"github.com/pkg/errors"
)

var (
	// Maximum number of loop iterations in LockJob before giving up.  This is to
	// avoid looping forever in case something is wrong.
	MaxLockJobAttempts = 10

	// Returned by LockJob if a job could not be retrieved from the queue after
	// several attempts because of concurrently running transactions.  This error
	// should not be returned unless the queue is under extremely heavy
	// concurrency.
	ErrAgain = errors.New("maximum number of LockJob attempts reached")
)

func PrepareStatements(conn *pgx.ConnPool) error {
	for name, sql := range preparedStmts {
		if _, err := conn.Prepare(name, sql); err != nil {
			return errors.Wrapf(err, "conn.Prepare: %s", name)
		}
	}
	return nil
}

func LockOne(pool *pgx.ConnPool) (*Task, error) {
	conn, err := pool.Acquire()
	if err != nil {
		return nil, err
	}

	j := Task{pool: pool, conn: conn}

	for i := 0; i < MaxLockJobAttempts; i++ {
		err = conn.QueryRow("lockSNT").Scan(
			&j.ID,
			&j.State,
			&j.RunAt,
			&j.NumberOfAttempts,
			&j.Error,

			&j.Forked,
			&j.ScrollId,
			&j.CampaignId,
			&j.DeviceIds,
			&j.TimezoneOffset,
			&j.AccountId,
			&j.IsTest,
		)
		if err != nil {
			pool.Release(conn)
			if err == pgx.ErrNoRows {
				return nil, nil
			}
			return nil, errors.Wrap(err, "conn.QueryRow")
		}

		// Deal with race condition. Explanation from the Ruby Que gem:
		//
		// Edge case: It's possible for the lock_job query to have
		// grabbed a job that's already been worked, if it took its MVCC
		// snapshot while the job was processing, but didn't attempt the
		// advisory lock until it was finished. Since we have the lock, a
		// previous worker would have deleted it by now, so we just
		// double check that it still exists before working it.
		//
		// Note that there is currently no spec for this behavior, since
		// I'm not sure how to reliably commit a transaction that deletes
		// the job in a separate thread between lock_job and check_job.
		var ok bool
		err = conn.QueryRow("checkSNT", j.RunAt, j.ID).Scan(&ok)
		if err == nil {
			return &j, nil
		} else if err == pgx.ErrNoRows {
			// Encountered job race condition; start over from the beginning.
			// We're still holding the advisory lock, though, so we need to
			// release it before resuming.  Otherwise we leak the lock,
			// eventually causing the server to run out of locks.
			//
			// Also swallow the possible error, exactly like in Done.
			_ = conn.QueryRow("unlockSNT", j.ID).Scan(&ok)
			continue
		} else {
			pool.Release(conn)
			return nil, err
		}
	}
	return nil, ErrAgain
}
