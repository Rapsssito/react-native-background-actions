import { Platform, AppRegistry } from 'react-native';
import BackgroundActions from '../src/index';
import {
    RNBackgroundActions as RNBackgroundActionsModule,
    nativeEventEmitter,
} from '../src/RNBackgroundActionsModule';

// @ts-ignore
const mockedEventEmitter = /** @type {{ addListener: jest.Mock<any, any> }} */ (nativeEventEmitter);

// Flush promises
const flushPromises = () => new Promise(setImmediate);

Platform.OS = 'android';

// @ts-ignore
AppRegistry.registerHeadlessTask = jest.fn(async (taskName, task) => task()());

const defaultOptions = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask desc',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    parameters: {
        delay: 1000,
    },
};

test('stop-empty', async () => {
    expect(BackgroundActions.isRunning()).toBe(false);
    RNBackgroundActionsModule.stop.mockClear();
    await BackgroundActions.stop();
    expect(RNBackgroundActionsModule.stop).toHaveBeenCalledTimes(1);
    expect(BackgroundActions.isRunning()).toBe(false);
});

test('start-android', async () => {
    let promiseFinish = () => {};
    const defaultTask = jest.fn(
        // @ts-ignore
        async () => await new Promise((resolve) => (promiseFinish = resolve))
    );
    Platform.OS = 'android';
    // @ts-ignore
    AppRegistry.registerHeadlessTask.mockClear();
    RNBackgroundActionsModule.start.mockClear();
    await BackgroundActions.start(defaultTask, defaultOptions);
    expect(defaultTask).toHaveBeenCalledTimes(1);
    expect(defaultTask).toHaveBeenCalledWith(defaultOptions.parameters);
    expect(AppRegistry.registerHeadlessTask).toHaveBeenCalledTimes(1);
    expect(RNBackgroundActionsModule.start).toHaveBeenCalledTimes(1);
    expect(BackgroundActions.isRunning()).toBe(true);
    promiseFinish();
    await flushPromises();
    expect(BackgroundActions.isRunning()).toBe(false);
});

test('start-ios', async () => {
    let promiseFinish = () => {};
    const defaultTask = jest.fn(
        // @ts-ignore
        async () => await new Promise((resolve) => (promiseFinish = resolve))
    );
    // @ts-ignore
    AppRegistry.registerHeadlessTask.mockClear();
    Platform.OS = 'ios';
    RNBackgroundActionsModule.start.mockClear();
    await BackgroundActions.start(defaultTask, defaultOptions);
    expect(defaultTask).toHaveBeenCalledTimes(1);
    expect(defaultTask).toHaveBeenCalledWith(defaultOptions.parameters);
    expect(AppRegistry.registerHeadlessTask).toHaveBeenCalledTimes(0);
    expect(RNBackgroundActionsModule.start).toHaveBeenCalledTimes(1);
    expect(BackgroundActions.isRunning()).toBe(true);
    promiseFinish();
    await flushPromises();
    expect(BackgroundActions.isRunning()).toBe(false);
});

test('stop', async () => {
    let promiseFinish = () => {};
    const defaultTask = jest.fn(
        // @ts-ignore
        async () => await new Promise((resolve) => (promiseFinish = resolve))
    );
    await BackgroundActions.start(defaultTask, defaultOptions);
    RNBackgroundActionsModule.stop.mockClear();
    await BackgroundActions.stop();
    expect(RNBackgroundActionsModule.stop).toHaveBeenCalledTimes(1);
    expect(BackgroundActions.isRunning()).toBe(false);
    promiseFinish(); // Clear the promise
});

test('updateNotification-ios', async () => {
    Platform.OS = 'ios';
    let promiseFinish = () => {};
    const defaultTask = jest.fn(
        // @ts-ignore
        async () => await new Promise((resolve) => (promiseFinish = resolve))
    );
    await BackgroundActions.start(defaultTask, defaultOptions);
    RNBackgroundActionsModule.updateNotification.mockClear();
    await BackgroundActions.updateNotification({ taskDesc: 'New Desc' });
    expect(RNBackgroundActionsModule.updateNotification).toHaveBeenCalledTimes(0);
    promiseFinish(); // Clear the promise
});

test('updateNotification-android', async () => {
    Platform.OS = 'android';
    let promiseFinish = () => {};
    const defaultTask = jest.fn(
        // @ts-ignore
        async () => await new Promise((resolve) => (promiseFinish = resolve))
    );
    await BackgroundActions.start(defaultTask, defaultOptions);
    RNBackgroundActionsModule.updateNotification.mockClear();
    const updatedOptions = { taskDesc: 'New Desc' };
    await BackgroundActions.updateNotification(updatedOptions);
    expect(RNBackgroundActionsModule.updateNotification).toHaveBeenCalledTimes(1);
    const newOptions = RNBackgroundActionsModule.updateNotification.mock.calls[0][0];
    expect(newOptions.taskDesc).toBe(updatedOptions.taskDesc);
    promiseFinish(); // Clear the promise
});

test('updateNotification-android-notRunning', async () => {
    Platform.OS = 'android';
    const updatedOptions = { taskDesc: 'New Desc' };
    await expect(BackgroundActions.updateNotification(updatedOptions)).rejects.toBeDefined();
});

test('expiration-event', () => {
    Platform.OS = 'ios';
    return new Promise((done) => {
        BackgroundActions.on('expiration', done);
        mockedEventEmitter.addListener.mock.calls[0][1]();
    });
});
