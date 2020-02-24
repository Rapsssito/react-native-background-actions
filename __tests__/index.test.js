import { Platform, AppRegistry } from 'react-native';
import BackgroundActions from '../src/index';
import RNBackgroundActionsModule from '../src/RNBackgroundActionsModule';

// Flush promises
const flushPromises = () => new Promise(setImmediate);

Platform.OS = 'android';

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
        async () => await new Promise((resolve) => (promiseFinish = resolve))
    );
    Platform.OS = 'android';
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
        async () => await new Promise((resolve) => (promiseFinish = resolve))
    );
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
        async () => await new Promise((resolve) => (promiseFinish = resolve))
    );
    await BackgroundActions.start(defaultTask, defaultOptions);
    RNBackgroundActionsModule.stop.mockClear();
    await BackgroundActions.stop();
    expect(RNBackgroundActionsModule.stop).toHaveBeenCalledTimes(1);
    expect(BackgroundActions.isRunning()).toBe(false);
    promiseFinish(); // Clear the promise
});
