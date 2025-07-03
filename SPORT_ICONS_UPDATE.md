# 🏈 Mise à Jour des Icônes de Sports

## 🎯 Objectif

Mettre à jour les icônes des sports dans la base de données pour utiliser les bonnes bibliothèques d'icônes (Ionicons et MaterialCommunityIcons) avec des couleurs spécifiques.

## 📝 **SQL pour Mettre à Jour la Base de Données**

```sql
-- Mettre à jour les icônes avec les bonnes bibliothèques
UPDATE sports SET sportIcone = 'football-outline' WHERE sportNom = 'Football';
UPDATE sports SET sportIcone = 'basketball-outline' WHERE sportNom = 'Basketball';
UPDATE sports SET sportIcone = 'tennisball-outline' WHERE sportNom = 'Tennis';
UPDATE sports SET sportIcone = 'handball-outline' WHERE sportNom = 'Handball';
UPDATE sports SET sportIcone = 'paddle-outline' WHERE sportNom = 'Paddle';
UPDATE sports SET sportIcone = 'golf-outline' WHERE sportNom = 'Golf';
UPDATE sports SET sportIcone = 'volleyball-outline' WHERE sportNom = 'Volleyball';
UPDATE sports SET sportIcone = 'badminton-outline' WHERE sportNom = 'Badminton';
```

## 🎨 **Mapping des Icônes et Couleurs**

### **Ionicons**
| Sport | Icône | Couleur | Code |
|-------|-------|---------|------|
| Football | `football-outline` | Orange | `#FF6600` |
| Basketball | `basketball-outline` | Orange-Rouge | `#FF6B35` |
| Tennis | `tennisball-outline` | Vert | `#4CAF50` |

### **MaterialCommunityIcons**
| Sport | Icône | Couleur | Code |
|-------|-------|---------|------|
| Handball | `hand-ball` | Bleu | `#2196F3` |
| Paddle | `table-tennis` | Violet | `#9C27B0` |
| Golf | `golf` | Vert | `#4CAF50` |
| Volleyball | `volleyball` | Orange | `#FF9800` |
| Badminton | `badminton` | Rose | `#E91E63` |

## 🔧 **Modifications du Code**

### **SportCard.tsx**
- ✅ Ajout de `MaterialCommunityIcons` import
- ✅ Fonction `getSportIcon()` avec mapping bibliothèque
- ✅ Fonction `getSportColor()` avec couleurs spécifiques
- ✅ Rendu conditionnel selon la bibliothèque

### **SportSelectorBottomSheet.tsx**
- ✅ Ajout de `MaterialCommunityIcons` import
- ✅ Même logique de mapping que SportCard
- ✅ Fonction `renderSportIcon()` pour affichage dynamique

## 🚀 **Résultat Attendu**

Après la mise à jour de la base de données et du code :

1. **Toutes les icônes s'affichent** correctement
2. **Couleurs spécifiques** pour chaque sport
3. **Bibliothèques appropriées** (Ionicons + MaterialCommunityIcons)
4. **Cohérence visuelle** dans toute l'application

## 📋 **Vérification**

Pour vérifier que tout fonctionne :

1. **Exécuter le SQL** de mise à jour
2. **Redémarrer l'application**
3. **Ouvrir le sélecteur de sport**
4. **Vérifier** que toutes les icônes s'affichent avec les bonnes couleurs

## 🎯 **Icônes Utilisées**

```jsx
// Football
<Ionicons name="football-outline" size={24} color="#FF6600" />

// Basketball
<Ionicons name="basketball-outline" size={24} color="#FF6B35" />

// Tennis
<Ionicons name="tennisball-outline" size={24} color="#4CAF50" />

// Handball
<MaterialCommunityIcons name="hand-ball" size={24} color="#2196F3" />

// Paddle (remplacé par table-tennis)
<MaterialCommunityIcons name="table-tennis" size={24} color="#9C27B0" />

// Golf
<MaterialCommunityIcons name="golf" size={24} color="#4CAF50" />

// Volleyball
<MaterialCommunityIcons name="volleyball" size={24} color="#FF9800" />

// Badminton
<MaterialCommunityIcons name="badminton" size={24} color="#E91E63" />
``` 