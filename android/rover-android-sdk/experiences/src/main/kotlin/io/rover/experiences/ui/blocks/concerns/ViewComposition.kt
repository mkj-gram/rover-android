package io.rover.experiences.ui.blocks.concerns

import android.graphics.Canvas
import android.view.View

/**
 * This allows the mixins to receive notification of certain important events and state changes that
 * are only exposed by Android with a template pattern and not a callback registration pattern.
 *
 * TODO add notes about: why this isn't done with class delegation, and thus why it has to be passed
 * alongside the view to any other View* mixins
 */
class ViewComposition : ViewCompositionInterface {
    private val beforeDraws: MutableList<(Canvas) -> Unit> = mutableListOf()
    private val afterDraws: MutableList<(Canvas) -> Unit> = mutableListOf()
    private val onSizeChangedCallbacks: MutableList<(width: Int, height: Int, oldWidth: Int, oldHeight: Int) -> Unit> = mutableListOf()

    /**
     * Execute the given callback against the [Canvas] just before the view's main [View.draw]
     * pass would occur.
     */
    override fun registerBeforeDraw(stage: (Canvas) -> Unit) {
        beforeDraws.add(stage)
    }

    /**
     * Execute the given callback against the [Canvas] just after the view's main [View.draw]
     * pass has occurred.
     */
    override fun registerAfterDraw(stage: (Canvas) -> Unit) {
        afterDraws.add(stage)
    }

    override fun registerOnSizeChangedCallback(callback: (width: Int, height: Int, oldWidth: Int, oldHeight: Int) -> Unit) {
        onSizeChangedCallbacks.add(callback)
    }

    override fun beforeOnDraw(canvas: Canvas) {
        // allow to inject behaviour before main view draw (here)
        beforeDraws.forEach { it(canvas) }
    }

    override fun afterOnDraw(canvas: Canvas) {
        // capture the background draw after the beforeDraws() are called (rather than before
        // like it is here)
        afterDraws.forEach { it(canvas) }
        // and allow to inject behaviour after main view draw (here)
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        onSizeChangedCallbacks.forEach { it(w, h, oldw, oldh) }
    }
}

interface ViewCompositionInterface {
    /**
     * Execute the given callback against the [Canvas] just before the view's main [View.draw]
     * pass would occur.
     */
    fun registerBeforeDraw(stage: (Canvas) -> Unit)

    /**
     * Execute the given callback against the [Canvas] just after the view's main [View.draw]
     * pass has occurred.
     */
    fun registerAfterDraw(stage: (Canvas) -> Unit)

    fun registerOnSizeChangedCallback(callback: (width: Int, height: Int, oldWidth: Int, oldHeight: Int) -> Unit)

    // The following methods must be wired up!
    // TODO: this invariant is unenforceable.  How to firm it up somehow?!

    fun beforeOnDraw(canvas: Canvas)

    fun afterOnDraw(canvas: Canvas)

    fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int)
}