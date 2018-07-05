---
title: App Opened
layout: guide
permalink: /big-query/app-opened/
secondary_navigation: big-query
---

# App Opened

The App Opened event is triggered anytime a user opens the app. Note, because of the way Android works this event is *only* tracked on iOS devices.

---

## Table Schema

App Opened events are stored in BigQuery in the `app_open` table. The following is a detailed description of each column in the table grouped by data model.

<aside class="important">
Any columns marked as <span class="deprecated">Deprecated</span> are no longer in-use and should not be used in reports.</aside>

### Event

Properties of the App Opened event.

| Column | Description |
| :--- | :--- |
| event.timestamp | A UNIX timestamp \(seconds since January 1st, 1970 at UTC\) indicating the time the event occurred.  |
| event.attributes.timestamp | <span class="deprecated">Deprecated</span> Use the event.timestamp column instead. |

{% include big-query/device-columns.md %}

{% include big-query/customer-columns.md %}