---
title: Message Added to Inbox
layout: guide
permalink: /big-query/message-added-to-inbox/
secondary_navigation: big-query
---

# Message Added to Inbox

The Message Added to Inbox event is triggered when a message is delivered with the "Save to Inbox" option enabled. At the time the message is delivered the user gets a copy of the message added to their inbox and a corresponding Message Added to Inbox event is triggered.

---

## Table Schema

Message Added to Inbox events are stored in BigQuery in the `message_added_to_inbox` table. The following is a detailed description of each column in the table grouped by data model.

<aside class="important">
Any columns marked as <span class="deprecated">Deprecated</span> are no longer in-use and should not be used in reports.</aside>

### Event

Properties of the Message Added to Inbox event.

| Column | Description |
| :--- | :--- |
| event.timestamp | A UNIX timestamp \(seconds since January 1st, 1970 at UTC\) indicating the time the event occurred.  |
| event.triggered_event_id | <span class="deprecated">Deprecated</span> No longer in use. |

### Message

The individual message that was added to the user's inbox.

{% include big-query/message-columns.md %}

### Message Template

The message "template" is the message that was authored in the [Messages app](https://app.rover.io/messages) to which the individual message was generated from.

{% include big-query/message-template-columns.md %}

### Place

For proximity messages only – the place associated with the geofence that triggered the message, or the place associated with the beacon that triggered the message.

{% include big-query/place-columns.md %}

### Configuration

For proximity messages only – the beacon configuration associated with the beacon that triggered the message.

{% include big-query/configuration-columns.md %}

{% include big-query/device-columns.md %}

{% include big-query/customer-columns.md %}