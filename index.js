import { NativeModules } from 'react-native';

const { RNBackgroundTimer } = NativeModules;

class BackgroundTimer {
    constructor() {}

    start() {
        return RNBackgroundTimer.start();
    }

    stop() {
        return RNBackgroundTimer.stop();
    }
}

export default new BackgroundTimer();
