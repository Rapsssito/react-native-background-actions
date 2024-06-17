<p align="center">
    <img src="https://i.imgur.com/G8BUzdZ.png" />
    <br></br>
    <img src="https://github.com/Rapsssito/react-native-background-actions/workflows/Release/badge.svg" />
    <img src="https://img.shields.io/npm/dw/react-native-background-actions" />
    <img src="https://img.shields.io/npm/v/react-native-background-actions?color=gr&label=npm%20version" />
</p>

React Native background service library for running **background tasks forever in Android & iOS**. Schedule a background job that will run your JavaScript when your app is in the background or foreground.

### WARNING
- **Android**: This library relies on React Native's [`HeadlessJS`](https://facebook.github.io/react-native/docs/headless-js-android) for Android. Before building your JS task, make sure to read all the [documentation](https://facebook.github.io/react-native/docs/headless-js-android). The jobs will run even if the app has been closed. [In Android 12+](https://developer.android.com/guide/components/foreground-services#background-start-restrictions) you will not be able to launch background tasks from the background. A notification will be shown when the task is running, it is not possible to start the service without it. The notification will only be visible in Android.

- **iOS**: This library relies on iOS's [`UIApplication beginBackgroundTaskWithName` method](https://developer.apple.com/documentation/uikit/uiapplication/1623051-beginbackgroundtaskwithname?language=objc), which **won't keep your app in the background forever** by itself. However, you can rely on other libraries like [`react-native-track-player`](https://github.com/react-native-kit/react-native-track-player) that use audio, geolocalization, etc. to keep your app alive in the background while you excute the JS from this library.


## Table of Contents <!-- omit in toc -->

- [React Native / Android / iOS compatibility](#react-native--android--ios-compatibility)
- [Install](#install)
- [Usage](#usage)
  - [Example Code](#example-code)
  - [Options](#options)
    - [taskIconOptions](#taskiconoptions)
    - [taskProgressBarOptions](#taskprogressbaroptions)
  - [Deep Linking](#deep-linking)
  - [Events](#events)
    - ['expiration'](#expiration)
- [Maintainers](#maintainers)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## React Native / Android / iOS compatibility
To use this module you need to ensure you are using the correct version of React Native. If you are using an Android (targetSdkVersion) version lower than 31 (introduced in React Native 0.68.0) you will need to upgrade before attempting to use `react-native-background-actions`'s latest version.

| Version | React Native version | Android (targetSdkVersion) version | iOS version  |
| ------- | -------------------- | ---------------------------------- | ------------ |
| `4.X.X` | `>= Unknown`         | `>= 34`                            | `>= Unknown` |
| `3.X.X` | `>= Unknown`         | `>= 31`                            | `>= Unknown` |
| `2.6.7` | `>= Unknown`         | `>= Unknown`                       | `>= Unknown` |

## Install

Go to [INSTALL.md](./INSTALL.md) to see the how to install, compatibility with RN and Linking process.

## Usage

### Example Code

```js
import BackgroundService from 'react-native-background-actions';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).
const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise( async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            console.log(i);
            await sleep(delay);
        }
    });
};

const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
        delay: 1000,
    },
};


await BackgroundService.start(veryIntensiveTask, options);
await BackgroundService.updateNotification({taskDesc: 'New ExampleTask description'}); // Only Android, iOS will ignore this call
// iOS will also run everything here in the background until .stop() is called
await BackgroundService.stop();
```
> If you call stop() on background no new tasks will be able to be started!
> Don't call .start() twice, as it will stop performing previous background tasks and start a new one. 
> If .start() is called on the backgound, it will not have any effect.

### Options
| Property      | Type                                                  | Description                                                                                                                                                                    |
| ------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `taskName`    | `<string>`                                            | Task name for identification.                                                                                                                                                  |
| `taskTitle`   | `<string>`                                            | **Android Required**. Notification title.                                                                                                                                      |
| `taskDesc`    | `<string>`                                            | **Android Required**. Notification description.                                                                                                                                |
| `taskIcon`    | [`<taskIconOptions>`](#taskIconOptions)               | **Android Required**. Notification icon.                                                                                                                                       |
| `color`       | `<string>`                                            | Notification color. **Default**: `"#ffffff"`.                                                                                                                                  |
| `linkingURI`  | `<string>`                                            | Link that will be called when the notification is clicked. Example: `"yourSchemeHere://chat/jane"`. See [Deep Linking](#deep-linking) for more info. **Default**: `undefined`. |
| `progressBar` | [`<taskProgressBarOptions>`](#taskProgressBarOptions) | Notification progress bar.                                                                                                                                                     |
| `parameters`  | `<any>`                                               | Parameters to pass to the task.                                                                                                                                                |

#### taskIconOptions
**Android only**
| Property  | Type       | Description                                                                                                                                          |
| --------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`    | `<string>` | **Required**. Icon name in res/ folder. Ex: `ic_launcher`.                                                                                           |
| `type`    | `<string>` | **Required**. Icon type in res/ folder. Ex: `mipmap`.                                                                                                |
| `package` | `<string>` | Icon package where to search the icon. Ex: `com.example.package`. **It defaults to the app's package. It is highly recommended to leave like that.** |

Example:

![photo5837026843969041365](https://user-images.githubusercontent.com/44206249/72532521-de49e280-3873-11ea-8bf6-00618bcb82ab.jpg)

#### taskProgressBarOptions
**Android only**
| Property        | Type        | Description                                   |
| --------------- | ----------- | --------------------------------------------- |
| `max`           | `<number>`  | **Required**. Maximum value.                  |
| `value`         | `<number>`  | **Required**. Current value.                  |
| `indeterminate` | `<boolean>` | Display the progress status as indeterminate. |

Example:

![ProgressBar](https://developer.android.com/images/ui/notifications/notification-progressbar_2x.png)

### Deep Linking
**Android only**

To handle incoming links when the notification is clicked by the user, first you need to modify your **`android/app/src/main/AndroidManifest.xml`** and add an `<intent-filter>` (fill `yourSchemeHere` with the name you prefer):
```xml
  <manifest ... >
      ...
      <application ... >
          <activity
              ...
              android:launchMode="singleTask"> // Add this if not present
                  ...
                  <intent-filter android:label="filter_react_native">
                      <action android:name="android.intent.action.VIEW" />
                      <category android:name="android.intent.category.DEFAULT" />
                      <category android:name="android.intent.category.BROWSABLE" />
                      <data android:scheme="yourSchemeHere" />
                  </intent-filter>
      </application>
    </manifest>
```

You must provide a `linkingURI` in the BackgroundService's [options](#options) that matches the scheme you just added to **`android/app/src/main/AndroidManifest.xml`**:
```js
const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // Add this
    parameters: {
        delay: 1000,
    },
};


await BackgroundService.start(veryIntensiveTask, options);
```

React Native provides a `Linking` class to get notified of incoming links. Your JavaScript code must then listen to the url using React Native `Linking` class:
```js
import { Linking } from 'react-native';

Linking.addEventListener('url', handleOpenURL);

function handleOpenURL(evt) {
    // Will be called when the notification is pressed
    console.log(evt.url);
    // do something
}
```

### Events
#### 'expiration'
**iOS only**
Listen for the iOS-only expiration handler that allows you to 'clean up' shortly before the app’s remaining background time reaches 0. Check the iOS [documentation](https://developer.apple.com/documentation/uikit/uiapplication/1623031-beginbackgroundtask) for more info.

```js
BackgroundService.on('expiration', () => {
    console.log('I am being closed :(');
});

await BackgroundService.start(veryIntensiveTask, options);

```

## Maintainers

* [Rapsssito](https://github.com/rapsssito) [[Support me :heart:](https://github.com/sponsors/Rapsssito)]

## Acknowledgments

* iOS part originally forked from [react-native-background-timer](https://github.com/ocetnik/react-native-background-timer)

## License

The library is released under the MIT license. For more information see [`LICENSE`](/LICENSE).
