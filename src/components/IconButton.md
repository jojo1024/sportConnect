# IconButton Component

Le composant `IconButton` est un composant réutilisable pour créer des boutons avec icône et texte dans un style outline. Il est particulièrement utile pour les actions secondaires comme "Modifier le profil", "Ajouter", etc.

## Utilisation

```tsx
import IconButton from '../components/IconButton';

// Exemple basique
<IconButton
    onPress={() => console.log('Button pressed')}
    title="Modifier le profil"
    iconName="edit"
    iconType="material"
/>

// Exemple avec personnalisation complète
<IconButton
    onPress={handleEdit}
    title="Ajouter un terrain"
    iconName="add"
    iconType="material"
    iconSize={20}
    iconColor={COLORS.primary}
    textColor={COLORS.primary}
    borderColor={COLORS.primary}
    backgroundColor="#fff"
    paddingHorizontal={16}
    paddingVertical={8}
    borderRadius={20}
    disabled={false}
/>
```

## Propriétés

### Propriétés obligatoires
- `onPress: () => void` - Fonction appelée lors du clic sur le bouton
- `title: string` - Texte affiché sur le bouton
- `iconName: string` - Nom de l'icône à afficher

### Propriétés optionnelles
- `iconType?: 'material' | 'ionicons' | 'fontawesome'` - Type d'icône (défaut: 'material')
- `iconSize?: number` - Taille de l'icône (défaut: 18)
- `iconColor?: string` - Couleur de l'icône (défaut: COLORS.primary)
- `textColor?: string` - Couleur du texte (défaut: COLORS.primary)
- `borderColor?: string` - Couleur de la bordure (défaut: COLORS.primary)
- `backgroundColor?: string` - Couleur de fond (défaut: '#fff')
- `disabled?: boolean` - Désactive le bouton (défaut: false)
- `style?: ViewStyle` - Styles personnalisés pour le conteneur
- `textStyle?: TextStyle` - Styles personnalisés pour le texte
- `paddingHorizontal?: number` - Padding horizontal (défaut: 16)
- `paddingVertical?: number` - Padding vertical (défaut: 8)
- `borderRadius?: number` - Rayon de bordure (défaut: 20)

## Types d'icônes supportés

### Material Icons (défaut)
```tsx
<IconButton
    iconName="edit"
    iconType="material"
    title="Modifier"
/>
```

### Ionicons
```tsx
<IconButton
    iconName="add-circle"
    iconType="ionicons"
    title="Ajouter"
/>
```

### FontAwesome
```tsx
<IconButton
    iconName="plus"
    iconType="fontawesome"
    title="Créer"
/>
```

## Exemples d'utilisation

### Bouton d'édition de profil
```tsx
<IconButton
    onPress={handleEditProfile}
    title="Modifier le profil"
    iconName="edit"
    iconType="material"
    iconSize={18}
    iconColor={COLORS.primary}
    textColor={COLORS.primary}
    borderColor={COLORS.primary}
    backgroundColor="#fff"
    paddingHorizontal={16}
    paddingVertical={8}
    borderRadius={20}
    style={{ marginTop: 8 }}
/>
```

### Bouton d'ajout avec état désactivé
```tsx
<IconButton
    onPress={handleAdd}
    title="Ajouter un terrain"
    iconName="add"
    iconType="material"
    disabled={!canAdd}
    iconColor={!canAdd ? COLORS.gray[400] : COLORS.primary}
    textColor={!canAdd ? COLORS.gray[400] : COLORS.primary}
    borderColor={!canAdd ? COLORS.gray[400] : COLORS.primary}
/>
```

### Bouton avec style personnalisé
```tsx
<IconButton
    onPress={handleAction}
    title="Action personnalisée"
    iconName="settings"
    iconType="ionicons"
    iconSize={20}
    iconColor="#007AFF"
    textColor="#007AFF"
    borderColor="#007AFF"
    backgroundColor="#F0F8FF"
    paddingHorizontal={20}
    paddingVertical={12}
    borderRadius={25}
    style={{ marginHorizontal: 16 }}
    textStyle={{ fontSize: 16, fontWeight: '600' }}
/>
```

## Migration depuis les anciens boutons

### Depuis ProfileHeader
```tsx
// Avant
<TouchableOpacity style={styles.editButton} onPress={onEdit}>
    <MaterialIcons name="edit" size={18} color={COLORS.primary} />
    <Text style={styles.editText}>Modifier le profil</Text>
</TouchableOpacity>

// Après
<IconButton
    onPress={onEdit}
    title="Modifier le profil"
    iconName="edit"
    iconType="material"
    iconSize={18}
    iconColor={COLORS.primary}
    textColor={COLORS.primary}
    borderColor={COLORS.primary}
    backgroundColor="#fff"
    paddingHorizontal={16}
    paddingVertical={8}
    borderRadius={20}
    style={styles.editButton}
/>
```

## Avantages

1. **Réutilisabilité** - Un seul composant pour tous les boutons avec icône et texte
2. **Cohérence** - Style uniforme dans toute l'application
3. **Flexibilité** - Personnalisation complète des couleurs, tailles et styles
4. **Maintenabilité** - Modifications centralisées dans un seul fichier
5. **Accessibilité** - Support natif des états désactivés
6. **Performance** - Optimisé avec `activeOpacity` et gestion des états 