package io.rover.notifications.domain

import io.rover.rover.core.container.Resolver
import io.rover.rover.core.operations.Action
import io.rover.rover.core.operations.ActionBehaviour
import java.net.URI
import java.net.URL
import java.util.Date

/**
 * Rover push notifications have this format.
 *
 * Note that this is used not only in the GraphQL API but also in the push notification payloads
 * delivered over the push platform (typically FCM).
 *
 * When received from Firebase, they are delivered as a JSON-encoded object set as the `message` key
 * on the Firebase `RemoteMessage`.
 *
 */
data class Notification(
    val id: String,

    /**
     * An Android channel ID.  If not set, Rover will use the default channel id set for the whole
     * Push Plugin (see [PushPluginAssembler]).
     */
    val channelId: String?,

    val title: String?,
    val body: String,

    /**
     * Has this notification been read?
     *
     * (when received over push this will always be false)
     */
    val isRead: Boolean,

    /**
     * Has this notification been deleted?
     *
     * When received over push will always be false.
     *
     * However, note that, for now, this will always be false when being returned from the device
     * state GraphQL API as well, although the API reserves the possibility of setting it to be
     * true in the future.
     */
    val isDeleted: Boolean,

    val isNotificationCenterEnabled: Boolean,

    val expiresAt: Date?,

    val deliveredAt: Date,

    val action: Action?,

    val attachment: NotificationAttachment?
) {
    companion object;

    /**
     * The allowable behaviours that can be embedded in a notification.
     */
    sealed class Action: io.rover.rover.core.operations.Action {
        data class OpenURL(val url: URI) : Action() {
            // TODO how do I move these out of the model definition?
            override fun operation(resolver: Resolver): ActionBehaviour {
                return resolver.resolve(ActionBehaviour::class.java, "openURL", url) ?: ActionBehaviour.NotAvailable()
            }
        }
        data class PresentExperience(val campaignId: String): Action() {
            override fun operation(resolver: Resolver): ActionBehaviour {
                return resolver.resolve(ActionBehaviour::class.java, "presentExperience", campaignId) ?: ActionBehaviour.NotAvailable()
            }
        }

        data class PresentWebsite(val url: URL): Action() {
            override fun operation(resolver: Resolver): ActionBehaviour {
                return resolver.resolve(ActionBehaviour::class.java, "presentWebsite", url) ?: ActionBehaviour.NotAvailable()
            }
        }

        companion object
    }
}


sealed class NotificationAttachment(
    val typeName: String,
    val url: URL
) {
    class Audio(url: URL): NotificationAttachment("audio", url)
    class Image(url: URL): NotificationAttachment("image", url)
    class Video(url: URL): NotificationAttachment("video", url)

    override fun toString(): String {
        return "NotificationAttachment(typeName=$typeName, url=$url)"
    }

    companion object
}