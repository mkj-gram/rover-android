package io.rover.experiences.ui.blocks.text

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Canvas
import android.support.v7.widget.AppCompatTextView
import android.util.AttributeSet
import io.rover.rover.core.logging.log
import io.rover.experiences.ui.blocks.concerns.layout.LayoutableView
import io.rover.experiences.ui.blocks.concerns.background.ViewBackground
import io.rover.experiences.ui.blocks.concerns.layout.ViewBlock
import io.rover.experiences.ui.blocks.concerns.border.ViewBorder
import io.rover.experiences.ui.blocks.concerns.text.AndroidRichTextToSpannedTransformer
import io.rover.experiences.ui.blocks.concerns.text.ViewText
import io.rover.experiences.ui.blocks.concerns.ViewComposition

class TextBlockView : AppCompatTextView, LayoutableView<TextBlockViewModelInterface> {
    constructor(context: Context?) : super(context)
    constructor(context: Context?, attrs: AttributeSet?) : super(context, attrs)
    constructor(context: Context?, attrs: AttributeSet?, defStyleAttr: Int) : super(context, attrs, defStyleAttr)

    // mixins
    private val viewComposition = ViewComposition()
    private val viewBackground = ViewBackground(this, viewComposition)
    private val viewBorder = ViewBorder(this, viewComposition)
    private val viewBlock = ViewBlock(this, setOf(viewBorder))
    private val viewText = ViewText(this, AndroidRichTextToSpannedTransformer())

    override var viewModel: TextBlockViewModelInterface? = null
        set(viewModel) {
            viewBorder.borderViewModel = viewModel
            viewBlock.blockViewModel = viewModel
            viewBackground.backgroundViewModel = viewModel
            viewText.textViewModel = viewModel
        }

    override fun onDraw(canvas: Canvas) {
        viewComposition.beforeOnDraw(canvas)
        super.onDraw(canvas)
        viewComposition.afterOnDraw(canvas)
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        viewComposition.onSizeChanged(w, h, oldw, oldh)
    }

    @SuppressLint("MissingSuperCall")
    override fun requestLayout() {
        // log.v("Tried to invalidate layout.  Inhibited.")
    }

    override fun forceLayout() {
        log.v("Tried to forcefully invalidate layout.  Inhibited.")
    }
}
