import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Keyboard, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { ScreenNavigationProps } from '../navigation/types';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import { useLoginForm } from '../hooks/useLoginForm';
import { PRIMARY_COLOR } from '../utils/constant';
import { RootState } from '../store';

export default function LoginScreen() {
    const navigation = useNavigation<ScreenNavigationProps>();
    const passwordInputRef = useRef<any>(null);
    const [formState, formHandlers] = useLoginForm();

    // Récupérer les états du store
    const isLoading = useSelector((state: RootState) => state.user.isLoading);
    const error = useSelector((state: RootState) => state.user.error);

    const handleLogin = async () => {
        Keyboard.dismiss();
        try {
            await formHandlers.handleLogin();
        } catch (error) {
            // L'erreur est déjà gérée dans le hook
            console.log('Erreur de connexion:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Se connecter</Text>
            {/* 
            <View style={styles.roleContainer}>
                <TouchableOpacity
                    style={[styles.roleButton, formState.selectedRole === 'standard' && styles.roleButtonSelected]}
                    onPress={() => formHandlers.setSelectedRole('standard')}
                >
                    <Text style={[styles.roleText, formState.selectedRole === 'standard' && styles.roleTextSelected]}>
                        Utilisateur
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.roleButton, formState.selectedRole === 'capo' && styles.roleButtonSelected]}
                    onPress={() => formHandlers.setSelectedRole('capo')}
                >
                    <Text style={[styles.roleText, formState.selectedRole === 'capo' && styles.roleTextSelected]}>
                        Capo
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.roleButton, formState.selectedRole === 'manager' && styles.roleButtonSelected]}
                    onPress={() => formHandlers.setSelectedRole('manager')}
                >
                    <Text style={[styles.roleText, formState.selectedRole === 'manager' && styles.roleTextSelected]}>
                        Gérant
                    </Text>
                </TouchableOpacity>
            </View> */}

            <CustomTextInput
                label="Numéro de téléphone"
                value={formState.phone}
                onChangeText={formHandlers.handlePhoneChange}
                placeholder="0612345678"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
            />

            <CustomTextInput
                label="Mot de passe"
                value={formState.password}
                onChangeText={formHandlers.handlePasswordChange}
                placeholder="••••••••"
                isPassword
                refInput={passwordInputRef}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
            />

            {/* Affichage des erreurs */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <TouchableOpacity disabled={isLoading}>
                <Text style={[styles.forgot, isLoading && styles.disabledText]}>Mot de passe oublié</Text>
            </TouchableOpacity>

            <CustomButton
                title={isLoading ? "Connexion..." : "Se connecter"}
                onPress={handleLogin}
                disabled={!formHandlers.isFormValid}
            />

            <View style={styles.signupContainer}>
                <Text style={[styles.signupText, isLoading && styles.disabledText]}>
                    Vous n'avez pas de compte ?
                </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}
                    disabled={isLoading}
                >
                    <Text style={[
                        styles.signupText,
                        { color: "#000", textDecorationLine: 'underline' },
                        isLoading && styles.disabledText
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
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
        color: '#222',
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
        backgroundColor: PRIMARY_COLOR,
        borderColor: PRIMARY_COLOR,
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
        color: '#FF6600',
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
        backgroundColor: '#fff',
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
        borderColor: '#f44336',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 14,
        textAlign: 'center',
    },
    button: {
        backgroundColor: PRIMARY_COLOR,
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