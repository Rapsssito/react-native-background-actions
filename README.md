<p align="center">
    <img src="https://i.imgur.com/G8BUzdZ.png" />
    <br></br>
    <img src="https://github.com/Rapsssito/react-native-background-actions/workflows/Release/badge.svg" />
    <img src="https://img.shields.io/npm/dw/react-native-background-actions" />
    <img src="https://img.shields.io/npm/v/react-native-background-actions?color=gr&label=npm%20version" />
</p>

React Native background service library for running **background tasks forever in Android & iOS**. Schedule a background job that will run your JavaScript when your app is in the background or foreground.

### WARNING
- **Android**: This library relies on React Native's [`HeadlessJS`](https://facebook.github.io/react-native/docs/headless-js-android.html) for Android. Before building your JS task, make sure to read all the [documentation](https://facebook.github.io/react-native/docs/headless-js-android.html). The jobs will run even if the app has been closed.

- **iOS**: This library relies on iOS's [`UIApplication beginBackgroundTaskWithName` method](https://developer.apple.com/documentation/uikit/uiapplication/1623051-beginbackgroundtaskwithname?language=objc), which **won't keep your app in the background forever** by itself. However, you can rely on other libraries like [`react-native-track-player`](https://github.com/react-native-kit/react-native-track-player) that use audio, geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.


## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Install

Go to [INSTALL.md](./INSTALL.md) to see the how to install, compatibility with RN and Linking process.

## Usage

Go to [USAGE.md](./USAGE.md) to see the example code and options.

## Maintainers

* [Rapsssito](https://github.com/rapsssito) [[Support me :heart:](https://github.com/sponsors/Rapsssito)]

## Acknowledgments

* iOS part originally forked from [react-native-background-timer](https://github.com/ocetnik/react-native-background-timer)

## License

The library is released under the MIT license. For more information see [`LICENSE`](/LICENSE).
