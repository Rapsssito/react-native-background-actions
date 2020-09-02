module.exports = {
    preset: 'react-native',
    collectCoverage: true,
    setupFilesAfterEnv: ['<rootDir>jest.setup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(react-native|react-navigation|@react-navigation|@react-native-community))',
    ],
    modulePathIgnorePatterns: ['examples/'],
    collectCoverageFrom: ['src/index.js'],
    globals: {
        __DEV__: true,
    },
    timers: 'fake',
};
