import { useCallback, useEffect, useRef, useState } from 'react';
import { Match, matchService } from '../services/matchService';
import {
    extractDate,
    sortDatesWithPriority,
    today,
    tomorrow,
    isMatchPast
} from '../utils/functions';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProps } from '../navigation/types';
import { ErrorType, ApiError } from '../services/api';

// Interface de retour du hook
interface UseMatchReturn {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
  errorType: ErrorType | null;
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
  handleMatchPress: (match: any) => void;
  handleCreditPress: () => void;
  handleSearchPress: () => void;
  handleSearchMatchPress: (match: any) => void;
  searchBottomSheetRef: React.RefObject<RBSheet | null>;
}

// Hook personnalisé pour gérer les données de match avec pagination, rafraîchissement et regroupement
export const useMatch = (selectedSportId?: number): UseMatchReturn => {

  const navigation = useNavigation<ScreenNavigationProps>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [newMatchesCount, setNewMatchesCount] = useState(0);
  const [showNewMatchesNotification, setShowNewMatchesNotification] = useState(false);
  const [previousMatchesIds, setPreviousMatchesIds] = useState<Set<number>>(new Set());
  const [newMatchesIds, setNewMatchesIds] = useState<Set<number>>(new Set());
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const searchBottomSheetRef = useRef<RBSheet>(null);

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
      setErrorType(null);

      const newMatches = await matchService.getMatchesWithPagination(page, ITEMS_PER_PAGE, selectedSportId);
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
          setNewMatchesIds(newMatchesIds as Set<number>);
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

      // Filtrer les matchs passés avant de les ajouter
      const filteredMatches = newMatches.filter(match => !isMatchPast(match.matchDateDebut));
      
      // Fusion ou remplacement de la liste des matchs
      setMatches(prev => (append ? [...prev, ...filteredMatches] : filteredMatches));
      setCurrentPage(page);
    } catch (err: any) {
      // Analyser le type d'erreur
      let errorTypeToSet = ErrorType.UNKNOWN;
      let errorMessage = 'Une erreur inattendue est survenue';
      
      // Vérifier si c'est une erreur réseau
      if (err?.message?.includes('Network Error') || err?.code === 'NETWORK_ERROR' || !err?.response) {
        errorTypeToSet = ErrorType.NETWORK;
        errorMessage = 'Pas de connexion internet. Vérifiez votre réseau et réessayez.';
      }
      // Vérifier si c'est une erreur de timeout
      else if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
        errorTypeToSet = ErrorType.TIMEOUT;
        errorMessage = 'Délai d\'attente dépassé. Vérifiez votre connexion et réessayez.';
      }
      // Vérifier les erreurs HTTP
      else if (err?.response?.status === 401) {
        errorTypeToSet = ErrorType.SESSION_EXPIRED;
        errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
      }
      else if (err?.response?.status === 400) {
        errorTypeToSet = ErrorType.VALIDATION;
        errorMessage = err?.response?.data?.message || 'Données invalides';
      }
      else if (err?.response?.status >= 500) {
        errorTypeToSet = ErrorType.SERVER;
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      }
      else if (err?.response?.status === 403) {
        errorTypeToSet = ErrorType.FORBIDDEN;
        errorMessage = 'Accès interdit. Vous n\'avez pas les permissions nécessaires.';
      }
      else {
        errorMessage = err?.response?.data?.message || err?.message || 'Une erreur inattendue est survenue.';
      }
      
      setError(errorMessage);
      setErrorType(errorTypeToSet);
      console.error('Erreur lors du chargement des matchs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [previousMatchesIds, isFirstLoad, selectedSportId]);

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
   * Recharger les données quand le sport sélectionné change
   */
  useEffect(() => {
    if (!isFirstLoad) {
      setMatches([]);
      setCurrentPage(1);
      setHasMoreData(true);
      setNewMatchesIds(new Set());
      loadMatches(1, false, false);
    }
  }, [selectedSportId]);

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
   * Filtre automatiquement les matchs passés.
   */
  const groupedMatchsByDate = matches
    .filter(match => !isMatchPast(match.matchDateDebut)) // Filtrer les matchs passés
    .reduce((acc, match) => {
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

  const handleMatchPress = (match: any) => {
    // Marquer le match comme vu si c'est un nouveau match
    if (newMatchesIds.has(match.matchId)) {
        markMatchAsSeen(match.matchId);
    }
    navigation.navigate('MatchDetails', { match });
};

const handleCreditPress = () => {
    return null
};

const handleSearchPress = () => {
    searchBottomSheetRef.current?.open();
};

const handleSearchMatchPress = (match: any) => {
    // Marquer le match comme vu si c'est un nouveau match
    if (newMatchesIds.has(match.matchId)) {
        markMatchAsSeen(match.matchId);
    }
    navigation.navigate('MatchDetails', { match });
};


  // Retour de toutes les données nécessaires à un composant de liste
  return {
    matches,
    isLoading,
    error,
    errorType,
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
    handleMatchPress,
    handleCreditPress,
    handleSearchPress,
    handleSearchMatchPress,
    searchBottomSheetRef
  };
};
