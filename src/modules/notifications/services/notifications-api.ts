import { apiClient } from "@/services/api-client.ts";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  Notification,
  NotificationQueryParams,
  NotificationStats,
  DeviceTokenData,
  DeviceTokensResponse,
  ENotificationType, IDueTaskNotificationData, IMentionNotificationData,
} from "@/modules/notifications/types/notifications.types";
import type { ApiResponse } from "@/types/api.types";

export const notificationsApi = {
  // Get all notifications for the current user
  getNotifications: async (
    params?: NotificationQueryParams
  ): Promise<ApiResponse<Notification[]>> => {
    const response = await apiClient.get<
      ApiResponse<Notification[]>
    >(API_ENDPOINTS.NOTIFICATIONS.LIST, { params });
    return response.data;
  },

  // Get notification by ID
  getNotificationById: async (
    id: string
  ): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.get<ApiResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATIONS.BY_ID(id)
    );
    return response.data;
  },

  // Update notification
  updateNotification: async (
    id: string,
    data: Partial<Notification>
  ): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.put<ApiResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATIONS.BY_ID(id),
      data
    );
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (
    id: string
  ): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.patch<ApiResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
    );
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (
    workspaceId?: string
  ): Promise<ApiResponse<{ updated: number }>> => {
    const response = await apiClient.patch<ApiResponse<{ updated: number }>>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ,
      { workspaceId }
    );
    return response.data;
  },

  // Mark multiple notifications as read
  markBulkNotificationsAsRead: async (
    notificationIds: string[]
  ): Promise<ApiResponse<{ updated: number }>> => {
    const response = await apiClient.patch<ApiResponse<{ updated: number }>>(
      API_ENDPOINTS.NOTIFICATIONS.BULK_READ,
      { notificationIds }
    );
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
  },

  // Delete multiple notifications
  deleteBulkNotifications: async (
    notificationIds: string[]
  ): Promise<ApiResponse<{ deleted: number }>> => {
    const response = await apiClient.delete<ApiResponse<{ deleted: number }>>(
      API_ENDPOINTS.NOTIFICATIONS.BULK_DELETE,
      { data: { notificationIds } }
    );
    return response.data;
  },

  // Get notification statistics
  getNotificationStats: async (
    workspaceId?: string
  ): Promise<ApiResponse<NotificationStats>> => {
    const response = await apiClient.get<ApiResponse<NotificationStats>>(
      API_ENDPOINTS.NOTIFICATIONS.STATS,
      { params: { workspaceId } }
    );
    return response.data;
  },

  // Get unread notification count
  getUnreadNotificationCount: async (
    workspaceId?: string
  ): Promise<ApiResponse<{ unreadCount: number }>> => {
    const response = await apiClient.get<ApiResponse<{ unreadCount: number }>>(
      API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT,
      { params: { workspaceId } }
    );
    return response.data;
  },

  // Get recent notifications
  getRecentNotifications: async (
    limit = 20,
    workspaceId?: string
  ): Promise<
    ApiResponse<{ notifications: Notification[]; unreadCount: number }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{ notifications: Notification[]; unreadCount: number }>
    >(API_ENDPOINTS.NOTIFICATIONS.RECENT, { params: { limit, workspaceId } });
    return response.data;
  },

  createMentionNotification: async (
    data: IMentionNotificationData
  ): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.post<ApiResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATIONS.MENTION,
      data
    );
    return response.data;
  },

  createDueTaskNotification: async (
    data: IDueTaskNotificationData
  ): Promise<ApiResponse<Notification>> => {
    const response = await apiClient.post<ApiResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATIONS.DUE_TASK,
      data
    );
    return response.data;
  },

  registerDeviceToken: async (
    data: DeviceTokenData
  ): Promise<ApiResponse<{ type: string; registered: boolean }>> => {
    const response = await apiClient.post<
      ApiResponse<{ type: string; registered: boolean }>
    >(API_ENDPOINTS.NOTIFICATIONS.DEVICES_REGISTER, data);
    return response.data;
  },

  unregisterDeviceToken: async (
    data: Omit<DeviceTokenData, "keys">
  ): Promise<ApiResponse<{ type: string; unregistered: boolean }>> => {
    const response = await apiClient.post<
      ApiResponse<{ type: string; unregistered: boolean }>
    >(API_ENDPOINTS.NOTIFICATIONS.DEVICES_UNREGISTER, data);
    return response.data;
  },

  getUserDeviceTokens: async (): Promise<ApiResponse<DeviceTokensResponse>> => {
    const response = await apiClient.get<ApiResponse<DeviceTokensResponse>>(
      API_ENDPOINTS.NOTIFICATIONS.DEVICES
    );
    return response.data;
  },

  getUnreadNotifications: async (
    limit = 10
  ): Promise<ApiResponse<Notification[]>> => {
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
  ): Promise<ApiResponse<Notification[]>> => {
    return notificationsApi.getNotifications({ ...params, type });
  },
};
