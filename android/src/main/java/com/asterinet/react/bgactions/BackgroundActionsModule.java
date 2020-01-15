package com.asterinet.react.bgactions;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

@SuppressWarnings("WeakerAccess")
public class BackgroundActionsModule extends ReactContextBaseJavaModule {

    private final ReactContext reactContext;
    private Intent currentServiceIntent;

    private static final String TAG = "RNBackgroundActions";

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
        reactContext.stopService(currentServiceIntent);
    }

    // RNBackgroundActionsTask

    final private class RNBackgroundActionsTask extends HeadlessJsTaskService {

        private static final String CHANNEL_ID = "RN_BACKGROUND_ACTIONS_CHANNEL";
        private static final int SERVICE_NOTIFICATION_ID = 92901;

        @Override
        protected @Nullable
        HeadlessJsTaskConfig getTaskConfig(Intent intent) {
            Bundle extras = intent.getExtras();
            if (extras != null) {
                return new HeadlessJsTaskConfig(extras.getString("taskName"), null, 0, true);
            }
            return null;
        }

        @Override
        public int onStartCommand(Intent intent, int flags, int startId) {
            Bundle extras = intent.getExtras();
            // Turning into a foreground service
            createNotificationChannel(extras); // Necessary creating channel for API 26+
            // Create the notification
            final Activity activity = reactContext.getCurrentActivity();
            if (activity == null) {
                throw new IllegalStateException("No MainActivity");
            }
            final Intent notificationIntent = new Intent(this, activity.getClass());
            final PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);
            final Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                    .setContentTitle(extras != null ? extras.getString("taskTitle", "RNBackgroundActionTask") : "RNBackgroundActionTask")
                    .setContentText(extras != null ? extras.getString("taskDesc", "RNBackgroundActionDesc") : "RNBackgroundActionDesc")
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentIntent(contentIntent)
                    .setOngoing(true)
                    .setPriority(NotificationCompat.PRIORITY_LOW)
                    .build();
            startForeground(SERVICE_NOTIFICATION_ID, notification);
            return START_STICKY;
        }


        private void createNotificationChannel(@Nullable Bundle extras) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                final int importance = NotificationManager.IMPORTANCE_LOW;
                final NotificationChannel channel = new NotificationChannel(CHANNEL_ID, extras != null ? extras.getString("taskTitle", "RNBackgroundActionTask") : "RNBackgroundActionTask", importance);
                channel.setDescription(extras != null ? extras.getString("taskDesc", "RNBackgroundActionDesc") : "RNBackgroundActionDesc");
                final NotificationManager notificationManager = getSystemService(NotificationManager.class);
                notificationManager.createNotificationChannel(channel);
            }
        }
    }
}
