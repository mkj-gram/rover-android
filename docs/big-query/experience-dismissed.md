---
title: Experience Dismissed
layout: guide
permalink: /big-query/experience-dismissed/
secondary_navigation: big-query
---

# Experience Dismissed

The Experience Dismissed event is triggered when a user dismisses an experience by tapping the close button.

---

## Table Schema

Experience Dismissed events are stored in BigQuery in the `experience_dismissed` table. The following is a detailed description of each column in the table grouped by data model.

<aside class="important">
Any columns marked as <span class="deprecated">Deprecated</span> are no longer in-use and should not be used in reports.</aside>

### Event

Properties of the Experience Dismissed event.

| Column | Description |
| :--- | :--- |
| event.timestamp | A UNIX timestamp \(seconds since January 1st, 1970 at UTC\) indicating the time the event occurred.  |
| event.experience_session_id | <span class="deprecated">Deprecated</span> Use the event.attributes.experience_session_id column instead. |
| event.attributes.experience_id | The ID of the experience that was dismissed. |
| event.attributes.version_id | Each time an experience is published a new version is created. This column stores the ID of the specific version of the experience that was dismissed. |
| event.attributes.experience_session_id | The time between when a user launches an experience and dismisses it is called a session. This column is a unique ID assigned to the session that ended when the Experience Dismissed event was triggered. The session ID is useful for certain reports such as calculating the average time spent engaging with an experience. |
| event.attributes.timestamp | <span class="deprecated">Deprecated</span> Use the event.timestamp column instead. |

### Experience

The experience that was dismissed.

{% include big-query/experience-columns.md %}

{% include big-query/device-columns.md %}

{% include big-query/customer-columns.md %}