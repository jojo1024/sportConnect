import api from './api';

// Types pour les statistiques
export interface StatisticsQuery {
  period?: 'today' | 'week' | 'month' | '3months' | '6months' | 'year';
  terrainId?: number;
  startDate?: string;
  endDate?: string;
}

export interface RevenueStats {
  totalRevenue: number;
  averageRevenuePerMatch: number;
  revenueByTerrain: Array<{
    terrainId: number;
    terrainNom: string;
    revenue: number;
    matchCount: number;
  }>;
  revenueEvolution: Array<{
    date: string;
    revenue: number;
  }>;
}

export interface OccupationStats {
  averageOccupationRate: number;
  occupationByTerrain: Array<{
    terrainId: number;
    terrainNom: string;
    occupationRate: number;
    totalHours: number;
    occupiedHours: number;
  }>;
  popularHours: Array<{
    hour: string;
    matchCount: number;
  }>;
  popularDays: Array<{
    day: string;
    matchCount: number;
  }>;
}

export interface ParticipantsStats {
  totalUniqueParticipants: number;
  newParticipants: number;
  returningParticipants: number;
  averageParticipantsPerMatch: number;
  participantsByMatchType: Array<{
    matchType: string;
    participantCount: number;
  }>;
  topParticipants: Array<{
    participantId: number;
    participantNom: string;
    matchCount: number;
  }>;
}

export interface MatchesStats {
  totalMatches: number;
  confirmedMatches: number;
  cancelledMatches: number;
  completedMatches: number;
  confirmationRate: number;
  averageResponseTime: number;
  matchesByStatus: Array<{
    status: string;
    count: number;
  }>;
  matchesByTerrain: Array<{
    terrainId: number;
    terrainNom: string;
    matchCount: number;
  }>;
}

export interface TemporalStats {
  matchesByHour: Array<{
    hour: string;
    count: number;
  }>;
  matchesByDay: Array<{
    day: string;
    count: number;
  }>;
  matchesByMonth: Array<{
    month: string;
    count: number;
  }>;
  averageAdvanceBooking: number;
  averageMatchDuration: number;
}

export interface EngagementStats {
  totalNotifications: number;
  readNotifications: number;
  notificationReadRate: number;
  averageResponseTime: number;
  notificationsByType: Array<{
    type: string;
    count: number;
  }>;
}

export interface ManagerOverviewStats {
  revenue: RevenueStats;
  occupation: OccupationStats;
  participants: ParticipantsStats;
  matches: MatchesStats;
  temporal: TemporalStats;
  engagement: EngagementStats;
}

export interface PerformanceStats {
  totalRevenue: number;
  averageRevenuePerMatch: number;
  totalMatches: number;
  confirmedMatches: number;
  confirmationRate: number;
  averageOccupationRate: number;
  totalUniqueParticipants: number;
  averageParticipantsPerMatch: number;
  newParticipants: number;
  returningParticipants: number;
}

export interface TerrainComparisonStats {
  terrainCount: number;
  averageRevenue: number;
  averageOccupation: number;
  terrains: Array<{
    terrainId: number;
    terrainNom: string;
    revenue: number;
    revenuePercentage: number;
    matchCount: number;
    occupationRate: number;
  }>;
}

export interface TrendStats {
  revenue: {
    current: number;
    previous: number;
    percentage: number;
  };
  matches: {
    current: number;
    previous: number;
    percentage: number;
  };
  occupation: {
    current: number;
    previous: number;
    percentage: number;
  };
  weeklyComparison: {
    current: ManagerOverviewStats;
    previous: ManagerOverviewStats;
  };
}

// Service de statistiques
export const statisticsService = {
  /**
   * Récupère les statistiques d'ensemble (vue d'ensemble)
   */
  getOverviewStats: async (query: StatisticsQuery = { period: 'month' }): Promise<ManagerOverviewStats> => {
    try {
      const params = new URLSearchParams();
      if (query.period) params.append('period', query.period);
      if (query.terrainId) params.append('terrainId', query.terrainId.toString());
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);

      const response = await api.get<{ success: boolean; message: string; data: ManagerOverviewStats }>(
        `/statistics/overview?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques d\'ensemble:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques de performance (KPI principaux)
   */
  getPerformanceStats: async (query: StatisticsQuery = { period: 'month' }): Promise<PerformanceStats> => {
    try {
      const params = new URLSearchParams();
      if (query.period) params.append('period', query.period);
      if (query.terrainId) params.append('terrainId', query.terrainId.toString());
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);

      const response = await api.get<{ success: boolean; message: string; data: PerformanceStats }>(
        `/statistics/performance?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de performance:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques de revenus
   */
  getRevenueStats: async (query: StatisticsQuery = { period: 'month' }): Promise<RevenueStats> => {
    try {
      const params = new URLSearchParams();
      if (query.period) params.append('period', query.period);
      if (query.terrainId) params.append('terrainId', query.terrainId.toString());
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);

      const response = await api.get<{ success: boolean; message: string; data: RevenueStats }>(
        `/statistics/revenue?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de revenus:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques d'occupation
   */
  getOccupationStats: async (query: StatisticsQuery = { period: 'month' }): Promise<OccupationStats> => {
    try {
      const params = new URLSearchParams();
      if (query.period) params.append('period', query.period);
      if (query.terrainId) params.append('terrainId', query.terrainId.toString());
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);

      const response = await api.get<{ success: boolean; message: string; data: OccupationStats }>(
        `/statistics/occupation?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques d\'occupation:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques des participants
   */
  getParticipantsStats: async (query: StatisticsQuery = { period: 'month' }): Promise<ParticipantsStats> => {
    try {
      const params = new URLSearchParams();
      if (query.period) params.append('period', query.period);
      if (query.terrainId) params.append('terrainId', query.terrainId.toString());
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);

      const response = await api.get<{ success: boolean; message: string; data: ParticipantsStats }>(
        `/statistics/participants?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des participants:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques des matchs
   */
  getMatchesStats: async (query: StatisticsQuery = { period: 'month' }): Promise<MatchesStats> => {
    try {
      const params = new URLSearchParams();
      if (query.period) params.append('period', query.period);
      if (query.terrainId) params.append('terrainId', query.terrainId.toString());
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);

      const response = await api.get<{ success: boolean; message: string; data: MatchesStats }>(
        `/statistics/matches?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des matchs:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques temporelles
   */
  getTemporalStats: async (query: StatisticsQuery = { period: 'month' }): Promise<TemporalStats> => {
    try {
      const params = new URLSearchParams();
      if (query.period) params.append('period', query.period);
      if (query.terrainId) params.append('terrainId', query.terrainId.toString());
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);

      const response = await api.get<{ success: boolean; message: string; data: TemporalStats }>(
        `/statistics/temporal?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques temporelles:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques d'engagement
   */
  getEngagementStats: async (query: StatisticsQuery = { period: 'month' }): Promise<EngagementStats> => {
    try {
      const params = new URLSearchParams();
      if (query.period) params.append('period', query.period);
      if (query.terrainId) params.append('terrainId', query.terrainId.toString());
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);

      const response = await api.get<{ success: boolean; message: string; data: EngagementStats }>(
        `/statistics/engagement?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques d\'engagement:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques comparatives entre terrains
   */
  getTerrainComparisonStats: async (query: StatisticsQuery = { period: 'month' }): Promise<TerrainComparisonStats> => {
    try {
      const params = new URLSearchParams();
      if (query.period) params.append('period', query.period);
      if (query.terrainId) params.append('terrainId', query.terrainId.toString());
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);

      const response = await api.get<{ success: boolean; message: string; data: TerrainComparisonStats }>(
        `/statistics/comparison?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques comparatives:', error);
      throw error;
    }
  },

  /**
   * Récupère les tendances des statistiques
   */
  getTrendStats: async (): Promise<TrendStats> => {
    try {
      const response = await api.get<{ success: boolean; message: string; data: TrendStats }>(
        '/statistics/trends'
      );
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tendances:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques spécifiques à un terrain
   */
  getTerrainSpecificStats: async (terrainId: number, query: StatisticsQuery = { period: 'month' }): Promise<{
    revenue: RevenueStats;
    occupation: OccupationStats;
    matches: MatchesStats;
  }> => {
    try {
      const params = new URLSearchParams();
      if (query.period) params.append('period', query.period);
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);

      const response = await api.get<{ success: boolean; message: string; data: any }>(
        `/statistics/terrain/${terrainId}?${params.toString()}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques du terrain:', error);
      throw error;
    }
  },
}; 