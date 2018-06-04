package io.rover.experiences.ui.blocks.concerns.border

import io.rover.rover.core.data.domain.Border
import io.rover.rover.core.ui.Rect
import io.rover.rover.core.ui.asAndroidColor

class BorderViewModel(
    val border: Border
) : BorderViewModelInterface {
    override val borderColor: Int
        get() = border.color.asAndroidColor()

    override val borderRadius: Int
        get() = border.radius

    override val borderWidth: Int
        get() = border.width

    override val paddingDeflection: Rect
        get() = Rect(
            border.width,
            border.width,
            border.width,
            border.width
        )
}
