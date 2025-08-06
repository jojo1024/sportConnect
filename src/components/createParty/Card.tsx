import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';

interface CardProps {
    icon: string;
    title: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ icon, title, children, headerAction }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
                <Ionicons name={icon as any} size={24} color={COLORS.primary} />
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
            {headerAction && (
                <View style={styles.cardHeaderAction}>
                    {headerAction}
                </View>
            )}
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
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cardHeaderAction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
}); 