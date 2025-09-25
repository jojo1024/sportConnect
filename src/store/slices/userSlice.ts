import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export type UserRole = 'lambda' | 'capo' | 'gerant';

export interface RoleRequest {
    requestId: number;
    utilisateurId: number;
    requestedRole: 'capo' | 'gerant';
    status: 'pending' | 'approved' | 'rejected';
    requestDate: string;
    processedDate?: string;
    rejectionReason?: string;
}

export interface User {
    utilisateurId: number;
    utilisateurNom: string;
    utilisateurTelephone: string;
    utilisateurCommune: string;
    utilisateurDateNaiss: string;
    utilisateurSexe: 'Homme' | 'Femme';
    utilisateurRole: UserRole;
    effectiveRole?: UserRole; // Rôle effectif calculé depuis role_requests
    utilisateurAvatar?: string;
}

export interface UserStatistics {
    totalMatchs: number;
    totalTerrains: number;
    totalHeures: number;
    statsParSport: Array<{
        sportId: number;
        sportNom: string;
        sportIcone: string;
        nombreMatchs: number;
        heuresTotales: number;
    }>;
}

export interface UserActivity {
    matchId: number;
    matchDateDebut: string;
    matchDateFin: string;
    matchDuree: number;
    matchDescription: string;
    matchNbreParticipant: number;
    matchStatus: string;
    codeMatch: string;
    matchDateCreation: string;
    matchPrixParJoueur: number;
    sportId: number;
    sportNom: string;
    sportIcone: string;
    capoNomUtilisateur: string;
    capoTelephone: string;
    capoCommune: string;
    terrainNom: string;
    terrainLocalisation: string;
    terrainDescription: string;
    terrainContact: string;
    terrainPrixParHeure: number;
    terrainHoraires: string;
    terrainImages: string;
    dateParticipation: string;
    statutParticipation: string;
}

interface UserState {
    user: User | null;
    notificationCount: number
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
    statistics: UserStatistics | null;
    recentActivities: UserActivity[];
    profileDataLoading: boolean;
    profileDataError: string | null;
    lastProfileDataUpdate: number | null;
    roleRequests: RoleRequest[];
    pendingRoleRequests: RoleRequest[];
}

const initialState: UserState = {
    user: null,
    notificationCount: 0,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,
    statistics: null,
    recentActivities: [],
    profileDataLoading: false,
    profileDataError: null,
    lastProfileDataUpdate: null,
    roleRequests: [],
    pendingRoleRequests: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Action pour démarrer le loading
        startLoading: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        
        // Action pour arrêter le loading
        stopLoading: (state) => {
            state.isLoading = false;
        },
        
        // Action pour définir une erreur
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        
        // Action pour effacer l'erreur
        clearError: (state) => {
            state.error = null;
        },
        
        // Action pour définir l'utilisateur et les tokens (login/register)
        setAuthData: (state, action: PayloadAction<{
            user: User;
            accessToken: string;
            refreshToken: string;
        }>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
        },
        
        // Action pour mettre à jour les tokens (refresh)
        updateTokens: (state, action: PayloadAction<{
            accessToken: string;
            refreshToken: string;
        }>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        
        // Action pour effacer les données utilisateur (compatibilité)
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.accessToken = null;
            state.refreshToken = null;
            state.error = null;
            state.isLoading = false;
        },
        
        // Action pour la déconnexion
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.accessToken = null;
            state.refreshToken = null;
            state.error = null;
            state.isLoading = false;
            state.notificationCount = 0;
            state.statistics = null;
            state.recentActivities = [];
            state.profileDataError = null;
            state.lastProfileDataUpdate = null;
        },
        
        // Action pour mettre à jour les données utilisateur
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        setNotificationCount: (state, action: PayloadAction<number>) => {
            state.notificationCount = action.payload;
        },
        
        // Nouvelles actions pour les données du profil
        startProfileDataLoading: (state) => {
            state.profileDataLoading = true;
            state.profileDataError = null;
        },
        
        stopProfileDataLoading: (state) => {
            state.profileDataLoading = false;
        },
        
        setProfileDataError: (state, action: PayloadAction<string>) => {
            state.profileDataError = action.payload;
            state.profileDataLoading = false;
        },
        
        clearProfileDataError: (state) => {
            state.profileDataError = null;
        },
        
        setUserStatistics: (state, action: PayloadAction<UserStatistics>) => {
            state.statistics = action.payload;
            state.lastProfileDataUpdate = Date.now();
        },
        
        setUserRecentActivities: (state, action: PayloadAction<UserActivity[]>) => {
            state.recentActivities = action.payload;
            state.lastProfileDataUpdate = Date.now();
        },
        
        setProfileData: (state, action: PayloadAction<{
            statistics: UserStatistics;
            recentActivities: UserActivity[];
        }>) => {
            state.statistics = action.payload.statistics;
            state.recentActivities = action.payload.recentActivities;
            state.lastProfileDataUpdate = Date.now();
            state.profileDataLoading = false;
            state.profileDataError = null;
        },
        
        clearProfileData: (state) => {
            state.statistics = null;
            state.recentActivities = [];
            state.profileDataError = null;
            state.lastProfileDataUpdate = null;
        },

        // Actions pour les demandes de rôle
        setRoleRequests: (state, action: PayloadAction<RoleRequest[]>) => {
            state.roleRequests = action.payload;
            state.pendingRoleRequests = action.payload.filter(req => req.status === 'pending');
        },

        addRoleRequest: (state, action: PayloadAction<RoleRequest>) => {
            state.roleRequests.push(action.payload);
            if (action.payload.status === 'pending') {
                state.pendingRoleRequests.push(action.payload);
            }
        },

        updateRoleRequest: (state, action: PayloadAction<RoleRequest>) => {
            const index = state.roleRequests.findIndex(req => req.requestId === action.payload.requestId);
            if (index !== -1) {
                state.roleRequests[index] = action.payload;
            }
            
            // Mettre à jour les demandes en attente
            const pendingIndex = state.pendingRoleRequests.findIndex(req => req.requestId === action.payload.requestId);
            if (action.payload.status === 'pending') {
                if (pendingIndex === -1) {
                    state.pendingRoleRequests.push(action.payload);
                } else {
                    state.pendingRoleRequests[pendingIndex] = action.payload;
                }
            } else {
                if (pendingIndex !== -1) {
                    state.pendingRoleRequests.splice(pendingIndex, 1);
                }
            }
        },

        removeRoleRequest: (state, action: PayloadAction<number>) => {
            state.roleRequests = state.roleRequests.filter(req => req.requestId !== action.payload);
            state.pendingRoleRequests = state.pendingRoleRequests.filter(req => req.requestId !== action.payload);
        },

        clearRoleRequests: (state) => {
            state.roleRequests = [];
            state.pendingRoleRequests = [];
        }
    },
});

export const { 
    startLoading,
    stopLoading,
    setError,
    clearError,
    setAuthData,
    updateTokens,
    clearUser,
    logout,
    updateUser,
    setNotificationCount,
    startProfileDataLoading,
    stopProfileDataLoading,
    setProfileDataError,
    clearProfileDataError,
    setUserStatistics,
    setUserRecentActivities,
    setProfileData,
    clearProfileData,
    setRoleRequests,
    addRoleRequest,
    updateRoleRequest,
    removeRoleRequest,
    clearRoleRequests
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectAccessToken = (state: RootState) => state.user.accessToken;
export const selectRefreshToken = (state: RootState) => state.user.refreshToken;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectError = (state: RootState) => state.user.error;
export const selectNotificationCount = (state: RootState) => state.user.notificationCount;
export const selectUserStatistics = (state: RootState) => state.user.statistics;
export const selectUserRecentActivities = (state: RootState) => state.user.recentActivities;
export const selectProfileDataLoading = (state: RootState) => state.user.profileDataLoading;
export const selectProfileDataError = (state: RootState) => state.user.profileDataError;
export const selectLastProfileDataUpdate = (state: RootState) => state.user.lastProfileDataUpdate;

// Sélecteurs pour les demandes de rôle
export const selectRoleRequests = (state: RootState) => state.user.roleRequests;
export const selectPendingRoleRequests = (state: RootState) => state.user.pendingRoleRequests;
export const selectHasPendingCapoRequest = (state: RootState) =>
    state.user.pendingRoleRequests?.some(req => req.requestedRole === 'capo') || false;
export const selectHasPendingGerantRequest = (state: RootState) =>
    state.user.pendingRoleRequests?.some(req => req.requestedRole === 'gerant') || false;

// Sélecteur pour le rôle effectif (priorité : effectiveRole > utilisateurRole > lambda)
export const selectEffectiveRole = (state: RootState): UserRole => {
    const user = state.user.user;
    if (!user) return 'lambda';
    
    // Si effectiveRole est défini, l'utiliser
    if (user.effectiveRole) {
        return user.effectiveRole;
    }
    
    // Sinon, utiliser utilisateurRole
    return user.utilisateurRole || 'lambda';
};

export default userSlice.reducer; 