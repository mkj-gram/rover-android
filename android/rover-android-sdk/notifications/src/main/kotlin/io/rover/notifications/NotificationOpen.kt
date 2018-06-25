package io.rover.notifications

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import io.rover.notifications.domain.Notification
import io.rover.notifications.graphql.decodeJson
import io.rover.rover.core.data.domain.AttributeValue
import io.rover.rover.core.events.EventQueueService
import io.rover.rover.core.events.EventQueueServiceInterface
import io.rover.rover.core.events.domain.Event
import io.rover.rover.core.routing.Router
import io.rover.rover.core.routing.TopLevelNavigation
import io.rover.rover.core.routing.website.EmbeddedWebBrowserDisplayInterface
import io.rover.rover.platform.DateFormattingInterface
import org.json.JSONObject

/**
 * Open a notification by executing its [PushNotificationAction].
 */
open class NotificationOpen(
    private val applicationContext: Context,
    private val dateFormatting: DateFormattingInterface,
    private val eventsService: EventQueueServiceInterface,
    private val router: Router,
    private val topLevelNavigation: TopLevelNavigation,
    private val embeddedWebBrowserDisplay: EmbeddedWebBrowserDisplayInterface
): NotificationOpenInterface {
    override fun pendingIntentForAndroidNotification(notification: Notification): PendingIntent {
        return TransientNotificationLaunchActivity.generateLaunchIntent(
            applicationContext,
            notification
        )
    }

    private fun intentForNotification(notification: Notification): Intent {


        return when(notification.tapBehavior) {
            is Notification.TapBehavior.OpenApp -> topLevelNavigation.openAppIntent()
            is Notification.TapBehavior.OpenUri -> router.route(
                notification.tapBehavior.uri,
                false
            )
            is Notification.TapBehavior.PresentWebsite -> embeddedWebBrowserDisplay.intentForViewingWebsiteViaEmbeddedBrowser(
                notification.tapBehavior.url.toString()
            )
        }
    }

    override fun intentForOpeningNotificationFromJson(notificationJson: String): Intent {
        // side-effect: issue open event.
        val notification = Notification.decodeJson(JSONObject(notificationJson), dateFormatting)

        issueNotificationOpenedEvent(
            notification.id,
            NotificationSource.Push
        )

        return intentForNotification(notification)
    }

    override fun intentForOpeningNotificationDirectly(notification: Notification): Intent? {
        // we only want to open the given notification's action in the case where it would
        // navigate somewhere useful, not just re-open the app.

        // Not appropriate to re-open the app when opening notification directly, do nothing.

        issueNotificationOpenedEvent(
            notification.id,
            NotificationSource.NotificationCenter
        )

        return intentForNotification(notification)
    }

    protected fun issueNotificationOpenedEvent(notificationId: String, source: NotificationSource) {
        eventsService.trackEvent(
            Event(
                "Notification Opened",
                hashMapOf(
                    Pair("notificationID", AttributeValue.String(notificationId)),
                    Pair("source", AttributeValue.String(source.wireValue))
                )
            ),
            EventQueueService.ROVER_NAMESPACE
        )
    }

    override fun appOpenedAfterReceivingNotification(notificationId: String) {
        issueNotificationOpenedEvent(
            notificationId,
            NotificationSource.InfluencedOpen
        )
    }

    enum class NotificationSource(val wireValue: String) {
        NotificationCenter("notificationCenter"),
        Push("pushNotification"),
        InfluencedOpen("influencedOpen")
    }
}
