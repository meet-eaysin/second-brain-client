// Activity Types
export interface IActivity {
  id: string;
  userId: string;
  workspaceId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface IActivityQueryOptions {
  workspaceId?: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface IActivityAnalytics {
  totalActivities: number;
  activitiesByType: Record<string, number>;
  activitiesByUser: Record<string, number>;
  activitiesOverTime: Array<{
    date: string;
    count: number;
  }>;
  topEntities: Array<{
    entityId: string;
    entityType: string;
    count: number;
  }>;
}

export interface IActivitySummary {
  totalActivities: number;
  todayActivities: number;
  weekActivities: number;
  monthActivities: number;
  mostActiveEntity: {
    entityId: string;
    entityType: string;
    count: number;
  };
}

export interface IAuditTrail {
  activities: IActivity[];
  total: number;
  hasMore: boolean;
}

export interface ISecurityEvent {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export interface IComplianceReport {
  period: string;
  totalActivities: number;
  complianceScore: number;
  violations: Array<{
    type: string;
    count: number;
    severity: string;
  }>;
  recommendations: string[];
}

export interface IActivityHeatmap {
  period: string;
  data: Array<{
    date: string;
    hour: number;
    count: number;
  }>;
}

// Analytics Types
export interface IAnalyticsQueryParams {
  workspaceId?: string;
  period?: "day" | "week" | "month" | "quarter" | "year" | "custom";
  startDate?: string;
  endDate?: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  groupBy?: string;
}

export interface IAnalyticsDashboard {
  overview: {
    totalUsers: number;
    totalWorkspaces: number;
    totalActivities: number;
    activeUsers: number;
  };
  charts: {
    userActivity: Array<{
      date: string;
      activeUsers: number;
      totalActivities: number;
    }>;
    workspaceUsage: Array<{
      workspaceId: string;
      name: string;
      activities: number;
      users: number;
    }>;
  };
}

export interface IAnalyticsSummary {
  period: string;
  metrics: {
    totalActivities: number;
    uniqueUsers: number;
    averageActivitiesPerUser: number;
    peakActivityHour: number;
  };
  trends: {
    activitiesChange: number;
    usersChange: number;
    engagementChange: number;
  };
}

export interface IAnalyticsInsights {
  insights: Array<{
    type: "trend" | "anomaly" | "recommendation";
    title: string;
    description: string;
    impact: "low" | "medium" | "high";
    data?: any;
  }>;
  generatedAt: string;
}

export interface IProductivityAnalytics {
  timeTracking: {
    totalHours: number;
    productiveHours: number;
    averageDailyHours: number;
    mostProductiveDay: string;
  };
  taskCompletion: {
    completedTasks: number;
    averageCompletionTime: number;
    completionRate: number;
    overdueTasks: number;
  };
  focusMetrics: {
    averageSessionLength: number;
    sessionsPerDay: number;
    distractionRate: number;
  };
}

export interface ITaskAnalytics {
  overview: {
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    completionRate: number;
  };
  byPriority: Record<string, number>;
  byStatus: Record<string, number>;
  completionTrends: Array<{
    date: string;
    completed: number;
    created: number;
  }>;
  averageCompletionTime: number;
}

export interface ITimeTrackingAnalytics {
  totalTrackedTime: number;
  sessions: Array<{
    id: string;
    taskId: string;
    duration: number;
    startTime: string;
    endTime: string;
  }>;
  dailyBreakdown: Array<{
    date: string;
    totalTime: number;
    sessionsCount: number;
  }>;
  productivityScore: number;
}

export interface IGoalAnalytics {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
  completionRate: number;
  goalsByCategory: Record<string, number>;
  progressTrends: Array<{
    date: string;
    completedGoals: number;
    totalGoals: number;
  }>;
  averageCompletionTime: number;
}

export interface IFinanceAnalytics {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  budgetUtilization: number;
  expensesByCategory: Record<string, number>;
  incomeTrends: Array<{
    date: string;
    income: number;
    expenses: number;
  }>;
  savingsRate: number;
}

export interface IContentAnalytics {
  totalContent: number;
  contentByType: Record<string, number>;
  mostViewed: Array<{
    id: string;
    title: string;
    views: number;
    type: string;
  }>;
  engagementMetrics: {
    averageViews: number;
    totalViews: number;
    averageEngagement: number;
  };
}

export interface IWorkspaceAnalytics {
  workspaceId: string;
  name: string;
  memberCount: number;
  activityCount: number;
  storageUsed: number;
  topContributors: Array<{
    userId: string;
    name: string;
    activities: number;
  }>;
  recentActivity: IActivity[];
}
