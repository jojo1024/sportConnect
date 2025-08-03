import React, { createContext, useContext, useCallback } from 'react';
import { useToast } from './useToast';
import { ErrorType, ApiError } from '../services/api';

interface GlobalErrorHandlerContextType {
    handleApiError: (error: ApiError) => void;
}

const GlobalErrorHandlerContext = createContext<GlobalErrorHandlerContextType | null>(null);

export const useGlobalErrorHandler = () => {
    const context = useContext(GlobalErrorHandlerContext);
    if (!context) {
        throw new Error('useGlobalErrorHandler must be used within a GlobalErrorHandlerProvider');
    }
    return context;
};

interface GlobalErrorHandlerProviderProps {
    children: React.ReactNode;
}

export const GlobalErrorHandlerProvider: React.FC<GlobalErrorHandlerProviderProps> = ({ children }) => {
    const { showError, showWarning } = useToast();

    const handleApiError = useCallback((error: ApiError) => {
        switch (error.type) {
            case ErrorType.SESSION_EXPIRED:
                showError('Votre session a expiré. Veuillez vous reconnecter.', 4000);
                break;

            case ErrorType.VALIDATION:
                showError(error.message || 'Données invalides', 3000);
                break;

            case ErrorType.SERVER:
                showError('Erreur serveur. Veuillez réessayer plus tard.', 3000);
                break;

            case ErrorType.TIMEOUT:
                showWarning('Délai d\'attente dépassé. Veuillez réessayer.', 3000);
                break;

            case ErrorType.NETWORK:
                showWarning('Erreur de connexion. Vérifiez votre connexion internet.', 3000);
                break;

            case ErrorType.UNAUTHORIZED:
                showError('Accès non autorisé. Veuillez vous reconnecter.', 3000);
                break;

            case ErrorType.FORBIDDEN:
                showError('Accès interdit. Vous n\'avez pas les permissions nécessaires.', 3000);
                break;

            case ErrorType.UNKNOWN:
            default:
                showError(error.message || 'Une erreur inattendue est survenue.', 3000);
                break;
        }
    }, [showError, showWarning]);

    return React.createElement(
        GlobalErrorHandlerContext.Provider,
        { value: { handleApiError } },
        children
    );
}; 