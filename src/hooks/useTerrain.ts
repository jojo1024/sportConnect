import { useCallback, useEffect, useState } from 'react';
import { Terrain, terrainService } from '../services/terrainService';
import { useAppSelector } from '../store/hooks/hooks';
import { selectUser } from '../store/slices/userSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenNavigationProps, ScreenRouteProps } from '../navigation/types';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';
import { ErrorType } from '../services/api';

// Interface de retour du hook
interface UseTerrainReturn {
  terrains: Terrain[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  errorType: ErrorType | null;
  hasMoreData: boolean;
  currentPage: number;
  loadMoreData: () => void;
  refreshData: () => void;
  handleEndReached: () => void;
  handleRefresh: () => void;
  handleTerrainPress: (terrain: Terrain) => void;
  handleAddTerrain: () => void;
  handlePreviousImage: () => void;
  handleNextImage: () => void;
  handleCopyContact: () => void;
  handleReservations: () => void;
  handleStatistics: () => void;
  handleEdit: () => void;
  terrain: Terrain | null;
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  copied: boolean;
  handleBack: () => void;
}

// Hook personnalisé pour gérer les données de terrain avec pagination et rafraîchissement
export const useTerrain = (): UseTerrainReturn => {

  const navigation = useNavigation<ScreenNavigationProps>();
  const route = useRoute<ScreenRouteProps<'TerrainDetails'>>();
  
  // Vérifier si route.params existe et contient terrain
  const initialTerrain = route.params?.terrain;

  // État local pour les données du terrain (peut être mis à jour)
  const [terrain, setTerrain] = useState<Terrain | null>(initialTerrain || null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [allTerrains, setAllTerrains] = useState<Terrain[]>([]); // Tous les terrains
  const [terrains, setTerrains] = useState<Terrain[]>([]); // Terrains affichés (paginated)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
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
      setErrorType(null);

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
      console.error('Erreur lors du chargement des terrains:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.utilisateurId, user?.utilisateurRole]);

  /**
   * Charge les données de la page suivante (pagination côté client).
   */
  const loadMoreData = useCallback(async () => {
    if (!isLoading && !isLoadingMore && hasMoreData) {
      setIsLoadingMore(true);
      
      // Simuler un délai de chargement pour l'UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const nextPageTerrains = allTerrains.slice(startIndex, endIndex);
      
      setTerrains(prev => [...prev, ...nextPageTerrains]);
      setCurrentPage(nextPage);
      
      // Vérifier s'il y a encore plus de données
      setHasMoreData(endIndex < allTerrains.length);
      
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, hasMoreData, currentPage, allTerrains]);

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
    if (hasMoreData && !isLoading && !isLoadingMore) {
      loadMoreData();
    }
  };

  /**
   * Appelé lors d'un pull-to-refresh.
   */
  const handleRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  const handleTerrainPress = useCallback((terrain: Terrain) => {
    navigation.navigate('TerrainDetails', { terrain });
}, [navigation]);

const handleAddTerrain = useCallback(() => {
    navigation.navigate('TerrainForm', {
        mode: 'create'
    });
}, [navigation]);

    // Fonction pour mettre à jour les données du terrain
    const handleTerrainUpdated = (updatedTerrain: Terrain) => {
      setTerrain(updatedTerrain);
  };

  const handleEdit = () => {
      if (terrain) {
          navigation.navigate('TerrainForm', {
              mode: 'edit',
              terrainData: terrain,
              onTerrainUpdated: handleTerrainUpdated
          });
      }
  };

  const handleCopyContact = async () => {
      if (terrain?.terrainContact) {
          try {
              await Clipboard.setStringAsync(terrain.terrainContact);
              setCopied(true);

              // Reset copied state after 2 seconds
              setTimeout(() => {
                  setCopied(false);
              }, 2000);
          } catch (error) {
          }
      } else {
          Alert.alert('Erreur', 'Aucun contact disponible');
      }
  };


  const handleReservations = () => {
      // TODO: Naviguer vers l'écran des réservations
      Alert.alert('Fonctionnalité', 'Gestion des réservations à implémenter');
  };

  const handleStatistics = () => {
      // TODO: Naviguer vers l'écran des statistiques
      Alert.alert('Fonctionnalité', 'Statistiques du terrain à implémenter');
  };

  const handlePreviousImage = () => {
      if (terrain?.terrainImages && terrain.terrainImages.length > 1) {
          const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : terrain.terrainImages.length - 1;
          setCurrentImageIndex(newIndex);
      }
  };

  const handleNextImage = () => {
      if (terrain?.terrainImages && terrain.terrainImages.length > 1) {
          const newIndex = currentImageIndex < terrain.terrainImages.length - 1 ? currentImageIndex + 1 : 0;
          setCurrentImageIndex(newIndex);
      }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Retour de toutes les données nécessaires à un composant de liste
  return {
    terrains,
    isLoading,
    isLoadingMore,
    error,
    errorType,
    hasMoreData,
    currentPage,
    loadMoreData,
    refreshData,
    handleEndReached,
    handleRefresh,
    handleTerrainPress,
    handleAddTerrain,
    handlePreviousImage,
    handleNextImage,
    handleCopyContact,
    handleReservations,
    handleStatistics,
    handleEdit,
    terrain,
    currentImageIndex,
    setCurrentImageIndex,
    copied,
    handleBack,
  };
}; 