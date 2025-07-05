import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import PhoneInput from '../components/PhoneInput';
import { useLoginForm } from '../hooks/useLoginForm';
import { COLORS } from '../theme/colors';

export default function LoginScreen() {
    const [formState, formHandlers] = useLoginForm();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Se connecter</Text>
            <PhoneInput
                label="Numéro de téléphone"
                value={formState.phone}
                onChangeText={formHandlers.handlePhoneChange}
                placeholder="06 12 34 56 78"
                returnKeyType="next"
                onSubmitEditing={() => formHandlers.passwordInputRef.current?.focus()}
            />

            <CustomTextInput
                label="Mot de passe"
                value={formState.password}
                onChangeText={formHandlers.handlePasswordChange}
                placeholder="••••••••"
                isPassword
                refInput={formHandlers.passwordInputRef}
                returnKeyType="done"
                onSubmitEditing={formHandlers.handleLogin}
            />

            {/* Affichage des erreurs */}
            {formHandlers.error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{formHandlers.error}</Text>
                </View>
            )}

            <TouchableOpacity
                onPress={formHandlers.handleForgotPassword}
                disabled={formHandlers.isLoading}
            >
                <Text style={[styles.forgot, formHandlers.isLoading && styles.disabledText]}>
                    Mot de passe oublié
                </Text>
            </TouchableOpacity>

            <CustomButton
                title={"Se connecter"}
                onPress={formHandlers.handleLogin}
                loading={formHandlers.isLoading}
            />

            <View style={styles.signupContainer}>
                <Text style={[styles.signupText, formHandlers.isLoading && styles.disabledText]}>
                    Vous n'avez pas de compte ?
                </Text>
                <TouchableOpacity
                    onPress={formHandlers.handleSignUp}
                    disabled={formHandlers.isLoading}
                >
                    <Text style={[
                        styles.signupText,
                        { color: "#000", textDecorationLine: 'underline' },
                        formHandlers.isLoading && styles.disabledText
                    ]}>
                        S'inscrire
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
        color: COLORS.text,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 4,
        alignItems: 'center',
    },
    roleButtonSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    roleText: {
        color: '#666',
        fontSize: 14,
    },
    roleTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    inputContainer: {
        marginBottom: 8,
    },
    label: {
        color: COLORS.primary,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
        backgroundColor: COLORS.white,
    },
    inputError: {
        borderColor: 'red',
    },
    error: {
        color: 'red',
        fontSize: 13,
        marginTop: 4,
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        borderColor: COLORS.danger,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 14,
        textAlign: 'center',
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 25,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 18,
    },
    buttonDisabled: {
        backgroundColor: '#FFD6B3',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
    },
    forgot: {
        color: '#888',
        textAlign: 'right',
        fontSize: 13,
        textDecorationLine: 'underline',
        marginBottom: 24,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    signupText: {
        color: '#888',
        fontSize: 13,
    },
    disabledText: {
        opacity: 0.5,
    },
}); 