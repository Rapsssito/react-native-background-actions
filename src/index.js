import { Platform, AppRegistry } from 'react-native';
import { RNBackgroundActions, nativeEventEmitter } from './RNBackgroundActionsModule';
import EventEmitter from 'eventemitter3';

/**
 * @typedef {{taskName: string,
 *            taskTitle: string,
 *            taskDesc: string,
 *            taskIcon: {name: string, type: string, package?: string},
 *            color?: string
 *            linkingURI?: string,
 *            progressBar?: {max: number, value: number, indeterminate?: boolean}
 *            }} BackgroundTaskOptions
 * @extends EventEmitter<'expiration',any>
 */
class BackgroundServer extends EventEmitter {
    constructor() {
        super();
        /** @private */
        this._runnedTasks = 0;
        /** @private @type {(arg0?: any) => void} */
        this._stopTask = () => {};
        /** @private */
        this._isRunning = false;
        /** @private @type {BackgroundTaskOptions} */
        this._currentOptions;
        this._addListeners();
    }

    /**
     * @private
     */
    _addListeners() {
        nativeEventEmitter.addListener('expiration', () => this.emit('expiration'));
    }

    /**
     * **ANDROID ONLY**
     *
     * Updates the task notification.
     *
     * *On iOS this method will return immediately*
     *
     * @param {{taskTitle?: string,
     *          taskDesc?: string,
     *          taskIcon?: {name: string, type: string, package?: string},
     *          color?: string,
     *          linkingURI?: string,
     *          progressBar?: {max: number, value: number, indeterminate?: boolean}}} taskData
     */
    async updateNotification(taskData) {
        if (Platform.OS !== 'android') return;
        if (!this.isRunning())
            throw new Error('A BackgroundAction must be running before updating the notification');
        this._currentOptions = this._normalizeOptions({ ...this._currentOptions, ...taskData });
        await RNBackgroundActions.updateNotification(this._currentOptions);
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
     * @template T
     *
     * @param {(taskData?: T) => Promise<void>} task
     * @param {BackgroundTaskOptions & {parameters?: T}} options
     * @returns {Promise<void>}
     */
    async start(task, options) {
        this._runnedTasks++;
        this._currentOptions = this._normalizeOptions(options);
        const finalTask = this._generateTask(task, options.parameters);
        if (Platform.OS === 'android') {
            AppRegistry.registerHeadlessTask(this._currentOptions.taskName, () => finalTask);
            await RNBackgroundActions.start(this._currentOptions);
            this._isRunning = true;
        } else {
            await RNBackgroundActions.start(this._currentOptions);
            this._isRunning = true;
            finalTask();
        }
    }

    /**
     * @private
     * @template T
     * @param {(taskData?: T) => Promise<void>} task
     * @param {T} [parameters]
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
            linkingURI: options.linkingURI,
            progressBar: options.progressBar,
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
