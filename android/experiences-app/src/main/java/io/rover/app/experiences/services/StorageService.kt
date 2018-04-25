package io.rover.app.experiences.services

import android.content.Context

/**
 * Very simple hash-like storage of keys and values.
 */
interface KeyValueStorage {
    fun get(key: String): String?
    fun set(key: String, value: String)
    fun unset(key: String)
}

/**
 * Obtain a persistent key-value named persistent storage area.
 */
interface LocalStorage {
    fun getKeyValueStorageFor(namedContext: String): KeyValueStorage
}

/**
 * Implementation of [LocalStorage] using Android's SharedPreferences.
 */
class SharedPreferencesLocalStorageService(
    context: Context
) : LocalStorage {
    private val baseContextName = "io.rover.app.experiences.localstorage"

    val prefs = context.getSharedPreferences(baseContextName, Context.MODE_PRIVATE)

    override fun getKeyValueStorageFor(namedContext: String): KeyValueStorage {
        return object : KeyValueStorage {
            override fun get(key: String): String? = prefs.getString("$namedContext.$key", null)

            override fun set(key: String, value: String) {
                prefs.edit().putString("$namedContext.$key", value).apply()
            }

            override fun unset(key: String) {
                prefs.edit().remove("$namedContext.$key").apply()
            }
        }
    }
}