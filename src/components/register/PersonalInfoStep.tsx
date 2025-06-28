import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomTextInput from '../CustomTextInput';
import CustomButton from '../CustomButton';
import PhoneInput from '../PhoneInput';
import { COLORS } from '../../theme/colors';

interface PersonalInfoStepProps {
    formState: any;
    handlers: any;
    bottomSheetRef: any;
    setGlobalError: (error: string) => void;
    validateStep: (step: number) => boolean;
    onNext: () => void;
}

export default function PersonalInfoStep({
    formState,
    handlers,
    bottomSheetRef,
    setGlobalError,
    validateStep,
    onNext
}: PersonalInfoStepProps) {
    const telephoneRef = useRef<any>(null);
    return (
        <>
            {/* <Text style={styles.stepTitle}>Informations personnelles</Text> */}

            <CustomTextInput
                label="Nom d'utilisateur"
                value={formState.nom}
                onChangeText={(text) => {
                    // const words = text.split(' ');
                    // const capitalizedWords = words.map(word =>
                    //     word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    // );
                    // const formattedText = capitalizedWords.join(' ');
                    handlers.handleNomChange(text);
                    setGlobalError('');
                }}
                onBlur={() => handlers.validateField('nom')}
                error={handlers.errors.nom}
                placeholder="Ex: Joelitho"
                maxLength={50}
                returnKeyType="next"
                onSubmitEditing={() => telephoneRef.current?.focus()}
            />

            <PhoneInput
                label="Numéro de téléphone"
                value={formState.telephone}
                onChangeText={(text) => {
                    handlers.handleTelephoneChange(text);
                    setGlobalError('');
                }}
                error={handlers.errors.telephone}
                placeholder="01 23 45 67 89"
                returnKeyType="next"
                refInput={telephoneRef}
            />

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Commune</Text>
                <TouchableOpacity
                    style={[styles.input, handlers.errors.commune && styles.inputError]}
                    onPress={() => bottomSheetRef.current?.open()}
                >
                    <Text style={styles.inputText}>
                        {formState.commune || 'Sélectionner une commune'}
                    </Text>
                    <Ionicons name="chevron-down" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
                {!!handlers.errors.commune && <Text style={styles.error}>{handlers.errors.commune}</Text>}
            </View>

            <CustomButton
                title="Suivant"
                onPress={onNext}
                disabled={!validateStep(1)}
                style={styles.fullWidthButton}
            />
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
    inputContainer: {
        marginBottom: 8,
    },
    label: {
        color: COLORS.primary,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    inputText: {
        color: COLORS.text,
        fontSize: 16,
    },
    error: {
        color: COLORS.danger,
        fontSize: 13,
        marginTop: 4,
    },
    fullWidthButton: {
        width: '100%',
        marginTop: 20,
    },
}); 