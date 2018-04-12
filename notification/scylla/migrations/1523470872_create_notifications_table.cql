CREATE TABLE IF NOT EXISTS notifications (
  id           timeuuid,
  account_id   int,
  campaign_id  int,
  device_id    text,

  title        text,
  body         text,

  is_read      boolean,
  is_deleted   boolean,

  PRIMARY KEY((account_id, device_id), id)

) WITH clustering order by (id DESC);
