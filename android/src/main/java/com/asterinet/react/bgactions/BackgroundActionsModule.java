package com.asterinet.react.bgactions;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

@SuppressWarnings("WeakerAccess")
public class BackgroundActionsModule extends ReactContextBaseJavaModule {

    private final ReactContext reactContext;

    public BackgroundActionsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNBackgroundActions";
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void start(final Promise promise) {
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void stop(final Promise promise) {
    }
}
