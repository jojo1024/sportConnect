import { useState, useEffect, useCallback, useRef } from 'react';
import { matchService, Match, PaginationInfo } from '../services/matchService';
import { useCustomAlert } from './useCustomAlert';

export interface ReservationFilters {
    searchQuery?: string;
}

export interface ReservationsByStatus {
    [key: string]: {
        reservations: Match[];
        pagination: PaginationInfo;
        loading: boolean;
        refreshing: boolean;
        hasMore: boolean;
    };
}

export const useReservationsInfinite = () => {
    const [reservationsByStatus, setReservationsByStatus] = useState<ReservationsByStatus>({
        en_attente: { reservations: [], pagination: {} as PaginationInfo, loading: false, refreshing: false, hasMore: true },
        confirme: { reservations: [], pagination: {} as PaginationInfo, loading: false, refreshing: false, hasMore: true },
        annule: { reservations: [], pagination: {} as PaginationInfo, loading: false, refreshing: false, hasMore: true }
    });
    const [filters, setFilters] = useState<ReservationFilters>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [confirmingMatchId, setConfirmingMatchId] = useState<number | null>(null);
    const [cancellingMatchId, setCancellingMatchId] = useState<number | null>(null);
    const { showError } = useCustomAlert();
    const loadingRef = useRef(false);

    // Charger les réservations pour un statut spécifique
    const loadReservationsForStatus = useCallback(async (status: string, page: number = 1, isRefresh: boolean = false) => {
        if (loadingRef.current) return;
        
        try {
            loadingRef.current = true;
            
            setReservationsByStatus(prev => ({
                ...prev,
                [status]: {
                    ...prev[status],
                    loading: page === 1 && !isRefresh,
                    refreshing: isRefresh
                }
            }));

            const response = await matchService.getGerantReservations(status, page, 10);
            
            setReservationsByStatus(prev => ({
                ...prev,
                [status]: {
                    reservations: page === 1 || isRefresh 
                        ? response.reservations 
                        : [...prev[status].reservations, ...response.reservations],
                    pagination: response.pagination,
                    loading: false,
                    refreshing: false,
                    hasMore: response.pagination.hasNextPage
                }
            }));
        } catch (error: any) {
            console.error(`Erreur lors du chargement des réservations ${status}:`, error);
            const errorMsg = error?.response?.data?.message || `Impossible de charger les réservations ${status}`;
            setErrorMessage(errorMsg);
            
            setReservationsByStatus(prev => ({
                ...prev,
                [status]: {
                    ...prev[status],
                    loading: false,
                    refreshing: false
                }
            }));
        } finally {
            loadingRef.current = false;
        }
    }, [setErrorMessage]);

    // Charger la page suivante pour un statut
    const loadMoreForStatus = useCallback((status: string) => {
        const currentStatus = reservationsByStatus[status];
        if (currentStatus.loading || !currentStatus.hasMore) return;
        
        const nextPage = currentStatus.pagination.page + 1;
        loadReservationsForStatus(status, nextPage);
    }, [reservationsByStatus, loadReservationsForStatus]);

    // Rafraîchir les données pour un statut
    const refreshForStatus = useCallback((status: string) => {
        loadReservationsForStatus(status, 1, true);
    }, [loadReservationsForStatus]);

    // Confirmer une réservation
    const confirmReservation = useCallback(async (matchId: number, gerantId: number) => {
        try {
            setConfirmingMatchId(matchId);
            await matchService.confirmMatch(matchId, gerantId);
            setSuccessMessage('Réservation confirmée avec succès');
            
            // Recharger les réservations en attente et confirmées
            await Promise.all([
                refreshForStatus('en_attente'),
                refreshForStatus('confirme')
            ]);
        } catch (error: any) {
            console.error('Erreur lors de la confirmation:', error);
            const errorMsg = error?.response?.data?.message || 'Impossible de confirmer la réservation';
            setErrorMessage(errorMsg);
        } finally {
            setConfirmingMatchId(null);
        }
    }, [refreshForStatus, setSuccessMessage, setErrorMessage]);

    // Annuler une réservation
    const cancelReservation = useCallback(async (matchId: number, raison?: string) => {
        try {
            setCancellingMatchId(matchId);
            await matchService.cancelMatch(matchId, raison);
            setSuccessMessage('Réservation annulée avec succès');
            
            // Recharger toutes les réservations
            await Promise.all([
                refreshForStatus('en_attente'),
                refreshForStatus('confirme'),
                refreshForStatus('annule')
            ]);
        } catch (error: any) {
            console.error('Erreur lors de l\'annulation:', error);
            const errorMsg = error?.response?.data?.message || 'Impossible d\'annuler la réservation';
            setErrorMessage(errorMsg);
        } finally {
            setCancellingMatchId(null);
        }
    }, [refreshForStatus, setSuccessMessage, setErrorMessage]);

    // Filtrer les réservations par recherche
    const getFilteredReservations = useCallback((status: string) => {
        const reservations = reservationsByStatus[status]?.reservations || [];
        
        if (!filters.searchQuery) {
            return reservations;
        }

        const query = filters.searchQuery.toLowerCase();
        return reservations.filter(reservation => 
            reservation.terrainNom.toLowerCase().includes(query) ||
            reservation.capoNomUtilisateur.toLowerCase().includes(query)
        );
    }, [reservationsByStatus, filters.searchQuery]);

    // Handlers de nettoyage des messages
    const clearSuccessMessage = useCallback(() => setSuccessMessage(null), []);
    const clearErrorMessage = useCallback(() => setErrorMessage(null), []);

    // Charger les données initiales
    useEffect(() => {
        const loadInitialData = async () => {
            console.log("🚀 ~ loadInitialData ~ loadInitialData:")
            await Promise.all([
                loadReservationsForStatus('en_attente'),
                loadReservationsForStatus('confirme'),
                loadReservationsForStatus('annule')
            ]);
        };
        
        loadInitialData();
    }, [loadReservationsForStatus]);

    return {
        reservationsByStatus,
        filters,
        setFilters,
        successMessage,
        errorMessage,
        confirmingMatchId,
        cancellingMatchId,
        loadMoreForStatus,
        refreshForStatus,
        confirmReservation,
        cancelReservation,
        getFilteredReservations,
        clearSuccessMessage,
        clearErrorMessage,
    };
}; 