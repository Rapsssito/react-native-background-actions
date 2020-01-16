import { NativeModules, Platform, AppRegistry } from 'react-native';
import BackgroundActions from '../index';

jest.mock('react-native', () => ({
    NativeModules: {
        RNBackgroundActions: {
            start: jest.fn(),
            stop: jest.fn(),
        },
    },
    Platform: {
        OS: 'android',
    },
    AppRegistry: {
        registerHeadlessTask: jest.fn((taskName, task) => task()()),
    },
}));

const defaultOptions = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask desc',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    arguments: {
        delay: 1000,
    },
};

test('start-android', async () => {
    const defaultTask = jest.fn(async () => {});
    Platform.OS = 'android';
    AppRegistry.registerHeadlessTask.mockClear();
    NativeModules.RNBackgroundActions.start.mockClear();
    await BackgroundActions.start(defaultTask, defaultOptions);
    expect(defaultTask).toHaveBeenCalledTimes(1);
    expect(AppRegistry.registerHeadlessTask).toHaveBeenCalledTimes(1);
    expect(NativeModules.RNBackgroundActions.start).toHaveBeenCalledTimes(1);
});

test('start-ios', async () => {
    const defaultTask = jest.fn(async () => {});
    AppRegistry.registerHeadlessTask.mockClear();
    Platform.OS = 'ios';
    NativeModules.RNBackgroundActions.start.mockClear();
    await BackgroundActions.start(defaultTask, defaultOptions);
    expect(defaultTask).toHaveBeenCalledTimes(1);
    expect(AppRegistry.registerHeadlessTask).toHaveBeenCalledTimes(0);
    expect(NativeModules.RNBackgroundActions.start).toHaveBeenCalledTimes(1);
});

test('stop', async () => {
    NativeModules.RNBackgroundActions.stop.mockClear();
    await BackgroundActions.stop();
    expect(NativeModules.RNBackgroundActions.stop).toHaveBeenCalledTimes(1);
});
