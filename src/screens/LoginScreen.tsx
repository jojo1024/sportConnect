import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ActivityIndicator,
    Keyboard
} from 'react-native';
import { COLORS } from '../theme/colors';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import PhoneInput from '../components/PhoneInput';
import { useLoginForm } from '../hooks/useLoginForm';

export default function LoginScreen() {
    const [formState, formHandlers] = useLoginForm();
    const { width, height } = Dimensions.get('window');
    const isSmallScreen = height < 700;
    const isTablet = width > 768;

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        { minHeight: height * 0.8 }
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    <View style={styles.contentContainer}>
                        <Text style={[
                            styles.title,
                            { fontSize: isSmallScreen ? 24 : isTablet ? 32 : 28 }
                        ]}>
                            Se connecter
                        </Text>

                        <View style={styles.formContainer}>
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
                                accessibilityLabel="Mot de passe"
                                accessibilityHint="Entrez votre mot de passe"
                                autoComplete="password"
                                textContentType="password"
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
                                style={styles.forgotButton}
                                accessibilityLabel="Mot de passe oublié"
                                accessibilityRole="button"
                            >
                                <Text style={[
                                    styles.forgot,
                                    formHandlers.isLoading && styles.disabledText
                                ]}>
                                    Mot de passe oublié
                                </Text>
                            </TouchableOpacity>

                            <CustomButton
                                title="Se connecter"
                                onPress={formHandlers.handleLogin}
                                loading={formHandlers.isLoading}
                                style={styles.loginButton}
                            />

                            <View style={styles.signupContainer}>
                                <Text style={[
                                    styles.signupText,
                                    formHandlers.isLoading && styles.disabledText
                                ]}>
                                    Vous n'avez pas de compte ?
                                </Text>
                                <TouchableOpacity
                                    onPress={formHandlers.handleSignUp}
                                    disabled={formHandlers.isLoading}
                                    accessibilityLabel="S'inscrire"
                                    accessibilityRole="button"
                                >
                                    <Text style={[
                                        styles.signupText,
                                        { color: COLORS.primary, textDecorationLine: 'underline' },
                                        formHandlers.isLoading && styles.disabledText
                                    ]}>
                                        S'inscrire
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Overlay de chargement */}
                {formHandlers.isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Connexion en cours...</Text>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },

    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
        color: COLORS.title,
        textAlign: 'center',
    },
    formContainer: {
        gap: 16,
    },
    errorContainer: {
        backgroundColor: COLORS.notificationRed,
        borderColor: COLORS.danger,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 14,
        textAlign: 'center',
    },
    forgotButton: {
        alignSelf: 'flex-end',
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    forgot: {
        color: COLORS.textLight,
        fontSize: 13,
        textDecorationLine: 'underline',
    },
    loginButton: {
        marginTop: 8,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        flexWrap: 'wrap',
    },
    signupText: {
        color: COLORS.textLight,
        fontSize: 13,
        textAlign: 'center',
    },
    disabledText: {
        opacity: 0.5,
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