import { useCallback, useEffect, useState } from 'react';
import { Match, matchService } from '../services/matchService';
import {
    extractDate,
    sortDatesWithPriority,
    today,
    tomorrow
} from '../utils/functions';

// Interface de retour du hook
interface UseMatchReturn {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
  hasMoreData: boolean;
  currentPage: number;
  loadMoreData: () => void;
  refreshData: () => void;
  allMatchFiltredByDate: string[];
  groupedMatchsByDate: Record<string, Match[]>;
  handleEndReached: () => void;
  handleRefresh: () => void;
}

// Hook personnalisé pour gérer les données de match avec pagination, rafraîchissement et regroupement
export const useMatch = (): UseMatchReturn => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const ITEMS_PER_PAGE = 10;

  /**
   * Récupère les matchs paginés depuis l'API.
   * @param page Page à charger.
   * @param append Si vrai, on ajoute les nouveaux matchs aux existants.
   */
  const loadMatches = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const newMatches = await matchService.getMatchesWithPagination(page, ITEMS_PER_PAGE);
      console.log('🚀 ~ loadMatches ~ newMatches:', newMatches.length);

      // Mise à jour du flag de fin de données
      if (newMatches.length < ITEMS_PER_PAGE) {
        setHasMoreData(false);
      }

      // Fusion ou remplacement de la liste des matchs
      setMatches(prev => (append ? [...prev, ...newMatches] : newMatches));
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur lors du chargement des matchs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Charge les données de la page suivante (pour l'infinite scroll).
   */
  const loadMoreData = useCallback(() => {
    if (!isLoading && hasMoreData) {
      loadMatches(currentPage + 1, true);
    }
  }, [isLoading, hasMoreData, currentPage, loadMatches]);

  /**
   * Rafraîchit les données (reset à la première page).
   */
  const refreshData = useCallback(() => {
    setHasMoreData(true);
    setCurrentPage(1);
    loadMatches(1, false);
  }, [loadMatches]);

  /**
   * Appelé au premier rendu pour charger les données initiales.
   */
  useEffect(() => {
    loadMatches(1, false);
  }, [loadMatches]);

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

  /**
   * Regroupe les matchs par date (clé = date du match).
   */
  const groupedMatchsByDate = matches.reduce((acc, match) => {
    const date = extractDate(match.matchDateDebut);
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  // S'assurer que "Aujourd'hui" et "Demain" apparaissent toujours
  if (!groupedMatchsByDate[today]) groupedMatchsByDate[today] = [];
  if (!groupedMatchsByDate[tomorrow]) groupedMatchsByDate[tomorrow] = [];

  /**
   * Liste des dates triées, avec priorité sur aujourd'hui et demain.
   */
  const allMatchFiltredByDate = sortDatesWithPriority(Object.keys(groupedMatchsByDate));

  // Retour de toutes les données nécessaires à un composant de liste
  return {
    matches,
    isLoading,
    error,
    hasMoreData,
    currentPage,
    loadMoreData,
    refreshData,
    allMatchFiltredByDate,
    groupedMatchsByDate,
    handleEndReached,
    handleRefresh,
  };
};
