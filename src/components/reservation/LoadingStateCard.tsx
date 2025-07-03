import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../../theme/colors';

interface LoadingStateCardProps {
    message?: string;
}

export const LoadingStateCard: React.FC<LoadingStateCardProps> = ({
    message = 'Chargement des réservations...'
}) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.subtitle}>
                Veuillez patienter un instant
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    message: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 16,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 4,
    },
}); 