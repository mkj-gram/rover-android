package io.rover.experiences.ui

import android.annotation.SuppressLint
import android.graphics.Color
import android.net.Network
import android.os.Parcelable
import io.rover.experiences.ui.navigation.ExperienceExternalNavigationEvent
import io.rover.experiences.ui.navigation.ExperienceNavigationViewModelInterface
import io.rover.experiences.ui.navigation.NavigateTo
import io.rover.experiences.ui.toolbar.ExperienceToolbarViewModelInterface
import io.rover.experiences.ui.toolbar.ToolbarConfiguration
import io.rover.rover.core.data.NetworkResult
import io.rover.rover.core.data.domain.AttributeValue
import io.rover.rover.core.data.domain.Attributes
import io.rover.rover.core.data.domain.Experience
import io.rover.rover.core.data.graphql.GraphQlApiServiceInterface
import io.rover.rover.core.data.graphql.operations.FetchExperienceRequest
import io.rover.rover.core.logging.log
import io.rover.rover.core.streams.*
import io.rover.rover.core.tracking.SessionTrackerInterface
import kotlinx.android.parcel.Parcelize
import org.reactivestreams.Publisher
import kotlin.math.exp

class ExperienceViewModel(
    private val experienceRequest: ExperienceRequest,
    private val graphQlApiService: GraphQlApiServiceInterface,
    private val mainThreadScheduler: Scheduler,
    private val sessionTracker: SessionTrackerInterface,
    private val resolveNavigationViewModel: (experience: Experience, icicle: Parcelable?) -> ExperienceNavigationViewModelInterface,
    private val icicle: Parcelable? = null
) : ExperienceViewModelInterface {

    override val state: Parcelable
        get() {
            // this is a slightly strange arrangement: since (almost) all state is really within a
            // contained view model (that only becomes available synchronously) we effectively
            // assume we have only our icicle state when that nested view model is not available.
            return if (navigationViewModel == null) {
                // getting saved early, starting over.
                icicle ?: State(null)
            } else {
                State(
                    navigationViewModel?.state
                )
            }
        }

    override val actionBar: Publisher<ExperienceToolbarViewModelInterface>
    override val extraBrightBacklight: Publisher<Boolean>
    override val experienceNavigation: Publisher<ExperienceNavigationViewModelInterface>
    override val events: Subject<ExperienceViewModelInterface.Event> = PublishSubject()
    override val loadingState: Publisher<Boolean>

    override fun pressBack() {
        if (navigationViewModel == null) {
            actionSource.onNext(Action.BackPressedBeforeExperienceReady)
        } else {
            navigationViewModel?.pressBack()
        }
    }

    override fun fetchOrRefresh() {
        actionSource.onNext(Action.Fetch)
    }

    private val actionSource = PublishSubject<Action>()
    private val actions = actionSource.share()

    private fun fetchExperience(): Publisher<out NetworkResult<Experience>> =
        ({ callback: CallbackReceiver<NetworkResult<Experience>> -> graphQlApiService.fetchExperienceTask(
            when(experienceRequest) {
                is ExperienceRequest.ByCampaignUrl -> FetchExperienceRequest.ExperienceQueryIdentifier.ByUniversalLink(experienceRequest.url)
                is ExperienceRequest.ByCampaignId -> FetchExperienceRequest.ExperienceQueryIdentifier.ByCampaignId(experienceRequest.campaignId)
                is ExperienceRequest.ById -> FetchExperienceRequest.ExperienceQueryIdentifier.ById(experienceRequest.experienceId)
            }, callback) }).asPublisher().observeOn(mainThreadScheduler)

    /**
     * Hold on to a reference to the navigation view model so that it can contribute to the Android
     * state restore parcelable.
     */
    private var navigationViewModel: ExperienceNavigationViewModelInterface? = null

    init {
        // maybe for each type fork I should split out and delegate to subjects?
        val fetchAttempts = PublishSubject<NetworkResult<Experience>>()

        val toolBarSubject = PublishSubject<ExperienceToolbarViewModelInterface>()
        val loadingSubject = PublishSubject<Boolean>()

        actions.subscribe { action ->
            when(action!!) {
                Action.BackPressedBeforeExperienceReady -> {
                    events.onNext(ExperienceViewModelInterface.Event.NavigateTo(
                        ExperienceExternalNavigationEvent.Exit()
                    ))
                }
                Action.Fetch -> {
                    fetchExperience()
                        .doOnSubscribe {
                            loadingSubject.onNext(true)

                            // emit a temporary toolbar.
                            toolBarSubject.onNext(
                                object : ExperienceToolbarViewModelInterface {
                                    override val toolbarEvents: Publisher<ExperienceToolbarViewModelInterface.Event>
                                        get() = PublisherOperators.empty()

                                    override val configuration: ToolbarConfiguration get() = ToolbarConfiguration(
                                        true,
                                        "",
                                        Color.BLUE,
                                        Color.BLUE,
                                        Color.BLUE,
                                        true,
                                        false,
                                        Color.BLUE
                                    )

                                    override fun pressedBack() {
                                        actionSource.onNext(ExperienceViewModel.Action.BackPressedBeforeExperienceReady)
                                    }

                                    override fun pressedClose() {
                                        actionSource.onNext(ExperienceViewModel.Action.BackPressedBeforeExperienceReady)
                                    }
                                }
                            )
                        }
                        .subscribe(fetchAttempts::onNext)
                }
            }
        }

        val experiences = PublishSubject<Experience>()

        fetchAttempts.subscribe { networkResult ->
           loadingSubject.onNext(false)
           when(networkResult) {
               is NetworkResult.Error -> {
                   events.onNext(ExperienceViewModelInterface.Event.DisplayError(
                       networkResult.throwable.message ?: "Unknown"
                   ))
               }
               is NetworkResult.Success -> {
                   experiences.onNext(networkResult.response)
               }
           }
        }

        // yields an experience navigation view model. used by both our view and some of the
        // internal subscribers below.
        experienceNavigation = experiences.map { experience ->
            resolveNavigationViewModel(
                experience,
                // allow it to restore from state if there is any.
                (state as State).navigationState
            ).apply {
                // store a reference to the view model in object scope so it can contribute to the
                // state parcelable.
                this@ExperienceViewModel.navigationViewModel = this

                // track events with a side-effect, but I need the experience itself in scope.
                trackEnterExperience(experience)

                this.externalNavigationEvents.subscribe { _ ->
                    trackLeaveExperience(experience)
                }
            }
        }.shareAndReplay(1)

        // filter out all the navigation view model events external navigation events.
        val navigateAwayEvents = experienceNavigation.flatMap { navigationViewModel ->
            navigationViewModel.externalNavigationEvents
        }

        // emit those navigation events to our view.
        navigateAwayEvents.subscribe { navigateAway ->
            events.onNext(
                ExperienceViewModelInterface.Event.NavigateTo(navigateAway)
            )
        }

        // pass through the backlight and toolbar updates.
        val backlightEvents = experienceNavigation.flatMap { navigationViewModel ->
            navigationViewModel.backlight
        }
        val toolbarEvents = experienceNavigation.flatMap { navigationViewModel ->
            navigationViewModel.toolbar
        }
        val backlightSubject = PublishSubject<Boolean>()
        backlightEvents.subscribe { backlightSubject.onNext(it) }
        toolbarEvents.subscribe { toolBarSubject.onNext(it) }

        actionBar = toolBarSubject.shareAndReplay(1)
        extraBrightBacklight = backlightSubject.shareAndReplay(1)
        loadingState = loadingSubject.shareAndReplay(1)
    }

    protected fun trackEnterExperience(experience: Experience) {
        sessionTracker.enterSession(
            ExperienceSessionKey(experience.id.rawValue, experience.campaignId),
            "Experience Presented",
            "Experience Viewed",
            sessionEventAttributes(experience)
        )
    }

    protected fun trackLeaveExperience(experience: Experience) {
        sessionTracker.leaveSession(
            ExperienceSessionKey(experience.id.rawValue, experience.campaignId),
            "Experience Dismissed",
            sessionEventAttributes(experience)
        )
    }

    protected fun sessionEventAttributes(experience: Experience): Attributes {
        return hashMapOf(
            Pair("experienceID", AttributeValue.String(experience.id.rawValue))
        ) + if(experience.campaignId != null) { hashMapOf(Pair("campaignId", AttributeValue.String(experience.campaignId!!))) } else hashMapOf()
    }

    enum class Action {
        /**
         * Back pressed before the experience navigation view model became available.  We can't
         * deliver the back press event to it as we would normally do; instead we'll handle this
         * case as an event ourselves and emit an Exit event for it instead.
         */
        BackPressedBeforeExperienceReady,

        /**
         * Fetch (or refresh) the displayed experience.
         */
        Fetch
    }

    // @Parcelize Kotlin synthetics are generating the CREATOR method for us.
    @SuppressLint("ParcelCreator")
    @Parcelize
    data class State(
        val navigationState: Parcelable?
    ) : Parcelable

    data class ExperienceSessionKey(
        val experienceId: String,
        val campaignId: String?
    )

    sealed class ExperienceRequest {
        data class ByCampaignUrl(val url: String): ExperienceRequest()
        data class ByCampaignId(val campaignId: String): ExperienceRequest()
        data class ById(val experienceId: String): ExperienceRequest()
    }
}
