
### Prereq

```
rake elasticsearch:create_indexes

export ROVER_API_TOKEN=f9bee99c96f30269112a6a78e62cc8afc5037df5
export PORT=`docker port docker_content-api_run_1|cut -f2 -d:`

```

## Create Account

- automatically creates ios_platform and android_platform

```
curl -H 'Content-Type: application/json' http://localhost:$PORT/v1/registrations --data-binary '{"data":{"attributes":{"email":"test7@rover.io","name":"My Name","organization":"My Company","password":"123456"},"type":"registrations"}}'
{"data":{"id":"1008","type":"registrations","attributes":{"name":"My Name","email":"user1@company.com","organization":"My Company"}}}
```

## Certificate IDS

- TODO: get the ids from postgres

## Get API Token

TODO: with `server` permission scopes from postgres DB


# Android platforms

- Create

NOTE: not needed as those are created with account creation above!

```
cat <<EOF |curl -v -XPOST "http://localhost:$PORT/v1/android-platforms.json" -H "X-Rover-Api-Key:$ROVER_API_TOKEN" -H 'Content-Type: application/json' --data-binary @-
{
  "data": {
    "attributes": {
      "api_key": "api_key",
      "sender_id": "sender_id",
      "title": "a_title",
      "package_name": "package_name"
    },
    "type": "android_platforms"
  }
}
EOF
```

- Update 

```
cat <<EOF |curl -v -XPATCH "http://localhost:$PORT/v1/android-platforms/6.json" -H "X-Rover-Api-Key:$ROVER_API_TOKEN" -H 'Content-Type: application/json' --data-binary @-
{
  "data": {
    "attributes": {
      "api_key": "api_key2",
      "sender_id": "sender_id2",
      "title": "a_title2",
      "package_name": "package_name2"
    },
    "type": "android_platforms"
  }
}
EOF

{"data":{"type":"android-platforms","id":"4","attributes":{"api-key":"api_key2","sender-id":"sender_id2","messaging-token":null,"package-name":"package_name2","sha256-cert-fingerprints":null}}}
```

- Clear

```
curl -v -XDELETE "http://localhost:$PORT/v1/android-platforms/6.json" -H "X-Rover-Api-Key:$ROVER_API_TOKEN"
```

- Show

```
curl -v "http://localhost:$PORT/v1/android-platforms/6.json"  -H "X-Rover-Api-Key:$ROVER_API_TOKEN" -H 'Content-Type: application/json'
{"data":{"type":"android-platforms","id":"4","attributes":{"api-key":"api_key2","sender-id":"sender_id2","messaging-token":null,"package-name":"package_name2","sha256-cert-fingerprints":null}}}
```


# IOS platforms

- Update
```
curl -v -XPOST "http://localhost:$PORT/v1/ios-platforms/8/certificate" -H "X-Rover-Api-Key:$ROVER_API_TOKEN" -F "certificate=@$PWD/notification/grpc/testdata/io.rover.Bagel.p12;type=application/x-pkcs12" -F passphrase=""
{"data":{"type":"ios-platforms","id":"8","attributes":{"name":"My Company","bundle-id":"io.rover.Bagel","certificate-expires-at":"2018-10-28T17:15:13.000Z","certificate-filename":"io.rover.Bagel.p12","app-id-prefix":null,"app-store-id":null}}}
```

- Clear
```
curl -v -XDELETE "http://localhost:$PORT/v1/ios-platforms/8/certificate.json" -H "X-Rover-Api-Key:$ROVER_API_TOKEN"
{"data":{"type":"ios-platforms","id":"8","attributes":{"name":"My Company","bundle-id":"","certificate-expires-at":null,"certificate-filename":null,"app-id-prefix":null,"app-store-id":null}}}
```
