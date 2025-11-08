import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Platform, FlatList, RefreshControl } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS } from '../../theme/colors';
import { useStatistics } from '../../hooks/useStatistics';
import { Header } from '../../components/Header';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/Toast';
import { STATS_RENDER_DATA } from '../../utils/constant';
import {
    StatisticsChart,
    StatisticsFilter,
    StatisticsDateSelector,
    StatisticsRevenue,
    StatisticsCards,
} from '../../components/statistics';
import TerrainFilterModal from '../../components/reservation/TerrainFilterModal';
import { useTerrainCache } from '../../hooks/useTerrainCache';
import { useAppSelector } from '../../store/hooks/hooks';
import { selectIsAuthenticated } from '../../store/slices/userSlice';
import AuthRequiredScreen from '../../components/AuthRequiredScreen';

const StatisticsScreen: React.FC = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const { toastConfig, visible: toastVisible, hideToast, showError, showSuccess } = useToast();
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();

    // Si non authentifié, afficher l'écran de connexion requise
    if (!isAuthenticated) {
        return (
            <AuthRequiredScreen
                title="Connexion requise"
                message="Vous devez vous connecter pour accéder aux statistiques."
                iconName="stats-chart-outline"
            />
        );
    }

    // Récupérer le terrainId depuis les paramètres de route
    const initialTerrainId = (route.params as any)?.terrainId as number | undefined;

    // Détecter si on est dans un contexte de navigation stack (avec bouton retour)
    // Si on a des paramètres de route, c'est qu'on vient d'une navigation stack
    const isInStackNavigation = route.params !== undefined;
    const shouldShowBackButton = isInStackNavigation;

    const {
        // États
        selectedPeriod,
        selectedDate,
        showDatePicker,
        refreshing,
        loadingChart,
        loadingFilter,
        selectedTerrainId,

        // Calculs
        statistics,
        chartWidth,
        chartHeight,
        chartData,
        // Fonctions
        handlePeriodSelect,
        handleDateChange,
        handleCalendarPress,
        onRefresh,
        handleTerrainFilterChange,
    } = useStatistics({ showError, showSuccess });

    // Hook pour récupérer les terrains et obtenir le nom du terrain sélectionné
    const { terrains } = useTerrainCache();

    // Récupérer le nom du terrain sélectionné
    const selectedTerrainName = useMemo(() => {
        if (!selectedTerrainId) return null;
        const terrain = terrains.find(t => t.terrainId === selectedTerrainId);
        return terrain?.terrainNom || null;
    }, [selectedTerrainId, terrains]);

    // Initialiser le filtre avec le terrainId reçu en paramètre
    useEffect(() => {
        if (initialTerrainId && !selectedTerrainId) {
            console.log("🚀 ~ StatisticsScreen ~ initialTerrainId:", initialTerrainId);
            handleTerrainFilterChange(initialTerrainId);
        }
    }, [initialTerrainId, selectedTerrainId, handleTerrainFilterChange]);

    // Gestion du filtre par terrain
    const handleFilterPress = () => {
        setIsFilterModalVisible(true);
    };

    const handleTerrainSelect = (terrainId: number | null) => {
        console.log("🚀 ~ StatisticsScreen ~ handleTerrainSelect ~ terrainId:", terrainId);
        handleTerrainFilterChange(terrainId);
    };

    // Fonction pour réinitialiser le filtre de terrain
    const handleResetFilter = () => {
        handleTerrainFilterChange(null);
    };

    // Fonction pour gérer le retour
    const handleBackPress = () => {
        navigation.goBack();
    };

    const renderItem = ({ item }: { item: { id: string; type: string } }) => {
        switch (item.type) {
            case 'graph':
                return (
                    <StatisticsChart
                        chartData={chartData}
                        chartWidth={chartWidth}
                        chartHeight={chartHeight}
                        loadingChart={loadingChart}
                    />
                );

            case 'filter':
                return (
                    <StatisticsFilter
                        selectedPeriod={selectedPeriod}
                        onPeriodSelect={handlePeriodSelect}
                        onCalendarPress={handleCalendarPress}
                        loadingFilter={loadingFilter}
                    />
                );

            case 'customDate':
                return (
                    <StatisticsDateSelector
                        selectedPeriod={selectedPeriod}
                        selectedDate={selectedDate}
                        onCalendarPress={handleCalendarPress}
                        loadingFilter={loadingFilter}
                    />
                );

            case 'revenue':
                return (
                    <StatisticsRevenue
                        revenue={statistics.revenue}
                        loadingFilter={loadingFilter}
                    />
                );

            case 'stats1':
                return (
                    <StatisticsCards
                        statistics={statistics}
                        loadingFilter={loadingFilter}
                    />
                );

            case 'bottom':
                return <View style={{ height: 50 }} />;

            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <Header
                title="Statistiques"
                showFilter={true}
                onFilterPress={handleFilterPress}
                filterActive={selectedTerrainId !== null}
                selectedTerrainName={selectedTerrainName}
                onResetFilter={handleResetFilter}
                showBackButton={shouldShowBackButton}
                onBackPress={handleBackPress}
            />

            <FlatList
                data={STATS_RENDER_DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            />

            {/* DateTimePicker */}
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={'spinner'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(2020, 0, 1)}
                    locale="fr-FR"
                />
            )}

            {/* Bottom sheet de filtrage par terrain */}
            <TerrainFilterModal
                visible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                onTerrainSelect={handleTerrainSelect}
                selectedTerrainId={selectedTerrainId}
            />

            {/* Toast pour les notifications */}
            {/* <Toast
                visible={toastVisible}
                message={toastConfig?.message || ''}
                type={toastConfig?.type}
                duration={toastConfig?.duration}
                onHide={hideToast}
            /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});

export default StatisticsScreen; 