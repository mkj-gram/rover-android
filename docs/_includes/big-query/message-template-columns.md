| Column | Description |
| :--- | :--- |
| message\_template.id | The message template's ID. |
| message\_tempalte.type | Indicates whether the message is a Proximity message or a Scheduled message. The possible values are ProximityMessageTemplate or ScheduledMessageTemplate. |
| message\_template.title | The message template's title. |
| message\_template.save\_to\_inbox | A boolean indicating whether the "Save to Inbox" option is enabled. |
| message\_template.notification\_text | The copy used for the body of the push notification. See the [Apple documentation](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CreatingtheNotificationPayload.html) and [Android documentation](https://firebase.google.com/docs/cloud-messaging/concept-options#notifications) for more detail on how push notifications are constructed. |
| message\_template.schedule\_monday | For proximity messages only – a boolean value indicating whether this message can be triggered on Mondays. |
| message\_template.schedule\_tuesday | For proximity messages only – a boolean value indicating whether this message can be triggered on Tuesdays. |
| message\_template.schedule\_wednesday | For proximity messages only – a boolean value indicating whether this message can be triggered on Wednesdays. |
| message\_template.schedule\_thursday | For proximity messages only – a boolean value indicating whether this message can be triggered on Thursdays. |
| message\_template.schedule\_friday | For proximity messages only – a boolean value indicating whether this message can be triggered on Fridays. |
| message\_template.schedule\_saturday | For proximity messages only – a boolean value indicating whether this message can be triggered on Saturdays. |
| message\_template.schedule\_sunday | For proximity messages only – a boolean value indicating whether this message can be triggered on Sundays. |
| message\_template.content\_type | The type of content this message drive's the user to when the notification is swiped/tapped or the message is launched from the user's inbox. There are five possible values: landing-page, experience, deep-link, website or custom |
| message_template.scheduled_at | For scheduled messages only – a timestamp indicating the date and time the message should be delivered. The timestamp is in UTC although the timezone information is ignored. The timezone in which the message is sent is determined from the message_template.scheduled_local_time and message_template.scheduled_time_zone columns. |
| message_template.scheduled_local_time | For scheduled messages only – a boolean indicating whether the message should be sent to users in their own time zone. E.g. if the message is scheduled to be delivered at 3:00 PM on Jan 1. and message\_template. scheduled\_local\_time is true, then the message will be sent to each user when it is 3:00 PM in _their_ timezone. |
| message_template.scheduled_time_zone | For scheduled messages only – the time zone in which the message should be sent. E.g. if this column has a value of America/Toronto (which is EST) – and the message_template.scheduled_at column has a value of Jan 1. at 3:00 PM UTC – the message will be delivered on Jan 1. at 3:00 PM EST. |
| message_template.time_schedule.start | For proximity messages only – the time in minutes since 12:00 AM at which point the message is eligible to be delivered. I.e. if a user trigger's a valid proximity event before this time, the message will not be delivered. A value of 0 means there is no minimum start time before the message becomes eligible to be sent. A value of 480, for example, means the message is not eligible to be sent before 8:00 AM (8 hours * 60 minutes = 480). |
| message_template.time_schedule.end | For proximity messages only – the time in minutes since 12:00 AM at which point the message is _no longer_ eligible to be delivered. I.e. if a user trigger's a valid proximity event after this time, the message will not be delivered. A value of 1,440 is equivalent to the end of day and means there is no time limit on when a message is eligible to be sent. A value of 1,020, for example, means that after 5:00 PM the message is no longer eligible to be sent (17 hours * 60 minutes = 1,020). |







