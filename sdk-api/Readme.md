## Setup

```
// SDK-API also requires the account to be present
// token1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa belongs to account=1 so create it
psql -p $PG_PORT -h $PG_HOST -U postgres rover-local -c "insert into accounts  (id, token, share_key, created_at, updated_at) values (1, 'token1aaaaaaa', 'token1', now(), now());"
```


## Testing

### `/v1/events`

```
curl -X "POST" "http://localhost:3100/v1/events" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -H 'x-rover-api-key: token1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' \
     -H 'x-rover-device-id: 2273F676-DEED-495B-9101-BF9037DEB28B' \
     -H 'x-rover-customer-id: ' \
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
