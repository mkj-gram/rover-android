package io.rover.androidtestapp

import android.app.Application
import android.content.Intent
import com.facebook.stetho.Stetho
import com.google.firebase.iid.FirebaseInstanceId
import io.rover.location.LocationAssembler
import io.rover.rover.Rover
import io.rover.rover.core.CoreAssembler
import io.rover.rover.core.container.Assembler
import io.rover.rover.core.container.Container
import io.rover.rover.core.container.Scope
import io.rover.rover.core.events.domain.Event
import io.rover.experiences.ExperiencesAssembler
import io.rover.experiences.routing.ExperienceEnabledTopLevelNavigation
import io.rover.rover.core.routing.TopLevelNavigation
import io.rover.notifications.NotificationsAssembler
import timber.log.Timber
import timber.log.Timber.DebugTree

class RoverAndroidTestApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        Stetho.initializeWithDefaults(this)

        Rover.installSaneGlobalHttpCache(this)

        if (BuildConfig.DEBUG) {
            Timber.plant(DebugTree())
        }

        Rover.initialize(
            CoreAssembler(
                "6c546189dc45df1293bddc18c0b54786",
                this,
                "inbox",
                endpoint = "https://api.staging.rover.io/graphql"
            ),
            ExperiencesAssembler(),
            // LocationAssembler(),
            NotificationsAssembler(
                this.applicationContext,
                R.mipmap.ic_launcher,
                0,
                "rover"
            ) {
                FirebaseInstanceId.getInstance().deleteInstanceId()
                FirebaseInstanceId.getInstance().token
            },
            object : Assembler {
                override fun assemble(container: Container) {
                    // override the default version of top level navigation.
                    container.register(
                        Scope.Singleton,
                        TopLevelNavigation::class.java
                    ) { _ ->
                        object : ExperienceEnabledTopLevelNavigation(applicationContext) {
                            override fun displayNotificationCenterIntent(): Intent {
                                return MainActivity.makeIntent(applicationContext, true)
                            }
                        }
                    }
                }
            }
        )
    }
}
