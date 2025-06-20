import axios from 'axios';
import { store } from '../store';
import { updateTokens, clearUser } from '../store/slices/userSlice';

// Types pour l'API
interface User {
    utilisateurId: number;
    utilisateurNom: string;
    utilisateurTelephone: string;
    utilisateurCommune: string;
    utilisateurDateNaiss: Date;
    utilisateurSexe: 'Homme' | 'Femme';
    utilisateurRole: 'lambda' | 'capo' | 'gerant';
    utilisateurAvatar?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterData {
    utilisateurNom: string;
    utilisateurTelephone: string;
    utilisateurCommune: string;
    utilisateurDateNaiss: string;
    utilisateurSexe: 'Homme' | 'Femme';
    utilisateurRole: 'lambda' | 'capo' | 'gerant';
    utilisateurMotDePasse: string;
}

export interface LoginData {
    utilisateurTelephone: string;
    utilisateurMotDePasse: string;
}

// Configuration de l'API
const API_URL = 'http://192.168.100.4:50006/v1'; // Pour l'émulateur Android

// Création de l'instance axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.user.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si l'erreur est 401 et qu'on n'a pas déjà essayé de rafraîchir le token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const state = store.getState();
                const refreshToken = state.user.refreshToken;
                
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                const { accessToken } = response.data;

                // Mise à jour du store
                store.dispatch(updateTokens({ accessToken, refreshToken }));
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (error) {
                // Si le refresh token est invalide, on déconnecte l'utilisateur
                store.dispatch(clearUser());
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api; 