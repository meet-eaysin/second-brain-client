export interface DashboardAnalytics {
    totalDatabases: number;
    totalRecords: number;
    totalFiles: number;
    totalWorkspaces: number;
    recentActivity: ActivityItem[];
    popularDatabases: PopularDatabase[];
    storageUsed: number;
    storageLimit: number;
    recordsCreatedToday: number;
    recordsCreatedThisWeek: number;
    recordsCreatedThisMonth: number;
}

export interface ActivityItem {
    id: string;
    type: 'database_created' | 'record_created' | 'record_updated' | 'database_shared' | 'file_uploaded';
    title: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

export interface PopularDatabase {
    id: string;
    name: string;
    recordCount: number;
    lastAccessed: string;
    accessCount: number;
}

export interface DatabaseAnalytics {
    databaseId: string;
    databaseName: string;
    totalRecords: number;
    recordsCreatedToday: number;
    recordsCreatedThisWeek: number;
    recordsCreatedThisMonth: number;
    lastAccessed: string;
    accessCount: number;
    propertyUsage: PropertyUsage[];
    recordActivity: RecordActivity[];
    collaborators: number;
    averageRecordsPerDay: number;
}

export interface PropertyUsage {
    propertyId: string;
    propertyName: string;
    type: string;
    usageCount: number;
    fillRate: number; // Percentage of records that have this property filled
}

export interface RecordActivity {
    date: string;
    created: number;
    updated: number;
    deleted: number;
}

export interface UsageStatistics {
    totalUsers: number;
    activeUsers: number;
    totalDatabases: number;
    totalRecords: number;
    totalFiles: number;
    storageUsed: number;
    apiCalls: number;
    userGrowth: UserGrowthData[];
    databaseGrowth: DatabaseGrowthData[];
    systemHealth: SystemHealth;
}

export interface UserGrowthData {
    date: string;
    newUsers: number;
    activeUsers: number;
    totalUsers: number;
}

export interface DatabaseGrowthData {
    date: string;
    newDatabases: number;
    totalDatabases: number;
    newRecords: number;
    totalRecords: number;
}

export interface SystemHealth {
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
    responseTime: number;
}

export interface DashboardAnalyticsQueryParams {
    timeRange?: '7d' | '30d' | '90d' | '1y';
    includeActivity?: boolean;
    activityLimit?: number;
}

export interface DatabaseAnalyticsQueryParams {
    timeRange?: '7d' | '30d' | '90d' | '1y';
    includeActivity?: boolean;
    includePropertyUsage?: boolean;
}

export interface UsageStatsQueryParams {
    timeRange?: '7d' | '30d' | '90d' | '1y';
    includeGrowth?: boolean;
    includeHealth?: boolean;
}
