package io.rover.rover.core.data.graphql.operations.data

import io.rover.rover.platform.DateFormattingInterface
import io.rover.rover.core.data.domain.DeviceContext
import io.rover.rover.core.data.domain.EventSnapshot
import io.rover.rover.core.data.graphql.getDate
import io.rover.rover.core.data.graphql.putProp
import io.rover.rover.core.data.graphql.safeGetString
import io.rover.rover.core.data.graphql.safeOptString
import org.json.JSONObject
import java.util.UUID

/**
 * Outgoing JSON DTO transformation for [EventSnapshot]s, as submitted to the Rover GraphQL API.
 * This is equivalent to the `EventInput` structure on the GraphQL API.
 */
internal fun EventSnapshot.asJson(
    dateFormatting: DateFormattingInterface
): JSONObject {
    return JSONObject().apply {
        val props = listOf(
            EventSnapshot::name,
            EventSnapshot::id,
            EventSnapshot::namespace
        )

        putProp(this@asJson, EventSnapshot::timestamp, { dateFormatting.dateAsIso8601(it, true) })

        props.forEach { putProp(this@asJson, it) }

        putProp(this@asJson, EventSnapshot::attributes) { it.encodeJson() }

        putProp(this@asJson, EventSnapshot::deviceContext, "device") { it.asJson() }
    }
}

internal fun EventSnapshot.Companion.decodeJson(json: JSONObject, dateFormatting: DateFormattingInterface): EventSnapshot {
    return EventSnapshot(
        attributes = json.getJSONObject("attributes").toFlatAttributesHash(),
        name = json.safeGetString("name"),
        timestamp = json.getDate("timestamp", dateFormatting, true),
        id = UUID.fromString(json.safeGetString("id")),
        deviceContext = DeviceContext.decodeJson(json.getJSONObject("device")),
        namespace = json.safeOptString("namespace")
    )
}
