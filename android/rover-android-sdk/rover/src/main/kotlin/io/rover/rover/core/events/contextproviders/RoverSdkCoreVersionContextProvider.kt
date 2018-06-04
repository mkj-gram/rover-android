package io.rover.rover.core.events.contextproviders

import io.rover.rover.BuildConfig
import io.rover.rover.core.data.domain.DeviceContext
import io.rover.rover.core.events.ContextProvider

/**
 * Captures and adds the Rover SDK version number to [DeviceContext].
 */
class RoverSdkCoreVersionContextProvider : ContextProvider {
    override fun captureContext(deviceContext: DeviceContext): DeviceContext {
        return deviceContext.copy(
            frameworks = deviceContext.frameworks.plus(hashMapOf(
                Pair(BuildConfig.APPLICATION_ID, BuildConfig.VERSION_NAME)
            ))
        )
    }
}
