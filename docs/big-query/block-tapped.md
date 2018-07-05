---
title: Block Tapped
layout: guide
permalink: /big-query/block-tapped/
secondary_navigation: big-query
---

# Block Tapped

The Block Tapped event is triggered when a user taps a block in an experience. Usually the block tapped is a button block, but it can also be an image block or any other type of block that has an action assigned to it.

---

## Table Schema

Block Tapped events are stored in BigQuery in the `experience_block_clicked` table. The following is a detailed description of each column in the table grouped by data model.

<aside class="important">
Any columns marked as <span class="deprecated">Deprecated</span> are no longer in-use and should not be used in reports.</aside>

### Event

Properties of the Block Tapped event.

| Column | Description |
| :--- | :--- |
| event.timestamp | A UNIX timestamp \(seconds since January 1st, 1970 at UTC\) indicating the time the event occurred.  |
| event.experience_session_id | <span class="deprecated">Deprecated</span> Use the event.attributes.experience_session_id column instead. |
| event.attributes.experience_id | The ID of the experience the tapped block belongs to. |
| event.attributes.screen_id | The ID of the screen the tapped block belongs to. |
| event.attributes.block_id | The ID of the block that was tapped. |
| event.attributes.block_action.type | The type of action that was taken when the block was tapped. The value in this column will be either "go-to-screen", "open-url" or null if there was no action assigned to the block. |
| event.attributes.block_action.url | If the block action type was "open-url", the value in this column will be the URL that was opened. |
| event.attributes.block_action.screen_id | If the block action type was "go-to-screen", the value in this column will be the ID of the screen that was navigated to. |
| event.attributes.version_id | Each time an experience is published a new version is created. This column stores the ID of the specific version of the experience the tapped block belongs to. |
| event.attributes.experience_session_id | The time between when a user launches an experience and dismisses it is called a session. This column is a unique ID assigned to the session in-which the block was tapped. The session ID is useful for certain reports such as calculating the average time spent engaging with an experience. |
| event.attributes.timestamp | <span class="deprecated">Deprecated</span> Use the event.timestamp column instead. |

### Experience

The experience the tapped block belongs to.

{% include big-query/experience-columns.md %}

### Screen

The screen the tapped block belongs to.

{% include big-query/screen-columns.md %}

### Row

The row the tapped block belongs to.

{% include big-query/row-columns.md %}

### Block

The block that was tapped.

{% include big-query/block-columns.md %}

{% include big-query/device-columns.md %}

{% include big-query/customer-columns.md %}