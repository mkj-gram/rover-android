package io.rover.rover.core.events.contextproviders

import io.rover.rover.core.data.domain.DeviceContext
import io.rover.rover.core.events.ContextProvider
import io.rover.rover.platform.DeviceIdentificationInterface

class DeviceIdentifierContextProvider(
    deviceIdentification: DeviceIdentificationInterface
) : ContextProvider {
    private val identifier = deviceIdentification.installationIdentifier
    private val deviceName = deviceIdentification.deviceName

    override fun captureContext(deviceContext: DeviceContext): DeviceContext {
        return deviceContext.copy(
            deviceIdentifier = identifier,
            deviceName = deviceName
        )
    }
}
