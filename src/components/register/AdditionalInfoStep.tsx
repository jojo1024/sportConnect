import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../CustomButton';
import { COLORS } from '../../theme/colors';

interface AdditionalInfoStepProps {
    formState: any;
    handlers: any;
    showDatePicker: boolean;
    setShowDatePicker: (show: boolean) => void;
    setGlobalError: (error: string) => void;
    validateStep: (step: number) => boolean;
    onDateChange: (event: any, selectedDate?: Date) => void;
    confirmDateSelection: () => void;
    formatDisplayDate: (dateString: string) => string;
    onNext: () => void;
    onPrev: () => void;
}

export default function AdditionalInfoStep({
    formState,
    handlers,
    showDatePicker,
    setShowDatePicker,
    setGlobalError,
    validateStep,
    onDateChange,
    confirmDateSelection,
    formatDisplayDate,
    onNext,
    onPrev
}: AdditionalInfoStepProps) {
    return (
        <>
            {/* <Text style={styles.stepTitle}>Informations complémentaires</Text> */}

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Date de naissance</Text>
                <TouchableOpacity
                    style={[styles.input, handlers.errors.dateNaiss && styles.inputError]}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.inputText}>
                        {formatDisplayDate(formState.dateNaiss)}
                    </Text>
                    <Ionicons name="calendar-outline" size={24} color={COLORS.textLight} />
                </TouchableOpacity>
                {!!handlers.errors.dateNaiss && formState.dateNaiss && <Text style={styles.error}>{handlers.errors.dateNaiss}</Text>}
                {formState.dateNaiss && !handlers.errors.dateNaiss && (
                    <View style={styles.validIndicator}>
                        <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                        <Text style={styles.validText}>
                            {(() => {
                                try {
                                    const today = new Date();
                                    const birth = new Date(formState.dateNaiss);
                                    if (!isNaN(birth.getTime())) {
                                        let age = today.getFullYear() - birth.getFullYear();
                                        const monthDiff = today.getMonth() - birth.getMonth();
                                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                                            age--;
                                        }
                                        return `Âge: ${age} ans`;
                                    }
                                } catch (error) {
                                    // Ignorer les erreurs de calcul d'âge
                                }
                                return 'Date valide';
                            })()}
                        </Text>
                    </View>
                )}
            </View>

            {showDatePicker && (
                <>
                    <DateTimePicker
                        value={formState.dateNaiss ? new Date(formState.dateNaiss) : new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDateChange}
                        locale="fr-FR"
                        style={Platform.OS === 'ios' ? { width: '100%' } : undefined}
                    />
                    {Platform.OS === 'ios' && (
                        <View style={styles.datePickerButtons}>
                            <TouchableOpacity
                                style={styles.datePickerButton}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text style={styles.datePickerButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.datePickerButton, styles.datePickerButtonConfirm]}
                                onPress={confirmDateSelection}
                            >
                                <Text style={styles.datePickerButtonTextConfirm}>Confirmer</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}

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
    validText: {
        color: COLORS.textLight,
        fontSize: 14,
        marginLeft: 4,
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
        // ...typography.body1,
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
    datePickerButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    datePickerButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginLeft: 10,
    },
    datePickerButtonConfirm: {
        backgroundColor: COLORS.primary,
        borderRadius: 5,
    },
    datePickerButtonText: {
        color: COLORS.textLight,
        fontSize: 16,
    },
    datePickerButtonTextConfirm: {
        color: COLORS.white,
    },
}); 