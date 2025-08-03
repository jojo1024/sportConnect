import { useState, useEffect } from 'react';
import { useAppSelector } from '../store/hooks/hooks';
import { selectAccessToken } from '../store/slices/userSlice';
import api from '../services/api';

export interface StatisticsData {
    period: string;
    revenue: {
        total: number;
        formatted: string;
    };
    matches: {
        total: number;
        confirmed: number;
        pending: number;
        cancelled: number;
    };
    players: {
        total: number;
        average: number;
    };
    reservations: {
        total: number;
        confirmed: number;
        pending: number;
        cancelled: number;
    };
    occupancyRate: {
        percentage: number;
        formatted: string;
    };
    popularTime: string;
    weeklyData: Array<{
        day: string;
        revenue: number;
        matches: number;
    }>;
}

export interface StatisticsParams {
    period: 'today' | 'week' | 'month' | '3months' | '6months' | 'year' | 'all' | 'custom';
    startDate?: string;
    endDate?: string;
}

export const useManagerStatistics = (params: StatisticsParams) => {
    const [data, setData] = useState<StatisticsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const accessToken = useAppSelector(selectAccessToken);

    const fetchStatistics = async () => {
        if (!accessToken) {
            setError('Token d\'accès non disponible');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams({
                period: params.period,
                ...(params.startDate && { startDate: params.startDate }),
                ...(params.endDate && { endDate: params.endDate })
            });

            const response = await api.get(`/statistics?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.data.success) {
                setData(response.data.data);
            } else {
                setError(response.data.message || 'Erreur lors de la récupération des statistiques');
            }
        } catch (err: any) {
            console.error('Erreur lors de la récupération des statistiques:', err);
            setError(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, [params.period, params.startDate, params.endDate, accessToken]);

    const refetch = () => {
        fetchStatistics();
    };

    return {
        data,
        loading,
        error,
        refetch
    };
};

// Hook pour les données hebdomadaires spécifiquement
export const useWeeklyData = (params: StatisticsParams) => {
    const [data, setData] = useState<Array<{ day: string; revenue: number; matches: number }>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const accessToken = useAppSelector(selectAccessToken);

    const fetchWeeklyData = async () => {
        if (!accessToken) {
            setError('Token d\'accès non disponible');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams({
                period: params.period,
                ...(params.startDate && { startDate: params.startDate }),
                ...(params.endDate && { endDate: params.endDate })
            });

            const response = await api.get(`/statistics/weekly-data?${queryParams}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.data.success) {
                setData(response.data.data.weeklyData || []);
            } else {
                setError(response.data.message || 'Erreur lors de la récupération des données hebdomadaires');
            }
        } catch (err: any) {
            console.error('Erreur lors de la récupération des données hebdomadaires:', err);
            setError(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeeklyData();
    }, [params.period, params.startDate, params.endDate, accessToken]);

    return {
        data,
        loading,
        error,
        refetch: fetchWeeklyData
    };
};

// Hook pour le résumé du dashboard
export const useDashboardSummary = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const accessToken = useAppSelector(selectAccessToken);

    const fetchSummary = async () => {
        if (!accessToken) {
            setError('Token d\'accès non disponible');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.get('/statistics/dashboard', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response.data.success) {
                setData(response.data.data);
            } else {
                setError(response.data.message || 'Erreur lors de la récupération du résumé');
            }
        } catch (err: any) {
            console.error('Erreur lors de la récupération du résumé:', err);
            setError(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, [accessToken]);

    return {
        data,
        loading,
        error,
        refetch: fetchSummary
    };
}; 