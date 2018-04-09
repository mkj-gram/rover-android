--
-- ios
--
INSERT INTO ios_platforms(
  id, account_id, title, bundle_id, certificate_data, certificate_passphrase, certificate_filename, certificate_expires_at, certificate_updated_at, created_at, updated_at
) VALUES
 (1, 1, 'p1', 'io.rover.bagel', 'Y2VydA==', 'pass1', 'fname1', '2017-05-04T16:26:25.445494Z', '2017-05-04T16:26:26.445494Z', '2017-05-04T16:26:27.445494Z', '2017-05-04T16:26:28.445494Z')
,(2, 1, 'p3', 'io.rover.bagel', 'Y2VydA==', 'pass3', 'fname3', '2017-05-04T16:26:25.445494Z', '2017-05-04T16:26:26.445494Z', '2017-05-04T16:26:27.445494Z', '2017-05-04T16:26:28.445494Z')
;

INSERT INTO android_platforms(
  id, account_id, title, push_credentials_server_key, push_credentials_sender_id, push_credentials_updated_at, created_at, updated_at
) VALUES
 (1, 1, 'p1', 'server_key', 'sender_id', '2017-05-04T16:26:25.445494Z', '2017-05-04T16:26:26.445494Z', '2017-05-04T16:26:27.445494Z')
,(2, 1, 'p2', 'server_key', 'sender_id', '2017-05-04T16:26:25.445494Z', '2017-05-04T16:26:26.445494Z', '2017-05-04T16:26:27.445494Z')
;

