package io.rover.experiences.ui.blocks.concerns.background

import android.graphics.Bitmap
import android.util.DisplayMetrics
import org.reactivestreams.Publisher
import io.rover.rover.core.data.domain.Background
import io.rover.rover.core.ui.BackgroundImageConfiguration
import io.rover.rover.core.ui.PixelSize

/**
 * Binds [BackgroundViewModelInterface] properties to that of a view.
 *
 * Backgrounds can specify a background colour or image.
 */
interface ViewBackgroundInterface {
    var backgroundViewModel: BackgroundViewModelInterface?
}

/**
 * This interface is exposed by View Models that have support for a background.  Equivalent to
 * the [Background] domain model interface.
 */
interface BackgroundViewModelInterface {
    val backgroundColor: Int

    fun requestBackgroundImage(
        targetViewPixelSize: PixelSize,
        displayMetrics: DisplayMetrics
    ): Publisher<Pair<Bitmap, BackgroundImageConfiguration>>
}