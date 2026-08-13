jest.mock('./src/RNBackgroundActionsModule.js', () => ({
    RNBackgroundActions: { start: jest.fn(), stop: jest.fn(), updateNotification: jest.fn() },
    nativeEventEmitter: { addListener: jest.fn() },
}));

// The server subscribes when it is constructed, which is when a test file
// imports it — before any assignment inside that file has run. Its
// notification-action listener is Android-only, so the platform has to be set
// here for a test to observe it at all.
require('react-native').Platform.OS = 'android';
