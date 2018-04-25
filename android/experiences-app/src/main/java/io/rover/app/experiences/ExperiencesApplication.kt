package io.rover.app.experiences

import android.app.Application
import com.facebook.stetho.Stetho
import io.reactivex.schedulers.Schedulers
import io.rover.app.experiences.services.AuthService
import io.rover.app.experiences.services.ExperienceRepository
import io.rover.app.experiences.services.SharedPreferencesLocalStorageService
import io.rover.app.experiences.services.V1ApiNetworkClient
import io.rover.rover.Rover
import timber.log.Timber

/**
 * Android entry point for the Rover Android Experiences app.
 */
class ExperiencesApplication: Application() {

    // TODO: These will be replaced with proper DI

    private val storageService by lazy {
        SharedPreferencesLocalStorageService(this)
    }

    val authService by lazy {
        Timber.v("Setting up AuthService!")
        AuthService(storageService, Schedulers.io(), this)
    }

    val experienceRepository by lazy {
        ExperienceRepository(
            V1ApiNetworkClient(
                authService
            ),
            Schedulers.io()
        )
    }

    override fun onCreate() {
        super.onCreate()

        Stetho.initializeWithDefaults(this)

        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        } else {
            // TODO: Timber tree that reports to Crashlytics or whatnot
        }

        Rover.installSaneGlobalHttpCache(this)

        // So, a typical app using Rover would do the usual static-context Rover.initialize()
        // routine here.  However, we will not do so since we are using a late-bound custom
        // authentication context.  See AuthService. Now we have to at least warm up authservice, so
        // it can do that side-effect of initializing the Rover SDK in the event that authentcation
        // is already persisted.
        authService
    }
//
//    /**
//     * If you want to be able to see the requests made by the Rover SDK to our API in
//     * [Stetho's](http://facebook.github.io/stetho/) network inspector, copy this class into your
//     * application and set an instance of it on the [AsyncTaskAndHttpUrlConnectionNetworkClient] with
//     * [AsyncTaskAndHttpUrlConnectionNetworkClient.registerInterceptor] (DI instructions for
//     * users to follow).
//     */
//    class StethoRoverInterceptor : AsyncTaskAndHttpUrlConnectionInterceptor {
//        override fun onOpened(httpUrlConnection: HttpURLConnection, requestPath: String, body: ByteArray): AsyncTaskAndHttpUrlConnectionInterception {
//            val connManager = StethoURLConnectionManager(requestPath)
//            connManager.preConnect(httpUrlConnection, ByteArrayRequestEntity(body))
//
//            return object : AsyncTaskAndHttpUrlConnectionInterception {
//                override fun onConnected() {
//                    connManager.postConnect()
//                }
//
//                override fun onError(exception: IOException) {
//                    connManager.httpExchangeFailed(exception)
//                }
//
//                override fun sniffStream(source: InputStream): InputStream =
//                    connManager.interpretResponseStream(source)
//            }
//        }
//    }

}

