package io.rover.notifications

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import io.rover.rover.core.data.domain.AttributeValue
import io.rover.notifications.domain.Notification
import io.rover.notifications.graphql.decodeJson
import io.rover.rover.core.data.http.WireEncoderInterface
import io.rover.rover.core.events.EventQueueService
import io.rover.rover.core.events.EventQueueServiceInterface
import io.rover.rover.core.events.domain.Event
import io.rover.rover.core.logging.log
import io.rover.rover.core.operations.ActionBehaviour
import io.rover.rover.core.operations.ActionBehaviourMappingInterface
import io.rover.rover.core.routing.ActionIntentBackstackSynthesizerInterface
import io.rover.rover.core.ui.OpenAppAction
import io.rover.rover.platform.DateFormatting
import io.rover.rover.platform.DateFormattingInterface
import org.json.JSONObject

/**
 * Open a notification by executing its [PushNotificationAction].
 */
open class NotificationOpen(
    private val applicationContext: Context,
    private val dateFormatting: DateFormattingInterface,
    private val eventsService: EventQueueServiceInterface,
    private val actionBehaviorMapping: ActionBehaviourMappingInterface,
    private val actionIntentBackstackSynthesizer: ActionIntentBackstackSynthesizerInterface
): NotificationOpenInterface {
    override fun pendingIntentForAndroidNotification(notification: Notification): PendingIntent {
        return TransientNotificationLaunchActivity.generateLaunchIntent(
            applicationContext,
            notification
        )
    }

    override fun intentStackForOpeningNotificationFromNotificationsDrawer(notificationJson: String): List<Intent> {
        // side-effect: issue open event.
        val notification = Notification.decodeJson(JSONObject(notificationJson), dateFormatting)

        issueNotificationOpenedEvent(
            notification,
            NotificationSource.Push
        )

        val actionBehaviour = actionBehaviorMapping.mapToBehaviour(
            notification.action ?: OpenAppAction()
        ) as? ActionBehaviour.IntentAction ?: throw RuntimeException("Non-intent ActionBehaviours for opening notifications are not supported.")


        return actionIntentBackstackSynthesizer.synthesizeNotificationIntentStack(
            actionBehaviour.intent,
            notification.isNotificationCenterEnabled
        )
    }

    override fun intentForOpeningNotificationDirectly(notification: Notification): Intent? {
        // we only want to open the given notification's action in the case where it would
        // navigate somewhere useful, not just re-open the app.

        // Not appropriate to re-open the app when opening notification directly, do nothing.

        if(notification.action == null) return null

        val actionBehaviour = actionBehaviorMapping.mapToBehaviour(
            notification.action
        )

        return when(actionBehaviour) {
            is ActionBehaviour.NotAvailable -> {
                log.w("No behaviour mapping was available for ${notification.action}.  Perhaps you neglected to add an assembler to Rover.initialize()?")
                null
            }
            is ActionBehaviour.Intrinsic -> {
                /* no-op */
                null
            }
            is ActionBehaviour.IntentAction -> {
                // side-effect: issue open event.
                issueNotificationOpenedEvent(
                    notification,
                    NotificationSource.NotificationCenter
                )

                actionBehaviour.intent
            }
            is ActionBehaviour.HeadlessAction -> {
                log.w("Headless actions are not well supported in the Notification Center.  Executing behaviour in the background with no user feedback.")
                actionBehaviour.exec()
                null
            }
        }
    }

    protected fun issueNotificationOpenedEvent(notification: Notification, source: NotificationSource) {
        eventsService.trackEvent(
            Event(
                "Notification Opened",
                hashMapOf(
                    Pair("notificationID", AttributeValue.String(notification.id)),
                    Pair("source", AttributeValue.String(source.wireValue))
                )
            ),
            EventQueueService.ROVER_NAMESPACE
        )
    }

    enum class NotificationSource(val wireValue: String) {
        NotificationCenter("notificationCenter"), Push("push")
    }
}
