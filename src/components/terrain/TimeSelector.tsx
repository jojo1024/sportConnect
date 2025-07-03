import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';

interface TimeSelectorProps {
    label: string;
    time: string;
    onPress: () => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ label, time, onPress }) => (
    <TouchableOpacity style={styles.timeSelector} onPress={onPress}>
        <Text style={styles.timeSelectorLabel}>{label}</Text>
        <Text style={styles.timeSelectorValue}>{time}</Text>
        <Ionicons name="time" size={20} color={COLORS.primary} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    timeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    timeSelectorLabel: {
        fontSize: 14,
        color: '#666',
    },
    timeSelectorValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});

export default TimeSelector; 