-- +goose Up

ALTER TABLE campaigns
ADD COLUMN scheduled_date DATE DEFAULT NULL;

ALTER TABLE campaigns
ALTER scheduled_date type date
using  case
  when scheduled_timestamp IS NOT NULL THEN scheduled_timestamp::timestamp::date
  else NULL
END;

ALTER TABLE campaigns
ADD COLUMN  scheduled_time TIME DEFAULT NULL;

ALTER TABLE campaigns
ALTER scheduled_time type time
using case
  when scheduled_timestamp IS NOT NULL THEN scheduled_timestamp::timestamp::time
  else NULL
END;

ALTER TABLE campaigns
DROP COLUMN scheduled_timestamp;

-- +goose Down

ALTER TABLE campaigns
ADD COLUMN  scheduled_timestamp TIMESTAMP WITHOUT TIME ZONE default NULL;

ALTER TABLE campaigns
ALTER scheduled_timestamp type TIMESTAMP WITHOUT TIME ZONE
using case
  when scheduled_date IS NOT NULL AND scheduled_time IS NOT NULL THEN scheduled_date + scheduled_time
  else NULL
END;


ALTER TABLE campaigns
DROP COLUMN scheduled_date;

ALTER TABLE campaigns
DROP COLUMN scheduled_time;

