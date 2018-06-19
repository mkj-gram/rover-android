package io.rover.experiences

import android.content.Context
import android.os.Parcelable
import android.util.DisplayMetrics
import io.rover.experiences.routing.ExperienceEnabledTopLevelNavigation
import io.rover.rover.core.assets.AssetService
import io.rover.rover.core.assets.ImageOptimizationServiceInterface
import io.rover.rover.core.container.Assembler
import io.rover.rover.core.container.Container
import io.rover.rover.core.container.Resolver
import io.rover.rover.core.container.Scope
import io.rover.rover.core.data.domain.*
import io.rover.rover.core.data.graphql.GraphQlApiServiceInterface
import io.rover.rover.core.events.EventQueueServiceInterface
import io.rover.experiences.ui.ExperienceViewModel
import io.rover.experiences.ui.ExperienceViewModelInterface
import io.rover.experiences.ui.blocks.barcode.BarcodeBlockViewModel
import io.rover.experiences.ui.blocks.barcode.BarcodeBlockViewModelInterface
import io.rover.experiences.ui.blocks.barcode.BarcodeViewModel
import io.rover.experiences.ui.blocks.barcode.BarcodeViewModelInterface
import io.rover.experiences.ui.blocks.button.*
import io.rover.experiences.ui.blocks.concerns.background.BackgroundViewModel
import io.rover.experiences.ui.blocks.concerns.background.BackgroundViewModelInterface
import io.rover.experiences.ui.blocks.concerns.border.BorderViewModel
import io.rover.experiences.ui.blocks.concerns.border.BorderViewModelInterface
import io.rover.experiences.ui.blocks.concerns.layout.*
import io.rover.experiences.ui.blocks.concerns.text.AndroidRichTextToSpannedTransformer
import io.rover.experiences.ui.blocks.concerns.text.RichTextToSpannedTransformer
import io.rover.experiences.ui.blocks.concerns.text.TextViewModel
import io.rover.experiences.ui.blocks.concerns.text.TextViewModelInterface
import io.rover.experiences.ui.blocks.image.*
import io.rover.experiences.ui.blocks.rectangle.RectangleBlockViewModel
import io.rover.experiences.ui.blocks.rectangle.RectangleBlockViewModelInterface
import io.rover.experiences.ui.blocks.text.TextBlockViewModel
import io.rover.experiences.ui.blocks.text.TextBlockViewModelInterface
import io.rover.experiences.ui.blocks.web.WebViewBlockViewModel
import io.rover.experiences.ui.blocks.web.WebViewBlockViewModelInterface
import io.rover.experiences.ui.blocks.web.WebViewModel
import io.rover.experiences.ui.blocks.web.WebViewModelInterface
import io.rover.experiences.ui.layout.BlockAndRowLayoutManager
import io.rover.experiences.ui.layout.BlockAndRowRecyclerAdapter
import io.rover.experiences.ui.layout.Layout
import io.rover.experiences.ui.layout.row.RowViewModel
import io.rover.experiences.ui.layout.row.RowViewModelInterface
import io.rover.experiences.ui.layout.screen.ScreenViewModel
import io.rover.experiences.ui.layout.screen.ScreenViewModelInterface
import io.rover.experiences.ui.navigation.ExperienceNavigationViewModel
import io.rover.experiences.ui.navigation.ExperienceNavigationViewModelInterface
import io.rover.experiences.ui.toolbar.ExperienceToolbarViewModel
import io.rover.experiences.ui.toolbar.ExperienceToolbarViewModelInterface
import io.rover.experiences.ui.toolbar.ToolbarConfiguration
import io.rover.rover.core.context.ModulesTrackerInterface
import io.rover.rover.core.routing.TopLevelNavigation
import io.rover.rover.core.events.domain.Event
import io.rover.rover.core.operations.ActionBehaviour
import io.rover.rover.core.operations.ActionBehaviourMappingInterface
import io.rover.rover.core.streams.Scheduler
import io.rover.rover.core.tracking.SessionEventProvider
import io.rover.rover.core.tracking.SessionTrackerInterface
import io.rover.rover.core.tracking.SessionDirection

/**
 * This is the Rover User Experience plugin.  It contains the entire Rover Experiences system.
 *
 * To use it to your project, add [ExperiencesAssembler] to your [Rover.initialize] invocation.
 */
class ExperiencesAssembler: Assembler {
    override fun assemble(container: Container) {
        container.register(
            Scope.Singleton,
            RichTextToSpannedTransformer::class.java
        ) { _ ->
            AndroidRichTextToSpannedTransformer()
        }

        container.register(
            Scope.Singleton,
            MeasurementService::class.java
        ) { resolver ->
            // perhaps some day Android might do per-display DisplayMetrics (which seems necessary
            // to support displays with diverse densities), in which case, this will need to change.
            AndroidMeasurementService(
                resolver.resolveSingletonOrFail(Context::class.java).resources.displayMetrics,
                resolver.resolveSingletonOrFail(RichTextToSpannedTransformer::class.java)
            )
        }

        // overriding core's top level navigation
        container.register(
            Scope.Singleton,
            TopLevelNavigation::class.java
        ) { resolver ->
            ExperienceEnabledTopLevelNavigation(
                resolver.resolveSingletonOrFail(Context::class.java)
            )
        }

        container.register(
            Scope.Transient,
            ExperienceToolbarViewModelInterface::class.java
        ) { _, toolbarConfiguration: ToolbarConfiguration ->
            ExperienceToolbarViewModel(toolbarConfiguration)
        }

        container.register(
            Scope.Transient,
            ExperienceNavigationViewModelInterface::class.java
        ) { resolver: Resolver, experience: Experience, icicle: Parcelable? ->
            val eventProvider = object : SessionEventProvider {
                override fun eventForSessionBoundary(direction: SessionDirection, attributes: Attributes): Event {
                    return when(direction) {
                        SessionDirection.Start -> Event("Screen Presented", attributes)
                        SessionDirection.Stop -> Event("Screen Dismissed", attributes)
                    }
                }
            }

            ExperienceNavigationViewModel(
                experience,
                resolver.resolveSingletonOrFail(EventQueueServiceInterface::class.java),
                resolver.resolve(SessionTrackerInterface::class.java, null, eventProvider, 60)!!,
                { screen -> resolver.resolve(ScreenViewModelInterface::class.java, null, screen)!! },
                { toolbarConfiguration -> resolver.resolve(ExperienceToolbarViewModelInterface::class.java, null, toolbarConfiguration)!! },
                icicle
            )
        }

        container.register(
            Scope.Transient,
            BackgroundViewModelInterface::class.java
        ) { resolver: Resolver, background: Background ->
            BackgroundViewModel(
                background,
                resolver.resolveSingletonOrFail(AssetService::class.java),
                resolver.resolveSingletonOrFail(ImageOptimizationServiceInterface::class.java),
                resolver.resolveSingletonOrFail(Scheduler::class.java, "main")
            )
        }

        container.register(
            Scope.Transient,
            ScreenViewModelInterface::class.java
        ) { resolver: Resolver, screen: Screen ->
            ScreenViewModel(
                screen,
                resolver.resolve(BackgroundViewModelInterface::class.java, null, screen.background)!!,
                { row -> resolver.resolve(RowViewModelInterface::class.java, null, row)!! }
            )
        }

        container.register(
            Scope.Transient,
            RowViewModelInterface::class.java
        ) { resolver: Resolver, row: Row ->
            RowViewModel(
                row,
                { block -> resolver.resolve(CompositeBlockViewModelInterface::class.java, null, block)!! },
                resolver.resolve(BackgroundViewModelInterface::class.java, null, row.background)!!
            )
        }

        container.register(
            Scope.Transient,
            ExperienceViewModelInterface::class.java
        ) { resolver: Resolver, experienceRequest: ExperienceViewModel.ExperienceRequest, icicle: Parcelable? ->
            val eventProvider = object : SessionEventProvider {
                override fun eventForSessionBoundary(direction: SessionDirection, attributes: Attributes): Event {
                    return when(direction) {
                        SessionDirection.Start -> Event("Experience Presented", attributes)
                        SessionDirection.Stop -> Event("Experience Dismissed", attributes)
                    }
                }
            }

            ExperienceViewModel(
                experienceRequest,
                resolver.resolveSingletonOrFail(GraphQlApiServiceInterface::class.java),
                resolver.resolveSingletonOrFail(Scheduler::class.java, "main"),
                resolver.resolve(SessionTrackerInterface::class.java, null, eventProvider, 60)!!,
                { experience: Experience, navigationIcicle: Parcelable? ->
                    resolver.resolve(ExperienceNavigationViewModelInterface::class.java, null, experience, navigationIcicle)!!
                },
                icicle
            )
        }

        // embedded/block type view models:

        // this registered factory is a bit different: it's polymorphic, in that it will
        // yield different instances depending on the parameters (ie., the type of the given block).

        // block mixins:
        container.register(
            Scope.Transient,
            BlockViewModelInterface::class.java
        ) { resolver, block: Block, deflectors: Set<LayoutPaddingDeflection>, measurable: Measurable? ->
            BlockViewModel(
                block,
                deflectors,
                resolver.resolveSingletonOrFail(ActionBehaviourMappingInterface::class.java),
                measurable
            )
        }

        container.register(
            Scope.Transient,
            TextViewModelInterface::class.java
        ) { resolver, text: Text ->
            TextViewModel(
                text,
                resolver.resolveSingletonOrFail(MeasurementService::class.java),
                false, false
            )
        }

        container.register(
            Scope.Transient,
            TextViewModelInterface::class.java,
            "button"
        ) { resolver, text: Text ->
            TextViewModel(
                text,
                resolver.resolveSingletonOrFail(MeasurementService::class.java),
                // for buttons, Text should have no wrapping behaviour and center vertically.
                true, true
            )
        }

        container.register(
            Scope.Transient,
            ImageViewModelInterface::class.java
        ) { resolver, image: Image?, containingBlock: Block ->
            ImageViewModel(
                image,
                containingBlock,
                resolver.resolveSingletonOrFail(AssetService::class.java),
                resolver.resolveSingletonOrFail(ImageOptimizationServiceInterface::class.java),
                resolver.resolveSingletonOrFail(Scheduler::class.java, "main")
            )
        }

        container.register(
            Scope.Transient,
            BorderViewModelInterface::class.java
        ) { _, border: Border ->
           BorderViewModel(
               border
           )
        }

        container.register(
            Scope.Transient,
            BackgroundViewModelInterface::class.java
        ) { resolver, background: Background ->
            BackgroundViewModel(
                background,
                resolver.resolveSingletonOrFail(AssetService::class.java),
                resolver.resolveSingletonOrFail(ImageOptimizationServiceInterface::class.java),
                resolver.resolveSingletonOrFail(Scheduler::class.java, "main")
            )
        }

        container.register(
            Scope.Transient,
            WebViewModelInterface::class.java
        ) { _, block: WebViewBlock ->
            WebViewModel(
                block
            )
        }

        container.register(
            Scope.Transient,
            BarcodeViewModelInterface::class.java
        ) { resolver, barcode: Barcode ->
            BarcodeViewModel(
                barcode,
                resolver.resolveSingletonOrFail(MeasurementService::class.java)
            )
        }

        container.register(
            Scope.Transient,
            RectangleBlockViewModelInterface::class.java
        ) { resolver: Resolver, block: RectangleBlock ->
            RectangleBlockViewModel(
                resolver.resolve(BlockViewModelInterface::class.java, null, block, setOf<LayoutPaddingDeflection>(),null)!!,
                resolver.resolve(BackgroundViewModelInterface::class.java, null, block.background)!!,
                resolver.resolve(BorderViewModelInterface::class.java, null, block.border)!!
            )
        }

        container.register(
            Scope.Transient,
            TextBlockViewModelInterface::class.java
        ) { resolver, block: TextBlock ->
            val borderViewModel = resolver.resolve(BorderViewModelInterface::class.java, null, block.border)!!
            val textViewModel = resolver.resolve(TextViewModelInterface::class.java, null, block.text)!!
            TextBlockViewModel(
                resolver.resolve(BlockViewModelInterface::class.java, null, block, setOf(borderViewModel), textViewModel)!!,
                textViewModel,
                resolver.resolve(BackgroundViewModelInterface::class.java, null, block.background)!!,
                borderViewModel
            )
        }

        container.register(
            Scope.Transient,
            ImageBlockViewModelInterface::class.java
        ) { resolver, block: ImageBlock ->
            val imageViewModel = resolver.resolve(ImageViewModelInterface::class.java, null, block.image, block)!!
            val borderViewModel = resolver.resolve(BorderViewModelInterface::class.java, null, block.border)!!
            ImageBlockViewModel(
                resolver.resolve(BlockViewModelInterface::class.java, null, block, setOf(borderViewModel), imageViewModel)!!,
                resolver.resolve(BackgroundViewModelInterface::class.java, null, block.background)!!,
                imageViewModel,
                borderViewModel
            )
        }

        container.register(
            Scope.Transient,
            ButtonBlockViewModelInterface::class.java
        ) { resolver, block: ButtonBlock ->
            // buttons have no measurable content and also cannot contribute padding, so we
            // pass empty values for both the layout deflections set and

            val borderViewModel = resolver.resolve(BorderViewModelInterface::class.java, null, block.border)!!

            val blockViewModel = resolver.resolve(BlockViewModelInterface::class.java, null, block, setOf<LayoutPaddingDeflection>(borderViewModel),null)!!

            ButtonBlockViewModel(
                blockViewModel,
                borderViewModel,
                resolver.resolve(BackgroundViewModelInterface::class.java, null, block.background)!!,
                resolver.resolve(TextViewModelInterface::class.java, "button", block.text)!!
            )
        }

        container.register(
            Scope.Transient,
            WebViewBlockViewModelInterface::class.java
        ) { resolver, block: WebViewBlock ->
            WebViewBlockViewModel(
                resolver.resolve(BlockViewModelInterface::class.java, null, block, setOf<LayoutPaddingDeflection>(),null)!!,
                resolver.resolve(BackgroundViewModelInterface::class.java, null, block.background)!!,
                resolver.resolve(BorderViewModelInterface::class.java, null, block.border)!!,
                resolver.resolve(WebViewModelInterface::class.java, null, block)!!
            )
        }

        container.register(
            Scope.Transient,
            BarcodeBlockViewModelInterface::class.java
        ) { resolver, block: BarcodeBlock ->
            val barcodeViewModel = resolver.resolve(BarcodeViewModelInterface::class.java, null, block.barcode)!!
            val borderViewModel = resolver.resolve(BorderViewModelInterface::class.java, null, block.border)!!

            BarcodeBlockViewModel(
                resolver.resolve(BlockViewModelInterface::class.java, null, block, setOf(borderViewModel), barcodeViewModel)!!,
                barcodeViewModel,
                resolver.resolve(BackgroundViewModelInterface::class.java, null, block.background)!!,
                borderViewModel
            )
        }

        // row blocks:
        container.register(
            Scope.Transient,
            CompositeBlockViewModelInterface::class.java
        ) { resolver: Resolver, block: Block ->
            when(block) {
                is RectangleBlock -> {
                    resolver.resolve(RectangleBlockViewModelInterface::class.java, null, block) as CompositeBlockViewModelInterface
                }
                is TextBlock -> {
                    resolver.resolve(TextBlockViewModelInterface::class.java, null, block) as CompositeBlockViewModelInterface
                }
                is ImageBlock -> {
                    resolver.resolve(ImageBlockViewModelInterface::class.java, null, block) as CompositeBlockViewModelInterface
                }
                is ButtonBlock -> {
                    resolver.resolve(ButtonBlockViewModelInterface::class.java, null, block) as CompositeBlockViewModelInterface
                }
                is WebViewBlock -> {
                    resolver.resolve(WebViewBlockViewModelInterface::class.java, null, block) as CompositeBlockViewModelInterface
                }
                is BarcodeBlock -> {
                    resolver.resolve(BarcodeBlockViewModelInterface::class.java, null, block) as CompositeBlockViewModelInterface
                }
                else -> throw Exception(
                    "This Rover UI block type is not supported by this version of the SDK: ${block.javaClass.simpleName}."
                )
            }
        }

        container.register(
            Scope.Transient,
            BlockAndRowRecyclerAdapter::class.java
        ) { _, layout: Layout, displayMetrics: DisplayMetrics ->
            BlockAndRowRecyclerAdapter(layout, displayMetrics)
        }

        container.register(
            Scope.Transient,
            BlockAndRowLayoutManager::class.java
        ) { _, layout: Layout, displayMetrics: DisplayMetrics ->
            BlockAndRowLayoutManager(
                layout, displayMetrics
            )
        }
        container.register(
            Scope.Transient,
            ActionBehaviour::class.java,
            "presentExperience"
        ) { resolver, campaignId: String ->
            val navigation = resolver.resolveSingletonOrFail(TopLevelNavigation::class.java)

            ActionBehaviour.IntentAction(
                navigation.displayExperienceIntentByCampaignId(campaignId)
            )
        }

        container.register(
            Scope.Transient,
            ActionBehaviour::class.java,
            "goToScreen"
        ) { _, _: String ->
            // goToScreen must be handled in place by the experience navigation view model.  it
            // cannot be reslolved to an ActionBehaviour.
            ActionBehaviour.Intrinsic()
        }
    }

    override fun afterAssembly(resolver: Resolver) {
        resolver.resolveSingletonOrFail(ModulesTrackerInterface::class.java).version(
            "experiences",
            BuildConfig.VERSION_NAME
        )
    }
}
