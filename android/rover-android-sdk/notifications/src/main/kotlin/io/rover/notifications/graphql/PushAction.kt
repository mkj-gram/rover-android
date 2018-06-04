package io.rover.notifications.graphql

import io.rover.rover.core.data.graphql.putProp
import io.rover.rover.core.data.graphql.safeGetString
import io.rover.notifications.domain.Notification
import io.rover.notifications.domain.PushAction
import io.rover.rover.platform.DateFormattingInterface
import org.json.JSONException
import org.json.JSONObject

val PushAction.AddNotificationAction.Companion.resourceName get() = "AddNotificationAction"

fun PushAction.Companion.decodeJson(
    json: JSONObject,
    dateFormatting: DateFormattingInterface
): PushAction.AddNotificationAction {
    val typeName = json.safeGetString("__typename")

    return when(typeName) {
        PushAction.AddNotificationAction.resourceName -> PushAction.AddNotificationAction(
            notification = Notification.decodeJson(
                json.getJSONObject("notification"),
                dateFormatting
            )
        )
        else -> throw JSONException("Unsupported PushAction type '$typeName'.")
    }
}

fun PushAction.encodeJson(dateFormatting: DateFormattingInterface): JSONObject {
    return JSONObject().apply {
        put("__typename", when(this@encodeJson) {
            is PushAction.AddNotificationAction -> {
                putProp(
                    this@encodeJson,
                    PushAction.AddNotificationAction::notification,
                    "notification"
                ) { it.encodeJson(dateFormatting)}
            }
        })
    }
}