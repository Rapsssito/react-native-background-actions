package com.asterinet.react.bgactions;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

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
    public void start(@NonNull final ReadableMap options, @NonNull final Promise promise) {
        long runId = ServiceStartGuard.NO_RUN_ID;
        try {
            // Stop any other intent
            if (currentServiceIntent != null) {
                stopCurrentService();
            }
            // Create the service
            currentServiceIntent = new Intent(reactContext, RNBackgroundActionsTask.class);
            // Get the task info from the options
            final BackgroundTaskOptions bgOptions = new BackgroundTaskOptions(reactContext, options);
            currentServiceIntent.putExtras(bgOptions.getExtras());
            runId = ServiceStartGuard.registerStart();
            currentServiceIntent.putExtra(ServiceStartGuard.EXTRA_RUN_ID, runId);
            // Start the task
            // startForegroundService on Android 8+ (API 26+), startService below
            ContextCompat.startForegroundService(reactContext, currentServiceIntent);
            promise.resolve(null);
        } catch (Exception e) {
            if (runId != ServiceStartGuard.NO_RUN_ID) {
                ServiceStartGuard.onStartHandled(runId);
            }
            currentServiceIntent = null;
            promise.reject(e);
        }
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void stop(@NonNull final Promise promise) {
        if (currentServiceIntent != null) {
            stopCurrentService();
            currentServiceIntent = null;
        }
        promise.resolve(null);
    }

    private void stopCurrentService() {
        final long runId = currentServiceIntent.getLongExtra(ServiceStartGuard.EXTRA_RUN_ID, ServiceStartGuard.NO_RUN_ID);
        // If the service has not called startForeground() yet, stopping it now would crash the app
        // (ForegroundServiceDidNotStartInTimeException). It stops itself right after startForeground().
        if (ServiceStartGuard.requestStop(runId)) {
            reactContext.stopService(currentServiceIntent);
        }
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void updateNotification(@NonNull final ReadableMap options, @NonNull final Promise promise) {
        // Get the task info from the options
        try {
            final BackgroundTaskOptions bgOptions = new BackgroundTaskOptions(reactContext, options);
            final Notification notification = RNBackgroundActionsTask.buildNotification(reactContext, bgOptions);
            final NotificationManager notificationManager = (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.notify(RNBackgroundActionsTask.SERVICE_NOTIFICATION_ID, notification);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
        promise.resolve(null);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void addListener(String eventName) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void removeListeners(Integer count) {
        // Keep: Required for RN built in Event Emitter Calls.
    }
}
