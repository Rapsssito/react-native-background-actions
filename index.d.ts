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
    color?: string;
    parameters?: any;
};
declare const backgroundServer: BackgroundServer;
/**
 * @typedef {{taskName: string,
 *            taskTitle: string,
 *            taskDesc: string,
 *            taskIcon: {name: string, type: string, package?: string},
 *            color?: string,
 *            parameters?: any}} BackgroundTaskOptions
 */
declare class BackgroundServer {
    _runnedTasks: number;
    _stopTask: () => void;
    _isRunning: boolean;
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
     * @param {BackgroundTaskOptions} options
     */
    async start(task: (taskData: any) => Promise<void>, options: {
        taskName: string;
        taskTitle: string;
        taskDesc: string;
        taskIcon: {
            name: string;
            type: string;
            package?: string;
        };
        color?: string;
        parameters?: any;
    }): Promise<void>;
    /**
     * @param {(taskData: any) => Promise<void>} task
     * @param {any} [parameters]
     */
    _generateTask(task: (taskData: any) => Promise<void>, parameters?: any): () => Promise<void>;
    /**
     * @param {BackgroundTaskOptions} options
     */
    _normalizeOptions(options: {
        taskName: string;
        taskTitle: string;
        taskDesc: string;
        taskIcon: {
            name: string;
            type: string;
            package?: string;
        };
        color?: string;
        parameters?: any;
    }): {
        taskName: string;
        taskTitle: string;
        taskDesc: string;
        taskIcon: {
            name: string;
            type: string;
            package?: string;
        };
        color: string;
    };
    async stop(): Promise<void>;
}
