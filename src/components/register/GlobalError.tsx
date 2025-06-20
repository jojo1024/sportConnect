import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GlobalErrorProps {
    error: string;
}

export default function GlobalError({ error }: GlobalErrorProps) {
    if (!error) return null;

    return (
        <View style={styles.globalErrorContainer}>
            <Ionicons name="alert-circle" size={20} color="#ff4444" />
            <Text style={styles.globalErrorText}>{error}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    globalErrorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 20,
    },
    globalErrorText: {
        color: '#ff4444',
        fontSize: 14,
        marginLeft: 10,
    },
}); 