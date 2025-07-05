import { useState, useEffect, useCallback, useRef } from 'react';
import { matchService, Match, PaginationInfo } from '../services/matchService';
import { useCustomAlert } from './useCustomAlert';
import { RESERVATION_STATUSES } from '../utils/constant';

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

/**
 * Hook personnalisé pour gérer les réservations avec pagination infinie
 * Fournit une interface complète pour charger, gérer et filtrer les réservations
 * par statut (en attente, confirmées, annulées)
 * 
 * Fonctionnalités principales :
 * - Chargement paginé des réservations par statut
 * - Confirmation et annulation de réservations
 * - Filtrage par recherche
 * - Gestion des états de chargement et d'erreur
 * - Support de l'infinite scroll
 * 
 * @returns {Object} Objet contenant l'état et les méthodes de gestion des réservations
 */
export const useReservationsInfinite = () => {

    const [index, setIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
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

    /**
     * Charge les réservations pour un statut spécifique avec pagination
     * @param status - Statut des réservations ('en_attente', 'confirme', 'annule')
     * @param page - Numéro de la page à charger
     * @param isRefresh - Si true, remplace les données existantes
     */
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

    /**
     * Charge la page suivante pour un statut donné (infinite scroll)
     * @param status - Statut des réservations
     */
    const loadMoreForStatus = useCallback((status: string) => {
        const currentStatus = reservationsByStatus[status];
        if (currentStatus.loading || !currentStatus.hasMore) return;
        
        const nextPage = currentStatus.pagination.page + 1;
        loadReservationsForStatus(status, nextPage);
    }, [reservationsByStatus, loadReservationsForStatus]);

    /**
     * Rafraîchit les données pour un statut donné (pull-to-refresh)
     * @param status - Statut des réservations
     */
    const refreshForStatus = useCallback((status: string) => {
        loadReservationsForStatus(status, 1, true);
    }, [loadReservationsForStatus]);

    /**
     * Confirme une réservation et recharge les données
     * @param matchId - ID du match à confirmer
     * @param gerantId - ID du gérant qui confirme
     */
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

    /**
     * Annule une réservation et recharge les données
     * @param matchId - ID du match à annuler
     * @param raison - Raison de l'annulation (optionnel)
     */
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

    /**
     * Filtre les réservations par recherche textuelle
     * @param status - Statut des réservations à filtrer
     * @returns {Match[]} Liste des réservations filtrées
     */
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

    /**
     * Efface le message de succès
     */
    const clearSuccessMessage = useCallback(() => setSuccessMessage(null), []);
    
    /**
     * Efface le message d'erreur
     */
    const clearErrorMessage = useCallback(() => setErrorMessage(null), []);

    /**
     * Charge les données initiales au montage du composant
     */
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

        // Mettre à jour les filtres quand la recherche change
        useEffect(() => {
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

    return {
        reservationsByStatus,
        index,
        searchQuery,
        setIndex,
        setSearchQuery,
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
        handleConfirm,
        handleCancel,
        handleRetry
    };
}; 