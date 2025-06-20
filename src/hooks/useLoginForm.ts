import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProps } from '../navigation/types';
import { startLoading, setError, clearError } from '../store/slices/userSlice';
import { authService } from '../services/authService';
import { RootState } from '../store';
import { useAuthLogin } from '../store/hooks/hooks';

type Role = 'standard' | 'capo' | 'manager';

interface LoginFormState {
    phone: string;
    password: string;
    selectedRole: Role;
}

interface LoginFormHandlers {
    handlePhoneChange: (text: string) => void;
    handlePasswordChange: (text: string) => void;
    handleLogin: () => Promise<void>;
    setSelectedRole: (role: Role) => void;
    isFormValid: boolean;
}

export const useLoginForm = (): [LoginFormState, LoginFormHandlers] => {
    const dispatch = useDispatch();
    const navigation = useNavigation<ScreenNavigationProps>();
    const isLoading = useSelector((state: RootState) => state.user.isLoading);
    const error = useSelector((state: RootState) => state.user.error);
    const { login } = useAuthLogin();
    
    const [formState, setFormState] = useState<LoginFormState>({
        phone: '',
        password: '',
        selectedRole: 'standard',
    });

    const handlePhoneChange = (text: string) => {
        setFormState(prev => ({ ...prev, phone: text }));
        if (error) {
            dispatch(clearError());
        }
    };

    const handlePasswordChange = (text: string) => {
        setFormState(prev => ({ ...prev, password: text }));
        if (error) {
            dispatch(clearError());
        }
    };

    const handleLogin = async () => {
        if (isLoading) return;
        
        try {
            dispatch(startLoading());

            const response = await authService.login({
                utilisateurTelephone: formState.phone,
                utilisateurMotDePasse: formState.password
            });

            console.log("🚀 ~ handleLogin ~ response:", response);

            await login(response.user, {
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
            });

            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        } catch (error: any) {
            console.log("🚀 ~ handleLogin ~ error:", error);
            
            let errorMessage = 'Erreur de connexion. Veuillez réessayer.';
            
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Numéro de téléphone ou mot de passe incorrect';
            } else if (error.response?.status === 403) {
                errorMessage = 'Compte désactivé';
            } else if (error.response?.status === 400) {
                errorMessage = 'Données invalides';
            }
            
            dispatch(setError(errorMessage));
        }
    };

    const setSelectedRole = (role: Role) => {
        setFormState(prev => ({ ...prev, selectedRole: role }));
    };

    const isFormValid = formState.phone.length > 0 && formState.password.length > 0 && !isLoading;

    return [
        formState,
        {
            handlePhoneChange,
            handlePasswordChange,
            handleLogin,
            setSelectedRole,
            isFormValid,
        },
    ];
}; 