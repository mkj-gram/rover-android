package io.rover.androidtestapp

import com.google.firebase.iid.FirebaseInstanceId
import com.google.firebase.iid.FirebaseInstanceIdService
import io.rover.notifications.PushReceiverInterface
import io.rover.core.Rover


class MyAppFirebaseInstanceIdService : FirebaseInstanceIdService() {
    override fun onTokenRefresh() {
        Rover.sharedInstance.resolveSingletonOrFail(PushReceiverInterface::class.java).onTokenRefresh(
            FirebaseInstanceId.getInstance().token
        )
    }
}
