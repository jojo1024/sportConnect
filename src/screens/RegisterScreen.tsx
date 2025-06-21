import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { COLORS } from '../theme/colors';
import { ScreenNavigationProps } from '../navigation/types';
import {
    RegisterStepIndicator,
    PersonalInfoStep,
    AdditionalInfoStep,
    SecurityStep,
    CommuneSelector,
    GlobalError
} from '../components/register';

export default function RegisterScreen() {
    const navigation = useNavigation<ScreenNavigationProps>();
    const bottomSheetRef = useRef<RBSheet>(null);
    const [formState, handlers] = useRegisterForm();
    const [searchCommune, setSearchCommune] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
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
        setShowDatePicker(false);
        setCurrentStep(currentStep - 1);
    };

    // Gestion de la date
    const confirmDateSelection = () => {
        setShowDatePicker(false);
        if (formState.dateNaiss) {
            const dateError = handlers.validateField('dateNaiss');
            if (dateError) {
                setGlobalError(dateError);
            } else {
                setGlobalError('');
            }
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (selectedDate) {
            const apiDate = selectedDate.toISOString().split('T')[0];
            handlers.handleDateNaissChange(apiDate);
            setGlobalError('');
        }
    };

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return 'JJ/MM/AAAA';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
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

    // Rendu des étapes
    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <PersonalInfoStep
                        formState={formState}
                        handlers={handlers}
                        bottomSheetRef={bottomSheetRef}
                        setGlobalError={setGlobalError}
                        validateStep={validateStep}
                        onNext={handleNextStep}
                    />
                );
            case 2:
                return (
                    <AdditionalInfoStep
                        formState={formState}
                        handlers={handlers}
                        showDatePicker={showDatePicker}
                        setShowDatePicker={setShowDatePicker}
                        setGlobalError={setGlobalError}
                        validateStep={validateStep}
                        onDateChange={onDateChange}
                        confirmDateSelection={confirmDateSelection}
                        formatDisplayDate={formatDisplayDate}
                        onNext={handleNextStep}
                        onPrev={handlePrevStep}
                    />
                );
            case 3:
                return (
                    <SecurityStep
                        formState={formState}
                        handlers={handlers}
                        setGlobalError={setGlobalError}
                        isLoading={isLoading}
                        onRegister={onRegister}
                        onPrev={handlePrevStep}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Bouton retour */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Créer un compte</Text>

                {/* Indicateur d'étapes */}
                <RegisterStepIndicator
                    currentStep={currentStep}
                    validateStep={validateStep}
                />

                {/* Contenu de l'étape actuelle */}
                {renderCurrentStep()}

                {/* Message d'erreur global */}
                <GlobalError error={globalError} />
            </ScrollView>

            {/* Sélecteur de commune */}
            <CommuneSelector
                bottomSheetRef={bottomSheetRef}
                searchCommune={searchCommune}
                setSearchCommune={setSearchCommune}
                formState={formState}
                handlers={handlers}
                setGlobalError={setGlobalError}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
        color: COLORS.text,
    },
    scrollContent: {
        flexGrow: 1,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    backButtonText: {
        color: COLORS.text,
        fontSize: 16,
        marginLeft: 10,
    },
});
