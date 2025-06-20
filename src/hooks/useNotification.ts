import { useState, useEffect, useCallback, useRef } from 'react';
import { Notification, notificationService } from '../services/notificationService';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface UseNotificationReturn {
    notifications: Notification[];
    isLoading: boolean;
    error: string | null;
    hasMoreData: boolean;
    currentPage: number;
    unreadCount: number;
    loadMoreData: () => void;
    refreshData: () => void;
    markAsRead: (notificationId: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (notificationId: number) => Promise<void>;
}

export const useNotification = (): UseNotificationReturn => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    
    const user = useSelector((state: RootState) => state.user.user);
    const utilisateurId = user?.utilisateurId;
    
    // Références pour éviter les appels multiples
    const loadingRef = useRef(false);
    const unreadCountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const ITEMS_PER_PAGE = 10;

    const loadNotifications = useCallback(async (page: number = 1, append: boolean = false) => {
        if (!utilisateurId || loadingRef.current) return;
        
        try {
            loadingRef.current = true;
            setIsLoading(true);
            setError(null);
            
            const newNotifications = await notificationService.getNotificationsWithPagination(utilisateurId, page, ITEMS_PER_PAGE);
            
            if (newNotifications.length === 0) {
                setHasMoreData(false);
            } else if (newNotifications.length < ITEMS_PER_PAGE) {
                setHasMoreData(false);
            }
            
            if (append) {
                setNotifications(prev => [...prev, ...newNotifications]);
            } else {
                setNotifications(newNotifications);
            }
            
            setCurrentPage(page);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            console.error('Erreur lors du chargement des notifications:', err);
        } finally {
            setIsLoading(false);
            loadingRef.current = false;
        }
    }, [utilisateurId]);

    const loadUnreadCount = useCallback(async () => {
        if (!utilisateurId) return;
        
        try {
            const count = await notificationService.getUnreadNotificationsCount(utilisateurId);
            setUnreadCount(count);
        } catch (err) {
            console.error('Erreur lors du chargement du nombre de notifications non lues:', err);
        }
    }, [utilisateurId]);

    const loadMoreData = useCallback(() => {
        if (!isLoading && hasMoreData && !loadingRef.current) {
            loadNotifications(currentPage + 1, true);
        }
    }, [isLoading, hasMoreData, currentPage, loadNotifications]);

    const refreshData = useCallback(() => {
        setHasMoreData(true);
        setCurrentPage(1);
        loadNotifications(1, false);
        
        // Charger le compteur après un délai pour éviter les appels simultanés
        if (unreadCountTimeoutRef.current) {
            clearTimeout(unreadCountTimeoutRef.current);
        }
        unreadCountTimeoutRef.current = setTimeout(() => {
            loadUnreadCount();
        }, 500);
    }, [loadNotifications, loadUnreadCount]);

    const markAsRead = useCallback(async (notificationId: number) => {
        try {
            await notificationService.markNotificationAsRead(notificationId);
            
            // Mettre à jour l'état local immédiatement
            setNotifications(prev => 
                prev.map(notification => 
                    notification.notificationId === notificationId 
                        ? { ...notification, notificationLue: true }
                        : notification
                )
            );
            
            // Mettre à jour le compteur après un délai
            if (unreadCountTimeoutRef.current) {
                clearTimeout(unreadCountTimeoutRef.current);
            }
            unreadCountTimeoutRef.current = setTimeout(() => {
                loadUnreadCount();
            }, 1000);
        } catch (err) {
            console.error('Erreur lors du marquage comme lu:', err);
            throw err;
        }
    }, [loadUnreadCount]);

    const markAllAsRead = useCallback(async () => {
        if (!utilisateurId) return;
        
        try {
            await notificationService.markAllNotificationsAsRead(utilisateurId);
            
            // Mettre à jour l'état local immédiatement
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, notificationLue: true }))
            );
            
            // Mettre à jour le compteur
            setUnreadCount(0);
        } catch (err) {
            console.error('Erreur lors du marquage de toutes les notifications comme lues:', err);
            throw err;
        }
    }, [utilisateurId]);

    const deleteNotification = useCallback(async (notificationId: number) => {
        try {
            await notificationService.deleteNotification(notificationId);
            
            // Mettre à jour l'état local
            setNotifications(prev => 
                prev.filter(notification => notification.notificationId !== notificationId)
            );
            
            // Mettre à jour le compteur si la notification n'était pas lue
            const deletedNotification = notifications.find(n => n.notificationId === notificationId);
            if (deletedNotification && !deletedNotification.notificationLue) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error('Erreur lors de la suppression de la notification:', err);
            throw err;
        }
    }, [notifications]);

    // Charger les données initiales
    useEffect(() => {
        if (utilisateurId) {
            loadNotifications(1, false);
            
            // Charger le compteur après un délai pour éviter les appels simultanés
            const timer = setTimeout(() => {
                loadUnreadCount();
            }, 1000);
            
            return () => {
                clearTimeout(timer);
                if (unreadCountTimeoutRef.current) {
                    clearTimeout(unreadCountTimeoutRef.current);
                }
            };
        }
    }, [utilisateurId, loadNotifications, loadUnreadCount]);

    // Nettoyer les timeouts lors du démontage
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
        unreadCount,
        loadMoreData,
        refreshData,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };
}; 