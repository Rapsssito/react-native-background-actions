<p align="center">
  <img src="https://i.imgur.com/G8BUzdZ.png" />
</p>

## Usage
- [Example Code](#Example-Code)
- [Options](#options)
- [Deep Linking](#deep-linking)
- [Events](#events)

### Example Code

```js
import BackgroundService from 'react-native-background-actions';

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
    actions:[
        { title: 'Jane', URI: 'yourSchemeHere://chat/jane' },
        { title: 'John', URI: 'yourSchemeHere://chat/john' }
    ]
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
| Property    | Type       | Description                                    |
| ----------- | ---------- | ------------------------------------------------ |
| `taskName`  | `<string>` | Task name for identification.                     |
| `taskTitle` | `<string>` |  **Android Required**. Notification title.       |
| `taskDesc`  | `<string>` | **Android Required**. Notification description. |
| `taskIcon`  | [`<taskIconOptions>`](#taskIconOptions) | **Android Required**. Notification icon. |
| `color`  | `<string>` | Notification color. **Default**: `"#ffffff"`. |
| `linkingURI`  | `<string>` | Link that will be called when the notification is clicked. Example: `"yourSchemeHere://chat/jane"`. See [Deep Linking](#deep-linking) for more info. **Default**: `undefined`. |
| `actions`  | [`[<actionItem>]`](#actionItem) | List of notification action items. |
| `progressBar`  | [`<taskProgressBarOptions>`](#taskProgressBarOptions) | Notification progress bar. |
| `parameters` | `<any>` | Parameters to pass to the task. |

#### taskIconOptions
**Android only**
| Property    | Type       | Description                                                    |
| ----------- | ---------- | -------------------------------------------------------------- |
| `name`  | `<string>` | **Required**. Icon name in res/ folder. Ex: `ic_launcher`.         |
| `type` | `<string>` |  **Required**. Icon type in res/ folder. Ex: `mipmap`.              |
| `package`  | `<string>` | Icon package where to search the icon. Ex: `com.example.package`. **It defaults to the app's package. It is highly recommended to leave like that.** |

Example:

![photo5837026843969041365](https://user-images.githubusercontent.com/44206249/72532521-de49e280-3873-11ea-8bf6-00618bcb82ab.jpg)

#### actionItem
**Android only**
| Property    | Type       | Description                                                    |
| ----------- | ---------- | -------------------------------------------------------------- |
| `title`  | `<string>` | **Required**. Action title.         |
| `URI` | `<string>` |  Link that will be called when the notification is clicked. Example: `"yourSchemeHere://chat/jane"`. See [Deep Linking](#deep-linking) for more info.              |
**It defaults to the app's package. It is higly recommended to leave like that.** |

#### taskProgressBarOptions
**Android only**
| Property    | Type       | Description                                                    |
| ----------- | ---------- | -------------------------------------------------------------- |
| `max`       | `<number>` | **Required**. Maximum value.     |
| `value`     | `<number>` |  **Required**. Current value.         |
| `indeterminate`     | `<boolean>` |  Display the progress status as indeterminate.         |

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
