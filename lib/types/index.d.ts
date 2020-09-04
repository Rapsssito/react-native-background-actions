export default backgroundServer;
export type BackgroundTaskOptions = {
    taskName: string;
    taskTitle: string;
    taskDesc: string;
    taskIcon: {
        name: string;
        type: string;
        package?: string | undefined;
    };
    color?: string | undefined;
    linkingURI?: string | undefined;
};
declare const backgroundServer: BackgroundServer;
/**
 * @typedef {{taskName: string,
 *            taskTitle: string,
 *            taskDesc: string,
 *            taskIcon: {name: string, type: string, package?: string},
 *            color?: string
 *            linkingURI?: string}} BackgroundTaskOptions
 */
declare class BackgroundServer {
    /** @private */
    private _runnedTasks;
    /** @private */
    private _stopTask;
    /** @private */
    private _isRunning;
    /** @private @type {BackgroundTaskOptions} */
    private _currentOptions;
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
     *          linkingURI?: string}} taskData
     */
    async updateNotification(taskData: {
        taskTitle?: string | undefined;
        taskDesc?: string | undefined;
        taskIcon?: {
            name: string;
            type: string;
            package?: string | undefined;
        } | undefined;
        color?: string | undefined;
        linkingURI?: string | undefined;
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
     * @param {(taskData: any) => Promise<void>} task
     * @param {BackgroundTaskOptions & {parameters?: any}} options
     * @returns {Promise<void>}
     */
    async start(task: (taskData: any) => Promise<void>, options: {
        taskName: string;
        taskTitle: string;
        taskDesc: string;
        taskIcon: {
            name: string;
            type: string;
            package?: string | undefined;
        };
        color?: string | undefined;
        linkingURI?: string | undefined;
    } & {
        parameters?: any;
    }): Promise<void>;
    /**
     * @private
     * @param {(taskData: any) => Promise<void>} task
     * @param {any} [parameters]
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
    async stop(): Promise<void>;
}
