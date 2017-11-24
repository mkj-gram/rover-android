## Setup

```

docker exec -it  docker_postgres_1 psql -U postgres -d rover-local

// SDK-API also requires the account to be present
// token1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa belongs to account=1 so create it

> insert into accounts  (id, token, share_key, created_at, updated_at)
  values (1, 'token1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'token1', now(), now());
```


## Testing

### `/v1/events`

```
curl -X "POST" "http://localhost:3100/v1/events" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -H 'x-rover-api-key: token1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' \
     -H 'x-rover-device-id: 2273F676-DEED-495B-9101-BF9037DEB28B' \
     -d $'{
  "data": {
    "type": "events",
    "attributes": {
      "object": "beacon-region",
      "action": "enter",
      "device": {
        "os-name": "Android",
        "notifications-enabled": true,
        "sdk-version": "1.9.0",
        "model": "iPhone7,2",
        "os-version": "10.1.0",
        "token": "111aaaaa"
      },
      "user": {
        "identifier": "2273F676-DEED-495B-9101-BF9037DEB28B",
        "string": "a string",
        "bool": true,
        "string-arr": ["1.9.0"],
        "double": 3.1415,
        "int": 42,
        "ts": "2017-09-16T18:14:05.971Z",
        "null": null
      },
      "major-number": 1,
      "uuid": "AE7A6ED1-C251-4CF2-847B-AB86B7E2E4CB",
      "minor-number": 1,
      "timestamp": "2017-09-16T18:14:05.971Z"
    }
  }
}'
```

### `/v1/events` beacon-region/enter

```
INSERT INTO beacon_configurations (account_id,type,title,uuid,major,minor) VALUES (1, 'IBeaconConfiguration', 'beacon', 'AE7A6ED1-C251-4CF2-847B-AB86B7E2E4CB', 1,1);
INSERT INTO message_templates (account_id,type,title,notification_text,published,archived,save_to_inbox,date_schedule,time_schedule,trigger_event_id,content_type,website_url,limits,created_at,updated_at) VALUES(1,'ProximityMessageTemplate', 'Unknown','Beacon','t','f','t','(,)','[0,1441)',22,'website','https://google.ca','{"{\"message_limit\": 1, \"number_of_days\": 1}"}','2016-08-20 10:37:40.364801', '2016-08-20 10:37:40.364801');
```

```
## Create Event
curl -X "POST" "https://api.staging.rover.io/v1/events" \
     -H 'x-rover-api-key: 14509a14260f0f0d0beabdc8f64f752c' \
     -H 'x-rover-device-id: 2273F676-DEED-495B-9101-BF9037DEB28C' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "data": {
    "type": "events",
    "attributes": {
      "object": "beacon-region",
      "action": "enter",
      "longitude": -78.115514,
      "device": {
        "os-name": "iOS",
        "notifications-enabled": true,
        "sdk-version": "1.9.0",
        "model": "iPhone7,2",
        "os-version": "10.1.0",
        "token": "111aaaaa"
      },
      "major-number": 1,
      "uuid": "B9407F30-F5F8-466E-AFF9-25556B57FE6A",
      "latitude": 42.111317,
      "minor-number": 1,
      "accuracy": 200,
      "timestamp": "2017-09-16T18:14:05.971Z"
    }
  }
}'

```
