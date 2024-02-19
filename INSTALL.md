<p align="center">
  <img src="https://i.imgur.com/G8BUzdZ.png" />
</p>

## Install
- [Getting started](#getting-started)
- [Compatibility](#react-native-compatibility)
- [Linking](#linking)

### Getting started
Install the library using either Yarn:

```
yarn add react-native-background-actions
```

or npm:

```
npm install --save react-native-background-actions
```

### React Native Compatibility
To use this library you need to ensure you are using the correct version of React Native. If you are using a version of React Native that is lower than `0.47` you will need to upgrade before attempting to use this library latest version.

### Linking

#### Using React Native >= 0.60
Linking the package manually is not required anymore with [Autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

- **iOS Platform:**

  `$ cd ios && pod install && cd ..` # CocoaPods on iOS needs this extra step
  
  The background support requires you to activate the background capability in Xcode.
  <img width="688" alt="screenBack" src="https://user-images.githubusercontent.com/44206249/72381524-d2490e00-3717-11ea-959c-f95d94e6ae26.png">

  To support submitting the app to the App store you need to add the following to your `Info.plist`:

  ```xml
    <key>BGTaskSchedulerPermittedIdentifiers</key>
    <array>
        <string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
    </array>
  ```

- **Android Platform:**

  Modify your **`android/app/src/main/AndroidManifest.xml`** and add the following:
  ```xml
    <manifest ... >
        ...
        <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
        <uses-permission android:name="android.permission.WAKE_LOCK" />
        ...
    </manifest>
  ```

  Android 14+ requires the [`foregroundServiceType`](https://developer.android.com/about/versions/14/changes/fgs-types-required) must be set in your service tag:
  ```xml
    <manifest ... >
      ...
        <application ... >
          ...
          <service android:name="com.asterinet.react.bgactions.RNBackgroundActionsTask" android:foregroundServiceType="shortService"/>
          ...
        </application>
      ...
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
