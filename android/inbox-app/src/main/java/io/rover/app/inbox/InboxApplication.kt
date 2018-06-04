package io.rover.app.inbox

import android.app.Application
import android.content.Intent
import com.google.firebase.iid.FirebaseInstanceId
import com.microsoft.appcenter.AppCenter
import com.microsoft.appcenter.crashes.Crashes
import com.microsoft.appcenter.distribute.Distribute
import io.rover.account.AccountAssembler
import io.rover.account.AuthService
import io.rover.app.inbox.BuildConfig
import io.rover.app.inbox.R
import io.rover.experiences.ExperiencesAssembler
import io.rover.rover.Rover
import io.rover.rover.core.CoreAssembler
import io.rover.rover.core.data.AuthenticationContext
import io.rover.rover.core.events.domain.Event
import io.rover.notifications.NotificationsAssembler
import timber.log.Timber


class InboxApplication : Application() {
    val authService by lazy {
        Rover.sharedInstance.resolveSingletonOrFail(
            AuthenticationContext::class.java
        ) as AuthService
    }

    override fun onCreate() {
        super.onCreate()

        if (!BuildConfig.DEBUG) {
            AppCenter.start(
                this,
                getString(R.string.microsoft_app_center_secret),
                // TODO might replace App Center Crashes with Crashlytics.
                Crashes::class.java,
                Distribute::class.java
            )
        }

        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        }

        Rover.installSaneGlobalHttpCache(this)

        Rover.initialize(
            CoreAssembler(
                "",
                this,
                "experiences"
            ),
            NotificationsAssembler(
                this,
                R.mipmap.rover_notification_icon
            ) {
                FirebaseInstanceId.getInstance().deleteInstanceId()
                FirebaseInstanceId.getInstance().token
            },
            ExperiencesAssembler(),
            AccountAssembler(
                this,
                Intent(
                    this,
                    MainActivity::class.java
                )
            )
        )

        Rover.sharedInstance.eventQueue.trackEvent(
            Event(
                "Inbox App Opened", hashMapOf()
            )
        )
    }
}
