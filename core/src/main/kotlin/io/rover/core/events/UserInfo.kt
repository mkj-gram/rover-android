package io.rover.core.events

import io.rover.core.data.domain.AttributeValue
import io.rover.core.data.domain.Attributes
import io.rover.core.data.graphql.operations.data.encodeJson
import io.rover.core.data.graphql.operations.data.toAttributesHash
import io.rover.core.logging.log
import io.rover.core.platform.DateFormattingInterface
import io.rover.core.platform.LocalStorage
import org.json.JSONObject

class UserInfo(
    localStorage: LocalStorage,
    private val dateFormatting: DateFormattingInterface
) : UserInfoInterface {
    private val store = localStorage.getKeyValueStorageFor(STORAGE_CONTEXT_IDENTIFIER)
    override fun update(builder: (attributes: HashMap<kotlin.String, AttributeValue>) -> Unit) {
        val mutableDraft = HashMap(currentUserInfo)
        builder(mutableDraft)
        currentUserInfo = mutableDraft
    }

    override fun clear() {
        currentUserInfo = hashMapOf()
    }

    override var currentUserInfo: Attributes = try {
        val currentAttributesJson = store[USER_INFO_KEY]
        when (currentAttributesJson) {
            null -> hashMapOf()
            else -> JSONObject(store[USER_INFO_KEY]).toAttributesHash()
        }
    } catch (throwable: Throwable) {
        log.w("Corrupted local user info, ignoring and starting fresh.  Cause: ${throwable.message}")
        hashMapOf()
    }
        private set(value) {
            field = value
            store[USER_INFO_KEY] = value.encodeJson(dateFormatting).toString()
            log.v("Stored new user info.")
        }

    companion object {
        private const val STORAGE_CONTEXT_IDENTIFIER = "io.rover.core.user-info"
        private const val USER_INFO_KEY = "user-info"
    }
}
