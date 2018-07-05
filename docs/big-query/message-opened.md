---
title: Message Opened
layout: guide
permalink: /big-query/message-opened/
secondary_navigation: big-query
---

# Message Opened

The Message Opened event is triggered when a message is opened by a user either by tapping/swiping a notification or from the inbox.

---

## Table Schema

Message Opened events are stored in BigQuery in the `message_open` table. The following is a detailed description of each column in the table grouped by data model.

<aside class="important">
Any columns marked as <span class="deprecated">Deprecated</span> are no longer in-use and should not be used in reports.</aside>

### Event

Properties of the Message Opened event.

| Column | Description |
| :--- | :--- |
| event.timestamp | A UNIX timestamp \(seconds since January 1st, 1970 at UTC\) indicating the time the event occurred.  |
| event.source | <span class="deprecated">Deprecated</span> Use event.attributes.source instead. |
| event.attributes.source | Indicates whether the message was opened from the inbox or from a notification. Possible values are "notification" or "inbox". |
| event.attributes.message_id | The ID of the message that was opened. |

### Message

The individual message belonging to the user that was opened.

{% include big-query/message-columns.md %}

### Message Template

The message "template" is the message that was authored in the [Messages app](https://app.rover.io/messages) to which the individual message was generated from.

{% include big-query/message-template-columns.md %}

{% include big-query/device-columns.md %}

{% include big-query/customer-columns.md %}