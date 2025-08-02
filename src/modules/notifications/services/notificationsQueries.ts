import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from './notificationsApi';
import type {
    Notification,
    NotificationQueryParams,
} from '@/types/notifications.types';
import { toast } from 'sonner';

export const NOTIFICATION_KEYS = {
    all: ['notifications'] as const,
    lists: () => [...NOTIFICATION_KEYS.all, 'list'] as const,
    list: (params?: NotificationQueryParams) => [...NOTIFICATION_KEYS.lists(), params] as const,
    details: () => [...NOTIFICATION_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...NOTIFICATION_KEYS.details(), id] as const,
    unread: () => [...NOTIFICATION_KEYS.all, 'unread'] as const,
    byType: (type: string) => [...NOTIFICATION_KEYS.all, 'type', type] as const,
    recent: () => [...NOTIFICATION_KEYS.all, 'recent'] as const,
};

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

export const useGetNotificationsByType = (type: string, params?: Omit<NotificationQueryParams, 'type'>) => {
    return useQuery({
        queryKey: NOTIFICATION_KEYS.byType(type),
        queryFn: () => notificationsApi.getNotificationsByType(type, params),
        enabled: !!type,
        staleTime: 2 * 60 * 1000,
    });
};

export const useGetRecentNotifications = (limit = 20) => {
    return useQuery({
        queryKey: NOTIFICATION_KEYS.recent(),
        queryFn: () => notificationsApi.getRecentNotifications(limit),
        staleTime: 1 * 60 * 1000,
        refetchInterval: 3 * 60 * 1000, // Refetch every 3 minutes
    });
};

// Mutation hooks
export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notificationsApi.markNotificationAsRead(id),
        onSuccess: (updatedNotification, id) => {
            // Update the specific notification in cache
            queryClient.setQueryData(NOTIFICATION_KEYS.detail(id), updatedNotification);
            
            // Update the notification in lists
            queryClient.setQueriesData(
                { queryKey: NOTIFICATION_KEYS.lists() },
                (oldData: any) => {
                    if (!oldData) return oldData;
                    
                    return {
                        ...oldData,
                        notifications: oldData.notifications.map((notification: Notification) =>
                            notification.id === id
                                ? { ...notification, isRead: true, readAt: updatedNotification.readAt }
                                : notification
                        ),
                        unreadCount: Math.max(0, oldData.unreadCount - 1),
                    };
                }
            );
            
            // Invalidate unread notifications
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread() });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to mark notification as read');
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
                (oldData: any) => {
                    if (!oldData) return oldData;
                    
                    return {
                        ...oldData,
                        notifications: oldData.notifications.map((notification: Notification) => ({
                            ...notification,
                            isRead: true,
                            readAt: new Date().toISOString(),
                        })),
                        unreadCount: 0,
                    };
                }
            );
            
            // Invalidate all notification queries
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
            
            toast.success('All notifications marked as read');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to mark all notifications as read');
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
                (oldData: any) => {
                    if (!oldData) return oldData;
                    
                    const deletedNotification = oldData.notifications.find((n: Notification) => n.id === id);
                    const wasUnread = deletedNotification && !deletedNotification.isRead;
                    
                    return {
                        ...oldData,
                        notifications: oldData.notifications.filter((notification: Notification) => notification.id !== id),
                        total: oldData.total - 1,
                        unreadCount: wasUnread ? Math.max(0, oldData.unreadCount - 1) : oldData.unreadCount,
                    };
                }
            );
            
            // Invalidate unread notifications if needed
            queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.unread() });
            
            toast.success('Notification deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to delete notification');
        },
    });
};
