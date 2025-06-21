import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

interface GlobalErrorProps {
    error: string;
}

export default function GlobalError({ error }: GlobalErrorProps) {
    if (!error) return null;

    return (
        <View style={styles.globalErrorContainer}>
            <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
            <Text style={styles.globalErrorText}>{error}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    globalErrorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        marginTop: 20,
    },
    globalErrorText: {
        color: COLORS.danger,
        fontSize: 14,
        marginLeft: 10,
    },
}); 