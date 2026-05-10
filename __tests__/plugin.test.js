// Lightweight smoke tests for the Expo config plugin.
// Mocks @expo/config-plugins so we don't need it as a real dependency.

jest.mock(
    '@expo/config-plugins',
    () => {
        /** @param {any} config @param {(c: any) => any} mod */
        const withAndroidManifest = (config, mod) => {
            const next = { ...config, modResults: config._manifest };
            const out = mod(next);
            return { ...config, _manifest: out.modResults };
        };
        /** @param {any} config @param {string[]} permissions */
        const withPermissions = (config, permissions) => {
            const existing = config._permissions || [];
            const merged = Array.from(new Set([...existing, ...permissions]));
            return { ...config, _permissions: merged };
        };
        return {
            withAndroidManifest,
            AndroidConfig: { Permissions: { withPermissions } },
        };
    },
    { virtual: true }
);

const withBackgroundActions = require('../plugin/build/withBackgroundActions');

/** @returns {{_permissions: string[], _manifest: any}} */
const baseConfig = () => ({
    _permissions: [],
    _manifest: {
        manifest: { application: [{ $: {}, service: [] }] },
    },
});

/** @param {any} cfg */
const findService = (cfg) =>
    cfg._manifest.manifest.application[0].service.find(
        /** @param {any} s */ (s) =>
            s.$['android:name'] === 'com.asterinet.react.bgactions.RNBackgroundActionsTask'
    );

test('defaults to dataSync when called with no props', () => {
    const cfg = withBackgroundActions(baseConfig());
    const svc = findService(cfg);
    expect(svc).toBeDefined();
    expect(svc.$['android:foregroundServiceType']).toBe('dataSync');
    expect(cfg._permissions).toContain('android.permission.FOREGROUND_SERVICE_DATA_SYNC');
    expect(cfg._permissions).toContain('android.permission.FOREGROUND_SERVICE');
});

test('accepts a single type as a string', () => {
    const cfg = withBackgroundActions(baseConfig(), {
        foregroundServiceType: 'location',
    });
    expect(findService(cfg).$['android:foregroundServiceType']).toBe('location');
    expect(cfg._permissions).toContain('android.permission.FOREGROUND_SERVICE_LOCATION');
});

test('merges multiple types with | and adds all permissions', () => {
    const cfg = withBackgroundActions(baseConfig(), {
        foregroundServiceType: ['dataSync', 'location'],
    });
    expect(findService(cfg).$['android:foregroundServiceType']).toBe('dataSync|location');
    expect(cfg._permissions).toEqual(
        expect.arrayContaining([
            'android.permission.FOREGROUND_SERVICE_DATA_SYNC',
            'android.permission.FOREGROUND_SERVICE_LOCATION',
        ])
    );
});

test('throws on unknown type', () => {
    expect(() =>
        withBackgroundActions(baseConfig(), {
            foregroundServiceType: 'nope',
        })
    ).toThrow(/Unknown foregroundServiceType/);
});

test('updates existing service entry instead of duplicating', () => {
    const cfg = baseConfig();
    cfg._manifest.manifest.application[0].service.push({
        $: {
            'android:name': 'com.asterinet.react.bgactions.RNBackgroundActionsTask',
            'android:foregroundServiceType': 'shortService',
        },
    });
    const out = withBackgroundActions(cfg, { foregroundServiceType: 'dataSync' });
    const services = out._manifest.manifest.application[0].service.filter(
        /** @param {any} s */ (s) =>
            s.$['android:name'] === 'com.asterinet.react.bgactions.RNBackgroundActionsTask'
    );
    expect(services).toHaveLength(1);
    expect(services[0].$['android:foregroundServiceType']).toBe('dataSync');
});
