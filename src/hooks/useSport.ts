import { useCallback, useEffect, useState } from 'react';
import { Sport, sportService } from '../services/sportService';
import { SPORTS } from '../utils/constant';

export interface UseSportReturn {
    // États
    activeSports: Sport[];
    loading: boolean;
    error: string | null;
    // Actions
    fetchActiveSports: () => Promise<void>;
    
    // Utilitaires
    clearError: () => void;
    handleSportSelect: (sportId: number) => void;
    selectedSportId: number;
}

export const useSport = (): UseSportReturn => {

    const [selectedSportId, setSelectedSportId] = useState<number>(1); // Commencer par football (ID: 1)
    const [activeSports, setActiveSports] = useState<Sport[]>(SPORTS);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Récupérer les sports actifs
     */
    const fetchActiveSports = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await sportService.getActiveSports();
            setActiveSports(result);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la récupération des sports actifs';
            console.log("🚀 ~ fetchActiveSports ~ errorMessage:", errorMessage)
            setError(errorMessage);
            console.error('Erreur fetchActiveSports:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Effacer l'erreur
     */
    const clearError = (): void => {
        setError(null);
    };

    const handleSportSelect = (sportId: number) => {
        setSelectedSportId(sportId);
    };

    // Charger les sports au montage du composant
    useEffect(() => {
        // Charger les sports actifs en arrière-plan
        fetchActiveSports().catch(err => {
            console.error('Erreur lors du chargement initial des sports actifs, utilisation des données statiques:', err);
            // En cas d'erreur, on garde les données statiques déjà initialisées
        });
    }, [fetchActiveSports]);

    return {
        // États
        activeSports,
        loading,
        error,
        // Actions
        fetchActiveSports,
        // Utilitaires
        clearError,
        handleSportSelect,
        selectedSportId
    };
}; 