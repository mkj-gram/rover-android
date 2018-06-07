package io.rover.rover.core

import android.app.Application
import android.arch.lifecycle.ProcessLifecycleOwner
import android.bluetooth.BluetoothAdapter
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.support.annotation.ColorInt
import io.rover.rover.BuildConfig
import io.rover.rover.core.assets.AndroidAssetService
import io.rover.rover.core.assets.AssetService
import io.rover.rover.core.assets.ImageDownloader
import io.rover.rover.core.assets.ImageOptimizationService
import io.rover.rover.core.assets.ImageOptimizationServiceInterface
import io.rover.rover.core.container.Assembler
import io.rover.rover.core.container.Container
import io.rover.rover.core.container.Resolver
import io.rover.rover.core.container.Scope
import io.rover.rover.core.context.ModulesTracker
import io.rover.rover.core.context.ModulesTrackerInterface
import io.rover.rover.core.data.AuthenticationContext
import io.rover.rover.core.data.ServerKey
import io.rover.rover.core.data.domain.Attributes
import io.rover.rover.core.data.graphql.GraphQlApiService
import io.rover.rover.core.data.graphql.GraphQlApiServiceInterface
import io.rover.rover.core.data.graphql.WireEncoder
import io.rover.rover.core.data.http.AsyncTaskAndHttpUrlConnectionNetworkClient
import io.rover.rover.core.data.http.NetworkClient
import io.rover.rover.core.data.http.WireEncoderInterface
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
import io.rover.rover.core.events.contextproviders.ModulesContextProvider
import io.rover.rover.core.events.contextproviders.ReachabilityContextProvider
import io.rover.rover.core.events.contextproviders.RoverSdkCoreVersionContextProvider
import io.rover.rover.core.events.contextproviders.ScreenContextProvider
import io.rover.rover.core.events.contextproviders.TelephonyContextProvider
import io.rover.rover.core.events.contextproviders.TimeZoneContextProvider
import io.rover.rover.core.events.domain.Event
import io.rover.rover.core.logging.AndroidLogger
import io.rover.rover.core.logging.EventQueueLogger
import io.rover.rover.core.logging.GlobalStaticLogHolder
import io.rover.rover.core.operations.ActionBehaviour
import io.rover.rover.core.operations.ActionBehaviourMapping
import io.rover.rover.core.operations.ActionBehaviourMappingInterface
import io.rover.rover.core.permissions.PermissionsNotifier
import io.rover.rover.core.permissions.PermissionsNotifierInterface
import io.rover.rover.core.routing.ActionIntentBackstackSynthesizer
import io.rover.rover.core.routing.ActionIntentBackstackSynthesizerInterface
import io.rover.rover.core.routing.DefaultTopLevelNavigation
import io.rover.rover.core.routing.LinkOpenInterface
import io.rover.rover.core.routing.TopLevelNavigation
import io.rover.rover.core.routing.website.EmbeddedWebBrowserDisplay
import io.rover.rover.core.routing.website.EmbeddedWebBrowserDisplayInterface
import io.rover.rover.core.streams.Scheduler
import io.rover.rover.core.streams.forAndroidMainThread
import io.rover.rover.core.tracking.ApplicationSessionEmitter
import io.rover.rover.core.tracking.SessionDirection
import io.rover.rover.core.tracking.SessionEventProvider
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
import java.net.URI
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
    private val deepLinkSchemaSlug: String,

    @param:ColorInt
    private val chromeTabBackgroundColor: Int = Color.BLACK,

    private val endpoint: String = "https://api.rover.io/graphql"
): Assembler {
    override fun assemble(container: Container) {
        container.register(Scope.Singleton, Context::class.java) { _ ->
            application
        }

        container.register(Scope.Singleton, ModulesTrackerInterface::class.java) { _ ->
            ModulesTracker()
        }

        container.register(Scope.Singleton, NetworkClient::class.java) { _ ->
            AsyncTaskAndHttpUrlConnectionNetworkClient()
        }

        container.register(Scope.Singleton, DateFormattingInterface::class.java) { _ ->
            DateFormatting()
        }

        container.register(Scope.Singleton, WireEncoderInterface::class.java) { resolver ->
            WireEncoder(resolver.resolveSingletonOrFail(DateFormattingInterface::class.java))
        }

        container.register(Scope.Singleton, Executor::class.java, "io") { _ ->
            IoMultiplexingExecutor.build("io")
        }

        container.register(Scope.Singleton, Scheduler::class.java, "main") { _ ->
            Scheduler.forAndroidMainThread()
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
                resolver.resolveSingletonOrFail(WireEncoderInterface::class.java),
                resolver.resolveSingletonOrFail(NetworkClient::class.java)
            )
        }

        container.register(Scope.Singleton, PermissionsNotifierInterface::class.java) { resolver ->
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
                resolver.resolveSingletonOrFail(Executor::class.java, "io")
            )
        }

        container.register(Scope.Singleton, ImageOptimizationServiceInterface::class.java) { resolver ->
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

        container.register(Scope.Singleton, ContextProvider::class.java, "coreVersion") { _ ->
            RoverSdkCoreVersionContextProvider()
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

        container.register(Scope.Singleton, ContextProvider::class.java, "modules") { resolver ->
            ModulesContextProvider(
                resolver.resolveSingletonOrFail(ModulesTrackerInterface::class.java)
            )
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "application") { resolver ->
            ApplicationContextProvider(application)
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "deviceName") { resolver ->
            DeviceNameContextProvider(application)
        }

        container.register(Scope.Singleton, ContextProvider::class.java, "deviceIdentifier") { resolver ->
            DeviceIdentifierContextProvider(
                resolver.resolveSingletonOrFail(DeviceIdentificationInterface::class.java)
            )
        }

        BluetoothAdapter.getDefaultAdapter().whenNotNull { bluetoothAdapter ->
            container.register(Scope.Singleton, ContextProvider::class.java, "bluetooth") { resolver ->
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

        container.register(Scope.Singleton, EmbeddedWebBrowserDisplayInterface::class.java) { resolver ->
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
        ) { resolver ->
            DefaultTopLevelNavigation(application)
        }

        container.register(
            Scope.Singleton,
            ActionIntentBackstackSynthesizerInterface::class.java
        ) { resolver ->
            ActionIntentBackstackSynthesizer(
                application,
                resolver.resolveSingletonOrFail(TopLevelNavigation::class.java)
            )
        }

        container.register(
            Scope.Singleton,
            LinkOpenInterface::class.java
        ) { resolver ->
            LinkOpen(
                resolver.resolveSingletonOrFail(ActionBehaviourMappingInterface::class.java),
                resolver.resolveSingletonOrFail(ActionIntentBackstackSynthesizerInterface::class.java),
                deepLinkSchemaSlug
            )
        }

        container.register(Scope.Singleton, SessionStoreInterface::class.java) { resolver ->
            SessionStore(
                resolver.resolveSingletonOrFail(LocalStorage::class.java)
            )
        }

        container.register(
            Scope.Transient,
            SessionTrackerInterface::class.java
        ) { resolver, eventProvider: SessionEventProvider, keepAliveTime: Int ->
            SessionTracker(
                resolver.resolveSingletonOrFail(EventQueueServiceInterface::class.java),
                resolver.resolveSingletonOrFail(SessionStoreInterface::class.java),
                eventProvider,
                keepAliveTime
            )
        }

        container.register(
            Scope.Singleton,
            ApplicationSessionEmitter::class.java
        ) { resolver ->
            val eventProvider = object : SessionEventProvider {
                override fun eventForSessionBoundary(direction: SessionDirection, attributes: Attributes): Event {
                    return Event(
                        when(direction) {
                            SessionDirection.Start -> "App Opened"
                            SessionDirection.Stop -> "App Closed"
                        }, hashMapOf()
                    )
                }
            }

            ApplicationSessionEmitter(
                ProcessLifecycleOwner.get().lifecycle,
                resolver.resolve(SessionTrackerInterface::class.java, null, eventProvider, 60) ?: throw RuntimeException("Could not create Session Tracker for application session. ")
            )
        }

        container.register(
            Scope.Singleton,
            ActionBehaviourMappingInterface::class.java
        ) { resolver ->
            ActionBehaviourMapping(resolver)
        }

        container.register(
            Scope.Transient,
            ActionBehaviour::class.java,
            "openURL"
        ) { resolver, url: URI ->
            // what if I map them
            ActionBehaviour.IntentAction(
                Intent(
                    Intent.ACTION_VIEW,
                    Uri.parse(url.toString())
                )
            )
        }

        container.register(
            Scope.Transient,
            ActionBehaviour::class.java,
            "presentWebsite"
        ) { resolver, url: URL ->
            ActionBehaviour.IntentAction(
                resolver.resolveSingletonOrFail(EmbeddedWebBrowserDisplayInterface::class.java).intentForViewingWebsiteViaEmbeddedBrowser(
                    url.toString()
                )
            )
        }

        container.register(
            Scope.Transient,
            ActionBehaviour::class.java,
            "presentNotificationCenter"
        ) { resolver ->
            ActionBehaviour.IntentAction(
                resolver.resolveSingletonOrFail(TopLevelNavigation::class.java).displayNotificationCenterIntent()
            )
        }

        container.register(
            Scope.Transient,
            ActionBehaviour::class.java,
            "openApp"
        ) { resolver ->
            ActionBehaviour.IntentAction(
                resolver.resolveSingletonOrFail(TopLevelNavigation::class.java).openAppIntent()
            )
        }
    }

    override fun afterAssembly(resolver: Resolver) {
        val eventQueue = resolver.resolveSingletonOrFail(EventQueueServiceInterface::class.java)

        listOf(
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "device"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "locale"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "reachability"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "coreVersion"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "screen"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "telephony"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "timeZone"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "attributes"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "modules"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "application"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "deviceName"),
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "deviceIdentifier")
        ).forEach { eventQueue.addContextProvider(it) }

        resolver.resolveSingletonOrFail(ModulesTrackerInterface::class.java).version(
            "core",
            BuildConfig.VERSION_NAME
        )

        resolver.resolveSingletonOrFail(VersionTrackerInterface::class.java).trackAppVersion()

        resolver.resolveSingletonOrFail(ApplicationSessionEmitter::class.java).start()

        resolver.resolve(ContextProvider::class.java, "bluetooth").whenNotNull { eventQueue.addContextProvider(it) }
    }
}