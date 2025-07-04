import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Match } from '../../services/matchService';
import { COLORS } from '../../theme/colors';

interface DescriptionSectionProps {
    match: Match;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ match }) => (
    <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>Consignes du capo</Text>
        <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>
                {match.matchDescription || "Aucune consigne particulière pour cette partie."}
            </Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    descriptionSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.almostBlack,
        marginBottom: 12,
    },
    descriptionCard: {
        backgroundColor: COLORS.backgroundWhite,
        borderRadius: 12,
        padding: 16,
    },
    descriptionText: {
        fontSize: 14,
        color: COLORS.darkGray,
        lineHeight: 20,
    },
});

export default DescriptionSection; 