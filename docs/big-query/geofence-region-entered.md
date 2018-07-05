---
title: Geofence Region Entered
layout: guide
permalink: /big-query/geofence-region-entered/
secondary_navigation: big-query
---

# Geofence Region Entered

The Geofence Region Entered event is triggered anytime a user enters a geofence that the device has been monitoring for.

---

## Table Schema

Geofence Region Entered events are stored in BigQuery in the `geofence_region_enter` table. The following is a detailed description of each column in the table grouped by data model.

<aside class="important">
Any columns marked as <span class="deprecated">Deprecated</span> are no longer in-use and should not be used in reports.</aside>

### Event

Properties of the Geofence Region Entered event.

| Column | Description |
| :--- | :--- |
| event.timestamp | A UNIX timestamp \(seconds since January 1st, 1970 at UTC\) indicating the time the event occurred.  |
| event.attributes.latitude | The latitude of the geofence. |
| event.attributes.longitude | The longitude of the geofence. |
| event.attributes.radius | The radius of the geofence. |
| event.attributes.identifier | A unique identifier for the geofence region which is used by the [CLLocationManager](https://developer.apple.com/documentation/corelocation/cllocationmanager). |
| event.attributes.timestamp | <span class="deprecated">Deprecated</span> Use the event.timestamp column instead. |

### Place

The Place created in the [Proximity App](https://app.rover.io/proximity) that is associated with the geofence region that was entered.

{% include big-query/place-columns.md %}

{% include big-query/device-columns.md %}

{% include big-query/customer-columns.md %}