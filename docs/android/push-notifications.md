---
title: Push Notifications
permalink: /android/push-notifications/
layout: guide
secondary_navigation: android
required_modules:
    - Core
    - Notifications
tertiary_navigation:
    - name: Firebase Instance ID Receiver
      anchor: firebase-instance-id-receiver
    - name: Firebase Message Receiver
      anchor: firebase-message-receiver
    - name: Firebase Token Clear Callback
      anchor: firebase-token-clear-callback
---

# Push Notifications

This guide walks you through setting up the Rover SDK in your app to enable push
notifications.

<aside class="info">
We have designed the SDK to afford implementers with a high degree of control
and a minimum of magic.  As such, there will be a little bit of boilerplate
required below, but this approach will make it easier for you to debug problems
and manage whatever unusual integration situations might arise in your app,
which is particularly handy when dealing with Google libraries such as FCM.
</aside>

---

## Firebase Instance ID Receiver

The FCM library calls your Firebase Instance ID receiver with your push token,
which Rover needs in order to register your device to receive notifications:

Create a Firebase Instance ID receiver:

```kotlin
import com.google.firebase.iid.FirebaseInstanceId
import com.google.firebase.iid.FirebaseInstanceIdService
import io.rover.notifications.PushReceiverInterface
import io.rover.rover.Rover

class FirebaseInstanceIdReceiver : FirebaseInstanceIdService() {
    override fun onTokenRefresh() {
        Rover.sharedInstance.resolveSingletonOrFail(
            PushReceiverInterface::class.java
        ).onTokenRefresh(
            FirebaseInstanceId.getInstance().token
        )
    }
}
```

And add it to the application's manifest:

```xml
<service android:name="com.myapp.FirebaseInstanceIdReceiver">
    <intent-filter>
        <action android:name="com.google.firebase.INSTANCE_ID_EVENT"/>
    </intent-filter>
</service>
```

---

## Firebase Message Receiver

The FCM library calls your Firebase Message Receiver with the incoming push
notifications themselves.  They need to be delivered to the Rover SDK so they
can be populated into Android's notification drawer and added to the Rover
Notification Center.

Create a Firebase Message Receiver:

```kotlin
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import io.rover.notifications.PushReceiverInterface
import io.rover.rover.Rover

class FirebaseMessageReceiver : FirebaseMessagingService() {
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Rover.sharedInstance.resolveSingletonOrFail(PushReceiverInterface::class.java).onMessageReceivedData(remoteMessage.data)
    }
}
```

And add it to the application’s manifest:

```xml
<service android:name="io.rover.app.inbox.fcm.FirebaseMessageReceiver">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT"/>
    </intent-filter>
</service>
```

<aside class="advanced">
Note that in the event that you already have Firebase Cloud Messaging configured
in your application for receiving non-Rover pushes you can merge the logic above
(that, as you can see, is calling methods on Rover's
<code>PushReceiverInterface</code>) into your existing implementations of the
Instance ID and Message receivers.
</aside>

---

## Firebase Token Clear Callback

Rover may need to request Firebase to reset the push token from time to time,
usually if it is missing.

Because Rover is avoiding directly calling the FCM library itself, you'll need
to pass a closure into `NotificationsAssembler` for `resetPushToken` to allow it
to request Firebase to clear your local Instance ID as needed.  It was already
included in the `Rover.initialize(…)` example given in [Getting
Started](/docs/android/#initialization), but it is repeated here for clarity:

```kotlin
NotificationsAssembler(
    // ...,
    resetPushToken = {
        FirebaseInstanceId.getInstance().deleteInstanceId()
        FirebaseInstanceId.getInstance().token
})
```
