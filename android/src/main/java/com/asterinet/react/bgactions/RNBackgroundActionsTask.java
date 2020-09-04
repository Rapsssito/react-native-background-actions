package com.asterinet.react.bgactions;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import androidx.annotation.ColorInt;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

final public class RNBackgroundActionsTask extends HeadlessJsTaskService {

    private static final String CHANNEL_ID = "RN_BACKGROUND_ACTIONS_CHANNEL";
    public static final int SERVICE_NOTIFICATION_ID = 92901;

    @NonNull
    public static Notification buildNotification(@NonNull final Context context, @NonNull final String taskTitle, @NonNull final String taskDesc, final int iconInt, @ColorInt int color, @Nullable final String linkingURI) {
        final Intent notificationIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(linkingURI));
        final PendingIntent contentIntent = PendingIntent.getActivity(context, 0, notificationIntent, PendingIntent.FLAG_CANCEL_CURRENT);
        return new NotificationCompat.Builder(context, CHANNEL_ID)
                .setContentTitle(taskTitle)
                .setContentText(taskDesc)
                .setSmallIcon(iconInt)
                .setContentIntent(contentIntent)
                .setOngoing(true)
                .setPriority(NotificationCompat.PRIORITY_MIN)
                .setColor(color)
                .build();
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
        final Bundle extras = intent.getExtras();
        if (extras == null) {
            throw new IllegalArgumentException("Extras cannot be null");
        }
        // Get info
        final String taskTitle = extras.getString("taskTitle", "RNBackgroundActionsTaskTitle");
        final String taskDesc = extras.getString("taskDesc", "RNBackgroundActionsTaskDesc");
        final int iconInt = extras.getInt("iconInt");
        final int color = extras.getInt("color");
        final String linkingURI = extras.getString("linkingURI");
        // Turning into a foreground service
        createNotificationChannel(taskTitle, taskDesc); // Necessary creating channel for API 26+
        // Create the notification
        final Notification notification = buildNotification(this, taskTitle, taskDesc, iconInt, color, linkingURI);
        startForeground(SERVICE_NOTIFICATION_ID, notification);
        return super.onStartCommand(intent, flags, startId);
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
