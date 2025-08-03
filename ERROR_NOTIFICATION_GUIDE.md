# Guide des Notifications d'Erreur de 3 Secondes

## Vue d'ensemble

Cette fonctionnalité permet d'afficher automatiquement des notifications d'erreur de 3 secondes lorsqu'une erreur serveur se produit lors du fetch des données dans l'écran des statistiques.

## Fonctionnalités

### ✅ Ce qui a été implémenté

1. **Notification automatique de 3 secondes** : Les erreurs serveur affichent une notification qui se ferme automatiquement après 3 secondes
2. **Gestion des erreurs dans tous les cas d'usage** :
   - Chargement initial des données
   - Changement de période (aujourd'hui, semaine, mois, etc.)
   - Rafraîchissement (pull-to-refresh)
   - Chargement du graphique hebdomadaire
   - Filtrage par date personnalisée

3. **Interface utilisateur cohérente** :
   - Notification rouge avec icône d'alerte
   - Titre : "Erreur de chargement"
   - Message : Détails de l'erreur du serveur
   - Auto-fermeture sans bouton visible

## Architecture technique

### Composants modifiés

1. **`CustomAlert.tsx`** :
   - Ajout de la logique d'auto-fermeture avec `useEffect`
   - Support des propriétés `autoClose` et `autoCloseDelay`
   - Timer automatique pour fermer la notification

2. **`useStatistics.ts`** :
   - Remplacement de `showError` par `showAutoClose`
   - Ajout de notifications d'erreur dans `loadReservationsForStatus`
   - Ajout de notifications d'erreur dans `loadDataWithFilter`

3. **`StatisticsScreen.tsx`** :
   - Intégration du composant `CustomAlert`
   - Ajout de notifications d'erreur dans `loadWeeklyChartData`
   - Ajout de notifications d'erreur dans `onRefresh`
   - Ajout de notifications d'erreur dans `handlePeriodSelect`

### Hook `useCustomAlert`

Le hook `useCustomAlert` fournit la fonction `showAutoClose` qui permet d'afficher des notifications avec auto-fermeture :

```typescript
const { showAutoClose } = useCustomAlert();

showAutoClose(
    'Erreur de chargement',    // Titre
    'Message d\'erreur',       // Message
    'error',                   // Type (success, error, warning, info)
    3000                       // Délai en millisecondes
);
```

## Cas d'usage couverts

### 1. Erreur lors du chargement initial
- **Quand** : Au montage du composant StatisticsScreen
- **Action** : Chargement des données pour "aujourd'hui"
- **Notification** : "Erreur de chargement" + message du serveur

### 2. Erreur lors du changement de période
- **Quand** : L'utilisateur sélectionne une nouvelle période
- **Action** : Chargement des données filtrées
- **Notification** : "Erreur de filtrage" + message du serveur

### 3. Erreur lors du rafraîchissement
- **Quand** : L'utilisateur fait un pull-to-refresh
- **Action** : Rechargement de toutes les données
- **Notification** : "Erreur de rafraîchissement" + message du serveur

### 4. Erreur lors du chargement du graphique
- **Quand** : Chargement des données du graphique hebdomadaire
- **Action** : Récupération des revenus quotidiens
- **Notification** : "Erreur de chargement" + message du serveur

### 5. Erreur lors du filtrage par date
- **Quand** : L'utilisateur sélectionne une date spécifique
- **Action** : Chargement des données pour cette date
- **Notification** : "Erreur de filtrage" + message du serveur

## Messages d'erreur

Les messages d'erreur sont extraits de la réponse du serveur dans cet ordre :
1. `error.response.data.message` (message du serveur)
2. Message par défaut selon le contexte

### Messages par défaut
- Chargement général : "Impossible de charger les réservations"
- Graphique : "Erreur lors du chargement du graphique"
- Rafraîchissement : "Erreur lors du rafraîchissement"
- Filtrage : "Erreur lors du changement de période"

## Test de la fonctionnalité

### Méthode 1 : Simulation d'erreur réseau
1. Ouvrir l'écran des statistiques
2. Désactiver le WiFi/Données mobiles
3. Essayer de charger les données
4. Vérifier l'apparition de la notification rouge

### Méthode 2 : Erreur serveur simulée
1. Modifier temporairement l'URL de l'API pour une URL invalide
2. Essayer de charger les données
3. Vérifier l'apparition de la notification

### Points à vérifier
- ✅ La notification apparaît immédiatement
- ✅ Le titre est "Erreur de chargement"
- ✅ Le message contient l'erreur du serveur
- ✅ L'icône est rouge (type: error)
- ✅ La notification disparaît après 3 secondes
- ✅ Pas de bouton "OK" visible (auto-fermeture)

## Extensibilité

Cette implémentation peut être facilement étendue à d'autres écrans :

1. **Copier le pattern** :
   ```typescript
   const { showAutoClose } = useCustomAlert();
   
   try {
       // Appel API
   } catch (error: any) {
       const errorMsg = error?.response?.data?.message || 'Message par défaut';
       showAutoClose('Titre', errorMsg, 'error', 3000);
   }
   ```

2. **Ajouter le composant** :
   ```typescript
   <CustomAlert
       visible={!!alertConfig}
       title={alertConfig?.title || ''}
       message={alertConfig?.message || ''}
       type={alertConfig?.type}
       autoClose={alertConfig?.autoClose}
       autoCloseDelay={alertConfig?.autoCloseDelay}
       onConfirm={alertConfig?.onConfirm}
   />
   ```

## Maintenance

### Ajout de nouveaux cas d'erreur
1. Identifier la fonction qui fait l'appel API
2. Ajouter un bloc `try/catch`
3. Utiliser `showAutoClose` avec le message approprié

### Modification du délai
Pour changer le délai de 3 secondes, modifier la valeur dans les appels `showAutoClose` :
```typescript
showAutoClose('Titre', 'Message', 'error', 5000); // 5 secondes
```

### Personnalisation des messages
Les messages peuvent être personnalisés selon le contexte en modifiant les messages par défaut dans les blocs `catch`. 