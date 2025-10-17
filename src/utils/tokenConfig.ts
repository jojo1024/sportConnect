// Configuration des tokens pour l'application
export const TOKEN_CONFIG = {
    // Durée de vie des tokens (doit correspondre au backend)
    ACCESS_TOKEN_EXPIRY: '1h',
    REFRESH_TOKEN_EXPIRY: '30d',
    
    // Configuration du refresh automatique
    AUTO_REFRESH: {
        ENABLED: true,
        RETRY_ATTEMPTS: 1,
        RETRY_DELAY: 1000, // 1 seconde
    },
    
    // Configuration de la persistance
    PERSISTENCE: {
        ENABLED: true,
        STORAGE_KEY: 'ibori_auth',
        VERSION: 1,
    },
    
    // Configuration des erreurs
    ERROR_HANDLING: {
        AUTO_LOGOUT_ON_REFRESH_FAIL: false, // Ne pas déconnecter automatiquement
        AUTO_LOGOUT_ON_NETWORK_ERROR: false, // Ne pas déconnecter sur erreur réseau
        SHOW_ERROR_MESSAGES: true,
    },
    
    // Configuration du debug
    DEBUG: {
        ENABLED: __DEV__, // Seulement en développement
        LOG_TOKEN_REFRESH: true,
        LOG_AUTH_ERRORS: true,
    },
} as const;

// Types pour la configuration
export type TokenConfig = typeof TOKEN_CONFIG;

// Fonctions utilitaires pour la gestion des tokens
export const tokenUtils = {
    // Vérifier si un token est proche de l'expiration (5 minutes avant)
    isTokenExpiringSoon: (token: string): boolean => {
        try {
            const payload = JSON.parse(atob(token?.split('.')[1]));
            const expirationTime = payload.exp * 1000; // Convertir en millisecondes
            const currentTime = Date.now();
            const fiveMinutes = 5 * 60 * 1000; // 5 minutes en millisecondes
            
            return (expirationTime - currentTime) < fiveMinutes;
        } catch (error) {
            console.log('🚀 ~ Erreur lors de la vérification du token:', error);
            return false;
        }
    },
    
    // Extraire les informations du token (pour debug)
    getTokenInfo: (token: string) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                utilisateurId: payload.utilisateurId,
                utilisateurRole: payload.utilisateurRole,
                exp: new Date(payload.exp * 1000),
                iat: new Date(payload.iat * 1000),
            };
        } catch (error) {
            console.log('🚀 ~ Erreur lors de l\'extraction des infos du token:', error);
            return null;
        }
    },
    
    // Vérifier si un token est valide (structure)
    isValidTokenFormat: (token: string): boolean => {
        if (!token || typeof token !== 'string') return false;
        
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        try {
            JSON.parse(atob(parts[1]));
            return true;
        } catch (error) {
            return false;
        }
    },
}; 