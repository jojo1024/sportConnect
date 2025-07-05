# Services API - Ibori Mobile App

## Vue d'ensemble

Les services API sont organisés de manière cohérente pour faciliter la maintenance et l'utilisation. Chaque service suit la même structure que `terrainService`.

## Structure commune

### Interface de données
```typescript
export interface Entity {
    // Propriétés de l'entité
}

export interface CreateEntityData {
    // Données pour la création
}

export interface UpdateEntityData {
    // Données pour la mise à jour
}
```

### Interface de réponse API
```typescript
export interface EntityResponse {
    success: boolean;
    message: string;
    data: Entity;
}

export interface EntityListResponse {
    success: boolean;
    message: string;
    data: Entity[];
}
```

### Service
```typescript
export const entityService = {
    BASE_URL: api.defaults.baseURL,

    // Méthodes CRUD
    createEntity: async (data: CreateEntityData): Promise<Entity> => {
        const response = await api.post<EntityResponse>('/entities/create', data);
        return response.data.data;
    },

    updateEntity: async (id: number, data: UpdateEntityData): Promise<Entity> => {
        const response = await api.put<EntityResponse>(`/entities/update/${id}`, data);
        return response.data.data;
    },

    getEntityById: async (id: number): Promise<Entity> => {
        const response = await api.get<EntityResponse>(`/entities/fetchById/${id}`);
        return response.data.data;
    },

    getAllEntities: async (): Promise<Entity[]> => {
        const response = await api.get<EntityListResponse>('/entities/fetchAll');
        return response.data.data;
    },
};
```

## Services disponibles

### 1. profileService
Gestion des profils utilisateur
- `getCurrentProfile()` : Récupérer le profil actuel
- `updateProfile()` : Mettre à jour le profil
- `getProfileData()` : Récupérer données complètes
- `getProfileStatistics()` : Statistiques utilisateur
- `getRecentActivities()` : Activités récentes
- `changePassword()` : Changer le mot de passe
- `deleteAccount()` : Supprimer le compte
- `requestRoleEvolution()` : Demander évolution de rôle

### 2. terrainService
Gestion des terrains sportifs
- `createTerrain()` : Créer un terrain
- `updateTerrain()` : Mettre à jour un terrain
- `getAllTerrains()` : Récupérer tous les terrains
- `getManagerTerrains()` : Terrains d'un manager
- `getTerrainById()` : Récupérer par ID
- `searchTerrains()` : Rechercher des terrains
- `checkAvailability()` : Vérifier disponibilité

### 3. authService
Authentification et gestion des sessions
- `login()` : Connexion
- `register()` : Inscription
- `refreshToken()` : Rafraîchir le token
- `logout()` : Déconnexion

### 4. creditService
Gestion des crédits utilisateur
- `getBalance()` : Solde actuel
- `addCredits()` : Ajouter des crédits
- `useCredits()` : Utiliser des crédits
- `getTransactionHistory()` : Historique des transactions

### 5. matchService
Gestion des matchs
- `createMatch()` : Créer un match
- `joinMatch()` : Rejoindre un match
- `getMatchDetails()` : Détails d'un match
- `getAvailableMatches()` : Matchs disponibles

### 6. notificationService
Gestion des notifications
- `getNotifications()` : Récupérer les notifications
- `markAsRead()` : Marquer comme lu
- `deleteNotification()` : Supprimer une notification

### 7. sportService
Gestion des sports
- `getAllSports()` : Tous les sports
- `getSportById()` : Sport par ID

### 8. statisticsService
Statistiques et analytics
- `getUserStats()` : Statistiques utilisateur
- `getTerrainStats()` : Statistiques terrain

## Utilisation

### Import depuis l'index
```typescript
import { profileService, terrainService, User, Terrain } from '../services';
```

### Import direct
```typescript
import { profileService } from '../services/profileService';
```

## Gestion des erreurs

Tous les services utilisent le même système de gestion d'erreurs via axios interceptors dans `api.ts`. Les erreurs sont automatiquement gérées et peuvent être capturées avec try/catch.

## Types de données

### Conversion de types
Certains services peuvent avoir des différences de types entre l'API et le store :
- **API** : `utilisateurDateNaiss: string`
- **Store** : `utilisateurDateNaiss: Date`

La conversion est gérée dans les hooks ou les composants qui utilisent les services.

## Bonnes pratiques

1. **Toujours utiliser les types** : Importez et utilisez les interfaces TypeScript
2. **Gestion d'erreurs** : Utilisez try/catch pour capturer les erreurs
3. **Loading states** : Gérez les états de chargement dans les composants
4. **Validation** : Validez les données avant l'envoi
5. **Cohérence** : Suivez la même structure pour tous les services 