package io.rover.notifications

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import io.rover.notifications.domain.PushAction
import io.rover.notifications.graphql.decodeJson
import io.rover.rover.core.events.EventQueueServiceInterface
import io.rover.rover.core.logging.log
import io.rover.rover.core.operations.ActionBehaviour
import io.rover.rover.core.operations.ActionBehaviourMappingInterface
import io.rover.rover.core.streams.subscribe
import io.rover.rover.platform.DateFormattingInterface
import org.json.JSONException
import org.json.JSONObject
import java.net.MalformedURLException


open class PushReceiver(
    // TODO change to private val pushTokenTransmissionChannel: PushTokenTransmissionChannel,
    private val eventsPlugin: EventQueueServiceInterface,
    private val dateFormatting: DateFormattingInterface,
    private val actionBehaviourMapping: ActionBehaviourMappingInterface
): PushReceiverInterface {

    override fun onTokenRefresh(token: String?) {
        // so, we need the token to be consumable from a FirebasePushTokenContextProvider

        // TODO to make things safer for GCM consumers, which may be calling this off the main
        // thread, manually delegate this to the main thread just in case.
        Handler(Looper.getMainLooper()).post {
            eventsPlugin.setPushToken(token)
        }
    }

    /**
     * Process an the parameters from an incoming notification.
     *
     * Note that this is running in the context of a 10 second wallclock execution time restriction.
     */
    override fun onMessageReceivedData(parameters: Map<String, String>) {
        // if we have been called, then:
        // a) the notification does not have a display message component; OR
        // b) the app is running in foreground.

        log.v("Received a push notification. Raw parameters: $parameters")

        if(!parameters.containsKey("action")) {
            log.w("Invalid push notification received: `action` data parameter not present. Possibly was a Display-only push notification, or otherwise not intended for the Rover SDK. Ignoring.")
        }

        val action = parameters["action"] ?: return
        handleRoverNotificationObject(action)
    }

    override fun onMessageReceivedDataAsBundle(parameters: Bundle) {
        val rover = parameters.getString("rover") ?: return
        // TODO: this will instead become a generic push notification type which contain an ACTION thingy instead,
        // which itself may include a Rover Notification.  Once the action is dispatched to
        handleRoverNotificationObject(rover)
    }


    private fun handleRoverNotificationObject(roverJson: String) {
        val pushAction = try {
            val roverJsonObject = JSONObject(roverJson)
            PushAction.decodeJson(
                roverJsonObject,
                dateFormatting
            )
        } catch (e: JSONException) {
            log.w("Invalid push notification action received, because: '${e.message}'. Ignoring.")
            log.w("... contents were: $roverJson")
            return
        } catch (e: MalformedURLException) {
            log.w("Invalid push notification action received, because: '${e.message}'. Ignoring.")
            log.w("... contents were: $roverJson")
            return
        }

        execute(pushAction)
    }

    override fun onMessageReceivedNotification(notification: io.rover.notifications.domain.Notification) {
        execute(
            PushAction.AddNotificationAction(notification)
        )
    }

    private fun execute(pushAction: PushAction) {
        val behaviour = actionBehaviourMapping.mapToBehaviour(pushAction)

        when(behaviour) {
            is ActionBehaviour.IntentAction, is ActionBehaviour.Intrinsic, is ActionBehaviour.NotAvailable -> {
                log.w("Received action in push notification that may not be processed. This is a bug. PushAction: $pushAction")
            }
            is ActionBehaviour.HeadlessAction -> {
                behaviour.behaviour.subscribe {
                    log.v("Headless behaviour completed.")
                }
            }
        }
    }
}
