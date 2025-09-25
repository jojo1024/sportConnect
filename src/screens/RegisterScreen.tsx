import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ActivityIndicator,
    View
} from 'react-native';
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

    const { width, height } = Dimensions.get('window');
    const isSmallScreen = height < 700;
    const isTablet = width > 768;

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
        <SafeAreaView style={[styles.container, Platform.OS === 'ios' && styles.iosContainer]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                {/* Header avec bouton retour */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handleGoBack}
                        accessibilityLabel="Retour"
                        accessibilityRole="button"
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                        <Text style={styles.backButtonText}>Retour</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { minHeight: height * 0.85 }
                    ]}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    <View style={styles.contentContainer}>
                        <Text style={[
                            styles.title,
                            { fontSize: isSmallScreen ? 24 : isTablet ? 32 : 28 }
                        ]}>
                            Créer un compte
                        </Text>

                        {/* Indicateur d'étapes */}
                        <RegisterStepIndicator
                            currentStep={currentStep}
                            validateStep={validateStep}
                        />

                        {/* Contenu de l'étape actuelle */}
                        <View style={styles.stepContainer}>
                            {renderCurrentStep()}
                        </View>

                        {/* Message d'erreur global */}
                        <GlobalError error={globalError} />
                    </View>
                </ScrollView>

                {/* Overlay de chargement */}
                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Création du compte...</Text>
                    </View>
                )}

                {/* Sélecteur de commune */}
                <CommuneSelector
                    bottomSheetRef={bottomSheetRef}
                    searchCommune={searchCommune}
                    setSearchCommune={setSearchCommune}
                    formState={formState}
                    handlers={handlers}
                    setGlobalError={setGlobalError}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    iosContainer: {
        backgroundColor: COLORS.primary,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderColor,
        backgroundColor: COLORS.white,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: COLORS.text,
        fontSize: 16,
        marginLeft: 8,
        fontWeight: '500',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    contentContainer: {
        flex: 1,
        maxWidth: 500,
        alignSelf: 'center',
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        color: COLORS.text,
        textAlign: 'center',
    },
    stepContainer: {
        marginTop: 20,
        minHeight: 300,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '500',
    },
});
