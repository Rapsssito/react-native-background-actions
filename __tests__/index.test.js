import { Platform, AppRegistry } from 'react-native';
import BackgroundActions from '../index';
import RNBackgroundActionsModule from '../RNBackgroundActionsModule';

Platform.OS = 'android';

AppRegistry.registerHeadlessTask = jest.fn((taskName, task) => task()());

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
    RNBackgroundActionsModule.stop.mockClear();
    await BackgroundActions.stop();
    expect(RNBackgroundActionsModule.stop).toHaveBeenCalledTimes(1);
});

test('start-android', async () => {
    const defaultTask = jest.fn(async () => {});
    Platform.OS = 'android';
    AppRegistry.registerHeadlessTask.mockClear();
    RNBackgroundActionsModule.start.mockClear();
    await BackgroundActions.start(defaultTask, defaultOptions);
    expect(defaultTask).toHaveBeenCalledTimes(1);
    expect(defaultTask).toHaveBeenCalledWith(defaultOptions.parameters);
    expect(AppRegistry.registerHeadlessTask).toHaveBeenCalledTimes(1);
    expect(RNBackgroundActionsModule.start).toHaveBeenCalledTimes(1);
});

test('start-ios', async () => {
    const defaultTask = jest.fn(async () => {});
    AppRegistry.registerHeadlessTask.mockClear();
    Platform.OS = 'ios';
    RNBackgroundActionsModule.start.mockClear();
    await BackgroundActions.start(defaultTask, defaultOptions);
    expect(defaultTask).toHaveBeenCalledTimes(1);
    expect(defaultTask).toHaveBeenCalledWith(defaultOptions.parameters);
    expect(AppRegistry.registerHeadlessTask).toHaveBeenCalledTimes(0);
    expect(RNBackgroundActionsModule.start).toHaveBeenCalledTimes(1);
});

test('stop', async () => {
    RNBackgroundActionsModule.stop.mockClear();
    await BackgroundActions.stop();
    expect(RNBackgroundActionsModule.stop).toHaveBeenCalledTimes(1);
});
