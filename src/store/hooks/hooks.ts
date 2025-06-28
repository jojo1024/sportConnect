import { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "..";
import { authService } from '../../services/authService';
import {
    logout,
    selectAccessToken,
    selectIsAuthenticated,
    selectRefreshToken,
    selectUser,
    setAuthData,
    updateTokens
} from '../slices/userSlice';
import { ScreenNavigationProps } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
// import mmkvStorage from './mmkvStorage';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hook pour initialiser l'état d'authentification au démarrage
export const useAuthInitialization = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const accessToken = useAppSelector(selectAccessToken);
    const refreshToken = useAppSelector(selectRefreshToken);
    const userData = useAppSelector(selectUser);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Si on a déjà des données d'authentification dans le store
                if (isAuthenticated && accessToken && refreshToken && userData) {
                    console.log('🚀 ~ Authentification déjà présente dans le store');
                    return; // Ne rien faire, l'authentification est déjà valide
                }

                // Si on n'a pas de données d'authentification, ne pas essayer de les restaurer
                if (!accessToken || !refreshToken || !userData) {
                    console.log('🚀 ~ Aucune donnée d\'authentification à restaurer');
                    return;
                }

                // Restaurer l'état d'authentification sans vérification immédiate
                // La validation se fera automatiquement lors de la prochaine requête API
                dispatch(setAuthData({
                    user: userData,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }));
                console.log('🚀 ~ Authentification restaurée avec succès');
                
            } catch (error) {
                console.log('🚀 ~ Erreur lors de l\'initialisation de l\'authentification:', error);
                // Ne pas déconnecter automatiquement en cas d'erreur d'initialisation
                // L'utilisateur pourra toujours essayer d'utiliser l'app
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
    const navigation = useNavigation<ScreenNavigationProps>();
    
    const logoutUser = async () => {
        try {
            console.log('🚀 ~ Déconnexion explicite de l\'utilisateur');
            
            // Appeler l'API de déconnexion si nécessaire
            // await authService.logout(userData?.utilisateurId || 0);
            
            // Nettoyer le store
            dispatch(logout());
            
            // Rediriger vers l'écran de bienvenue
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        } catch (error) {
            console.log('🚀 ~ Erreur lors de la déconnexion:', error);
            // Même en cas d'erreur, nettoyer le store local
            dispatch(logout());
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        }
    };

    return { logout: logoutUser };
};

// Hook pour gérer le rafraîchissement des tokens
export const useTokenRefresh = () => {
    const dispatch = useDispatch();
    const refreshToken = useAppSelector(selectRefreshToken);

    const refreshTokens = async () => {
        if (!refreshToken) {
            throw new Error('Aucun refresh token disponible');
        }

        try {
            const newTokens = await authService.refreshToken(refreshToken);
            // Mettre à jour le store
            dispatch(updateTokens(newTokens));
            
            return newTokens;
        } catch (error) {
            console.log('🚀 ~ Erreur lors du rafraîchissement des tokens:', error);
            throw error;
        }
    };

    return { refreshTokens };
};

// Hook pour vérifier la validité du token
export const useTokenValidation = () => {
    const dispatch = useDispatch();
    const accessToken = useAppSelector(selectAccessToken);
    const refreshToken = useAppSelector(selectRefreshToken);

    const validateToken = async (): Promise<boolean> => {
        if (!accessToken || !refreshToken) {
            console.log('🚀 ~ Aucun token disponible pour validation');
            return false;
        }

        try {
            // Optionnel : vérifier la validité du token avec le backend
            // await authService.verifyToken(accessToken);
            console.log('🚀 ~ Token valide');
            return true;
        } catch (error) {
            console.log('🚀 ~ Token invalide, tentative de rafraîchissement:', error);
            
            try {
                const newTokens = await authService.refreshToken(refreshToken);
                dispatch(updateTokens(newTokens));
                console.log('🚀 ~ Token rafraîchi avec succès');
                return true;
            } catch (refreshError) {
                console.log('🚀 ~ Impossible de rafraîchir le token:', refreshError);
                return false;
            }
        }
    };

    return { validateToken };
};
