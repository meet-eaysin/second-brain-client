import { apiClient } from '@/services/api-client.ts';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type { ApiResponse } from '@/types/api.types';

export interface DashboardAnalytics {
    totalDatabases: number;
    totalRecords: number;
    totalViews: number;
    totalProperties: number;
    recentActivity: ActivityItem[];
    popularDatabases: PopularDatabase[];
    usageStats: UsageStats;
    growthMetrics: GrowthMetrics;
}

export interface ActivityItem {
    id: string;
    type: 'database_created' | 'record_added' | 'database_shared' | 'view_created' | 'property_added';
    description: string;
    timestamp: string;
    userId: string;
    userName: string;
    databaseId?: string;
    databaseName?: string;
}

export interface PopularDatabase {
    id: string;
    name: string;
    icon?: string;
    recordCount: number;
    viewCount: number;
    lastAccessed: string;
    accessCount: number;
}

export interface UsageStats {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    totalSessions: number;
    bounceRate: number;
}

export interface GrowthMetrics {
    databasesGrowth: {
        current: number;
        previous: number;
        percentage: number;
    };
    recordsGrowth: {
        current: number;
        previous: number;
        percentage: number;
    };
    usersGrowth: {
        current: number;
        previous: number;
        percentage: number;
    };
}

export interface DatabaseAnalytics {
    databaseId: string;
    databaseName: string;
    totalRecords: number;
    totalViews: number;
    totalProperties: number;
    viewsAnalytics: ViewAnalytics[];
    recordsAnalytics: RecordAnalytics;
    accessAnalytics: AccessAnalytics;
    performanceMetrics: PerformanceMetrics;
}

export interface ViewAnalytics {
    viewId: string;
    viewName: string;
    recordCount: number;
    accessCount: number;
    lastAccessed: string;
    averageLoadTime: number;
}

export interface RecordAnalytics {
    totalRecords: number;
    recordsCreatedToday: number;
    recordsCreatedThisWeek: number;
    recordsCreatedThisMonth: number;
    recordCreationTrend: TrendData[];
}

export interface AccessAnalytics {
    totalViews: number;
    uniqueVisitors: number;
    averageSessionDuration: number;
    accessTrend: TrendData[];
    topUsers: TopUser[];
}

export interface PerformanceMetrics {
    averageLoadTime: number;
    averageQueryTime: number;
    errorRate: number;
    uptime: number;
}

export interface TrendData {
    date: string;
    value: number;
}

export interface TopUser {
    userId: string;
    userName: string;
    accessCount: number;
    lastAccessed: string;
}

export interface UsageStatistics {
    systemStats: SystemStats;
    userStats: UserStats;
    databaseStats: DatabaseStats;
    performanceStats: PerformanceStats;
}

export interface SystemStats {
    totalUsers: number;
    activeUsers: number;
    totalDatabases: number;
    totalRecords: number;
    storageUsed: number;
    storageLimit: number;
}

export interface UserStats {
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    userGrowthTrend: TrendData[];
    userActivityTrend: TrendData[];
}

export interface DatabaseStats {
    databasesCreatedToday: number;
    databasesCreatedThisWeek: number;
    databasesCreatedThisMonth: number;
    databaseCreationTrend: TrendData[];
    popularTemplates: PopularTemplate[];
}

export interface PerformanceStats {
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
    requestsPerSecond: number;
}

export interface PopularTemplate {
    templateId: string;
    templateName: string;
    usageCount: number;
    category: string;
}

export const analyticsApi = {
    // Get dashboard analytics
    getDashboardAnalytics: async (params?: {
        timeRange?: '7d' | '30d' | '90d' | '1y';
        includeActivity?: boolean;
        includeGrowth?: boolean;
    }): Promise<DashboardAnalytics> => {
        const response = await apiClient.get<ApiResponse<DashboardAnalytics>>(
            API_ENDPOINTS.ANALYTICS.DASHBOARD,
            { params }
        );
        return response.data.data;
    },

    // Get database-specific analytics
    getDatabaseAnalytics: async (
        databaseId: string,
        params?: {
            timeRange?: '7d' | '30d' | '90d' | '1y';
            includeViews?: boolean;
            includeAccess?: boolean;
            includePerformance?: boolean;
        }
    ): Promise<DatabaseAnalytics> => {
        const response = await apiClient.get<ApiResponse<DatabaseAnalytics>>(
            API_ENDPOINTS.ANALYTICS.DATABASE(databaseId),
            { params }
        );
        return response.data.data;
    },

    // Get usage statistics (admin only)
    getUsageStatistics: async (params?: {
        timeRange?: '7d' | '30d' | '90d' | '1y';
        includeUsers?: boolean;
        includeDatabases?: boolean;
        includePerformance?: boolean;
    }): Promise<UsageStatistics> => {
        const response = await apiClient.get<ApiResponse<UsageStatistics>>(
            API_ENDPOINTS.ANALYTICS.USAGE,
            { params }
        );
        return response.data.data;
    },

    // Track custom events
    trackEvent: async (event: {
        type: string;
        properties?: Record<string, any>;
        userId?: string;
        databaseId?: string;
    }): Promise<void> => {
        await apiClient.post('/analytics/events', event);
    },

    // Get activity feed
    getActivityFeed: async (params?: {
        limit?: number;
        offset?: number;
        type?: string;
        userId?: string;
        databaseId?: string;
    }): Promise<ActivityItem[]> => {
        const response = await apiClient.get<ApiResponse<{ activities: ActivityItem[] }>>(
            '/analytics/activity',
            { params }
        );
        return response.data.data.activities;
    },
};
