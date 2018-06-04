package io.rover.experiences.ui.navigation

import android.os.Parcelable
import io.rover.rover.core.data.domain.Experience
import io.rover.rover.core.logging.log
import io.rover.rover.platform.whenNotNull
import io.rover.rover.core.streams.PublishSubject
import io.rover.rover.core.streams.asPublisher
import io.rover.rover.core.streams.doOnNext
import io.rover.rover.core.streams.filter
import io.rover.rover.core.streams.filterNulls
import io.rover.rover.core.streams.flatMap
import io.rover.rover.core.streams.map
import io.rover.rover.core.streams.share
import io.rover.rover.core.streams.shareAndReplayTypesOnResubscribe
import io.rover.rover.core.streams.shareAndReplay
import io.rover.rover.core.streams.subscribe
import io.rover.rover.core.data.domain.AttributeValue
import io.rover.rover.core.data.domain.Screen
import io.rover.rover.core.events.EventQueueService
import io.rover.rover.core.events.EventQueueServiceInterface
import io.rover.rover.core.events.domain.Event
import io.rover.experiences.ui.containers.StandaloneExperienceHostActivity
import io.rover.experiences.ui.toolbar.ExperienceToolbarViewModelInterface
import io.rover.experiences.ui.layout.screen.ScreenViewModelInterface
import io.rover.experiences.ui.toolbar.ToolbarConfiguration
import io.rover.rover.core.data.domain.Attributes
import io.rover.rover.core.streams.PublisherOperators
import org.reactivestreams.Publisher
import io.rover.rover.core.tracking.SessionTrackerInterface
import kotlinx.android.parcel.Parcelize

/**
 * Behaviour for navigating through an experience.
 *
 * Responsible for the following concerns: starting at the home screen, maintaining a backstack,
 * state persistence, WebView-like canGoBack/goBack methods, and exposing an API for customizing
 * flow behaviour.
 */
open class ExperienceNavigationViewModel(
    private val experience: Experience,
    private val eventsPlugin: EventQueueServiceInterface,
    private val sessionTracker: SessionTrackerInterface,
    private val resolveScreenViewModel: (screen: Screen) -> ScreenViewModelInterface,
    private val resolveToolbarViewModel: (configuration: ToolbarConfiguration) -> ExperienceToolbarViewModelInterface,
    // TODO: consider an optional interface type here called "CustomNavigationBehaviour", which implementers may provide if they want custom nav
    icicle: Parcelable? = null
) : ExperienceNavigationViewModelInterface {

    override fun pressBack() {
        actionSource.onNext(Action.PressedBack())
    }

    override fun canGoBack(): Boolean = state.backStack.size > 1

    private val actionSource: PublishSubject<Action> = PublishSubject()
    private val actions = actionSource.share()

    private val screensById = experience.screens.associateBy { it.id.rawValue }

    // TODO: right now we bring up viewmodels for the *entire* experience (ie., all the screens at
    // once).  This is unnecessary.  It should be lazy instead.
    private val screenViewModelsById: Map<String, ScreenViewModelInterface> = screensById.mapValues {
        resolveScreenViewModel(it.value)
    }

    init {
        /**
         * This subscriber listens to all the view models and then dispatches their navigation events
         * to our actions publisher.
         */
        screenViewModelsById
            .entries
            .asPublisher()
            .flatMap { (id, screen) ->
                screen.events.map { Triple(id, screen, it) }
            }
            .subscribe({ (screenId, screen, screenEvent) ->
                // filter out the the events that are not meant for the currently active screen:
                if (activeScreenViewModel() == screen) {
                    actionSource.onNext(Action.Navigate(screenEvent.navigateTo, screenId, screenEvent.rowId, screenEvent.blockId))
                }
            }, { error -> actionSource.onError(error) })
    }

    protected sealed class Action {
        class PressedBack : Action()
        /**
         * Emitted into the actions stream if the close button is pressed on the toolbar.
         */
        class PressedClose : Action()
        class Navigate(
            val navigateTo: NavigateTo,
            val sourceScreenId: String,
            val sourceRowId: String,
            val sourceBlockId: String
        ) : Action()
    }

    override var state = if (icicle != null) {
        icicle as State
    } else {
        // the default starting state.  An empty backstack, which the reactive epic below
        // will populate with a an initial back stack frame for the home screen.
        State(
            listOf()
        )
    }
        protected set

    private fun activeScreenViewModel(): ScreenViewModelInterface {
        val currentScreenId = state.backStack.lastOrNull()?.screenId ?: throw RuntimeException("Backstack unexpectedly empty")
        return screenViewModelsById[currentScreenId] ?: throw RuntimeException("Unexpectedly found a dangling screen id in the back stack.")
    }

    /**
     * This method is responsible for defining the navigation behaviour that should occur
     * for all of the [Action]s.
     *
     * @return A [EmissionAndNewState], which includes what the entire new backstack and an emission.  The
     * event describes what the [ExperienceNavigationView] should do: transition to showing a new
     * ScreenView, open up an external web browser, or quit out completely.
     *
     * Override this if you would like to modify navigation behaviour (particularly, to launch an
     * external screen in your app, such as Login Screen), in response to the incoming Experience
     * Screen you are about to display having some characteristic, such as a custom key.  Be sure
     * to call `super` otherwise.
     *
     * Note: if you want to override behaviour when the navigation view is about to navigate to a
     * new Experience Screen, consider overriding [emissionForNavigatingToScreen] instead.
     */
    protected open fun actionBehaviour(currentBackStack: List<BackStackFrame>, action: Action): EmissionAndNewState? {
        val possiblePreviousScreenId = state.backStack.getOrNull(state.backStack.lastIndex - 1)?.screenId
        return when (action) {
            is Action.PressedBack -> {
                possiblePreviousScreenId.whenNotNull { previousScreenId ->
                    val screenViewModel = screenViewModelsById[previousScreenId]
                    val screen = screensById[previousScreenId]

                    when {
                        screenViewModel == null || screen == null -> {
                            log.w("Screen by id ${previousScreenId} missing from Experience with id ${experience.id.rawValue}.")
                            null
                        }
                        else -> emissionForNavigatingToScreen(screen, screenViewModel, currentBackStack, false)
                    }

                } ?: emissionForClosingExperience(state.backStack) // can't go any further back: backstack would be empty; instead emit Exit.
            }
            is Action.PressedClose -> {
                emissionForClosingExperience(state.backStack)
            }
            is Action.Navigate -> {
                when (action.navigateTo) {
                    is NavigateTo.External -> EmissionAndNewState(
                        ExperienceNavigationViewModelInterface.Emission.Event.NavigateAway(
                            ExperienceExternalNavigationEvent.Action(action.navigateTo.actionBehaviour)
                        ),
                        // no change to backstack: something will instead be pushed onto the
                        // containing backstack (ie., the Android one or perhaps a custom one used
                        // by the app) rather than this one.
                        state.backStack
                    )
                    is NavigateTo.GoToScreenAction -> {
                        val screenViewModel = screenViewModelsById[action.navigateTo.screenId]
                        val screen = screensById[action.navigateTo.screenId]

                        return when {
                            screenViewModel == null || screen == null -> {
                                log.w("Screen by id ${action.navigateTo.screenId} missing from Experience with id ${experience.id.rawValue}.")
                                null
                            }
                            else -> emissionForNavigatingToScreen(screen, screenViewModel, currentBackStack, true)
                        }
                    }
                }
            }
        }
    }

    /**
     * Generates the needed [EmissionAndNewState] for navigating to a screen, backwards or forwards.
     *
     * You can override this to return a [ExperienceExternalNavigationEvent.Custom] event and thus
     * be able respond to it in your container (say, a subclass of
     * [StandaloneExperienceHostActivity]), and perform your custom behaviour, such as launching an
     * app login screen.
     *
     * @return an EventAndState which describes the [ExperienceNavigationViewModelInterface.Event]
     * event that should be emitted along with the new state of the backstack.
     */
    protected open fun emissionForNavigatingToScreen(
        screen: Screen,
        screenViewModel: ScreenViewModelInterface,
        currentBackStack: List<BackStackFrame>,
        forwards: Boolean
    ): EmissionAndNewState {
        return EmissionAndNewState(
            ExperienceNavigationViewModelInterface.Emission.Update.GoToScreen(
                screenViewModel, !forwards, currentBackStack.isNotEmpty()
            ),
            if(forwards) {
                currentBackStack + listOf(BackStackFrame(screen.id.rawValue))
            } else {
                currentBackStack.subList(0, currentBackStack.lastIndex)
            }
        )
    }

    /**
     * Generates the needed [EmissionAndNewState] just for restoring the current Screen view model.
     *
     * Most users seeking to override navigation functionality should not need to override this method.
     */
    protected open fun emissionForRestoringToScreen(
        screenViewModel: ScreenViewModelInterface,
        currentBackStack: List<BackStackFrame>
    ): EmissionAndNewState {
        // just warp right to the current screen in the state
        return EmissionAndNewState(
            ExperienceNavigationViewModelInterface.Emission.Update.GoToScreen(
                screenViewModel, false, false
            ),
            state.backStack
        )
    }

    /**
     * Generates the needed [EmissionAndNewState] to exit the Experience.
     *
     * You can override this to modify the exit behaviour, perhaps to return a
     * [ExperienceNavigationViewModelInterface.Emission.Event.NavigateAway] with a
     * [ExperienceExternalNavigationEvent.Custom] to inform your main Activity to instead perform no
     * effect at all.
     */
    protected open fun emissionForClosingExperience(
        currentBackStack: List<BackStackFrame>
    ): EmissionAndNewState {
        return EmissionAndNewState(
            ExperienceNavigationViewModelInterface.Emission.Event.NavigateAway(ExperienceExternalNavigationEvent.Exit()),
            currentBackStack // no point changing the backstack: the view is just getting entirely popped
        )
    }

    /**
     * An [emission], which is an asynchronous event emitted from the view model which can either
     * update the UI or perhaps inform the containing components to perform an external navigation
     * operation.  The [newBackStack] is what the new back stack state should be after the event has
     * completed.
     */
    data class EmissionAndNewState(
        val emission: ExperienceNavigationViewModelInterface.Emission,
        val newBackStack: List<BackStackFrame>
    )

    /**
     * In response to navigating between screens, we may want to inject events for setting the
     * backlight boost or the toolbar.
     */
    private fun injectBehaviouralTransientEvents(
        event: ExperienceNavigationViewModelInterface.Emission
    ): Publisher<ExperienceNavigationViewModelInterface.Emission> {
        // now take the event from the state change and inject some behavioural transient events
        // into the stream as needed (backlight and toolbar behaviours).
        // emit app bar update and BacklightBoost events (as needed) and into the stream for screen changes.
        val backlightEvent = when (event) {
            is ExperienceNavigationViewModelInterface.Emission.Update.GoToScreen -> event.screenViewModel.needsBrightBacklight
            else -> null
        }.whenNotNull { ExperienceNavigationViewModelInterface.Emission.Update.SetBacklightBoost(it) }

        val appBarEvent = when (event) {
            is ExperienceNavigationViewModelInterface.Emission.Update.GoToScreen -> event.screenViewModel.appBarConfiguration
            else -> null
        }.whenNotNull {
            val toolbarViewModel = resolveToolbarViewModel(it)
            ExperienceNavigationViewModelInterface.Emission.Update.SetActionBar(
                toolbarViewModel
            )
        }

        return PublisherOperators.concat(
            PublisherOperators.just(event),
            PublisherOperators.just(backlightEvent),
            PublisherOperators.just(appBarEvent)
        ).filterNulls()
    }

    // TODO: make this lazy to avoid constructor leakage warnings?
    private val epic = PublisherOperators.concat(
        PublisherOperators.just(
            if(state.backStack.isEmpty()) {
                // backstack is empty, so we're just starting out.  Navigate forward to the home screen in the experience!
                val homeScreen = screensById[experience.homeScreenId.rawValue] ?: throw RuntimeException("Home screen id is dangling.")
                val screenViewModel = screenViewModelsById[experience.homeScreenId.rawValue] ?: throw RuntimeException("Home screen id is dangling.")
                // so, in the case of nav view model. here are the following consumer points:

                emissionForNavigatingToScreen(
                    homeScreen,
                    screenViewModel,
                    state.backStack,
                    true
                )
            } else {
                emissionForRestoringToScreen(activeScreenViewModel(), state.backStack)
            }
        ),

        actions.map { action -> actionBehaviour(state.backStack, action) }
            .filterNulls()
    ).observeStateChangesForSessionTracking()
    .doOnNext { stateChange ->
        state = state.copy(backStack = stateChange.newBackStack)
    }.flatMap { stateChange -> injectBehaviouralTransientEvents(stateChange.emission) }
    .doOnNext { event ->
        // side effects: we want to dispatch all events arriving from the toolbarviewmodel.
        // TODO: this subscriber may be moved to a separate field just to isolate it and improve clarity.
        if (event is ExperienceNavigationViewModelInterface.Emission.Update.SetActionBar) {
            event
                .experienceToolbarViewModel
                .toolbarEvents
                .subscribe { toolbarEvent ->
                    // subscribe to the events from the toolbar and dispatch them.
                    actionSource.onNext(
                        when (toolbarEvent) {
                            is ExperienceToolbarViewModelInterface.Event.PressedBack -> Action.PressedBack()
                            is ExperienceToolbarViewModelInterface.Event.PressedClose -> Action.PressedClose()
                        }
                    )
                }
        }

    }.doOnNext {
        log.v("Nav event: $it")
    }.shareAndReplay(10) // a count of 10 because only a couple eventForSessionBoundary are emitted
    // synchronously at startup that must be delivered to both eventForSessionBoundary and updates. only subscribers
    // are eventForSessionBoundary and updates, which both must see the entire stream.   I just set a max limit since
    // both will subscribe synchronously anyway.

    /**
     * Observe the state update stream and emit session updates (for BI/engagement tracking) to the
     * [SessionTrackerInterface].
     */
    protected fun Publisher<EmissionAndNewState>.observeStateChangesForSessionTracking(): Publisher<EmissionAndNewState> {
        return doOnNext { stateChange ->
            val emission = stateChange.emission
            when(emission) {
                is ExperienceNavigationViewModelInterface.Emission.Update.GoToScreen -> {
                    trackLeaveScreen()
                    trackEnterScreen(emission.screenViewModel.screenId)
                }
                is ExperienceNavigationViewModelInterface.Emission.Event.NavigateAway -> {
                    trackLeaveScreen()
                }
            }
        }
    }

    protected fun trackLeaveScreen() {
        // peek the state to get the current screen.
        val currentScreenId = state.backStack.lastOrNull()?.screenId

        if(currentScreenId != null) {
            sessionTracker.leaveSession(
                ExperienceScreenSessionKey(experience.id.rawValue, currentScreenId),
                sessionEventAttributes(currentScreenId)
            )
        }
    }

    protected fun trackEnterScreen(screenId: String) {
        sessionTracker.enterSession(
            ExperienceScreenSessionKey(experience.id.rawValue, screenId),
            sessionEventAttributes(screenId)
        )
    }

    private fun sessionEventAttributes(screenId: String): Attributes {
        return hashMapOf(
            Pair("experienceID", AttributeValue.String(experience.id.rawValue)),
            Pair("screenID", AttributeValue.String(screenId))
        ) + if(experience.campaignId != null) { hashMapOf(Pair("campaignId", AttributeValue.String(experience.campaignId!!))) } else hashMapOf()
    }

    /**
     * Monitors actions and issues analytics eventForSessionBoundary to the [EventQueueService].
     */
    private val actionEventSubscription = actions.subscribe { action ->
        when(action) {
            is Action.Navigate -> {
                val attributes = when(action.navigateTo) {
                    is NavigateTo.GoToScreenAction -> {
                        hashMapOf(
                            Pair("action", AttributeValue.String("goToScreen")),
                            Pair("destinationScreenID", AttributeValue.String(action.navigateTo.screenId)),
                            // not possible to navigate to a screen in another experience as of yet:
                            Pair("destinationExperienceID", AttributeValue.String(experience.id.rawValue))
                        )
                    }
                    is NavigateTo.External -> {
                        hashMapOf(
                            Pair("action", AttributeValue.String("openURL"))
                            // TODO: figure out how to properly compose the event data contributed by the Action itself and the context.
                            // Pair("url", AttributeValue.String(action.navigateTo.uri.toString()))
                        )
                    }
                }

                val event = Event(
                    name = "Block Tapped",
                    attributes = hashMapOf(
                        Pair("experienceID", AttributeValue.String(experience.id.rawValue)),
                        Pair("screenID", AttributeValue.String(action.sourceScreenId)),
                        Pair("blockID", AttributeValue.String(action.sourceBlockId))
                    ).apply { putAll(attributes) } + attributeHashFragmentForCampaignId()
                )

                eventsPlugin.trackEvent(event, EventQueueService.ROVER_NAMESPACE)
            }
        }
    }

    override val events: Publisher<ExperienceNavigationViewModelInterface.Emission.Event> = epic
        .filter { emission -> emission is ExperienceNavigationViewModelInterface.Emission.Event }
        .map { it as ExperienceNavigationViewModelInterface.Emission.Event }
        .doOnNext { log.v("Event emitted: $it.") }
        .share()
        
    override val updates: Publisher<ExperienceNavigationViewModelInterface.Emission.Update> = epic
        .filter { emission -> emission is ExperienceNavigationViewModelInterface.Emission.Update }
        .map { it as ExperienceNavigationViewModelInterface.Emission.Update }
        .shareAndReplayTypesOnResubscribe(
            // So, GoToScreen will retain its animation values.  it needs to be transformed.  However,
            // because in the event of a re-subscribe it is very likely that the
            // ExperienceNavigationView is new and has no current screen view, in which case it defaults
            // to no animation anyway.
            ExperienceNavigationViewModelInterface.Emission.Update.GoToScreen::class.java,
            ExperienceNavigationViewModelInterface.Emission.Update.SetActionBar::class.java,
            ExperienceNavigationViewModelInterface.Emission.Update.SetBacklightBoost::class.java
        )
        .doOnNext { log.v("Update emitted: $it.") }

    private fun attributeHashFragmentForCampaignId(): HashMap<String, AttributeValue.String> {
        return if(experience.campaignId != null) hashMapOf(
            Pair("campaignID", AttributeValue.String(experience.campaignId.toString()))
        ) else hashMapOf()
    }

    @Parcelize
    data class BackStackFrame(
        val screenId: String
    ) : Parcelable

    @Parcelize
    data class State(
        val backStack: List<BackStackFrame>
    ) : Parcelable

    /**
     * A unique descriptor for identifying a given experience screen to [SessionTrackerInterface].
     */
    data class ExperienceScreenSessionKey(
        private val experienceId: String,
        private val screenId: String
    )
}
