package io.rover.rover.core

import android.app.Application
import android.arch.lifecycle.ProcessLifecycleOwner
import android.bluetooth.BluetoothAdapter
import android.content.Context
import android.graphics.Color
import android.support.annotation.ColorInt
import io.rover.rover.core.assets.AndroidAssetService
import io.rover.rover.core.assets.AssetService
import io.rover.rover.core.assets.ImageDownloader
import io.rover.rover.core.assets.ImageOptimizationService
import io.rover.rover.core.assets.ImageOptimizationServiceInterface
import io.rover.rover.core.container.Assembler
import io.rover.rover.core.container.Container
import io.rover.rover.core.container.Resolver
import io.rover.rover.core.container.Scope
import io.rover.rover.core.data.AuthenticationContext
import io.rover.rover.core.data.ServerKey
import io.rover.rover.core.data.graphql.GraphQlApiService
import io.rover.rover.core.data.graphql.GraphQlApiServiceInterface
import io.rover.rover.core.data.http.AndroidHttpsUrlConnectionNetworkClient
import io.rover.rover.core.data.http.NetworkClient
import io.rover.rover.core.data.state.StateManagerService
import io.rover.rover.core.data.state.StateManagerServiceInterface
import io.rover.rover.core.events.ContextProvider
import io.rover.rover.core.events.DeviceAttributes
import io.rover.rover.core.events.DeviceAttributesInterface
import io.rover.rover.core.events.EventQueueService
import io.rover.rover.core.events.EventQueueServiceInterface
import io.rover.rover.core.events.contextproviders.ApplicationContextProvider
import io.rover.rover.core.events.contextproviders.BluetoothContextProvider
import io.rover.rover.core.events.contextproviders.DeviceAttributesContextProvider
import io.rover.rover.core.events.contextproviders.DeviceContextProvider
import io.rover.rover.core.events.contextproviders.DeviceIdentifierContextProvider
import io.rover.rover.core.events.contextproviders.DeviceNameContextProvider
import io.rover.rover.core.events.contextproviders.LocaleContextProvider
import io.rover.rover.core.events.contextproviders.ReachabilityContextProvider
import io.rover.rover.core.events.contextproviders.ScreenContextProvider
import io.rover.rover.core.events.contextproviders.SdkVersionContextProvider
import io.rover.rover.core.events.contextproviders.TelephonyContextProvider
import io.rover.rover.core.events.contextproviders.TimeZoneContextProvider
import io.rover.rover.core.permissions.PermissionsNotifier
import io.rover.rover.core.permissions.PermissionsNotifierInterface
import io.rover.rover.core.routing.DefaultTopLevelNavigation
import io.rover.rover.core.routing.LinkOpenInterface
import io.rover.rover.core.routing.Router
import io.rover.rover.core.routing.RouterService
import io.rover.rover.core.routing.TopLevelNavigation
import io.rover.rover.core.routing.routes.OpenAppRoute
import io.rover.rover.core.routing.website.EmbeddedWebBrowserDisplay
import io.rover.rover.core.routing.website.EmbeddedWebBrowserDisplayInterface
import io.rover.rover.core.streams.Scheduler
import io.rover.rover.core.streams.forAndroidMainThread
import io.rover.rover.core.streams.forExecutor
import io.rover.rover.core.tracking.ApplicationSessionEmitter
import io.rover.rover.core.tracking.SessionStore
import io.rover.rover.core.tracking.SessionStoreInterface
import io.rover.rover.core.tracking.SessionTracker
import io.rover.rover.core.tracking.SessionTrackerInterface
import io.rover.rover.core.ui.LinkOpen
import io.rover.rover.core.version.VersionTracker
import io.rover.rover.core.version.VersionTrackerInterface
import io.rover.rover.platform.DateFormatting
import io.rover.rover.platform.DateFormattingInterface
import io.rover.rover.platform.DeviceIdentification
import io.rover.rover.platform.DeviceIdentificationInterface
import io.rover.rover.platform.IoMultiplexingExecutor
import io.rover.rover.platform.LocalStorage
import io.rover.rover.platform.SharedPreferencesLocalStorage
import io.rover.rover.platform.whenNotNull
import java.net.URL
import java.util.concurrent.Executor

/**
 * The core module of the Rover SDK.
 *
 * You must always pass an instance of Assembler to Rover.initialize().  The Core module provides
 * access to the Rover API and is required for all other Rover functionality.
 */

class CoreAssembler @JvmOverloads constructor(
    private val accountToken: String,
    private val application: Application,
    /**
     * Rover deep links are customized for each app in this way:
     *
     * rv-myapp://...
     *
     * You must select an appropriate slug without spaces or special characters to be used in place
     * of `myapp` above.  You must also configure this in your Rover settings TODO explain how
     *
     * You should also consider adding the handler to the manifest.  While this is not needed for
     * any Rover functionality to work, it is required for clickable deep/universal links to work from
     * anywhere else. TODO explain how once the stuff to do so is built
     */
    private val deepLinkSchemeSlug: String,

    @param:ColorInt
    private val chromeTabBackgroundColor: Int = Color.BLACK,

    private val endpoint: String = "https://api.rover.io/graphql"
): Assembler {
    override fun assemble(container: Container) {
        container.register(Scope.Singleton, Context::class.java) { _ ->
            application
        }

        container.register(Scope.Singleton, Application::class.java) { _ ->
            application
        }

        container.register(Scope.Singleton, String::class.java, "deepLinkScheme") { _ ->
            "rv-$deepLinkSchemeSlug"
        }

        container.register(Scope.Singleton, NetworkClient::class.java) { resolver ->
            AndroidHttpsUrlConnectionNetworkClient(
                resolver.resolveSingletonOrFail(Scheduler::class.java, "io")
            )
        }

        container.register(Scope.Singleton, DateFormattingInterface::class.java) { _ ->
            DateFormatting()
        }

        container.register(Scope.Singleton, Executor::class.java, "io") { _ ->
            IoMultiplexingExecutor.build("io")
        }

        container.register(Scope.Singleton, Scheduler::class.java, "main") { _ ->
            Scheduler.forAndroidMainThread()
        }

        container.register(Scope.Singleton, Scheduler::class.java, "io") { resolver ->
            Scheduler.forExecutor(
                resolver.resolveSingletonOrFail(Executor::class.java, "io")
            )
        }

        container.register(Scope.Singleton, LocalStorage::class.java) { _ ->
            SharedPreferencesLocalStorage(application)
        }

        container.register(Scope.Singleton, DeviceIdentificationInterface::class.java) { resolver ->
            DeviceIdentification(resolver.resolveSingletonOrFail(LocalStorage::class.java))
        }

        container.register(Scope.Singleton, AuthenticationContext::class.java) { _ ->
            ServerKey(accountToken)
        }

        container.register(Scope.Singleton, GraphQlApiServiceInterface::class.java) { resolver ->
            GraphQlApiService(
                URL(endpoint),
                resolver.resolveSingletonOrFail(AuthenticationContext::class.java),
                resolver.resolveSingletonOrFail(NetworkClient::class.java),
                resolver.resolveSingletonOrFail(DateFormattingInterface::class.java)
            )
        }

        container.register(Scope.Singleton, PermissionsNotifierInterface::class.java) { _ ->
            PermissionsNotifier(
                application
            )
        }

        container.register(Scope.Singleton, ImageDownloader::class.java) { resolver ->
            ImageDownloader(resolver.resolveSingletonOrFail(Executor::class.java, "io"))
        }

        container.register(Scope.Singleton, AssetService::class.java) { resolver ->
            AndroidAssetService(
                resolver.resolveSingletonOrFail(ImageDownloader::class.java),
                resolver.resolveSingletonOrFail(Scheduler::class.java, "io"),
                resolver.resolveSingletonOrFail(Scheduler::class.java, "main")
            )
        }

        container.register(Scope.Singleton, ImageOptimizationServiceInterface::class.java) { _ ->
            ImageOptimizationService()
        }

        container.register(Scope.Singleton, VersionTrackerInterface::class.java) { resolver ->
            VersionTracker(
                application,
                resolver.resolveSingletonOrFail(EventQueueServiceInterface::class.java),
                resolver.resolveSingletonOrFail(LocalStorage::class.java)
            )
        }

        container.register(Scope.Singleton, DeviceAttributesInterface::class.java) { resolver ->
            DeviceAttributes(
                resolver.resolveSingletonOrFail(LocalStorage::class.java),
                resolver.resolveSingletonOrFail(EventQueueServiceInterface::class.java)
            )
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "device") { _ ->
            DeviceContextProvider()
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "locale") { _ ->
            LocaleContextProvider(application.resources)
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "reachability") { _ ->
            ReachabilityContextProvider(application)
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "screen") { _ ->
            ScreenContextProvider(application.resources)
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "telephony") { _ ->
            TelephonyContextProvider(application)
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "device") { _ ->
            DeviceContextProvider()
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "timeZone") { _ ->
            TimeZoneContextProvider()
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "attributes") { resolver ->
            DeviceAttributesContextProvider(
                resolver.resolveSingletonOrFail(
                    DeviceAttributesInterface::class.java
                )
            )
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "application") { _ ->
            ApplicationContextProvider(application)
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "deviceName") { _ ->
            DeviceNameContextProvider(application)
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "deviceIdentifier") { resolver ->
            DeviceIdentifierContextProvider(
                resolver.resolveSingletonOrFail(DeviceIdentificationInterface::class.java)
            )
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "sdkVersion") { _ ->
            SdkVersionContextProvider()
        }

        BluetoothAdapter.getDefaultAdapter().whenNotNull { bluetoothAdapter ->
            container.register(Scope.Singleton, ContextProvider::class.java, "bluetooth") { _ ->
                BluetoothContextProvider(bluetoothAdapter)
            }
        }

        container.register(Scope.Singleton, EventQueueServiceInterface::class.java) { resolver ->
            EventQueueService(
                resolver.resolveSingletonOrFail(GraphQlApiServiceInterface::class.java),
                resolver.resolveSingletonOrFail(LocalStorage::class.java),
                resolver.resolveSingletonOrFail(DateFormattingInterface::class.java),
                application,
                20,
                30.0,
                100,
                1000
            )
        }

        container.register(Scope.Singleton, EmbeddedWebBrowserDisplayInterface::class.java) { _ ->
            EmbeddedWebBrowserDisplay(
                chromeTabBackgroundColor
            )
        }

        container.register(Scope.Singleton, StateManagerServiceInterface::class.java) { resolver ->
            StateManagerService(
                resolver.resolveSingletonOrFail(DeviceIdentificationInterface::class.java),
                resolver.resolveSingletonOrFail(GraphQlApiServiceInterface::class.java)
            )
        }

        container.register(
            Scope.Singleton,
            TopLevelNavigation::class.java
        ) { _ ->
            DefaultTopLevelNavigation(application)
        }

        container.register(
            Scope.Singleton,
            Router::class.java
        ) { resolver ->
            RouterService(
                resolver.resolveSingletonOrFail(TopLevelNavigation::class.java)
            )
        }

        container.register(
            Scope.Singleton,
            LinkOpenInterface::class.java
        ) { resolver ->
            LinkOpen(
                resolver.resolveSingletonOrFail(Router::class.java),
                deepLinkSchemeSlug
            )
        }

        container.register(Scope.Singleton, SessionStoreInterface::class.java) { resolver ->
            SessionStore(
                resolver.resolveSingletonOrFail(LocalStorage::class.java)
            )
        }

        container.register(
            Scope.Singleton,
            SessionTrackerInterface::class.java
        ) { resolver ->
            SessionTracker(
                resolver.resolveSingletonOrFail(EventQueueServiceInterface::class.java),
                resolver.resolveSingletonOrFail(SessionStoreInterface::class.java),
                10
            )
        }

        container.register(
            Scope.Singleton,
            ApplicationSessionEmitter::class.java
        ) { resolver ->
            ApplicationSessionEmitter(
                ProcessLifecycleOwner.get().lifecycle,
                resolver.resolveSingletonOrFail(SessionTrackerInterface::class.java)
            )
        }
    }

    override fun afterAssembly(resolver: Resolver) {
        val eventQueue = resolver.resolveSingletonOrFail(EventQueueServiceInterface::class.java)

        listOf(
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "device"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "locale"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "reachability"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "screen"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "telephony"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "timeZone"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "attributes"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "application"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "deviceName"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "deviceIdentifier"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "sdkVersion")
        ).forEach { eventQueue.addContextProvider(it) }

        resolver.resolveSingletonOrFail(VersionTrackerInterface::class.java).trackAppVersion()

        resolver.resolveSingletonOrFail(ApplicationSessionEmitter::class.java).start()

        resolver.resolve(ContextProvider::class.java, "bluetooth").whenNotNull { eventQueue.addContextProvider(it) }

        resolver.resolveSingletonOrFail(Router::class.java).apply {
            registerRoute(
                OpenAppRoute(resolver.resolveSingletonOrFail(TopLevelNavigation::class.java))
            )
        }
    }
}