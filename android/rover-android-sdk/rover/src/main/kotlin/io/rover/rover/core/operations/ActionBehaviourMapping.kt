package io.rover.rover.core.operations

import io.rover.rover.core.container.Resolver

class ActionBehaviourMapping(
    /**
     * Rover SDK DI container, used for resolving actions to their behaviours.
     */
    private val resolver: Resolver
) : ActionBehaviourMappingInterface {
    /**
     * Map an Action to its expected behaviour.
     */
    override fun mapToBehaviour(action: Action): ActionBehaviour {
        return action.operation(resolver)
    }

    // TODO: maybe have consumers register mappings?  This way I can avoid logic inside my models.
}
//
//
//class ActionMapping {
//    /**
//     * Register a mapping of
//     */
//    fun <T> registerAction(type: Class<T>, mapping: (action: T) -> ActionBehaviour) {
//
//    }
//}
