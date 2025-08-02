import { apiClient } from '@/services/api-client.ts';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type {
    Notification,
    NotificationQueryParams,
    NotificationsResponse,
} from '@/types/notifications.types';
import type { ApiResponse } from '@/types/api.types';

export const notificationsApi = {
    // Get all notifications for the current user
    getNotifications: async (params?: NotificationQueryParams): Promise<NotificationsResponse> => {
        const response = await apiClient.get<ApiResponse<NotificationsResponse>>(
            API_ENDPOINTS.NOTIFICATIONS.LIST,
            { params }
        );
        return response.data.data;
    },

    // Get notification by ID
    getNotificationById: async (id: string): Promise<Notification> => {
        const response = await apiClient.get<ApiResponse<Notification>>(
            API_ENDPOINTS.NOTIFICATIONS.BY_ID(id)
        );
        return response.data.data;
    },

    // Mark notification as read
    markNotificationAsRead: async (id: string): Promise<Notification> => {
        const response = await apiClient.put<ApiResponse<Notification>>(
            API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
        );
        return response.data.data;
    },

    // Mark all notifications as read
    markAllNotificationsAsRead: async (): Promise<void> => {
        await apiClient.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    },

    // Delete notification
    deleteNotification: async (id: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
    },

    // Get unread notifications
    getUnreadNotifications: async (limit = 10): Promise<NotificationsResponse> => {
        return notificationsApi.getNotifications({
            isRead: false,
            limit,
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });
    },

    // Get notifications by type
    getNotificationsByType: async (
        type: string,
        params?: Omit<NotificationQueryParams, 'type'>
    ): Promise<NotificationsResponse> => {
        return notificationsApi.getNotifications({ ...params, type });
    },

    // Get recent notifications
    getRecentNotifications: async (limit = 20): Promise<NotificationsResponse> => {
        return notificationsApi.getNotifications({
            limit,
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });
    },
};
