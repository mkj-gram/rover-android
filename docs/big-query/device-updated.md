---
title: Device Updated
layout: guide
permalink: /big-query/device-updated/
secondary_navigation: big-query
---

# Device Updated

The Device Updated event is triggered anytime a property of the device changes, such as the push token or a customer trait.

---

## Table Schema

Device Updated events are stored in BigQuery in the `device_update` table. The following is a detailed description of each column in the table grouped by data model.

<aside class="important">
Any columns marked as <span class="deprecated">Deprecated</span> are no longer in-use and should not be used in reports.</aside>

### Event

Properties of the Device Updated event.

| Column | Description |
| :--- | :--- |
| event.timestamp | A UNIX timestamp \(seconds since January 1st, 1970 at UTC\) indicating the time the event occurred.  |
| event.attributes.timestamp | <span class="deprecated">Deprecated</span> Use the event.timestamp column instead. |

{% include big-query/device-columns.md %}

{% include big-query/customer-columns.md %}