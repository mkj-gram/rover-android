---
title: Push Notifications
permalink: /ios/push-notifications/
layout: guide
secondary_navigation: ios
required_modules:
    - RoverFoundation
    - RoverData
    - RoverUI
    - RoverNotifications
tertiary_navigation:
    - name: Enable Notifications
      anchor: enable-notifications
    - name: Device Token
      anchor: device-token
    - name: Requesting Authorization
      anchor: requesting-authorization
    - name: Handling Notifications
      anchor: handling-notifications
    - name: Notification Extension
      anchor: notification-extension
---

# Push Notifications

This guide walks you through setting up the Rover SDK in your app to enable push notifications.

---

## Enable Notifications

The first step is to add the Push Notifications feature to your App ID and the Push Notifications entitlement to your app. This is done from within Xcode. Open your Xcode project or workspace and select your app from the Project navigator. Then select your app's _target_ and the "Capabilities" tab.

![Xcode Capabilities Tab]({{ "/assets/ios/push-notifications/xcode-capabilities-tab.jpg" | absolute_url }})

Scroll down to the bottom of the list. Find the Push Notifications capability and enable it. After a brief wait, you should see two confirmation checkmarks.

![Enable Push Notifications Capability]({{ "/assets/ios/push-notifications/enable-push-notifications-capability.jpg" | absolute_url }})

---

## Device Token

Before a user of your app can receive remote notifications, the device must register itself with the [Apple Push Notification Service (APNS)](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html#//apple_ref/doc/uid/TP40008194-CH8-SW1). After successful registration, a unique token is returned that can be used to identify the device to APNS. Rover uses this token to send remote notifications to your users through your app. In order to enable this functionality you must perform the steps necessary to register each device with APNS and pass the resulting token to the Rover SDK.

### Register with APNS

The first step is to initiate the APNS registration process by calling the [`registerForRemoteNotifications()`](https://developer.apple.com/documentation/uikit/uiapplication/1623078-registerforremotenotifications) method on the application object from within your app delegate's `application(_:didFinishLaunchingWithOptions:)` method.

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        
    // Register to receive remote notifications via Apple Push Notification service.
    application.registerForRemoteNotifications()
    return true
}
```

<aside class="important">
    It's imperative that your application call the <code>registerForRemoteNotifications()</code> <em>every</em> time your application launches. APNS will occasionally invalidate device tokens and if you do not call this method <em>every</em> time in your <code>application(_:didFinishLaunchingWithOptions:)</code> method, you will miss the opportunity to capture a new token for those devices.
</aside>

### Capture the Token

After succesfully registering with APNS your app delegate's [`application(_:didRegisterForRemoteNotificationsWithDeviceToken:)`](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1622958-application) method will be called. The value of the `deviceToken` parameter is the token Rover needs to be able to send remote notifications to the device. To pass the token to the Rover SDK, resolve an instance of <a href="{{ site.baseurl }}{% link ios/services/token-manager.md %}">`TokenManager`</a> and call its `setToken(_:)` method.

<!-- To learn more about resolving Rover services, the <span class="missing">[Resolving Services](#)</span> guide. -->

```swift
func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    Rover.shared!.resolve(TokenManager.self)?.setToken(deviceToken)
}
```

### 💥 Crash Early

The above sample code intentionally _force unwraps_ the `Rover.shared` singleton. It is imperative that Rover has been initialized _before_ the `application(_:didRegisterForRemoteNotificationsWithDeviceToken:)` method is called otherwise you will have missed the opportunity the capture the device's token.

If you have taken the recommended approach of initializing the Rover SDK in your `application(_:didFinishLaunchingWithOptions:)` method then the `Rover.shared` singleton will always be initialized before the `application(_:didRegisterForRemoteNotificationsWithDeviceToken:)` method is called. If `Rover.shared` is `nil` at this point then something has gone wrong. We recommend adopting the "crash early" approach by force-unwrapping the `Rover.shared` singleton to identify problems as soon as possible.

See the <a href="{{ site.baseurl }}{% link ios/installation-initialization.md %}">Installation and Initialization</a> guide for more information on initialization.

<aside class="advanced">
    If your application can not initialize Rover in your <code>AppDelegate</code>'s <code>application(_:didFinishLaunchingWithOptions:)</code> method then you will need to do some extra work to ensure you do not miss the opportunity to capture the device's token. See the <a href="#">Asynchronous Initialization</a> guide in the Advanced section.
</aside>

---

## Requesting Authorization

After enabling notifications and capturing the device token, everything is in place for Rover to deliver remote notifications to your app. However, before your application can display an alert, badge your app's icon, or play a sound, it must request authorization from the user.

### Request Authorization at Launch Time

The simplest approach is to request authorization in your app delegate's `application(_:didFinishLaunchingWithOptions:)` method. Get the shared [`UNUserNotificationCenter`](https://developer.apple.com/documentation/usernotifications/unusernotificationcenter) object and call its [`requestAuthorization(options:completionHandler:)`](https://developer.apple.com/documentation/usernotifications/unusernotificationcenter/1649527-requestauthorization) method.

```swift
import UserNotifications

let center = UNUserNotificationCenter.current()

// Request permission to display alerts, badge your app's icon and play sounds.
center.requestAuthorization(options: [.alert, .badge, .sound]) { (granted, error) in
    
}
```

The first time your app makes this authorization request, the operating system will prompt the user for permission to display notifications. The user's response is saved and subsequent requests will _not_ prompt the user again. This simplifies your code as you do not have to check first to see if the user has already given permission before making this call. In other words, there is no negative consequence to calling this method _every_ time your app launches.

### Deferring Authorization

As mentioned, the operating system saves the user's response to an authorization request and subsequent requests will _not_ prompt the user again. While this simplifies your code, it also means you only have one attempt at getting permission from your user.

A common pattern when launching an app for the first time is to go through an "onboarding experience" and many apps integrate the notification authorization process into the onboarding. A best-practice has emerged where the user is presented with a screen explaining the benefits of authorizing notifications _before_ the request has been made. This "pre-auth" screen usually asks the user if they would like to receive notifications and presents the user with two buttons: "Yes" and "Maybe later". The notification request is only made if user taps the "Yes" button. If they tap  "Maybe later" the onboarding process continues without requesting authorization, giving your app the opportunity to ask again at another time.

<aside class="info">
    Apple announced changes to the way notifications are authorized in iOS 12 called Provisional Notifications. As part of the changes an explicit request to accept notifications may no longer be required and the best practices discussed above might change. To lean more watch Apple's WWDC 2018 video <a href="https://developer.apple.com/videos/play/wwdc2018/710/">What’s New in User Notifications</a>.
</aside>

---

## Handling Notifications

For your application to respond when a user taps a notification, or to process notifications that arrive when your app is running in the foreground, you assign a [`delegate`](https://developer.apple.com/documentation/usernotifications/unusernotificationcenter/1649522-delegate) object to the shared `UNUserNotificationCenter`. This _must_ be done before your app finishes launching or you might miss incoming notifications. The most common approach is to use your existing app delegate.

### Assign your App Delegate

First, extend your app delegate to conform to `UNUserNotificationCenterDelegate`.

```swift
import UserNotifications

extension AppDelegate: UNUserNotificationCenterDelegate {
    // ...
}
```

Next assign your app as the delegate for the shared `UNUserNotificationCenter` from within your `application(_:didFinishLaunchingWithOptions:)` method.

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
    UNUserNotificationCenter.current().delegate = self
    return true
}
```

### Responding to Taps

Notifications sent from Rover have an expected action to be taken when the user taps the notification. For example a notification might launch a Rover Experience when it is tapped, or present a website. The desired behavior is defined in the [Campaigns app](https://app.rover.io/campaigns) by the user who authors the notification campaign. 

In order to execute the expected behavior you must implement the [`userNotificationCenter(_:didReceive:withCompletionHandler:)`](https://developer.apple.com/documentation/usernotifications/unusernotificationcenterdelegate/1649501-usernotificationcenter) method in your `UNUserNotificationCenter` delegate and ask Rover to handle the notification.

```swift
func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {

    // Resolve the NotificationHandler and execute the intended behavior
    Rover.shared?.resolve(NotificationHandler.self)?.handle(response, completionHandler: completionHandler)
}
```

The <a href="{{ site.baseurl }}{% link ios/services/notification-handler.md %}">`NotificationHandler`</a> service in the above code sample inspects the payload of the notification to determine the intended behavior and executes it. 

<!-- For more advanced use cases see <span class="missing">[Asynchronous Notification Handling](#)</span> and <span class="missing">[Multiple Notification Providers](#)</span> in the Advanced section of the guides. -->

### Foreground Notifications

If a notification is received when your app is in the foreground, the default behavior on iOS is to ignore it. To opt-in to displaying notifications when your app is in the foreground, implement the [`userNotificationCenter(_:willPresent:withCompletionHandler:)`](https://developer.apple.com/documentation/usernotifications/unusernotificationcenterdelegate/1649518-usernotificationcenter) method in your `UNUserNotificationCenter` delegate and call the `completionHandler`.

```swift
func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {

    // Treat this notification the same as if the app was in the background
    completionHandler([.badge, .sound, .alert])
}
```

---

## Notification Extension

The Rover SDK relies on a [`UNNotificationServiceExtension`](https://developer.apple.com/documentation/usernotifications/unnotificationserviceextension) for two features: 

1. Adding rich media (images, videos and audio clips) to notifications.
2. Tracking "influenced opens".

If you wish to take advantage of either of these features you will need to add `UNNotificationServiceExtension` to your app.

Select your project in the Xcode Project navigator then click the plus (+) icon at the bottom of the target list to add a new target. 

![New Target]({{ "/assets/ios/push-notifications/new-target.jpg" | absolute_url }})

In the resulting modal type "service" into the search field to select the Notification Service Extension and then click Next.

![Service Extension]({{ "/assets/ios/push-notifications/service-extension.jpg" | absolute_url }})

Name the new target NotificationService and click "Finish".

![Service Name]({{ "/assets/ios/push-notifications/service-name.jpg" | absolute_url }})

If you see a prompt asking you to activate the scheme click Cancel. This ensures Xcode will continue debugging your app instead of just the notification service extension.

![Activate Scheme]({{ "/assets/ios/push-notifications/activate-scheme.jpg" | absolute_url }})

Select your app target (not your extension) from the list of targets, choose the Capabilities tab and turn on App Groups.

![App Groups]({{ "/assets/ios/push-notifications/app-groups.jpg" | absolute_url }})

Name your app group by prepending "group." to your bundle identifier. E.g. "group.com.example.My-App. 

![Container Name]({{ "/assets/ios/push-notifications/container-name.jpg" | absolute_url }})

Finally select your extension target in the list of targets. You should see the same group you added to your app in the list of available App Groups. You may need to click the refresh icon for it to show up. Enable the app group for your extension.

![Container Name]({{ "/assets/ios/push-notifications/enable-group-in-extension.jpg" | absolute_url }})

### RoverAppExtensions

In addition to the main Rover SDK there is a separate framework called RoverAppExtensions. This framework contains only the app extension API and is therefore safe to use in your newly create extension. 

If you are using Cocoapods you will need to add a new entry to your `Podfile`:

```ruby
target 'NotificationService' do
  use_frameworks!

  pod 'RoverAppExtensions', '~> 2.0'
end
```

Then run `pod install` from your project directory.

If you are using Carthage, look in your Carthage/Build folder and add the `RoverAppExtensions`  and the `RoverFoundation` frameworks to your `NotificationService` target.

### NotificationExtensionHelper

When you created the new service target Xcode created a corresponding class named `NotificationService` with a sample implementation. Open the class and import `RoverAppExtensions`.

```swift
import RoverAppExtensions
```

Then replace the implementation of `didReceive(_:withContentHandler:)` method with the following, substituting `YOUR_APP_GROUP` with the name of your actual app group:

```swift
override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
    self.contentHandler = contentHandler
    bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
    
    if let bestAttemptContent = bestAttemptContent {
        NotificationExtensionHelper(appGroup: "YOUR_APP_GROUP")?.didReceive(request, withContent: bestAttemptContent)
        contentHandler(bestAttemptContent)
    }
}
```

The last step is to update your Rover initialization code to pass the `NotificationAssembler` the name of the app group you just created.

```swift
Rover.initialize(assemblers: [
    // ...
    NotificationsAssembler(appGroup: "group.io.rover.inbox")
])
```
