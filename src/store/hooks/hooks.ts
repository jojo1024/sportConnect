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

                if (isAuthenticated && accessToken && refreshToken && userData) {
                    // Vérifier si le token est encore valide
                    try {
                        // Optionnel : vérifier la validité du token avec le backend
                        // await authService.verifyToken(storedAccessToken);
                        
                        // Restaurer l'état d'authentification
                        dispatch(setAuthData({
                            user: userData,
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        }));
                    } catch (error) {
                        // Token invalide, essayer de le rafraîchir
                        try {
                            const newTokens = await authService.refreshToken(refreshToken);
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
            // Appeler l'API de déconnexion si nécessaire
            // await authService.logout(userData?.utilisateurId || 0);
            // Nettoyer le store
            dispatch(logout());
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        } catch (error) {
            console.log('Erreur lors de la déconnexion:', error);
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
