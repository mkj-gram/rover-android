package io.rover.app.experiences.services

import com.facebook.stetho.okhttp3.StethoInterceptor
import com.google.gson.annotations.SerializedName
import io.reactivex.Single
import io.rover.rover.core.data.http.NetworkTask
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.HttpException
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Query

/**
 * Access the legacy Rover V1 REST Web API.
 */
class V1ApiNetworkClient(
    private val authService: AuthService
) {

    private val token
        get() = authService.bearerToken ?: throw RuntimeException("Attempt to use V1ApiNetworkClient before authentication")

    // build our own httpclient with authenticator

    /**
     * A Retrofit network client that is set up for use with Rx, has an interceptor to include the
     * auth header(s), and has its base URL set to that of the Rover REST Web API.
     */
    private val restApiNetworkClient = Retrofit.Builder()
        .baseUrl("https://api.rover.io/")
        .client(
            OkHttpClient.Builder()
                .addInterceptor {
                    it.proceed(
                        it.request().newBuilder()
                            .header("Authorization", "Bearer $token")
                            .build()
                    )
                }
                .addNetworkInterceptor(StethoInterceptor())
                .addInterceptor(HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BASIC })
            .build()
        )
        .addConverterFactory(GsonConverterFactory.create())
        .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
        .build()

    private val experienceListClient = restApiNetworkClient.create(ExperienceListClient::class.java)

    private fun <T> mapRetrofitExceptionToAppError(throwable: Throwable): NetworkClientResult.Error<T> =
        when(throwable) {
            is HttpException -> {
                NetworkClientResult.Error<T>(
                    setOf(401, 402, 403).contains(throwable.response().code()),
                    throwable
                )
            }
            else -> {
                NetworkClientResult.Error<T>(
                    false,
                    throwable
                )
            }
        }

    fun allExperienceItems(collectionTypeFilter: String): Single<NetworkClientResult<List<ExperienceListItem>>> {
        return experienceListClient.experienceListItemsWithCollectionFilter(collectionTypeFilter)
            .map { response ->
                NetworkClientResult.Success<List<ExperienceListItem>>(
                    response.data.map { listItem ->
                        ExperienceListItem(
                            listItem.attributes.name,
                            listItem.attributes.viewToken,
                            listItem.id
                        )
                    }
                ) as NetworkClientResult<List<ExperienceListItem>>
            }
            .onErrorReturn { error ->
                mapRetrofitExceptionToAppError<List<ExperienceListItem>>(error)
            }

    }

    enum class Filter(val wireFormat: String) {
        Draft("drafts"), Published("published"), Archived("archived")
    }

    /**
     * While not an experience itself, this tells you where a real one may be found.
     */
    data class ExperienceListItem(
        val name: String,
        val viewToken: String,
        val id: String
    )

    interface ExperienceListClient {
        @GET("v1/experience-list-items")
        fun experienceListItemsWithCollectionFilter(
            @Query("filter[collectionType]") collectionTypeFilter: String
        ): Single<ExperienceListResponse>

        @GET("v1/experience-list-items")
        fun allExperienceListItems(): Single<ExperienceListResponse>

        data class ExperienceListResponse(
            @field:SerializedName("data")
            val data: List<ExperienceListItem>
        ) {

            data class ExperienceListItem(
                @field:SerializedName("attributes")
                val attributes: Attributes,

                @field:SerializedName("id")
                val id: String,

                @field:SerializedName("type")
                val type: String
            ) {
                data class Attributes(
                    @field:SerializedName("name")
                    val name: String,

                    @field:SerializedName("view-token")
                    val viewToken: String
                    // TODO: there are more but I'm going to ignore them for now.
                )
            }
        }
    }

}

/**
 * When using [asSingle], you'll find that you will have difficulty specifying a needed type
 * specification for a closure, for that you may use this.  See the [asSingle] documentation for
 * details.
 */
typealias  CallbackReceiver<T> = (T) -> Unit

/**
 * This allows you to map a method call that returns a NetworkTask, a convention in the Rover SDK
 * for async methods, to an Rx [Single].
 *
 * Unfortunately, because said convention involves passing in a callback and receiving a
 * [NetworkTask] return value, our adapter here is somewhat convoluted, implemented as an extension
 * method on a closure type.
 *
 * Note that you do need to use [CallbackReceiver]: Kotlin type inference will lack sufficient
 * information to know what your callback type is, and worse, the Kotlin parser does not seem
 * to like nesting closure definitions a closure literal, so the [CallbackReceiver] typelias
 * becomes necessary.
 *
 * Example usage:
 *
 * `{ callback: CallbackReceiver<MY_RESULT_TYPE> -> roverNetworkService.someMethodThatReturnsANetworkTask(callback) }.asSingle()`
 *
 * // TODO: consider move this into the SDK as something that exposes  Rover Micro-streams interface,
 * // and then just adapt that here.
 */
fun <T> (((r: T) -> Unit) -> NetworkTask).asSingle(): Single<T> {
    return Single.create { emitter ->
        val networkTask = this.invoke { result ->
            emitter.onSuccess(result)
        }
        networkTask.resume()
    }
}

sealed class NetworkClientResult<T> {
    class Error<T>(
        /**
         * Is (re-) login needed?
         */
        val loginNeeded: Boolean,

        /**
         * For clarity, the original cause.
         *
         * However, because this effectively leaks implementation details, most consuming code
         * should probably avoid checking this directly.
         */
        val reason: Throwable
    ): NetworkClientResult<T>()

    class Success<T>(
        val item: T
    ): NetworkClientResult<T>()
}
