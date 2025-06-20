import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const periods = [
    { label: 'Aujourd\'hui', key: 'today' },
    { label: '1 semaine', key: 'week' },
    { label: '1 mois', key: 'month' },
    { label: '3 mois', key: '3months' },
    { label: '6 mois', key: '6months' },
    { label: '1 an', key: 'year' },
];

const statsByPeriod: Record<string, {
    revenue: string;
    matches: number;
    players: number;
    bars: number[];
    averagePlayers: number;
    occupancyRate: string;
    popularTime: string;
}> = {
    today: {
        revenue: '170.500 FCFA',
        matches: 4,
        players: 28,
        bars: [2, 2, 4, 4, 8, 15, 14, 13, 12],
        averagePlayers: 7,
        occupancyRate: '75%',
        popularTime: '19h-21h'
    },
    week: {
        revenue: '1.200.000 FCFA',
        matches: 22,
        players: 140,
        bars: [3, 5, 6, 8, 7, 4, 5],
        averagePlayers: 6.4,
        occupancyRate: '82%',
        popularTime: '18h-20h'
    },
    month: {
        revenue: '4.800.000 FCFA',
        matches: 80,
        players: 520,
        bars: [10, 12, 8, 15, 14, 13, 12, 10, 9, 11, 13, 15],
        averagePlayers: 6.5,
        occupancyRate: '85%',
        popularTime: '19h-21h'
    },
    '3months': {
        revenue: '13.200.000 FCFA',
        matches: 210,
        players: 1500,
        bars: [20, 18, 22, 25, 24, 23, 21, 20, 19, 22, 24, 26],
        averagePlayers: 7.1,
        occupancyRate: '88%',
        popularTime: '19h-21h'
    },
    '6months': {
        revenue: '25.500.000 FCFA',
        matches: 420,
        players: 3100,
        bars: [25, 28, 30, 32, 35, 38],
        averagePlayers: 7.4,
        occupancyRate: '90%',
        popularTime: '19h-21h'
    },
    'year': {
        revenue: '48.000.000 FCFA',
        matches: 850,
        players: 6200,
        bars: [40, 42, 45, 48, 50, 52, 55, 58, 60, 62, 65, 68],
        averagePlayers: 7.3,
        occupancyRate: '92%',
        popularTime: '19h-21h'
    }
};

const StatisticsScreen: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const stats = statsByPeriod[selectedPeriod];

    // Pour le graphique simplifié
    const maxBar = Math.max(...stats.bars);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Statistiques</Text>
            </View>
            <ScrollView >

                {/* Sélecteur de période */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.periodSelector}
                >
                    {periods.map((period) => (
                        <TouchableOpacity
                            key={period.key}
                            style={[
                                styles.periodButton,
                                selectedPeriod === period.key && styles.periodButtonActive,
                            ]}
                            onPress={() => setSelectedPeriod(period.key)}
                        >
                            <Text
                                style={[
                                    styles.periodButtonText,
                                    selectedPeriod === period.key && styles.periodButtonTextActive,
                                ]}
                            >
                                {period.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Carte Revenu + Graphique */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Revenu total</Text>
                    <Text style={styles.cardValue}>{stats.revenue}</Text>
                    <View style={styles.barChartContainer}>
                        {stats.bars.map((val: number, idx: number) => (
                            <View
                                key={idx}
                                style={[
                                    styles.bar,
                                    { height: 60 * (val / maxBar) },
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Cartes Matchs & Joueurs */}
                <View style={styles.row}>
                    <View style={styles.smallCard}>
                        <Text style={styles.smallValue}>{stats.matches}</Text>
                        <Text style={styles.smallLabel}>Nombre de matchs</Text>
                    </View>
                    <View style={styles.smallCard}>
                        <Text style={styles.smallValue}>{stats.players}</Text>
                        <Text style={styles.smallLabel}>Joueurs venus</Text>
                    </View>
                </View>

                {/* Nouvelles statistiques */}
                <View style={styles.row}>
                    <View style={styles.smallCard}>
                        <Text style={styles.smallValue}>{stats.averagePlayers}</Text>
                        <Text style={styles.smallLabel}>Total réservations</Text>
                    </View>
                    <View style={styles.smallCard}>
                        <Text style={styles.smallValue}>{stats.occupancyRate}</Text>
                        <Text style={styles.smallLabel}>Taux d'occupation</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.smallCard, { flex: 1 }]}>
                        <Text style={styles.smallValue}>{stats.popularTime}</Text>
                        <Text style={styles.smallLabel}>Heure la plus populaire</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    periodSelector: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    periodButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: '#e6e6e6',
        marginRight: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: '#ff6600',
    },
    periodButtonText: {
        color: '#555',
        fontWeight: '500',
    },
    periodButtonTextActive: {
        color: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 6,
    },
    cardValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    barChartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 60,
        marginTop: 8,
        marginBottom: 4,
    },
    bar: {
        width: 16,
        backgroundColor: '#ff6600',
        borderRadius: 6,
        marginHorizontal: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    smallCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        flex: 1,
        marginHorizontal: 4,
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
    },
    smallValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    smallLabel: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default StatisticsScreen; 