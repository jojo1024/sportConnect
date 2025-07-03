import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { PRIMARY_COLOR } from '../../utils/constant';
import { useReservationsInfinite } from '../../hooks/useReservationsInfinite';
import { ReservationsHeader } from '../../components/reservation/ReservationsHeader';
import { ReservationsTabContent } from '../../components/reservation/ReservationsTabContent';
import { ReservationsMessages } from '../../components/reservation/ReservationsMessages';
import { TAB_CONFIG, RESERVATION_STATUSES } from './constants';
import { useReservationsTabs } from '../../hooks/useReservationsTabs';

const initialLayout = { width: Dimensions.get('window').width };

const ReservationsScreen: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const {
        reservationsByStatus,
        loadMoreForStatus,
        refreshForStatus,
        confirmReservation,
        cancelReservation,
        getFilteredReservations,
        setFilters,
        successMessage,
        errorMessage,
        clearSuccessMessage,
        clearErrorMessage,
        confirmingMatchId,
        cancellingMatchId
    } = useReservationsInfinite();

    // Hook personnalisé pour la gestion des onglets
    const { handleLoadMore, handleRefresh } = useReservationsTabs(
        loadMoreForStatus,
        refreshForStatus
    );

    // Mettre à jour les filtres quand la recherche change
    React.useEffect(() => {
        setFilters({ searchQuery });
    }, [searchQuery, setFilters]);

    const handleConfirm = useCallback((matchId: number, gerantId: number) => {
        confirmReservation(matchId, gerantId);
    }, [confirmReservation]);

    const handleCancel = useCallback((matchId: number, raison?: string) => {
        cancelReservation(matchId, raison);
    }, [cancelReservation]);

    const handleRetry = useCallback(() => {
        clearErrorMessage();
        // Recharger toutes les réservations
        Object.values(RESERVATION_STATUSES).forEach(status => {
            refreshForStatus(status);
        });
    }, [clearErrorMessage, refreshForStatus]);

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
                        activeColor="#222"
                        inactiveColor="#888"
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
        backgroundColor: '#f8f9fa',
    },
    tabIndicator: {
        backgroundColor: PRIMARY_COLOR,
    },
    tabBar: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 8,
    },

    bottomSpacer: {
        height: 70,
    },
});

export default ReservationsScreen; 