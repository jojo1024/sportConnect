import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useReservationsInfinite } from '../../hooks/useReservationsInfinite';
import { ReservationsHeader } from '../../components/reservation/ReservationsHeader';
import { ReservationsTabContent } from '../../components/reservation/ReservationsTabContent';
import { ReservationsMessages } from '../../components/reservation/ReservationsMessages';
import { COLORS } from '../../theme/colors';
import { TAB_CONFIG } from '../../utils/constant';
import { useReservationsTabs } from '../../hooks/useReservationsTabs';

const initialLayout = { width: Dimensions.get('window').width };

const ReservationsScreen: React.FC = () => {

    const {
        reservationsByStatus,
        loadMoreForStatus,
        refreshForStatus,

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
        handleRetry
    } = useReservationsInfinite();

    // Hook personnalisé pour la gestion des onglets
    const { handleLoadMore, handleRefresh } = useReservationsTabs(
        loadMoreForStatus,
        refreshForStatus
    );



    // Configuration des onglets avec données dynamiques
    const routes = useMemo(() => TAB_CONFIG, []);

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

    return (
        <View style={styles.container}>
            <ReservationsHeader title="Réservations" />

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
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={styles.tabIndicator}
                        style={styles.tabBar}
                        activeColor={COLORS.veryDarkGray}
                        inactiveColor={COLORS.gray[600]}
                    />
                )}
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

    bottomSpacer: {
        height: 70,
    },
});

export default ReservationsScreen; 