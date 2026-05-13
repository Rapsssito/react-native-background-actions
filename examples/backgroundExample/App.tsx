/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Platform,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackgroundJob, { BackgroundTaskOptions } from 'react-native-background-actions';

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(resolve, time));

BackgroundJob.on('expiration', () => {
  console.log('iOS: I am being closed!');
});

const taskRandom = async (taskData: any) => {
  if (Platform.OS === 'ios') {
    console.warn(
      'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
      'geolocalization, etc. to keep your app alive in the background while you execute the JS from this library.'
    );
  }
  await new Promise<void>(async () => {
    const { delay } = taskData;
    console.log(BackgroundJob.isRunning(), delay);
    for (let i = 0; BackgroundJob.isRunning(); i++) {
      console.log('Runned -> ', i);
      await BackgroundJob.updateNotification({ taskDesc: 'Runned -> ' + i });
      await sleep(delay);
    }
  });
};

const options: BackgroundTaskOptions & {parameters: {delay: number}} = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask desc',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'exampleScheme://chat/jane',
  foregroundServiceType: ['dataSync'],
  parameters: {
    delay: 1000,
  },
};

export function App() {
  const [playing, setPlaying] = useState(BackgroundJob.isRunning());

  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).catch();
    }
    const subscription = Linking.addEventListener('url', (evt) => {
      console.log(evt.url);
    });
    return () => subscription.remove();
  }, []);

  const toggleBackground = async () => {
    if (playing) {
      console.log('Stop background service');
      await BackgroundJob.stop();
      setPlaying(false);
    } else {
      try {
        console.log('Trying to start background service');
        await BackgroundJob.start(taskRandom, options);
        console.log('Successful start!');
        setPlaying(true);
      } catch (e) {
        console.log('Error', e);
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={styles.header}>
            <Text style={styles.title}>Background Actions</Text>
          </View>
          <View style={styles.body}>
            <TouchableOpacity
              style={[styles.button, playing ? styles.buttonStop : styles.buttonStart]}
              onPress={toggleBackground}>
              <Text style={styles.buttonText}>{playing ? 'Stop' : 'Start'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  button: {
    height: 100,
    width: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStart: {
    backgroundColor: '#4CAF50',
  },
  buttonStop: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default App;
