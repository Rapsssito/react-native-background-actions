import { NativeModules, Platform, AppRegistry } from 'react-native';

const { RNBackgroundActions } = NativeModules;

/**
 * @typedef {{taskName: string,
 *            taskTitle: string,
 *            taskDesc: string,
 *            taskIcon: {name: string, type: string, package?: string},
 *            color?: string,
 *            parameters?: any}} BackgroundTaskOptions
 */
class BackgroundTimer {
    constructor() {
        this._runnedTasks = 0;
        this._stopTask = () => {};
    }

    /**
     * @param {(taskData: any) => Promise<void>} task
     * @param {BackgroundTaskOptions} options
     */
    async start(task, options) {
        this._runnedTasks++;
        const finalOptions = this._normalizeOptions(options);
        const finalTask = this._generateTask(task, options.parameters);
        if (Platform.OS === 'android') {
            AppRegistry.registerHeadlessTask(finalOptions.taskName, () => finalTask);
            await RNBackgroundActions.start(finalOptions);
        } else {
            await RNBackgroundActions.start(finalOptions);
            finalTask();
        }
    }

    /**
     * @param {(taskData: any) => Promise<void>} task
     * @param {any} [parameters]
     */
    _generateTask(task, parameters) {
        const self = this;
        return async () => {
            await new Promise((resolve) => {
                self._stopTask = resolve;
                task(parameters).then(() => resolve());
            });
        };
    }

    /**
     * @param {BackgroundTaskOptions} options
     */
    _normalizeOptions(options) {
        return {
            ...options,
            taskName: options.taskName + this._runnedTasks,
        };
    }

    async stop() {
        this._stopTask();
        await RNBackgroundActions.stop();
    }
}

export default new BackgroundTimer();
