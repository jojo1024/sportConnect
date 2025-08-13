import axios from 'axios';
import { store } from '../store';
import { updateTokens, clearUser } from '../store/slices/userSlice';
import { TOKEN_CONFIG, tokenUtils } from '../utils/tokenConfig';

// Types pour l'API
interface User {
    utilisateurId: number;
    utilisateurNom: string;
    utilisateurTelephone: string;
    utilisateurCommune: string;
    utilisateurDateNaiss: string;
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
    UNKNOWN = 'UNKNOWN',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN'
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
const API_URL = 'https://ibori.wookami.com/v1';
// const API_URL =  'http://192.168.178.222:50015/v1' // Pour l'émulateur Android
// export const BASE_URL_IMAGES = 'http://192.168.100.8:50015/images'
export const BASE_URL_IMAGES = 'https://ibori.wookami.com/images'
export const BASE_URL_AVATARS = 'https://ibori.wookami.com/avatars'

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
        
        if (TOKEN_CONFIG.DEBUG.LOG_TOKEN_REFRESH) {
            console.log("🚀 ~ Request interceptor ~ token:", token ? "Présent" : "Absent");
        }
        
        if (token) {
            // Vérifier si le token est proche de l'expiration
            if (TOKEN_CONFIG.AUTO_REFRESH.ENABLED && tokenUtils.isTokenExpiringSoon(token)) {
                console.log('🚀 ~ Token proche de l\'expiration, refresh préventif...');
                // Le refresh se fera automatiquement lors de la réponse 401
            }
            
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
                    console.log('🚀 ~ Pas de refresh token disponible');
                    // Ne pas déconnecter automatiquement selon la configuration
                    if (TOKEN_CONFIG.ERROR_HANDLING.AUTO_LOGOUT_ON_REFRESH_FAIL) {
                        store.dispatch(clearUser());
                    }
                    throw new Error('No refresh token');
                }

                if (TOKEN_CONFIG.DEBUG.LOG_TOKEN_REFRESH) {
                    console.log('🚀 ~ Tentative de rafraîchissement du token...');
                    console.log('🚀 ~ Refresh token utilisé:', refreshToken.substring(0, 20) + '...');
                }
                
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                
                if (TOKEN_CONFIG.DEBUG.LOG_TOKEN_REFRESH) {
                    console.log('🚀 ~ Réponse du refresh:', response.data);
                }
                
                // Vérifier le format de réponse du backend
                if (response.data.status === 'error') {
                    throw new Error(response.data.message || 'Erreur de rafraîchissement');
                }
                
                // Le backend utilise successResponse qui renvoie { status: 'success', data: { accessToken, refreshToken } }
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;

                if (!accessToken) {
                    throw new Error('Access token manquant dans la réponse');
                }

                if (TOKEN_CONFIG.DEBUG.LOG_TOKEN_REFRESH) {
                    console.log('🚀 ~ Nouveau access token reçu:', accessToken.substring(0, 20) + '...');
                    console.log('🚀 ~ Nouveau refresh token reçu:', newRefreshToken ? newRefreshToken.substring(0, 20) + '...' : 'Même token');
                }

                // Mise à jour du store avec les nouveaux tokens
                store.dispatch(updateTokens({ 
                    accessToken, 
                    refreshToken: newRefreshToken || refreshToken 
                }));
                
                // Mettre à jour le header de la requête originale
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                if (TOKEN_CONFIG.DEBUG.LOG_TOKEN_REFRESH) {
                    console.log('🚀 ~ Token rafraîchi avec succès, retry de la requête originale');
                }
                
                return api(originalRequest);
            } catch (refreshError: any) {
                if (TOKEN_CONFIG.DEBUG.LOG_AUTH_ERRORS) {
                    console.log('🚀 ~ Échec du rafraîchissement du token:', refreshError);
                    console.log('🚀 ~ Détails de l\'erreur:', {
                        message: refreshError.message,
                        response: refreshError.response?.data,
                        status: refreshError.response?.status
                    });
                }
                
                // Seulement déconnecter si c'est vraiment un problème d'authentification
                // ET que la configuration l'autorise
                if (TOKEN_CONFIG.ERROR_HANDLING.AUTO_LOGOUT_ON_REFRESH_FAIL && 
                    (refreshError?.response?.status === 401 || refreshError?.response?.status === 403)) {
                    console.log('🚀 ~ Refresh token invalide, déconnexion...');
                    store.dispatch(clearUser());
                }
                
                return Promise.reject(error);
            }
        }

        // Analyser l'erreur pour la gestion globale
        const apiError = analyzeError(error);
        
        // Pour les autres erreurs, on les laisse passer avec l'analyse
        return Promise.reject(apiError);
    }
);

export default api; 