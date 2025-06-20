import { useState, useEffect, useCallback, useRef } from 'react';
import { Notification, notificationService } from '../services/notificationService';
import { useAppDispatch, useAppSelector } from '../store/hooks/hooks';
import {
  selectNotificationCount,
  selectUser,
  setNotificationCount,
} from '../store/slices/userSlice';

// Interface pour le hook
interface UseNotificationReturn {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  hasMoreData: boolean;
  currentPage: number;
  notificationCount: number;
  loadMoreData: () => void;
  refreshData: () => void;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  handleEndReached: () => void;
  handleRefresh: () => void;
  handleNotificationPress: (notification: Notification) => Promise<void>;
  handleMarkAllAsRead: () => Promise<void>;
}

export const useNotification = (): UseNotificationReturn => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const notificationCount = useAppSelector(selectNotificationCount);
  const utilisateurId = user?.utilisateurId;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const ITEMS_PER_PAGE = 10;

  // Ref pour éviter les appels simultanés
  const loadingRef = useRef(false);
  const unreadCountTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Charge les notifications paginées.
   * @param page - Numéro de la page.
   * @param append - Si true, ajoute à la liste existante.
   */
  const loadNotifications = useCallback(
    async (page: number = 1, append: boolean = false) => {
      if (!utilisateurId || loadingRef.current) return;

      try {
        loadingRef.current = true;
        setIsLoading(true);
        setError(null);

        const newNotifications = await notificationService.getNotificationsWithPagination(
          utilisateurId,
          page,
          ITEMS_PER_PAGE
        );

        if (newNotifications.length < ITEMS_PER_PAGE) {
          setHasMoreData(false);
        }

        setNotifications(prev =>
          append ? [...prev, ...newNotifications] : newNotifications
        );
        setCurrentPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        console.error('Erreur lors du chargement des notifications:', err);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    },
    [utilisateurId]
  );

  /**
   * Charge le nombre de notifications non lues.
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
   * Charge plus de notifications (pagination).
   */
  const loadMoreData = useCallback(() => {
    if (!isLoading && hasMoreData && !loadingRef.current) {
      loadNotifications(currentPage + 1, true);
    }
  }, [isLoading, hasMoreData, currentPage, loadNotifications]);

  /**
   * Rafraîchit la liste des notifications et recharge le compteur.
   */
  const refreshData = useCallback(() => {
    setHasMoreData(true);
    setCurrentPage(1);
    loadNotifications(1, false);

    // Recharger le compteur avec délai pour éviter surcharge
    if (unreadCountTimeoutRef.current) {
      clearTimeout(unreadCountTimeoutRef.current);
    }
    unreadCountTimeoutRef.current = setTimeout(() => {
      loadUnreadCount();
    }, 1000);
  }, [loadNotifications, loadUnreadCount]);

  /**
   * Marque une notification comme lue.
   */
  const markAsRead = useCallback(
    async (notificationId: number) => {
      try {
        await notificationService.markNotificationAsRead(notificationId);

        setNotifications(prev =>
          prev.map(notification =>
            notification.notificationId === notificationId
              ? { ...notification, notificationLue: true }
              : notification
          )
        );

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
   * Marque toutes les notifications comme lues.
   */
  const markAllAsRead = useCallback(async () => {
    if (!utilisateurId) return;

    try {
      await notificationService.markAllNotificationsAsRead(utilisateurId);

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, notificationLue: true }))
      );

      dispatch(setNotificationCount(0));
    } catch (err) {
      console.error('Erreur lors du marquage global comme lu:', err);
      throw err;
    }
  }, [utilisateurId]);

  /**
   * Supprime une notification.
   */
  const deleteNotification = useCallback(
    async (notificationId: number) => {
      try {
        await notificationService.deleteNotification(notificationId);

        const toDelete = notifications.find(n => n.notificationId === notificationId);
        setNotifications(prev =>
          prev.filter(notification => notification.notificationId !== notificationId)
        );

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
   * Gère la fin de liste (infinite scroll).
   */
  const handleEndReached = () => {
    if (hasMoreData && !isLoading) {
      loadMoreData();
    }
  };

  /**
   * Rafraîchit les données manuellement (pull to refresh).
   */
  const handleRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);

  /**
   * Gère le clic sur une notification.
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
   * Gère le bouton "tout marquer comme lu".
   */
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Erreur lors du marquage global comme lu:', error);
    }
  }, [markAllAsRead]);

  /**
   * Chargement initial des notifications et du compteur.
   */
  useEffect(() => {
    if (utilisateurId) {
      loadNotifications(1, false);

      const timer = setTimeout(() => {
        loadUnreadCount();
      }, 500);

      return () => {
        clearTimeout(timer);
        if (unreadCountTimeoutRef.current) {
          clearTimeout(unreadCountTimeoutRef.current);
        }
      };
    }
  }, [utilisateurId, loadNotifications, loadUnreadCount]);

  /**
   * Nettoyage des timeouts au démontage.
   */
  useEffect(() => {
    return () => {
      if (unreadCountTimeoutRef.current) {
        clearTimeout(unreadCountTimeoutRef.current);
      }
    };
  }, []);

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
