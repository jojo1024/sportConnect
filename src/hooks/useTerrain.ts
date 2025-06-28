import { useCallback, useEffect, useState } from 'react';
import { Terrain, terrainService } from '../services/terrainService';
import { useAppSelector } from '../store/hooks/hooks';
import { selectUser } from '../store/slices/userSlice';

// Interface de retour du hook
interface UseTerrainReturn {
  terrains: Terrain[];
  isLoading: boolean;
  error: string | null;
  hasMoreData: boolean;
  currentPage: number;
  loadMoreData: () => void;
  refreshData: () => void;
  handleEndReached: () => void;
  handleRefresh: () => void;
}

// Hook personnalisé pour gérer les données de terrain avec pagination et rafraîchissement
export const useTerrain = (): UseTerrainReturn => {
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  
  const user = useAppSelector(selectUser);
  console.log("🚀 ~ useTerrain ~ user:", user)

  const ITEMS_PER_PAGE = 10;

  /**
   * Récupère les terrains paginés depuis l'API.
   * @param page Page à charger.
   * @param append Si vrai, on ajoute les nouveaux terrains aux existants.
   */
  const loadTerrains = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      let newTerrains: Terrain[] = [];
      
      // Si l'utilisateur est connecté et est un manager, récupérer ses terrains
      if (user?.utilisateurId && user?.utilisateurRole === 'gerant') {
        newTerrains = await terrainService.getManagerTerrains(user.utilisateurId);
      } 
      
      console.log('🚀 ~ loadTerrains ~ newTerrains:', newTerrains.length);

      // Mise à jour du flag de fin de données
      if (newTerrains.length < ITEMS_PER_PAGE) {
        setHasMoreData(false);
      }

      // Fusion ou remplacement de la liste des terrains
      setTerrains(prev => (append ? [...prev, ...newTerrains] : newTerrains));
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors du chargement des terrains:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.utilisateurId, user?.utilisateurRole]);

  /**
   * Charge les données de la page suivante (pour l'infinite scroll).
   */
  const loadMoreData = useCallback(() => {
    if (!isLoading && hasMoreData) {
      loadTerrains(currentPage + 1, true);
    }
  }, [isLoading, hasMoreData, currentPage, loadTerrains]);

  /**
   * Rafraîchit les données (reset à la première page).
   */
  const refreshData = useCallback(() => {
    setHasMoreData(true);
    setCurrentPage(1);
    loadTerrains(1, false);
  }, [loadTerrains]);

  /**
   * Appelé au premier rendu pour charger les données initiales.
   */
  useEffect(() => {
    if (user?.utilisateurId) {
      loadTerrains(1, false);
    }
  }, [loadTerrains, user?.utilisateurId]);

  /**
   * Appelé lorsque l'utilisateur atteint la fin de la liste.
   */
  const handleEndReached = () => {
    if (hasMoreData && !isLoading) {
      loadMoreData();
    }
  };

  /**
   * Appelé lors d'un pull-to-refresh.
   */
  const handleRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  // Retour de toutes les données nécessaires à un composant de liste
  return {
    terrains,
    isLoading,
    error,
    hasMoreData,
    currentPage,
    loadMoreData,
    refreshData,
    handleEndReached,
    handleRefresh,
  };
}; 