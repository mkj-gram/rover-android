package io.rover.androidtestapp

import com.google.firebase.iid.FirebaseInstanceId
import com.google.firebase.iid.FirebaseInstanceIdService
import io.rover.rover.Rover


class MyAppFirebaseInstanceIdService : FirebaseInstanceIdService() {
    override fun onTokenRefresh() {
        Rover.sharedInstance.notificationHandler.onTokenRefresh(
            FirebaseInstanceId.getInstance().token
        )
    }
}
