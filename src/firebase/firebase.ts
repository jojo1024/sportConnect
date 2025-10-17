// import { updateAuth } from "../store/authSlice";
import notifee, { AndroidBadgeIconType, AndroidImportance, AndroidStyle, AndroidVisibility } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import { Platform } from 'react-native';
import { useAppSelector } from '../store/hooks/hooks';
import { selectUser, updateUser } from '../store/slices/userSlice';
import { authService } from '../services';
import { store } from '../store';

/**
 * Recupère un token pour le device et l'enregistre sur globalApi
 */
export const registerDeviceForRemoteMessages = async () => {
    try {

        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        const authStatus = await messaging().requestPermission();
        const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        
        console.log("🚀 ~ registerDeviceForRemoteMessages ~ enabled:", enabled)
        if(enabled) {            
            await messaging().registerDeviceForRemoteMessages();
            const newPushToken = await messaging().getToken();
            const user = store.getState().user.user;
            console.log("🚀 ~ registerDeviceForRemoteMessages ~ user:", user)
            console.log("🚀 ~ file: firebase.ts:19 ~ registerDeviceForRemoteMessages ~ pushToken:", newPushToken)
            if(user?.utilisateurId) {
                await authService.updateFCMToken(user?.utilisateurId, newPushToken);
                store.dispatch(updateUser({ ...user, fcmToken: newPushToken }));
            }
        }

    } catch (error) {
        console.log("🚀 ~ file: firebase.ts ~ line 19 ~ registerDevice ~ error", error)
    }
}

const displayNotification = async (title: string, body: string, data: string = "") => {
    try {
        console.log("🚀 ~ file: firebase.ts ~ line 19 ~ displayNotification ~ Starting notification display:", { title, body });
        
        // Request permissions (required for iOS)
        const settings = await notifee.requestPermission();
        console.log("🚀 ~ file: firebase.ts ~ line 22 ~ displayNotification ~ Permission settings:", settings);
        
        if (settings.authorizationStatus === 1) { // AuthorizationStatus.AUTHORIZED
            // Create a channel (required for Android)
            const channelId = await notifee.createChannel({
                id: 'default-sound',
                name: 'Important Notifications',
                importance: AndroidImportance.HIGH,
                sound: 'default',
                visibility: AndroidVisibility.PUBLIC
            });
            
            console.log("🚀 ~ file: firebase.ts ~ line 30 ~ displayNotification ~ Channel created:", channelId);
            
            await notifee.displayNotification({
                title: title,
                body: body,
                data: data ? JSON.parse(data) : {},
                android: {
                    channelId,
                    style: { type: AndroidStyle.BIGTEXT, text: body },
                    importance: AndroidImportance.HIGH,
                    sound: 'default',
                    pressAction: {
                        id: 'default',
                    },
                    badgeIconType: AndroidBadgeIconType.LARGE,
                    visibility: AndroidVisibility.PUBLIC,
                    timestamp: Date.now(),
                    showTimestamp: true,
                    smallIcon: 'splashscreen_logo', // Nom de votre icône

                },
            });
            
            console.log("🚀 ~ file: firebase.ts ~ line 50 ~ displayNotification ~ Notification displayed successfully");
        } else {
            console.log("🚀 ~ file: firebase.ts ~ line 52 ~ displayNotification ~ Permission not granted:", settings.authorizationStatus);
        }
    } catch (error) {
        console.log("🚀 ~ file: firebase.ts ~ line 55 ~ displayNotification ~ Error:", error);
    }
}


export const onMessageReceived = async (message: any) => {
    console.log("🚀 ~ file: firebase.ts ~ line 49 ~ onMessageReceived ~ message", message)
    
    // Vérifier si le message contient une notification
    if (message.notification) {
        const { title, body } = message.notification;
        console.log("🚀 ~ file: firebase.ts ~ line 52 ~ onMessageReceived ~ Displaying notification:", { title, body });
        await displayNotification(title, body, JSON.stringify(message.data || {}));
    } else {
        console.log("🚀 ~ file: firebase.ts ~ line 55 ~ onMessageReceived ~ No notification payload found");
    }
}

export const onBackgroundMessageReceived = async (message: any) => {
    console.log("🚀 ~ file: firebase.ts ~ line 62 ~ onBackgroundMessageReceived ~ message", message)
    
    // Vérifier si le message contient une notification
    if (message.notification) {
        const { title, body } = message.notification;
        console.log("🚀 ~ file: firebase.ts ~ line 65 ~ onBackgroundMessageReceived ~ Displaying background notification:", { title, body });
        await displayNotification(title, body, JSON.stringify(message.data || {}));
    } else {
        console.log("🚀 ~ file: firebase.ts ~ line 68 ~ onBackgroundMessageReceived ~ No notification payload found");
    }
}

export const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
  
      console.log(granted === PermissionsAndroid.RESULTS.GRANTED
        ? '✅ Permission notifications accordée'
        : '❌ Permission notifications refusée');
    }
  };