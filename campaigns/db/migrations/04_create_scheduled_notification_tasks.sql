-- +goose Up

CREATE TABLE IF NOT EXISTS scheduled_notification_tasks
(
  job_id              bigserial    NOT NULL,
  state               text        NOT NULL DEFAULT 'queued',
  run_at              timestamptz NOT NULL DEFAULT now(),
  number_of_attempts  integer     NOT NULL DEFAULT 0,
  error               text        NOT NULL DEFAULT '',

  is_test             boolean NOT NULL default 'f',
  forked              boolean NOT NULL default 'f',
  scroll_id           text    NOT NULL default '',
  campaign_id         integer NOT NULL,
  account_id          integer NOT NULL,
  device_ids          text[]  default '{}',
  timezone_offset     integer NOT NULL DEFAULT 0,

  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),


  CONSTRAINT scheduled_notification_tasks_pkey PRIMARY KEY (job_id)
);

CREATE index on scheduled_notification_tasks(campaign_id);

-- +goose Down

DROP INDEX IF EXISTS scheduled_notification_tasks_campaign_id_idx;
DROP TABLE IF EXISTS scheduled_notification_tasks;
