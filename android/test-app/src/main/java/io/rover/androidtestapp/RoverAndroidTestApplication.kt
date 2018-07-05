package io.rover.androidtestapp

import android.app.Application
import android.content.Intent
import com.facebook.stetho.Stetho
import com.google.firebase.iid.FirebaseInstanceId
import io.rover.core.Rover
import io.rover.core.CoreAssembler
import io.rover.core.container.Assembler
import io.rover.core.container.Container
import io.rover.core.container.Scope
import io.rover.experiences.ExperiencesAssembler
import io.rover.experiences.routing.ExperienceEnabledTopLevelNavigation
import io.rover.core.routing.TopLevelNavigation
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
