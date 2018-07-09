---
title: Location and Proximity
permalink: /android/location-proximity/
layout: guide
secondary_navigation: android
required_modules:
    - Core
    - Location
tertiary_navigation:
    - name: Initialization
      anchor: initialization
    - name: Requesting Permission from your User
      anchor: requesting-permission-from-your-user
---

# Location and Proximity

The Location module brings Rover-powered geofence monitoring, Bluetooth Low
Energy beacon monitoring, and general location tracking to your app, when your
users grant location permission.  This allows you to automate Rover Campaigns,
triggering on geographic events.

---

## Initialization

By default, the Location module enables all three (geofences, beacon monitoring,
and location tracking) by default.  However, you can opt in or out by setting
parameters on `LocationAssembler` as follows:

```kotlin
Rover.initialize(
    // ...,
    LocationAssembler(
        automaticGeofenceMonitoring = true,
        automaticBeaconMonitoring = true,
        automaticLocationTracking = true
    )
)
```

---

## Requesting Permission from your User

You then need, at an appropriate moment in your product’s user flow, prompt
users to choose whether or not to grant your app ongoing location permission.
You will use the Android permissions framework to do this.

Note that this serves as a check; if the permission has already been granted, it
will not prompt again on subsequent invocations.  Note that it may be necessary
to add it in more than one area: for instance, if you include it in a
shown-only-once on boarding area, it may be necessary to add it to your 'Home'
screen as well.  This is to gracefully handle any changes in the permission
granted to your app, for example if the user decides to clean up the apps
allowed to access their location in their system-wide privacy settings.

Create a helper method for prompting for permission and override the Android
callback template method `onRequestPermissionsResult`:

```kotlin
import android.Manifest
import android.content.Context
import android.support.v4.app.ActivityCompat
import android.support.v4.content.ContextCompat
import android.support.v7.app.AlertDialog
import io.rover.rover.Rover

private fun makePermissionsAttempt() {
    if (ContextCompat.checkSelfPermission(this,
            Manifest.permission.ACCESS_FINE_LOCATION)
        != PackageManager.PERMISSION_GRANTED) {

        // Should we show an explanation?
        if (ActivityCompat.shouldShowRequestPermissionRationale(this,
                Manifest.permission.ACCESS_FINE_LOCATION)) {

            // Show an explanation to the user *asynchronously* -- don't block
            // this thread waiting for the user's response! After the user
            // sees the explanation, try again to request the permission.

            AlertDialog.Builder(this)
                .setMessage("My App would like to use your location for Geofences and Beacons.")
                .setNeutralButton("Got it") { _, _ ->
                    makePermissionsAttempt()
                }
        } else {
            // No explanation needed, we can request the permission.
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                0
            )
            // MY_PERMISSIONS_REQUEST_READ_CONTACTS is an
            // app-defined int constant. The callback method gets the
            // result of the request.
        }
    } else {
        // Permission has already been granted
        Rover.sharedInstance.permissionsNotifier.permissionGranted(
            Manifest.permission.ACCESS_FINE_LOCATION
        )
    }
}

override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
    val perms = permissions.zip(grantResults.toList()).associate { it }

    if(perms[Manifest.permission.ACCESS_FINE_LOCATION] == PackageManager.PERMISSION_GRANTED) {
        Rover.sharedInstance.permissionsNotifier.permissionGranted(
            Manifest.permission.ACCESS_FINE_LOCATION
        )
    }
}
```

Rover will remember that the permission was granted across app restarts and will
gracefully handle the permission being removed, but it remains prudent to
continue checking each time from your main home screen or somewhere similarly
appropriate.

<p class="read-more">
    {% include icons/book.svg %}
    More details on how to properly handle requesting app permissions can be found in the <a href="https://developer.android.com/training/permissions/requesting">Android documentation: Request App Permissions</a>.
</p>
