package io.rover.debug.routes

import android.content.Context
import android.content.Intent
import io.rover.debug.RoverDebugActivity
import io.rover.rover.core.routing.Route
import io.rover.rover.platform.whenNotNull
import java.net.URI

class DebugRoute(
    private val context: Context
) : Route {
    override fun resolveUri(uri: URI?): Intent? {
        return uri.whenNotNull { uri ->
            if(uri.authority == "presentDebugger") {
                Intent(
                    context,
                    RoverDebugActivity::class.java
                )
            } else null
        }
    }
}