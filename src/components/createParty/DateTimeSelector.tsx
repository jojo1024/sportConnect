import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme/colors';

interface DateTimeSelectorProps {
    date: Date;
    onDatePress: () => void;
    onTimePress: () => void;
    formatDate: (date: Date) => string;
    formatTime: (date: Date) => string;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
    date,
    onDatePress,
    onTimePress,
    formatDate,
    formatTime
}) => (
    <View style={styles.dateTimeContainer}>
        <TouchableOpacity style={styles.dateTimeButton} onPress={onDatePress}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateTimeButton} onPress={onTimePress}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            <Text style={styles.dateTimeText}>{formatTime(date)}</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    dateTimeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    dateTimeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    dateTimeText: {
        fontSize: 16,
        color: '#495057',
    },
}); 