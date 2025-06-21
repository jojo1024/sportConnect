import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProps } from '../navigation/types';
import { startLoading, setError, clearError } from '../store/slices/userSlice';
import { authService } from '../services/authService';
import { RootState } from '../store';
import { useAuthLogin } from '../store/hooks/hooks';

// Types disponibles pour les rôles utilisateurs
type Role = 'standard' | 'capo' | 'manager';

// Structure de l'état du formulaire
interface LoginFormState {
  phone: string;
  password: string;
  selectedRole: Role;
}

// Structure des fonctions de gestion du formulaire
interface LoginFormHandlers {
  handlePhoneChange: (text: string) => void;
  handlePasswordChange: (text: string) => void;
  handleLogin: () => Promise<void>;
  setSelectedRole: (role: Role) => void;
  isFormValid: boolean;
}

/**
 * Hook personnalisé pour gérer le formulaire de connexion utilisateur.
 */
export const useLoginForm = (): [LoginFormState, LoginFormHandlers] => {
  const dispatch = useDispatch();
  const navigation = useNavigation<ScreenNavigationProps>();
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  const error = useSelector((state: RootState) => state.user.error);
  const { login } = useAuthLogin();

  // État local du formulaire
  const [formState, setFormState] = useState<LoginFormState>({
    phone: '',
    password: '',
    selectedRole: 'standard',
  });

  /**
   * Gère la saisie du numéro de téléphone.
   */
  const handlePhoneChange = (text: string) => {
    setFormState(prev => ({ ...prev, phone: text }));
    if (error) dispatch(clearError());
  };

  /**
   * Gère la saisie du mot de passe.
   */
  const handlePasswordChange = (text: string) => {
    setFormState(prev => ({ ...prev, password: text }));
    if (error) dispatch(clearError());
  };

  /**
   * Gère la tentative de connexion utilisateur.
   */
  const handleLogin = async () => {
    if (isLoading) return;

    try {
      dispatch(startLoading());

      const response = await authService.login({
        utilisateurTelephone: formState.phone.replaceAll(' ', ''),
        utilisateurMotDePasse: formState.password,
      });


      await login(response.user, {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      // Redirection après connexion
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error: any) {
      console.log('🚀 ~ handleLogin ~ error:', error);

      // Gestion des messages d’erreur
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

  /**
   * Gère le changement de rôle utilisateur.
   */
  const setSelectedRole = (role: Role) => {
    setFormState(prev => ({ ...prev, selectedRole: role }));
  };

  /**
   * Vérifie si le formulaire est prêt à être soumis.
   */
  const isFormValid =
    formState.phone.trim().length > 0 &&
    formState.password.trim().length > 0 &&
    !isLoading;

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
