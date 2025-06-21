import { useCallback } from 'react';
import { ApiError, ErrorType } from '../services/api';

/**
 * Hook utilitaire pour gérer les erreurs API de manière cohérente
 */
export const useApiError = () => {
    /**
     * Gère une erreur API et retourne un message approprié
     */
    const handleApiError = useCallback((error: any): string => {
        if (error?.type === ErrorType.SESSION_EXPIRED) {
            return 'Session expirée. Veuillez vous reconnecter.';
        }
        
        if (error?.type === ErrorType.NETWORK) {
            return 'Erreur de connexion. Vérifiez votre connexion internet.';
        }
        
        if (error?.type === ErrorType.TIMEOUT) {
            return 'Délai d\'attente dépassé. Veuillez réessayer.';
        }
        
        if (error?.type === ErrorType.VALIDATION) {
            return error.message || 'Données invalides';
        }
        
        if (error?.type === ErrorType.SERVER) {
            return 'Erreur serveur. Veuillez réessayer plus tard.';
        }
        
        return error?.message || 'Une erreur inattendue est survenue.';
    }, []);

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