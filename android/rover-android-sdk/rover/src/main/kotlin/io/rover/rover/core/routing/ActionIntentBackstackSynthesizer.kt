package io.rover.rover.core.routing

import android.content.Context
import android.content.Intent
import android.support.v4.app.TaskStackBuilder

class ActionIntentBackstackSynthesizer(
    private val applicationContext: Context,
    private val topLevelNavigation: TopLevelNavigation
): ActionIntentBackstackSynthesizerInterface {
    override fun synthesizeNotificationIntentStack(action: Intent?, inNotificationCenter: Boolean): List<Intent> {
        // now to synthesize the backstack.
        return TaskStackBuilder.create(applicationContext).apply {
            if (inNotificationCenter) {
                // inject the Notification Centre for the user's app. TODO: allow user to *configure*
                // what their notification centre is, either with a custom URI template method OR
                // just with a meta-property in their Manifest. but by default we can bundle an Activity that hosts NotificationCentreView, I think.

                // for now, we'll just put some sort of.
                addNextIntent(topLevelNavigation.displayNotificationCenterIntent())
            } else {
                // Instead of displaying the notification centre, display the parent activity the user set
                addNextIntent(topLevelNavigation.openAppIntent())
            }

            if(action != null) addNextIntent(action)
        }.intents.asList().apply {
            this.first().addFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                or Intent.FLAG_ACTIVITY_CLEAR_TASK
                or Intent.FLAG_ACTIVITY_TASK_ON_HOME)
        }
    }
}
