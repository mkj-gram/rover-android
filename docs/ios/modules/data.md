---
title: RoverData
permalink: /ios/modules/data/
layout: module
secondary_navigation: ios
system_frameworks:
    - SystemConfiguration
    - UIKit
    - zlib
dependencies:
    - name: RoverFoundation
      url: /ios/modules/foundation/
---

# RoverData

The RoverData module contains the functionality for communicating with the Rover [GraphQL API](https://api.rover.io/graphql). Data is sent _to_ Rover through events added to the <a href="{{ site.baseurl }}{% link ios/services/event-queue.md %}">`EventQueue`</a>. Data is retrieved _from_ Rover by fetching state using the <a href="{{ site.baseurl }}{% link ios/services/state-fetcher.md %}">`StateFetcher`</a>.

---

## Assembler

```swift
Rover.initialize(assemblers: [
    //...
    DataAssembler(accountToken: "YOUR_ACCOUNT_TOKEN", 
        endpoint: URL(string: "https://api.rover.io/graphql")!, 
        flushEventsAt: 20, 
        flushEventsInterval: 30.0, 
        maxEventBatchSize: 100, 
        maxEventQueueSize: 1000, 
        isAutoFetchEnabled: true)
])
```

### `accountToken: String` 

(Required) Your Rover SDK token. This is used by the <a href="{{ site.baseurl }}{% link ios/services/graphql-client.md %}">`GraphQLClient`</a> to associate all network requests with your Rover account. 

<p class="read-more">
    {% include icons/book.svg %}
    Details on where to find this value are discussed in the <a href="{{ site.baseurl }}{% link ios/installation-initialization.md %}">Installation and Initialization</a> guide.
</p>

### `endpoint: URL`

(Optional) The endpoint used by the GraphQL server used to send and fetch data. The default value is Rover's production [GraphQL API](https://api.rover.io/graphql) and you almost certainly don't want to change this.

### `flushEventsAt: Int`

(Optional) When the <a href="{{ site.baseurl }}{% link ios/services/event-queue.md %}">EventQueue</a> size fills to the `flushEventsAt` quantity it will immediately flush its contents to the server. The default value is 20.

### `flushEventsInterval: Double`

(Optional) While the application is active, the <a href="{{ site.baseurl }}{% link ios/services/event-queue.md %}">EventQueue</a> runs a repeating timer and flushes its contents when the timer fires. The `flushEventsInterval` defines the duration between flushes in seconds. The default value is 30.

### `maxEventsBatchSize: Int`

(Optional) The maximum number of events that can be sent to the server at a time. If the <a href="{{ site.baseurl }}{% link ios/services/event-queue.md %}">EventQueue</a> contains more than this amount, it will cap the batch size and send the remaining events in the next flush. The default value is 100.

### `maxEventsQueueSize: Int`

(Optional) The maximum capacity of the <a href="{{ site.baseurl }}{% link ios/services/event-queue.md %}">EventQueue</a>. If the `EventQueue` reaches this capacity, and a new event is added, it will remove the oldest event first. The default value is 1000.

### `isAutoFetchEnabled: Bool`

(Optional) When `isAutoFetchEnabled` is `true`, the RoverData module will fetch the current state from the server each time the app becomes active. The default value is `true`.

---

## Services

The following services are defined in the RoverData module and are registered by the `DataAssembler`:

* <a href="{{ site.baseurl }}{% link ios/services/device-attributes.md %}">DeviceAttributes</a>
* <a href="{{ site.baseurl }}{% link ios/services/event-queue.md %}">EventQueue</a>
* <a href="{{ site.baseurl }}{% link ios/services/graphql-client.md %}">GraphQLClient</a>
* <a href="{{ site.baseurl }}{% link ios/services/state-fetcher.md %}">StateFetcher</a>
* <a href="{{ site.baseurl }}{% link ios/services/token-manager.md %}">TokenManager</a>
