# Analytics

Captures and stores various events from the Rover iOS and Android SDKs as well as internal events from other services. It provides pre-defined reports on these events through grpc

## Collector

Listens to multiple kafka streams including the event pipeline and notification service processing messages in batches or one by one, placing them in influxdb for later retrieval.


## Service

Exposes a simple grpc service with a set of pre-defined reports that can be run. Some of these reports include the metrics:
- Notification Sent
    - Delivered
    - Unreachable
    - Invalid
- App Installed
- Experience Opened
- Experience Block clicked
- etc...