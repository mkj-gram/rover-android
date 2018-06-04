package io.rover.app.inbox.fcm

import com.google.firebase.iid.FirebaseInstanceId
import com.google.firebase.iid.FirebaseInstanceIdService
import io.rover.notifications.PushReceiverInterface
import io.rover.rover.Rover

class FirebaseInstanceIdReceiver : FirebaseInstanceIdService() {
    override fun onTokenRefresh() {
        Rover.sharedInstance.resolveSingletonOrFail(PushReceiverInterface::class.java).onTokenRefresh(
            FirebaseInstanceId.getInstance().token
        )
    }
}
