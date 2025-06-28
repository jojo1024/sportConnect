# 🧪 Guide de test du refresh automatique des tokens

## 🎯 Objectif

Vérifier que le système de refresh automatique fonctionne correctement quand l'access token expire.

## 📋 Prérequis

1. **Application connectée** avec un utilisateur valide
2. **Console de développement** ouverte pour voir les logs
3. **Backend en cours d'exécution** sur `http://192.168.100.4:50006`

## 🧪 Tests disponibles

### 1. **🔍 Debug Tokens** (Test de base)
**Objectif :** Vérifier l'état actuel des tokens

**Résultat attendu :**
```
🧪 === TEST DE PERSISTANCE DES TOKENS ===
📊 État Redux:
  - User: [Nom] ([Role])
  - Access Token: Présent
  - Refresh Token: Présent
💾 État MMKV:
  - Access Token: Présent
  - Refresh Token: Présent
🔍 Cohérence Redux/MMKV:
  - Access Token cohérent: true
  - Refresh Token cohérent: true
🔑 Access Token Info: { utilisateurId: X, role: 'lambda', exp: Date, iat: Date }
  - Expire bientôt: false
  - Format valide: true
```

### 2. **🔄 Force Refresh** (Test manuel)
**Objectif :** Forcer manuellement le refresh des tokens

**Résultat attendu :**
```
🔄 === FORCE TOKEN REFRESH ===
✅ Refresh réussi
  - Nouveau access token: Présent
```

### 3. **🔄 Test Auto Refresh** (Test de requête)
**Objectif :** Tester le refresh via une requête API

**Résultat attendu :**
```
🔄 === TEST REFRESH AUTOMATIQUE ===
🔑 Token actuel: { utilisateurId: X, role: 'lambda', expiration: Date, expireBientot: false }
🚀 ~ Faire une requête API pour tester le refresh...
🚀 ~ Réponse reçue: 200 OK
✅ Requête réussie: { status: 'success', data: { accessToken: '...', refreshToken: '...' } }
ℹ️ Même token conservé (normal si pas expiré)
```

### 4. **⏰ Test Token Expiré** (Test avec API configurée)
**Objectif :** Tester avec l'API qui a les intercepteurs

**Résultat attendu :**
```
⏰ === TEST AVEC TOKEN EXPIRÉ ===
🚀 ~ Faire une requête avec l'API configurée...
✅ Requête réussie avec refresh automatique
```

### 5. **🔍 Vérifier Cohérence** (Test de persistance)
**Objectif :** Vérifier que les tokens sont cohérents entre Redux et MMKV

**Résultat attendu :**
```
🔍 === VÉRIFICATION COHÉRENCE TOKENS ===
📊 État après refresh:
  - Redux Access Token: Présent
  - Redux Refresh Token: Présent
  - MMKV Access Token: Présent
  - MMKV Refresh Token: Présent
🔍 Cohérence:
  - Access Token cohérent: true
  - Refresh Token cohérent: true
```

### 6. **🔄 Test Cycle Complet** (Test complet)
**Objectif :** Simuler un token expiré et vérifier le refresh automatique

**Résultat attendu :**
```
🔄 === TEST CYCLE COMPLET TOKEN ===
📊 État initial:
  - Access Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - Refresh Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

1️⃣ Simulation token expiré...
⏰ === SIMULATION TOKEN EXPIRÉ ===
🔑 Token actuel: { utilisateurId: X, role: 'lambda', expiration: Date, expireBientot: false }
✅ Token expiré simulé dans le store
  - Nouveau token (expiré): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

2️⃣ Faire une requête pour déclencher le refresh...
🚀 ~ Request interceptor ~ token: Présent
🚀 ~ Tentative de rafraîchissement du token...
🚀 ~ Refresh token utilisé: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🚀 ~ Réponse du refresh: { status: 'success', data: { accessToken: '...', refreshToken: '...' } }
🚀 ~ Nouveau access token reçu: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🚀 ~ Token rafraîchi avec succès, retry de la requête originale
✅ Requête réussie après refresh automatique

3️⃣ Vérification du nouveau token:
  - Ancien token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - Nouveau token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - Tokens différents: true
```

## 🔍 Logs à surveiller

### Logs de l'intercepteur de requête :
```
🚀 ~ Request interceptor ~ token: Présent/Absent
🚀 ~ Token proche de l'expiration, refresh préventif...
```

### Logs de l'intercepteur de réponse :
```
🚀 ~ Tentative de rafraîchissement du token...
🚀 ~ Refresh token utilisé: [début du token]...
🚀 ~ Réponse du refresh: { status: 'success', data: {...} }
🚀 ~ Nouveau access token reçu: [début du token]...
🚀 ~ Token rafraîchi avec succès, retry de la requête originale
```

### Logs d'erreur :
```
🚀 ~ Échec du rafraîchissement du token: [erreur]
🚀 ~ Détails de l'erreur: { message: '...', response: {...}, status: 401 }
```

## 🐛 Dépannage

### Problème : Refresh ne se déclenche pas
1. **Vérifiez que le token est vraiment expiré** :
   ```javascript
   // Dans la console
   const tokenInfo = tokenUtils.getTokenInfo(accessToken);
   console.log('Expiration:', tokenInfo.exp);
   console.log('Maintenant:', new Date());
   ```

2. **Vérifiez la configuration** :
   ```javascript
   console.log('TOKEN_CONFIG:', TOKEN_CONFIG);
   ```

3. **Vérifiez les logs du backend** :
   - Regardez les logs du serveur pour voir si la requête arrive
   - Vérifiez que le refresh token est valide en base

### Problème : Refresh échoue
1. **Vérifiez le refresh token** :
   ```javascript
   // Dans la console
   const refreshTokenInfo = tokenUtils.getTokenInfo(refreshToken);
   console.log('Refresh token valide:', refreshTokenInfo);
   ```

2. **Vérifiez la base de données** :
   - Le refresh token doit correspondre à celui stocké en base
   - L'utilisateur doit être actif (status = 1)

### Problème : Tokens non persistés
1. **Vérifiez Redux Persist** :
   ```javascript
   // Dans la console
   const state = store.getState();
   console.log('Redux state:', state.user);
   ```

2. **Vérifiez MMKV** :
   ```javascript
   // Dans la console
   const mmkvToken = mmkvStorage.getAccessToken();
   console.log('MMKV token:', mmkvToken);
   ```

## ✅ Critères de succès

Le test est réussi si :

1. **Token expiré détecté** : L'intercepteur détecte l'erreur 401
2. **Refresh automatique** : Le refresh token est utilisé pour obtenir un nouveau access token
3. **Requête retry** : La requête originale est rejouée avec le nouveau token
4. **Persistance** : Les nouveaux tokens sont sauvegardés dans Redux et MMKV
5. **Cohérence** : Redux et MMKV contiennent les mêmes tokens
6. **Pas de déconnexion** : L'utilisateur reste connecté

## 📝 Notes importantes

- **Access token** : 1 heure de durée de vie
- **Refresh token** : 30 jours de durée de vie
- **Déconnexion automatique** : Désactivée par défaut
- **Debug** : Activé uniquement en développement
- **Logs** : Détaillés pour faciliter le diagnostic 