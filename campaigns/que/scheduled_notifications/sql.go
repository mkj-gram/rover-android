package scheduled_notifications

var preparedStmts = map[string]string{
	"lockSNT":   lockSNT,
	"unlockSNT": unlockSNT,
	"checkSNT":  checkSNT,

	"stateSNT": stateSNT,
	"errorSNT": errorSNT,

	"insertSNT": insertSNT,
	"forkSNT":   forkSNT,
}

const (
	insertSNT = `
INSERT INTO scheduled_notification_tasks
  (
    state, run_at, number_of_attempts, error,
    forked, scroll_id, campaign_id, device_ids, timezone_offset,
    account_id
  )
VALUES
  (
    $1::text, $2::timestamptz, $3::integer, $4::text,
    $5::boolean, $6::text, $7::integer, $8::text[], $9::integer,
    $10::integer
  ) RETURNING job_id
`

	stateSNT = `
UPDATE scheduled_notification_tasks
SET
	state              = $3::text
WHERE
      run_at  = $1::timestamptz
AND   job_id  = $2::bigint
`

	forkSNT = `
UPDATE scheduled_notification_tasks
SET
  forked      = $3::boolean
WHERE
      run_at  = $1::timestamptz
AND   job_id  = $2::bigint
`

	errorSNT = `
UPDATE scheduled_notification_tasks
SET
	number_of_attempts = $3::integer,
	run_at             = $4::timestamptz,
	error              = $5::text,
	state              = case when $6::boolean = 't' then 'failed' else state end
WHERE
	    run_at = $1::timestamptz
	AND job_id = $2::bigint
`

	checkSNT = `
SELECT true AS exists
FROM   scheduled_notification_tasks
WHERE
       run_at   = $1::timestamptz
AND    job_id   = $2::bigint
`

	unlockSNT = `
SELECT pg_advisory_unlock($1)
	`

	lockSNT = `
WITH RECURSIVE jobs AS (
  SELECT (j).*, pg_try_advisory_lock((j).job_id) AS locked
  FROM (
    SELECT j
    FROM scheduled_notification_tasks AS j
    WHERE run_at <= now()
    AND state not in ('completed', 'failed', 'cancelled')
    ORDER BY run_at, job_id
    LIMIT 1
  ) AS t1
  UNION ALL (
    SELECT (j).*, pg_try_advisory_lock((j).job_id) AS locked
    FROM (
      SELECT (
        SELECT j
        FROM scheduled_notification_tasks AS j
        WHERE run_at <= now()
        AND (run_at, job_id) > (jobs.run_at, jobs.job_id)
        AND state not in ('completed', 'failed', 'cancelled')
        ORDER BY run_at, job_id
        LIMIT 1
      ) AS j
      FROM jobs
      WHERE jobs.job_id IS NOT NULL
      LIMIT 1
    ) AS t1
  )
)
SELECT
	job_id,
	state, run_at, number_of_attempts, error,
	forked, scroll_id, campaign_id, device_ids, timezone_offset,
	account_id
FROM jobs
WHERE locked
LIMIT 1
`
)
