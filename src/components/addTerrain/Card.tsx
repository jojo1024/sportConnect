import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';

interface CardProps {
    icon: string;
    title: string;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ icon, title, children }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <Ionicons name={icon as any} size={24} color={COLORS.primary} />
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {children}
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        // elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
}); 