import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { ReservationsMessages } from '../../components/reservation/ReservationsMessages';
import { ReservationsTabContent } from '../../components/reservation/ReservationsTabContent';
import TerrainFilterModal from '../../components/reservation/TerrainFilterModal';
import { useReservationsInfinite } from '../../hooks/useReservationsInfinite';
import { useReservationsTabs } from '../../hooks/useReservationsTabs';
import { useTerrainCache } from '../../hooks/useTerrainCache';
import { COLORS } from '../../theme/colors';
import { TAB_CONFIG } from '../../utils/constant';

const initialLayout = { width: Dimensions.get('window').width };

const ReservationsScreen: React.FC = () => {
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const route = useRoute();
    const navigation = useNavigation();

    // Récupérer le terrainId depuis les paramètres de route
    const initialTerrainId = (route.params as any)?.terrainId as number | undefined;

    // Détecter si on est dans un contexte de navigation stack (avec bouton retour)
    // Si on a des paramètres de route, c'est qu'on vient d'une navigation stack
    const isInStackNavigation = route.params !== undefined;
    const shouldShowBackButton = isInStackNavigation;

    const {
        reservationsByStatus,
        loadMoreForStatus,
        refreshForStatus,
        selectedTerrainId,
        getFilteredReservations,
        successMessage,
        errorMessage,
        clearSuccessMessage,
        confirmingMatchId,
        cancellingMatchId,
        index,
        searchQuery,
        setIndex,
        setSearchQuery,
        handleConfirm,
        handleCancel,
        handleRetry,
        handleTerrainFilterChange
    } = useReservationsInfinite();

    // Initialiser le filtre avec le terrainId reçu en paramètre
    useEffect(() => {
        if (initialTerrainId && !selectedTerrainId) {
            console.log("🚀 ~ ReservationsScreen ~ initialTerrainId:", initialTerrainId);
            handleTerrainFilterChange(initialTerrainId);
        }
    }, [initialTerrainId, selectedTerrainId, handleTerrainFilterChange]);

    // Hook pour récupérer les terrains et obtenir le nom du terrain sélectionné
    const { terrains } = useTerrainCache();

    // Récupérer le nom du terrain sélectionné
    const selectedTerrainName = useMemo(() => {
        if (!selectedTerrainId) return null;
        const terrain = terrains.find(t => t.terrainId === selectedTerrainId);
        return terrain?.terrainNom || null;
    }, [selectedTerrainId, terrains]);

    console.log("🚀 ~ reservationsByStatusvvvvvvvvvvvvv:", reservationsByStatus)

    // Hook personnalisé pour la gestion des onglets
    const { handleLoadMore, handleRefresh } = useReservationsTabs(
        loadMoreForStatus,
        refreshForStatus
    );

    // Calcul des compteurs pour chaque onglet
    const getTabCounts = useMemo(() => {
        const pendingCount = reservationsByStatus['en_attente']?.reservations?.length || 0;
        const confirmedCount = reservationsByStatus['confirme']?.reservations?.length || 0;
        const cancelledCount = reservationsByStatus['annule']?.reservations?.length || 0;

        return {
            pending: pendingCount,
            confirmed: confirmedCount,
            cancelled: cancelledCount
        };
    }, [reservationsByStatus]);

    // Configuration des onglets avec données dynamiques et compteurs
    const routes = useMemo(() => TAB_CONFIG.map(tab => ({
        ...tab,
        title: `${tab.title} \n (${getTabCounts[tab.key as keyof typeof getTabCounts]})`
    })), [getTabCounts]);

    // Rendu personnalisé du TabBar avec compteurs
    const renderTabBar = useCallback((props: any) => (
        <TabBar
            {...props}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            activeColor={COLORS.veryDarkGray}
            inactiveColor={COLORS.gray[600]}
            renderLabel={({ route, focused }: { route: any; focused: boolean }) => (
                <View style={styles.tabLabelContainer}>
                    <Text style={[
                        styles.tabLabel,
                        focused ? styles.tabLabelActive : styles.tabLabelInactive
                    ]}>
                        {route.title}
                    </Text>
                </View>
            )}
        />
    ), []);

    // Rendu des scènes avec composants séparés
    const renderScene = useMemo(() => SceneMap({
        pending: () => (
            <ReservationsTabContent
                status="en_attente"
                statusData={reservationsByStatus['en_attente']}
                filteredReservations={getFilteredReservations('en_attente')}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onLoadMore={() => handleLoadMore('pending')}
                onRefresh={() => handleRefresh('pending')}
                confirmingMatchId={confirmingMatchId}
                cancellingMatchId={cancellingMatchId}
                showSearch={false}
                emptyMessage="Aucune réservation en attente."
            />
        ),
        confirmed: () => (
            <ReservationsTabContent
                status="confirme"
                statusData={reservationsByStatus['confirme']}
                filteredReservations={getFilteredReservations('confirme')}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onLoadMore={() => handleLoadMore('confirmed')}
                onRefresh={() => handleRefresh('confirmed')}
                confirmingMatchId={confirmingMatchId}
                cancellingMatchId={cancellingMatchId}
                showSearch={false}
                emptyMessage="Aucune réservation confirmée."
            />
        ),
        cancelled: () => (
            <ReservationsTabContent
                status="annule"
                statusData={reservationsByStatus['annule']}
                filteredReservations={getFilteredReservations('annule')}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onLoadMore={() => handleLoadMore('cancelled')}
                onRefresh={() => handleRefresh('cancelled')}
                confirmingMatchId={confirmingMatchId}
                cancellingMatchId={cancellingMatchId}
                showSearch={false}
                emptyMessage="Aucune réservation annulée."
            />
        ),
    }), [
        reservationsByStatus,
        getFilteredReservations,
        searchQuery,
        setSearchQuery,
        handleConfirm,
        handleCancel,
        handleLoadMore,
        handleRefresh,
        confirmingMatchId,
        cancellingMatchId
    ]);

    // Gestion du filtre par terrain
    const handleFilterPress = () => {
        setIsFilterModalVisible(true);
    };

    const handleTerrainSelect = (terrainId: number | null) => {
        console.log("🚀 ~ ReservationsScreen ~ handleTerrainSelect ~ terrainId:", terrainId);
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

    return (
        <View style={styles.container}>
            <Header
                title="Réservations"
                showFilter={true}
                onFilterPress={handleFilterPress}
                filterActive={selectedTerrainId !== null}
                selectedTerrainName={selectedTerrainName}
                onResetFilter={handleResetFilter}
                showBackButton={shouldShowBackButton}
                onBackPress={handleBackPress}
            />

            {/* Affichage des messages de succès et d'erreur */}
            <ReservationsMessages
                successMessage={successMessage}
                errorMessage={errorMessage}
                onClearSuccess={clearSuccessMessage}
                onRetry={handleRetry}
            />

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={renderTabBar}
            />

            {/* Bottom sheet de filtrage par terrain */}
            <TerrainFilterModal
                visible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                onTerrainSelect={handleTerrainSelect}
                selectedTerrainId={selectedTerrainId}
            />

            <View style={styles.bottomSpacer} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    tabIndicator: {
        backgroundColor: COLORS.primary,
    },
    tabBar: {
        backgroundColor: COLORS.gray[200],
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 8,
    },
    tabLabelContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    tabLabelActive: {
        color: COLORS.veryDarkGray,
    },
    tabLabelInactive: {
        color: COLORS.gray[600],
    },
    bottomSpacer: {
        height: 70,
    },
});

export default ReservationsScreen; 