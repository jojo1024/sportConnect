# ActionButton Component

Le composant `ActionButton` est un composant réutilisable qui combine les fonctionnalités des anciens composants `JoinButton` et `PaymentButton`. Il offre une interface flexible pour créer des boutons d'action avec différents styles et comportements.

## Utilisation

```tsx
import { ActionButton } from '../components/ActionButton';

// Exemple basique
<ActionButton
    onPress={() => console.log('Button pressed')}
    title="Mon Bouton"
/>

// Exemple avec icône et état de chargement
<ActionButton
    onPress={handlePress}
    isLoading={isLoading}
    disabled={isDisabled}
    title="Payer avec Wave"
    iconName="wave"
    iconType="materialCommunity"
    iconSize={24}
    variant="primary"
    borderRadius={16}
    fontSize={18}
    position="absolute"
/>
```

## Propriétés

### Propriétés communes
- `onPress: () => void` - Fonction appelée lors du clic sur le bouton
- `isLoading?: boolean` - Affiche un indicateur de chargement (défaut: false)
- `disabled?: boolean` - Désactive le bouton (défaut: false)

### Propriétés de contenu
- `title: string` - Texte affiché sur le bouton
- `iconName?: string` - Nom de l'icône à afficher
- `iconType?: 'ionicons' | 'materialCommunity'` - Type d'icône (défaut: 'ionicons')
- `iconSize?: number` - Taille de l'icône (défaut: 20)

### Propriétés de style
- `variant?: 'primary' | 'secondary' | 'disabled'` - Variant de couleur (défaut: 'primary')
- `borderRadius?: number` - Rayon de bordure (défaut: 10)
- `fontSize?: number` - Taille de police (défaut: 16)
- `paddingHorizontal?: number` - Padding horizontal (défaut: 30)
- `paddingVertical?: number` - Padding vertical (défaut: 20)

### Propriétés de position
- `position?: 'absolute' | 'relative'` - Position du bouton (défaut: 'absolute')
- `backgroundColor?: string` - Couleur de fond du conteneur (défaut: COLORS.white)

## Variants

- `primary` - Couleur primaire (COLORS.primary)
- `secondary` - Couleur secondaire (COLORS.mediumGray, COLORS.lightGray)
- `disabled` - Couleur désactivée (COLORS.mediumGray, COLORS.lightGray)

## Exemples d'utilisation

### Bouton de paiement
```tsx
<ActionButton
    onPress={handlePayment}
    isLoading={isProcessing}
    disabled={!acceptedTerms}
    title="Payer avec Wave"
    iconName="wave"
    iconType="materialCommunity"
    iconSize={24}
    variant={acceptedTerms ? 'primary' : 'disabled'}
    borderRadius={16}
    fontSize={18}
    paddingHorizontal={20}
    paddingVertical={20}
    position="absolute"
    backgroundColor="white"
/>
```

### Bouton de rejoindre une partie
```tsx
<ActionButton
    onPress={handleJoin}
    isLoading={isJoining}
    disabled={isMatchFull}
    title={isMatchFull ? 'Partie complète' : 'Rejoindre la partie'}
    iconName={isMatchFull ? "close-circle" : "add-circle"}
    iconType="ionicons"
    iconSize={20}
    variant={isMatchFull ? 'disabled' : 'primary'}
    borderRadius={10}
    fontSize={16}
    paddingHorizontal={30}
    paddingVertical={20}
    position="absolute"
    backgroundColor="white"
/>
```

### Bouton simple sans icône
```tsx
<ActionButton
    onPress={handleAction}
    title="Confirmer"
    variant="primary"
    position="relative"
/>
```

## Migration depuis les anciens composants

### Depuis JoinButton
```tsx
// Avant
<JoinButton
    isMatchFull={isMatchFull}
    isJoining={isJoining}
    onPress={onPress}
/>

// Après
<ActionButton
    onPress={onPress}
    isLoading={isJoining}
    disabled={isMatchFull}
    title={isMatchFull ? 'Partie complète' : 'Rejoindre la partie'}
    iconName={isMatchFull ? "close-circle" : "add-circle"}
    iconType="ionicons"
    iconSize={20}
    variant={isMatchFull ? 'disabled' : 'primary'}
    borderRadius={10}
    fontSize={16}
    paddingHorizontal={30}
    paddingVertical={20}
    position="absolute"
    backgroundColor="white"
/>
```

### Depuis PaymentButton
```tsx
// Avant
<PaymentButton
    acceptedTerms={acceptedTerms}
    isProcessing={isProcessing}
    onPress={onPress}
/>

// Après
<ActionButton
    onPress={onPress}
    isLoading={isProcessing}
    disabled={!acceptedTerms}
    title="Payer avec Wave"
    iconName="wave"
    iconType="materialCommunity"
    iconSize={24}
    variant={acceptedTerms ? 'primary' : 'disabled'}
    borderRadius={16}
    fontSize={18}
    paddingHorizontal={20}
    paddingVertical={20}
    position="absolute"
    backgroundColor="white"
/>
``` 