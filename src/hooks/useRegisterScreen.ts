import { useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useRegisterForm } from './useRegisterForm';
import { ScreenNavigationProps } from '../navigation/types';

export const useRegisterScreen = () => {
    const navigation = useNavigation<ScreenNavigationProps>();
    const bottomSheetRef = useRef<RBSheet>(null);
    const [formState, handlers] = useRegisterForm();
    const [searchCommune, setSearchCommune] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [globalError, setGlobalError] = useState<string>('');

    // Validation des étapes
    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                const cleanPhone = formState.telephone.replace(/[\s\-\(\)]/g, '');
                return (
                    formState.nom.trim().length >= 2 &&
                    formState.nom.trim().length <= 30 &&
                    /^[a-zA-ZÀ-ÿ\s\-']+$/.test(formState.nom.trim()) &&
                    /^[0-9]{10}$/.test(cleanPhone) &&
                    !!formState.commune &&
                    !handlers.errors.nom &&
                    !handlers.errors.telephone &&
                    !handlers.errors.commune
                );
            case 2:
                const hasDateError = !!handlers.errors.dateNaiss;
                const hasDate = !!formState.dateNaiss;

                if (hasDate && !hasDateError) {
                    try {
                        const birth = new Date(formState.dateNaiss);
                        if (isNaN(birth.getTime())) {
                            return false;
                        }
                        // Vérifier que la date n'est pas dans le futur
                        if (birth > new Date()) {
                            return false;
                        }
                        return true;
                    } catch (error) {
                        return false;
                    }
                }
                return false;
            case 3:
                return (
                    formState.motDePasse.length >= 4 &&
                    formState.motDePasse.length <= 50 &&
                    formState.motDePasse === formState.confirmerMotDePasse &&
                    !handlers.errors.motDePasse &&
                    !handlers.errors.confirmerMotDePasse
                );
            default:
                return false;
        }
    };

    // Gestion des étapes
    const handleNextStep = () => {
        if (currentStep === 1) {
            const nomError = handlers.validateField('nom');
            const telephoneError = handlers.validateField('telephone');
            const communeError = handlers.validateField('commune');

            if (nomError || telephoneError || communeError) {
                Alert.alert('Erreur de validation', 'Veuillez corriger les erreurs avant de continuer.');
                return;
            }
        } else if (currentStep === 2) {
            // Pour l'étape 2, vérifier d'abord si une date est sélectionnée
            if (!formState.dateNaiss) {
                Alert.alert('Erreur de validation', 'Veuillez sélectionner une date de naissance.');
                return;
            }

            const dateError = handlers.validateField('dateNaiss');
            if (dateError) {
                Alert.alert('Erreur de validation', dateError);
                return;
            }
        }

        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    // Gestion de l'inscription
    const onRegister = async () => {
        if (!handlers.isFormValid) {
            setGlobalError('Veuillez remplir tous les champs correctement.');
            return;
        }

        setGlobalError('');
        setIsLoading(true);
        try {
            await handlers.handleRegister();
        } catch (error: any) {
            setGlobalError(error.message || 'Une erreur est survenue lors de l\'inscription.');
        } finally {
            setIsLoading(false);
        }
    };

    // Gestion du retour
    const handleGoBack = () => {
        navigation.navigate('Login');
    };

    return {
        // États
        formState,
        handlers,
        bottomSheetRef,
        searchCommune,
        isLoading,
        currentStep,
        globalError,
        
        // Setters
        setSearchCommune,
        setGlobalError,
        
        // Fonctions
        validateStep,
        handleNextStep,
        handlePrevStep,
        onRegister,
        handleGoBack
    };
}; 