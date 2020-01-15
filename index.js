import { NativeModules, Platform, AppRegistry } from 'react-native';

const { RNBackgroundActions } = NativeModules;

class BackgroundTimer {
    /**
     * @param {{taskName: string, taskTitle: string, taskDesc: string}} options
     */
    static normalizeOptions(options) {
        return {
            ...options,
            taskName: options.taskName ? options.taskName : 'RNBackgroundActionsTask',
            taskTitle: options.taskTitle ? options.taskTitle : 'RNBackgroundActionsTaskTile',
        };
    }

    constructor() {}

    /**
     * @param {Promise<void>} task
     * @param {{taskName: string, taskTitle: string, taskDesc: string}} options
     */
    start(task, options) {
        // Check if the task is a promise
        if (typeof task.then !== 'function') throw Error('The task must be a promise');
        const finalOptions = BackgroundTimer.normalizeOptions(options);
        if (Platform.OS === 'android') {
            AppRegistry.registerHeadlessTask(finalOptions.taskName, () => task);
            RNBackgroundActions.start(finalOptions);
        } else {
            RNBackgroundActions.start(finalOptions);
            task();
        }
    }

    /**
     * @returns {void}
     */
    stop() {
        RNBackgroundActions.stop();
    }
}

export default new BackgroundTimer();
