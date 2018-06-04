package io.rover.notifications.domain

import io.rover.rover.core.container.Resolver
import io.rover.rover.core.container.Scope
import io.rover.rover.core.operations.Action
import io.rover.rover.core.operations.ActionBehaviour

/**
 * Actions that may be received via a push and executed -- headless -- immediately.
 *
 * Look at [Notification.Action] to see what actions may be executed when a received notification
 * is actually tapped.
 */
sealed class PushAction: Action {
    class AddNotificationAction(
        val notification: Notification
    ): PushAction() {
        companion object;

        override fun operation(resolver: Resolver): ActionBehaviour {
            return resolver.resolve(
                ActionBehaviour::class.java,
                "addNotification",
                notification
            )  ?: ActionBehaviour.NotAvailable()
        }
    }

    companion object
}
