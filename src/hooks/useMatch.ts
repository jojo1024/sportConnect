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
  newMatchesCount: number;
  showNewMatchesNotification: boolean;
  hideNewMatchesNotification: () => void;
  newMatchesIds: Set<number>;
  markMatchAsSeen: (matchId: number) => void;
}

// Hook personnalisé pour gérer les données de match avec pagination, rafraîchissement et regroupement
export const useMatch = (): UseMatchReturn => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [newMatchesCount, setNewMatchesCount] = useState(0);
  const [showNewMatchesNotification, setShowNewMatchesNotification] = useState(false);
  const [previousMatchesIds, setPreviousMatchesIds] = useState<Set<number>>(new Set());
  const [newMatchesIds, setNewMatchesIds] = useState<Set<number>>(new Set());
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const ITEMS_PER_PAGE = 10;

  /**
   * Récupère les matchs paginés depuis l'API.
   * @param page Page à charger.
   * @param append Si vrai, on ajoute les nouveaux matchs aux existants.
   * @param isRefresh Si vrai, on détecte les nouveaux matchs.
   */
  const loadMatches = useCallback(async (page: number = 1, append: boolean = false, isRefresh: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const newMatches = await matchService.getMatchesWithPagination(page, ITEMS_PER_PAGE);
      console.log('🚀 ~ loadMatches ~ newMatches:', newMatches.length);

      // Logique différente selon le type de chargement
      if (isFirstLoad) {
        // Premier chargement : tous les matchs sont considérés comme nouveaux
        const allMatchIds = new Set(newMatches.map(match => match.matchId));
        setNewMatchesIds(allMatchIds);
        setPreviousMatchesIds(allMatchIds);
        setIsFirstLoad(false);
      } else if (isRefresh && !append) {
        // Rafraîchissement : détecter seulement les vrais nouveaux matchs
        const currentMatchesIds = new Set(newMatches.map(match => match.matchId));
        const newMatchesIds = new Set();
        
        // Trouver les nouveaux matchs (ceux qui n'étaient pas dans la liste précédente)
        newMatches.forEach(match => {
          if (!previousMatchesIds.has(match.matchId)) {
            newMatchesIds.add(match.matchId);
          }
        });

        const count = newMatchesIds.size;
        if (count > 0) {
          setNewMatchesCount(count);
          setShowNewMatchesNotification(true);
          // Stocker les IDs des nouveaux matchs pour l'affichage visuel
          setNewMatchesIds(newMatchesIds);
        } else {
          // Pas de nouveaux matchs, vider la liste des nouveaux
          setNewMatchesIds(new Set());
        }
        
        // Mettre à jour la liste des IDs précédents
        setPreviousMatchesIds(currentMatchesIds);
      }

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
  }, [previousMatchesIds, isFirstLoad]);

  /**
   * Marque un match comme vu (retire de la liste des nouveaux matchs)
   */
  const markMatchAsSeen = useCallback((matchId: number) => {
    setNewMatchesIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(matchId);
      return newSet;
    });
  }, []);

  /**
   * Charge les données de la page suivante (pour l'infinite scroll).
   */
  const loadMoreData = useCallback(() => {
    if (!isLoading && hasMoreData) {
      loadMatches(currentPage + 1, true, false);
    }
  }, [isLoading, hasMoreData, currentPage, loadMatches]);

  /**
   * Rafraîchit les données (reset à la première page).
   */
  const refreshData = useCallback(() => {
    setHasMoreData(true);
    setCurrentPage(1);
    loadMatches(1, false, true);
  }, [loadMatches]);

  /**
   * Cache la notification des nouveaux matchs.
   */
  const hideNewMatchesNotification = useCallback(() => {
    setShowNewMatchesNotification(false);
    setNewMatchesCount(0);
  }, []);

  /**
   * Appelé au premier rendu pour charger les données initiales.
   */
  useEffect(() => {
    loadMatches(1, false, false);
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
    newMatchesCount,
    showNewMatchesNotification,
    hideNewMatchesNotification,
    newMatchesIds,
    markMatchAsSeen,
  };
};
