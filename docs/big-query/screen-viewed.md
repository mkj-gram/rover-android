---
title: Screen Viewed
layout: guide
permalink: /big-query/screen-viewed/
secondary_navigation: big-query
---

# Screen Viewed

The Screen Viewed event is triggered when a views a screen within an experience. This occurs when the user launches an experience and views the initial "home" screen of the experience as well as when the user taps a button that navigates to another screen in the experience.

---

## Table Schema

Screen Viewed events are stored in BigQuery in the `experience_screen_viewed` table. The following is a detailed description of each column in the table grouped by data model.

<aside class="important">
Any columns marked as <span class="deprecated">Deprecated</span> are no longer in-use and should not be used in reports.</aside>

### Event

Properties of the Screen Viewed event.

| Column | Description |
| :--- | :--- |
| event.timestamp | A UNIX timestamp \(seconds since January 1st, 1970 at UTC\) indicating the time the event occurred.  |
| event.experience_session_id | <span class="deprecated">Deprecated</span> Use the event.attributes.experience_session_id column instead. |
| event.from_screen_id | <span class="deprecated">Deprecated</span> Use the event.attributes.from_screen_id column instead. |
| event.from_block_id | <span class="deprecated">Deprecated</span> Use the event.attributes.from_block_id column instead. |
| event.attributes.experience_id | The ID of the experience the viewed screen belongs to. |
| event.attributes.screen_id | The ID of the viewed screen. |
| event.attributes.version_id | Each time an experience is published a new version is created. This column stores the ID of the specific version of the experience the viewed screen belongs to. |
| event.attributes.experience_session_id | The time between when a user launches an experience and dismisses it is called a session. This column is a unique ID assigned to the session in-which the screen was viewed. The session ID is useful for certain reports such as calculating the average time spent engaging with an experience. |
| event.attributes.from_screen_id | If the screen was navigated to by the user tapping a block, the value stored in this column will be the ID of the screen the tapped block belongs to. |
| event.attributes.from_block_id | If the screen was navigated to by the user tapping a block, the value stored in this column will be the ID of the tapped block. |
| event.attributes.timestamp | <span class="deprecated">Deprecated</span> Use the event.timestamp column instead. |

### Experience

The experience the viewed screen belongs to.

{% include big-query/experience-columns.md %}

### Screen

The screen that was viewed.

{% include big-query/screen-columns.md %}

### From Screen

If the screen was navigated to by the user tapping a block, the "From Screen" is the screen the tapped block belongs to.

{% include big-query/screen-columns.md %}

### From Row

If the screen was navigated to by the user tapping a block, the "From Row" is the row the tapped block belongs to.

{% include big-query/row-columns.md %}

### From Block

If the screen was navigated to by the user tapping a block, the "From Block" is the block that was tapped.

{% include big-query/block-columns.md %}

{% include big-query/device-columns.md %}

{% include big-query/customer-columns.md %}