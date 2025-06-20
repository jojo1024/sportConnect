import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export type UserRole = 'lambda' | 'capo' | 'gerant';

export interface User {
    utilisateurId: number;
    utilisateurNom: string;
    utilisateurTelephone: string;
    utilisateurCommune: string;
    utilisateurDateNaiss: Date;
    utilisateurSexe: 'Homme' | 'Femme';
    utilisateurRole: UserRole;
    utilisateurAvatar?: string;
}

interface UserState {
    user: User | null;
    notificationCount: number
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    user: null,
    notificationCount: 0,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,
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
        },
        
        // Action pour mettre à jour les données utilisateur
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        setNotificationCount: (state, action: PayloadAction<number>) => {
            state.notificationCount = action.payload;
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
    setNotificationCount
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectAccessToken = (state: RootState) => state.user.accessToken;
export const selectRefreshToken = (state: RootState) => state.user.refreshToken;
export const selectIsLoading = (state: RootState) => state.user.isLoading;
export const selectError = (state: RootState) => state.user.error;
export const selectNotificationCount = (state: RootState) => state.user.notificationCount;

export default userSlice.reducer; 