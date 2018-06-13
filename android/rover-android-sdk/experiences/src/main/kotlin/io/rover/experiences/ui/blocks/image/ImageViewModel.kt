package io.rover.experiences.ui.blocks.image

import android.graphics.Bitmap
import android.util.DisplayMetrics
import io.rover.rover.core.logging.log
import org.reactivestreams.Publisher
import io.rover.rover.core.assets.AssetService
import io.rover.rover.core.assets.ImageOptimizationServiceInterface
import io.rover.rover.core.data.NetworkResult
import io.rover.rover.core.data.domain.Block
import io.rover.rover.core.data.domain.Image
import io.rover.rover.core.streams.*
import io.rover.rover.core.ui.PixelSize
import io.rover.rover.core.ui.RectF
import io.rover.rover.core.ui.concerns.MeasuredSize
import io.rover.rover.core.ui.dpAsPx
import java.net.URL
import java.util.concurrent.TimeUnit

class ImageViewModel(
    private val image: Image?,
    private val block: Block,
    private val assetService: AssetService,
    private val imageOptimizationService: ImageOptimizationServiceInterface,
    mainScheduler: Scheduler
) : ImageViewModelInterface {

    override fun informDimensions(measuredSize: MeasuredSize) {
        measurementsSubject.onNext(measuredSize)
    }

    override fun measuredSizeReadyForPrefetch(measuredSize: MeasuredSize) {
        prefetchMeasurementsSubject.onNext(measuredSize)
    }

    private val prefetchMeasurementsSubject = PublishSubject<MeasuredSize>()
    private val measurementsSubject = PublishSubject<MeasuredSize>()

    private var fadeInNeeded = false

    override val imageUpdates: Publisher<ImageViewModelInterface.ImageUpdate> = PublisherOperators.merge(
        prefetchMeasurementsSubject.imageFetchTransform(),
        measurementsSubject
            .flatMap {
                PublisherOperators.just(it)
                    .imageFetchTransform()
                    .share()
                    .apply {
                        if (image != null) {
                            timeout(100, TimeUnit.MILLISECONDS)
                                .subscribe(
                                    { },
                                    { error ->
                                        log.v("Fade in needed, because $error")
                                        fadeInNeeded = true
                                    }
                                )
                        }
                    }
            }
    ).shareHotAndReplay(0).observeOn(mainScheduler) // shareHot because this chain is responsible for side-effect of pre-warming cache, even before subscribed.

    private fun Publisher<MeasuredSize>.imageFetchTransform(): Publisher<ImageViewModelInterface.ImageUpdate> {
        return flatMap { measuredSize ->
            if(image == null) {
                PublisherOperators.empty()
            } else {
                val uriWithParameters = imageOptimizationService.optimizeImageBlock(
                    image,
                    block,
                    PixelSize(
                        measuredSize.width.dpAsPx(measuredSize.density),
                        measuredSize.height.dpAsPx(measuredSize.density)
                    ),
                    measuredSize.density
                )

                // so if item does not appear within a threshold of time then turn on a fade-in bit?
                assetService.imageByUrl(uriWithParameters.toURL())
                    .map { bitmap ->
                        ImageViewModelInterface.ImageUpdate(
                            bitmap,
                            fadeInNeeded
                        )
                    }
            }
        }
    }

    override fun intrinsicHeight(bounds: RectF): Float {
        // get aspect ratio of image and use it to calculate the height needed to accommodate
        // the image at its correct aspect ratio given the width
        return if(image == null) {
            0f
        } else {
            val heightToWidthRatio = image.height.toFloat() / image.width.toFloat()
            return bounds.width() * heightToWidthRatio
        }
    }
}
