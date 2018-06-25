package io.rover.experiences.routing.routes

import android.content.Intent
import io.rover.rover.core.logging.log
import io.rover.rover.core.routing.Route
import io.rover.rover.core.routing.TopLevelNavigation
import io.rover.rover.platform.parseAsQueryParameters
import java.net.URI

class PresentExperienceRoute(
    private val deepLinkScheme: String,
    private val topLevelNavigation: TopLevelNavigation
): Route {
    override fun resolveUri(uri: URI?): Intent? {
        log.v("EVALUATING URI $uri, scheme is ${uri?.scheme} and authority is ${uri?.authority}, scheme to match is $deepLinkScheme")
        // Experiences can be opened either by a deep link or a universal link.
        return when {
            uri?.scheme == "https" || uri?.scheme == "http" -> {
                // universal link!
                topLevelNavigation.displayExperienceIntentFromCampaignLink(uri)
            }
            uri?.scheme == deepLinkScheme && uri.authority == "presentExperience" -> {
                val queryParameters = uri.query.parseAsQueryParameters()
                val possibleCampaignId = queryParameters["campaignID"]
                val possibleExperienceId = queryParameters["id"]
                when {
                    possibleCampaignId != null -> topLevelNavigation.displayExperienceIntentByCampaignId(possibleCampaignId)
                    possibleExperienceId != null -> topLevelNavigation.displayExperienceIntentByExperienceId(possibleExperienceId)
                    else -> {
                        log.w("A presentExperience deep link lacked either a `campaignID` or `id` parameter.")
                        null
                    }
                }
            }
            else -> null // no match.
        }
    }
}
