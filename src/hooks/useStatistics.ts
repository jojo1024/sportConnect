import { useState, useEffect, useCallback } from 'react';
import { statisticsService, StatisticsQuery, ManagerOverviewStats, PerformanceStats, RevenueStats, OccupationStats, ParticipantsStats, MatchesStats, TemporalStats, EngagementStats, TerrainComparisonStats, TrendStats } from '../services/statisticsService';

export const useStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // État pour les statistiques d'ensemble
  const [overviewStats, setOverviewStats] = useState<ManagerOverviewStats | null>(null);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [occupationStats, setOccupationStats] = useState<OccupationStats | null>(null);
  const [participantsStats, setParticipantsStats] = useState<ParticipantsStats | null>(null);
  const [matchesStats, setMatchesStats] = useState<MatchesStats | null>(null);
  const [temporalStats, setTemporalStats] = useState<TemporalStats | null>(null);
  const [engagementStats, setEngagementStats] = useState<EngagementStats | null>(null);
  const [comparisonStats, setComparisonStats] = useState<TerrainComparisonStats | null>(null);
  const [trendStats, setTrendStats] = useState<TrendStats | null>(null);

  // Fonction générique pour gérer les erreurs
  const handleError = useCallback((error: any) => {
    console.error('Erreur dans useStatistics:', error);
    setError(error?.response?.data?.message || error?.message || 'Une erreur est survenue');
    setLoading(false);
  }, []);

  // Fonction pour réinitialiser les erreurs
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Récupérer les statistiques d'ensemble
  const fetchOverviewStats = useCallback(async (query: StatisticsQuery = { period: 'month' }) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await statisticsService.getOverviewStats(query);
      setOverviewStats(stats);
      return stats;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Récupérer les statistiques de performance
  const fetchPerformanceStats = useCallback(async (query: StatisticsQuery = { period: 'month' }) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await statisticsService.getPerformanceStats(query);
      setPerformanceStats(stats);
      return stats;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Récupérer les statistiques de revenus
  const fetchRevenueStats = useCallback(async (query: StatisticsQuery = { period: 'month' }) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await statisticsService.getRevenueStats(query);
      setRevenueStats(stats);
      return stats;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Récupérer les statistiques d'occupation
  const fetchOccupationStats = useCallback(async (query: StatisticsQuery = { period: 'month' }) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await statisticsService.getOccupationStats(query);
      setOccupationStats(stats);
      return stats;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Récupérer les statistiques des participants
  const fetchParticipantsStats = useCallback(async (query: StatisticsQuery = { period: 'month' }) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await statisticsService.getParticipantsStats(query);
      setParticipantsStats(stats);
      return stats;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Récupérer les statistiques des matchs
  const fetchMatchesStats = useCallback(async (query: StatisticsQuery = { period: 'month' }) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await statisticsService.getMatchesStats(query);
      setMatchesStats(stats);
      return stats;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Récupérer les statistiques temporelles
  const fetchTemporalStats = useCallback(async (query: StatisticsQuery = { period: 'month' }) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await statisticsService.getTemporalStats(query);
      setTemporalStats(stats);
      return stats;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Récupérer les statistiques d'engagement
  const fetchEngagementStats = useCallback(async (query: StatisticsQuery = { period: 'month' }) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await statisticsService.getEngagementStats(query);
      setEngagementStats(stats);
      return stats;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Récupérer les statistiques comparatives
  const fetchComparisonStats = useCallback(async (query: StatisticsQuery = { period: 'month' }) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await statisticsService.getTerrainComparisonStats(query);
      setComparisonStats(stats);
      return stats;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Récupérer les tendances
  const fetchTrendStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await statisticsService.getTrendStats();
      setTrendStats(stats);
      return stats;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Récupérer les statistiques spécifiques à un terrain
  const fetchTerrainSpecificStats = useCallback(async (terrainId: number, query: StatisticsQuery = { period: 'month' }) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await statisticsService.getTerrainSpecificStats(terrainId, query);
      return stats;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Fonction pour récupérer toutes les statistiques en une fois
  const fetchAllStats = useCallback(async (query: StatisticsQuery = { period: 'month' }) => {
    setLoading(true);
    setError(null);
    try {
      const [
        overview,
        performance,
        revenue,
        occupation,
        participants,
        matches,
        temporal,
        engagement,
        comparison,
        trends
      ] = await Promise.all([
        statisticsService.getOverviewStats(query),
        statisticsService.getPerformanceStats(query),
        statisticsService.getRevenueStats(query),
        statisticsService.getOccupationStats(query),
        statisticsService.getParticipantsStats(query),
        statisticsService.getMatchesStats(query),
        statisticsService.getTemporalStats(query),
        statisticsService.getEngagementStats(query),
        statisticsService.getTerrainComparisonStats(query),
        statisticsService.getTrendStats(),
      ]);

      setOverviewStats(overview);
      setPerformanceStats(performance);
      setRevenueStats(revenue);
      setOccupationStats(occupation);
      setParticipantsStats(participants);
      setMatchesStats(matches);
      setTemporalStats(temporal);
      setEngagementStats(engagement);
      setComparisonStats(comparison);
      setTrendStats(trends);

      return {
        overview,
        performance,
        revenue,
        occupation,
        participants,
        matches,
        temporal,
        engagement,
        comparison,
        trends,
      };
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Fonction pour formater les montants en FCFA
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Fonction pour formater les pourcentages
  const formatPercentage = useCallback((value: number): string => {
    return `${value.toFixed(1)}%`;
  }, []);

  // Fonction pour formater les nombres
  const formatNumber = useCallback((value: number): string => {
    return new Intl.NumberFormat('fr-FR').format(value);
  }, []);

  return {
    // États
    loading,
    error,
    overviewStats,
    performanceStats,
    revenueStats,
    occupationStats,
    participantsStats,
    matchesStats,
    temporalStats,
    engagementStats,
    comparisonStats,
    trendStats,

    // Fonctions de récupération
    fetchOverviewStats,
    fetchPerformanceStats,
    fetchRevenueStats,
    fetchOccupationStats,
    fetchParticipantsStats,
    fetchMatchesStats,
    fetchTemporalStats,
    fetchEngagementStats,
    fetchComparisonStats,
    fetchTrendStats,
    fetchTerrainSpecificStats,
    fetchAllStats,

    // Fonctions utilitaires
    clearError,
    formatCurrency,
    formatPercentage,
    formatNumber,
  };
}; 