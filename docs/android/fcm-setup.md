---
title: FCM Setup
permalink: /android/fcm-setup/
layout: guide
secondary_navigation: android
required_modules:
    - Core
    - Notifications
tertiary_navigation:
  - name: Setting up Firebase Cloud Messaging
    anchor: setting-up-firebase-cloud-messaging
  - name: Connect Rover to Firebase Cloud Messaging
    anchor: connect-rover-to-firebase-cloud-messaging
---

# FCM Setup

The Rover [Campaigns app](https://app.rover.io/campaigns) uses Google's
[Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/) to
deliver notifications to your app. In order to authorize Rover communication
with your app through FCM you will need to create an FCM project and upload
its "Server key" to Rover.

---

## Setting up Firebase Cloud Messaging

Head to the [Firebase Console](https://console.firebase.google.com/) and ensure
you are logged in with an appropriate Google account for your project.  Select
"Add a new project", or, if you have already created one, select it.
![Welcome to Firebase screen]({{ "/assets/android/fcm-setup/welcome-to-firebase.png" | absolute_url }})

On the project "Getting Started" page, you can then select "Add Firebase to your
Android app".
![Getting Started screen on Firebase]({{ "/assets/android/fcm-setup/firebase-get-started.png" | absolute_url }})

Fill in your app’s package name and visible name.
![Add Firebase to your Android app]({{ "/assets/android/fcm-setup/add-firebase-to-android.png" | absolute_url }})

Press "Register App".  Google will then direct you to download a
`google-services.json` file, drop it into your Android project’s file tree, and
then direct you to add the Firebase SDK to your app’s `build.gradle` files.

<aside class="advanced">
Note: If you use multiple package names for prod/debug builds, then you can
repeat this process to create multiple apps for each package name within the
single project.  The same google-services.json file will work properly for
both.
</aside>

---

## Connect Rover to Firebase Cloud Messaging

You will then need to retrieve the Firebase Web API key and set it on your Rover
account so that Rover can push notifications through to your app via Firebase.

Click on the gear icon adjacent to "Project Overview" and select Project Settings.
![Firebase Project Overview]({{ "/assets/android/fcm-setup/firebase-project-overview.png" | absolute_url }})

Click the Cloud Messaging tab to view the Server Key. Copy it to your clipboard.
![Firebase Cloud Messaging Settings]({{ "/assets/android/fcm-setup/firebase-cloud-messaging-settings.png" | absolute_url }})

Open your [Rover Dashboard](https://app.rover.io) and select "Settings".
![Rover]({{ "/assets/android/fcm-setup/rover-dashboard.png" | absolute_url }})

Click the "Android" tile on the Account Settings screen.
![Rover Account Settings]({{ "/assets/android/fcm-setup/account-settings.png" | absolute_url }})

From the Android Settings page click the plus (+) icon next to Firebase Cloud Messaging.
![Android Settings]({{ "/assets/android/fcm-setup/android-settings.png" | absolute_url }})

And set the Server Key you copied to your clipboard from Firebase in the second step.
![Set Server Key]({{ "/assets/android/fcm-setup/set-server-key.png" | absolute_url }})

At this point Rover can deliver push notifications meant for your app to FCM.
However, to set up your app and the Rover SDK to receive and handle them, you
will need to proceed to the next step, [Push
Notifications]({{"/android/push-notifications/" | absolute_url }}).