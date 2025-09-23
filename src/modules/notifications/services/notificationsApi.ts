import { apiClient } from "@/services/api-client.ts";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  Notification,
  NotificationQueryParams,
  NotificationsResponse,
  NotificationStats,
  DeviceTokenData,
  DeviceTokensResponse,
  ENotificationType,
  IMentionNotificationData,
  IDueTaskNotificationData,
} from "@/types/notifications.types";
import type { ApiResponse } from "@/types/api.types";

export const notificationsApi = {
  // Get all notifications for the current user
  getNotifications: async (
    params?: NotificationQueryParams
  ): Promise<NotificationsResponse> => {
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

  // Update notification
  updateNotification: async (
    id: string,
    data: Partial<Notification>
  ): Promise<Notification> => {
    const response = await apiClient.put<ApiResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATIONS.BY_ID(id),
      data
    );
    return response.data.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.patch<ApiResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
    );
    return response.data.data;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (
    workspaceId?: string
  ): Promise<{ updated: number }> => {
    const response = await apiClient.patch<ApiResponse<{ updated: number }>>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ,
      { workspaceId }
    );
    return response.data.data;
  },

  // Mark multiple notifications as read
  markBulkNotificationsAsRead: async (
    notificationIds: string[]
  ): Promise<{ updated: number }> => {
    const response = await apiClient.patch<ApiResponse<{ updated: number }>>(
      API_ENDPOINTS.NOTIFICATIONS.BULK_READ,
      { notificationIds }
    );
    return response.data.data;
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
  },

  // Delete multiple notifications
  deleteBulkNotifications: async (
    notificationIds: string[]
  ): Promise<{ deleted: number }> => {
    const response = await apiClient.delete<ApiResponse<{ deleted: number }>>(
      API_ENDPOINTS.NOTIFICATIONS.BULK_DELETE,
      { data: { notificationIds } }
    );
    return response.data.data;
  },

  // Get notification statistics
  getNotificationStats: async (
    workspaceId?: string
  ): Promise<NotificationStats> => {
    const response = await apiClient.get<ApiResponse<NotificationStats>>(
      API_ENDPOINTS.NOTIFICATIONS.STATS,
      { params: { workspaceId } }
    );
    return response.data.data;
  },

  // Get unread notification count
  getUnreadNotificationCount: async (
    workspaceId?: string
  ): Promise<{ unreadCount: number }> => {
    const response = await apiClient.get<ApiResponse<{ unreadCount: number }>>(
      API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT,
      { params: { workspaceId } }
    );
    return response.data.data;
  },

  // Get recent notifications
  getRecentNotifications: async (
    limit = 20,
    workspaceId?: string
  ): Promise<{ notifications: Notification[]; unreadCount: number }> => {
    const response = await apiClient.get<
      ApiResponse<{ notifications: Notification[]; unreadCount: number }>
    >(API_ENDPOINTS.NOTIFICATIONS.RECENT, { params: { limit, workspaceId } });
    return response.data.data;
  },

  // Create mention notification
  createMentionNotification: async (
    data: IMentionNotificationData
  ): Promise<Notification> => {
    const response = await apiClient.post<ApiResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATIONS.MENTION,
      data
    );
    return response.data.data;
  },

  // Create due task notification
  createDueTaskNotification: async (
    data: IDueTaskNotificationData
  ): Promise<Notification> => {
    const response = await apiClient.post<ApiResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATIONS.DUE_TASK,
      data
    );
    return response.data.data;
  },

  // Register device token for push notifications
  registerDeviceToken: async (
    data: DeviceTokenData
  ): Promise<{ type: string; registered: boolean }> => {
    const response = await apiClient.post<
      ApiResponse<{ type: string; registered: boolean }>
    >(API_ENDPOINTS.NOTIFICATIONS.DEVICES_REGISTER, data);
    return response.data.data;
  },

  // Unregister device token
  unregisterDeviceToken: async (
    data: Omit<DeviceTokenData, "keys">
  ): Promise<{ type: string; unregistered: boolean }> => {
    const response = await apiClient.post<
      ApiResponse<{ type: string; unregistered: boolean }>
    >(API_ENDPOINTS.NOTIFICATIONS.DEVICES_UNREGISTER, data);
    return response.data.data;
  },

  // Get user device tokens
  getUserDeviceTokens: async (): Promise<DeviceTokensResponse> => {
    const response = await apiClient.get<ApiResponse<DeviceTokensResponse>>(
      API_ENDPOINTS.NOTIFICATIONS.DEVICES
    );
    return response.data.data;
  },

  // Legacy methods for backward compatibility
  getUnreadNotifications: async (
    limit = 10
  ): Promise<NotificationsResponse> => {
    return notificationsApi.getNotifications({
      unreadOnly: true,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  },

  getNotificationsByType: async (
    type: ENotificationType,
    params?: Omit<NotificationQueryParams, "type">
  ): Promise<NotificationsResponse> => {
    return notificationsApi.getNotifications({ ...params, type });
  },
};
