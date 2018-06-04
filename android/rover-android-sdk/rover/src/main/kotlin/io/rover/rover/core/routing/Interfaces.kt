package io.rover.rover.core.routing

import android.content.Intent
import java.net.URI


/**
 * Responsible for generating Intents that will route the user to the appropriate place in your app
 * for viewing Rover-mediated content.
 *
 * A default implementation is provided by [DefaultTopLevelNavigation], which uses the standalone
 * activities bundled along with the Rover SDK.  However, you will need your own implementation of
 * [TopLevelNavigation] in your application if you wish to host either the ExperienceView or
 * NavigationCenterView directly in your own Activities.
 */
interface TopLevelNavigation {
    /**
     * Generate an Intent for displaying an Experience from an explicit experience id.
     */
    fun displayExperienceIntentByExperienceId(experienceId: String): Intent

    fun displayExperienceIntentByCampaignId(campaignId: String): Intent

    /**
     * Generate an Intent for displaying an Experience from an opaque experience universal link.
     */
    fun displayExperienceIntentFromCampaignLink(universalLink: URI): Intent

    /**
     * Generate an Intent for navigating your app to the Notification Center.
     *
     * For example, if you host the Notification Center within the Settings area of your app, and
     * your app is a single-Activity app or otherwise using some sort of custom routing arrangement
     * (such as Fragments or Conductor), then you will need to make the Intent address the
     * appropriate activity, and command it with arguments to navigate to the appropriate place.
     */
    fun displayNotificationCenterIntent(): Intent

    fun openAppIntent(): Intent
}


interface LinkOpenInterface {
    /**
     * Map an intent for a deep/universal link to an explicit, mapped intent.
     */
    fun localIntentForReceived(receivedUri: URI): List<Intent>
}

interface ActionIntentBackstackSynthesizerInterface {
    /**
     * Synthesize a backstack (with either the home screen or the notification center screen,
     * depending on the [inNotificationCenter] flag) for the given intent.
     *
     * If Intent is null, then home screen/notification center will be returned on their own.
     */
    fun synthesizeNotificationIntentStack(action: Intent?, inNotificationCenter: Boolean): List<Intent>
}
