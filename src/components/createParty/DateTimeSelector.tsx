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
}) => {
    const isDefaultDate = date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

    const isDefaultTime = date.getHours() === new Date().getHours() &&
        date.getMinutes() === new Date().getMinutes();

    return (
        <View style={styles.dateTimeContainer}>
            <TouchableOpacity style={styles.dateTimeButton} onPress={onDatePress}>
                <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
                <View style={styles.dateTimeTextContainer}>
                    <Text style={styles.dateTimeLabel}>Date</Text>
                    <Text style={[styles.dateTimeText, isDefaultDate && styles.defaultText]} numberOfLines={1}>
                        {formatDate(date)}
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateTimeButton} onPress={onTimePress}>
                <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                <View style={styles.dateTimeTextContainer}>
                    <Text style={styles.dateTimeLabel}>Heure</Text>
                    <Text style={[styles.dateTimeText, isDefaultTime && styles.defaultText]} numberOfLines={1}>
                        {formatTime(date)}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    dateTimeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    dateTimeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        minHeight: 56,
    },
    dateTimeTextContainer: {
        flex: 1,
        marginLeft: 8,
    },
    dateTimeLabel: {
        fontSize: 11,
        color: '#666',
        marginBottom: 2,
        fontWeight: '500',
    },
    dateTimeText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    defaultText: {
        color: '#999',
        fontStyle: 'italic',
    },
}); 