import { useCallback } from 'react';

type LoadMoreFunction = (status: string) => void;
type RefreshFunction = (status: string) => void;

interface UseReservationsTabsProps {
    loadMoreForStatus: LoadMoreFunction;
    refreshForStatus: RefreshFunction;
}

interface UseReservationsTabsReturn {
    handleLoadMore: (tabType: 'pending' | 'confirmed' | 'cancelled') => void;
    handleRefresh: (tabType: 'pending' | 'confirmed' | 'cancelled') => void;
}

export const useReservationsTabs = (
    loadMoreForStatus: LoadMoreFunction,
    refreshForStatus: RefreshFunction
): UseReservationsTabsReturn => {
    
    // Mapping des types d'onglets vers les statuts de réservation
    const tabToStatusMap = {
        pending: 'en_attente',
        confirmed: 'confirme',
        cancelled: 'annule'
    } as const;

    const handleLoadMore = useCallback((tabType: 'pending' | 'confirmed' | 'cancelled') => {
        const status = tabToStatusMap[tabType];
        loadMoreForStatus(status);
    }, [loadMoreForStatus]);

    const handleRefresh = useCallback((tabType: 'pending' | 'confirmed' | 'cancelled') => {
        const status = tabToStatusMap[tabType];
        refreshForStatus(status);
    }, [refreshForStatus]);

    return {
        handleLoadMore,
        handleRefresh
    };
}; 