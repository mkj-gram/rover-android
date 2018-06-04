package io.rover.rover.core.events.contextproviders

import android.provider.Settings
import io.rover.rover.core.data.domain.DeviceContext
import io.rover.rover.core.events.ContextProvider

class DeviceNameContextProvider(
    applicationContext: android.content.Context
) : ContextProvider {
    // On many manufacturers' Android devices, the set device name manifests as the Bluetooth name,
    // but not as the device hostname.  So, we'll ignore the device hostname and use the Bluetooth
    // name, if available.
    private val deviceName = Settings.Secure.getString(
        applicationContext.contentResolver, "bluetooth_name"
    )

    override fun captureContext(deviceContext: DeviceContext): DeviceContext {
        return deviceContext.copy(
            deviceName = deviceName
        )
    }
}
