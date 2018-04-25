package io.rover.androidtestapp.gcm

import android.os.Bundle
import android.provider.Settings
import android.support.design.widget.BottomNavigationView
import android.support.v7.app.AppCompatActivity
import android.widget.Button
import com.facebook.stetho.urlconnection.ByteArrayRequestEntity
import com.facebook.stetho.urlconnection.StethoURLConnectionManager
import io.rover.rover.core.data.http.AsyncTaskAndHttpUrlConnectionInterception
import io.rover.rover.core.data.http.AsyncTaskAndHttpUrlConnectionInterceptor
import io.rover.rover.core.data.http.AsyncTaskAndHttpUrlConnectionNetworkClient
import io.rover.rover.experiences.ui.containers.StandaloneExperienceHostActivity
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
                return@OnNavigationItemSelectedListener true
            }
            R.id.navigation_dashboard -> {
                message.setText(R.string.title_dashboard)
                return@OnNavigationItemSelectedListener true
            }
            R.id.navigation_notifications -> {
                message.setText(R.string.title_notifications)
                return@OnNavigationItemSelectedListener true
            }
        }
        false
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener)

        val bluetoothName = Settings.Secure.getString(contentResolver, "bluetooth_name")
        Timber.v("BLUETOOTH NAME: ${bluetoothName}")

        val testButton: Button = findViewById(R.id.testButton)
        testButton.setOnClickListener {

            startActivity(
                StandaloneExperienceHostActivity.makeIntent(
                    applicationContext,
                    "59e8b9d0d4459d00102c2958"
                )
            )


            // demoExperienceView.viewModel = experienceViewModel

//            dataPlugin.sendEventsTask(
//                listOf(
//                    Event(
//                        hashMapOf(
//                            Pair("a key", "hi.")
//                        ),
//                        "I am event",
//                        Date(),
//                        UUID.randomUUID()
//                    )
//                ),
//                Context(
//                    null, null, null, null, null, null, null, null, null, null, null, null, null,
//                    null, null, null, null, null, null, null, null, null, null, null
//                ), null
//            ) { result ->
//                when(result) {
//                    is NetworkResult.Success -> log.e("Sent successfully!")
//                    is NetworkResult.Error -> log.e("Failed: ${result.throwable.message}")
//                }
//            }.resume()
//
//            dataPlugin.fetchStateTask { result ->
//                when(result) {
//                    is NetworkResult.Success -> log.e("DeviceState fetched successfully: ${result.response}")
//                    is NetworkResult.Error -> log.e("Failed to fetch device: ${result.throwable.message}")
//                }
//            }.resume()
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
