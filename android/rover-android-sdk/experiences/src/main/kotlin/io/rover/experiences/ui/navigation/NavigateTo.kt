package io.rover.experiences.ui.navigation

import io.rover.rover.core.operations.ActionBehaviour
import java.net.URI

/**
 * Should navigate to the given URL or Screen.
 */
sealed class NavigateTo {
    /**
     * Navigate to something external to the experience.
     */
    class External(
        val actionBehaviour: ActionBehaviour
    ): NavigateTo()

    class GoToScreenAction(
        val screenId: String
    ) : NavigateTo()
}
