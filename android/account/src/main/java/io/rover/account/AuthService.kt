package io.rover.account

import android.app.Application
import com.google.gson.annotations.SerializedName
import io.reactivex.Scheduler
import io.reactivex.Single
import io.rover.experiences.ExperiencesAssembler
import io.rover.rover.Rover
import io.rover.rover.core.CoreAssembler
import io.rover.rover.core.container.Assembler
import io.rover.rover.core.container.Container
import io.rover.rover.core.container.Scope
import io.rover.rover.core.data.AuthenticationContext
import io.rover.rover.core.data.domain.AttributeValue
import io.rover.rover.core.events.EventQueueService
import io.rover.rover.core.events.domain.Event
import io.rover.rover.platform.LocalStorage
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path
import timber.log.Timber
import java.util.Date
import java.util.UUID


/**
 * Authenticates against the Rover authentication REST API.
 */
class AuthService(
    localStorage: LocalStorage,
    private val scheduler: Scheduler
): AuthenticationContext {
    private val baseUrl = "https://api.rover.io/"

    private val storage = localStorage.getKeyValueStorageFor("auth_service")

    override var bearerToken: String?
        get() = storage.get("token")
        set(value) {
            if(value == null) {
                storage.unset("token")
            } else {
                storage.set("token", value)
            }
        }

    /**
     * For now, the GraphQL API backing up the 2.0 SDK only supports the SDK token authentication
     * method (although it will ultimately support being passed the Bearer OAuth token), so we'll
     * grab and store the SDK token for the user at login.
     */
    override var sdkToken: String?
        get() = storage.get("sdkToken")
        set(value) {
            if(value == null) {
                storage.unset("sdkToken")
            } else {
                storage.set("sdkToken", value)
            }
        }

    private val retrofit = Retrofit.Builder()
        .client(
            OkHttpClient.Builder()
                .build()
        )
        .baseUrl(baseUrl)
        .addConverterFactory(GsonConverterFactory.create())
        .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
        .build()

    private val authClient = retrofit.create(RoverAuthenticationClient::class.java)

    fun login(username: String, password: String): Single<AuthResult> {
        return authClient.createSession(RoverAuthenticationClient.CreateSessionRequest(
            RoverAuthenticationClient.CreateSessionRequest.Request(
                RoverAuthenticationClient.CreateSessionRequest.Request.CreateSessionAttributes(
                    username, password
                )
            )
            // now fetch the account data and retrieve the SDK token from it.
        )).flatMap { authResponse ->
            authClient.getAccount(authResponse.data.relationships.account.data.id, "Bearer ${authResponse.data.attributes.token}").map { accountResponse ->
                Pair(authResponse, accountResponse)
            }
        }.doOnSuccess { (authResponse, accountResponse) ->
            // Side effect: record our new token in local storage.
            Timber.v("Success! set token to ${authResponse.data.attributes.token}")
            bearerToken = authResponse.data.attributes.token
            sdkToken = accountResponse.data.attributes.sdkToken
        }.doOnError {
            bearerToken = null
            sdkToken = null
        }.map { _ ->
            AuthResult.Successful() as AuthResult
        }.onErrorReturn { error ->
            // match soft network errors here and map them
            AuthResult.Failed(error.message ?: "Unknown reason")
        }.subscribeOn(scheduler)
    }

    val isLoggedIn: Boolean
        get() = bearerToken != null && sdkToken != null

    fun logOut() {
        bearerToken = null
        sdkToken = null
    }
}

sealed class AuthResult {
    class Successful: AuthResult()
    class Failed(val reason: String): AuthResult()
}

interface RoverAuthenticationClient {
    @POST("sessions")
    fun createSession(@Body request: CreateSessionRequest): Single<CreateSessionResponse>

    @GET("accounts/{id}")
    fun getAccount(@Path("id") id: String, @Header("Authorization") authorization: String): Single<GetAccountResponse>

    data class CreateSessionRequest(
        @SerializedName("data")
        val data: Request
    ) {
        data class Request(
            @SerializedName("attributes")
            val attributes: CreateSessionAttributes,

            @SerializedName("type")
            val type: String = "sessions"
        ) {
            data class CreateSessionAttributes(
                @SerializedName("email")
                val email: String,

                @SerializedName("password")
                val password: String
            )
        }
    }

    data class CreateSessionResponse(
        @field:SerializedName("data")
        val data: Response
    ) {
        data class Response(
            @field:SerializedName("id")
            val id: String,

            @field:SerializedName("attributes")
            val attributes: CreateSessionResponseAttributes,

            @field:SerializedName("relationships")
            val relationships: Relationships
        ) {
            data class CreateSessionResponseAttributes(
                @field:SerializedName("token")
                val token: String
            )

            data class Relationships(
                @field:SerializedName("user")
                val user: User,

                @field:SerializedName("account")
                val account: Account
            ) {
                data class User(
                    @field:SerializedName("data")
                    val data: UserData
                ) {
                    data class UserData(
                        @field:SerializedName("id")
                        val id: String
                    )
                }

                data class Account(
                    @field:SerializedName("data")
                    val data: AccountData
                ) {
                    data class AccountData(
                        @field:SerializedName("id")
                        val id: String
                    )
                }
            }
        }
    }

    data class GetAccountResponse(
        @field:SerializedName("data")
        val data: Response
    ) {
        data class Response(
            @field:SerializedName("id")
            val id: String,

            @field:SerializedName("attributes")
            val attributes: Attributes
        ) {
            data class Attributes(
                @field:SerializedName("sdk-token")
                val sdkToken: String
            )
        }
    }
}

/**
 * Registers our own custom auth context, overriding the pre-registered one that just uses
 * an account token.
 */
class CustomAuthContextAssembler(
    private val authContext: AuthenticationContext
): Assembler {
    override fun assemble(container: Container) {
        container.register(Scope.Singleton, AuthenticationContext::class.java) { _ ->
            authContext
        }
    }
}