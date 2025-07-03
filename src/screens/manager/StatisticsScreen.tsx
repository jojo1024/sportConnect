import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../theme/colors';
import { SIZES, FONTS } from '../../theme/typography';
import { Ionicons } from '@expo/vector-icons';



const periods = [
    { label: 'Aujourd\'hui', key: 'today' },
    { label: 'Cette semaine', key: 'week' },
    { label: 'Ce mois', key: 'month' },
    { label: '3 mois', key: '3months' },
    { label: '6 mois', key: '6months' },
    { label: '1 an', key: 'year' },
    { label: 'Tous', key: 'all' },
    { label: 'Personnalisé', key: 'custom' },
];

const statsByPeriod: Record<string, {
    revenue: string;
    matches: number;
    players: number;
    bars: number[];
    averagePlayers: number;
    occupancyRate: string;
    popularTime: string;
    reservations: number;
    reservationsConfirmed: number;
    reservationsPending: number;
    reservationsCancelled: number;
}> = {
    custom: {
        revenue: '0 FCFA',
        matches: 0,
        players: 0,
        bars: [0, 0, 0, 0, 0, 0, 0],
        averagePlayers: 0,
        occupancyRate: '0%',
        popularTime: '--',
        reservations: 0,
        reservationsConfirmed: 0,
        reservationsPending: 0,
        reservationsCancelled: 0
    },
    all: {
        revenue: '52.000.000 FCFA',
        matches: 1586,
        players: 11488,
        bars: [45, 48, 52, 55, 58, 62, 65, 68, 70, 72, 75, 78],
        averagePlayers: 7.2,
        occupancyRate: '94%',
        popularTime: '19h-21h',
        reservations: 2284,
        reservationsConfirmed: 1850,
        reservationsPending: 234,
        reservationsCancelled: 200
    },
    today: {
        revenue: '170.500 FCFA',
        matches: 4,
        players: 28,
        bars: [2, 2, 4, 4, 8, 15, 14, 13, 12],
        averagePlayers: 7,
        occupancyRate: '75%',
        popularTime: '19h-21h',
        reservations: 12,
        reservationsConfirmed: 8,
        reservationsPending: 3,
        reservationsCancelled: 1
    },
    week: {
        revenue: '1.200.000 FCFA',
        matches: 22,
        players: 140,
        bars: [3, 5, 6, 8, 7, 4, 5],
        averagePlayers: 6.4,
        occupancyRate: '82%',
        popularTime: '18h-20h',
        reservations: 38,
        reservationsConfirmed: 32,
        reservationsPending: 4,
        reservationsCancelled: 2
    },
    month: {
        revenue: '4.800.000 FCFA',
        matches: 80,
        players: 520,
        bars: [10, 12, 8, 15, 14, 13, 12, 10, 9, 11, 13, 15],
        averagePlayers: 6.5,
        occupancyRate: '85%',
        popularTime: '19h-21h',
        reservations: 142,
        reservationsConfirmed: 120,
        reservationsPending: 15,
        reservationsCancelled: 7
    },
    '3months': {
        revenue: '13.200.000 FCFA',
        matches: 210,
        players: 1500,
        bars: [20, 18, 22, 25, 24, 23, 21, 20, 19, 22, 24, 26],
        averagePlayers: 7.1,
        occupancyRate: '88%',
        popularTime: '19h-21h',
        reservations: 284,
        reservationsConfirmed: 245,
        reservationsPending: 28,
        reservationsCancelled: 11
    },
    '6months': {
        revenue: '25.500.000 FCFA',
        matches: 420,
        players: 3100,
        bars: [25, 28, 30, 32, 35, 38],
        averagePlayers: 7.4,
        occupancyRate: '90%',
        popularTime: '19h-21h',
        reservations: 568,
        reservationsConfirmed: 495,
        reservationsPending: 52,
        reservationsCancelled: 21
    },
    'year': {
        revenue: '48.000.000 FCFA',
        matches: 850,
        players: 6200,
        bars: [40, 42, 45, 48, 50, 52, 55, 58, 60, 62, 65, 68],
        averagePlayers: 7.3,
        occupancyRate: '92%',
        popularTime: '19h-21h',
        reservations: 1240,
        reservationsConfirmed: 1080,
        reservationsPending: 120,
        reservationsCancelled: 40
    }
};

const StatisticsScreen: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isSpecificDateSelected, setIsSpecificDateSelected] = useState(false);
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const stats = statsByPeriod[selectedPeriod] || statsByPeriod['today'];

    // Calcul responsive des dimensions du graphique
    const cardPadding = 20;
    const cardMargin = 16;
    const chartWidth = screenWidth - (cardMargin * 2) - (cardPadding * 2);
    const chartHeight = Math.max(200, Math.min(300, screenHeight * 0.25)); // Entre 200 et 300px, ou 25% de la hauteur d'écran

    const chartData = {
        labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        datasets: [
            {
                data: [40000, 68000, 0, 15000, 50000, 10000, 5000],
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: COLORS.white,
        backgroundGradientTo: COLORS.white,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 102, 0, ${opacity})`, // COLORS.primary
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.7})`, // COLORS.text
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: COLORS.primary,
        },
        barPercentage: 0.8,
        useShadowColorFromDataset: false,
    };

    const handleCalendarPress = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event: any, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
            setIsSpecificDateSelected(true);
            // Réinitialiser la sélection de période quand une date spécifique est choisie
            setSelectedPeriod('custom');
            // Ici vous pouvez ajouter la logique pour charger les statistiques pour la date sélectionnée
            console.log('Date spécifique sélectionnée:', date.toLocaleDateString('fr-FR'));
        }
    };

    const handlePeriodSelect = (periodKey: string) => {
        setSelectedPeriod(periodKey);
        // Si on sélectionne une période prédéfinie, on désactive la date spécifique
        if (periodKey !== 'custom') {
            setIsSpecificDateSelected(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Statistiques</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Graphique principal */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Activité de la semaine (F CFA)</Text>
                    <BarChart
                        data={chartData}
                        width={chartWidth}
                        height={chartHeight}
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                        fromZero={true}
                        showBarTops={true}
                        showValuesOnTopOfBars={true}
                    />
                </View>

                {/* Section de filtre */}
                <View style={styles.filterRow}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.filterScrollView}
                        contentContainerStyle={styles.filterContainer}
                    >
                        {periods.map((period) => (
                            <TouchableOpacity
                                key={period.key}
                                style={[
                                    styles.filterButton,
                                    selectedPeriod === period.key && styles.filterButtonActive,
                                ]}
                                onPress={() => handlePeriodSelect(period.key)}
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedPeriod === period.key && styles.filterButtonTextActive,
                                    ]}
                                >
                                    {period.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.calendarButton}
                        onPress={handleCalendarPress}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={24}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Section de sélection de date spécifique */}
                {selectedPeriod === 'custom' && (
                    <View style={styles.dateSelectionContainer}>
                        <View style={styles.dateSelectionHeader}>
                            <Text style={styles.dateSelectionTitle}>Date spécifique</Text>
                            <TouchableOpacity
                                style={styles.calendarButton}
                                onPress={handleCalendarPress}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="calendar-outline"
                                    size={24}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.dateDisplayText}>
                            {selectedDate.toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                    </View>
                )}

                {/* Carte Revenu + Graphique */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Revenu total</Text>
                    <Text style={styles.cardValue}>{stats.revenue}</Text>
                </View>

                {/* Cartes Matchs & Joueurs */}
                <View style={styles.row}>
                    <View style={styles.smallCard}>
                        <Text style={styles.smallValue}>{stats.matches}</Text>
                        <Text style={styles.smallLabel}>Réservations en attente</Text>
                    </View>
                    <View style={styles.smallCard}>
                        <Text style={styles.smallValue}>{stats.players}</Text>
                        <Text style={styles.smallLabel}>Réservations confirmés</Text>
                    </View>
                </View>

                {/* Nouvelles statistiques */}
                <View style={styles.row}>
                    <View style={styles.smallCard}>
                        <Text style={styles.smallValue}>{stats.reservations}</Text>
                        <Text style={styles.smallLabel}>Reservations annulées</Text>
                    </View>
                    <View style={styles.smallCard}>
                        <Text style={styles.smallValue}>{stats.players}</Text>
                        <Text style={styles.smallLabel}>Joueurs présents</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.smallCard, { flex: 1 }]}>
                        <Text style={styles.smallValue}>{stats.popularTime}</Text>
                        <Text style={styles.smallLabel}>Heure la plus populaire</Text>
                    </View>
                </View>

                {/* Espace en bas pour éviter que le contenu soit caché */}
                <View style={{ height: 50 }} />
            </ScrollView>

            {/* DateTimePicker */}
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(2020, 0, 1)}
                    locale="fr-FR"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginBottom: 15,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderColor,
        elevation: 2,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 10,
        padding: 20,
        shadowColor: COLORS.black,
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
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
    barChartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 60,
        marginTop: 8,
        marginBottom: 4,
        justifyContent: 'space-between',
    },
    bar: {
        flex: 1,
        backgroundColor: COLORS.primary,
        borderRadius: 6,
        marginHorizontal: 2,
        minHeight: 4,
    },
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
        elevation: 2,
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
    filterSection: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 20,
        shadowColor: COLORS.black,
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterScrollView: {
        flex: 1,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: COLORS.light,
        marginRight: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: COLORS.primary,
    },
    filterButtonText: {
        ...FONTS.font,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    filterButtonTextActive: {
        color: COLORS.white,
        fontWeight: '600',
    },
    calendarButton: {
        padding: 8,
        // borderRadius: 20,
        backgroundColor: COLORS.background,
    },
    filterInfoContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    filterInfoText: {
        ...FONTS.fontSm,
        color: COLORS.textLight,
    },

    dateDisplayText: {
        ...FONTS.font,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    dateSelectionContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: COLORS.black,
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
    },
    dateSelectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateSelectionTitle: {
        ...FONTS.fontLg,
        color: COLORS.textLight,
        marginBottom: 6,
    },
});

export default StatisticsScreen; 