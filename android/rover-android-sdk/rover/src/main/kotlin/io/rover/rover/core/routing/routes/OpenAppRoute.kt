package io.rover.rover.core.routing.routes

import android.content.Intent
import io.rover.rover.core.routing.Route
import io.rover.rover.core.routing.TopLevelNavigation
import java.net.URI

class OpenAppRoute(
    private val topLevelNavigation: TopLevelNavigation
): Route {
    override fun resolveUri(uri: URI?): Intent? {
        // a null URI means merely open app, which means it should map to this route.
        return if(uri == null) {
            return topLevelNavigation.openAppIntent()
        } else null
    }
}
