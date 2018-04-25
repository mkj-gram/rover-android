package io.rover.androidtestapp.gcm

import android.app.Application
import com.facebook.stetho.Stetho
import com.google.android.gms.gcm.GoogleCloudMessaging
import com.google.android.gms.iid.InstanceID
import io.rover.rover.Rover
import io.rover.rover.core.CoreAssembler
import io.rover.rover.core.events.domain.Event
import io.rover.rover.experiences.ExperiencesAssembler
import io.rover.rover.notifications.NotificationsAssembler
import timber.log.Timber
import timber.log.Timber.DebugTree

class RoverAndroidTestApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        Stetho.initializeWithDefaults(this)

        Rover.installSaneGlobalHttpCache(this)

        if (BuildConfig.DEBUG) {
            Timber.plant(DebugTree())
        }

        Rover.initialize(
            CoreAssembler("6c546189dc45df1293bddc18c0b54786", this),
            ExperiencesAssembler(),
            NotificationsAssembler(this, R.mipmap.ic_launcher, 0, "inbox") {
                // force reset!
                InstanceID.getInstance(this).deleteInstanceID()
                InstanceID.getInstance(this).getToken(
                    getString(R.string.gcm_defaultSenderId),
                    GoogleCloudMessaging.INSTANCE_ID_SCOPE, null
                )
            }
        )

        Rover.sharedInstance.eventQueue.trackEvent(
            Event("App Opened", hashMapOf())
        )
    }
}
