import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/typography';

interface StatisticsRevenueProps {
    revenue: string;
    loadingFilter: boolean;
}

const StatisticsRevenue: React.FC<StatisticsRevenueProps> = ({
    revenue,
    loadingFilter,
}) => {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Revenu total</Text>
            {loadingFilter ? (
                <View style={styles.loadingValueContainer}>
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            ) : (
                <Text style={styles.cardValue}>{revenue}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 10,
        padding: 20,
        shadowColor: COLORS.black,
        shadowOpacity: 0.07,
        shadowRadius: 8,
        // elevation: 2,
    },
    cardTitle: {
        ...FONTS.fontLg,
        color: COLORS.textLight,
        marginBottom: 6,
    },
    cardValue: {
        ...FONTS.h2,
        color: COLORS.title,
        marginBottom: 12,
    },
    loadingValueContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...FONTS.font,
        color: COLORS.textLight,
        textAlign: 'center',
    },
});

export default StatisticsRevenue; 