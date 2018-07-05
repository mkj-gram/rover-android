---
title: Notification Sent
layout: guide
permalink: /big-query/notification-sent/
secondary_navigation: big-query
---

# Notification Sent

The Notification Sent event is triggered when a message's notification is sent to a device through APNS (for iOS devices) or FCM (for Android devices).

---

## Table Schema

Notification Sent events are stored in BigQuery in the `notification_sent` table. The following is a detailed description of each column in the table grouped by data model.

<aside class="important">
Any columns marked as <span class="deprecated">Deprecated</span> are no longer in-use and should not be used in reports.</aside>

### Event

Properties of the Notification Sent event.

| Column | Description |
| :--- | :--- |
| event.timestamp | A UNIX timestamp \(seconds since January 1st, 1970 at UTC\) indicating the time the event occurred.  |
| event.triggered_event_id | <span class="deprecated">Deprecated</span> No longer in use. |

### Message

The individual message/notification that was sent to the user.

{% include big-query/message-columns.md %}

### Message Template

The message "template" is the message that was authored in the [Messages app](https://app.rover.io/messages) to which the individual message/notification was generated from.

{% include big-query/message-template-columns.md %}

### Place

For proximity messages only – the place associated with the geofence that triggered the message/notification, or the place associated with the beacon that triggered the message/notification.

{% include big-query/place-columns.md %}

### Configuration

For proximity messages only – the beacon configuration associated with the beacon that triggered the message/notification.

{% include big-query/configuration-columns.md %}

{% include big-query/device-columns.md %}

{% include big-query/customer-columns.md %}