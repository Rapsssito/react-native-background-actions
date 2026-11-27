const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../..');
const pak = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const modules = [
    '@babel/runtime',
    ...Object.keys({
        ...pak.dependencies,
        ...pak.peerDependencies,
    }),
];

const escapeRegExp = (s) => s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');

const defaultConfig = getDefaultConfig(__dirname);

const config = {
    projectRoot: __dirname,
    watchFolders: [root],
    resolver: {
        blockList: new RegExp(`^${escapeRegExp(path.join(root, 'node_modules'))}\\/.*$`),
        extraNodeModules: modules.reduce((acc, name) => {
            acc[name] = path.join(__dirname, 'node_modules', name);
            return acc;
        }, {}),
    },
};

module.exports = mergeConfig(defaultConfig, config);
