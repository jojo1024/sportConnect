import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/typography';

interface StatisticsCardsProps {
    statistics: {
        reservationsPending: number;
        reservationsConfirmed: number;
        reservationsCancelled: number;
        players: number;
        popularTime: string;
    };
    loadingFilter: boolean;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
    statistics,
    loadingFilter,
}) => {
    return (
        <>
            {/* Première rangée */}
            <View style={styles.row}>
                <View style={styles.smallCard}>
                    {loadingFilter ? (
                        <View style={styles.loadingValueContainer}>
                            <Text style={styles.loadingText}>...</Text>
                        </View>
                    ) : (
                        <Text style={styles.smallValue}>{statistics.reservationsPending.toString()}</Text>
                    )}
                    <Text style={styles.smallLabel}>Réservations en attente</Text>
                </View>
                <View style={styles.smallCard}>
                    {loadingFilter ? (
                        <View style={styles.loadingValueContainer}>
                            <Text style={styles.loadingText}>...</Text>
                        </View>
                    ) : (
                        <Text style={styles.smallValue}>{statistics.reservationsConfirmed.toString()}</Text>
                    )}
                    <Text style={styles.smallLabel}>Réservations confirmés</Text>
                </View>
            </View>

            {/* Deuxième rangée */}
            <View style={styles.row}>
                <View style={styles.smallCard}>
                    {loadingFilter ? (
                        <View style={styles.loadingValueContainer}>
                            <Text style={styles.loadingText}>...</Text>
                        </View>
                    ) : (
                        <Text style={styles.smallValue}>{statistics.reservationsCancelled.toString()}</Text>
                    )}
                    <Text style={styles.smallLabel}>Reservations annulées</Text>
                </View>
                <View style={styles.smallCard}>
                    {loadingFilter ? (
                        <View style={styles.loadingValueContainer}>
                            <Text style={styles.loadingText}>...</Text>
                        </View>
                    ) : (
                        <Text style={styles.smallValue}>{statistics.players.toString()}</Text>
                    )}
                    <Text style={styles.smallLabel}>Joueurs inscrits</Text>
                </View>
            </View>

            {/* Troisième rangée */}
            <View style={styles.row}>
                <View style={[styles.smallCard, { flex: 1 }]}>
                    {loadingFilter ? (
                        <View style={styles.loadingValueContainer}>
                            <Text style={styles.loadingText}>...</Text>
                        </View>
                    ) : (
                        <Text style={styles.smallValue}>{statistics.popularTime}</Text>
                    )}
                    <Text style={styles.smallLabel}>Heure la plus populaire</Text>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    smallCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        flex: 1,
        marginHorizontal: 4,
        padding: 18,
        alignItems: 'center',
        shadowColor: COLORS.black,
        shadowOpacity: 0.07,
        shadowRadius: 8,
        // elevation: 2,
    },
    smallValue: {
        ...FONTS.h3,
        color: COLORS.title,
        marginBottom: 4,
    },
    smallLabel: {
        ...FONTS.fontSm,
        color: COLORS.textLight,
        textAlign: 'center',
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

export default StatisticsCards; 