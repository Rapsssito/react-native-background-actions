jest.mock('./src/RNBackgroundActionsModule.js', () => ({
    RNBackgroundActions: { start: jest.fn(), stop: jest.fn(), updateNotification: jest.fn() },
    nativeEventEmitter: { addListener: jest.fn() },
}));
