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

// Types d'erreurs pour la gestion globale
export enum ErrorType {
    NETWORK = 'NETWORK',
    TIMEOUT = 'TIMEOUT',
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    VALIDATION = 'VALIDATION',
    SERVER = 'SERVER',
    UNKNOWN = 'UNKNOWN'
}

export interface ApiError {
    type: ErrorType;
    message: string;
    originalError: any;
    status?: number;
}

// Fonction pour analyser et catégoriser les erreurs
const analyzeError = (error: any): ApiError => {
    // Erreur de session expirée (401)
    if (error?.response?.status === 401) {
        return {
            type: ErrorType.SESSION_EXPIRED,
            message: 'Votre session a expiré. Veuillez vous reconnecter.',
            originalError: error,
            status: 401
        };
    }

    // Erreur de validation (400)
    if (error?.response?.status === 400) {
        return {
            type: ErrorType.VALIDATION,
            message: error?.response?.data?.message || 'Données invalides',
            originalError: error,
            status: 400
        };
    }

    // Erreur serveur (500+)
    if (error?.response?.status >= 500) {
        return {
            type: ErrorType.SERVER,
            message: 'Erreur serveur. Veuillez réessayer plus tard.',
            originalError: error,
            status: error?.response?.status
        };
    }

    // Erreur de timeout
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
        return {
            type: ErrorType.TIMEOUT,
            message: 'Délai d\'attente dépassé. Veuillez réessayer.',
            originalError: error
        };
    }

    // Erreur réseau
    if (error?.message?.includes('Network Error') || error?.code === 'NETWORK_ERROR' || !error?.response) {
        return {
            type: ErrorType.NETWORK,
            message: 'Erreur de connexion. Vérifiez votre connexion internet.',
            originalError: error
        };
    }

    // Erreur inconnue
    return {
        type: ErrorType.UNKNOWN,
        message: error?.response?.data?.message || error?.message || 'Une erreur inattendue est survenue.',
        originalError: error,
        status: error?.response?.status
    };
};

// Configuration de l'API
const API_URL = 'http://192.168.100.4:50006/v1'; // Pour l'émulateur Android

// Création de l'instance axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Timeout de 10 secondes
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.user.accessToken;
        console.log("🚀 ~ token:4444444444448", token)
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
                    // Pas de refresh token, déconnexion
                    store.dispatch(clearUser());
                    throw new Error('No refresh token');
                }

                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                const { accessToken } = response.data;

                // Mise à jour du store
                store.dispatch(updateTokens({ accessToken, refreshToken }));
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                // Si le refresh token est invalide, on déconnecte l'utilisateur
                console.log('Refresh token invalide, déconnexion...');
                store.dispatch(clearUser());
                
                // Note: L'alerte de session expirée sera gérée par le composant qui utilise l'API
                // car nous ne pouvons pas importer directement le CustomAlert ici
                
                return Promise.reject(error);
            }
        }

        // Analyser l'erreur pour la gestion globale
        const apiError = analyzeError(error);
        
        // Note: L'affichage des alertes sera géré par les composants qui utilisent l'API
        // car nous ne pouvons pas importer directement le CustomAlert ici

        // Pour les autres erreurs, on les laisse passer avec l'analyse
        return Promise.reject(apiError);
    }
);

export default api; 