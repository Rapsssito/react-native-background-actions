package com.asterinet.react.bgactions;

import android.content.pm.ServiceInfo;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;

import androidx.annotation.ColorInt;
import androidx.annotation.IdRes;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;

public final class BackgroundTaskOptions {
    private final Bundle extras;

    public BackgroundTaskOptions(@NonNull final Bundle extras) {
        this.extras = extras;
    }

    public BackgroundTaskOptions(@NonNull final ReactContext reactContext, @NonNull final ReadableMap options) {
        // Create extras
        extras = Arguments.toBundle(options);
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
    }

    public Bundle getExtras() {
        return extras;
    }

    public String getTaskTitle() {
        return extras.getString("taskTitle", "");
    }

    public String getTaskDesc() {
        return extras.getString("taskDesc", "");
    }

    @IdRes
    public int getIconInt() {
        return extras.getInt("iconInt");
    }

    @ColorInt
    public int getColor() {
        return extras.getInt("color");
    }

    @Nullable
    public String getLinkingURI() {
        return extras.getString("linkingURI");
    }

    @Nullable
    public Bundle getProgressBar() {
        return extras.getBundle("progressBar");
    }

    /**
     * The notification's buttons, each a Bundle of {@code id} and {@code title}.
     * <p>
     * {@link Arguments#toBundle} stores an array of objects as a serialized
     * ArrayList of Bundles, so it cannot be read back with
     * {@code getParcelableArrayList} — same reason
     * {@code foregroundServiceType} is read as a plain ArrayList above.
     */
    @NonNull
    public ArrayList<Bundle> getActions() {
        final ArrayList<Bundle> actions = new ArrayList<>();
        final Object raw = extras.getSerializable("actions");

        if (!(raw instanceof ArrayList)) {
            return actions;
        }

        for (final Object entry : (ArrayList<?>) raw) {
            if (entry instanceof Bundle) {
                actions.add((Bundle) entry);
            }
        }

        return actions;
    }

    public int getForegroundServiceType() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
            return 0;
        }
        final ArrayList<String> types;
        try {
            types = extras.getStringArrayList("foregroundServiceType");
        } catch (ClassCastException e) {
            // If the stored value is not an ArrayList<String>, treat it as no types.
            return 0;
        }
        if (types == null) {
            return 0;
        }
        int result = 0;
        for (final String type : types) {
            if (type != null && !type.isEmpty()) {
                final int flag = typeToForegroundServiceFlag(type);
                if (flag != 0) {
                    result |= flag;
                }
            }
        }
        return result;
    }

    private int typeToForegroundServiceFlag(@NonNull final String type) {
        switch (type) {
            case "dataSync":
                return ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC;
            case "mediaPlayback":
                return ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK;
            case "phoneCall":
                return ServiceInfo.FOREGROUND_SERVICE_TYPE_PHONE_CALL;
            case "location":
                return ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION;
            case "connectedDevice":
                return ServiceInfo.FOREGROUND_SERVICE_TYPE_CONNECTED_DEVICE;
            case "mediaProjection":
                return ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION;
            case "camera":
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    return ServiceInfo.FOREGROUND_SERVICE_TYPE_CAMERA;
                }
                return 0;
            case "microphone":
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    return ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE;
                }
                return 0;
            case "health":
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                    return ServiceInfo.FOREGROUND_SERVICE_TYPE_HEALTH;
                }
                return 0;
            case "remoteMessaging":
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                    return ServiceInfo.FOREGROUND_SERVICE_TYPE_REMOTE_MESSAGING;
                }
                return 0;
            case "systemExempted":
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                    return ServiceInfo.FOREGROUND_SERVICE_TYPE_SYSTEM_EXEMPTED;
                }
                return 0;
            case "shortService":
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                    return ServiceInfo.FOREGROUND_SERVICE_TYPE_SHORT_SERVICE;
                }
                return 0;
            case "specialUse":
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
                    return ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE;
                }
                return 0;
            default:
                return 0;
        }
    }
}
