---
title: RoverUI
permalink: /ios/modules/ui/
layout: module
secondary_navigation: ios
system_frameworks:
    - SafariServices
dependencies:
    - name: RoverFoundation
      url: /ios/modules/foundation/
    - name: RoverData
      url: /ios/modules/data/
---

# RoverUI

The RoverUI module contains services related to the user interface and the application itself. The services in the RoverUI module are used by other modules that contain UI components.

---

## Assembler

```swift
Rover.initialize(assemblers: [
    //...
    UIAssembler(associatedDomains: ["myapp.rover.io"], 
        urlSchemes: ["rv-myapp"], 
        sessionKeepAliveTime: 30, 
        isLifeCycleTrackingEnabled: true, 
        isVersionTrackingEnabled: true)
])
```

### `associatedDomains: [String]` 

(Optional) When the application processes a [Universal Link](https://developer.apple.com/ios/universal-links/), Rover checks the domain to see if it matches one of the values in this array. If a match is found, Rover will attempt to handle it. Each Rover account has a specific associated domain that is used by the Rover platform to construct URLs for content that is available both in the app and via the browser. The default value is an empty array which means all Universal Links will be ignored by Rover unless you set this value.

<p class="read-more">
    {% include icons/book.svg %}
    Finding your associated domain is explained in the <a href="{{ site.baseurl }}{% link ios/deep-universal-links.md %}">Deep and Universal Links</a> guide.
</p>

### `urlSchemes: [String]`

(Optional) When the application processes a "deep link" Rover checks the URL scheme to see if it matches one of the values in this array. If a match is found, Rover will attempt to handle it. Similar to `associatedDomains`, each Rover account has an assigned URL scheme. The Rover platform uses the assigned URL scheme to construct URIs that invoke various behavior within the Rover SDK such as launching an Experience or presenting the debug settings. The default value is an empty array which means all deep links will be ignored by Rover unless you set this value.

<p class="read-more">
    {% include icons/book.svg %}
    Finding your assigned URL scheme is explained in the <a href="{{ site.baseurl }}{% link ios/deep-universal-links.md %}">Deep and Universal Links</a> guide.
</p>

### `sessionKeepAliveTime: Int`

(Optional) The <a href="{{ site.baseurl }}{% link ios/services/session-controller.md %}">SessionController</a> tracks the amount of time a user spends viewing a `UIViewController` or the application itself. The session is defined as the time between the `UIViewController` being presented and being dismissed. Or the time between the application entering the foreground and entering the background. The `SessionController` treats consecutive sessions with a short window of time between them as the same session. For example, if the user were to quickly close the app and reopen it, it would be considered the same session.  The `sessionKeepAliveTime` is the duration in seconds for which consecutive sessions should be considered the same. The default value is 30.

### `isLifeCycleTrackingEnabled: Bool`

(Optional) When `isLifeCycleTrackingEnabled` is `true` the RoverUI module will automatically track events when the application is opened and closed as well as the duration of each application session. The default value is `true`.

### `isVersionTrackingEnabled: Bool`

(Optional) When `isVersionTrackingEnabled` is `true` the RoverUI module will automatically track even the first time the app is installed and anytime its updated. The default value is `true`.

---

## Services

The following services are defined in the RoverUI module and are registered by the `UIAssembler`:

* <a href="{{ site.baseurl }}{% link ios/services/image-store.md %}">ImageStore</a>
* <a href="{{ site.baseurl }}{% link ios/services/life-cycle-tracker.md %}">LifeCycleTracker</a>
* <a href="{{ site.baseurl }}{% link ios/services/router.md %}">Router</a>
* <a href="{{ site.baseurl }}{% link ios/services/session-controller.md %}">SessionController</a>
* <a href="{{ site.baseurl }}{% link ios/services/version-tracker.md %}">VersionTracker</a>

