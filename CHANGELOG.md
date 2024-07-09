## [4.0.1](https://github.com/Rapsssito/react-native-background-actions/compare/v4.0.0...v4.0.1) (2024-07-09)


### Bug Fixes

* **Android:** Fix RN 0.73 namespace requirement ([#229](https://github.com/Rapsssito/react-native-background-actions/issues/229)) ([d6f3135](https://github.com/Rapsssito/react-native-background-actions/commit/d6f31351ed745980d2d036d4d5c1c55884cea8d5))

# [4.0.0](https://github.com/Rapsssito/react-native-background-actions/compare/v3.0.1...v4.0.0) (2024-06-17)


### Bug Fixes

* **Android:** Fix Android 14 crash with implicit intent ([#208](https://github.com/Rapsssito/react-native-background-actions/issues/208)) ([d30165f](https://github.com/Rapsssito/react-native-background-actions/commit/d30165fca1a1acb5837a7fd00361ff17f9169827))


### BREAKING CHANGES

* **Android:** `targetSdkVersion` is now required to be 34+ for Android users.

## [3.0.1](https://github.com/Rapsssito/react-native-background-actions/compare/v3.0.0...v3.0.1) (2023-10-11)


### Bug Fixes

* **Android:** Register background service in package AndroidManifest.xml ([#184](https://github.com/Rapsssito/react-native-background-actions/issues/184)) ([32e9d20](https://github.com/Rapsssito/react-native-background-actions/commit/32e9d2063d4bbae6c675f700f7690a09d9d2b656))

# [3.0.0](https://github.com/Rapsssito/react-native-background-actions/compare/v2.6.7...v3.0.0) (2022-12-21)


### Bug Fixes

* **Android:** Fix crash when targeting SDK 31+ ([#165](https://github.com/Rapsssito/react-native-background-actions/issues/165)) ([c70554e](https://github.com/Rapsssito/react-native-background-actions/commit/c70554e974366e658746953e2d49867a9278e41b))


### BREAKING CHANGES

* **Android:** `targetSdkVersion` is now required to be 31+ for Android users.

## [2.6.7](https://github.com/Rapsssito/react-native-background-actions/compare/v2.6.6...v2.6.7) (2022-04-25)


### Bug Fixes

* **Android:** Revert [#124](https://github.com/Rapsssito/react-native-background-actions/issues/124) ([#127](https://github.com/Rapsssito/react-native-background-actions/issues/127)) ([ba3bf29](https://github.com/Rapsssito/react-native-background-actions/commit/ba3bf2946d8f9ec880be53161faa581fb8466e7f)), closes [#126](https://github.com/Rapsssito/react-native-background-actions/issues/126)

## [2.6.6](https://github.com/Rapsssito/react-native-background-actions/compare/v2.6.5...v2.6.6) (2022-03-22)


### Bug Fixes

* Fix creation of multiple tasks ([#124](https://github.com/Rapsssito/react-native-background-actions/issues/124)) ([df268bd](https://github.com/Rapsssito/react-native-background-actions/commit/df268bd024c876b3d8499690417db341706bf5ec))

## [2.6.5](https://github.com/Rapsssito/react-native-background-actions/compare/v2.6.4...v2.6.5) (2021-10-15)


### Bug Fixes

* **Android:** Add RN 0.65 event emitter stubs ([83d4621](https://github.com/Rapsssito/react-native-background-actions/commit/83d4621f97d870fdde2229cf8bdc5803b0a891ea)), closes [#103](https://github.com/Rapsssito/react-native-background-actions/issues/103)

## [2.6.4](https://github.com/Rapsssito/react-native-background-actions/compare/v2.6.3...v2.6.4) (2021-10-04)


### Bug Fixes

* **Android:** Fix Gradle 7 and Android S compatibility ([e7452ba](https://github.com/Rapsssito/react-native-background-actions/commit/e7452ba881ef01859bdd926186b8ff4d115d1ada)), closes [#88](https://github.com/Rapsssito/react-native-background-actions/issues/88) [#87](https://github.com/Rapsssito/react-native-background-actions/issues/87)

## [2.6.2](https://github.com/Rapsssito/react-native-background-actions/compare/v2.6.1...v2.6.2) (2021-06-30)


### Bug Fixes

* Fix IllegalStateException "Not allowed to start service Intent" ([1ba26c7](https://github.com/Rapsssito/react-native-background-actions/commit/1ba26c710f8044bd94ee6b3b90f53787cabf24b0))

## [2.6.1](https://github.com/Rapsssito/react-native-background-actions/compare/v2.6.0...v2.6.1) (2021-06-09)


### Bug Fixes

* Fix [#61](https://github.com/Rapsssito/react-native-background-actions/issues/61) when React context was null ([2efefaa](https://github.com/Rapsssito/react-native-background-actions/commit/2efefaa20ec601e4822bd83574594a55a85dc96e))

# [2.6.0](https://github.com/Rapsssito/react-native-background-actions/compare/v2.5.3...v2.6.0) (2021-03-14)


### Features

* **iOS:** Add 'expiration' event ([#74](https://github.com/Rapsssito/react-native-background-actions/issues/74)) ([4b820ee](https://github.com/Rapsssito/react-native-background-actions/commit/4b820ee276cd8c6bba3604d69b37c85a7341a718))

## [2.5.3](https://github.com/Rapsssito/react-native-background-actions/compare/v2.5.2...v2.5.3) (2021-02-26)


### Bug Fixes

* Fix podspec version ([e41bb0e](https://github.com/Rapsssito/react-native-background-actions/commit/e41bb0e0f1fca864a46ccd77737e4ea69f1bb366))

## [2.5.2](https://github.com/Rapsssito/react-native-background-actions/compare/v2.5.1...v2.5.2) (2020-10-25)


### Bug Fixes

* Upgrade TypeScript declaration ([#53](https://github.com/Rapsssito/react-native-background-actions/issues/53)) ([c74ade7](https://github.com/Rapsssito/react-native-background-actions/commit/c74ade7eee3bac80a95a8c1fc223f2bdf1c48afa))

## [2.5.1](https://github.com/Rapsssito/react-native-background-actions/compare/v2.5.0...v2.5.1) (2020-10-01)


### Bug Fixes

* Fix Xcode 12 compatibility ([e80bc0e](https://github.com/Rapsssito/react-native-background-actions/commit/e80bc0e3a3721315bd1f44de2dfb2edac60f7138)), closes [facebook/react-native#29633](https://github.com/facebook/react-native/issues/29633)

# [2.5.0](https://github.com/Rapsssito/react-native-background-actions/compare/v2.4.0...v2.5.0) (2020-09-06)


### Features

* **Android:** Add progress bar to notification ([#41](https://github.com/Rapsssito/react-native-background-actions/issues/41)) ([2ed041d](https://github.com/Rapsssito/react-native-background-actions/commit/2ed041dfb9d2b9a5419c5dd8330899b1e0123ac3))

# [2.4.0](https://github.com/Rapsssito/react-native-background-actions/compare/v2.3.0...v2.4.0) (2020-09-04)


### Features

* **Android:** Add deep linking support when clicking on notification ([#40](https://github.com/Rapsssito/react-native-background-actions/issues/40)) ([c0849e3](https://github.com/Rapsssito/react-native-background-actions/commit/c0849e3ec31c0f6c8ceb43df7730ed84e2b4c17d))

# [2.3.0](https://github.com/Rapsssito/react-native-background-actions/compare/v2.2.0...v2.3.0) (2020-09-02)


### Features

* **Android:** Add updateNotification() method ([#37](https://github.com/Rapsssito/react-native-background-actions/issues/37)) ([7582ed7](https://github.com/Rapsssito/react-native-background-actions/commit/7582ed7141c9d65b08038cbe5f7946413027b8b9))

# [2.2.0](https://github.com/Rapsssito/react-native-background-actions/compare/v2.1.0...v2.2.0) (2020-02-24)


### Features

* Add TypeScript declaration files ([#15](https://github.com/Rapsssito/react-native-background-actions/issues/15)) ([1c9f9b1](https://github.com/Rapsssito/react-native-background-actions/commit/1c9f9b133e80a741a13c6c2d1bbc524907a6ee72))

# [2.1.0](https://github.com/Rapsssito/react-native-background-actions/compare/v2.0.0...v2.1.0) (2020-02-20)


### Features

* Know the task's state with isRunning() method ([#13](https://github.com/Rapsssito/react-native-background-actions/issues/13)) ([d3954dd](https://github.com/Rapsssito/react-native-background-actions/commit/d3954dd3504973b19ed386d10ca2a31174375b20))

# [2.0.0](https://github.com/Rapsssito/react-native-background-actions/compare/v1.1.0...v2.0.0) (2020-02-20)


### Features

* Allow non-serializable parameters ([#12](https://github.com/Rapsssito/react-native-background-actions/issues/12)) ([e3ccbbe](https://github.com/Rapsssito/react-native-background-actions/commit/e3ccbbe7e3f3be819ff0952271e95f3cf4e1dff7))


### BREAKING CHANGES

* This breaks compatibility with the old parameters handling

# [1.2.0](https://github.com/Rapsssito/react-native-background-actions/compare/v1.1.0...v1.2.0) (2020-02-20)


### Features

* Allow non-serializable parameters ([#12](https://github.com/Rapsssito/react-native-background-actions/issues/12)) ([9addd1e](https://github.com/Rapsssito/react-native-background-actions/commit/9addd1e80be4f16ef7b7efc1ab9c4784fcec6ec8))

# [1.1.0](https://github.com/Rapsssito/react-native-background-actions/compare/v1.0.4...v1.1.0) (2020-01-30)


### Features

* **Android:** Set notification color ([3f7fb1a](https://github.com/Rapsssito/react-native-background-actions/commit/3f7fb1ae994de0070ca4c3fd81a9783133c1e840))
