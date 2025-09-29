import { type ApiResponse } from "@/types/api.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "./notifications-api.ts";
import { NOTIFICATION_KEYS } from "@/constants/query-keys.ts";
import type {
  Notification,
  NotificationQueryParams,
  ENotificationType,
  DeviceTokenData,
} from "@/modules/notifications/types/notifications.types";
import { toast } from "sonner";

// Query hooks
export const useGetNotifications = (params?: NotificationQueryParams) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(params),
    queryFn: () => notificationsApi.getNotifications(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useGetNotificationById = (id: string) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.detail(id),
    queryFn: () => notificationsApi.getNotificationById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUnreadNotifications = (limit = 10) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unread(),
    queryFn: () => notificationsApi.getUnreadNotifications(limit),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

export const useGetNotificationsByType = (
  type: ENotificationType,
  params?: Omit<NotificationQueryParams, "type">
) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.byType(type),
    queryFn: () => notificationsApi.getNotificationsByType(type, params),
    enabled: !!type,
    staleTime: 2 * 60 * 1000,
  });
};

export const useGetRecentNotifications = (limit = 20, workspaceId?: string) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.recent(),
    queryFn: () => notificationsApi.getRecentNotifications(limit, workspaceId),
    staleTime: 1 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000, // Refetch every 3 minutes
  });
};

export const useGetUnreadNotificationCount = (workspaceId?: string) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: () => notificationsApi.getUnreadNotificationCount(workspaceId),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 1 * 60 * 1000, // Refetch every minute
  });
};

export const useGetNotificationStats = (workspaceId?: string) => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.stats(),
    queryFn: () => notificationsApi.getNotificationStats(workspaceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserDeviceTokens = () => {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.devices(),
    queryFn: () => notificationsApi.getUserDeviceTokens(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation hooks
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markNotificationAsRead(id),
    onSuccess: (updatedNotification, id) => {
      // Update the specific notification in cache
      queryClient.setQueryData(
        NOTIFICATION_KEYS.detail(id),
        updatedNotification
      );

      // Update the notification in lists
      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_KEYS.lists() },
        (oldData: ApiResponse<Notification[]>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            notifications: oldData?.data?.map((notification: Notification) =>
              notification.id === id
                ? {
                    ...notification,
                    isRead: true,
                    readAt: updatedNotification?.data?.readAt,
                  }
                : notification
            ),
            unreadCount: Math.max(
              0,
              oldData?.data?.map((n) => n.isRead).length || 0 - 1
            ),
          };
        }
      );

      // Invalidate unread notifications
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread() });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read";
      toast.error(message);
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllNotificationsAsRead(),
    onSuccess: () => {
      // Update all notifications in cache to be read
      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_KEYS.lists() },
        (oldData: ApiResponse<Notification[]>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            notifications: oldData?.data?.map((notification: Notification) => ({
              ...notification,
              isRead: true,
              readAt: new Date(),
            })),
            unreadCount: 0,
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });

      toast.success("All notifications marked as read");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to mark all notifications as read";
      toast.error(message);
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: (_, id) => {
      // Remove the notification from cache
      queryClient.removeQueries({ queryKey: NOTIFICATION_KEYS.detail(id) });

      // Remove from lists
      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_KEYS.lists() },
        (oldData: ApiResponse<Notification[]>) => {
          if (!oldData) return oldData;

          const deletedNotification = oldData?.data?.find(
            (n: Notification) => n.id === id
          );
          const wasUnread = deletedNotification && !deletedNotification.isRead;

          return {
            ...oldData,
            notifications: oldData?.data?.filter(
              (notification: Notification) => notification.id !== id
            ),
            total: oldData?.data?.length || 0 - 1,
            unreadCount: wasUnread
              ? Math.max(0, oldData?.data?.map((n) => n.isRead).length || 0 - 1)
              : oldData.data?.map((n) => n.isRead).length,
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread() });

      toast.success("Notification deleted successfully");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete notification";
      toast.error(message);
    },
  });
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Notification> }) =>
      notificationsApi.updateNotification(id, data),
    onSuccess: (updatedNotification, { id }) => {
      queryClient.setQueryData(
        NOTIFICATION_KEYS.detail(id),
        updatedNotification
      );

      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_KEYS.lists() },
        (oldData: ApiResponse<Notification[]>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            notifications: oldData?.data?.map((notification: Notification) =>
              notification.id === id ? updatedNotification : notification
            ),
          };
        }
      );

      toast.success("Notification updated successfully");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update notification";
      toast.error(message);
    },
  });
};

export const useMarkBulkNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationIds: string[]) =>
      notificationsApi.markBulkNotificationsAsRead(notificationIds),
    onSuccess: (_, notificationIds) => {
      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_KEYS.lists() },
        (oldData: ApiResponse<Notification[]>) => {
          if (!oldData) return oldData;

          const updatedNotifications = oldData?.data?.map(
            (notification: Notification) =>
              notificationIds.includes(notification.id)
                ? { ...notification, isRead: true, readAt: new Date() }
                : notification
          );

          const unreadCount = updatedNotifications?.filter(
            (n) => !n.isRead
          ).length;

          return {
            ...oldData,
            notifications: updatedNotifications,
            unreadCount,
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread() });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount(),
      });

      toast.success(`${notificationIds.length} notifications marked as read`);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to mark notifications as read";
      toast.error(message);
    },
  });
};

export const useDeleteBulkNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationIds: string[]) =>
      notificationsApi.deleteBulkNotifications(notificationIds),
    onSuccess: (_, notificationIds) => {
      // Remove notifications from lists
      queryClient.setQueriesData(
        { queryKey: NOTIFICATION_KEYS.lists() },
        (oldData: ApiResponse<Notification[]>) => {
          if (!oldData) return oldData;

          const remainingNotifications = oldData?.data?.filter(
            (notification: Notification) =>
              !notificationIds.includes(notification.id)
          );

          const unreadCount = remainingNotifications?.filter(
            (n) => !n.isRead
          ).length;

          return {
            ...oldData,
            notifications: remainingNotifications,
            total: oldData?.data?.length || 0 - notificationIds.length,
            unreadCount,
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread() });

      toast.success(`${notificationIds.length} notifications deleted`);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete notifications";
      toast.error(message);
    },
  });
};

export const useRegisterDeviceToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeviceTokenData) =>
      notificationsApi.registerDeviceToken(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.devices() });
      toast.success("Device token registered successfully");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to register device token";
      toast.error(message);
    },
  });
};

export const useUnregisterDeviceToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<DeviceTokenData, "keys">) =>
      notificationsApi.unregisterDeviceToken(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.devices() });
      toast.success("Device token unregistered successfully");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to unregister device token";
      toast.error(message);
    },
  });
};
