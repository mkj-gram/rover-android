package io.rover.experiences.ui.blocks.barcode

import io.rover.rover.core.data.domain.Barcode
import io.rover.rover.core.data.domain.BarcodeFormat
import io.rover.experiences.MeasurementService
import io.rover.rover.core.ui.Rect
import io.rover.rover.core.ui.RectF

/**
 * Barcode display view model.
 */
class BarcodeViewModel(
    private val barcode: Barcode,
    private val measurementService: MeasurementService
) : BarcodeViewModelInterface {
    override val barcodeType: BarcodeViewModelInterface.BarcodeType
        get() = when (barcode.format) {
            BarcodeFormat.AztecCode -> BarcodeViewModelInterface.BarcodeType.Aztec
            BarcodeFormat.Code128 -> BarcodeViewModelInterface.BarcodeType.Code128
            BarcodeFormat.Pdf417 -> BarcodeViewModelInterface.BarcodeType.PDF417
            BarcodeFormat.QrCode -> BarcodeViewModelInterface.BarcodeType.QrCode
        }

    override val barcodeValue: String
        get() = barcode.text

    override fun intrinsicHeight(bounds: RectF): Float {
        return measurementService.measureHeightNeededForBarcode(
            barcode.text,
            barcodeType,
            bounds.width()
        )
    }

    override val paddingDeflection: Rect
        get() = when (barcode.format) {
            BarcodeFormat.Pdf417 -> Rect(5, 5, 5, 5)
            else -> Rect(20, 20, 20, 20)
        }
}
