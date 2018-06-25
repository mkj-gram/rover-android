package io.rover.notifications.routing.routes

import android.content.Intent
import io.rover.rover.core.routing.Route
import io.rover.rover.core.routing.TopLevelNavigation
import java.net.URI

class PresentNotificationCenterRoute(
    private val deepLinkScheme: String,
    private val topLevelNavigation: TopLevelNavigation
) : Route {
    override fun resolveUri(uri: URI?): Intent? {
        return if(uri?.scheme == deepLinkScheme && uri.authority == "presentNotificationCenter") {
            topLevelNavigation.displayNotificationCenterIntent()
        } else null
    }
}
