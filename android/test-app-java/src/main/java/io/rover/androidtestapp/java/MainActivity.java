package io.rover.androidtestapp.java;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import io.rover.experiences.ui.containers.StandaloneExperienceHostActivity;
import io.rover.experiences.ui.navigation.ExperienceExternalNavigationEvent;

public class MainActivity extends AppCompatActivity {

    private TextView mTextMessage;

    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            switch (item.getItemId()) {
                case R.id.navigation_home:
                    mTextMessage.setText(R.string.title_home);
                    return true;
                case R.id.navigation_dashboard:
                    mTextMessage.setText(R.string.title_dashboard);
                    return true;
                case R.id.navigation_notifications:
                    mTextMessage.setText(R.string.title_notifications);
                    return true;
            }
            return false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mTextMessage = findViewById(R.id.message);
        BottomNavigationView navigation = findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);

        Button testButton = findViewById(R.id.testButton);

        testButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(
                    StandaloneExperienceHostActivity.makeIntent(
                            getApplicationContext(),
                            "59e8b9d0d4459d00102c2958",
                            MyCustomExperienceActivity.class
                    )
                );
            }
        });
    }

    static public class MyCustomExperienceActivity extends StandaloneExperienceHostActivity {
        @Override
        protected void dispatchExternalNavigationEvent(ExperienceExternalNavigationEvent externalNavigationEvent) {
            if(externalNavigationEvent instanceof ExperienceExternalNavigationEvent.Custom) {
                Snackbar.make(getExperiencesView(), "Log in first mate", Snackbar.LENGTH_LONG).show();
            } else {
                super.dispatchExternalNavigationEvent(externalNavigationEvent);
            }
        }
    }
}
