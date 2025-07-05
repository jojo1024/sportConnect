import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../theme/colors';
import { calculateAge, formatDate, getAgeDisplay } from '../utils/functions';

// Interface définissant les propriétés du composant DateOfBirthInput
interface DateOfBirthInputProps {
    label: string; // Libellé affiché au-dessus du champ
    value: string; // Valeur actuelle de la date (format string)
    onChangeText: (value: string) => void; // Fonction appelée lors du changement de date
    error?: string; // Message d'erreur optionnel
    onErrorChange?: (error: string) => void; // Fonction pour gérer les changements d'erreur
    placeholder?: string; // Texte de placeholder optionnel
}

// Composant pour la saisie de date de naissance avec validation d'âge
const DateOfBirthInput: React.FC<DateOfBirthInputProps> = ({
    label,
    value,
    onChangeText,
    error,
    onErrorChange,
    placeholder = 'Sélectionner une date'
}) => {
    // État pour contrôler l'affichage du sélecteur de date
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Fonction appelée lors du changement de date dans le DateTimePicker
    const onDateChange = (event: any, selectedDate?: Date) => {
        // Sur Android, fermer automatiquement le picker après sélection
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }

        if (selectedDate) {
            // Convertir la date en format string (YYYY-MM-DD)
            const dateString = selectedDate.toISOString().split('T')[0];
            onChangeText(dateString);

            // Validation de l'âge - doit être entre 13 et 100 ans
            const age = calculateAge(selectedDate);
            if (age < 13 || age > 100) {
                onErrorChange?.('L\'âge doit être entre 13 et 100 ans');
            } else {
                onErrorChange?.('');
            }
        }
    };

    // Fonction pour confirmer la sélection de date (utilisée sur iOS)
    const confirmDateSelection = () => {
        setShowDatePicker(false);
    };



    // Fonction pour ouvrir le sélecteur de date
    const openDatePicker = () => {
        setShowDatePicker(true);
    };

    return (
        <View style={styles.container}>
            {/* Libellé du champ */}
            <Text style={styles.label}>{label}</Text>
            
            {/* Bouton pour ouvrir le sélecteur de date */}
            <TouchableOpacity
                style={[styles.input, error && styles.inputError]}
                onPress={openDatePicker}
                activeOpacity={0.8}
            >
                <Text style={[
                    styles.inputText,
                    !value && styles.placeholderText
                ]}>
                    {formatDate(value)}
                </Text>
                <Ionicons name="calendar-outline" size={24} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Affichage du message d'erreur */}
            {error && <Text style={styles.error}>{error}</Text>}

            {/* Indicateur de validation avec affichage de l'âge */}
            {value && !error && (
                <View style={styles.validIndicator}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                    <Text style={styles.validText}>
                        {getAgeDisplay(value)}
                    </Text>
                </View>
            )}

            {/* Sélecteur de date conditionnel */}
            {showDatePicker && (
                <>
                    <DateTimePicker
                        value={value ? new Date(value) : new Date()}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onDateChange}
                        locale="fr-FR"
                        maximumDate={new Date()} // Pas de date future
                        minimumDate={new Date(1900, 0, 1)} // Date minimum : 1900
                        style={Platform.OS === 'ios' ? { width: '100%' } : undefined}
                    />
                    {/* Boutons de contrôle pour iOS uniquement */}
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
        </View>
    );
};

// Styles du composant
const styles = StyleSheet.create({
    container: {
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
        borderColor: COLORS.danger, // Bordure rouge en cas d'erreur
    },
    inputText: {
        color: COLORS.text,
        fontSize: 16,
    },
    placeholderText: {
        color: COLORS.textLight, // Couleur plus claire pour le placeholder
    },
    error: {
        color: COLORS.danger,
        fontSize: 13,
        marginTop: 4,
    },
    validIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    validText: {
        color: COLORS.success,
        fontSize: 13,
        marginLeft: 4,
    },
    datePickerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    datePickerButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
    },
    datePickerButtonConfirm: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    datePickerButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    datePickerButtonTextConfirm: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white,
    },
});

export default DateOfBirthInput;