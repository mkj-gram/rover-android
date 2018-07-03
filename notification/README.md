
# Generating test pkcs12 certificate

```
make cert
```

## Sample Data

```
docker exec -i docker_scylla_1 cqlsh docker_scylla_1 -k notification_dev <<EOF

INSERT INTO notification_settings
(campaign_id, account_id, experience_id, tap_behavior_type)
VALUES (2,2, '123', 'OPEN_EXPERIENCE');

INSERT INTO notifications (id, account_id, campaign_id, device_id, title, body, is_read, is_deleted)
VALUES (689f9586-3dcd-11e8-b467-0ed5f89f718a, 2, 2, 'da', 'titlea', 'bodya', true, true);
INSERT INTO notifications (id, account_id, campaign_id, device_id, title, body, is_read, is_deleted)
VALUES (689f9586-3dcd-11e8-b467-0ed5f89f718b, 2, 2, 'db', 'titleb', 'bodyb', true, true);

EOF
