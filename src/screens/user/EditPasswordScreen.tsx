import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import CompactErrorCard from '../../components/CompactErrorCard';
import SuccessCard from '../../components/SuccessCard';
import { useChangePassword } from '../../hooks/useChangePassword';

const EditPasswordScreen: React.FC = () => {
    const {
        formData,
        loading,
        error,
        successMessage,
        newPasswordRef,
        confirmPasswordRef,
        handleInputChange,
        handleSave,
        clearSuccessMessage,
        handleRetry,
        goBack
    } = useChangePassword();

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={goBack}
                        accessibilityLabel="Retour"
                        accessibilityRole="button"
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Modifier le mot de passe</Text>
                    <View style={styles.headerSpacer} />
                </View>
      {/* Affichage des messages de succès et d'erreur */}
      {successMessage && (
                            <SuccessCard
                                message={successMessage}
                                onClose={clearSuccessMessage}
                            />
                        )}

                        {error && (
                            <CompactErrorCard
                                message={error}
                                onRetry={handleRetry}
                            />
                        )}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >

                        <CustomTextInput
                            label='Ancien mot de passe'
                            value={formData.ancienMotDePasse}
                            onChangeText={(value) => handleInputChange('ancienMotDePasse', value)}
                            placeholder="••••••••"
                            isPassword
                            returnKeyType="next"
                            onSubmitEditing={() => newPasswordRef.current?.focus()}
                        />


                        <CustomTextInput
                            label='Nouveau mot de passe'
                            refInput={newPasswordRef}
                            value={formData.nouveauMotDePasse}
                            onChangeText={(value) => handleInputChange('nouveauMotDePasse', value)}
                            placeholder="••••••••"
                            isPassword
                            returnKeyType="next"
                            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                        />

                        {/* Confirmation du nouveau mot de passe */}

                        <CustomTextInput
                            label='Confirmer le nouveau mot de passe'
                            refInput={confirmPasswordRef}
                            value={formData.confirmationMotDePasse}
                            onChangeText={(value) => handleInputChange('confirmationMotDePasse', value)}
                            placeholder="••••••••"
                            isPassword
                        />

                  

                        {/* Bouton de sauvegarde */}
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title="Modifier le mot de passe"
                                onPress={handleSave}
                                loading={loading}
                                style={styles.saveButton}
                            />
                        </View>

                        <View style={{ height: 70 }}></View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    keyboardContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputContainerFocused: {
        transform: [{ scale: 1.01 }],
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
        marginBottom: 8,
    },
    labelFocused: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    passwordInput: {
        paddingRight: 50,
    },
    buttonContainer: {
        marginTop: 20,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
    },
});

export default EditPasswordScreen; 