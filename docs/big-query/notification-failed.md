---
title: Notification Failed
layout: guide
permalink: /big-query/notification-failed/
secondary_navigation: big-query
---

# Notification Failed

The Notification Failed event is triggered when an attempt to send a notification to a device fails.

---

## Table Schema

Notification Failed events are stored in BigQuery in the `notification_failed` table. The following is a detailed description of each column in the table grouped by data model.

<aside class="important">
Any columns marked as <span class="deprecated">Deprecated</span> are no longer in-use and should not be used in reports.</aside>

### Event

Properties of the Notification Failed event.

| Column | Description |
| :--- | :--- |
| event.timestamp | A UNIX timestamp \(seconds since January 1st, 1970 at UTC\) indicating the time the event occurred.  |
| event.triggered_event_id | <span class="deprecated">Deprecated</span> No longer in use. |
| event.errors | A string indicating the reason the notification failed to send. The value of this column will be the error returned from APNS/FCM. Some possible values are: InvalidRegistration, NotRegistered and Unregistered |

### Message

The individual message/notification that attempted to send.

{% include big-query/message-columns.md %}

### Message Template

The message "template" is the message that was authored in the [Messages app](https://app.rover.io/messages) to which the individual message/notification was generated from.

{% include big-query/message-template-columns.md %}

### Place

For proximity messages only – the place associated with the geofence that triggered the message/notification attempt, or the place associated with the beacon that triggered the message/notification attempt.

{% include big-query/place-columns.md %}

### Configuration

For proximity messages only – the beacon configuration associated with the beacon that triggered the message/notification attempt.

{% include big-query/configuration-columns.md %}

{% include big-query/device-columns.md %}

{% include big-query/customer-columns.md %}