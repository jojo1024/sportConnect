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
        backgroundColor: COLORS.gray[100],
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    timeSelectorLabel: {
        fontSize: 14,
        color: COLORS.darkGray,
    },
    timeSelectorValue: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.darkestGray,
    },
});

export default TimeSelector; 