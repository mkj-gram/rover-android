package io.rover.app.experiences

import android.app.Application
import android.content.Intent
import com.microsoft.appcenter.AppCenter
import com.microsoft.appcenter.crashes.Crashes
import com.microsoft.appcenter.distribute.Distribute
import io.reactivex.schedulers.Schedulers
import io.rover.account.AccountAssembler
import io.rover.account.AuthService
import io.rover.app.experiences.services.ExperienceRepository
import io.rover.app.experiences.services.V1ApiNetworkClient
import io.rover.experiences.ExperiencesAssembler
import io.rover.rover.Rover
import io.rover.rover.core.CoreAssembler
import io.rover.rover.core.data.AuthenticationContext
import timber.log.Timber
import io.rover.rover.platform.SharedPreferencesLocalStorage

/**
 * Android entry point for the Rover Android Experiences app.
 */
class ExperiencesApplication: Application() {

    // TODO: These will be replaced with proper DI

    val authService by lazy {
        Rover.sharedInstance.resolveSingletonOrFail(
            AuthenticationContext::class.java
        ) as AuthService
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

        if (!BuildConfig.DEBUG) {
            AppCenter.start(
                this,
                getString(R.string.microsoft_app_center_secret),
                // TODO might replace App Center Crashes with Crashlytics.
                Crashes::class.java,
                Distribute::class.java
            )
        }

        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        } else {
            // TODO: Timber tree that reports to Crashlytics or whatnot
        }

        Rover.initialize(
            CoreAssembler(
                "",
                this,
                "inbox"
            ),
            AccountAssembler(
                this,
                Intent(
                    this,
                    ExperiencesListActivity::class.java
                )
            ),
            ExperiencesAssembler()
        )

        Rover.installSaneGlobalHttpCache(this)

        // So, a typical app using Rover would do the usual static-context Rover.initialize()
        // routine here.  However, we will not do so since we are using a late-bound custom
        // authentication context.  See AuthService. Now we have to at least warm up authservice, so
        // it can do that side-effect of initializing the Rover SDK in the event that authentication
        // is already persisted.
        authService
    }
}
