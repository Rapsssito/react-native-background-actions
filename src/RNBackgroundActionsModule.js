import { NativeEventEmitter, NativeModules } from 'react-native';

const { RNBackgroundActions } = NativeModules;

const nativeEventEmitter = new NativeEventEmitter(RNBackgroundActions);

export { RNBackgroundActions, nativeEventEmitter };
