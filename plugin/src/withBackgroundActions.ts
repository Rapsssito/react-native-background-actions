import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
} from "@expo/config-plugins";

type ForegroundServiceType =
  | "dataSync"
  | "mediaPlayback"
  | "phoneCall"
  | "location"
  | "connectedDevice"
  | "mediaProjection"
  | "camera"
  | "microphone"
  | "health"
  | "remoteMessaging"
  | "systemExempted"
  | "shortService"
  | "specialUse";

export type WithBackgroundActionsProps = {
  /**
   * Foreground service type(s) declared in AndroidManifest.xml. Must match
   * the `foregroundServiceType` array passed to BackgroundService.start().
   *
   * Accepts a single string or an array of strings. Multiple values are
   * merged with "|" (Android allows combining types).
   *
   * Defaults to "dataSync".
   *
   * @see https://developer.android.com/about/versions/14/changes/fgs-types-required
   */
  foregroundServiceType?: ForegroundServiceType | ForegroundServiceType[];
};

const SERVICE_NAME = "com.asterinet.react.bgactions.RNBackgroundActionsTask";
const PKG = "react-native-background-actions";

const TYPE_TO_PERMISSION: Record<ForegroundServiceType, string> = {
  dataSync: "android.permission.FOREGROUND_SERVICE_DATA_SYNC",
  mediaPlayback: "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
  phoneCall: "android.permission.FOREGROUND_SERVICE_PHONE_CALL",
  location: "android.permission.FOREGROUND_SERVICE_LOCATION",
  connectedDevice: "android.permission.FOREGROUND_SERVICE_CONNECTED_DEVICE",
  mediaProjection: "android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION",
  camera: "android.permission.FOREGROUND_SERVICE_CAMERA",
  microphone: "android.permission.FOREGROUND_SERVICE_MICROPHONE",
  health: "android.permission.FOREGROUND_SERVICE_HEALTH",
  remoteMessaging: "android.permission.FOREGROUND_SERVICE_REMOTE_MESSAGING",
  systemExempted: "android.permission.FOREGROUND_SERVICE_SYSTEM_EXEMPTED",
  shortService: "android.permission.FOREGROUND_SERVICE_SHORT_SERVICE",
  specialUse: "android.permission.FOREGROUND_SERVICE_SPECIAL_USE",
};

const KNOWN_TYPES = Object.keys(TYPE_TO_PERMISSION) as ForegroundServiceType[];

function normalizeTypes(
  input: WithBackgroundActionsProps["foregroundServiceType"],
): ForegroundServiceType[] {
  const raw = input == null ? ["dataSync" as const] : Array.isArray(input) ? input : [input];
  const types: ForegroundServiceType[] = [];
  for (const t of raw) {
    if (typeof t !== "string" || !t.length) continue;
    if (!KNOWN_TYPES.includes(t as ForegroundServiceType)) {
      throw new Error(
        `[${PKG}] Unknown foregroundServiceType "${t}". Allowed: ${KNOWN_TYPES.join(", ")}`,
      );
    }
    if (!types.includes(t as ForegroundServiceType))
      types.push(t as ForegroundServiceType);
  }
  if (!types.length) types.push("dataSync");
  return types;
}

function setServiceForegroundType(
  androidManifest: AndroidConfig.Manifest.AndroidManifest,
  manifestType: string,
) {
  const application = androidManifest.manifest.application?.[0];
  if (!application) return;

  application.service = application.service || [];
  const existing = application.service.find(
    (s) => s.$?.["android:name"] === SERVICE_NAME,
  );

  if (existing) {
    existing.$["android:foregroundServiceType"] = manifestType;
  } else {
    application.service.push({
      $: {
        "android:name": SERVICE_NAME,
        "android:foregroundServiceType": manifestType,
        "android:exported": "false",
      },
    });
  }
}

const withBackgroundActions: ConfigPlugin<WithBackgroundActionsProps | void> = (
  config,
  props,
) => {
  const types = normalizeTypes(props?.foregroundServiceType);
  const manifestType = types.join("|");
  const permissions = [
    "android.permission.FOREGROUND_SERVICE",
    "android.permission.WAKE_LOCK",
    ...types.map((t) => TYPE_TO_PERMISSION[t]),
  ];

  config = AndroidConfig.Permissions.withPermissions(config, permissions);

  return withAndroidManifest(config, (cfg) => {
    setServiceForegroundType(cfg.modResults, manifestType);
    return cfg;
  });
};

export default withBackgroundActions;
