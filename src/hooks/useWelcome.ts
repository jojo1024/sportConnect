import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ScreenNavigationProps } from '../navigation/types';
import { useAppSelector } from '../store/hooks/hooks';
import { selectDisplayWelcomeScreen, setDisplayWelcomeScreen } from '../store/slices/appSlice';
import { selectIsAuthenticated } from '../store/slices/userSlice';

/**
 * Hook personnalisé pour gérer la logique de l'écran d'accueil
 * Gère la navigation automatique et les actions utilisateur sur l'écran de bienvenue
 * 
 * Fonctionnalités :
 * - Navigation automatique vers l'écran principal si l'utilisateur est connecté
 * - Navigation vers l'écran de connexion si l'écran de bienvenue n'est pas affiché
 * - Gestion des actions "Commencer" et "Se connecter"
 * 
 * @returns {Object} Objet contenant les handlers pour les actions utilisateur
 */
export const useWelcome = () => {
   
    const dispatch = useDispatch();
    const displayWelcomeScreen = useAppSelector(selectDisplayWelcomeScreen);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const navigation = useNavigation<ScreenNavigationProps>();

    /**
     * Gère l'action "Commencer" - navigue vers l'écran d'inscription
     */
    const handleRegister = () => {
        // navigation.navigate('Register');
        dispatch(setDisplayWelcomeScreen(false));
    };

    /**
     * Gère l'action "Se connecter" - navigue vers l'écran de connexion
     */
    const handleLogin = () => {
        // navigation.navigate('Login');
        dispatch(setDisplayWelcomeScreen(false));
    };

    /**
     * Effet pour gérer la navigation automatique selon l'état de l'utilisateur
     */
    useEffect(() => {
        if (isAuthenticated) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        }
        if (!displayWelcomeScreen) {
            navigation.navigate('Login');
        }
    }, [displayWelcomeScreen, isAuthenticated]);

    return {
        handleRegister,
        handleLogin
    };
}; 