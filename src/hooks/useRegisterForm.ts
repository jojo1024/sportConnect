import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProps } from '../navigation/types';
import { startLoading, setError, clearError } from '../store/slices/userSlice';
import { authService } from '../services/authService';
import { RootState } from '../store';
import { useAuthLogin } from '../store/hooks/hooks';

interface RegisterFormState {
    nom: string;
    telephone: string;
    commune: string;
    dateNaiss: string;
    sexe: 'Homme' | 'Femme';
    motDePasse: string;
    confirmerMotDePasse: string;
}

interface RegisterFormHandlers {
    handleNomChange: (text: string) => void;
    handleTelephoneChange: (text: string) => void;
    handleCommuneChange: (text: string) => void;
    handleDateNaissChange: (text: string) => void;
    handleSexeChange: (sexe: 'Homme' | 'Femme') => void;
    handleMotDePasseChange: (text: string) => void;
    handleConfirmerMotDePasseChange: (text: string) => void;
    handleRegister: () => Promise<void>;
    isFormValid: boolean;
    errors: Record<string, string>;
    validateField: (field: keyof RegisterFormState) => string;
}

export const useRegisterForm = (): [RegisterFormState, RegisterFormHandlers] => {
    const dispatch = useDispatch();
    const navigation = useNavigation<ScreenNavigationProps>();
    const isLoading = useSelector((state: RootState) => state.user.isLoading);
    const error = useSelector((state: RootState) => state.user.error);
    const { login } = useAuthLogin();
    
    const [formState, setFormState] = useState<RegisterFormState>({
        nom: '',
        telephone: '',
        commune: '',
        dateNaiss: '',
        sexe: 'Homme',
        motDePasse: '',
        confirmerMotDePasse: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (field: keyof RegisterFormState): string => {
        const value = formState[field];
        let errorMessage = '';
        
        switch (field) {
            case 'nom':
                if (!value.trim()) {
                    errorMessage = 'Le nom est requis';
                } else if (value.trim().length < 2) {
                    errorMessage = 'Le nom doit contenir au moins 2 caractères';
                } else if (value.trim().length > 30) {
                    errorMessage = 'Le nom ne peut pas dépasser 50 caractères';
                } else if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(value.trim())) {
                    errorMessage = 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes';
                }
                break;
                
            case 'telephone':
                if (!value.trim()) {
                    errorMessage = 'Le numéro de téléphone est requis';
                } else {
                    // Nettoyer le numéro de téléphone (supprimer espaces, tirets, etc.)
                    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
                    
                    if (!/^[0-9]{10}$/.test(cleanPhone)) {
                        errorMessage = 'Le numéro de téléphone doit contenir exactement 10 chiffres';
                    } else if (!cleanPhone.startsWith('0')) {
                        errorMessage = 'Le numéro de téléphone doit commencer par 0';
                    }
                }
                break;
                
            case 'commune':
                if (!value.trim()) {
                    errorMessage = 'La commune est requise';
                }
                break;
                
            case 'dateNaiss':
                if (!value) {
                    errorMessage = 'La date de naissance est requise';
                } else {
                    try {
                        const birth = new Date(value);
                        
                        // Vérifier que la date est valide et qu'elle n'est pas dans le futur
                        if (isNaN(birth.getTime())) {
                            errorMessage = 'Date de naissance invalide';
                        } else if (birth > new Date()) {
                            errorMessage = 'La date de naissance ne peut pas être dans le futur';
                        }
                    } catch (error) {
                        errorMessage = 'Date de naissance invalide';
                    }
                }
                break;
                
            case 'motDePasse':
                if (!value) {
                    errorMessage = 'Le mot de passe est requis';
                } else if (value.length < 4) {
                    errorMessage = 'Le mot de passe doit contenir au moins 4 caractères';
                } else if (value.length > 50) {
                    errorMessage = 'Le mot de passe ne peut pas dépasser 50 caractères';
                }
                break;
                
            case 'confirmerMotDePasse':
                if (!value) {
                    errorMessage = 'La confirmation du mot de passe est requise';
                } else if (formState.motDePasse !== value) {
                    errorMessage = 'Les mots de passe ne correspondent pas';
                }
                break;
        }
        
        // Mettre à jour l'erreur dans l'état
        setErrors(prev => ({
            ...prev,
            [field]: errorMessage
        }));
        
        return errorMessage;
    };

    const validateForm = (): Record<string, string> => {
        const newErrors: Record<string, string> = {};
        
        const fields: (keyof RegisterFormState)[] = ['nom', 'telephone', 'commune', 'dateNaiss', 'motDePasse', 'confirmerMotDePasse'];
        
        fields.forEach(field => {
            const error = validateField(field);
            if (error) {
                newErrors[field] = error;
            }
        });
        
        setErrors(newErrors);
        return newErrors;
    };

    const handleNomChange = (text: string) => {
        setFormState(prev => ({ ...prev, nom: text }));
        if (errors.nom) {
            setErrors(prev => ({ ...prev, nom: '' }));
        }
        if (error) {
            dispatch(clearError());
        }
    };

    const handleTelephoneChange = (text: string) => {
        setFormState(prev => ({ ...prev, telephone: text }));
        if (errors.telephone) {
            setErrors(prev => ({ ...prev, telephone: '' }));
        }
        if (error) {
            dispatch(clearError());
        }
    };

    const handleCommuneChange = (text: string) => {
        setFormState(prev => ({ ...prev, commune: text }));
        if (errors.commune) {
            setErrors(prev => ({ ...prev, commune: '' }));
        }
        if (error) {
            dispatch(clearError());
        }
    };

    const handleDateNaissChange = (text: string) => {
        setFormState(prev => ({ ...prev, dateNaiss: text }));
        // Effacer l'erreur immédiatement quand une date est sélectionnée
        setErrors(prev => ({ ...prev, dateNaiss: '' }));
        if (error) {
            dispatch(clearError());
        }
    };

    const handleSexeChange = (sexe: 'Homme' | 'Femme') => {
        setFormState(prev => ({ ...prev, sexe }));
        if (error) {
            dispatch(clearError());
        }
    };

    const handleMotDePasseChange = (text: string) => {
        setFormState(prev => ({ ...prev, motDePasse: text }));
        if (errors.motDePasse) {
            setErrors(prev => ({ ...prev, motDePasse: '' }));
        }
        if (errors.confirmerMotDePasse && formState.confirmerMotDePasse) {
            // Re-validate confirm password when password changes
            const confirmError = validateField('confirmerMotDePasse');
            setErrors(prev => ({ ...prev, confirmerMotDePasse: confirmError }));
        }
        if (error) {
            dispatch(clearError());
        }
    };

    const handleConfirmerMotDePasseChange = (text: string) => {
        setFormState(prev => ({ ...prev, confirmerMotDePasse: text }));
        if (errors.confirmerMotDePasse) {
            setErrors(prev => ({ ...prev, confirmerMotDePasse: '' }));
        }
        if (error) {
            dispatch(clearError());
        }
    };

    const handleRegister = async () => {
        if (isLoading) return;

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            // Afficher les erreurs de validation
            const errorMessages = Object.values(validationErrors).filter(msg => msg).join('\n');
            if (errorMessages) {
                throw new Error(errorMessages);
            }
            return;
        }

        try {
            dispatch(startLoading());

            const response = await authService.register({
                utilisateurNom: formState.nom,
                utilisateurTelephone: formState.telephone.replaceAll(' ', ''),
                utilisateurCommune: formState.commune,
                utilisateurDateNaiss: formState.dateNaiss,
                utilisateurSexe: formState.sexe,
                utilisateurRole: 'lambda',
                utilisateurMotDePasse: formState.motDePasse
            });

            console.log("🚀 ~ handleRegister ~ response:", response);

            // Connecter automatiquement l'utilisateur après inscription
            await login(response.user, {
                accessToken: response.accessToken,
                refreshToken: response.refreshToken
            });

            // Navigation vers l'écran principal
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        } catch (error: any) {
            console.log("🚀 ~ handleRegister ~ error:", error);
            
            let errorMessage = 'Erreur d\'inscription. Veuillez réessayer.';
            
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response?.status === 400) {
                errorMessage = 'Données invalides';
            } else if (error.response?.status === 409) {
                errorMessage = 'Ce numéro de téléphone est déjà utilisé';
            }
            
            dispatch(setError(errorMessage));
            throw new Error(errorMessage);
        }
    };

    // Calculer isFormValid en temps réel
    const isFormValid = 
        formState.nom.trim().length >= 2 &&
        /^[0-9]{10}$/.test(formState.telephone.replace(/\s/g, '')) &&
        formState.commune.trim().length > 0 &&
        formState.dateNaiss.length > 0 &&
        formState.motDePasse.length >= 4 &&
        formState.confirmerMotDePasse.length > 0 &&
        formState.motDePasse === formState.confirmerMotDePasse &&
        !isLoading;

    return [
        formState,
        {
            handleNomChange,
            handleTelephoneChange,
            handleCommuneChange,
            handleDateNaissChange,
            handleSexeChange,
            handleMotDePasseChange,
            handleConfirmerMotDePasseChange,
            handleRegister,
            isFormValid,
            errors,
            validateField,
        },
    ];
}; 