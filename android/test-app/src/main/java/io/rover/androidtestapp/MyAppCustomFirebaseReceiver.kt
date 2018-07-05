package io.rover.androidtestapp

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import io.rover.notifications.PushReceiverInterface
import io.rover.core.Rover

/**
 * Receive callbacks from Firebase FCM.
 */
class MyAppCustomFirebaseReceiver: FirebaseMessagingService() {
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        val pushPlugin = Rover.sharedInstance.resolveSingletonOrFail(PushReceiverInterface::class.java)
        remoteMessage.notification
        remoteMessage.data
        pushPlugin.onMessageReceivedData(remoteMessage.data)
    }
}