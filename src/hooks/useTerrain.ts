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
  const [allTerrains, setAllTerrains] = useState<Terrain[]>([]); // Tous les terrains
  const [terrains, setTerrains] = useState<Terrain[]>([]); // Terrains affichés (paginated)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  
  const user = useAppSelector(selectUser);
  console.log("🚀 ~ useTerrain ~ user:", user)

  const ITEMS_PER_PAGE = 10;

  /**
   * Récupère tous les terrains depuis l'API (une seule fois).
   */
  const loadAllTerrains = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let newTerrains: Terrain[] = [];
      
      // Si l'utilisateur est connecté et est un manager, récupérer ses terrains
      if (user?.utilisateurId && user?.utilisateurRole === 'gerant') {
        newTerrains = await terrainService.getManagerTerrains(user.utilisateurId);
      } 
      
      console.log('🚀 ~ loadAllTerrains ~ newTerrains:', newTerrains.length);

      // Stocker tous les terrains
      setAllTerrains(newTerrains);
      
      // Afficher la première page
      const firstPage = newTerrains.slice(0, ITEMS_PER_PAGE);
      setTerrains(firstPage);
      setCurrentPage(1);
      
      // Vérifier s'il y a plus de données
      setHasMoreData(newTerrains.length > ITEMS_PER_PAGE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors du chargement des terrains:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.utilisateurId, user?.utilisateurRole]);

  /**
   * Charge les données de la page suivante (pagination côté client).
   */
  const loadMoreData = useCallback(() => {
    if (!isLoading && hasMoreData) {
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const nextPageTerrains = allTerrains.slice(startIndex, endIndex);
      
      setTerrains(prev => [...prev, ...nextPageTerrains]);
      setCurrentPage(nextPage);
      
      // Vérifier s'il y a encore plus de données
      setHasMoreData(endIndex < allTerrains.length);
    }
  }, [isLoading, hasMoreData, currentPage, allTerrains]);

  /**
   * Rafraîchit les données (reset à la première page).
   */
  const refreshData = useCallback(() => {
    setHasMoreData(true);
    setCurrentPage(1);
    loadAllTerrains();
  }, [loadAllTerrains]);

  /**
   * Appelé au premier rendu pour charger les données initiales.
   */
  useEffect(() => {
    if (user?.utilisateurId) {
      loadAllTerrains();
    }
  }, [loadAllTerrains, user?.utilisateurId]);

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