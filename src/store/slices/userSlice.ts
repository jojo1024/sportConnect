import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export type UserRole = 'lambda' | 'capo' | 'gerant';

export interface User {
    utilisateurId: number;
    utilisateurNom: string;
    utilisateurTelephone: string;
    utilisateurCommune: string;
    utilisateurDateNaiss: string;
    utilisateurSexe: 'Homme' | 'Femme';
    utilisateurRole: UserRole;
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
    clearProfileData
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

export default userSlice.reducer; 