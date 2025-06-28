import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/slices/userSlice';
import { ApiError, ErrorType } from '../services/api';

/**
 * Hook utilitaire pour gérer les erreurs API de manière cohérente
 */
export const useApiError = () => {
    const dispatch = useDispatch();

    /**
     * Gère une erreur API et retourne un message approprié
     */
    const handleApiError = useCallback((error: ApiError | any) => {
        console.log('🚀 ~ handleApiError ~ error:', error);

        // Si c'est une erreur d'API typée
        if (error && typeof error === 'object' && 'type' in error) {
            const apiError = error as ApiError;
            
            switch (apiError.type) {
                case ErrorType.SESSION_EXPIRED:
                    // Seulement déconnecter si c'est vraiment une erreur de session
                    console.log('🚀 ~ Session expirée, déconnexion...');
                    dispatch(clearUser());
                    return {
                        shouldLogout: true,
                        message: 'Votre session a expiré. Veuillez vous reconnecter.'
                    };
                
                case ErrorType.UNAUTHORIZED:
                    // Ne pas déconnecter automatiquement pour les erreurs 401
                    // Laisser l'intercepteur API gérer le refresh
                    return {
                        shouldLogout: false,
                        message: apiError.message || 'Erreur d\'authentification'
                    };
                
                case ErrorType.FORBIDDEN:
                    // Ne pas déconnecter pour les erreurs 403
                    return {
                        shouldLogout: false,
                        message: 'Accès non autorisé'
                    };
                
                case ErrorType.NETWORK:
                    return {
                        shouldLogout: false,
                        message: 'Erreur de connexion. Vérifiez votre connexion internet.'
                    };
                
                case ErrorType.TIMEOUT:
                    return {
                        shouldLogout: false,
                        message: 'Délai d\'attente dépassé. Veuillez réessayer.'
                    };
                
                case ErrorType.VALIDATION:
                    return {
                        shouldLogout: false,
                        message: apiError.message || 'Données invalides'
                    };
                
                case ErrorType.SERVER:
                    return {
                        shouldLogout: false,
                        message: 'Erreur serveur. Veuillez réessayer plus tard.'
                    };
                
                default:
                    return {
                        shouldLogout: false,
                        message: apiError.message || 'Une erreur inattendue est survenue.'
                    };
            }
        }

        // Si c'est une erreur standard
        if (error?.response?.status === 401) {
            // Ne pas déconnecter automatiquement, laisser l'intercepteur gérer
            return {
                shouldLogout: false,
                message: 'Erreur d\'authentification'
            };
        }

        if (error?.response?.status === 403) {
            return {
                shouldLogout: false,
                message: 'Accès non autorisé'
            };
        }

        // Erreur par défaut
        return {
            shouldLogout: false,
            message: error?.message || 'Une erreur inattendue est survenue.'
        };
    }, [dispatch]);

    /**
     * Vérifie si une erreur est de type spécifique
     */
    const isErrorType = useCallback((error: any, type: ErrorType): boolean => {
        return error?.type === type;
    }, []);

    /**
     * Vérifie si une erreur nécessite une reconnexion
     */
    const requiresReconnection = useCallback((error: any): boolean => {
        return isErrorType(error, ErrorType.SESSION_EXPIRED);
    }, [isErrorType]);

    /**
     * Vérifie si une erreur permet un retry
     */
    const allowsRetry = useCallback((error: any): boolean => {
        return isErrorType(error, ErrorType.NETWORK) || 
               isErrorType(error, ErrorType.TIMEOUT) || 
               isErrorType(error, ErrorType.SERVER);
    }, [isErrorType]);

    return {
        handleApiError,
        isErrorType,
        requiresReconnection,
        allowsRetry,
    };
}; 