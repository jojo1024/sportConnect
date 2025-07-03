# 🏈 Bottom Sheet pour la Sélection des Sports

## 🎯 Objectif

Transformer le sélecteur de sport pour qu'il utilise un bottom sheet similaire à celui des terrains, offrant une expérience utilisateur cohérente et intuitive.

## 🔧 Composants Créés

### 1. **SportCard.tsx**
Composant pour afficher un sport individuel dans la liste du bottom sheet.

**Fonctionnalités :**
- Affichage de l'icône du sport
- Nom du sport
- Statut (Actif/Inactif)
- Indicateur de sélection
- Styles cohérents avec FieldCard

### 2. **SportsBottomSheet.tsx**
Bottom sheet pour la sélection des sports avec recherche.

**Fonctionnalités :**
- Barre de recherche
- Liste scrollable des sports
- Fermeture par glissement ou tap
- Hauteur adaptative

### 3. **SportSelectorBottomSheet.tsx**
Composant de sélection qui ouvre le bottom sheet.

**Fonctionnalités :**
- Affichage du sport sélectionné
- Placeholder quand aucun sport n'est sélectionné
- Indicateur de chargement
- Style cohérent avec FieldSelector

## 🔄 Modifications Apportées

### 1. **useCreateParty.ts**
```typescript
// Ajout du state pour la recherche des sports
const [sportSearchQuery, setSportSearchQuery] = useState('');

// Filtrage des sports
const filteredSports = activeSports.filter(sport =>
    sport.sportNom.toLowerCase().includes(sportSearchQuery.toLowerCase())
);

// Fonction de mise à jour de la recherche
const updateSportSearchQuery = useCallback((query: string) => {
    setSportSearchQuery(query);
}, []);
```

### 2. **CreatePartyScreen.tsx**
```typescript
// Ajout de la référence du bottom sheet
const sportBottomSheetRef = useRef<any>(null);

// Fonctions de gestion
const openSportSelector = () => {
    sportBottomSheetRef.current?.open();
};

const handleSportSelection = (sport: Sport) => {
    setSport(sport);
    sportBottomSheetRef.current?.close();
};

// Remplacement du SportSelector par SportSelectorBottomSheet
<SportSelectorBottomSheet
    selectedSport={selectedSport}
    loading={loadingSports}
    onPress={openSportSelector}
/>

// Ajout du bottom sheet
<SportsBottomSheet
    bottomSheetRef={sportBottomSheetRef}
    searchQuery={sportSearchQuery}
    onSearchChange={updateSportSearchQuery}
    filteredSports={filteredSports}
    selectedSportId={formData.sportId}
    onSportSelect={handleSportSelection}
/>
```

## 🎨 Design et UX

### Cohérence Visuelle
- **SportCard** : Design similaire à FieldCard
- **SportsBottomSheet** : Même structure que FieldsBottomSheet
- **SportSelectorBottomSheet** : Style cohérent avec FieldSelector

### Expérience Utilisateur
- **Recherche** : Filtrage en temps réel
- **Sélection** : Feedback visuel immédiat
- **Navigation** : Fermeture intuitive
- **Accessibilité** : Support du clavier et des gestes

## 📱 Fonctionnalités

### Recherche
- Filtrage par nom de sport
- Recherche insensible à la casse
- Mise à jour en temps réel

### Sélection
- Indicateur visuel du sport sélectionné
- Fermeture automatique après sélection
- Persistance de la sélection

### Performance
- Rendu optimisé avec FlatList
- Chargement progressif
- Gestion mémoire efficace

## 🔍 Utilisation

### Pour l'utilisateur
1. **Taper** sur le sélecteur de sport
2. **Rechercher** un sport dans la barre de recherche
3. **Sélectionner** le sport désiré
4. Le bottom sheet se ferme automatiquement

### Pour le développeur
```typescript
// Import des composants
import { 
    SportSelectorBottomSheet, 
    SportsBottomSheet 
} from '../components/createParty';

// Utilisation dans le hook
const {
    sportSearchQuery,
    filteredSports,
    updateSportSearchQuery,
    // ...
} = useCreateParty();
```

## ✅ Avantages

1. **Cohérence** : Même UX que la sélection des terrains
2. **Recherche** : Facilite la sélection parmi de nombreux sports
3. **Performance** : Rendu optimisé pour les grandes listes
4. **Accessibilité** : Support des gestes et du clavier
5. **Maintenabilité** : Code modulaire et réutilisable

## 🚀 Prochaines Étapes

1. **Tests** : Valider le comportement sur différents appareils
2. **Optimisation** : Améliorer les performances si nécessaire
3. **Accessibilité** : Ajouter des labels pour les lecteurs d'écran
4. **Internationalisation** : Supporter les traductions

## 📝 Notes Techniques

- Utilisation de `react-native-raw-bottom-sheet` pour la cohérence
- Gestion d'état optimisée avec `useCallback`
- Styles cohérents avec le design system existant
- Support des icônes Ionicons pour les sports 