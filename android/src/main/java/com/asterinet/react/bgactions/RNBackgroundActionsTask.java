package com.asterinet.react.bgactions;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.ServiceCompat;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.modules.core.DeviceEventManagerModule;

final public class RNBackgroundActionsTask extends HeadlessJsTaskService {

    private static final String TAG = "RNBackgroundActions";

    public static final int SERVICE_NOTIFICATION_ID = 92901;
    private static final String CHANNEL_ID = "RN_BACKGROUND_ACTIONS_CHANNEL";
    private static final String TAG = "RNBackgroundActionsTask";

    // Guards against Service#callOnTimeout(), which calls both onTimeout(int) and
    // onTimeout(int, int) for a single OS timeout on 'shortService'-typed tasks (API 34+),
    // so the 'expiration' event isn't emitted twice for one real timeout.
    private boolean hasTimedOut = false;

    @SuppressLint("UnspecifiedImmutableFlag")
    @NonNull
    public static Notification buildNotification(@NonNull Context context, @NonNull final BackgroundTaskOptions bgOptions) {
        // Get info
        final String taskTitle = bgOptions.getTaskTitle();
        final String taskDesc = bgOptions.getTaskDesc();
        final int iconInt = bgOptions.getIconInt();
        final int color = bgOptions.getColor();
        final String linkingURI = bgOptions.getLinkingURI();
        Intent notificationIntent;
        if (linkingURI != null) {
            notificationIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(linkingURI));
        } else {
            //as RN works on single activity architecture - we don't need to find current activity on behalf of react context
            notificationIntent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
            if (notificationIntent == null) {
                notificationIntent = new Intent(Intent.ACTION_MAIN)
                        .addCategory(Intent.CATEGORY_LAUNCHER)
                        .setPackage(context.getPackageName());
            }
        }
        final PendingIntent contentIntent;
        int pendingIntentFlags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            // IMMUTABLE is available and recommended from API 23+
            pendingIntentFlags |= PendingIntent.FLAG_IMMUTABLE;
        }
        contentIntent = PendingIntent.getActivity(context, 0, notificationIntent, pendingIntentFlags);
        final NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setContentTitle(taskTitle)
                .setContentText(taskDesc)
                .setSmallIcon(iconInt)
                .setContentIntent(contentIntent)
                .setOngoing(true)
                .setPriority(NotificationCompat.PRIORITY_MIN)
                .setColor(color);

        final Bundle progressBarBundle = bgOptions.getProgressBar();
        if (progressBarBundle != null) {
            final int progressMax = (int) Math.floor(progressBarBundle.getDouble("max"));
            final int progressCurrent = (int) Math.floor(progressBarBundle.getDouble("value"));
            final boolean progressIndeterminate = progressBarBundle.getBoolean("indeterminate");
            builder.setProgress(progressMax, progressCurrent, progressIndeterminate);
        }
        return builder.build();
    }

    @Override
    protected @Nullable
    HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        final Bundle extras = intent.getExtras();
        if (extras != null) {
            return new HeadlessJsTaskConfig(extras.getString("taskName"), Arguments.fromBundle(extras), 0, true);
        }
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // A new start command means this service instance is (re)beginning a task, so any
        // previous timeout no longer applies (the instance may have been reused across a
        // stop/restart race instead of being destroyed).
        hasTimedOut = false;
        if (intent == null) {
            stopSelf(startId);
            return START_NOT_STICKY;
        }
        final Bundle extras = intent.getExtras();
        if (extras == null) {
            // Nothing to run without task options: stop instead of crashing the app
            Log.w(TAG, "onStartCommand: intent has no extras, stopping service");
            stopSelf(startId);
            return START_NOT_STICKY;
        }
        final BackgroundTaskOptions bgOptions = new BackgroundTaskOptions(extras);
        createNotificationChannel(bgOptions.getTaskTitle(), bgOptions.getTaskDesc()); // Necessary creating channel for API 26+
        // Create the notification
        final Notification notification = buildNotification(this, bgOptions);

        int foregroundServiceType = bgOptions.getForegroundServiceType();
        if (foregroundServiceType == 0 && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            // No type passed from JS: use the types declared in AndroidManifest.xml (4.0.x behavior).
            // Passing FOREGROUND_SERVICE_TYPE_NONE crashes on Android 14+ and drops the manifest type on Android 10-13.
            foregroundServiceType = ServiceInfo.FOREGROUND_SERVICE_TYPE_MANIFEST;
        }
        try {
            ServiceCompat.startForeground(
                this,
                SERVICE_NOTIFICATION_ID,
                notification,
                foregroundServiceType
            );
        } catch (RuntimeException e) {
            final boolean startNotAllowed = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
                    && e instanceof android.app.ForegroundServiceStartNotAllowedException;
            // Android 12+: not allowed to start foreground service from background.
            // Android 14+: SecurityException when the runtime permission required by the
            // foreground service type (e.g. location) is missing or was revoked.
            if (startNotAllowed || e instanceof SecurityException) {
                Log.w(TAG, "startForeground failed, stopping service", e);
                stopSelf(startId);
                return START_NOT_STICKY;
            }
            throw e;
        }
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onTimeout(int startId) {
        super.onTimeout(startId);
        onOsTimeout(startId);
    }

    @Override
    public void onTimeout(int startId, int fgsType) {
        super.onTimeout(startId, fgsType);
        onOsTimeout(startId);
    }

    /**
     * Called when the OS forcibly stops this foreground service because it ran longer than the
     * type-specific time limit (API 34+). The JS side has no other way to learn that the service
     * was killed, so it must be notified before the service actually stops.
     */
    private void onOsTimeout(int startId) {
        if (!hasTimedOut) {
            hasTimedOut = true;
            emitExpirationEvent();
        }
        stopSelf(startId);
    }

    private void emitExpirationEvent() {
        try {
            final ReactContext reactContext = getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
            if (reactContext != null) {
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("expiration", null);
            }
        } catch (RuntimeException e) {
            // The React instance can be mid-teardown when the OS forces this timeout (e.g. the
            // catalyst instance being destroyed, or a New Architecture host that doesn't support
            // ReactNativeHost). Failing to notify JS must never prevent stopSelf() below.
            Log.w(TAG, "Failed to notify JS about the foreground service timeout", e);
        }
    }

    private void createNotificationChannel(@NonNull final String taskTitle, @NonNull final String taskDesc) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            final int importance = NotificationManager.IMPORTANCE_LOW;
            final NotificationChannel channel = new NotificationChannel(CHANNEL_ID, taskTitle, importance);
            channel.setDescription(taskDesc);
            final NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
}
