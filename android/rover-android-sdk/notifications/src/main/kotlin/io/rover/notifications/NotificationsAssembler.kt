package io.rover.notifications

import android.content.Context
import android.support.annotation.DrawableRes
import io.rover.rover.core.assets.AssetService
import io.rover.rover.core.container.Assembler
import io.rover.rover.core.container.Container
import io.rover.rover.core.container.Resolver
import io.rover.rover.core.container.Scope
import io.rover.rover.core.data.domain.Attributes
import io.rover.rover.core.data.http.WireEncoderInterface
import io.rover.rover.core.data.state.StateManagerServiceInterface
import io.rover.rover.core.events.ContextProvider
import io.rover.rover.core.events.EventQueueServiceInterface
import io.rover.rover.core.events.contextproviders.FirebasePushTokenContextProvider
import io.rover.rover.core.events.domain.Event
import io.rover.rover.core.operations.ActionBehaviour
import io.rover.rover.core.operations.ActionBehaviourMappingInterface
import io.rover.rover.core.routing.TopLevelNavigation
import io.rover.rover.core.streams.Scheduler
import io.rover.rover.core.tracking.SessionEventProvider
import io.rover.rover.core.tracking.SessionTrackerInterface
import io.rover.rover.core.tracking.SessionDirection
import io.rover.notifications.domain.Notification
import io.rover.notifications.ui.NotificationCenterListViewModel
import io.rover.notifications.ui.concerns.NotificationCenterListViewModelInterface
import io.rover.notifications.ui.concerns.NotificationsRepositoryInterface
import io.rover.rover.core.routing.ActionIntentBackstackSynthesizerInterface
import io.rover.rover.platform.DateFormattingInterface
import io.rover.rover.platform.LocalStorage
import java.util.concurrent.Executor

class NotificationsAssembler @JvmOverloads constructor(
    private val applicationContext: Context,

    /**
     * A small icon is necessary for Android push notifications.  Pass a resid.
     *
     * Android design guidelines suggest that you use a multi-level drawable for your application
     * icon, such that you can specify one of its levels that is most appropriate as a single-colour
     * silhouette that can be used in the Android notification drawer.
     */
    @param:DrawableRes
    private val smallIconResId: Int,

    /**
     * The drawable level of [smallIconResId] that should be used for the icon silhouette used in
     * the notification drawer.
     */
    private val smallIconDrawableLevel: Int = 0,

    private val defaultChannelId: String = "rover",

    /**
     * While normally your `FirebaseInstanceIdService` class will be responsible for being
     * informed of push token changes, from time to time (particularly on app upgrades or when
     * Rover 2.0 is first integrated in your app) Rover may need to force a reset of your Firebase
     * push token.
     *
     * This closure will be called on a background worker thread.  Please pass a block with
     * the following contents:
     *
     * ```kotlin
     * FirebaseInstanceId.getInstance().deleteInstanceId()
     * FirebaseInstanceId.getInstance().token
     * ```
     */
    private val resetPushToken: () -> Unit
) : Assembler {
    override fun assemble(container: Container) {
        container.register(
            Scope.Singleton,
            NotificationsRepositoryInterface::class.java
        ) { resolver ->
            NotificationsRepository(
                resolver.resolveSingletonOrFail(DateFormattingInterface::class.java),
                resolver.resolveSingletonOrFail(Executor::class.java, "io"),
                resolver.resolveSingletonOrFail(Scheduler::class.java, "main"),
                resolver.resolveSingletonOrFail(EventQueueServiceInterface::class.java),
                resolver.resolveSingletonOrFail(StateManagerServiceInterface::class.java),
                resolver.resolveSingletonOrFail(LocalStorage::class.java)
            )
        }

        // adds an additional context provider to the Events system (which itself is in Core)
        // to capture the push token and ship it up via an Event.
        container.register(Scope.Singleton, ContextProvider::class.java, "pushToken") { resolver ->
            FirebasePushTokenContextProvider(
                resolver.resolveSingletonOrFail(LocalStorage::class.java),
                resetPushToken
            )
        }

        container.register(
            Scope.Transient, // can be a singleton because it is stateless and has no parameters.
            NotificationCenterListViewModelInterface::class.java
        ) { resolver ->
            val eventProvider = object : SessionEventProvider {
                override fun eventForSessionBoundary(direction: SessionDirection, attributes: Attributes): Event {
                    return Event(
                        when(direction) {
                            SessionDirection.Start -> "Notification Center Presented"
                            SessionDirection.Stop -> "Notification Center Dismissed"
                        }, hashMapOf()
                    )
                }
            }

            NotificationCenterListViewModel(
                resolver.resolveSingletonOrFail(NotificationsRepositoryInterface::class.java),
                resolver.resolve(SessionTrackerInterface::class.java, null, eventProvider, 60)!!
            )
        }

        container.register(
            Scope.Singleton,
            NotificationOpenInterface::class.java
        ) { resolver ->
            NotificationOpen(
                applicationContext,
                resolver.resolveSingletonOrFail(DateFormattingInterface::class.java),
                resolver.resolveSingletonOrFail(EventQueueServiceInterface::class.java),
                resolver.resolveSingletonOrFail(ActionBehaviourMappingInterface::class.java),
                resolver.resolveSingletonOrFail(ActionIntentBackstackSynthesizerInterface::class.java)
            )
        }

        container.register(
            Scope.Singleton,
            PushReceiverInterface::class.java
        ) { resolver ->
            PushReceiver(
                resolver.resolveSingletonOrFail(EventQueueServiceInterface::class.java),
                resolver.resolveSingletonOrFail(DateFormattingInterface::class.java),
                resolver.resolveSingletonOrFail(ActionBehaviourMappingInterface::class.java)
            )
        }

        container.register(Scope.Singleton, ContextProvider::class.java,"notification") { _ ->
            NotificationContextProvider(applicationContext)
        }

        container.register(
            Scope.Singleton,
            PushNotificationActionBehaviourBuilder::class.java
        ) { resolver ->
            PushNotificationActionBehaviourBuilder(
                applicationContext,
                resolver.resolveSingletonOrFail(Scheduler::class.java, "main"),
                resolver.resolveSingletonOrFail(NotificationsRepositoryInterface::class.java),
                resolver.resolveSingletonOrFail(NotificationOpenInterface::class.java),
                resolver.resolveSingletonOrFail(AssetService::class.java),
                smallIconResId,
                smallIconDrawableLevel,
                defaultChannelId
            )
        }

        container.register(
            Scope.Transient,
            ActionBehaviour::class.java,
            "addNotification"
        ) { resolver, notification: Notification ->
            resolver.resolveSingletonOrFail(PushNotificationActionBehaviourBuilder::class.java).build(
                notification
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
    }

    override fun afterAssembly(resolver: Resolver) {
        val eventQueue = resolver.resolveSingletonOrFail(EventQueueServiceInterface::class.java)
        // wire up the push context provider such that the current push token can always be
        // included with outgoing events.
        val pushTokenContextProvider = resolver.resolveSingletonOrFail(ContextProvider::class.java, "pushToken")
        eventQueue.addContextProvider(
            pushTokenContextProvider
        )

        resolver.resolveSingletonOrFail(EventQueueServiceInterface::class.java).addContextProvider(
            resolver.resolveSingletonOrFail(ContextProvider::class.java, "notification")
        )

        resolver.resolveSingletonOrFail(NotificationsRepositoryInterface::class.java)
    }
}
