# Guide des Toast d'Erreur de 3 Secondes

## Vue d'ensemble

Cette fonctionnalité permet d'afficher automatiquement des Toast d'erreur de 3 secondes lorsqu'une erreur serveur se produit lors du fetch des données dans l'écran des statistiques. Les Toast sont plus légers et moins intrusifs que les notifications modales.

## Fonctionnalités

### ✅ Ce qui a été implémenté

1. **Toast automatiques pour toutes les actions** : 
   - **Erreurs** : Toast rouge de 3 secondes pour les erreurs serveur
   - **Succès** : Toast vert de 2 secondes pour les actions réussies
   - **Périodes** : Toast vert pour confirmer les changements de période
   - **Dates personnalisées** : Toast vert pour confirmer la sélection de date
   - **Rafraîchissement** : Toast vert pour confirmer le rafraîchissement
   - **Graphique** : Toast vert rapide (1.5s) pour la mise à jour du graphique

2. **Gestion complète des interactions** :
   - Changement de période (aujourd'hui, semaine, mois, etc.)
   - Sélection de date personnalisée
   - Rafraîchissement (pull-to-refresh)
   - Chargement du graphique hebdomadaire
   - Toutes les erreurs serveur

3. **Interface utilisateur moderne** :
   - Toast colorés selon le type (vert pour succès, rouge pour erreur)
   - Position en haut de l'écran
   - Animation fluide d'entrée et de sortie
   - Bouton de fermeture manuelle
   - Durées d'affichage adaptées selon l'action

## Architecture technique

### Composants créés/modifiés

1. **`Toast.tsx`** (Nouveau) :
   - Composant Toast personnalisé avec animations
   - Support de différents types (success, error, warning, info)
   - Auto-fermeture avec timer
   - Animation slide down depuis le haut
   - Bouton de fermeture manuelle

2. **`useToast.ts`** (Nouveau) :
   - Hook personnalisé pour gérer les Toast
   - Fonctions `showError`, `showSuccess`, `showWarning`, `showInfo`
   - Gestion de l'état visible/invisible
   - Configuration de la durée d'affichage

3. **`useStatistics.ts`** :
   - Remplacement de `useCustomAlert` par `useToast`
   - Utilisation de `showError` pour les notifications d'erreur
   - Simplification des appels (plus besoin de titre, juste le message)

4. **`StatisticsScreen.tsx`** :
   - Intégration du composant `Toast`
   - Remplacement de `CustomAlert` par `Toast`
   - Utilisation de `showError` pour toutes les erreurs

### Hook `useToast`

Le hook `useToast` fournit une interface simple pour afficher des Toast :

```typescript
const { showError, showSuccess, showWarning, showInfo } = useToast();

// Afficher un toast d'erreur de 3 secondes
showError('Message d\'erreur', 3000);

// Afficher un toast de succès de 2 secondes
showSuccess('Opération réussie', 2000);
```

## Cas d'usage couverts

### 1. Changement de période (Succès)
- **Quand** : L'utilisateur sélectionne une nouvelle période
- **Action** : Chargement des données filtrées
- **Toast** : "Période changée : [Nom de la période]" (vert, 2s)

### 2. Sélection de date personnalisée (Succès)
- **Quand** : L'utilisateur sélectionne une date spécifique
- **Action** : Chargement des données pour cette date
- **Toast** : "Date sélectionnée : [Date formatée]" (vert, 2s)

### 3. Rafraîchissement (Succès)
- **Quand** : L'utilisateur fait un pull-to-refresh
- **Action** : Rechargement de toutes les données
- **Toast** : "Données rafraîchies avec succès" (vert, 2s)

### 4. Mise à jour du graphique (Succès)
- **Quand** : Chargement des données du graphique hebdomadaire
- **Action** : Récupération des revenus quotidiens
- **Toast** : "Graphique mis à jour" (vert, 1.5s)

### 5. Erreurs serveur (Erreur)
- **Quand** : Une erreur se produit lors d'un appel API
- **Action** : Affichage de l'erreur
- **Toast** : Message d'erreur du serveur (rouge, 3s)

## Messages des Toast

### Messages de succès
- **Changement de période** : "Période changée : [Nom de la période]"
- **Date personnalisée** : "Date sélectionnée : [Date formatée]"
- **Rafraîchissement** : "Données rafraîchies avec succès"
- **Graphique** : "Graphique mis à jour"

### Messages d'erreur
Les messages d'erreur sont extraits de la réponse du serveur dans cet ordre :
1. `error.response.data.message` (message du serveur)
2. Message par défaut selon le contexte

### Messages d'erreur par défaut
- Chargement général : "Impossible de charger les réservations"
- Graphique : "Erreur lors du chargement du graphique"
- Rafraîchissement : "Erreur lors du rafraîchissement"
- Filtrage : "Erreur lors du changement de période"
- Date personnalisée : "Erreur lors du chargement de la date"

## Caractéristiques du Toast

### Design
- **Position** : Absolute en haut de l'écran (top: 50px)
- **Largeur** : Responsive (left: 16px, right: 16px)
- **Hauteur** : Minimum 48px, s'adapte au contenu
- **Couleurs de fond** :
  - Rouge (#EF4444) pour les erreurs
  - Vert (#10B981) pour les succès
  - Jaune (#F59E0B) pour les avertissements
  - Bleu (COLORS.primary) pour les informations
- **Ombre** : Élévation pour un effet 3D

### Animation
- **Entrée** : Slide down depuis le haut + fade in (300ms)
- **Sortie** : Slide up vers le haut + fade out (300ms)
- **Timing** : Utilise `useNativeDriver: true` pour les performances

### Interaction
- **Auto-fermeture** : Après la durée spécifiée selon le type
- **Fermeture manuelle** : Bouton X en haut à droite
- **Multi-lignes** : Support jusqu'à 3 lignes de texte

### Durées d'affichage
- **Actions rapides** (graphique) : 1.5 secondes
- **Actions normales** (périodes, rafraîchissement) : 2 secondes
- **Erreurs** : 3 secondes

## Test de la fonctionnalité

### Méthode 1 : Test des actions de succès
1. Ouvrir l'écran des statistiques
2. Tester les changements de période :
   - Cliquer sur "Cette semaine" → Toast vert: "Période changée : Cette semaine"
   - Cliquer sur "Ce mois" → Toast vert: "Période changée : Ce mois"
3. Tester les dates personnalisées :
   - Cliquer sur le calendrier → Sélectionner une date
   - Toast vert: "Date sélectionnée : [date formatée]"
4. Tester le rafraîchissement :
   - Pull-to-refresh → Toast vert: "Données rafraîchies avec succès"

### Méthode 2 : Test des erreurs
1. Désactiver le WiFi/Données mobiles
2. Essayer de charger les données
3. Vérifier l'apparition du Toast rouge avec message d'erreur

### Points à vérifier
- ✅ Les Toast apparaissent en haut de l'écran avec animation
- ✅ Les Toast verts pour les actions de succès (2 secondes)
- ✅ Les Toast rouges pour les erreurs (3 secondes)
- ✅ Messages appropriés selon le contexte
- ✅ Durées d'affichage différentes selon l'action
- ✅ Animation fluide d'entrée et de sortie
- ✅ Bouton de fermeture manuelle disponible

## Extensibilité

Cette implémentation peut être facilement étendue à d'autres écrans :

1. **Copier le pattern** :
   ```typescript
   const { showError } = useToast();
   
   try {
       // Appel API
   } catch (error: any) {
       const errorMsg = error?.response?.data?.message || 'Message par défaut';
       showError(errorMsg, 3000);
   }
   ```

2. **Ajouter le composant** :
   ```typescript
   <Toast
       visible={toastVisible}
       message={toastConfig?.message || ''}
       type={toastConfig?.type}
       duration={toastConfig?.duration}
       onHide={hideToast}
   />
   ```

## Avantages des Toast vs Notifications modales

### Toast
- ✅ Moins intrusif
- ✅ N'interrompt pas le flux utilisateur
- ✅ Animation fluide
- ✅ Position fixe en haut
- ✅ Auto-fermeture
- ✅ Plus moderne et élégant

### Notifications modales
- ❌ Interrompt le flux utilisateur
- ❌ Nécessite une action de l'utilisateur
- ❌ Plus lourd visuellement
- ❌ Peut masquer le contenu important

## Maintenance

### Ajout de nouveaux cas d'erreur
1. Identifier la fonction qui fait l'appel API
2. Ajouter un bloc `try/catch`
3. Utiliser `showError` avec le message approprié

### Modification du délai
Pour changer le délai de 3 secondes, modifier la valeur dans les appels `showError` :
```typescript
showError('Message', 5000); // 5 secondes
```

### Personnalisation des messages
Les messages peuvent être personnalisés selon le contexte en modifiant les messages par défaut dans les blocs `catch`.

### Ajout de nouveaux types
Pour ajouter un nouveau type de Toast, modifier le composant `Toast.tsx` et le hook `useToast.ts`. 