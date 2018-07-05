package io.rover.app.inbox

import android.app.Application
import android.content.Intent
import com.google.firebase.iid.FirebaseInstanceId
import com.microsoft.appcenter.AppCenter
import com.microsoft.appcenter.crashes.AbstractCrashesListener
import com.microsoft.appcenter.crashes.Crashes
import com.microsoft.appcenter.crashes.ingestion.models.ErrorAttachmentLog
import com.microsoft.appcenter.crashes.model.ErrorReport
import com.microsoft.appcenter.distribute.Distribute
import io.rover.account.AccountAssembler
import io.rover.account.AuthService
import io.rover.debug.DebugAssembler
import io.rover.experiences.ExperiencesAssembler
import io.rover.location.LocationAssembler
import io.rover.core.Rover
import io.rover.core.CoreAssembler
import io.rover.core.data.AuthenticationContext
import io.rover.core.events.domain.Event
import io.rover.notifications.NotificationsAssembler
import io.rover.core.logging.GlobalStaticLogHolder
import io.rover.core.logging.LogBuffer
import timber.log.Timber


class InboxApplication : Application() {

    private val roverBaseUrl by lazy { resources.getString(R.string.rover_endpoint) }

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

            Crashes.setListener(
                object : AbstractCrashesListener() {
                    override fun getErrorAttachments(report: ErrorReport?): MutableIterable<ErrorAttachmentLog> {
                        val logger = GlobalStaticLogHolder.globalLogEmitter as LogBuffer?
                        return mutableListOf(ErrorAttachmentLog.attachmentWithText(logger?.getLogsAsText() ?: "No log buffer available", "log.txt"))
                    }
                }
            )
        }

        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        }

        Rover.installSaneGlobalHttpCache(this)

        Rover.initialize(
            CoreAssembler(
                accountToken = "",
                application = this,
                deepLinkSchemeSlug = "inbox",
                endpoint = "$roverBaseUrl/graphql"
            ),
            NotificationsAssembler(
                applicationContext = this,
                smallIconResId = R.mipmap.rover_notification_icon,
                notificationCenterIntent = Intent(applicationContext, MainActivity::class.java)
            ) {
                FirebaseInstanceId.getInstance().deleteInstanceId()
                FirebaseInstanceId.getInstance().token
            },
            ExperiencesAssembler(),
            AccountAssembler(
                application = this,
                targetIntent = Intent(
                    this,
                    MainActivity::class.java
                ),
                roverEndpoint = roverBaseUrl
            ),
            LocationAssembler(),
            DebugAssembler()
        )

        Rover.sharedInstance.eventQueue.trackEvent(
            Event(
                "Inbox App Opened", hashMapOf()
            )
        )
    }
}
