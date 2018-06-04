package io.rover.rover.core.data.graphql

import io.rover.rover.core.data.domain.DeviceContext
import io.rover.rover.core.data.domain.Experience
import io.rover.rover.platform.DateFormattingInterface
import io.rover.rover.core.data.domain.EventSnapshot
import io.rover.rover.core.data.http.WireEncoderInterface
import io.rover.rover.core.data.graphql.operations.data.asJson
import io.rover.rover.core.data.graphql.operations.data.decodeJson
import org.json.JSONArray
import org.json.JSONObject

/**
 * Responsible for marshalling Data Transfer objects to and from
 * their appropriate wire-format representation expected by the Rover API.
 */
@Deprecated("Static references to .encodeJson and .decodeJson extension methods are fine.")
class WireEncoder(
    private val dateFormatting: DateFormattingInterface
) : WireEncoderInterface {
    override fun encodeContextForSending(deviceContext: DeviceContext): JSONObject {
        return deviceContext
            .asJson()
    }

    override fun decodeEventsForSending(data: JSONArray): List<EventSnapshot> {
        return data.getObjectIterable().map {
            EventSnapshot.decodeJson(it, dateFormatting)
        }
    }

    fun decodeContext(data: String): DeviceContext {
        val json = JSONObject(data)
        return DeviceContext.Companion.decodeJson(json)
    }

    /**
     * Encode a list of eventForSessionBoundary for submission to the cloud-side API.
     */
    override fun encodeEventsForSending(events: List<EventSnapshot>): JSONArray =
        JSONArray(
            events.map { it.asJson(dateFormatting) }
        )

    override fun decodeExperience(data: JSONObject): Experience = Experience.decodeJson(data)

    override fun decodeErrors(errors: JSONArray): List<Exception> {
        return errors.getObjectIterable().map {
            // TODO: change to a better type than just Exception.  perhaps one with best-effort decoding of the GraphQL errors object.
            Exception(it.toString())
        }
    }
}
