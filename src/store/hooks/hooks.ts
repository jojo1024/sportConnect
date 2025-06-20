import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "..";
import { useEffect } from 'react';
import { 
    setAuthData, 
    updateTokens, 
    logout,
    startLoading,
    stopLoading,
    setError
} from '../slices/userSlice';
import mmkvStorage from './mmkvStorage';
import { authService } from '../../services/authService';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hook pour initialiser l'état d'authentification au démarrage
export const useAuthInitialization = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Récupérer les données stockées
                const storedAccessToken = mmkvStorage.getAccessToken();
                const storedRefreshToken = mmkvStorage.getRefreshToken();
                const storedUserData = mmkvStorage.getUserData();
                const storedIsAuthenticated = mmkvStorage.getIsAuthenticated();

                if (storedIsAuthenticated && storedAccessToken && storedRefreshToken && storedUserData) {
                    // Vérifier si le token est encore valide
                    try {
                        // Optionnel : vérifier la validité du token avec le backend
                        // await authService.verifyToken(storedAccessToken);
                        
                        // Restaurer l'état d'authentification
                        dispatch(setAuthData({
                            user: storedUserData,
                            accessToken: storedAccessToken,
                            refreshToken: storedRefreshToken
                        }));
                    } catch (error) {
                        // Token invalide, essayer de le rafraîchir
                        try {
                            const newTokens = await authService.refreshToken(storedRefreshToken);
                            
                            // Sauvegarder les nouveaux tokens
                            mmkvStorage.setAccessToken(newTokens.accessToken);
                            mmkvStorage.setRefreshToken(newTokens.refreshToken);
                            
                            // Mettre à jour le store
                            dispatch(updateTokens(newTokens));
                        } catch (refreshError) {
                            // Impossible de rafraîchir, déconnecter l'utilisateur
                            console.log('Token invalide et impossible de rafraîchir:', refreshError);
                            await handleLogout();
                        }
                    }
                }
            } catch (error) {
                console.log('Erreur lors de l\'initialisation de l\'authentification:', error);
                await handleLogout();
            }
        };

        initializeAuth();
    }, [dispatch]);

    return { isAuthenticated };
};

// Hook pour gérer la connexion avec persistance
export const useAuthLogin = () => {
    const dispatch = useDispatch();

    const login = async (userData: any, tokens: { accessToken: string; refreshToken: string }) => {
        try {
            // Sauvegarder les données
            mmkvStorage.setUserData(userData);
            mmkvStorage.setAccessToken(tokens.accessToken);
            mmkvStorage.setRefreshToken(tokens.refreshToken);
            mmkvStorage.setIsAuthenticated(true);

            // Mettre à jour le store
            dispatch(setAuthData({
                user: userData,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken
            }));
        } catch (error) {
            console.log('Erreur lors de la sauvegarde des données d\'authentification:', error);
            throw error;
        }
    };

    return { login };
};

// Hook pour gérer la déconnexion avec nettoyage
export const useAuthLogout = () => {
    const dispatch = useDispatch();

    const logoutUser = async () => {
        try {
            // Appeler l'API de déconnexion si nécessaire
            await authService.logout();
        } catch (error) {
            console.log('Erreur lors de la déconnexion:', error);
        } finally {
            // Nettoyer le stockage local
            mmkvStorage.clearAuthData();
            
            // Nettoyer le store
            dispatch(logout());
        }
    };

    return { logout: logoutUser };
};

// Hook pour gérer le rafraîchissement des tokens
export const useTokenRefresh = () => {
    const dispatch = useDispatch();
    const refreshToken = useSelector((state: RootState) => state.user.refreshToken);

    const refreshTokens = async () => {
        if (!refreshToken) {
            throw new Error('Aucun refresh token disponible');
        }

        try {
            const newTokens = await authService.refreshToken(refreshToken);
            
            // Sauvegarder les nouveaux tokens
            mmkvStorage.setAccessToken(newTokens.accessToken);
            mmkvStorage.setRefreshToken(newTokens.refreshToken);
            
            // Mettre à jour le store
            dispatch(updateTokens(newTokens));
            
            return newTokens;
        } catch (error) {
            console.log('Erreur lors du rafraîchissement des tokens:', error);
            
            // En cas d'échec, déconnecter l'utilisateur
            const { logout } = useAuthLogout();
            await logout();
            
            throw error;
        }
    };

    return { refreshTokens };
};

// Hook pour gérer la déconnexion automatique
export const handleLogout = async () => {
    const { logout } = useAuthLogout();
    await logout();
};
