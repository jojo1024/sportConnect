import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import RootNavigator from './navigation/RootNavigator';
import { store, persistor } from './store';
import { registerDeviceForRemoteMessages, onMessageReceived, requestNotificationPermission } from './firebase/firebase';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { COLORS } from './theme/colors';

// Composant de loading pour PersistGate xx
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

export default function App() {

  const initializeFCM = async () => {
    try {
      // await requestNotificationPermission()
      await registerDeviceForRemoteMessages()
      messaging().onMessage(onMessageReceived);
    } catch (error) {
      console.log("🚀 ~ file: App.tsx ~ line 35 ~ initializeFCM ~ error", error)
    }
  }

  useEffect(() => {
    initializeFCM()
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,

    backgroundColor: '#fff',
  },
});


