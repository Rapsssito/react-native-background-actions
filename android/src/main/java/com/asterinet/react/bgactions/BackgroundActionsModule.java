package com.asterinet.react.bgactions;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

@SuppressWarnings("WeakerAccess")
public class BackgroundActionsModule extends ReactContextBaseJavaModule {

    private static final String TAG = "RNBackgroundActions";

    private final ReactContext reactContext;

    private Intent currentServiceIntent;

    /** Emitted to JS when a notification button is pressed. */
    private static final String ACTION_EVENT_NAME = "notificationAction";

    /**
     * Registered at runtime rather than in the manifest: the notification only
     * exists while the service — and therefore the process — is alive, so there is
     * never a press to receive with no receiver registered, and a manifest receiver
     * would have to be exported.
     */
    private final BroadcastReceiver actionReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            final String actionId = intent.getStringExtra(RNBackgroundActionsTask.EXTRA_ACTION_ID);
            if (actionId == null) {
                return;
            }

            final WritableMap params = Arguments.createMap();
            params.putString("id", actionId);

            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(ACTION_EVENT_NAME, params);
        }
    };

    private boolean isReceiverRegistered = false;

    public BackgroundActionsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        // NOT_EXPORTED is mandatory from API 34; without the flag this throws.
        ContextCompat.registerReceiver(
                reactContext,
                actionReceiver,
                new IntentFilter(RNBackgroundActionsTask.ACTION_BUTTON_INTENT),
                ContextCompat.RECEIVER_NOT_EXPORTED
        );
        isReceiverRegistered = true;
    }

    /** A JS reload builds a new module; without this each one leaks a receiver. */
    @Override
    public void invalidate() {
        if (isReceiverRegistered) {
            try {
                reactContext.unregisterReceiver(actionReceiver);
            } catch (IllegalArgumentException e) {
                // Already gone with the context.
            }
            isReceiverRegistered = false;
        }
        super.invalidate();
    }

    @NonNull
    @Override
    public String getName() {
        return TAG;
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void start(@NonNull final ReadableMap options, @NonNull final Promise promise) {
        try {
            // Stop any other intent
            if (currentServiceIntent != null) {
                reactContext.stopService(currentServiceIntent);
            }
            // Create the service
            currentServiceIntent = new Intent(reactContext, RNBackgroundActionsTask.class);
            // Get the task info from the options
            final BackgroundTaskOptions bgOptions = new BackgroundTaskOptions(reactContext, options);
            currentServiceIntent.putExtras(bgOptions.getExtras());
            // Start the task
            // startForegroundService on Android 8+ (API 26+), startService below
            ContextCompat.startForegroundService(reactContext, currentServiceIntent);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void stop(@NonNull final Promise promise) {
        if (currentServiceIntent != null) {
            reactContext.stopService(currentServiceIntent);
            currentServiceIntent = null;
        }
        promise.resolve(null);
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
