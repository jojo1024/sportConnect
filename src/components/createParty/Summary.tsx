import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { Terrain } from '../../services/terrainService';

interface Sport {
    sportId: number;
    sportNom: string;
    sportIcone: string;
    sportStatus: number;
}

interface SummaryProps {
    selectedField: Terrain | undefined;
    date: Date;
    duration: number;
    numberOfParticipants: number;
    description?: string;
    formatDate: (date: Date) => string;
    formatTime: (date: Date) => string;
    selectedSport?: Sport | undefined;
}

export const Summary: React.FC<SummaryProps> = ({
    selectedField,
    date,
    duration,
    numberOfParticipants,
    description,
    formatDate,
    formatTime,
    selectedSport,
}) => {
    if (!selectedField) {
        return null;
    }

    return (
        <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Résumé de votre partie</Text>
            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Terrain:</Text>
                    <Text style={styles.summaryValue}>{selectedField.terrainNom}</Text>
                </View>
                {selectedSport && (
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Sport:</Text>
                        <Text style={styles.summaryValue}>{selectedSport.sportNom}</Text>
                    </View>
                )}
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Date:</Text>
                    <Text style={styles.summaryValue}>
                        {formatDate(date)} à {formatTime(date)}
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Durée:</Text>
                    <Text style={styles.summaryValue}>{duration}h</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Participants:</Text>
                    <Text style={styles.summaryValue}>
                        {numberOfParticipants} joueurs
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Prix du terrain:</Text>
                    <Text style={styles.summaryValue}>
                        {selectedField.terrainPrixParHeure} XOF/heure
                    </Text>
                </View>
                {description && (
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Message:</Text>
                        <Text style={styles.summaryValue} numberOfLines={2}>
                            {description}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    summarySection: {
        marginTop: 8,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    summaryCard: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    summaryValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        flex: 2,
        textAlign: 'right',
    },
}); 