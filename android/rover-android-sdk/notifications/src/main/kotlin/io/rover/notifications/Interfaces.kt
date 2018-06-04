package io.rover.notifications

import android.app.PendingIntent
import android.content.Intent
import android.os.Bundle
import io.rover.notifications.domain.Notification

interface PushReceiverInterface {
    /**
     * You need to implement a
     * [FirebaseMessagingService](https://firebase.google.com/docs/reference/android/com/google/firebase/messaging/FirebaseMessagingService)
     * in your application, and then override its `onMessageReceived` method.
     *
     * If you are using GCM instead of FCM, then look at [onMessageReceivedDataAsBundle] instead.
     *
     * Then, retrieve `data` from the `RemoteMessage` object it received and pass it here.
     *
     * In response, the Push Plugin will build an appropriate notification and add it to the Android
     * notification area (although note this will not be called for every notification sent to users
     * on behalf of your application; if the Rover Cloud determined that a Firebase Display Message
     * was sufficient to display the push, then this callback may not happen at all unless the app
     * is in the foreground).
     *
     * In Kotlin, it may look something like this:
     *
     * ```
     * class MyAppCustomFirebaseReceiver: FirebaseMessagingService() {
     *     override fun onMessageReceived(remoteMessage: RemoteMessage) {
     *         val pushReceiver = Rover.sharedInstance.pushReceiver
     *         pushReceiver.onMessageReceivedData(remoteMessage.data)
     *     }
     * }
     * ```
     */
    fun onMessageReceivedData(parameters: Map<String, String>)

    /**
     * Equivalent to [onMessageReceivedData], but accepts a Bundle instead of a Map.
     *
     * This version is appropriate for use with GCM in lieu of FCM.  See `README.legacy-gcm.md` for
     * details.
     */
    fun onMessageReceivedDataAsBundle(parameters: Bundle)

    /**
     * Handle an already decoded Rover [Notification].
     */
    @Deprecated("Will be moved elsewhere")
    fun onMessageReceivedNotification(notification: Notification)

    /**
     * You need to implement a
     * [FirebaseInstanceIdService](https://firebase.google.com/docs/reference/android/com/google/firebase/iid/FirebaseInstanceIdService)
     * in your application, and then override its `onTokenRefresh` method.
     *
     * Then, pass the token it received here.  Thread safe; you may call this from whatever thread
     * you like.
     *
     * Then the Rover SDK will be able to register that push token to receive Rover pushes.  If this
     * step is omitted, then the application will never receive any Rover-powered push
     * notifications.
     */
    fun onTokenRefresh(token: String?)
}

//interface ActionRoutingBehaviourInterface {
//    /**
//     * Map a given action URI to the appropriate Rover behaviour.
//     *
//     * Should return an Intent for the given push notification action.
//     */
//    fun actionUriToIntent(action: URI): IntentAndBackstackRequest
//
//    /**
//     * The mapped intent and whether the action explicitly requested that a backstack not be
//     * synthesized.  Note that a backstack may be synthesized anyway depending on the context.
//     *
//     * The intent may be null, particularly if the synthesized backstack is all that the action
//     * needs.
//     */
//    data class IntentAndBackstackRequest(
//        val intent: Intent?,
//        val noBackstack: Boolean
//    )
//
//    /**
//     * Determine if the given action is appropriate for opening directly in a currently open app.
//     *
//     * For example, "open app" deep links would be pointless if opened within the app.
//     */
//    fun isDirectOpenAppropriate(action: URI): Boolean
//}

interface NotificationOpenInterface {
    /**
     * A pending intent that will be used for the Android notification itself.
     *
     * Will return a [PendingIntent] suitable for use as an Android notification target that will
     * launch the [TransientNotificationLaunchActivity] to start up and actually execute the
     * notification's action.
     */
    fun pendingIntentForAndroidNotification(notification: Notification): PendingIntent

    /**
     * Return a stack of intents (meant to be a synthesized back stack) for opening a notification
     * from the Android notification drawer. This is called by the transient notification launch
     * activity to replace itself with a new stack.
     *
     * The returned Intents should be started immediately with [ContextCompat.startActivities]. This
     * method in fact has a side-effect of dispatching an analytics Event.
     */
    fun intentStackForOpeningNotificationFromNotificationsDrawer(notificationJson: String): List<Intent>

    /**
     * Return an intent for directly opening the notification within the app.
     *
     * Note: if you wish to override the intent creation logic, instead considering overriding
     * [TopLevelNavigation] or [ActionRoutingBehaviour].
     *
     * Returns null if no intent is appropriate.
     */
    fun intentForOpeningNotificationDirectly(notification: Notification): Intent?
}

