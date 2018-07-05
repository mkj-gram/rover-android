package io.rover.app.inbox.fcm

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import io.rover.notifications.PushReceiverInterface
import io.rover.core.Rover

class FirebaseMessageReceiver : FirebaseMessagingService() {
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Rover.sharedInstance.resolveSingletonOrFail(PushReceiverInterface::class.java).onMessageReceivedData(remoteMessage.data)
    }
}
