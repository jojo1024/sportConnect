import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import ReservationCard from './ReservationCard';
import LoadingFooter from '../LoadingFooter';
import { SearchInput } from './SearchInput';
import { EmptyStateCard } from './EmptyStateCard';
import { LoadingStateCard } from './LoadingStateCard';
import { ReservationsByStatus } from '../../hooks/useReservationsInfinite';
import { Match } from '../../services/matchService';

interface ReservationsTabContentProps {
    status: string;
    statusData: ReservationsByStatus[string];
    filteredReservations: Match[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onConfirm: (matchId: number, gerantId: number) => void;
    onCancel: (matchId: number, raison?: string) => void;
    onLoadMore: () => void;
    onRefresh: () => void;
    confirmingMatchId: number | null;
    cancellingMatchId: number | null;
    showSearch: boolean;
    emptyMessage: string;
}

export const ReservationsTabContent: React.FC<ReservationsTabContentProps> = ({
    statusData,
    filteredReservations,
    searchQuery,
    setSearchQuery,
    onConfirm,
    onCancel,
    onLoadMore,
    onRefresh,
    confirmingMatchId,
    cancellingMatchId,
    showSearch,
    emptyMessage
}) => {
    const isLoading = statusData?.loading && statusData.reservations.length === 0;
    const isRefreshing = statusData?.refreshing || false;

    if (isLoading) {
        return <LoadingStateCard />;
    }

    return (
        <View style={styles.tabContent}>
            {showSearch && (
                <SearchInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Rechercher par terrain ou capo..."
                />
            )}

            <FlatList
                data={filteredReservations}
                keyExtractor={item => item.matchId.toString()}
                renderItem={({ item }) => (
                    <ReservationCard
                        item={item}
                        onConfirm={onConfirm}
                        onCancel={onCancel}
                        confirmingMatchId={confirmingMatchId}
                        cancellingMatchId={cancellingMatchId}
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                    />
                }
                onEndReached={onLoadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponent={<LoadingFooter loading={statusData?.loading || false} />}
                ListEmptyComponent={
                    <EmptyStateCard message={emptyMessage} />
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    tabContent: {
        flex: 1,
    },
}); 