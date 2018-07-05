---
title: Notification Center
permalink: /android/notification-center/
layout: guide
secondary_navigation: android
required_modules:
    - Core
    - Notifications
tertiary_navigation:
    - name: Install
      anchor: install
---

# Notification Center

The Notifications Center is an Android View bundled with Rover Notifications
module that can display to the user a log of their received notifications, if so
selected in the Campaign that sent those notifications.

---

## Install

The Notification Center is provided as an Android view,
`NotificationCenterListView`, that can be embedded anywhere within your
application.

You may embed it in your Fragment, Activity, or even another custom view with
either layout XML or directly in code.

Embed it in an XML view with:

```xml
<io.rover.notifications.ui.NotificationCenterListView
    android:id="@+id/notificationCenter"
    android:layout_width="match_parent"
    android:layout_height="match_parent"/>
```

Then, from the code side of your Activity or Fragment, in either `onCreate()` or
`onCreateView()` respectively, you will need to provide a reference to the
Activity to the view:

```kotlin
(findViewById(R.id.demoNotificationCentre) as NotificationCenterListView).activity = this
```
