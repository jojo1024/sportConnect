import api from "./api";

export interface Notification {
    notificationId: number;
    utilisateurId: number;
    notificationTitre: string;
    notificationContenu: string;
    notificationType: 'email' | 'sms' | 'push';
    notificationDate: string;
    notificationLue: boolean;
    utilisateurNom?: string;
    utilisateurTelephone?: string;
}

export interface NotificationResponse {
    success: boolean;
    message: string;
    data: Notification[];
}

export interface NotificationCountResponse {
    success: boolean;
    message: string;
    data: { count: number };
}

export const notificationService = {
    getNotifications: async (utilisateurId: number): Promise<Notification[]> => {
        const response = await api.get<NotificationResponse>(`/notifications/user/${utilisateurId}`);
        return response.data.data;
    },

    getNotificationsWithPagination: async (utilisateurId: number, page: number = 1, limit: number = 10): Promise<Notification[]> => {
        const response = await api.get<NotificationResponse>(`/notifications/user/${utilisateurId}/paginated?page=${page}&limit=${limit}`);
        return response.data.data;
    },

    getNotificationById: async (notificationId: number): Promise<Notification> => {
        const response = await api.get<{ success: boolean; message: string; data: Notification }>(`/notifications/${notificationId}`);
        return response.data.data;
    },

    createNotification: async (notification: Omit<Notification, 'notificationId' | 'notificationDate'>): Promise<any> => {
        const response = await api.post('/notifications', notification);
        return response.data;
    },

    updateNotification: async (notificationId: number, updates: Partial<Notification>): Promise<any> => {
        const response = await api.put(`/notifications/${notificationId}`, updates);
        return response.data;
    },

    markNotificationAsRead: async (notificationId: number): Promise<any> => {
        const response = await api.patch(`/notifications/${notificationId}/read`);
        return response.data;
    },

    markAllNotificationsAsRead: async (utilisateurId: number): Promise<any> => {
        const response = await api.patch(`/notifications/user/${utilisateurId}/read-all`);
        return response.data;
    },

    deleteNotification: async (notificationId: number): Promise<any> => {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
    },

    getUnreadNotificationsCount: async (utilisateurId: number): Promise<number> => {
        const response = await api.get<NotificationCountResponse>(`/notifications/user/${utilisateurId}/unread-count`);
        return response.data.data.count;
    },
}; 