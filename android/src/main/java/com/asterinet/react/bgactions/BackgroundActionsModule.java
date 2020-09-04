package com.asterinet.react.bgactions;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
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
        // Stop any other intent
        if (currentServiceIntent != null) reactContext.stopService(currentServiceIntent);
        // Create the service
        currentServiceIntent = new Intent(reactContext, RNBackgroundActionsTask.class);
        // Get the task info from the options
        try {
            final Bundle extras = getExtrasFromOptions(options);
            currentServiceIntent.putExtras(extras);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
        // Start the task
        reactContext.startService(currentServiceIntent);
        promise.resolve(null);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void stop(@NonNull final Promise promise) {
        if (currentServiceIntent != null)
            reactContext.stopService(currentServiceIntent);
        promise.resolve(null);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void updateNotification(@NonNull final ReadableMap options, @NonNull final Promise promise) {
        // Get the task info from the options
        try {
            final Bundle extras = getExtrasFromOptions(options);
            // Get info
            final String taskTitle = extras.getString("taskTitle", "RNBackgroundActionsTaskTitle");
            final String taskDesc = extras.getString("taskDesc", "RNBackgroundActionsTaskDesc");
            final int iconInt = extras.getInt("iconInt");
            final int color = extras.getInt("color");
            final String linkingURI = extras.getString("linkingURI");
            final Notification notification = RNBackgroundActionsTask.buildNotification(reactContext, taskTitle, taskDesc, iconInt, color, linkingURI);
            final NotificationManager notificationManager = (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.notify(RNBackgroundActionsTask.SERVICE_NOTIFICATION_ID, notification);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
        promise.resolve(null);
    }

    @NonNull
    private Bundle getExtrasFromOptions(@NonNull final ReadableMap options) {
        // Create extras
        final Bundle extras = Arguments.toBundle(options);
        if (extras == null)
            throw new IllegalArgumentException("Could not convert arguments to bundle");
        // Get taskTitle
        try {
            if (options.getString("taskTitle") == null)
                throw new IllegalArgumentException();
        } catch (Exception e) {
            throw new IllegalArgumentException("Task title cannot be null");
        }
        // Get taskDesc
        try {
            if (options.getString("taskDesc") == null)
                throw new IllegalArgumentException();
        } catch (Exception e) {
            throw new IllegalArgumentException("Task description cannot be null");
        }
        // Get iconInt
        try {
            final ReadableMap iconMap = options.getMap("taskIcon");
            if (iconMap == null)
                throw new IllegalArgumentException();
            final String iconName = iconMap.getString("name");
            final String iconType = iconMap.getString("type");
            String iconPackage;
            try {
                iconPackage = iconMap.getString("package");
                if (iconPackage == null)
                    throw new IllegalArgumentException();
            } catch (Exception e) {
                // Get the current package as default
                iconPackage = reactContext.getPackageName();
            }
            final int iconInt = reactContext.getResources().getIdentifier(iconName, iconType, iconPackage);
            extras.putInt("iconInt", iconInt);
            if (iconInt == 0)
                throw new IllegalArgumentException();
        } catch (Exception e) {
            throw new IllegalArgumentException("Task icon not found");
        }
        // Get color
        try {
            final String color = options.getString("color");
            extras.putInt("color", Color.parseColor(color));
        } catch (Exception e) {
            extras.putInt("color", Color.parseColor("#ffffff"));
        }
        // Get linkingURI
        try {
            final String linkingURI = options.getString("linkingURI");
            extras.putString("linkingURI", linkingURI);
        } catch (Exception e) {
            extras.putString("linkingURI", null);
        }
        return extras;
    }
}
