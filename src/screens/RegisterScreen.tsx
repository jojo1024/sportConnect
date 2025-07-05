import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRegisterScreen } from '../hooks/useRegisterScreen';
import { COLORS } from '../theme/colors';
import {
    RegisterStepIndicator,
    PersonalInfoStep,
    AdditionalInfoStep,
    SecurityStep,
    CommuneSelector,
    GlobalError
} from '../components/register';

export default function RegisterScreen() {
    const {
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
    } = useRegisterScreen();

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
                        setGlobalError={setGlobalError}
                        validateStep={validateStep}
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
                onPress={handleGoBack}
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
