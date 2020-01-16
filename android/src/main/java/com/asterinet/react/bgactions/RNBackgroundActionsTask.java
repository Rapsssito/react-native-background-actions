package com.asterinet.react.bgactions;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

final public class RNBackgroundActionsTask extends HeadlessJsTaskService {

    private static final String CHANNEL_ID = "RN_BACKGROUND_ACTIONS_CHANNEL";
    private static final int SERVICE_NOTIFICATION_ID = 92901;

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
        final Bundle extras = intent.getExtras();
        // Turning into a foreground service
        createNotificationChannel(extras); // Necessary creating channel for API 26+
        // Create the notification
        final Intent notificationIntent = new Intent(this, ReactActivity.class);
        final PendingIntent contentIntent = PendingIntent.getActivity(this, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        final Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(extras != null ? extras.getString("taskTitle", "RNBackgroundActionTask") : "RNBackgroundActionTask")
                .setContentText(extras != null ? extras.getString("taskDesc", "RNBackgroundActionDesc") : "RNBackgroundActionDesc")
                .setSmallIcon(getResources().getIdentifier("ic_launcher", "mipmap", getPackageName()))
                .setContentIntent(contentIntent)
                .setOngoing(true)
                .setPriority(NotificationCompat.PRIORITY_MIN)
                .build();
        startForeground(SERVICE_NOTIFICATION_ID, notification);
        return super.onStartCommand(intent, flags, startId);
        // return START_STICKY;
    }


    private void createNotificationChannel(@Nullable final Bundle extras) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            final int importance = NotificationManager.IMPORTANCE_LOW;
            final NotificationChannel channel = new NotificationChannel(CHANNEL_ID, extras != null ? extras.getString("taskTitle", "RNBackgroundActionTask") : "RNBackgroundActionTask", importance);
            channel.setDescription(extras != null ? extras.getString("taskDesc", "RNBackgroundActionDesc") : "RNBackgroundActionDesc");
            final NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
}
