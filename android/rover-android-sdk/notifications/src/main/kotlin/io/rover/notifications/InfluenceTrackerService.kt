package io.rover.notifications

import android.app.Activity
import android.app.Application
import android.content.Intent
import android.os.Bundle
import io.rover.notifications.domain.Notification
import io.rover.rover.core.logging.log
import io.rover.rover.platform.LocalStorage
import io.rover.rover.platform.whenNotNull

class InfluenceTrackerService(
    private val application: Application,
    localStorage: LocalStorage,
    private val notificationOpen: NotificationOpenInterface,
    private val influenceThresholdSeconds: Int = 60
): InfluenceTrackerServiceInterface {
    private val store = localStorage.getKeyValueStorageFor("influenced-opens")

    private var lastSeenNotificationAt: Long?
        get() = try { store["last-seen-notification-at"]?.toLong() } catch (numberFormatException: NumberFormatException) { null }
        set(value) {
            if(value == null) {
                store.unset("last-seen-notification-at")
            } else {
                store["last-seen-notification-at"] = value.toString()
            }
        }

    private var lastSeenNotificationId: String?
        get() = store["last-seen-notification-id"]
        set(value) {
            if(value == null) {
                store.unset("last-seen-notification-id")
            } else {
                store["last-seen-notification-id"] = value
            }
        }

    override fun notifyNotificationReceived(notification: Notification) {
        // track current time
        lastSeenNotificationAt = System.currentTimeMillis() / 1000L
        lastSeenNotificationId = notification.id
        log.v("Marked that a notification arrived.")
    }

    override fun startListening() {
        application.registerActivityLifecycleCallbacks(
            object : Application.ActivityLifecycleCallbacks {
                override fun onActivityPaused(activity: Activity?) { }

                override fun onActivityResumed(activity: Activity?) { }

                override fun onActivityStarted(activity: Activity?) { }

                override fun onActivityDestroyed(activity: Activity?) { }

                override fun onActivitySaveInstanceState(activity: Activity?, outState: Bundle?) { }

                override fun onActivityStopped(activity: Activity?) { }

                override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) {
                    if(savedInstanceState == null && activity.intent.hasCategory(Intent.CATEGORY_LAUNCHER)) {
                        // app was started from the launcher by tapping the icon. contrasted with
                        // navigating within the app, state restore happening when returning to the
                        // app after process death, or app being opened by tapping on a
                        // notification.

                        // thus, we can track an influenced opens here.
                        val seenWithinThreshold = lastSeenNotificationAt?.whenNotNull { lastSeen ->
                            System.currentTimeMillis() / 1000L - lastSeen < influenceThresholdSeconds
                        }

                        val capturedLastSeenNotificationId = lastSeenNotificationId

                        if(seenWithinThreshold == true && capturedLastSeenNotificationId != null) {
                            log.v("App open influenced by a notification detected.")

                            notificationOpen.appOpenedAfterReceivingNotification(capturedLastSeenNotificationId)

                            lastSeenNotificationAt = null
                            lastSeenNotificationId = null
                        }
                    }

                }
            }
        )
    }
}