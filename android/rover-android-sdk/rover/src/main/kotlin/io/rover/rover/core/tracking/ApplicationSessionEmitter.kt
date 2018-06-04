package io.rover.rover.core.tracking

import android.arch.lifecycle.Lifecycle
import android.arch.lifecycle.LifecycleObserver
import android.arch.lifecycle.OnLifecycleEvent
import io.rover.rover.core.data.domain.AttributeValue
import io.rover.rover.core.data.domain.Attributes
import io.rover.rover.core.data.graphql.safeGetString
import io.rover.rover.core.data.graphql.safeOptInt
import io.rover.rover.core.events.EventQueueServiceInterface
import io.rover.rover.core.logging.log
import io.rover.rover.platform.LocalStorage
import io.rover.rover.platform.whenNotNull
import org.json.JSONObject
import java.util.Date
import java.util.UUID

// emitter: handles observing the source, defining continuity for each event pair (UUID), perhaps
// remembering if necessary to handle process lifecycle.

// app emitter: it's own object, will use ProcessLifecycleObserver, will store a UUID across process
// restarts, expects Tracker to be injected.

// experience emitter:  each experience view model will expect the Tracker to be injected directly and it
// will call it. so, no actual emitter object.
// ExperienceViewModel will also have some sort of SessionEventProvider injected too, and provide that to

// the tracker: will simply emit, handle keep alive time (that is, will remember outstanding Starts
// and will end them on its own). could have one instance per concern, doesn't strictly matter.

// provider: will build the Event for start or finish. passed into the tracker at assembly time.

/**
 * Monitors the application lifecycle and emits eventForSessionBoundary to the [SessionTrackerInterface]
 */
class ApplicationSessionEmitter(
    private val lifecycle: Lifecycle,
    private val tracker: SessionTrackerInterface
) {
    private var observer: LifecycleObserver? = null

    fun start() {
        lifecycle.addObserver(
            object : LifecycleObserver {
                @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
                fun appResume() {
                    tracker.enterSession("ApplicationSession", hashMapOf())
                }

                @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
                fun appPause() {
                    tracker.leaveSession("ApplicationSession", hashMapOf())
                }
            }
        )
        log.v("Application lifecycle tracking started.")
    }

    fun stop() {
        observer.whenNotNull { lifecycle.removeObserver(it) }
    }
}

/**
 * Create an instance of this for each possible emitter of Session events.
 */
class SessionTracker(
    private val eventQueueService: EventQueueServiceInterface,

    private val sessionStore: SessionStoreInterface,

    private val sessionEventProvider: SessionEventProvider,

    /**
     * The number of seconds to leave the session open for in the event that the user leaves
     * temporarily.
     */
    private val keepAliveTime: Int
): SessionTrackerInterface {
    override fun enterSession(sessionKey: Any, attributes: Attributes) {

        val uuid = sessionStore.enterSession(sessionKey)

        // emit an event if we are starting a new session.
        if(uuid != null) {
            val event = sessionEventProvider.eventForSessionBoundary(
                SessionDirection.Start,
                attributes
            )

            val eventWithSessionId = event.copy(
                attributes = event.attributes + hashMapOf(Pair("sessionID", AttributeValue.String(uuid.toString())))
            )

            // if session is already open, don't emit duplicate!

            eventQueueService.trackEvent(
                eventWithSessionId
            )
        }
    }

    override fun leaveSession(sessionKey: Any, attributes: Attributes) {
        val uuid = sessionStore.leaveSession(sessionKey, keepAliveTime)

        if(uuid != null) {
            val event = sessionEventProvider.eventForSessionBoundary(
                SessionDirection.Stop,
                attributes
            )

            val eventWithSessionId = event.copy(
                attributes = event.attributes + hashMapOf(Pair("sessionID", AttributeValue.String(uuid.toString())))
            )

            eventQueueService.trackEvent(
                eventWithSessionId
            )
        }
    }
}

class SessionStore(
    localStorage: LocalStorage
): SessionStoreInterface {
    private val store = localStorage.getKeyValueStorageFor(STORAGE_IDENTIFIER)

    override fun enterSession(sessionKey: Any): UUID? {
        // get session entry if exists, and not expired, re-use its UUID.  If not, generate a new
        // UUID.
        val existingUuid = activeUuidForSessionKey(sessionKey)
        val uuid = existingUuid ?: UUID.randomUUID()

        val newEntry = SessionEntry(
            uuid,
            // no expiry yet, because the session remains open.
            null
        )

        setEntry(sessionKey, newEntry)

        // only return a new UUID if we got one.
        return when(existingUuid) {
            null -> uuid
            else -> null
        }
    }

    override fun leaveSession(sessionKey: Any, keepAlive: Int): UUID? {
        val uuid = activeUuidForSessionKey(sessionKey)

        if(uuid != null) {
            // there is indeed a session open for the given key, mark it as expiring.
            val newEntry = SessionEntry(
                uuid,
                Date(Date().time + (keepAlive * 1000))
            )
            setEntry(sessionKey, newEntry)
        }

        gc()

        return uuid
    }

    private fun getEntry(sessionKey: Any): SessionEntry? {
        val entryJson = store[sessionKey.toString()].whenNotNull { JSONObject(it) }

        return entryJson.whenNotNull { try {
            SessionEntry.decodeJson(it)
        } catch (exception: Exception) {
            log.w("Invalid JSON appeared in Session Store, ignoring: ${exception.message}")
            null
        } }
    }

    private fun setEntry(sessionKey: Any, sessionEntry: SessionEntry) {
        store[sessionKey.toString()] = sessionEntry.encodeJson().toString()
    }

    private fun activeUuidForSessionKey(sessionKey: Any): UUID? {
        val existingEntry = getEntry(sessionKey)

        return if(existingEntry != null && existingEntry.expiresAt?.before(Date()) != true) {
            // an active session for this key.  return the session UUID.
            existingEntry.uuid
        } else null
    }

    private fun gc() {
        log.v("Garbage collecting any expired sessions.")

        // let's arbitrarily select anything longer than a week.
        store.keys.forEach { key ->
            val entry = getEntry(key)

            if(entry == null) {
                log.e("Could not garbage collect key '$key', it was missing?")
                return@forEach
            }

            if(entry.expiresAt?.before(Date(Date().time - CLEANUP_TIME)) == true) {
                log.w("Cleaning up stale session store key: $key/$entry")
                store[key] = null
            }
        }
    }

    data class SessionEntry(
        val uuid: UUID,
        /**
         * If this session is going to expire (ie., it has been left), then this value will be set.
         */
        val expiresAt: Date?
    ) {
        fun encodeJson(): JSONObject {
            return JSONObject().apply {
                put("uuid", uuid.toString())
                if(expiresAt != null) {
                    put("expires-at", expiresAt.time / 1000)
                }
            }
        }

        companion object {
            fun decodeJson(jsonObject: JSONObject): SessionEntry? {
                return SessionEntry(
                    UUID.fromString(jsonObject.safeGetString("uuid")),
                    jsonObject.safeOptInt("expires-at").whenNotNull { Date(it * 1000L) }
                )
            }
        }
    }

    companion object {
        const val STORAGE_IDENTIFIER = "io.rover.core.tracking.session-store"
        const val CLEANUP_TIME = 86400 * 7 * 1000L
    }
}