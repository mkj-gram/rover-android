package io.rover.experiences.ui.blocks.concerns.layout

import io.rover.rover.core.logging.log
import io.rover.rover.core.streams.PublishSubject
import io.rover.rover.core.streams.share
import io.rover.rover.platform.whenNotNull
import io.rover.rover.core.data.domain.Block
import io.rover.rover.core.data.domain.HorizontalAlignment
import io.rover.rover.core.data.domain.Position
import io.rover.rover.core.data.domain.VerticalAlignment
import io.rover.experiences.ui.layout.ViewType
import io.rover.experiences.ui.layout.screen.ScreenViewModel
import io.rover.experiences.ui.navigation.NavigateTo
import io.rover.rover.core.data.domain.Height
import io.rover.rover.core.operations.ActionBehaviourMappingInterface
import io.rover.rover.core.ui.RectF

/**
 * A mixin used by all blocks that contains the block layout and positioning concerns.
 *
 * - LayoutableViewModel probably needs to split, because we want to be able to delegate the frame()
 *   method to the new mixin version of BlockViewModel but obviously it should not specify view type
 */
class BlockViewModel(
    private val block: Block,
    private val paddingDeflections: Set<LayoutPaddingDeflection> = emptySet(),
    private val actionBehaviourMapping: ActionBehaviourMappingInterface,
    private val measurable: Measurable? = null
) : BlockViewModelInterface {

    override val viewType: ViewType
        // TODO: remove this entirely
        get() = TODO("You must implement this in your block ViewModel type.")

    override fun stackedHeight(bounds: RectF): Float {
        val alignment = block.position.verticalAlignment
        return when (alignment) {
            is VerticalAlignment.Stacked -> {
                this.height(bounds) + alignment.topOffset.toFloat() + alignment.bottomOffset.toFloat()
            }
            else -> 0.0f
        }
    }

    override val insets: Insets
        get() = Insets(
            block.insets.top,
            block.insets.left,
            block.insets.bottom,
            block.insets.right
        )

    override val isStacked: Boolean
        get() = block.position.verticalAlignment is VerticalAlignment.Stacked

    override val opacity: Float
        get() = block.opacity.toFloat()

    override fun frame(bounds: RectF): RectF {
        val x = x(bounds)
        val y = y(bounds)
        val width = width(bounds)
        val height = height(bounds)

        return RectF(
            x,
            y,
            (width + x),
            (y + height)
        )
    }

    /**
     * Computes the Block's height.
     */
    fun height(bounds: RectF): Float {
        val verticalAlignment = block.position.verticalAlignment
        return when (verticalAlignment) {
            is VerticalAlignment.Fill -> {
                val top = verticalAlignment.topOffset
                val bottom = verticalAlignment.bottomOffset
                bounds.height() - top.toFloat() - bottom.toFloat()
            }
            is VerticalAlignment.Stacked, is VerticalAlignment.Middle, is VerticalAlignment.Bottom, is VerticalAlignment.Top -> {
                // we use the Measured interface to get at the height field on all of the non-Fill types.
                val height = (verticalAlignment as VerticalAlignment.Measured).height

                when (height) {
                    is Height.Intrinsic -> {
                        val boundsConsideringInsets = RectF(
                            bounds.left + insets.left + paddingDeflections.map { it.paddingDeflection.left }.sum(),
                            bounds.top,
                            bounds.left + width(bounds) - insets.right - paddingDeflections.map { it.paddingDeflection.right }.sum(),
                            bounds.bottom
                        )

                        // TODO: boundsConsideringInsets could go negative if the insets are bigger than the
                        // bounds, causing illegal/undefined behaviour further down the chain.

                        if (measurable == null) {
                            log.w("Block is set to auto-height but no measurable is given.")
                            0f
                        } else {
                            measurable.intrinsicHeight(boundsConsideringInsets) +
                                insets.bottom +
                                insets.top +
                                paddingDeflections.map {
                                    it.paddingDeflection.top + it.paddingDeflection.bottom
                                }.sum()
                        }
                    }
                    is Height.Static -> {
                        height.value.toFloat()
                    }
                }

            }
        }
    }

    /**
     * Computes the Block's width.
     */
    override fun width(bounds: RectF): Float {
        val alignment = block.position.horizontalAlignment
        return when (alignment) {
            is HorizontalAlignment.Fill -> {
                bounds.width() - alignment.leftOffset.toFloat() - alignment.rightOffset.toFloat()
            }
            is HorizontalAlignment.Right, is HorizontalAlignment.Center, is HorizontalAlignment.Left -> {
                listOf((alignment as HorizontalAlignment.Measured).width.toFloat(), 0.0f).max()!!
            }
        }
    }

    private val eventSource = PublishSubject<BlockViewModelInterface.Event>()
    override val events = eventSource.share()

    override val isClickable: Boolean
    get() = block.action != null

    override fun click() {
        // I don't have an epic (any other asynchronous behaviour to compose) here, just a single
        // event emitter, so I'll just publish an event directly.
        val action = block.action

        val navigateTo = when (action) {
            null -> null
            is Block.Action.GoToScreenAction -> { NavigateTo.GoToScreenAction(action.screenId.rawValue) }
            else -> {
                val behaviour = actionBehaviourMapping.mapToBehaviour(action)
                NavigateTo.External(behaviour)
            }
        }

        navigateTo.whenNotNull {
            eventSource.onNext(
                BlockViewModelInterface.Event.Clicked(it, block.id.rawValue)
            )
        }
    }

    override fun touched() {
        eventSource.onNext(
            BlockViewModelInterface.Event.Touched(block.id.rawValue)
        )
    }

    override fun released() {
        eventSource.onNext(
            BlockViewModelInterface.Event.Released(block.id.rawValue)
        )
    }

    /**
     * Computes the Block's absolute horizontal coordinate in the [ScreenViewModel]'s coordinate
     * space.
     */
    private fun x(bounds: RectF): Float {
        val width = width(bounds)

        val alignment = block.position.horizontalAlignment

        return when (alignment) {
            is HorizontalAlignment.Center -> bounds.left + ((bounds.width() - width) / 2) + alignment.offset.toFloat()
            is HorizontalAlignment.Fill -> bounds.left + alignment.leftOffset.toFloat()
            is HorizontalAlignment.Left -> bounds.left + alignment.offset.toFloat()
            is HorizontalAlignment.Right -> bounds.right - width - alignment.offset.toFloat()
        }
    }

    /**
     * Computes the Block's absolute vertical coordinate in the [ScreenViewModel]'s coordinate
     * space.
     */
    private fun y(bounds: RectF): Float {
        val height = height(bounds)

        val alignment = block.position.verticalAlignment

        return when (alignment) {
            is VerticalAlignment.Bottom -> bounds.bottom - height - alignment.offset.toFloat()
            is VerticalAlignment.Fill -> bounds.top + alignment.topOffset.toFloat()
            is VerticalAlignment.Top -> bounds.top + alignment.offset.toFloat()
            is VerticalAlignment.Middle -> bounds.top + ((bounds.height() - height) / 2) + alignment.offset.toFloat()
            is VerticalAlignment.Stacked -> bounds.top + alignment.topOffset.toFloat()
        }
    }
}