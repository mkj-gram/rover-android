package io.rover.androidtestapp.gcm

import com.google.android.gms.gcm.GoogleCloudMessaging
import com.google.android.gms.iid.InstanceID
import com.google.android.gms.iid.InstanceIDListenerService
import io.rover.rover.Rover

/**
 * Created by andrewclunis on 2018-02-14.
 */
class AppGcmInstanceIDListenerService : InstanceIDListenerService() {
    override fun onTokenRefresh() {
//        // unlike in the Firebase version, this cannot be called on the main thread.
//        Executors.newSingleThreadExecutor().execute {
            val instanceID = InstanceID.getInstance(this)
            val token = instanceID.getToken(
                getString(R.string.gcm_defaultSenderId),
                GoogleCloudMessaging.INSTANCE_ID_SCOPE, null
            )
            Rover.sharedInstance.notificationHandler.onTokenRefresh(
                token
            )
//        }

    }
}
