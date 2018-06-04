//package io.rover.experiences.ui
//
//import android.content.Context
//import android.os.Parcelable
//import io.rover.rover.core.streams.Scheduler
//import io.rover.rover.core.streams.forAndroidMainThread
//import io.rover.rover.platform.DateFormatting
//import io.rover.rover.platform.LocalStorage
//import io.rover.rover.core.data.DataPluginInterface
//import io.rover.rover.core.data.domain.Experience
//import io.rover.rover.core.events.EventQueueServiceInterface
//import io.rover.rover.plugins.userexperience.UserExperiencePlugin
//import io.rover.experiences.ui.blocks.BlockViewModelFactoryInterface
//import io.rover.experiences.ui.navigation.ExperienceNavigationViewModel
//import io.rover.experiences.ui.navigation.ExperienceNavigationViewModelInterface
//import io.rover.experiences.ui.toolbar.ExperienceToolbarViewModel
//import io.rover.experiences.ui.toolbar.ExperienceToolbarViewModelInterface
//import io.rover.experiences.ui.toolbar.ToolbarConfiguration
//import io.rover.notifications.ui.NotificationCenterListViewModel
//import io.rover.notifications.ui.concerns.NotificationCenterListViewModelInterface
//import io.rover.notifications.NotificationsRepository
//import java.util.concurrent.Executor
//
///**
// * Constructs the standard versions of the view models for all the given Experience blocks.
// *
// * If you wish to override the View Model creation behaviour, please see [UserExperiencePlugin] and
// * override the [ViewModelFactoryInterface] methods there.
// */
//open class StockViewModelFactory(
//    protected val blockViewModelFactory: BlockViewModelFactoryInterface,
//    protected val dataPlugin: DataPluginInterface,
//    protected val eventsPlugin: EventQueueServiceInterface,
//    protected val ioExecutor: Executor,
//    protected val localStorage: LocalStorage
//) : ViewModelFactoryInterface {
//
////    /**
////     * We'll cache the experience view models.  We don't need to worry about caching the others,
////     * though: ExperienceViewModel itself is the start of the whole tree, and it will hold the rest.
////     */
////    private val cachedExperienceViewModels: MutableMap<String, ExperienceViewModelInterface> = hashMapOf()
////
////    override fun viewModelForExperienceNavigation(experience: Experience, icicle: Parcelable?): ExperienceNavigationViewModelInterface {
////        return ExperienceNavigationViewModel(
////            experience,
////            blockViewModelFactory,
////            this,
////            eventsPlugin,
////            icicle
////        )
////    }
////
////    override fun viewModelForExperience(experienceId: String, icicle: Parcelable?): ExperienceViewModelInterface {
////        // Experience view models are singletons: ie., only one for each given experience. return a
////        // cached live instance if we already have one, or recreate it from state if needed.
////        return cachedExperienceViewModels.getOrPut(experienceId) {
////            ExperienceViewModel(
////                experienceId,
////                dataPlugin,
////                this,
////                icicle
////            )
////        }
////    }
////
////    override fun viewModelForExperienceToolbar(toolbarConfiguration: ToolbarConfiguration): ExperienceToolbarViewModelInterface {
////        return ExperienceToolbarViewModel(
////            toolbarConfiguration
////        )
////    }
//
////    override fun viewModelForNotificationCenter(context: Context): NotificationCenterListViewModelInterface {
////        return NotificationCenterListViewModel(
////            // TODO: redo this for DI reboot
////            NotificationsRepository(dataPlugin, DateFormatting(),
////                ioExecutor,
////                Scheduler.forAndroidMainThread(),
////                eventsPlugin,
////                localStorage
////            )
////        )
////    }
//}
