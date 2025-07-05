import { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks/hooks';
import { 
    selectUser, 
    selectUserStatistics, 
    selectUserRecentActivities, 
    selectProfileDataLoading, 
    selectProfileDataError, 
    selectLastProfileDataUpdate,
    startProfileDataLoading,
    setProfileDataError,
    setProfileData
} from '../store/slices/userSlice';
import { matchService } from '../services/matchService';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProfileData = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const statistics = useAppSelector(selectUserStatistics);
    const recentActivities = useAppSelector(selectUserRecentActivities);
    const loading = useAppSelector(selectProfileDataLoading);
    const error = useAppSelector(selectProfileDataError);
    const lastUpdate = useAppSelector(selectLastProfileDataUpdate);

    const hasCachedData = statistics !== null && recentActivities.length > 0;
    const isCacheValid = lastUpdate && (Date.now() - lastUpdate) < CACHE_DURATION;

    const fetchProfileData = useCallback(async (forceRefresh = false) => {
        if (!user?.utilisateurId) {
            return;
        }

        // Si on a des données en cache valides et qu'on ne force pas le refresh, on ne fait rien
        if (hasCachedData && isCacheValid && !forceRefresh) {
            return;
        }

        try {
            dispatch(startProfileDataLoading());
            
            const data = await matchService.getUserProfileData();
            dispatch(setProfileData(data));
        } catch (err: any) {
            console.error('Erreur lors de la récupération des données du profil:', err);
            dispatch(setProfileDataError(err.message || 'Erreur lors de la récupération des données'));
        }
    }, [user?.utilisateurId, dispatch, hasCachedData, isCacheValid]);

    const refreshData = useCallback(async () => {
        await fetchProfileData(true);
    }, [fetchProfileData]);

    // Chargement initial
    useEffect(() => {
        if (!user?.utilisateurId) {
            return;
        }

        // Si on a des données en cache valides, on les utilise
        if (hasCachedData && isCacheValid) {
            return;
        }

        // Sinon, on charge depuis l'API
        fetchProfileData();
    }, [user?.utilisateurId, fetchProfileData, hasCachedData, isCacheValid]);

    return {
        statistics,
        recentActivities,
        loading,
        error,
        refreshData,
        hasData: hasCachedData,
        isCacheValid
    };
}; 