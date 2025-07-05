import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../CustomButton';
import DateOfBirthInput from '../DateOfBirthInput';
import { COLORS } from '../../theme/colors';

interface AdditionalInfoStepProps {
    formState: any;
    handlers: any;
    setGlobalError: (error: string) => void;
    validateStep: (step: number) => boolean;
    onNext: () => void;
    onPrev: () => void;
}

export default function AdditionalInfoStep({
    formState,
    handlers,
    setGlobalError,
    validateStep,
    onNext,
    onPrev
}: AdditionalInfoStepProps) {
    return (
        <>
            {/* <Text style={styles.stepTitle}>Informations complémentaires</Text> */}

            <DateOfBirthInput
                label="Date de naissance"
                value={formState.dateNaiss}
                onChangeText={(value) => {
                    handlers.handleDateNaissChange(value);
                    setGlobalError('');
                }}
                error={handlers.errors.dateNaiss}
                onErrorChange={(error) => handlers.setFieldError('dateNaiss', error)}
                placeholder="Sélectionner votre date de naissance"
            />

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Sexe</Text>
                <View style={styles.sexeButtons}>
                    <TouchableOpacity
                        style={[
                            styles.sexeButton,
                            formState.sexe === 'Homme' && styles.sexeButtonActive
                        ]}
                        onPress={() => {
                            handlers.handleSexeChange('Homme');
                            setGlobalError('');
                        }}
                    >
                        <Text style={[
                            styles.sexeButtonText,
                            formState.sexe === 'Homme' && styles.sexeButtonTextActive
                        ]}>Homme</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.sexeButton,
                            formState.sexe === 'Femme' && styles.sexeButtonActive
                        ]}
                        onPress={() => {
                            handlers.handleSexeChange('Femme');
                            setGlobalError('');
                        }}
                    >
                        <Text style={[
                            styles.sexeButtonText,
                            formState.sexe === 'Femme' && styles.sexeButtonTextActive
                        ]}>Femme</Text>
                    </TouchableOpacity>
                </View>
                {!!handlers.errors.sexe && <Text style={styles.error}>{handlers.errors.sexe}</Text>}
            </View>

            <View style={styles.buttonContainer}>
                <CustomButton
                    title="<"
                    onPress={onPrev}
                    style={styles.secondaryButton}
                    textStyle={{ color: COLORS.textLight }}
                />
                <CustomButton
                    title="Suivant"
                    onPress={onNext}
                    disabled={!validateStep(2)}
                    style={{ flex: 1 }}
                />
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
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: 'red',
    },
    inputText: {
        color: COLORS.textLight,
        fontSize: 16,
    },
    error: {
        color: 'red',
        fontSize: 13,
        marginTop: 4,
    },
    validIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    sexeButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    sexeButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    sexeButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    sexeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textLight,
    },
    sexeButtonTextActive: {
        color: COLORS.white,
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
}); 