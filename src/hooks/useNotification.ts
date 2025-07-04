import { useState, useEffect, useCallback, useRef } from 'react';
import { Notification, notificationService } from '../services/notificationService';
import { useAppDispatch, useAppSelector } from '../store/hooks/hooks';
import {
  selectNotificationCount,
  selectUser,
  setNotificationCount,
} from '../store/slices/userSlice';

/**
 * Interface définissant le type de retour du hook useNotification
 * Contient toutes les propriétés et méthodes exposées par le hook
 */
interface UseNotificationReturn {
  notifications: Notification[];           // Liste des notifications
  isLoading: boolean;                      // État de chargement
  error: string | null;                    // Message d'erreur éventuel
  hasMoreData: boolean;                    // Indique s'il y a plus de données à charger
  currentPage: number;                     // Page actuelle pour la pagination
  notificationCount: number;               // Nombre total de notifications non lues
  loadMoreData: () => void;                // Fonction pour charger plus de données
  refreshData: () => void;                 // Fonction pour rafraîchir les données
  markAsRead: (notificationId: number) => Promise<void>;  // Marquer une notification comme lue
  markAllAsRead: () => Promise<void>;      // Marquer toutes les notifications comme lues
  deleteNotification: (notificationId: number) => Promise<void>;  // Supprimer une notification
  handleEndReached: () => void;            // Gestionnaire pour la fin de liste (infinite scroll)
  handleRefresh: () => void;               // Gestionnaire pour le pull-to-refresh
  handleNotificationPress: (notification: Notification) => Promise<void>;  // Gestionnaire de clic sur notification
  handleMarkAllAsRead: () => Promise<void>; // Gestionnaire pour marquer tout comme lu
}

/**
 * Hook personnalisé pour gérer les notifications de l'utilisateur
 * Fournit une interface complète pour charger, afficher et manipuler les notifications
 * 
 * Fonctionnalités principales :
 * - Chargement paginé des notifications
 * - Gestion du compteur de notifications non lues
 * - Marquage comme lu (individuel et global)
 * - Suppression de notifications
 * - Support de l'infinite scroll
 * - Pull-to-refresh
 * 
 * @returns {UseNotificationReturn} Objet contenant l'état et les méthodes de gestion
 */
export const useNotification = (): UseNotificationReturn => {
  // Hooks Redux pour accéder au store global
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const notificationCount = useAppSelector(selectNotificationCount);
  const utilisateurId = user?.utilisateurId;

  // États locaux du hook
  const [notifications, setNotifications] = useState<Notification[]>([]);  // Liste des notifications
  const [isLoading, setIsLoading] = useState(false);                       // État de chargement
  const [error, setError] = useState<string | null>(null);                 // Message d'erreur
  const [currentPage, setCurrentPage] = useState(1);                       // Page actuelle
  const [hasMoreData, setHasMoreData] = useState(true);                    // Indicateur de données supplémentaires

  // Constantes de configuration
  const ITEMS_PER_PAGE = 10;  // Nombre d'éléments par page pour la pagination

  // Références pour éviter les appels simultanés et gérer les timeouts
  const loadingRef = useRef(false);  // Évite les appels simultanés de chargement
  const unreadCountTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);  // Timeout pour le rechargement du compteur

  /**
   * Charge les notifications paginées depuis l'API
   * @param page - Numéro de la page à charger (défaut: 1)
   * @param append - Si true, ajoute les nouvelles notifications à la liste existante
   *                Si false, remplace complètement la liste
   */
  const loadNotifications = useCallback(
    async (page: number = 1, append: boolean = false) => {
      // Vérifications de sécurité
      if (!utilisateurId || loadingRef.current) return;

      try {
        // Début du chargement
        loadingRef.current = true;
        setIsLoading(true);
        setError(null);

        // Appel à l'API pour récupérer les notifications
        const newNotifications = await notificationService.getNotificationsWithPagination(
          utilisateurId,
          page,
          ITEMS_PER_PAGE
        );

        // Vérification s'il y a plus de données à charger
        if (newNotifications.length < ITEMS_PER_PAGE) {
          setHasMoreData(false);
        }

        // Mise à jour de l'état des notifications
        setNotifications(prev =>
          append ? [...prev, ...newNotifications] : newNotifications
        );
        setCurrentPage(page);
      } catch (err) {
        // Gestion des erreurs
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Erreur lors du chargement des notifications:', err);
      } finally {
        // Fin du chargement
        setIsLoading(false);
        loadingRef.current = false;
      }
    },
    [utilisateurId]
  );

  /**
   * Charge le nombre de notifications non lues depuis l'API
   * Met à jour le store Redux avec le nouveau compteur
   */
  const loadUnreadCount = useCallback(async () => {
    if (!utilisateurId) return;

    try {
      const count = await notificationService.getUnreadNotificationsCount(utilisateurId);
      dispatch(setNotificationCount(count));
    } catch (err) {
      console.error('Erreur lors du chargement du compteur de notifications:', err);
    }
  }, [utilisateurId]);

  /**
   * Charge la page suivante de notifications (pagination)
   * Utilisée pour l'infinite scroll
   */
  const loadMoreData = useCallback(() => {
    if (!isLoading && hasMoreData && !loadingRef.current) {
      loadNotifications(currentPage + 1, true);
    }
  }, [isLoading, hasMoreData, currentPage, loadNotifications]);

  /**
   * Rafraîchit complètement la liste des notifications
   * Remet à zéro la pagination et recharge le compteur avec un délai
   */
  const refreshData = useCallback(() => {
    setHasMoreData(true);
    setCurrentPage(1);
    loadNotifications(1, false);

    // Recharger le compteur avec délai pour éviter la surcharge
    if (unreadCountTimeoutRef.current) {
      clearTimeout(unreadCountTimeoutRef.current);
    }
    unreadCountTimeoutRef.current = setTimeout(() => {
      loadUnreadCount();
    }, 1000);
  }, [loadNotifications, loadUnreadCount]);

  /**
   * Marque une notification spécifique comme lue
   * @param notificationId - ID de la notification à marquer comme lue
   */
  const markAsRead = useCallback(
    async (notificationId: number) => {
      try {
        // Appel à l'API pour marquer comme lu
        await notificationService.markNotificationAsRead(notificationId);

        // Mise à jour locale de l'état
        setNotifications(prev =>
          prev.map(notification =>
            notification.notificationId === notificationId
              ? { ...notification, notificationLue: true }
              : notification
          )
        );

        // Rechargement du compteur avec délai
        if (unreadCountTimeoutRef.current) {
          clearTimeout(unreadCountTimeoutRef.current);
        }
        unreadCountTimeoutRef.current = setTimeout(() => {
          loadUnreadCount();
        }, 500);
      } catch (err) {
        console.error('Erreur lors du marquage comme lu:', err);
        throw err;
      }
    },
    [loadUnreadCount]
  );

  /**
   * Marque toutes les notifications de l'utilisateur comme lues
   * Met à jour le store Redux directement
   */
  const markAllAsRead = useCallback(async () => {
    if (!utilisateurId) return;

    try {
      // Appel à l'API pour marquer toutes les notifications comme lues
      await notificationService.markAllNotificationsAsRead(utilisateurId);

      // Mise à jour locale de toutes les notifications
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, notificationLue: true }))
      );

      // Mise à jour du compteur dans le store Redux
      dispatch(setNotificationCount(0));
    } catch (err) {
      console.error('Erreur lors du marquage global comme lu:', err);
      throw err;
    }
  }, [utilisateurId]);

  /**
   * Supprime une notification spécifique
   * @param notificationId - ID de la notification à supprimer
   */
  const deleteNotification = useCallback(
    async (notificationId: number) => {
      try {
        // Appel à l'API pour supprimer la notification
        await notificationService.deleteNotification(notificationId);

        // Récupération de la notification avant suppression pour vérifier son état
        const toDelete = notifications.find(n => n.notificationId === notificationId);
        
        // Suppression de la notification de la liste locale
        setNotifications(prev =>
          prev.filter(notification => notification.notificationId !== notificationId)
        );

        // Mise à jour du compteur si la notification n'était pas lue
        if (toDelete && !toDelete.notificationLue) {
          dispatch(setNotificationCount(notificationCount - 1));
        }
      } catch (err) {
        console.error('Erreur lors de la suppression de la notification:', err);
        throw err;
      }
    },
    [notifications, notificationCount]
  );

  /**
   * Gestionnaire pour la fin de liste (infinite scroll)
   * Appelé quand l'utilisateur atteint la fin de la liste
   */
  const handleEndReached = () => {
    if (hasMoreData && !isLoading) {
      loadMoreData();
    }
  };

  /**
   * Gestionnaire pour le pull-to-refresh
   * Rafraîchit manuellement les données
   */
  const handleRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  /**
   * Gestionnaire de clic sur une notification
   * Marque automatiquement la notification comme lue si elle ne l'était pas
   * @param notification - Notification cliquée
   */
  const handleNotificationPress = useCallback(
    async (notification: Notification) => {
      if (!notification.notificationLue) {
        try {
          await markAsRead(notification.notificationId);
        } catch (error) {
          console.error('Erreur lors du marquage comme lu:', error);
        }
      }
    },
    [markAsRead]
  );

  /**
   * Gestionnaire pour le bouton "tout marquer comme lu"
   * Gère les erreurs et affiche les messages appropriés
   */
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Erreur lors du marquage global comme lu:', error);
    }
  }, [markAllAsRead]);

  /**
   * Effet pour le chargement initial des données
   * Se déclenche quand l'utilisateur change ou au montage du composant
   */
  useEffect(() => {
    if (utilisateurId) {
      // Chargement initial des notifications
      loadNotifications(1, false);

      // Chargement du compteur avec un délai pour éviter la surcharge
      const timer = setTimeout(() => {
        loadUnreadCount();
      }, 500);

      // Nettoyage des timeouts au démontage
      return () => {
        clearTimeout(timer);
        if (unreadCountTimeoutRef.current) {
          clearTimeout(unreadCountTimeoutRef.current);
        }
      };
    }
  }, [utilisateurId, loadNotifications, loadUnreadCount]);

  /**
   * Effet de nettoyage pour les timeouts
   * S'assure que tous les timeouts sont nettoyés au démontage du composant
   */
  useEffect(() => {
    return () => {
      if (unreadCountTimeoutRef.current) {
        clearTimeout(unreadCountTimeoutRef.current);
      }
    };
  }, []);

  // Retour de toutes les propriétés et méthodes du hook
  return {
    notifications,
    isLoading,
    error,
    hasMoreData,
    currentPage,
    notificationCount,
    loadMoreData,
    refreshData,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleEndReached,
    handleRefresh,
    handleNotificationPress,
    handleMarkAllAsRead,
  };
};
