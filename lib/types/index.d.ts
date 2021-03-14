export default backgroundServer;
export type BackgroundTaskOptions = {
    taskName: string;
    taskTitle: string;
    taskDesc: string;
    taskIcon: {
        name: string;
        type: string;
        package?: string;
    };
    color?: string | undefined;
    linkingURI?: string | undefined;
    progressBar?: {
        max: number;
        value: number;
        indeterminate?: boolean | undefined;
    } | undefined;
};
declare const backgroundServer: BackgroundServer;
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
declare class BackgroundServer extends EventEmitter<"expiration", any> {
    /** @private */
    private _runnedTasks;
    /** @private @type {(arg0?: any) => void} */
    private _stopTask;
    /** @private */
    private _isRunning;
    /** @private @type {BackgroundTaskOptions} */
    private _currentOptions;
    /**
     * @private
     */
    private _addListeners;
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
    updateNotification(taskData: {
        taskTitle?: string;
        taskDesc?: string;
        taskIcon?: {
            name: string;
            type: string;
            package?: string;
        };
        color?: string;
        linkingURI?: string;
        progressBar?: {
            max: number;
            value: number;
            indeterminate?: boolean;
        };
    }): Promise<void>;
    /**
     * Returns if the current background task is running.
     *
     * It returns `true` if `start()` has been called and the task has not finished.
     *
     * It returns `false` if `stop()` has been called, **even if the task has not finished**.
     */
    isRunning(): boolean;
    /**
     * @template T
     *
     * @param {(taskData?: T) => Promise<void>} task
     * @param {BackgroundTaskOptions & {parameters?: T}} options
     * @returns {Promise<void>}
     */
    start<T>(task: (taskData?: T | undefined) => Promise<void>, options: {
        taskName: string;
        taskTitle: string;
        taskDesc: string;
        taskIcon: {
            name: string;
            type: string;
            package?: string;
        };
        color?: string | undefined;
        linkingURI?: string | undefined;
        progressBar?: {
            max: number;
            value: number;
            indeterminate?: boolean | undefined;
        } | undefined;
    } & {
        parameters?: T | undefined;
    }): Promise<void>;
    /**
     * @private
     * @template T
     * @param {(taskData?: T) => Promise<void>} task
     * @param {T} [parameters]
     */
    private _generateTask;
    /**
     * @private
     * @param {BackgroundTaskOptions} options
     */
    private _normalizeOptions;
    /**
     * Stops the background task.
     *
     * @returns {Promise<void>}
     */
    stop(): Promise<void>;
}
import EventEmitter from "eventemitter3";
