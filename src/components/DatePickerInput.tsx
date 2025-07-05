import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../theme/colors';

interface DatePickerInputProps {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
    error?: string;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder = 'Sélectionner une date',
    error,
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [tempDate, setTempDate] = useState<Date | null>(
        value ? new Date(value) : null
    );

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }

        if (selectedDate) {
            setTempDate(selectedDate);
            if (Platform.OS === 'ios') {
                // Sur iOS, on garde le picker ouvert pour permettre la confirmation
                return;
            }
            // Sur Android, on applique directement
            const dateString = selectedDate.toISOString().split('T')[0];
            onChangeText(dateString);
        }
    };

    const handleConfirm = () => {
        setShowPicker(false);
        if (tempDate) {
            const dateString = tempDate.toISOString().split('T')[0];
            onChangeText(dateString);
        }
    };

    const handleCancel = () => {
        setShowPicker(false);
        setTempDate(value ? new Date(value) : null);
    };

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const openPicker = () => {
        setShowPicker(true);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity
                style={[styles.inputContainer, error && styles.inputError]}
                onPress={openPicker}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.inputText,
                    !value && styles.placeholderText
                ]}>
                    {value ? formatDisplayDate(value) : placeholder}
                </Text>
                <MaterialIcons name="event" size={20} color={COLORS.gray[500]} />
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}

            {showPicker && (
                <DateTimePicker
                    value={tempDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1900, 0, 1)}
                />
            )}

            {Platform.OS === 'ios' && showPicker && (
                <View style={styles.iosButtons}>
                    <TouchableOpacity style={styles.iosButton} onPress={handleCancel}>
                        <Text style={styles.iosButtonText}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iosButton, styles.confirmButton]} onPress={handleConfirm}>
                        <Text style={[styles.iosButtonText, styles.confirmButtonText]}>Confirmer</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    label: {
        color: COLORS.primary,
        fontWeight: '500',
        marginBottom: 6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        backgroundColor: COLORS.white,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    inputError: {
        borderColor: COLORS.danger,
    },
    inputText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
    },
    placeholderText: {
        color: '#ccc',
    },
    error: {
        color: COLORS.danger,
        fontSize: 13,
        marginTop: 4,
    },
    iosButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    iosButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
    },
    confirmButton: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    iosButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    confirmButtonText: {
        color: COLORS.white,
    },
});

export default DatePickerInput; 