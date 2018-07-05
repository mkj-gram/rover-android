package io.rover.app.inbox

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import io.rover.account.AuthService
import io.rover.account.ui.LoginActivity
import io.rover.core.Rover
import io.rover.notifications.ui.NotificationCenterListView
import io.rover.core.platform.DeviceIdentificationInterface
import kotlinx.android.synthetic.main.activity_main.demoNotificationCentre
import kotlinx.android.synthetic.main.activity_main.deviceIdentifier
import kotlinx.android.synthetic.main.activity_main.toolbar

class MainActivity : AppCompatActivity() {

    private val authService: AuthService by lazy {
        (this.application as InboxApplication).authService
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        setSupportActionBar(toolbar)

        (findViewById(R.id.demoNotificationCentre) as NotificationCenterListView).activity = this

        demoNotificationCentre.activity = this

        // if not logged in:
        if (!authService.isLoggedIn) {
            startActivity(
                Intent(this, LoginActivity::class.java)
            )
            finish()
        }

        deviceIdentifier.text =
            Rover.sharedInstance.resolveSingletonOrFail(DeviceIdentificationInterface::class.java).installationIdentifier
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_inbox, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        val id = item.itemId

        if (id == R.id.action_sign_out) {
            authService.logOut()
            startActivity(
                Intent(this, LoginActivity::class.java)
            )
            finish()
        }

        return super.onOptionsItemSelected(item)
    }
}
