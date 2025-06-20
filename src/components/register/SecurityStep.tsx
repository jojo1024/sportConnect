import React, { useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import CustomTextInput from '../CustomTextInput';
import CustomButton from '../CustomButton';
import { colors } from '../../theme/colors';

interface SecurityStepProps {
    formState: any;
    handlers: any;
    setGlobalError: (error: string) => void;
    isLoading: boolean;
    onRegister: () => void;
    onPrev: () => void;
}

export default function SecurityStep({
    formState,
    handlers,
    setGlobalError,
    isLoading,
    onRegister,
    onPrev
}: SecurityStepProps) {
    const passwordInputRef = useRef<any>(null);
    return (
        <>
            {/* <Text style={styles.stepTitle}>Sécurité du compte</Text> */}

            <CustomTextInput
                label="Mot de passe"
                value={formState.motDePasse}
                onChangeText={(text) => {
                    handlers.handleMotDePasseChange(text);
                    setGlobalError('');
                }}
                onBlur={() => handlers.validateField('motDePasse')}
                error={handlers.errors.motDePasse}
                placeholder="••••••••"
                isPassword
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
            />

            <CustomTextInput
                label="Confirmer le mot de passe"
                value={formState.confirmerMotDePasse}
                onChangeText={(text) => {
                    handlers.handleConfirmerMotDePasseChange(text);
                    setGlobalError('');
                }}
                onBlur={() => handlers.validateField('confirmerMotDePasse')}
                error={handlers.errors.confirmerMotDePasse}
                placeholder="••••••••"
                isPassword
                returnKeyType="done"
                refInput={passwordInputRef}
            />

            <View style={styles.buttonContainer}>
                <CustomButton
                    title="<"
                    onPress={onPrev}
                    style={styles.secondaryButton}
                    textStyle={{ color: colors.text.secondary }}
                />
                <CustomButton
                    title="Créer un compte"
                    onPress={onRegister}
                    disabled={!handlers.isFormValid || isLoading}
                    style={{ flex: 1 }}
                >
                    {isLoading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <Text style={styles.buttonText}>S'inscrire</Text>
                    )}
                </CustomButton>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    stepTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#222',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    secondaryButton: {
        backgroundColor: '#fff',
        width: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 30,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
    },
}); 