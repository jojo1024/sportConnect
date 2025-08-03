import { useState, useEffect, useMemo, useCallback } from 'react';
import { useWindowDimensions, Platform } from 'react-native';
import { matchService, Match, PaginationInfo } from '../services/matchService';
import { useToast } from './useToast';
import { calculateRevenue, formatCurrency, formatShortCurrency, getWeekDates } from '../utils/functions';
import { getPopularTime, PERIODS } from '../utils/constant';

export interface ReservationFilters {
    searchQuery?: string;
    period?: string;
    dateDebut?: string;
    dateFin?: string;
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

export interface StatisticsData {
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
}

/**
 * Hook personnalisé pour gérer les statistiques avec toutes les fonctionnalités
 * Fournit une interface complète pour charger, gérer et filtrer les statistiques
 * 
 * Fonctionnalités principales :
 * - Chargement des réservations par statut avec filtrage par date
 * - Gestion du graphique hebdomadaire
 * - Calcul des statistiques en temps réel
 * - Gestion des filtres de période
 * - Gestion des états de chargement et d'erreur
 * - Support du rafraîchissement
 * 
 * @returns {Object} Objet contenant l'état et les méthodes de gestion des statistiques
 */
export const useStatistics = (toastFunctions?: { showError: (message: string, duration?: number) => void; showSuccess: (message: string, duration?: number) => void }) => {
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const { showError: defaultShowError, showSuccess: defaultShowSuccess } = useToast();
    
    // Utilise les fonctions de toast passées en paramètre ou les fonctions par défaut
    const showError = toastFunctions?.showError || defaultShowError;
    const showSuccess = toastFunctions?.showSuccess || defaultShowSuccess;

    // États pour les réservations
    const [reservationsByStatus, setReservationsByStatus] = useState<ReservationsByStatus>({
        en_attente: { reservations: [], pagination: {} as PaginationInfo, loading: false, refreshing: false, hasMore: true },
        confirme: { reservations: [], pagination: {} as PaginationInfo, loading: false, refreshing: false, hasMore: true },
        annule: { reservations: [], pagination: {} as PaginationInfo, loading: false, refreshing: false, hasMore: true }
    });

    // États pour les filtres et la période
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isSpecificDateSelected, setIsSpecificDateSelected] = useState(false);
    const [selectedTerrainId, setSelectedTerrainId] = useState<number | null>(null);

    // États pour le graphique
    const [weeklyChartData, setWeeklyChartData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
    const [loadingChart, setLoadingChart] = useState(false);

    // États pour le rafraîchissement et les filtres
    const [refreshing, setRefreshing] = useState(false);
    const [loadingFilter, setLoadingFilter] = useState(false);

    // États pour le DateTimePicker
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Calcul responsive des dimensions du graphique
    const cardPadding = 20;
    const cardMargin = 16;
    const chartWidth = screenWidth - (cardMargin * 2) - (cardPadding * 2);
    const chartHeight = Math.max(200, Math.min(300, screenHeight * 0.25));

    // Fonction pour calculer les dates selon la période
    const getDateRangeForPeriod = useCallback((
        period: string,
        customDate?: Date
    ): { dateDebut?: string; dateFin?: string } => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 00:00:00
    
        switch (period) {
            case 'today': {
                const dateStr = today.toISOString().split('T')[0];
                return { dateDebut: dateStr, dateFin: dateStr };
            }
    
            case 'week': {
                // Début de la semaine (lundi)
                const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // dimanche = 0 → 7
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
                return {
                    dateDebut: startOfWeek.toISOString().split('T')[0],
                    dateFin: today.toISOString().split('T')[0],
                };
            }
    
            case 'month': {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                return {
                    dateDebut: startOfMonth.toISOString().split('T')[0],
                    dateFin: today.toISOString().split('T')[0],
                };
            }
    
            case '3months': {
                const startOf3Months = new Date(today.getFullYear(), today.getMonth() - 3, 1);
                return {
                    dateDebut: startOf3Months.toISOString().split('T')[0],
                    dateFin: today.toISOString().split('T')[0],
                };
            }
    
            case '6months': {
                const startOf6Months = new Date(today.getFullYear(), today.getMonth() - 6, 1);
                return {
                    dateDebut: startOf6Months.toISOString().split('T')[0],
                    dateFin: today.toISOString().split('T')[0],
                };
            }
    
            case 'year': {
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                return {
                    dateDebut: startOfYear.toISOString().split('T')[0],
                    dateFin: today.toISOString().split('T')[0],
                };
            }
    
            case 'custom': {
                if (customDate) {
                    const customDateStr = customDate.toISOString().split('T')[0];
                    return {
                        dateDebut: customDateStr,
                        dateFin: customDateStr,
                    };
                }
                return {};
            }
    
            case 'all':
            default:
                return {};
        }
    }, []);
    
    

    /**
     * Charge les réservations pour un statut spécifique avec pagination et filtrage par date
     */
    const loadReservationsForStatus = useCallback(async (status: string, page: number = 1, isRefresh: boolean = false, dateDebut?: string, dateFin?: string, terrainId?: number | null) => {
        try {
            console.log(`🔄 Chargement des réservations ${status} - page ${page} - refresh: ${isRefresh} - période: ${dateDebut} à ${dateFin} - terrain: ${terrainId}`);
            
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

            const response = await matchService.getGerantReservationsByDate(status, page, 50, dateDebut, dateFin, currentTerrainId);
            
            console.log(`✅ Réservations ${status} chargées:`, response.reservations.length);
            
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
            console.error(`❌ Erreur lors du chargement des réservations ${status}:`, error);
            const errorMsg = error?.response?.data?.message || `Impossible de charger les réservations ${status}`;
            
            setReservationsByStatus(prev => ({
                ...prev,
                [status]: {
                    ...prev[status],
                    loading: false,
                    refreshing: false
                }
            }));
            
            throw error;
        }
    }, [selectedTerrainId]);

    /**
     * Charge les données du graphique hebdomadaire
     */
    const loadWeeklyChartData = useCallback(async (terrainId?: number | null) => {
        try {
            setLoadingChart(true);
            const { dateDebut, dateFin } = getWeekDates();
            console.log('🔄 Chargement des données hebdomadaires:', { dateDebut, dateFin, terrainId });

            // Utiliser le terrainId passé en paramètre ou la valeur actuelle
            const currentTerrainId = terrainId !== undefined ? terrainId : selectedTerrainId;

            const response = await matchService.getGerantWeeklyChart(dateDebut, dateFin, currentTerrainId);
            console.log('✅ Données hebdomadaires reçues:', response.dailyRevenue);

            setWeeklyChartData(response.dailyRevenue);
            showSuccess('Graphique mis à jour', 1500);
        } catch (error: any) {
            console.error('❌ Erreur lors du chargement des données hebdomadaires:', error);
            const errorMsg = error?.response?.data?.message || 'Erreur lors du chargement du graphique';
            showError(errorMsg, 3000);
            throw error;
        } finally {
            setLoadingChart(false);
        }
    }, [selectedTerrainId, showSuccess, showError]);

    /**
     * Charge les données selon le filtre actuel
     */
    const loadDataWithFilter = useCallback(async (period: string, customDate?: Date, terrainId?: number | null): Promise<{ success: boolean; error?: string }> => {
        console.log('🔄 Chargement des données avec filtre:', period, customDate, terrainId);
        
        const { dateDebut, dateFin } = getDateRangeForPeriod(period, customDate);
        
        // Utiliser le terrainId passé en paramètre ou la valeur actuelle
        const currentTerrainId = terrainId !== undefined ? terrainId : selectedTerrainId;
        
        const promises = [
            loadReservationsForStatus('en_attente', 1, true, dateDebut, dateFin, currentTerrainId),
            loadReservationsForStatus('confirme', 1, true, dateDebut, dateFin, currentTerrainId),
            loadReservationsForStatus('annule', 1, true, dateDebut, dateFin, currentTerrainId)
        ];
        
        try {
            const results = await Promise.allSettled(promises);
            
            const hasErrors = results.some(result => result.status === 'rejected');
            
            if (hasErrors) {
                const errorResult = results.find(result => result.status === 'rejected');
                const error = errorResult?.reason;
                const errorMsg = error?.response?.data?.message || 'Erreur lors du chargement des données';
                
                console.error('Erreur générale lors du chargement des données avec filtre:', error);
                return { success: false, error: errorMsg };
            }
            
            console.log('✅ Chargement des données avec filtre terminé');
            return { success: true };
        } catch (error: any) {
            console.error('Erreur générale lors du chargement des données avec filtre:', error);
            const errorMsg = error?.response?.data?.message || 'Erreur lors du chargement des données';
            return { success: false, error: errorMsg };
        }
    }, [loadReservationsForStatus, getDateRangeForPeriod, selectedTerrainId]);

    /**
     * Gère la sélection d'une période
     */
    const handlePeriodSelect = useCallback(async (periodKey: string) => {
        setSelectedPeriod(periodKey);
        setLoadingFilter(true);
        try {
            if (periodKey !== 'custom') {
                setIsSpecificDateSelected(false);
                const result = await loadDataWithFilter(periodKey);

                if (result.success) {
                    const periodLabel = PERIODS.find(p => p.key === periodKey)?.label || periodKey;
                    showSuccess(`Période changée : ${periodLabel}`, 2000);
                } else {
                    showError(result.error || 'Erreur lors du changement de période', 3000);
                }
            }
        } catch (error: any) {
            console.error('❌ Erreur lors du changement de période:', error);
            const errorMsg = error?.response?.data?.message || 'Erreur lors du changement de période';
            showError(errorMsg, 3000);
        } finally {
            setLoadingFilter(false);
        }
    }, [loadDataWithFilter, showSuccess, showError]);

    /**
     * Gère le changement de date
     */
    const handleDateChange = useCallback(async (event: any, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
            setIsSpecificDateSelected(true);
            setSelectedPeriod('custom');
            setLoadingFilter(true);
            console.log('Date spécifique sélectionnée:', date.toLocaleDateString('fr-FR'));

            try {
                const result = await loadDataWithFilter('custom', date);

                if (result.success) {
                    const formattedDate = date.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    showSuccess(`Date sélectionnée : ${formattedDate}`, 2000);
                } else {
                    showError(result.error || 'Erreur lors du chargement de la date', 3000);
                }
            } catch (error: any) {
                console.error('❌ Erreur lors du chargement de la date spécifique:', error);
                const errorMsg = error?.response?.data?.message || 'Erreur lors du chargement de la date';
                showError(errorMsg, 3000);
            } finally {
                setLoadingFilter(false);
            }
        }
    }, [loadDataWithFilter, showSuccess, showError]);

    /**
     * Gère le changement de terrain sélectionné
     */
    const handleTerrainFilterChange = useCallback(async (terrainId: number | null) => {
        console.log("🚀 ~ handleTerrainFilterChange ~ terrainId:", terrainId);
        
        setSelectedTerrainId(terrainId);
        setLoadingFilter(true);
        
        try {
            // Vider les réservations existantes
            setReservationsByStatus(prev => ({
                en_attente: { ...prev.en_attente, reservations: [], hasMore: true },
                confirme: { ...prev.confirme, reservations: [], hasMore: true },
                annule: { ...prev.annule, reservations: [], hasMore: true }
            }));
            
            const result = await loadDataWithFilter(selectedPeriod, selectedPeriod === 'custom' ? selectedDate : undefined, terrainId);
            
            if (result.success) {
                const terrainLabel = terrainId ? `terrain ${terrainId}` : 'tous les terrains';
                showSuccess(`Filtre appliqué : ${terrainLabel}`, 2000);
            } else {
                showError(result.error || 'Erreur lors du changement de filtre', 3000);
            }
        } catch (error: any) {
            console.error('❌ Erreur lors du changement de filtre terrain:', error);
            const errorMsg = error?.response?.data?.message || 'Erreur lors du changement de filtre';
            showError(errorMsg, 3000);
        } finally {
            setLoadingFilter(false);
        }
    }, [selectedPeriod, selectedDate, loadDataWithFilter, showSuccess, showError]);

    /**
     * Gère le rafraîchissement des données
     */
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            console.log('🔄 Rafraîchissement des statistiques...');

            const [dataResult, chartResult] = await Promise.allSettled([
                loadDataWithFilter(selectedPeriod, selectedPeriod === 'custom' ? selectedDate : undefined, selectedTerrainId),
                loadWeeklyChartData(selectedTerrainId)
            ]);

            const hasErrors = dataResult.status === 'rejected' || chartResult.status === 'rejected';

            if (hasErrors) {
                console.log('❌ Erreur lors du rafraîchissement');

                let errorMsg = 'Erreur lors du rafraîchissement';

                if (dataResult.status === 'rejected') {
                    const error = dataResult.reason;
                    errorMsg = error?.response?.data?.message || 'Erreur lors du chargement des données';
                } else if (chartResult.status === 'rejected') {
                    const error = chartResult.reason;
                    errorMsg = error?.response?.data?.message || 'Erreur lors du chargement du graphique';
                }

                showError(errorMsg, 3000);
            } else {
                console.log('✅ Statistiques rafraîchies');
                showSuccess('Données rafraîchies avec succès', 2000);
            }
        } catch (error: any) {
            console.error('❌ Erreur lors du rafraîchissement:', error);
            const errorMsg = error?.response?.data?.message || 'Erreur lors du rafraîchissement';
            showError(errorMsg, 3000);
        } finally {
            setRefreshing(false);
        }
    }, [selectedPeriod, selectedDate, selectedTerrainId, loadDataWithFilter, loadWeeklyChartData, showSuccess, showError]);

    /**
     * Gère l'ouverture du sélecteur de date
     */
    const handleCalendarPress = useCallback(() => {
        setShowDatePicker(true);
    }, []);

    // Calcul des statistiques basées sur les vraies données
    const statistics = useMemo((): StatisticsData => {
        const confirmedReservations = reservationsByStatus.confirme?.reservations || [];
        const pendingReservations = reservationsByStatus.en_attente?.reservations || [];
        const cancelledReservations = reservationsByStatus.annule?.reservations || [];

        const revenue = calculateRevenue(confirmedReservations);
        const totalReservations = confirmedReservations.length + pendingReservations.length + cancelledReservations.length;
        const totalPlayers = confirmedReservations.reduce((total, res) => total + res.nbreJoueursInscrits, 0);
        const averagePlayers = confirmedReservations.length > 0
            ? totalPlayers / confirmedReservations.length
            : 0;

        return {
            revenue: formatCurrency(revenue),
            matches: confirmedReservations.length,
            players: totalPlayers,
            bars: weeklyChartData,
            averagePlayers: Math.round(averagePlayers * 10) / 10,
            occupancyRate: confirmedReservations.length > 0 ? '85%' : '0%',
            popularTime: getPopularTime(confirmedReservations),
            reservations: totalReservations,
            reservationsConfirmed: confirmedReservations.length,
            reservationsPending: pendingReservations.length,
            reservationsCancelled: cancelledReservations.length
        };
    }, [reservationsByStatus, weeklyChartData]);

    // Charger les données du graphique au montage du composant
    useEffect(() => {
        loadWeeklyChartData();
    }, [loadWeeklyChartData]);

    // Charger les données initiales
    useEffect(() => {
        const loadInitialData = async () => {
            console.log('🔄 Chargement des données initiales...');
            await loadDataWithFilter('today');
        };
        
        loadInitialData();
    }, [loadDataWithFilter]);

    const chartData = {
        labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
        datasets: [
            {
                data: statistics.bars,
            },
        ],
    };

    return {
        // États
        selectedPeriod,
        selectedDate,
        isSpecificDateSelected,
        showDatePicker,
        refreshing,
        loadingChart,
        loadingFilter,
        weeklyChartData,
        reservationsByStatus,
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
        loadDataWithFilter,
        loadWeeklyChartData,
        handleTerrainFilterChange,
        
        // Setters
        setShowDatePicker,
    };
}; 