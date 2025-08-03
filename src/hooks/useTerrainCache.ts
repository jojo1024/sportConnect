import { useState, useEffect, useRef } from 'react';
import { terrainService, Terrain } from '../services/terrainService';

interface UseTerrainCacheReturn {
    terrains: Terrain[];
    loading: boolean;
    error: string | null;
    refreshTerrains: () => Promise<void>;
    clearCache: () => void;
}

/**
 * Hook personnalisé pour gérer le cache des terrains du gérant
 * Évite les rechargements inutiles et maintient un cache global
 */
export const useTerrainCache = (): UseTerrainCacheReturn => {
    const [terrains, setTerrains] = useState<Terrain[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Cache global pour les terrains
    const terrainsCache = useRef<Terrain[]>([]);
    const hasLoadedTerrains = useRef(false);
    const isLoadingRef = useRef(false);

    const loadTerrains = async (forceRefresh: boolean = false) => {
        // Éviter les requêtes simultanées
        if (isLoadingRef.current) return;
        
        // Si on a déjà des terrains en cache et qu'on ne force pas le refresh
        if (terrainsCache.current.length > 0 && !forceRefresh) {
            setTerrains(terrainsCache.current);
            return;
        }

        try {
            isLoadingRef.current = true;
            setLoading(true);
            setError(null);
            
            const terrainsData = await terrainService.getManagerTerrains();
            
            // Mettre en cache les terrains
            terrainsCache.current = terrainsData;
            hasLoadedTerrains.current = true;
            
            setTerrains(terrainsData);
        } catch (error: any) {
            console.error('Erreur lors du chargement des terrains:', error);
            const errorMsg = error?.response?.data?.message || 'Impossible de charger les terrains';
            setError(errorMsg);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    };

    const refreshTerrains = async () => {
        await loadTerrains(true);
    };

    const clearCache = () => {
        terrainsCache.current = [];
        hasLoadedTerrains.current = false;
        setTerrains([]);
    };

    // Charger les terrains au montage du composant
    useEffect(() => {
        if (!hasLoadedTerrains.current) {
            loadTerrains();
        }
    }, []);

    return {
        terrains,
        loading,
        error,
        refreshTerrains,
        clearCache
    };
}; 