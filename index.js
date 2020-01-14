import { NativeModules } from 'react-native';

const { RNBackgroundActions } = NativeModules;

class BackgroundTimer {
    constructor() {}

    start() {
        return RNBackgroundActions.start();
    }

    stop() {
        return RNBackgroundActions.stop();
    }
}

export default new BackgroundTimer();
