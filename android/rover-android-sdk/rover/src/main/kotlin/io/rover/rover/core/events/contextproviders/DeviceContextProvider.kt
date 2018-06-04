package io.rover.rover.core.events.contextproviders

import android.os.Build
import io.rover.rover.core.data.domain.DeviceContext
import io.rover.rover.core.events.ContextProvider

/**
 * Captures and adds details about the product details of the user's device and its running Android
 * version to [DeviceContext].
 */
class DeviceContextProvider: ContextProvider {
    override fun captureContext(deviceContext: DeviceContext): DeviceContext {
        return deviceContext.copy(
            operatingSystemVersion = Build.VERSION.RELEASE,
            operatingSystemName = "Android",
            deviceManufacturer = Build.MANUFACTURER,
            deviceModel = Build.MODEL
        )
    }
}
