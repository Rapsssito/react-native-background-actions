# react-native-background-actions
React Native background service library for running background tasks forever in Android & iOS.

## WARNING: Only works on iOS, right now

## Table of Contents

- [Getting started](#getting-started)
- [Compatibility](#react-native-compatibility)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Getting started
Install the library using either Yarn:

```
yarn add react-native-background-actions
```

or npm:

```
npm install --save react-native-background-actions
```

#### Using React Native >= 0.60
Linking the package manually is not required anymore with [Autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

- **iOS Platform:**

  `$ cd ios && pod install && cd ..` # CocoaPods on iOS needs this extra step
  
  The background support requires you to activate the background capability in Xcode.
  <img width="688" alt="screenBack" src="https://user-images.githubusercontent.com/44206249/72381524-d2490e00-3717-11ea-959c-f95d94e6ae26.png">

- **Android Platform:**
  TODO: Register the service

  Modify your **`android/app/src/main/AndroidManifest.xml`** and add the following:
  ```
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
  ```
  
  
#### Using React Native < 0.60

You then need to link the native parts of the library for the platforms you are using. The easiest way to link the library is using the CLI tool by running this command from the root of your project:

`$ react-native link react-native-background-actions`

If you can't or don't want to use the CLI tool, you can also manually link the library using the instructions below (click on the arrow to show them):

<details>
<summary>Manually link the library on iOS</summary>

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-background-actions` and add `TcpSocket.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libTcpSocket.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<
</details>

<details>
<summary>Manually link the library on Android</summary>

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.reactlibrary.TcpSocketPackage;` to the imports at the top of the file
  - Add `new TcpSocketPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-background-actions'
  	project(':react-native-background-actions').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-background-actions/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-background-actions')
  	```
</details>

## React Native Compatibility
To use this library you need to ensure you are using the correct version of React Native. If you are using a version of React Native that is lower than `0.47` you will need to upgrade before attempting to use this library latest version.

## Usage
```js
import BackgroundService from 'react-native-background-actions';

await BackgroundService.start();
// Do whatever you want, incuding setTimeout();
await BackgroundService.stop();
```
> If you call stop() on background no new tasks will be able to be started!
> Don't call .start() twice, as it will stop performing previous background tasks and start a new one. 
> If .start() is called on the backgound, it will not have any effect.

## Maintainers

* [Rapsssito](https://github.com/rapsssito)

## Acknowledgments

* iOS part originally forked from [react-native-background-timer](https://github.com/ocetnik/react-native-background-timer)

## License

The library is released under the MIT license. For more information see [`LICENSE`](/LICENSE).
