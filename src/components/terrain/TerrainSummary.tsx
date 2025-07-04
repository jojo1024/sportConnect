import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';

interface TerrainSummaryProps {
    mode: 'create' | 'edit';
    formData: {
        terrainNom: string;
        terrainLocalisation: string;
        terrainContact: string;
        terrainPrixParHeure: string;
        terrainHoraires: {
            ouverture: string;
            fermeture: string;
        };
        terrainImages: string[];
        terrainDescription?: string;
    };
}

const TerrainSummary: React.FC<TerrainSummaryProps> = ({ mode, formData }) => {
    return (
        <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>
                {mode === 'create' ? 'Résumé de votre terrain' : 'Résumé des modifications'}
            </Text>
            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Nom:</Text>
                    <Text style={styles.summaryValue}>{formData.terrainNom}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Localisation:</Text>
                    <Text style={styles.summaryValue} numberOfLines={2}>
                        {formData.terrainLocalisation}
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Contact:</Text>
                    <Text style={styles.summaryValue}>{formData.terrainContact}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Prix:</Text>
                    <Text style={styles.summaryValue}>{formData.terrainPrixParHeure} FCFA/heure</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Horaires:</Text>
                    <Text style={styles.summaryValue}>
                        {formData.terrainHoraires.ouverture} - {formData.terrainHoraires.fermeture}
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Photos:</Text>
                    <Text style={styles.summaryValue}>
                        {formData.terrainImages.length} photo(s)
                    </Text>
                </View>
                {formData.terrainDescription && (
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Description:</Text>
                        <Text style={styles.summaryValue} numberOfLines={2}>
                            {formData.terrainDescription}
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
        color: COLORS.darkestGray,
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
        color: COLORS.darkGray,
        fontWeight: '500',
        flex: 1,
    },
    summaryValue: {
        fontSize: 14,
        color: COLORS.darkestGray,
        fontWeight: '600',
        flex: 2,
        textAlign: 'right',
    },
});

export default TerrainSummary; 