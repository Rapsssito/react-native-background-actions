jest.mock('./src/RNBackgroundActionsModule.js', () => ({
    start: jest.fn(),
    stop: jest.fn(),
    updateNotification: jest.fn(),
}));
