import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateCardProps {
    message: string;
    icon?: string;
}

export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
    message,
    icon = 'calendar-outline'
}) => {
    return (
        <View style={styles.container}>
            <Ionicons name={icon as any} size={48} color="#CBD5E1" style={styles.icon} />
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.subtitle}>
                Veuillez rafraîchir la page pour voir les nouvelles réservations
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    icon: {
        marginBottom: 16,
    },
    message: {
        fontSize: 18,
        color: '#64748B',
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 20,
    },
}); 