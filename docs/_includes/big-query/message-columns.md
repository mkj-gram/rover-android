| Column | Description |
| :--- | :--- |
| message.id | The messages's ID. |
| message.message_template_id | The ID of the message template the message was generated from. |
| message.notification_text | The copy used for the body of the push notification. See the [Apple documentation](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CreatingtheNotificationPayload.html) and [Android documentation](https://firebase.google.com/docs/cloud-messaging/concept-options#notifications) for more detail on how push notifications are constructed. |
| message.ios_title | The copy used for the title of the push notification on iOS devices. See the [Apple documentation](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CreatingtheNotificationPayload.html) for more detail on how push notifications are constructed. |
| message.android_title | The copy used for the title of the push notification on Android devices. See the [Android documentation](https://firebase.google.com/docs/cloud-messaging/concept-options#notifications) for more detail on how push notifications are constructed. |
| message.read | A boolean value indicating whether the user has read the message. |
| message.viewed | <span class="deprecated">Deprecated</span> Use message.read instead. |
| message.saved_to_inbox | A boolean indicating whether the message is saved to the user's inbox. |
| message.content_type | The type of content this message drive's the user to when the notification is swiped/tapped or the message is launched from the user's inbox. There are five possible values: landing-page, experience, deep-link, website or custom |
| message.deeplink_url | If the content type a deep-link, the value of this column will be the deep-link URL that is opened when the message's notification is swiped/tapped or the message is launched from the inbox. |
| message.website_url | If the content type is website, the value of this column will be the website URL that is opened when the message's notification is swiped/tapped or the message is launched from the inbox. |
