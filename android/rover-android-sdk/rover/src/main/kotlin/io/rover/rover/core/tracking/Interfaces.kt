package io.rover.rover.core.tracking

import io.rover.rover.core.data.domain.Attributes
import io.rover.rover.core.events.domain.Event
import java.util.UUID

interface SessionStoreInterface {
    /**
     * Enters a session.
     *
     * Returns the new session's UUID, or, if a session is already active, null.
     */
    fun enterSession(sessionKey: Any): UUID?

    fun leaveSession(sessionKey: Any, keepAlive: Int): UUID?
}


interface SessionTrackerInterface {
    /**
     * Indicate a session is opening for the given session key.  The Session Key should be a value
     * object (a Kotlin data class, a string, etc.) that properly implements hashcode, equals, and
     * an exhaustive version of toString(). This value object should describe the given semantic
     * item the user is looking at (a given experience, a given view, etc.).
     *
     * Note that the values need to be unique amongst the different event sources in the app, so be
     * particularly careful with string values or data class class names.
     */
    fun enterSession(sessionKey: Any, attributes: Attributes)

    /**
     * Indicate a session is being left.  See [enterSession] for an explanation of session key.
     */
    fun leaveSession(sessionKey: Any, attributes: Attributes)

}

interface SessionEventProvider {
    /**
     * Produce an [Event] for
     */
    fun eventForSessionBoundary(direction: SessionDirection, attributes: Attributes): Event
}

enum class SessionDirection {
    Start, Stop
}
