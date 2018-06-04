package io.rover.experiences.ui.blocks.button

import io.rover.experiences.ui.blocks.concerns.layout.BlockViewModelInterface
import io.rover.experiences.ui.blocks.concerns.layout.LayoutableViewModel
import io.rover.experiences.ui.blocks.concerns.background.BackgroundViewModelInterface
import io.rover.experiences.ui.blocks.concerns.border.BorderViewModelInterface
import io.rover.experiences.ui.blocks.concerns.layout.BlockViewModel
import io.rover.experiences.ui.blocks.concerns.layout.CompositeBlockViewModelInterface
import io.rover.experiences.ui.blocks.concerns.text.TextViewModelInterface
import io.rover.rover.core.ui.concerns.BindableViewModel
import org.reactivestreams.Publisher

/**
 * View Model for block content that contains a clickable button.
 *
 * Note that if you're looking for the Click event, that is handled more generally in
 * [BlockViewModel].
 */
interface ButtonViewModelInterface {
    val buttonEvents: Publisher<Event>

    sealed class Event {
        /**
         * Animate the button for the given state.
         */
        data class DisplayState(
            val animate: Boolean,

            /**
             * The owning view will maintain a set of background views itself for allowing for
             * partially occlusive transitions between button states.  This means it has need to
             * know which of the backgrounds it should display on a given [Event.DisplayState]
             * event.
             */
            val stateOfButton: StateOfButton,

            /**
             * The given animation should undo itself afterwards.
             */
            val selfRevert: Boolean
        ) : Event()
    }
}

interface ButtonBlockViewModelInterface :
    CompositeBlockViewModelInterface,
    LayoutableViewModel,
    BlockViewModelInterface,
    BackgroundViewModelInterface,
    BorderViewModelInterface,
    ButtonViewModelInterface,
    TextViewModelInterface

interface ButtonStateViewModelInterface :
    BindableViewModel,
    TextViewModelInterface,
    BackgroundViewModelInterface,
    BorderViewModelInterface

enum class StateOfButton {
    Normal,
    Disabled,
    Highlighted,
    Selected
}