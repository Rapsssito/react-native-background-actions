import { NativeModules, Platform, AppRegistry } from 'react-native';

const { RNBackgroundActions } = NativeModules;

class BackgroundTimer {
    constructor() {
        this.runnedTasks = 0;
    }

    /**
     * @param {Promise<void>} task
     * @param {{taskName: string, taskTitle: string, taskDesc: string}} options
     */
    start(task, options) {
        this.runnedTasks++;
        const finalOptions = this.normalizeOptions(options);
        if (Platform.OS === 'android') {
            AppRegistry.registerHeadlessTask(finalOptions.taskName, () => task);
            RNBackgroundActions.start(finalOptions);
        } else {
            RNBackgroundActions.start(finalOptions);
            task();
        }
    }

    /**
     * @param {{taskName: string, taskTitle: string, taskDesc: string}} options
     */
    normalizeOptions(options = {}) {
        return {
            ...options,
            taskName: options.taskName
                ? options.taskName + this.runnedTasks
                : `RNBackgroundActionsTask${this.runnedTasks}`,
            taskTitle: options.taskTitle ? options.taskTitle : 'RNBackgroundActionsTaskTitle',
        };
    }

    /**
     * @returns {void}
     */
    stop() {
        RNBackgroundActions.stop();
    }
}

export default new BackgroundTimer();
