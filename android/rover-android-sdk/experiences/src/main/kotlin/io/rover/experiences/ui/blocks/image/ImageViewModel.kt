package io.rover.experiences.ui.blocks.image

import android.graphics.Bitmap
import android.util.DisplayMetrics
import io.rover.rover.core.data.domain.ImageBlock
import io.rover.rover.core.logging.log
import org.reactivestreams.Publisher
import io.rover.rover.core.streams.flatMap
import io.rover.rover.core.assets.AssetService
import io.rover.rover.core.assets.ImageOptimizationServiceInterface
import io.rover.rover.core.data.NetworkResult
import io.rover.rover.core.data.domain.Block
import io.rover.rover.core.data.domain.Image
import io.rover.rover.core.streams.PublisherOperators
import io.rover.rover.core.ui.PixelSize
import io.rover.rover.core.ui.RectF
import java.net.URL

class ImageViewModel(
    private val image: Image?,
    private val block: Block,
    private val assetService: AssetService,
    private val imageOptimizationService: ImageOptimizationServiceInterface
) : ImageViewModelInterface {

    override fun requestImage(
        targetViewPixelSize: PixelSize,
        displayMetrics: DisplayMetrics
    ): Publisher<Bitmap> {
        return if(image == null) {
            PublisherOperators.empty()
        } else {
            val uriWithParameters = imageOptimizationService.optimizeImageBlock(
                image,
                block,
                targetViewPixelSize,
                displayMetrics
            )

            val url = URL(uriWithParameters.toString())

            assetService.getImageByUrl(url).flatMap { result ->
                when (result) {
                    is NetworkResult.Success -> PublisherOperators.just(result.response)
                    is NetworkResult.Error -> {
                        // TODO perhaps attempt a retry? or should a lower layer attempt retry?
                        // concern should remain here if the experience UI should react or indicate
                        // an error somehow.
                        log.e("Problem retrieving image: ${result.throwable}")
                        PublisherOperators.empty()
                    }
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
