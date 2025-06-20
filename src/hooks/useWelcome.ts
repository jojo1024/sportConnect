import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ScreenNavigationProps } from '../navigation/types';
import { useAppSelector } from '../store/hooks/hooks';
import { selectDisplayWelcomeScreen, setDisplayWelcomeScreen } from '../store/slices/appSlice';
import { selectIsAuthenticated } from '../store/slices/userSlice';

export const useWelcome = () => {
    const dispatch = useDispatch();
    const displayWelcomeScreen = useAppSelector(selectDisplayWelcomeScreen);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const navigation = useNavigation<ScreenNavigationProps>();

    const handleGetStarted = () => {
            dispatch(setDisplayWelcomeScreen(false));
        navigation.navigate('Register');
    };

    const handleLogin = () => {
            dispatch(setDisplayWelcomeScreen(false));
        navigation.navigate('Login');
    };

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
        handleGetStarted,
        handleLogin
    };
}; 