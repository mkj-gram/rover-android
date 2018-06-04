package io.rover.account

import android.app.Application
import android.content.Intent
import io.reactivex.schedulers.Schedulers
import io.rover.account.ui.LoginActivity
import io.rover.rover.core.container.Assembler
import io.rover.rover.core.container.Container
import io.rover.rover.core.container.Scope
import io.rover.rover.core.data.AuthenticationContext
import io.rover.rover.platform.LocalStorage
import io.rover.rover.platform.SharedPreferencesLocalStorage

class AccountAssembler(
    private val application: Application,
    private val targetIntent: Intent
): Assembler {
    override fun assemble(container: Container) {
        container.register(
            Scope.Singleton,
            LocalStorage::class.java,
            "account"
        ) { _ ->
            SharedPreferencesLocalStorage(
                application,
                "io.rover.account"
            )
        }

        container.register(
            Scope.Singleton,
            LoginActivity.LoginActivityTargetIntent::class.java
        ) { resolver ->
            LoginActivity.LoginActivityTargetIntent(
                targetIntent
            )
        }

        container.register(
            Scope.Singleton,
            AuthenticationContext::class.java
        ) { resolver ->
            AuthService(
                resolver.resolveSingletonOrFail(
                    LocalStorage::class.java,
                    "account"
                ),
                Schedulers.io(),
                application
            )
        }
    }
}
