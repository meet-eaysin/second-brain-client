export interface Notification {
    id: string;
    userId: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'database_shared' | 'workspace_invite' | 'system_update';
    title: string;
    message: string;
    data?: Record<string, any>;
    isRead: boolean;
    readAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationQueryParams {
    isRead?: boolean;
    type?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface NotificationsResponse {
    notifications: Notification[];
    total: number;
    unreadCount: number;
    page: number;
    limit: number;
    totalPages: number;
}
