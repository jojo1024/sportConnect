# Optimisation des Composants - TerrainDetailsScreen et MatchDetailsScreen

## Vue d'ensemble

Cette optimisation vise à éliminer la duplication de code entre `TerrainDetailsScreen` et `MatchDetailsScreen` en créant des composants réutilisables.

## Composants Créés

### 1. ImageGallery
**Fichier :** `src/components/ImageGallery.tsx`

**Fonctionnalités :**
- Affichage d'images avec scroll horizontal
- Pagination automatique
- Gestion des images par défaut
- Hauteur configurable

**Props :**
- `images: string[]` - Liste des images
- `height?: number` - Hauteur du composant (défaut: 280)
- `showPagination?: boolean` - Afficher la pagination (défaut: true)

### 2. HeaderWithBackButton
**Fichier :** `src/components/HeaderWithBackButton.tsx`

**Fonctionnalités :**
- En-tête avec bouton retour
- Gradient optionnel
- Composant personnalisable à droite
- Titre optionnel

**Props :**
- `onBack: () => void` - Fonction de retour
- `title?: string` - Titre de l'en-tête
- `rightComponent?: React.ReactNode` - Composant à droite
- `showGradient?: boolean` - Afficher le gradient (défaut: true)

### 3. DetailCard
**Fichier :** `src/components/DetailCard.tsx`

**Fonctionnalités :**
- Carte d'informations avec titre
- Composant DetailRow réutilisable
- Support pour la copie de texte

**Props :**
- `title: string` - Titre de la section
- `children: React.ReactNode` - Contenu de la carte
- `style?: any` - Styles personnalisés

**DetailRow Props :**
- `icon: string` - Nom de l'icône Ionicons
- `label: string` - Label de l'information
- `value: string` - Valeur à afficher
- `onCopy?: () => void` - Fonction de copie
- `copied?: boolean` - État de copie
- `iconColor?: string` - Couleur de l'icône

### 4. MainInfoCard
**Fichier :** `src/components/MainInfoCard.tsx`

**Fonctionnalités :**
- Carte d'informations principales
- Titre et localisation
- Bouton d'édition optionnel

**Props :**
- `title: string` - Titre principal
- `location: string` - Localisation
- `onEdit?: () => void` - Fonction d'édition
- `showEditButton?: boolean` - Afficher le bouton d'édition

## Avantages de l'Optimisation

### 1. Réduction de Code
- **Avant :** ~920 lignes pour MatchDetailsScreen, ~473 lignes pour TerrainDetailsScreen
- **Après :** Réduction significative grâce aux composants réutilisables

### 2. Maintenabilité
- Code centralisé dans des composants dédiés
- Modifications plus faciles à appliquer
- Tests unitaires simplifiés

### 3. Cohérence
- Interface utilisateur uniforme
- Styles standardisés
- Comportements cohérents

### 4. Réutilisabilité
- Composants utilisables dans d'autres écrans
- Props flexibles pour différentes utilisations
- Architecture modulaire

## Utilisation

### TerrainDetailsScreen
```tsx
import ImageGallery from '../../components/ImageGallery';
import HeaderWithBackButton from '../../components/HeaderWithBackButton';
import DetailCard, { DetailRow } from '../../components/DetailCard';
import MainInfoCard from '../../components/MainInfoCard';

// Utilisation simplifiée
<HeaderWithBackButton onBack={() => navigation.goBack()} />
<ImageGallery images={terrain.terrainImages || []} height={280} />
<MainInfoCard
    title={terrain.terrainNom}
    location={terrain.terrainLocalisation}
    onEdit={handleEdit}
    showEditButton={true}
/>
```

### MatchDetailsScreen
```tsx
// Même structure avec composants réutilisables
<HeaderWithBackButton 
    onBack={() => navigation.goBack()} 
    rightComponent={rightComponent}
/>
<ImageGallery images={match.terrainImages || []} height={280} />
<MainInfoCard
    title={match.terrainNom}
    location={match.terrainLocalisation}
/>
```

## Prochaines Étapes

1. **Tests unitaires** pour chaque composant
2. **Documentation** des props avec TypeScript
3. **Storybook** pour la documentation visuelle
4. **Optimisation des performances** si nécessaire
5. **Extension** à d'autres écrans similaires

## Impact

- ✅ Code plus maintenable
- ✅ Interface utilisateur cohérente
- ✅ Réduction de la duplication
- ✅ Architecture modulaire
- ✅ Facilité d'évolution future 