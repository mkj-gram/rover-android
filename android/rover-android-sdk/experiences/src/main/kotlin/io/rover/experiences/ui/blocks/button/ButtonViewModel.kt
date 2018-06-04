package io.rover.experiences.ui.blocks.button

import io.rover.experiences.ui.blocks.concerns.layout.BlockViewModelInterface
import io.rover.rover.core.streams.PublisherOperators
import io.rover.rover.core.streams.map
import io.rover.rover.core.streams.share
import org.reactivestreams.Publisher

class ButtonViewModel(
    blockViewModel: BlockViewModelInterface
) : ButtonViewModelInterface {

    private val epic = blockViewModel
        .events
        .map { event ->
            when (event) {
                is BlockViewModelInterface.Event.Touched -> ButtonViewModelInterface.Event.DisplayState(
                    true, StateOfButton.Highlighted, false
                )
                is BlockViewModelInterface.Event.Released -> ButtonViewModelInterface.Event.DisplayState(
                     true, StateOfButton.Normal, false
                )
                is BlockViewModelInterface.Event.Clicked -> ButtonViewModelInterface.Event.DisplayState(
                    true, StateOfButton.Selected, true
                )
            }
        }
        .share()

    override val buttonEvents: Publisher<ButtonViewModelInterface.Event> = PublisherOperators.concat(
        // start by setting any newly subscribed view to the Normal state!
        PublisherOperators.just(
            ButtonViewModelInterface.Event.DisplayState(
                 false, StateOfButton.Normal, false
            )
        ),
        // and then subscribe to the event stream as normal
        epic
    )
}
