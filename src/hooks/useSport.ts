import { useState, useEffect, useCallback } from 'react';
import { sportService, Sport, CreateSportData, UpdateSportData } from '../services/sportService';

export interface UseSportReturn {
    // États
    sports: Sport[];
    activeSports: Sport[];
    loading: boolean;
    error: string | null;
    
    // Actions
    fetchAllSports: (page?: number, limit?: number, status?: boolean, search?: string) => Promise<void>;
    fetchActiveSports: () => Promise<void>;
    createSport: (sportData: CreateSportData) => Promise<Sport>;
    updateSport: (sportId: number, sportData: UpdateSportData) => Promise<Sport>;
    deleteSport: (sportId: number) => Promise<boolean>;
    activateSport: (sportId: number) => Promise<Sport>;
    deactivateSport: (sportId: number) => Promise<Sport>;
    
    // Utilitaires
    getSportById: (sportId: number) => Sport | undefined;
    clearError: () => void;
}

export const useSport = (): UseSportReturn => {
    const [sports, setSports] = useState<Sport[]>([]);
    const [activeSports, setActiveSports] = useState<Sport[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Récupérer tous les sports
     */
    const fetchAllSports = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await sportService.getAllSports();
            setSports(result.sports);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la récupération des sports';
            setError(errorMessage);
            console.error('Erreur fetchAllSports:', err);
        } finally {
            setLoading(false);
        }
    };

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
            setError(errorMessage);
            console.error('Erreur fetchActiveSports:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Créer un nouveau sport
     */
    const createSport = async (sportData: CreateSportData): Promise<Sport> => {
        try {
            setLoading(true);
            setError(null);
            
            const newSport = await sportService.createSport(sportData);
            
            // Mettre à jour la liste des sports
            setSports(prev => [...prev, newSport]);
            
            // Si le sport est actif, mettre à jour la liste des sports actifs
            if (newSport.sportStatus) {
                setActiveSports(prev => [...prev, newSport]);
            }
            
            return newSport;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la création du sport';
            setError(errorMessage);
            console.error('Erreur createSport:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Mettre à jour un sport
     */
    const updateSport = async (sportId: number, sportData: UpdateSportData): Promise<Sport> => {
        try {
            setLoading(true);
            setError(null);
            
            const updatedSport = await sportService.updateSport(sportId, sportData);
            
            // Mettre à jour la liste des sports
            setSports(prev => prev.map(sport => 
                sport.sportId === sportId ? updatedSport : sport
            ));
            
            // Mettre à jour la liste des sports actifs
            setActiveSports(prev => {
                if (updatedSport.sportStatus) {
                    // Si le sport est maintenant actif, l'ajouter s'il n'y est pas déjà
                    const exists = prev.some(sport => sport.sportId === sportId);
                    if (!exists) {
                        return [...prev, updatedSport];
                    } else {
                        return prev.map(sport => 
                            sport.sportId === sportId ? updatedSport : sport
                        );
                    }
                } else {
                    // Si le sport n'est plus actif, le retirer
                    return prev.filter(sport => sport.sportId !== sportId);
                }
            });
            
            return updatedSport;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la mise à jour du sport';
            setError(errorMessage);
            console.error('Erreur updateSport:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Supprimer un sport
     */
    const deleteSport = async (sportId: number): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            
            const success = await sportService.deleteSport(sportId);
            
            if (success) {
                // Retirer le sport des listes
                setSports(prev => prev.filter(sport => sport.sportId !== sportId));
                setActiveSports(prev => prev.filter(sport => sport.sportId !== sportId));
            }
            
            return success;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la suppression du sport';
            setError(errorMessage);
            console.error('Erreur deleteSport:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Activer un sport
     */
    const activateSport = async (sportId: number): Promise<Sport> => {
        try {
            setLoading(true);
            setError(null);
            
            const activatedSport = await sportService.activateSport(sportId);
            
            // Mettre à jour les listes
            setSports(prev => prev.map(sport => 
                sport.sportId === sportId ? activatedSport : sport
            ));
            
            setActiveSports(prev => {
                const exists = prev.some(sport => sport.sportId === sportId);
                if (!exists) {
                    return [...prev, activatedSport];
                } else {
                    return prev.map(sport => 
                        sport.sportId === sportId ? activatedSport : sport
                    );
                }
            });
            
            return activatedSport;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de l\'activation du sport';
            setError(errorMessage);
            console.error('Erreur activateSport:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Désactiver un sport
     */
    const deactivateSport = async (sportId: number): Promise<Sport> => {
        try {
            setLoading(true);
            setError(null);
            
            const deactivatedSport = await sportService.deactivateSport(sportId);
            
            // Mettre à jour les listes
            setSports(prev => prev.map(sport => 
                sport.sportId === sportId ? deactivatedSport : sport
            ));
            
            setActiveSports(prev => prev.filter(sport => sport.sportId !== sportId));
            
            return deactivatedSport;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Erreur lors de la désactivation du sport';
            setError(errorMessage);
            console.error('Erreur deactivateSport:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Récupérer un sport par son ID
     */
    const getSportById = (sportId: number): Sport | undefined => {
        return sports.find(sport => sport.sportId === sportId);
    };

    /**
     * Effacer l'erreur
     */
    const clearError = (): void => {
        setError(null);
    };

    // Charger les sports actifs au montage du composant
    useEffect(() => {
        fetchActiveSports().catch(err => {
            console.error('Erreur lors du chargement initial des sports:', err);
        });
    }, [fetchActiveSports]);

    return {
        // États
        sports,
        activeSports,
        loading,
        error,
        
        // Actions
        fetchAllSports,
        fetchActiveSports,
        createSport,
        updateSport,
        deleteSport,
        activateSport,
        deactivateSport,
        
        // Utilitaires
        getSportById,
        clearError
    };
}; 