---
title: Core
permalink: /android/modules/core/
layout: module
secondary_navigation: android
---

# Core

The Core module contains common services, types, and utilities used by the other
Rover modules.  These include the dependency injection framwork, the shared
Rover instance, the events queue, and so on.  Every other module depends on it.

---

## Assembler

```kotlin
Rover.initialize(
    CoreAssembler(accountToken = "MY_API_KEY")
)
```

### `accountToken: String`

(Required) Your Rover API account sdk token.  Can be found in the Rover Settings
app under Account Settings.

### `application: Application`

(Required) Your Android
[Application](https://developer.android.com/reference/android/app/Application)
object.

### `deepLinkSchemeSlug: String`

(Required) Rover deep links are customized for each app in this way:
     
    rv-myapp://...

You must select an appropriate slug without spaces or special characters to be
used in place of `myapp` above.  You must also configure this in your Rover
settings.

You should also consider adding the handler to the manifest.  While this is not needed for any Rover functionality to work, it is required for clickable deep/universal links to work from anywhere else.

### `chromeTabBackgroundColor: Int`

(Optional) An ARGB int color (typical on Android) that is used when Rover is
asked to present a website within the app (hosted within a an Android [Custom
Tab](https://developer.chrome.com/multidevice/android/customtabs)).  In many
cases it is appropriate to use the colour you use for your app toolbars.

### `openAppIntent: Intent?`

(Optional) Specify an Intent that opens your app.  Defaults to the Activity you set as your launch activity in your manifest.
