import { Platform, AppRegistry } from 'react-native';
import RNBackgroundActions from './RNBackgroundActionsModule';

/**
 * @typedef {{taskName: string,
 *            taskTitle: string,
 *            taskDesc: string,
 *            taskIcon: {name: string, type: string, package?: string},
 *            color?: string,
 *            parameters?: any}} BackgroundTaskOptions
 */
class BackgroundServer {
    constructor() {
        this._runnedTasks = 0;
        this._stopTask = () => {};
        this._isRunning = false;
    }

    /**
     * Returns if the current background task is running.
     *
     * It returns `true` if `start()` has been called and the task has not finished.
     *
     * It returns `false` if `stop()` has been called, **even if the task has not finished**.
     */
    isRunning() {
        return this._isRunning;
    }

    /**
     * @param {(taskData: any) => Promise<void>} task
     * @param {BackgroundTaskOptions} options
     * @returns {Promise<void>}
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
        this._isRunning = true;
    }

    /**
     * @private
     * @param {(taskData: any) => Promise<void>} task
     * @param {any} [parameters]
     */
    _generateTask(task, parameters) {
        const self = this;
        return async () => {
            await new Promise((resolve) => {
                self._stopTask = resolve;
                task(parameters).then(() => self.stop());
            });
        };
    }

    /**
     * @private
     * @param {BackgroundTaskOptions} options
     */
    _normalizeOptions(options) {
        return {
            taskName: options.taskName + this._runnedTasks,
            taskTitle: options.taskTitle,
            taskDesc: options.taskDesc,
            taskIcon: { ...options.taskIcon },
            color: options.color || '#ffffff',
        };
    }

    /**
     * Stops the background task.
     *
     * @returns {Promise<void>}
     */
    async stop() {
        this._stopTask();
        await RNBackgroundActions.stop();
        this._isRunning = false;
    }
}

const backgroundServer = new BackgroundServer();

export default backgroundServer;
