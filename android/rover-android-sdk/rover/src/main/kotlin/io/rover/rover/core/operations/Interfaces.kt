package io.rover.rover.core.operations

import android.app.Activity
import android.content.Intent
import android.support.v4.content.ContextCompat
import io.rover.rover.core.container.Resolver
import io.rover.rover.core.logging.log
import io.rover.rover.core.streams.doOnSubscribe
import io.rover.rover.core.streams.subscribe
import org.reactivestreams.Publisher

sealed class ActionBehaviour {
    /**
     * The action is served by running the given intent.  Use [Activity.startActivity] to run the
     * returned intent.
     *
     * (Note that certain consumers may wish to synthesize a backstack with
     * [ActionIntentBackstackSynthesizer] and then use [ContextCompat.startActivities] followed
     * [Activity.finish]).
     */
    data class IntentAction(val intent: Intent): ActionBehaviour()

    /**
     * Encapsulates a headless behaviour that can be executed at will.
     *
     * The action will deliver its results entirely as a side-effect more or less outside the scope
     * of the caller of the dispatcher (updating persisted data, launching a separate activity,
     * etc.).
     *
     * You may observe the returned [Publisher] to be made aware of when the action completes.
     */
    data class HeadlessAction(val behaviour: Publisher<Unit>): ActionBehaviour() {
        /**
         * Convenience method to just run the behaviour where you do not need to observe the
         * completion thereof.
         *
         * Method returns immediately and the action will proceed in the background.
         */
        fun exec() {
            behaviour
                .doOnSubscribe {
                    log.v("Executing $this")
                }
                .subscribe {
                    log.v("Executed $this")
                }
        }
    }

    /**
     * The given action may not be meaningfully displayed/executed outside of its own context.
     */
    class Intrinsic(): ActionBehaviour()

    /**
     * No handler is registered in the app for the given action, and thus cannot be displayed or
     * executed.
     */
    class NotAvailable(): ActionBehaviour()
}

interface Action {
    /**
     * If this action can be handled as an inbound intent (or rather, potentially as a stack of
     * intents to allow for including synthesized past stack frames), returns it as such.
     */
    fun operation(resolver: Resolver): ActionBehaviour = ActionBehaviour.Intrinsic()
}

interface ActionBehaviourMappingInterface {
    fun mapToBehaviour(action: Action): ActionBehaviour
}

// SO, questions:

// How do I wire up to NotificationOpen and LinkOpen? They both want intents, not side-effects.

// Likely they will handle themselves because they will take Action, match type, and directly call
// and dispatch intents.  Only the "background" ones will be sent to the ActionBehaviourMapping.  However, will
// that result in type-availability issues?  Experience Intents, for example :(

// I also have my whole bit with the "springboard" activity launching links.  But that too is fine,
// it will just run the intent that it receives from the dispatcher.

// Btw synthesizing the back stack requires knowledge of one bit of context: whether or not it
// should synthesize the home/main screen stack frame.  However, the new regime does indeed make it
// super obvious, because each action source owns the control flow and can make the right request.

// So the PresentExperience/PresentUri action "creators" (as registered in the DI) can be told
// whether or not to create a stack.

// Incoming action handlers:

// * NotificationOpen
// * LinkOpen
// * Tapping a block in Experience viewmodel etc

// Action types that need to be dispatched into intents:
// * Present Website
// * Present Notification Center
// * Present Experience
// * Present Experience from Universal Link (ie a campaign slug only)
// * Add Notification: store a notification and add to Android notification drawer. (headless)

// Any of the above notification types that return Intents are pretty much going to want to do
// backstack synth, which means they'll need to have a parameter specifying if they should or not.
// The incoming action handler will ask when calling to the DI layer.  This works, but is not
// amazing.

// Although actually, perhaps instead of that, we can instead have the action handlers call to
// ActionIntentBackstackSynthesizer (or its progeny), which is a bit more semantic.
// Action delegation would then just return an Intent in the Intent case instead of a List<>.

// ActionRoutingBehaviour would be factored into the preceding various assembler-level action
// creators.

// Actions that will not be dispatched (will be handled in context):
// * GoToScreen

// (and some shared logic for the backstack synth behaviour/config thereof:
// ActionIntentBackstackSynthesizer and TopLevelNavigation)

// so I notice that the only headless one is Add Notification.  Doing an intent for it would be
// possible but pretty weird.  Perhaps I change the dispatch return type to be an either/or of an
// Intent Stack or a Publisher<Unit> (callable), ie., visible and headless, respectively.

// I think I will change one other thing from the iOS version, too: instead of an Action interface
// that returns the ActionBehaviour, instead make a 'ActionBehaviourMapping' object that takes an
// action and yields the ActionBehaviour.  This is to avoid mixing the data type with logic (on
// Swift it's less of an issue on account of protocol implementation extensions). Probably will mess
// around with implementing an action type and see what shakes out.