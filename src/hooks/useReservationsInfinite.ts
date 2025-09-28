import { useState, useEffect, useCallback, useRef } from 'react';
import { matchService, Match, PaginationInfo } from '../services/matchService';
import { useCustomAlert } from './useCustomAlert';
import { RESERVATION_STATUSES } from '../utils/constant';
import { useAppSelector } from '../store/hooks/hooks';
import { selectUser } from '../store/slices/userSlice';

export interface ReservationFilters {
    searchQuery?: string;
    terrainId?: number | null;
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
 * - Filtrage par recherche et par terrain
 * - Gestion des états de chargement et d'erreur
 * - Support de l'infinite scroll
 * - Cache pour éviter les rechargements inutiles
 * 
 * @returns {Object} Objet contenant l'état et les méthodes de gestion des réservations
 */
export const useReservationsInfinite = () => {
    const user = useAppSelector(selectUser);
    const [index, setIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTerrainId, setSelectedTerrainId] = useState<number | null>(null);
    console.log("🚀 ~ useReservationsInfinite ~ selectedTerrainId:", selectedTerrainId)
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
    
    // Cache pour éviter les rechargements inutiles
    const lastTerrainId = useRef<number | null>(null);
    const hasInitialDataLoaded = useRef(false);

    /**
     * Charge les réservations pour un statut spécifique avec pagination
     * @param status - Statut des réservations ('en_attente', 'confirme', 'annule')
     * @param page - Numéro de la page à charger
     * @param isRefresh - Si true, remplace les données existantes
     * @param terrainId - ID du terrain pour le filtrage (optionnel)
     */
    const loadReservationsForStatus = useCallback(async (status: string, page: number = 1, isRefresh: boolean = false, terrainId?: number | null) => {
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

            // Utiliser le terrainId passé en paramètre ou la valeur actuelle
            const currentTerrainId = terrainId !== undefined ? terrainId : selectedTerrainId;
            console.log("🚀 ~ loadReservationsForStatus ~ currentTerrainIdxxyy:", currentTerrainId, "terrainId param:", terrainId)

            const response = await matchService.getGerantReservations(user?.utilisateurId!,status, currentTerrainId || undefined, page, 20);
            
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
    }, [selectedTerrainId, setErrorMessage]);

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
     * Confirme une réservation et met à jour les listes localement
     * @param matchId - ID du match à confirmer
     * @param gerantId - ID du gérant qui confirme
     */
    const confirmReservation = useCallback(async (matchId: number, gerantId: number) => {
        try {
            setConfirmingMatchId(matchId);
            await matchService.confirmMatch(matchId, gerantId);
            setSuccessMessage('Réservation confirmée avec succès');
            
            // Mettre à jour les listes localement
            setReservationsByStatus(prev => {
                // Trouver la réservation dans la liste en attente
                const reservationToMove = prev.en_attente.reservations.find(r => r.matchId === matchId);
                
                if (reservationToMove) {
                    // Supprimer de la liste en attente
                    const updatedEnAttente = prev.en_attente.reservations.filter(r => r.matchId !== matchId);
                    
                    // Mettre à jour le statut et ajouter à la liste confirmée
                    const updatedReservation = {
                        ...reservationToMove,
                        matchStatus: 'confirme' as const
                    };
                    const updatedConfirme = [updatedReservation, ...prev.confirme.reservations];
                    
                    return {
                        ...prev,
                        en_attente: {
                            ...prev.en_attente,
                            reservations: updatedEnAttente
                        },
                        confirme: {
                            ...prev.confirme,
                            reservations: updatedConfirme
                        }
                    };
                }
                
                return prev;
            });
        } catch (error: any) {
            console.error('Erreur lors de la confirmation:', error);
            const errorMsg = error?.response?.data?.message || 'Impossible de confirmer la réservation';
            setErrorMessage(errorMsg);
        } finally {
            setConfirmingMatchId(null);
        }
    }, [setSuccessMessage, setErrorMessage]);

    /**
     * Annule une réservation et met à jour les listes localement
     * @param matchId - ID du match à annuler
     * @param raison - Raison de l'annulation (optionnel)
     */
    const cancelReservation = useCallback(async (matchId: number, raison?: string, gerantId?: number) => {
        try {
            setCancellingMatchId(matchId);
            await matchService.cancelMatch(matchId, raison, gerantId);
            setSuccessMessage('Réservation annulée avec succès');
            
            // Mettre à jour les listes localement
            setReservationsByStatus(prev => {
                // Chercher la réservation dans toutes les listes
                let reservationToMove = prev.en_attente.reservations.find(r => r.matchId === matchId);
                let sourceStatus = 'en_attente';
                
                if (!reservationToMove) {
                    reservationToMove = prev.confirme.reservations.find(r => r.matchId === matchId);
                    sourceStatus = 'confirme';
                }
                
                if (reservationToMove) {
                    // Supprimer de la liste source
                    const updatedSource = prev[sourceStatus].reservations.filter(r => r.matchId !== matchId);
                    
                    // Mettre à jour le statut et ajouter à la liste annulée
                    const updatedReservation = {
                        ...reservationToMove,
                        matchStatus: 'annule' as const
                    };
                    const updatedAnnule = [updatedReservation, ...prev.annule.reservations];
                    
                    return {
                        ...prev,
                        [sourceStatus]: {
                            ...prev[sourceStatus],
                            reservations: updatedSource
                        },
                        annule: {
                            ...prev.annule,
                            reservations: updatedAnnule
                        }
                    };
                }
                
                return prev;
            });
           
        } catch (error: any) {
            console.error('Erreur lors de l\'annulation:', error);
            const errorMsg = error?.response?.data?.message || 'Impossible d\'annuler la réservation';
            setErrorMessage(errorMsg);
        } finally {
            setCancellingMatchId(null);
        }
    }, [setSuccessMessage, setErrorMessage]);

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
     * Gère le changement de terrain sélectionné
     * @param terrainId - ID du terrain sélectionné (null pour tous les terrains)
     */
    const handleTerrainFilterChange = useCallback(async (terrainId: number | null) => {
        console.log("🚀 ~ handleTerrainFilterChange ~ terrainId:", terrainId);
        
        // Éviter les rechargements inutiles si le terrain n'a pas changé
        if (lastTerrainId.current === terrainId) {
            return;
        }
        
        // Mettre à jour l'état
        setSelectedTerrainId(terrainId);
        lastTerrainId.current = terrainId;
        // Vider les réservations existantes
        setReservationsByStatus(prev => ({
                en_attente: { ...prev.en_attente, reservations: [], hasMore: true },
                confirme: { ...prev.confirme, reservations: [], hasMore: true },
                annule: { ...prev.annule, reservations: [], hasMore: true }
            }));
            
            await loadReservationsForStatus('en_attente', 1, true, terrainId);
            await loadReservationsForStatus('confirme', 1, true, terrainId);
            await loadReservationsForStatus('annule', 1, true, terrainId);

    }, [loadReservationsForStatus]);

    /**
     * Charge les données initiales au montage du composant
     */
    useEffect(() => {
        const loadInitialData = async () => {
            // Éviter les rechargements inutiles
            if (hasInitialDataLoaded.current) {
                return;
            }
            
            console.log("🚀 ~ loadInitialData ~ loadInitialData:")
            await Promise.all([
                loadReservationsForStatus('en_attente'),
                loadReservationsForStatus('confirme'),
                loadReservationsForStatus('annule')
            ]);
            
            hasInitialDataLoaded.current = true;
        };
        
        loadInitialData();
    }, [loadReservationsForStatus]);

    // Mettre à jour les filtres quand la recherche change
    useEffect(() => {
        setFilters({ searchQuery, terrainId: selectedTerrainId });
    }, [searchQuery, selectedTerrainId]);

    const handleConfirm = useCallback((matchId: number, gerantId: number) => {
        confirmReservation(matchId, gerantId);
    }, [confirmReservation]);

    const handleCancel = useCallback((matchId: number, raison?: string, gerantId?: number) => {
        cancelReservation(matchId, raison, gerantId);
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
        selectedTerrainId,
        setIndex,
        setSearchQuery,
        setSelectedTerrainId,
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
        handleTerrainFilterChange,
        handleConfirm,
        handleCancel,
        handleRetry
    };
}; 