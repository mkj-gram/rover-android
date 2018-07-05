---
title: Experiences
permalink: /android/experiences/
layout: guide
secondary_navigation: android
required_modules:
    - Core
tertiary_navigation:
    - name: Add Experience Host Activity
      anchor: add-experience-host-activity
---

# Experiences

Rover Experiences are provided by this module.

---

## Add Experience Host Activity

Add `StandaloneExperienceHostActivity` to your `AndroidManifest.xml`, setting a
Material theme such that the toolbar will properly display your brand colours:

```xml
<activity
    android:name="io.rover.experiences.ui.containers.StandaloneExperienceHostActivity"
    android:theme="@style/AppTheme.NoActionBar"
/>
```

Note that you must use a theme that disables the built-in Android AppBar because
our view embeds an explicit Android toolbar. Here’s an example definition for
`AppTheme` above:

```xml
<!-- Base application theme. -->
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    <!-- Customize your theme here. -->
    <item name="colorPrimary">@color/myBrandColorPrimary</item>
    <item name="colorPrimaryDark">@color/myBrandColorPrimaryDark</item>
    <item name="colorAccent">@color/myBrandColorAccent</item>
</style>
```

At this point Experiences can be launched through either deep or universal
links, or by Notifications if you have the Notifications module installed and
configured.
