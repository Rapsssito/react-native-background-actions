# react-native-background-actions
React Native background service library for running background tasks forever in Android & iOS.

## Table of Contents

- [Getting started](#getting-started)
- [Compatibility](#react-native-compatibility)
- [Usage](#usage)
    - [Options](#options)
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

  Modify your **`android/app/src/main/AndroidManifest.xml`** and add the following:
  ```xml
    <manifest ... >
        ...
        <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
        <uses-permission android:name="android.permission.WAKE_LOCK" />
        ...
        <application ... >
            ...
            <service android:name="com.asterinet.react.bgactions.RNBackgroundActionsTask" />
        </application>
      </manifest>
  ```
  
  
#### Using React Native < 0.60

You then need to link the native parts of the library for the platforms you are using. The easiest way to link the library is using the CLI tool by running this command from the root of your project:

`$ react-native link react-native-background-actions`

If you can't or don't want to use the CLI tool, you can also manually link the library using the instructions below (click on the arrow to show them):

<details>
<summary>Manually link the library on iOS</summary>

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-background-actions` and add `RNBackgroundActions.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNBackgroundActions.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<
</details>

<details>
<summary>Manually link the library on Android</summary>

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.asterinet.react.bgactions.BackgroundActionsPackage;` to the imports at the top of the file
  - Add `new BackgroundActionsPackage()` to the list returned by the `getPackages()` method
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

const veryIntensiveTask = async (taskData) => {
    const args = taskData.arguments;
    // You can do anything in your task such as network requests, timers and so on, as long as it doesn't touch UI.
    // Once your task completes (i.e. the promise is resolved), React Native will go into "paused" mode (unless
    // there are other tasks running, or there is a foreground app).
};

const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask desc',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    arguments: {
        delay: 1000,
    },
};


await BackgroundService.start(veryIntensiveTask, options);
// iOS will also run everything here in the background until .stop() is called
await BackgroundService.stop();
```
> If you call stop() on background no new tasks will be able to be started!
> Don't call .start() twice, as it will stop performing previous background tasks and start a new one. 
> If .start() is called on the backgound, it will not have any effect.

### Options
```javascript
options
```
| Property    | Type       | Description                                    |
| ----------- | ---------- | ------------------------------------------------ |
| `taskName`  | `<string>` | Task name for identification.                     |
| `taskTitle` | `<string>` |  **Android Required**. Notification title.       |
| `taskDesc`  | `<string>` | **Android Required**. Notification description. |
| `taskIcon`  | [`<taskIconOptions>`](#taskIconOptions) | **Android Required**. Notification icon. |
| `arguments` | `<object>` | Extra parameters to pass to the task. |

#### taskIconOptions
```javascript
taskIconOptions
```
| Property    | Type       | Description                                                    |
| ----------- | ---------- | -------------------------------------------------------------- |
| `name`  | `<string>` | **Required**. Icon name in res/ folder. Ex: `ic_launcher`.         |
| `type` | `<string>` |  **Required**. Icon type in res/ folder. Ex: `mipmap`.              |
| `package`  | `<string>` | Icon package where to search the icon. Ex: `com.example.package`. **It defaults to the app's package. It is higly recommended to leave like that.** |

## Maintainers

* [Rapsssito](https://github.com/rapsssito)

## Acknowledgments

* iOS part originally forked from [react-native-background-timer](https://github.com/ocetnik/react-native-background-timer)

## License

The library is released under the MIT license. For more information see [`LICENSE`](/LICENSE).
