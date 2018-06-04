package io.rover.rover.core.ui

import android.content.Intent
import io.rover.rover.core.container.Resolver
import io.rover.rover.core.logging.log
import io.rover.rover.core.operations.Action
import io.rover.rover.core.operations.ActionBehaviour
import io.rover.rover.core.operations.ActionBehaviourMappingInterface
import io.rover.rover.core.routing.LinkOpenInterface
import io.rover.rover.core.routing.TopLevelNavigation
import io.rover.rover.core.routing.ActionIntentBackstackSynthesizerInterface
import java.net.URI
import java.net.URL

class LinkOpen(
    private val routingBehaviour: ActionBehaviourMappingInterface,
    private val synthesizerInterface: ActionIntentBackstackSynthesizerInterface,
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
    deepLinkSchemaSlug: String
): LinkOpenInterface {

    init {
        // validate the deep link slug and ensure it's sane.

        when {
            deepLinkSchemaSlug.isBlank() -> throw RuntimeException("Deep link schema slug must not be blank.")
            deepLinkSchemaSlug.startsWith("rv-") -> throw RuntimeException("Do not include the `rv-` prefix do your deep link schema slug.  That is added for you.")
            deepLinkSchemaSlug.contains(" ") -> throw RuntimeException("Deep link schema slug must not contain spaces.")
            // TODO: check for special characters.
        }
    }

    private val fullSchema = "rv-$deepLinkSchemaSlug"

    override fun localIntentForReceived(receivedUri: URI): List<Intent> {
        return if(receivedUri.scheme == "https" || receivedUri.scheme == "http") {
            // so, if it is an http or https, we can assume it is a Rover Experience universal link.

            val resolvedBehaviour = routingBehaviour.mapToBehaviour(
                UniversalLinkAction(receivedUri.toURL())
            )

            // now be sure that we got an intent behaviour because it is the only sort that we
            // support.
            val behaviour = when(resolvedBehaviour) {
                is ActionBehaviour.IntentAction -> {
                    resolvedBehaviour
                }
                else -> {
                    log.w("Universal link yielded inappropriate action behaviour: $resolvedBehaviour, defaulting to opening app.")
                    routingBehaviour.mapToBehaviour(
                        OpenAppAction()
                    )
                }
            } as ActionBehaviour.IntentAction

            synthesizerInterface.synthesizeNotificationIntentStack(
                behaviour.intent,
                false
            )
        } else {
            // handle deep link

            val queryParams = receivedUri.query?.parseAsQueryParameters()

            val (useBackstack, action) = when(receivedUri.scheme) {
                fullSchema -> {
                    when (receivedUri.authority) {
                        "experience" -> {
                            val campaignId = queryParams?.get("campaignId")
                            val internalLink = queryParams?.get("internal") == "true"

                            if (campaignId.isNullOrBlank()) {
                                log.w("`campaignId` query parameter missing from Present Experience deep link.")
                                // just default to opening the app in this case.

                                Pair(false, DeepLinkAction.PresentNotificationCenter())
                            } else {
                                Pair(!internalLink, DeepLinkAction.PresentExperience(campaignId!!))
                            }
                        }
                        "presentNotificationCenter" -> {
                            Pair(false, DeepLinkAction.PresentNotificationCenter())
                        }
                        else -> {
                            log.w("Unknown authority given in deep link: ${receivedUri}")
                            // just default to opening the app in this case.
                            Pair(false, DeepLinkAction.PresentNotificationCenter())

                        }
                    }
                }
                else -> {
                    // unhandled deep link that does not match the slug.
                    Pair(false, DeepLinkAction.PresentNotificationCenter())
                }
            }

            val resolvedBehaviour = routingBehaviour.mapToBehaviour(
                action
            )
            // now be sure that we got an intent behaviour because it is the only sort that we
            // support.
            val behaviour = when(resolvedBehaviour) {
                is ActionBehaviour.IntentAction -> {
                    resolvedBehaviour
                }
                else -> {
                    log.w("Universal link yielded inappropriate action behaviour: $resolvedBehaviour, defaulting to opening app.")
                    routingBehaviour.mapToBehaviour(
                        OpenAppAction()
                    )
                }
            } as ActionBehaviour.IntentAction

            if(useBackstack) {
                synthesizerInterface.synthesizeNotificationIntentStack(
                    behaviour.intent,
                    false
                )
            } else {
                listOf(
                    behaviour.intent
                )
            }
        }
    }
}

sealed class DeepLinkAction: Action {
    data class PresentExperience(val campaignId: String): DeepLinkAction() {
        override fun operation(resolver: Resolver): ActionBehaviour {
            return resolver.resolve(ActionBehaviour::class.java, "presentExperience", campaignId) ?: ActionBehaviour.NotAvailable()
        }
    }

    class PresentNotificationCenter(): Action {
        override fun operation(resolver: Resolver): ActionBehaviour {
            return resolver.resolve(ActionBehaviour::class.java, "presentNotificationCenter") ?: ActionBehaviour.NotAvailable()
        }
    }

    class OpenApp(): Action {
        override fun operation(resolver: Resolver): ActionBehaviour {
            return super.operation(resolver)
        }
    }
}
data class UniversalLinkAction(val url: URL): Action {
    override fun operation(resolver: Resolver): ActionBehaviour {
        return resolver.resolve(ActionBehaviour::class.java, "universalLink") ?: ActionBehaviour.NotAvailable()
    }
}

private fun String.parseAsQueryParameters(): Map<String, String> {
    return split("&").map {
        val keyAndValue = it.split("=")
        Pair(keyAndValue.first(), keyAndValue[1])
    }.associate { it }
}

class OpenAppAction: Action {
    override fun operation(resolver: Resolver): ActionBehaviour {
        return resolver.resolve(
            ActionBehaviour::class.java,
            "openApp"
        )!!
    }
}
