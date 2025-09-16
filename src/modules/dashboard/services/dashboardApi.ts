import { apiClient } from '@/services/api-client.ts';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type { ApiResponse } from '@/types/api.types';
import type { Database } from '@/types/document.types.ts';

export interface DashboardStats {
    totalDatabases: number;
    totalRecords: number;
    totalViews: number;
    totalSharedDatabases: number;
    recentDatabases: RecentDatabase[];
    favoritesDatabases: Database[];
    quickStats: QuickStats;
    activityFeed: ActivityItem[];
    upcomingTasks: Task[];
    notifications: Notification[];
}

export interface RecentDatabase {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    recordCount: number;
    lastAccessed: string;
    lastModified: string;
    isOwner: boolean;
    permission: 'read' | 'write' | 'admin';
}

export interface QuickStats {
    databasesCreatedThisWeek: number;
    recordsAddedThisWeek: number;
    collaboratorsCount: number;
    storageUsed: number;
    storageLimit: number;
}

export interface ActivityItem {
    id: string;
    type: 'database_created' | 'record_added' | 'database_shared' | 'view_created' | 'property_added' | 'comment_added';
    title: string;
    description: string;
    timestamp: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    databaseId?: string;
    databaseName?: string;
    recordId?: string;
    metadata?: Record<string, any>;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    databaseId?: string;
    databaseName?: string;
    recordId?: string;
    assignedBy?: string;
    assignedTo?: string;
}

export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
    actionText?: string;
    metadata?: Record<string, any>;
}

export interface DashboardWidget {
    id: string;
    type: 'stats' | 'chart' | 'list' | 'calendar' | 'activity' | 'custom';
    title: string;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    config: Record<string, any>;
    isVisible: boolean;
}

export interface DashboardLayout {
    id: string;
    name: string;
    widgets: DashboardWidget[];
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardPreferences {
    defaultLayout: string;
    theme: 'light' | 'dark' | 'auto';
    showWelcomeMessage: boolean;
    showQuickActions: boolean;
    showRecentActivity: boolean;
    showNotifications: boolean;
    refreshInterval: number;
    timezone: string;
}

export const dashboardApi = {
    // Get dashboard statistics and data
    getDashboardStats: async (params?: {
        timeRange?: '7d' | '30d' | '90d';
        includeActivity?: boolean;
        includeTasks?: boolean;
        includeNotifications?: boolean;
    }): Promise<DashboardStats> => {
        const response = await apiClient.get<ApiResponse<DashboardStats>>(
            API_ENDPOINTS.DASHBOARD.STATS,
            { params }
        );
        return response.data.data;
    },

    // Get recent activity
    getRecentActivity: async (params?: {
        limit?: number;
        offset?: number;
        type?: string;
        databaseId?: string;
    }): Promise<ActivityItem[]> => {
        const response = await apiClient.get<ApiResponse<{ activities: ActivityItem[] }>>(
            '/dashboard/activity',
            { params }
        );
        return response.data.data.activities;
    },

    // Get upcoming tasks
    getUpcomingTasks: async (params?: {
        limit?: number;
        status?: string;
        priority?: string;
        dueDate?: string;
    }): Promise<Task[]> => {
        const response = await apiClient.get<ApiResponse<{ tasks: Task[] }>>(
            '/dashboard/tasks',
            { params }
        );
        return response.data.data.tasks;
    },

    // Get notifications
    getNotifications: async (params?: {
        limit?: number;
        unreadOnly?: boolean;
        type?: string;
    }): Promise<Notification[]> => {
        const response = await apiClient.get<ApiResponse<{ notifications: Notification[] }>>(
            '/dashboard/notifications',
            { params }
        );
        return response.data.data.notifications;
    },

    // Mark notification as read
    markNotificationAsRead: async (notificationId: string): Promise<void> => {
        await apiClient.patch(`/dashboard/notifications/${notificationId}/read`);
    },

    // Mark all notifications as read
    markAllNotificationsAsRead: async (): Promise<void> => {
        await apiClient.patch('/dashboard/notifications/read-all');
    },

    // Delete notification
    deleteNotification: async (notificationId: string): Promise<void> => {
        await apiClient.delete(`/dashboard/notifications/${notificationId}`);
    },

    // Get dashboard layouts
    getDashboardLayouts: async (): Promise<DashboardLayout[]> => {
        const response = await apiClient.get<ApiResponse<{ layouts: DashboardLayout[] }>>(
            '/dashboard/layouts'
        );
        return response.data.data.layouts;
    },

    // Create dashboard layout
    createDashboardLayout: async (layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>): Promise<DashboardLayout> => {
        const response = await apiClient.post<ApiResponse<DashboardLayout>>(
            '/dashboard/layouts',
            layout
        );
        return response.data.data;
    },

    // Update dashboard layout
    updateDashboardLayout: async (layoutId: string, layout: Partial<DashboardLayout>): Promise<DashboardLayout> => {
        const response = await apiClient.put<ApiResponse<DashboardLayout>>(
            `/dashboard/layouts/${layoutId}`,
            layout
        );
        return response.data.data;
    },

    // Delete dashboard layout
    deleteDashboardLayout: async (layoutId: string): Promise<void> => {
        await apiClient.delete(`/dashboard/layouts/${layoutId}`);
    },

    // Get dashboard preferences
    getDashboardPreferences: async (): Promise<DashboardPreferences> => {
        const response = await apiClient.get<ApiResponse<DashboardPreferences>>(
            '/dashboard/preferences'
        );
        return response.data.data;
    },

    // Update dashboard preferences
    updateDashboardPreferences: async (preferences: Partial<DashboardPreferences>): Promise<DashboardPreferences> => {
        const response = await apiClient.put<ApiResponse<DashboardPreferences>>(
            '/dashboard/preferences',
            preferences
        );
        return response.data.data;
    },

    // Get quick actions
    getQuickActions: async (): Promise<Array<{
        id: string;
        title: string;
        description: string;
        icon: string;
        action: string;
        url?: string;
        isEnabled: boolean;
    }>> => {
        const response = await apiClient.get<ApiResponse<{
            actions: Array<{
                id: string;
                title: string;
                description: string;
                icon: string;
                action: string;
                url?: string;
                isEnabled: boolean;
            }>
        }>>(
            '/dashboard/quick-actions'
        );
        return response.data.data.actions;
    },
};
