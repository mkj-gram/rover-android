package io.rover.experiences.ui.layout

import android.support.v7.widget.RecyclerView
import android.view.ViewGroup
import io.rover.experiences.ui.blocks.concerns.layout.LayoutableViewModel
import io.rover.experiences.ui.blocks.barcode.BarcodeBlockView
import io.rover.experiences.ui.blocks.button.ButtonBlockView
import io.rover.experiences.ui.blocks.image.ImageBlockView
import io.rover.experiences.ui.blocks.concerns.layout.LayoutableView
import io.rover.experiences.ui.blocks.rectangle.RectangleBlockView
import io.rover.experiences.ui.layout.row.RowView
import io.rover.experiences.ui.blocks.text.TextBlockView
import io.rover.experiences.ui.blocks.web.WebBlockView

/**
 * The RecyclerView adapter for Experience layouts.
 */
class BlockAndRowRecyclerAdapter(
    private val viewModelSequence: List<LayoutableViewModel>
) : RecyclerView.Adapter<BlockAndRowRecyclerAdapter.LayoutableBlockHolder>() {
    override fun getItemCount(): Int {
        return viewModelSequence.size
    }

    override fun onBindViewHolder(holder: LayoutableBlockHolder, position: Int) {
        holder.viewModel = viewModelSequence[position]
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LayoutableBlockHolder {
        val type = ViewType.values()[viewType]
        return LayoutableBlockHolder(
            viewFactory(parent, type)
        )
    }

    override fun getItemViewType(position: Int): Int {
        val viewModel = viewModelSequence[position]
        return viewModel.viewType.ordinal
    }

    private fun viewFactory(parent: ViewGroup, viewType: ViewType): LayoutableView<LayoutableViewModel> {
        // We are instantiating the row views here, but we cannot emit them with `out` variance
        // because the recyclerview Holder must be able to set their view models, which are always
        // subtypes.
        @Suppress("IMPLICIT_CAST_TO_ANY", "UNCHECKED_CAST")
        return when (viewType) {
            ViewType.Row -> RowView(parent.context)
            ViewType.Rectangle -> RectangleBlockView(parent.context)
            ViewType.Text -> TextBlockView(parent.context)
            ViewType.Image -> ImageBlockView(parent.context)
            ViewType.Button -> ButtonBlockView(parent.context)
            ViewType.WebView -> WebBlockView(parent.context)
            ViewType.Barcode -> BarcodeBlockView(parent.context)
        } as LayoutableView<LayoutableViewModel>

        // TODO: should we delegate this to the upcoming improved DI system?
    }

    /**
     * This [RecyclerView.ViewHolder] wraps a [LayoutableViewModel].
     */
    class LayoutableBlockHolder(
        private val layoutableItemView: LayoutableView<in LayoutableViewModel>
    ) : RecyclerView.ViewHolder(
        layoutableItemView.view
    ) {
        var viewModel: LayoutableViewModel? = null
            set(value) {
                if (value != null) {
                    layoutableItemView.viewModel = value
                }
                field = value
            }
    }
}
