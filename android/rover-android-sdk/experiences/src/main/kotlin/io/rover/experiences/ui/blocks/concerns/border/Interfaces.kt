package io.rover.experiences.ui.blocks.concerns.border

import io.rover.rover.core.data.domain.Border
import io.rover.experiences.ui.blocks.concerns.layout.LayoutPaddingDeflection
import io.rover.rover.core.ui.concerns.BindableView
import io.rover.rover.core.ui.concerns.BindableViewModel

/**
 * Binds [BorderViewModelInterface] properties to that of a view.
 *
 * Borders can specify a border of arbitrary width, with optional rounded corners.
 */
interface ViewBorderInterface: BindableView<BorderViewModelInterface>

/**
 * This interface is exposed by View Models that have support for a border (of arbitrary width and
 * possibly rounded with a radius).  Equivalent to the [Border] domain model interface.
 */
interface BorderViewModelInterface : LayoutPaddingDeflection, BindableViewModel {
    val borderColor: Int

    // TODO: this should start returning Px instead of Dp
    val borderRadius: Int

    // TODO: this should start returning Px instead of Dp
    val borderWidth: Int

    companion object
}
