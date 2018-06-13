package io.rover.experiences.ui.blocks.image

import android.graphics.Bitmap
import android.util.DisplayMetrics
import org.reactivestreams.Publisher
import io.rover.rover.core.data.http.NetworkTask
import io.rover.experiences.ui.blocks.concerns.background.BackgroundViewModelInterface
import io.rover.experiences.ui.blocks.concerns.border.BorderViewModelInterface
import io.rover.experiences.ui.blocks.concerns.layout.BlockViewModelInterface
import io.rover.experiences.ui.blocks.concerns.layout.LayoutableViewModel
import io.rover.rover.core.ui.PixelSize
import io.rover.experiences.ui.blocks.concerns.layout.CompositeBlockViewModelInterface
import io.rover.experiences.ui.blocks.concerns.layout.Measurable
import io.rover.rover.core.ui.concerns.BindableView
import io.rover.rover.core.ui.concerns.BindableViewModel
import io.rover.rover.core.ui.concerns.MeasuredSize
import io.rover.rover.core.ui.concerns.PrefetchAfterMeasure

// ViewImage mixin is binding against ImageBlockViewModelInterface instead of
// ImageViewModelInterface in order to discover the block's opacity for use in an animation.  This
// is a hack and should be solved properly.
interface ViewImageInterface: BindableView<ImageBlockViewModelInterface>

interface ImageViewModelInterface : Measurable, BindableViewModel, PrefetchAfterMeasure {
    /**
     * Subscribe to be informed of the image becoming ready.
     */
    val imageUpdates: Publisher<ImageUpdate>

    data class ImageUpdate(
        val bitmap: Bitmap,
        val fadeIn: Boolean
    )

    /**
     * Inform the view model of the display geometry of the image view, so that it may
     * make an attempt to retrieve the image for display.
     *
     * Be sure to subscribe to [imageUpdates] first.
     */
    fun informDimensions(
        measuredSize: MeasuredSize
    )
}

interface ImageBlockViewModelInterface :
    CompositeBlockViewModelInterface,
    LayoutableViewModel,
    BlockViewModelInterface,
    BackgroundViewModelInterface,
    BorderViewModelInterface,
    ImageViewModelInterface

@Deprecated("Use MeasuredSize passed in through the view model Binding.")
typealias DimensionCallback = (width: Int, height: Int) -> Unit
