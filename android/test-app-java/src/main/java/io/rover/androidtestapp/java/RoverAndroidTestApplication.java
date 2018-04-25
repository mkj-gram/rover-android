package io.rover.androidtestapp.java;

import android.app.Application;
import android.graphics.Color;

import com.facebook.stetho.Stetho;

import io.rover.rover.Rover;
import io.rover.rover.core.CoreAssembler;
import timber.log.Timber;

public class RoverAndroidTestApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        Stetho.initializeWithDefaults(this);

        Rover.installSaneGlobalHttpCache(this);

        if(BuildConfig.DEBUG) {
            Timber.plant(new Timber.DebugTree());
        }

        Rover.initialize(
                new CoreAssembler("6c546189dc45df1293bddc18c0b54786", this, "https://api.rover.io", Color.RED)
        );
    }
}
