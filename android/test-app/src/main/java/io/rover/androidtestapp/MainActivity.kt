package io.rover.androidtestapp

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.provider.Settings
import android.support.design.widget.BottomNavigationView
import android.support.v4.app.ActivityCompat
import android.support.v4.content.ContextCompat
import android.support.v7.app.AlertDialog
import android.support.v7.app.AppCompatActivity
import android.view.View
import android.widget.Button
import com.facebook.stetho.urlconnection.ByteArrayRequestEntity
import com.facebook.stetho.urlconnection.StethoURLConnectionManager
import io.rover.rover.Rover
import io.rover.rover.core.data.http.AsyncTaskAndHttpUrlConnectionInterception
import io.rover.rover.core.data.http.AsyncTaskAndHttpUrlConnectionInterceptor
import io.rover.rover.core.data.http.AsyncTaskAndHttpUrlConnectionNetworkClient
import io.rover.rover.experiences.ui.containers.StandaloneExperienceHostActivity
import io.rover.rover.notifications.ui.NotificationCenterListView
import kotlinx.android.synthetic.main.activity_main.demoExperienceView
import kotlinx.android.synthetic.main.activity_main.demoNotificationCentre
import kotlinx.android.synthetic.main.activity_main.message
import kotlinx.android.synthetic.main.activity_main.navigation
import timber.log.Timber
import java.io.IOException
import java.io.InputStream
import java.net.HttpURLConnection


class MainActivity : AppCompatActivity() {
    private val mOnNavigationItemSelectedListener = BottomNavigationView.OnNavigationItemSelectedListener { item ->
        when (item.itemId) {
            R.id.navigation_home -> {
                message.setText(R.string.title_home)
                switchBetweenExperienceAndNotifications(false)
                return@OnNavigationItemSelectedListener true
            }
            R.id.navigation_dashboard -> {
                message.setText(R.string.title_dashboard)
                switchBetweenExperienceAndNotifications(false)
                return@OnNavigationItemSelectedListener true
            }
            R.id.navigation_notifications -> {
                message.setText(R.string.title_notifications)
                switchBetweenExperienceAndNotifications(true)
                return@OnNavigationItemSelectedListener true
            }
        }
        false
    }

    private fun switchBetweenExperienceAndNotifications(notification: Boolean) {
        demoNotificationCentre.visibility = if(notification) View.VISIBLE else View.GONE
        demoExperienceView.visibility = if(!notification) View.VISIBLE else View.GONE
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener)

        demoNotificationCentre.notificationCenterHost = object : NotificationCenterListView.NotificationCenterHost {
            override val provideActivity: AppCompatActivity
                get() = this@MainActivity
        }

        demoNotificationCentre.viewModel = Rover
            .sharedInstance
            .notificationCenterViewModel

         if(this.intent?.extras?.getBoolean("SHOW_NOTIFICATION_CENTER", false) ?: true) {
            navigation.selectedItemId = R.id.navigation_notifications

             switchBetweenExperienceAndNotifications(true)
        } else {
             navigation.selectedItemId = R.id.navigation_home

             switchBetweenExperienceAndNotifications(false)
        }

        val bluetoothName = Settings.Secure.getString(contentResolver, "bluetooth_name")
        Timber.v("BLUETOOTH NAME: ${bluetoothName}")

        val testButton: Button = findViewById(R.id.testButton)
        testButton.setOnClickListener {

            startActivity(
                StandaloneExperienceHostActivity.makeIntent(
                    applicationContext,
                    "59e8b9d0d4459d00102c2958",
                    null
                )
            )
        }

        // as for FINE location permission, and then tell Rover SDK that we have it!
        // We should not be responsible for telling Rover every boot, however.

        // So should Rover start up monitoring by default when permission appears to be granted, and
        // just need a poke from developer when permission is initially granted.  How should the
        // poke be done?  Perhaps some sort of Permission Manager thingy that would live in Core.

        // in the case where you hav




        makePermissionsAttempt()
    }

    private fun makePermissionsAttempt() {
        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED) {

            // Should we show an explanation?
            if (ActivityCompat.shouldShowRequestPermissionRationale(this,
                    Manifest.permission.ACCESS_FINE_LOCATION)) {

                // Show an explanation to the user *asynchronously* -- don't block
                // this thread waiting for the user's response! After the user
                // sees the explanation, try again to request the permission.

                AlertDialog.Builder(this)
                    .setMessage("Rover Android Test App would like to use your location for Geofences and Beacons.")
                    .setNeutralButton("Got it") { dialogInterface, which ->
                        makePermissionsAttempt()
                    }
            } else {
                // No explanation needed, we can request the permission.
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                    0
                )

                // MY_PERMISSIONS_REQUEST_READ_CONTACTS is an
                // app-defined int constant. The callback method gets the
                // result of the request.
            }
        } else {
            // Permission has already been granted
            readyToStartLocation()
        }
    }

    private fun readyToStartLocation() {
        // now, in the two cases for starting up the location things: custom, and rover SDK
        // managed, as follows.

        // with custom, you have to set up your own:

        // beacons:
        // * intent service that sends result to GoogleLocationReportingServiceInterface
        // * Nearby.getMessagesClient(blah, blah).blah and then eventually .subscribe(pendingIntent).

        // location update:
        // * intent service that sends result to GoogleLocationReportingServiceInterface
        // * fusedLocationProviderClient.requestLocationUpdates pointed to that intent service with a pending intent.

        // geofences:
        // * intent service that sends result to GoogleLocationReportingServiceInterface
        // * subscribe to region updates from RegionsRepository, and on those updates rebuilds geofences list, points them with pending intent to the intent service.

        // OR

        // can make sure you call LocationAssembler with automatic region management and automatic location tracking set to true.
        // and then call here Rover.sharedInstance.permissionsManager.informFineLocationGranted()
        Rover.sharedInstance.permissionsNotifier.permissionGranted(Manifest.permission.ACCESS_FINE_LOCATION)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        val perms = permissions.zip(grantResults.toList()).associate { it }

        if(perms[Manifest.permission.ACCESS_FINE_LOCATION] == PackageManager.PERMISSION_GRANTED) {
            // got permission!
            readyToStartLocation()
        }
    }

    companion object {
        fun makeIntent(context: Context, showNotificationCenter: Boolean): Intent {
            return Intent(context, MainActivity::class.java).apply {
                putExtra("SHOW_NOTIFICATION_CENTER", showNotificationCenter)
            }
        }
    }
}

/**
 * If you want to be able to see the requests made by the Rover SDK to our API in
 * [Stetho's](http://facebook.github.io/stetho/) network inspector, copy this class into your
 * application and set an instance of it on the [AsyncTaskAndHttpUrlConnectionNetworkClient] with
 * [AsyncTaskAndHttpUrlConnectionNetworkClient.registerInterceptor] (DI instructions for
 * users to follow).
 */
class StethoRoverInterceptor : AsyncTaskAndHttpUrlConnectionInterceptor {
    override fun onOpened(httpUrlConnection: HttpURLConnection, requestPath: String, body: ByteArray): AsyncTaskAndHttpUrlConnectionInterception {
        val connManager = StethoURLConnectionManager(requestPath)
        connManager.preConnect(httpUrlConnection, ByteArrayRequestEntity(body))

        return object : AsyncTaskAndHttpUrlConnectionInterception {
            override fun onConnected() {
                connManager.postConnect()
            }

            override fun onError(exception: IOException) {
                connManager.httpExchangeFailed(exception)
            }

            override fun sniffStream(source: InputStream): InputStream =
                connManager.interpretResponseStream(source)
        }
    }
}
