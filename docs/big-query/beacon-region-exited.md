---
title: Beacon Region Exited
layout: guide
permalink: /big-query/beacon-region-exited/
secondary_navigation: big-query
---

# Beacon Region Exited

The Beacon Region Exited event is triggered anytime a user exits the range of a Bluetooth beacon with a configuration that the device has been monitoring for.

---

## Table Schema

Beacon Region Exited events are stored in BigQuery in the `beacon_region_exit` table. The following is a detailed description of each column in the table grouped by data model.

<aside class="important">
Any columns marked as <span class="deprecated">Deprecated</span> are no longer in-use and should not be used in reports.</aside>

### Event

Properties of the Beacon Region Exited event.

| Column | Description |
| :--- | :--- |
| event.timestamp | A UNIX timestamp \(seconds since January 1st, 1970 at UTC\) indicating the time the event occurred.  |
| event.attributes.uuid | The UUID of the beacon region that was exited. |
| event.attributes.major_number | The major number of the beacon region that was exited. This can be null if the device was monitoring for all major numbers. |
| event.attributes.minor_number | The minor number of the beacon region that was exited. This can be null if the device was monitoring for all minor numbers. |
| event.attributes.identifier | A unique identifier for the beacon region which is used by the [CLLocationManager](https://developer.apple.com/documentation/corelocation/cllocationmanager). |
| event.attributes.configuration_id | The ID of a Beacon Configuration in the [Proximity App](https://app.rover.io/proximity) that is associated with the region that was exited. |
| event.attributes.timestamp | <span class="deprecated">Deprecated</span> Use the event.timestamp column instead. |

### Beacon Configuration

The Beacon Configuration created in the [Proximity App](https://app.rover.io/proximity) that is associated with the beacon region that was exited.

{% include big-query/configuration-columns.md %}

### Place

The Place created in the [Proximity App](https://app.rover.io/proximity) that is associated with the beacon region. The Place will be null if the Beacon Configuration was not associated with a Place.

{% include big-query/place-columns.md %}

{% include big-query/device-columns.md %}

{% include big-query/customer-columns.md %}