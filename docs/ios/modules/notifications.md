---
title: RoverNotifications
permalink: /ios/modules/notifications/
layout: module
secondary_navigation: ios
system_frameworks:
    - UIKit
    - UserNotifications
dependencies:
    - name: RoverFoundation
      url: /ios/modules/foundation/
    - name: RoverData
      url: /ios/modules/data/
    - name: RoverUI
      url: /ios/modules/ui/
---

# RoverNotifications

The RoverNotifications module contains all the functionality for receiving, tracking, displaying and handling notifications. It also contains the `NotificationCenter` along with the deep link support for presenting it.

---

## Assembler

```swift
Rover.initialize(assemblers: [
    //...
    NotificationsAssembler(appGroup: nil, 
        isInfluenceTrackingEnabled: true, 
        influenceTime: 120, 
        maxNotifications: 200)
])
```

### `appGroup: String?` 

(Optional) A domain identifier used to share data between your app and a [`UNNotificationServiceExtension`](https://developer.apple.com/documentation/usernotifications/unnotificationserviceextension). This is required for the <a href="{{ site.baseurl }}{% link ios/services/influence-tracker.md %}">`InfluenceTracker`</a> to be able to track influenced opens. The default value is `nil` which means if you don't set this to the correct value influenced open tracking will not function.

<p class="read-more">
    {% include icons/book.svg %}
    Details on how to setup a <code>UNNotificationServiceExtension</code> and use the <code>appGroup</code> parameter can be found in the <a href="{{ site.baseurl }}{% link ios/push-notifications.md %}#notification-extension">Push Notifications</a> guide.
</p>

### `isInfluenceTrackingEnabled: Bool`

(Optional) When `isInfluenceTrackingEnabled` is `true` the RoverNotifications module will automatically track influenced opens. This relies on the `appGroup` parameter being set properly as discussed above. The default value is true.

### `influenceTime: Int`

(Optional) An app is considered influenced when it is opened within a short period of time after a notification is received. The `influenceTime` defines the period of time in seconds. If the app is opened _after_ the `influenceTime`, an influenced open event is not tracked. The default value is 120 (two minutes).

### `maxNotifications: Int`

(Optional) The maximum number of notifications to retain in the <a href="{{ site.baseurl }}{% link ios/services/notification-store.md %}">`NotificationStore`</a>. Notifications are stored on disk so this value limits the amount of space fetched notifications can occupy. When the maximum number is reached, notifications are purged using a [FIFO](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)) strategy. The default value is 200.

---

## Services

The following services are defined in the RoverNotifications module and are registered by the `NotificationsAssembler`:

* <a href="{{ site.baseurl }}{% link ios/services/influence-tracker.md %}">InfluenceTracker</a>
* <a href="{{ site.baseurl }}{% link ios/services/notification-handler.md %}">NotificationHandler</a>
* <a href="{{ site.baseurl }}{% link ios/services/notification-store.md %}">NotificationStore</a>
