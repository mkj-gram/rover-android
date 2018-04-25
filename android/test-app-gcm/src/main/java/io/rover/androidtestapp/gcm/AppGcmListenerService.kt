package io.rover.androidtestapp.gcm

import android.os.Bundle
import com.google.android.gms.gcm.GcmListenerService
import io.rover.rover.Rover

class AppGcmListenerService : GcmListenerService() {
    override fun onMessageReceived(from: String?, data: Bundle) {
        val pushPlugin = Rover.sharedInstance.notificationHandler
        pushPlugin.onMessageReceivedDataAsBundle(data)
    }
}