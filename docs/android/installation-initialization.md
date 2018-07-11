---
title: Installation and Initialization
permalink: /android/
layout: guide
secondary_navigation: android
tertiary_navigation:
  - name: Install the SDK
    anchor: install-the-sdk
  - name: Initialization
    anchor: initialization
---

# Installation and Initialization

The Rover SDK is a collection of Android libraries written in Kotlin. Instead of
a single monolithic library, the Rover SDK takes a modular approach, allowing
you to include only the functionality relevant to your application. The SDK is
100% open-source and available on
[GitHub](https://github.com/roverplatform/rover-android).

----

## Install the SDK

The first step is to add the library dependencies.  We’ll start with a default
installation, featuring all of the Rover libraries.

Ensure that you have `jcenter` added to the `dependencies` → `repositories` block
of your app-level `build.gradle`:

```groovy
dependencies {
    // ...
    repositories {
        // ...
        jcenter()
    }
}
```

Then add the following to your application-level `build.gradle` file (not the
top level `build.gradle`, but rather your app-level one) in the `dependencies`
block.

```groovy
dependencies {
    // ...
    implementation "io.rover:core:2.0.0"
    implementation "io.rover:notifications:2.0.0"
    implementation "io.rover:experiences:2.0.0"
    implementation "io.rover:location:2.0.0"
    implementation "io.rover:debug:2.0.0"
}
```

It’s an a-la-carte selection; you can leave off modules (other than the first,
`core`, which is always required) that you don’t need for your product.  There
are various reasons why you may not want to include all the Rover libraries in
your project.  For instance, you can save method count and APK size by leaving
off Rover libraries that you don't need.

---

## Initialization

In your app’s <a
href="https://developer.android.com/reference/android/app/Application.html#onCreate()">Application.onCreate</a>
method or anywhere else you prefer to put initialization logic (such as a
dependency injection framework), call `Rover.initialize` with the list of
Assemblers:

```kotlin
Rover.initialize(
    CoreAssembler(
        accountToken = "YOUR_SDK_TOKEN",
        application = this,
        deepLinkSchemeSlug = "myapp"
    ),
    NotificationsAssembler(
        applicationContext = this,
        notificationCenterIntent = Intent(context, MyNotificationCenterActivity::class.java),
        smallIconResId = R.mipmap.my_small_icon,
        resetPushToken = {
            FirebaseInstanceId.getInstance().deleteInstanceId()
            FirebaseInstanceId.getInstance().token
        }
    ),
    ExperiencesAssembler(),
    LocationAssembler(),
    DebugAssembler()
)

Rover.installSaneGlobalHttpCache(application)
```

<aside class="info">

Notice <code>Rover.installSaneGlobalHttpCache()</code>: to keep its footprint
small Rover uses Android’s built-in HTTP client,
<code>HttpsUrlConnection</code>, and a characteristic of that HTTP client is
that its cache must be enabled or disabled globally. Rover requires a working
HTTP client cache, and so asks you to invoke this method here to explicitly
install a cache to ensure that you are not surprised by Rover changing global
configuration.  Note that this will have no impact on the other components of
your app if you use OkHttp/Retrofit or Volley.

</aside>

Wherever you put it, you need to be certain that Rover is initialized before
Android can dispatch an Intent to the app, such as a push notification or deep
link open.

Don’t sweat the parameters for now; they’re in each section of the documentation
for each module.
