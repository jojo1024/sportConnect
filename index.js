import 'react-native-reanimated'
import 'expo-dev-client';
import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';

import App from './src/App';
import { onBackgroundMessageReceived } from './src/firebase/firebase';

// Configuration du gestionnaire de messages en arrière-plan
messaging().setBackgroundMessageHandler(onBackgroundMessageReceived);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
