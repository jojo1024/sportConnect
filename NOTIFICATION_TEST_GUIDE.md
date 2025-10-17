# Guide de Test des Notifications Push

## Problèmes corrigés

1. **Permissions Android ajoutées** :
   - `POST_NOTIFICATIONS` : Permission pour afficher les notifications
   - `WAKE_LOCK` : Permission pour réveiller l'appareil

2. **Services Firebase configurés** :
   - Service de messagerie Firebase
   - Service de messagerie en arrière-plan

3. **Gestion des notifications améliorée** :
   - Vérification des permissions avant affichage
   - Logs détaillés pour le debugging
   - Gestion des erreurs

## Étapes de test

### 1. Rebuild de l'application
```bash
# Nettoyer et rebuilder
npm run clean
npm run prebuild
npm run android
```

### 2. Vérifier les logs
Surveillez les logs pour voir :
- `🚀 ~ file: firebase.ts ~ line 19 ~ displayNotification ~ Starting notification display`
- `🚀 ~ file: firebase.ts ~ line 22 ~ displayNotification ~ Permission settings`
- `🚀 ~ file: firebase.ts ~ line 30 ~ displayNotification ~ Channel created`
- `🚀 ~ file: firebase.ts ~ line 50 ~ displayNotification ~ Notification displayed successfully`

### 3. Tester les notifications

#### Test 1 : App en premier plan
1. Ouvrez l'app
2. Envoyez une notification depuis Firebase Console
3. La notification devrait s'afficher immédiatement

#### Test 2 : App en arrière-plan
1. Mettez l'app en arrière-plan
2. Envoyez une notification
3. La notification devrait apparaître dans la barre de notifications

#### Test 3 : App fermée
1. Fermez complètement l'app
2. Envoyez une notification
3. La notification devrait apparaître et ouvrir l'app au clic

## Format de notification recommandé

```json
{
  "notification": {
    "title": "Titre de la notification",
    "body": "Corps de la notification"
  },
  "data": {
    "customData": "valeur"
  },
  "to": "TOKEN_DEVICE"
}
```

## Dépannage

### Si les notifications ne s'affichent toujours pas :

1. **Vérifiez les permissions** :
   - Allez dans Paramètres > Apps > Ibori > Notifications
   - Assurez-vous que les notifications sont activées

2. **Vérifiez les logs** :
   - Cherchez les messages d'erreur dans les logs
   - Vérifiez que les permissions sont accordées (authorizationStatus === 1)

3. **Testez avec une notification simple** :
   - Utilisez Firebase Console pour envoyer une notification de test
   - Vérifiez que le token FCM est correct

4. **Redémarrez l'app** :
   - Fermez complètement l'app
   - Relancez-la pour réinitialiser les services

## Logs importants à surveiller

- `🚀 ~ file: firebase.ts:19 ~ registerDeviceForRemoteMessages ~ pushToken:` - Token FCM
- `🚀 ~ file: firebase.ts ~ line 49 ~ onMessageReceived ~ message` - Message reçu
- `🚀 ~ file: firebase.ts ~ line 52 ~ onMessageReceived ~ Displaying notification` - Affichage en cours
- `🚀 ~ file: firebase.ts ~ line 50 ~ displayNotification ~ Notification displayed successfully` - Succès
