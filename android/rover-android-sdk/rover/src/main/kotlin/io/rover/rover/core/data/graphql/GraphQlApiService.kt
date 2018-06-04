package io.rover.rover.core.data.graphql

import android.net.Uri
import android.os.Handler
import android.os.Looper
import io.rover.rover.core.logging.log
import io.rover.rover.core.data.APIException
import io.rover.rover.core.data.AuthenticationContext
import io.rover.rover.core.data.NetworkError
import io.rover.rover.core.data.GraphQlRequest
import io.rover.rover.core.data.NetworkResult
import io.rover.rover.core.data.domain.EventSnapshot
import io.rover.rover.core.data.domain.Experience
import io.rover.rover.core.data.http.HttpClientResponse
import io.rover.rover.core.data.http.HttpRequest
import io.rover.rover.core.data.http.HttpVerb
import io.rover.rover.core.data.http.NetworkClient
import io.rover.rover.core.data.http.NetworkTask
import io.rover.rover.core.data.http.WireEncoderInterface
import io.rover.rover.core.data.graphql.operations.FetchExperienceRequest
import io.rover.rover.core.data.graphql.operations.SendEventsRequest
import org.json.JSONException
import java.io.IOException
import java.net.URI
import java.net.URL

/**
 * Responsible for providing access the Rover cloud API, powered by GraphQL.
 *
 * If you would like to override or augment any of the behaviour here, you may override it in
 * [DataPlugin].
 */
class GraphQlApiService(
    private val endpoint: URL,
    private val authenticationContext: AuthenticationContext,
    private val wireEncoder: WireEncoderInterface,
    private val networkClient: NetworkClient
): GraphQlApiServiceInterface {
    private val mainThreadHandler = Handler(Looper.getMainLooper())

    private fun urlRequest(mutation: Boolean, queryParams: Map<String, String>): HttpRequest {
        val uri = Uri.parse(endpoint.toString())
        val builder = uri.buildUpon()
        queryParams.forEach { k, v -> builder.appendQueryParameter(k, v) }

        return HttpRequest(
            URL(builder.toString()),
            hashMapOf<String, String>().apply {
                if(mutation) {
                    this["Content-Type"] = "application/json"
                }

                when {
                    authenticationContext.sdkToken != null -> this["x-rover-account-token"] = authenticationContext.sdkToken!!
                    authenticationContext.bearerToken != null -> this["authorization"] = "Bearer ${authenticationContext.bearerToken}"
                }

                this.entries.forEach { (key, value) ->
                    this[key] = value
                }
            },
            if (mutation) {
                HttpVerb.POST
            } else {
                HttpVerb.GET
            }
        )
    }

    private fun <TEntity> httpResult(httpRequest: GraphQlRequest<TEntity>, httpResponse: HttpClientResponse): NetworkResult<TEntity> =
        when (httpResponse) {
            is HttpClientResponse.ConnectionFailure -> NetworkResult.Error(httpResponse.reason, true)
            is HttpClientResponse.ApplicationError -> {
                log.w("Given GraphQL error reason: ${httpResponse.reportedReason}")
                NetworkResult.Error(
                    NetworkError.InvalidStatusCode(httpResponse.responseCode, httpResponse.reportedReason),
                    when {
                        // actually won't see any 200 codes here; already filtered about in the
                        // HttpClient response mapping.
                        httpResponse.responseCode < 300 -> false
                        // 3xx redirects
                        httpResponse.responseCode < 400 -> false
                        // 4xx request errors (we don't want to retry these; onus is likely on
                        // request creator).
                        httpResponse.responseCode < 500 -> false
                        // 5xx - any transient errors from the backend.
                        else -> true
                    }
                )
            }
            is HttpClientResponse.Success -> {
                try {
                    val body = httpResponse.bufferedInputStream.use {
                        it.reader(Charsets.UTF_8).readText()
                    }

                    log.v("RESPONSE BODY: $body")
                    when (body) {
                        "" -> NetworkResult.Error(NetworkError.EmptyResponseData(), false)
                        else -> {
                            try {
                                NetworkResult.Success(
                                    // TODO This could emit, say, a JSON decode exception!  Need a story.
                                    httpRequest.decode(body, wireEncoder)
                                )
                            } catch (e: APIException) {
                                log.w("API error: $e")
                                NetworkResult.Error<TEntity>(
                                    NetworkError.InvalidResponseData(e.message ?: "API returned unknown error."),
                                    // retry is not appropriate when we're getting a domain-level
                                    // error from the GraphQL API.
                                    false
                                )
                            } catch (e: JSONException) {
                                // because the traceback information has some utility for diagnosing
                                // JSON decode errors, even though we're treating them as soft
                                // errors, throw the traceback onto the console:
                                log.w("JSON decode problem details: $e, ${e.stackTrace.joinToString("\n")}")

                                NetworkResult.Error<TEntity>(
                                    NetworkError.InvalidResponseData(e.message ?: "API returned unknown error."),
                                    // retry is not appropriate when we're getting a domain-level
                                    // error from the GraphQL API.
                                    false
                                )
                            }
                        }
                    }
                } catch (exception: IOException) {
                    NetworkResult.Error<TEntity>(exception, true)
                }
            }
        }

    /**
     * Make a request of the Rover cloud API.  Results are delivered into the provided
     * [completionHandler] callback, on the main thread.
     */
    override fun <TEntity> operation(request: GraphQlRequest<TEntity>, completionHandler: ((NetworkResult<TEntity>) -> Unit)?): NetworkTask {
        // TODO: once we change urlRequest() to use query parameters and GET for non-mutation
        // requests, replace true `below` with `request.mutation`.
        val urlRequest = urlRequest(request.mutation, request.encodeQueryParameters())
        val bodyData = request.encodeBody()

        log.v("going to make network request $urlRequest")

        return if(authenticationContext.isAvailable()) {
            networkClient.networkTask(urlRequest, bodyData) { httpClientResponse ->
                val result = httpResult(request, httpClientResponse)
                completionHandler?.invoke(result)
            }
        } else {
            object : NetworkTask {
                override fun cancel() { }

                override fun resume() {
                    completionHandler?.invoke(
                        NetworkResult.Error(
                            Throwable("Rover API authentication not available."),
                            true
                        )
                    )
                }
            }
        }
    }

    override fun fetchExperienceTask(query: FetchExperienceRequest.ExperienceQueryIdentifier, completionHandler: ((NetworkResult<Experience>) -> Unit)): NetworkTask {
        val request = FetchExperienceRequest(query)
        return operation(request) { experienceResult ->
            mainThreadHandler.post {
                completionHandler.invoke(experienceResult)
            }
        }
    }

    override fun sendEventsTask(
        events: List<EventSnapshot>,
        completionHandler: ((NetworkResult<String>) -> Unit)
    ): NetworkTask {
        if(!authenticationContext.isAvailable()) {
            log.w("Events may not be submitted without a Rover authentication context being configured.")

            return object : NetworkTask {
                override fun cancel() { /* no-op */}

                override fun resume() {
                    completionHandler(
                        NetworkResult.Error(
                            Exception("Attempt to submit Events without Rover authentication context being configured."),
                            false
                        )
                    )
                }
            }
        }

        val request = SendEventsRequest(
            events,
            wireEncoder
        )

        return operation(request) { uploadResult ->
            mainThreadHandler.post {
                completionHandler.invoke(uploadResult)
            }
        }
    }
}