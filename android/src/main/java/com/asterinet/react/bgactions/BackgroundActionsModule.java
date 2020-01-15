package com.asterinet.react.bgactions;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import androidx.annotation.NonNull;

@SuppressWarnings("WeakerAccess")
public class BackgroundActionsModule extends ReactContextBaseJavaModule {

    private static final String TAG = "RNBackgroundActions";

    private final ReactContext reactContext;

    private Intent currentServiceIntent;

    public BackgroundActionsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return TAG;
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void start(@NonNull final ReadableMap options) {
        // Stop any other intent
        if (currentServiceIntent != null) reactContext.stopService(currentServiceIntent);
        // Create the service
        currentServiceIntent = new Intent(reactContext, RNBackgroundActionsTask.class);
        // Add the task info
        Bundle gotOptions = Arguments.toBundle(options);
        if (gotOptions != null)
            currentServiceIntent.putExtras(gotOptions);
        // Start the task
        reactContext.startService(currentServiceIntent);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void stop() {
        if (currentServiceIntent != null)
            reactContext.stopService(currentServiceIntent);
    }
}
