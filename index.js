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
    async start(task, options) {
        this.runnedTasks++;
        const finalOptions = this.normalizeOptions(options);
        if (Platform.OS === 'android') {
            AppRegistry.registerHeadlessTask(finalOptions.taskName, () => task);
            await RNBackgroundActions.start(finalOptions);
        } else {
            await RNBackgroundActions.start(finalOptions);
            task(finalOptions);
        }
    }

    /**
     * @param {{taskName: string, taskTitle: string, taskDesc: string}} options
     */
    normalizeOptions(options) {
        return {
            ...options,
            taskName: options.taskName + this.runnedTasks,
        };
    }

    async stop() {
        await RNBackgroundActions.stop();
    }
}

export default new BackgroundTimer();
