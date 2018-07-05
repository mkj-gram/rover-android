---
title: Deep and Universal Links
permalink: /android/deep-universal-links/
layout: guide
secondary_navigation: android
required_modules:
    - Core
    - Notifications
tertiary_navigation:
    - name: Add Link Launch Activity to your Manifest
      anchor: add-link-launch-activity-to-your-manifest
    - name: Deep Links
      anchor: deep-links
    - name: Universal Links
      anchor: universal-links
---

# Deep and Universal Links

Rover supports launching Experiences from both deep and universal links.

Deep links are for URIs that bear a custom schema specific to your app:

    rv-myapp://presentExperience=…

Universal links are for URIs that are valid web URLs that your app can also
handle in addition to being viewable in a vanilla web browser:

    https://myapp.rover.io/…

<aside class="further-reading">
    <a href="https://developer.android.com/training/app-links/deep-linking">Android documentation: Create Deep Links to App Content</a>
</aside>

---

## Add Link Launch Activity to your Manifest

On Android, mapping any URIs to your application must always be done with Intent
Filters in your Manifest.  With Rover it is no different.

Rover provides a headless activity that accepts any Rover-powered deep or
universal link, `TransientLinkLaunchActivity`.

We’ll add an be setting up an Activity entry in your `AndroidManifest.xml` with
three intent filters: for deep links, one for universal links, and one for https
universal links.  This activity does not display anything; it will immediately
open the appropriate content.

First add the Activity entry to the manifest:

```xml
<activity android:name="io.rover.experiences.ui.TransientLinkLaunchActivity">
    <!-- The below intent filters will go here, read on -->
</activity>
```

---

## Deep Links

Rover-powered deep links for your app are always formatted as `rv-myapp`.

First, add an intent filter for your deep links to the entry for the Activity we
added above, given that your app deep link slug is `myapp`:

```xml
<!-- for deep links -->
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="rv-myapp" />
</intent-filter>
```

---

## Universal Links

Rover-powered universal for your app are always formatted as
`https://myapp.rover.io/AN-EXPERIENCE-SLUG`.

Universal links are HTTP(s) links that are hosted by Rover, offering similar
functionality as deep links (but only displaying Rover Experiences), but unlike
deep links they can fall back to a web-powered version of your Experience when
viewed on a device without your app installed .

The intent filter for universal links, given that your app universal link domain
name is `my app.rover.io`:

```xml
<!-- for http universal links/app links -->
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="http" android:host="myapp.rover.io" />
</intent-filter>
```

And then, for https:

```xml
<!-- for https universal links/app links -->
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT"/>
    <category android:name="android.intent.category.BROWSABLE" />

    <data android:scheme="https" android:host="myapp.rover.io" />
</intent-filter>
```

<aside class="advanced">
Android has an additional feature, called <a
href="https://developer.android.com/training/app-links/verify-site-associations">App
Links</a>, in which if the host for a universal link includes a special bit of
server-side attestation, your app will be the automatic default to open a given
universal link.
<br><br>
Because Rover universal links are hosted automatically by Rover for you, this is
handled automatically.  No action is required on your part.
</aside>


