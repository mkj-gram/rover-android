package io.rover.rover.core.routing

import android.content.Context
import android.content.Intent
import android.net.Uri
import java.net.URI

/**
 * A default version of [TopLevelNavigation] that will use the two Activities bundled with the Rover
 * SDK for displaying Experiences and the Notification Center.
 */
open class DefaultTopLevelNavigation(
    private val applicationContext: Context
): TopLevelNavigation {

    // TODO: these must be override/registered somehow from the Experiences module.
    // Perhaps, as part of the Actions framework, this problem will go away.  I'll hack something
    // together for now.

    override fun displayExperienceIntentByExperienceId(experienceId: String): Intent {
        throw RuntimeException("Experiences not supported without adding the io.rover.experiences library to your project and adding its assembler to Rover.initialize().")
        // return StandaloneExperienceHostActivity.makeIntent(applicationContext, experienceId, campaignId)
    }

    override fun displayExperienceIntentByCampaignId(campaignId: String): Intent {
        throw RuntimeException("Experiences not supported without adding the io.rover.experiences library to your project and adding its assembler to Rover.initialize().")
    }

    override fun displayExperienceIntentFromCampaignLink(universalLink: URI): Intent {
        throw RuntimeException("Experiences not supported without adding the io.rover.experiences library to your project and adding its assembler to Rover.initialize().")
    }

    override fun displayNotificationCenterIntent(): Intent {
        // TODO soon to be StandaloneNotificationCenterActivity
        return Intent(Intent.ACTION_VIEW, Uri.parse("about:blank"))
    }

    /**
     * Generates an intent for displaying main screen of your activity.  Used to insert a back stack
     * entry in new Android Tasks created by the user tapping on a push notification from Rover with
     * Notification Centre is *not* enabled.
     *
     * The default is to use either the parent activity you may have specified in your custom entry
     * for [StandaloneExperienceHostActivity] in your Manifest, or the default Main activity of your
     * app.  However if you are building a single-Activity app or using some other sort of custom
     * routing arrangement (say, Fragments or Conductor), you may want to override this behaviour to
     * build a custom Intent.
     */
    override fun openAppIntent(): Intent {
        return applicationContext.packageManager.getLaunchIntentForPackage(applicationContext.packageName)
    }
}
