// @ts-nocheck
const { withAndroidManifest, AndroidConfig } = require('@expo/config-plugins');

const SERVICE_NAME = 'com.asterinet.react.bgactions.RNBackgroundActionsTask';
const PKG = 'react-native-background-actions';

const TYPE_TO_PERMISSION = {
    dataSync: 'android.permission.FOREGROUND_SERVICE_DATA_SYNC',
    mediaPlayback: 'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
    phoneCall: 'android.permission.FOREGROUND_SERVICE_PHONE_CALL',
    location: 'android.permission.FOREGROUND_SERVICE_LOCATION',
    connectedDevice: 'android.permission.FOREGROUND_SERVICE_CONNECTED_DEVICE',
    mediaProjection: 'android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION',
    camera: 'android.permission.FOREGROUND_SERVICE_CAMERA',
    microphone: 'android.permission.FOREGROUND_SERVICE_MICROPHONE',
    health: 'android.permission.FOREGROUND_SERVICE_HEALTH',
    remoteMessaging: 'android.permission.FOREGROUND_SERVICE_REMOTE_MESSAGING',
    systemExempted: 'android.permission.FOREGROUND_SERVICE_SYSTEM_EXEMPTED',
    shortService: 'android.permission.FOREGROUND_SERVICE_SHORT_SERVICE',
    specialUse: 'android.permission.FOREGROUND_SERVICE_SPECIAL_USE',
};

const KNOWN_TYPES = Object.keys(TYPE_TO_PERMISSION);

function normalizeTypes(input) {
    let raw;
    if (input == null) raw = ['dataSync'];
    else if (Array.isArray(input)) raw = input;
    else raw = [input];

    const types = [];
    for (const t of raw) {
        if (typeof t !== 'string' || !t.length) continue;
        if (KNOWN_TYPES.indexOf(t) === -1)
            throw new Error(
                `[${PKG}] Unknown foregroundServiceType "${t}". Allowed: ${KNOWN_TYPES.join(', ')}`
            );

        if (types.indexOf(t) === -1) types.push(t);
    }
    if (!types.length) types.push('dataSync');
    return types;
}

function setServiceForegroundType(androidManifest, manifestType) {
    const application =
        androidManifest.manifest.application && androidManifest.manifest.application[0];
    if (!application) return;

    application.service = application.service || [];
    const existing = application.service.find(function(s) {
        return s.$ && s.$['android:name'] === SERVICE_NAME;
    });

    if (existing) existing.$['android:foregroundServiceType'] = manifestType;
    else
        application.service.push({
            $: {
                'android:name': SERVICE_NAME,
                'android:foregroundServiceType': manifestType,
                'android:exported': 'false',
            },
        });
}

const withBackgroundActions = function(config, props) {
    const opts = props || {};
    const types = normalizeTypes(opts.foregroundServiceType);
    // Android merges service-tag foregroundServiceType values via "|".
    const manifestType = types.join('|');
    const permissions = [
        'android.permission.FOREGROUND_SERVICE',
        'android.permission.WAKE_LOCK',
    ].concat(
        types.map(function(t) {
            return TYPE_TO_PERMISSION[t];
        })
    );

    config = AndroidConfig.Permissions.withPermissions(config, permissions);

    return withAndroidManifest(config, function(cfg) {
        setServiceForegroundType(cfg.modResults, manifestType);
        return cfg;
    });
};

module.exports = withBackgroundActions;
module.exports.default = withBackgroundActions;
