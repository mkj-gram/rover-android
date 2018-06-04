package io.rover.rover.core.events.contextproviders

import io.rover.rover.core.context.ModulesTrackerInterface
import io.rover.rover.core.data.domain.DeviceContext
import io.rover.rover.core.events.ContextProvider

class ModulesContextProvider(
    private val modulesTrackerInterface: ModulesTrackerInterface
): ContextProvider {
    override fun captureContext(deviceContext: DeviceContext): DeviceContext {
        return deviceContext.copy(
            frameworks = modulesTrackerInterface.registeredModules
        )
    }
}
