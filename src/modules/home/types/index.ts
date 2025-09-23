import { z } from "zod";

// Dashboard overview interface
export interface IDashboardOverview {
  quickStats: IQuickStats;
  recentActivity: IActivityFeedItem[];
  upcomingTasks: IUpcomingTask[];
  recentNotes: IRecentNote[];
  goalProgress: IGoalProgress[];
  habitStreaks: IHabitStreak[];
  financeSummary: IFinanceSummary;
  workspaceStats: IWorkspaceStats;
  recentlyVisited: IRecentlyVisitedItem[];
}

// Quick statistics
export interface IQuickStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalNotes: number;
  totalGoals: number;
  activeHabits: number;
  totalProjects: number;
  activeProjects: number;
  thisWeekExpenses: number;
  thisWeekIncome: number;
  journalEntriesThisMonth: number;
  averageMoodThisWeek: number;
}

// Activity feed item
export interface IActivityFeedItem {
  id: string;
  type:
    | "task_created"
    | "task_completed"
    | "note_created"
    | "goal_updated"
    | "habit_completed"
    | "journal_entry"
    | "finance_added";
  title: string;
  description: string;
  entityId: string;
  entityType: string;
  userId: string;
  userName?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Upcoming task
export interface IUpcomingTask {
  id: string;
  name: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  projectName?: string;
  projectId?: string;
  isOverdue: boolean;
  daysUntilDue: number;
}

// Recent note
export interface IRecentNote {
  id: string;
  title: string;
  preview: string;
  tags: string[];
  lastEditedAt: Date;
  wordCount: number;
}

// Goal progress
export interface IGoalProgress {
  id: string;
  name: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  deadline?: Date;
  progressPercentage: number;
  relatedTasksCount: number;
  completedTasksCount: number;
  isOverdue: boolean;
}

// Habit streak
export interface IHabitStreak {
  id: string;
  name: string;
  currentStreak: number;
  bestStreak: number;
  frequency: string;
  lastCompleted?: Date;
  completionRate: number;
}

// Finance summary
export interface IFinanceSummary {
  thisMonthIncome: number;
  thisMonthExpenses: number;
  thisMonthNet: number;
  lastMonthIncome: number;
  lastMonthExpenses: number;
  lastMonthNet: number;
  incomeChange: number;
  expenseChange: number;
  topExpenseCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  recentTransactions: Array<{
    id: string;
    date: Date;
    amount: number;
    type: "income" | "expense";
    category: string;
    note?: string;
  }>;
}

// Workspace statistics
export interface IWorkspaceStats {
  totalDatabases: number;
  totalRecords: number;
  totalViews: number;
  storageUsed: number;
  storageLimit: number;
  activeMembers: number;
  lastActivityAt: Date;
}

// Dashboard statistics (more detailed)
export interface IDashboardStats {
  overview: IDashboardOverview;
  trends: {
    tasksCompletedTrend: Array<{ date: string; count: number }>;
    notesCreatedTrend: Array<{ date: string; count: number }>;
    moodTrend: Array<{ date: string; mood: number }>;
    financeTrend: Array<{ date: string; income: number; expenses: number }>;
  };
  insights: {
    mostProductiveDay: string;
    averageTasksPerDay: number;
    mostUsedTags: string[];
    longestHabitStreak: IHabitStreak;
    biggestExpenseCategory: string;
  };
}

// Request/Response types
export interface IDashboardQueryParams {
  workspaceId?: string;
  period?: "day" | "week" | "month" | "year";
  includeActivity?: boolean;
  includeStats?: boolean;
  includeTrends?: boolean;
  activityLimit?: number;
  upcomingTasksLimit?: number;
  recentNotesLimit?: number;
}

export interface IDashboardResponse extends IDashboardOverview {}

export interface IDashboardStatsResponse extends IDashboardStats {}

// Validation schemas
export const QuickStatsSchema = z.object({
  totalTasks: z.number().min(0),
  completedTasks: z.number().min(0),
  overdueTasks: z.number().min(0),
  totalNotes: z.number().min(0),
  totalGoals: z.number().min(0),
  activeHabits: z.number().min(0),
  totalProjects: z.number().min(0),
  activeProjects: z.number().min(0),
  thisWeekExpenses: z.number(),
  thisWeekIncome: z.number(),
  journalEntriesThisMonth: z.number().min(0),
  averageMoodThisWeek: z.number().min(1).max(5),
});

export const ActivityFeedItemSchema = z.object({
  id: z.string(),
  type: z.enum([
    "task_created",
    "task_completed",
    "note_created",
    "goal_updated",
    "habit_completed",
    "journal_entry",
    "finance_added",
  ]),
  title: z.string(),
  description: z.string(),
  entityId: z.string(),
  entityType: z.string(),
  userId: z.string(),
  userName: z.string().optional(),
  timestamp: z.date(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const UpcomingTaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  dueDate: z.date(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  projectName: z.string().optional(),
  projectId: z.string().optional(),
  isOverdue: z.boolean(),
  daysUntilDue: z.number(),
});

export const RecentNoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  preview: z.string(),
  tags: z.array(z.string()),
  lastEditedAt: z.date(),
  wordCount: z.number().min(0),
});

export const GoalProgressSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  deadline: z.date().optional(),
  progressPercentage: z.number().min(0).max(100),
  relatedTasksCount: z.number().min(0),
  completedTasksCount: z.number().min(0),
  isOverdue: z.boolean(),
});

export const HabitStreakSchema = z.object({
  id: z.string(),
  name: z.string(),
  currentStreak: z.number().min(0),
  bestStreak: z.number().min(0),
  frequency: z.string(),
  lastCompleted: z.date().optional(),
  completionRate: z.number().min(0).max(100),
});

export const FinanceSummarySchema = z.object({
  thisMonthIncome: z.number(),
  thisMonthExpenses: z.number(),
  thisMonthNet: z.number(),
  lastMonthIncome: z.number(),
  lastMonthExpenses: z.number(),
  lastMonthNet: z.number(),
  incomeChange: z.number(),
  expenseChange: z.number(),
  topExpenseCategories: z.array(
    z.object({
      category: z.string(),
      amount: z.number(),
      percentage: z.number().min(0).max(100),
    })
  ),
  recentTransactions: z.array(
    z.object({
      id: z.string(),
      date: z.date(),
      amount: z.number(),
      type: z.enum(["income", "expense"]),
      category: z.string(),
      note: z.string().optional(),
    })
  ),
});

export const WorkspaceStatsSchema = z.object({
  totalDatabases: z.number().min(0),
  totalRecords: z.number().min(0),
  totalViews: z.number().min(0),
  storageUsed: z.number().min(0),
  storageLimit: z.number().min(0),
  activeMembers: z.number().min(0),
  lastActivityAt: z.date(),
});

export const DashboardOverviewSchema = z.object({
  quickStats: QuickStatsSchema,
  recentActivity: z.array(ActivityFeedItemSchema),
  upcomingTasks: z.array(UpcomingTaskSchema),
  recentNotes: z.array(RecentNoteSchema),
  goalProgress: z.array(GoalProgressSchema),
  habitStreaks: z.array(HabitStreakSchema),
  financeSummary: FinanceSummarySchema,
  workspaceStats: WorkspaceStatsSchema,
  recentlyVisited: z.array(RecentlyVisitedItemSchema),
});

// Query schema
export const DashboardQuerySchema = z.object({
  workspaceId: z.string().optional(),
  period: z.enum(["day", "week", "month", "year"]).default("week"),
  includeActivity: z.coerce.boolean().default(true),
  includeStats: z.coerce.boolean().default(true),
  includeTrends: z.coerce.boolean().default(false),
  activityLimit: z.coerce.number().min(1).max(50).default(10),
  upcomingTasksLimit: z.coerce.number().min(1).max(20).default(5),
  recentNotesLimit: z.coerce.number().min(1).max(20).default(5),
});

// Dashboard overview interface - matches server IDashboardOverview
export interface IDashboardOverview {
  quickStats: IQuickStats;
  recentActivity: IActivityFeedItem[];
  upcomingTasks: IUpcomingTask[];
  recentNotes: IRecentNote[];
  goalProgress: IGoalProgress[];
  habitStreaks: IHabitStreak[];
  financeSummary: IFinanceSummary;
  workspaceStats: IWorkspaceStats;
  recentlyVisited: IRecentlyVisitedItem[];
}

// Quick statistics - matches server IQuickStats
export interface IQuickStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalNotes: number;
  totalGoals: number;
  activeHabits: number;
  totalProjects: number;
  activeProjects: number;
  thisWeekExpenses: number;
  thisWeekIncome: number;
  journalEntriesThisMonth: number;
  averageMoodThisWeek: number;
}

// Activity feed item - matches server IActivityFeedItem
export interface IActivityFeedItem {
  id: string;
  type:
    | "task_created"
    | "task_completed"
    | "note_created"
    | "goal_updated"
    | "habit_completed"
    | "journal_entry"
    | "finance_added";
  title: string;
  description: string;
  entityId: string;
  entityType: string;
  userId: string;
  userName?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Upcoming task - matches server IUpcomingTask
export interface IUpcomingTask {
  id: string;
  name: string;
  dueDate: Date;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  projectName?: string;
  projectId?: string;
  isOverdue: boolean;
  daysUntilDue: number;
}

// Recent note - matches server IRecentNote
export interface IRecentNote {
  id: string;
  title: string;
  preview: string;
  tags: string[];
  lastEditedAt: Date;
  wordCount: number;
}

// Goal progress - matches server IGoalProgress
export interface IGoalProgress {
  id: string;
  name: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  deadline?: Date;
  progressPercentage: number;
  relatedTasksCount: number;
  completedTasksCount: number;
  isOverdue: boolean;
}

// Habit streak - matches server IHabitStreak
export interface IHabitStreak {
  id: string;
  name: string;
  currentStreak: number;
  bestStreak: number;
  frequency: string;
  lastCompleted?: Date;
  completionRate: number;
}

// Finance summary - matches server IFinanceSummary
export interface IFinanceSummary {
  thisMonthIncome: number;
  thisMonthExpenses: number;
  thisMonthNet: number;
  lastMonthIncome: number;
  lastMonthExpenses: number;
  lastMonthNet: number;
  incomeChange: number;
  expenseChange: number;
  topExpenseCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  recentTransactions: Array<{
    id: string;
    date: Date;
    amount: number;
    type: "income" | "expense";
    category: string;
    note?: string;
  }>;
}

// Workspace statistics - matches server IWorkspaceStats
export interface IWorkspaceStats {
  totalDatabases: number;
  totalRecords: number;
  totalViews: number;
  storageUsed: number;
  storageLimit: number;
  activeMembers: number;
  lastActivityAt: Date;
}

// Recently visited items - matches server IRecentlyVisitedItem
export interface IRecentlyVisitedItem {
  id: string;
  name: string;
  type: "page";
  preview?: string;
  route: string;
  lastVisitedAt: Date;
  icon?: string;
  color?: string;
  moduleType: string;
}

// Learn content items
export interface ILearnContent {
  id: string;
  title: string;
  description: string;
  category:
    | "Guide"
    | "Strategy"
    | "Productivity"
    | "Habits"
    | "Tutorial"
    | "Advanced";
  readTime: string;
  gradient: string;
  isUpcoming?: boolean;
  upcomingText?: string;
}

// Dashboard statistics (detailed) - matches server IDashboardStats
export interface IDashboardStats {
  overview: IDashboardOverview;
  trends: {
    tasksCompletedTrend: Array<{ date: string; count: number }>;
    notesCreatedTrend: Array<{ date: string; count: number }>;
    moodTrend: Array<{ date: string; mood: number }>;
    financeTrend: Array<{ date: string; income: number; expenses: number }>;
  };
  insights: {
    mostProductiveDay: string;
    averageTasksPerDay: number;
    mostUsedTags: string[];
    longestHabitStreak: IHabitStreak;
    biggestExpenseCategory: string;
  };
}

// Request/Response types
export interface IDashboardQueryParams {
  workspaceId?: string;
  period?: "day" | "week" | "month" | "year";
  includeActivity?: boolean;
  includeStats?: boolean;
  includeTrends?: boolean;
  activityLimit?: number;
  upcomingTasksLimit?: number;
  recentNotesLimit?: number;
}

// Validation schemas
export const QuickStatsSchema = z.object({
  totalTasks: z.number().min(0),
  completedTasks: z.number().min(0),
  overdueTasks: z.number().min(0),
  totalNotes: z.number().min(0),
  totalGoals: z.number().min(0),
  activeHabits: z.number().min(0),
  totalProjects: z.number().min(0),
  activeProjects: z.number().min(0),
  thisWeekExpenses: z.number(),
  thisWeekIncome: z.number(),
  journalEntriesThisMonth: z.number().min(0),
  averageMoodThisWeek: z.number().min(1).max(5),
});

export const ActivityFeedItemSchema = z.object({
  id: z.string(),
  type: z.enum([
    "task_created",
    "task_completed",
    "note_created",
    "goal_updated",
    "habit_completed",
    "journal_entry",
    "finance_added",
  ]),
  title: z.string(),
  description: z.string(),
  entityId: z.string(),
  entityType: z.string(),
  userId: z.string(),
  userName: z.string().optional(),
  timestamp: z.date(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const UpcomingTaskSchema = z.object({
  id: z.string(),
  name: z.string(),
  dueDate: z.date(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  projectName: z.string().optional(),
  projectId: z.string().optional(),
  isOverdue: z.boolean(),
  daysUntilDue: z.number(),
});

export const RecentNoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  preview: z.string(),
  tags: z.array(z.string()),
  lastEditedAt: z.date(),
  wordCount: z.number().min(0),
});

export const GoalProgressSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  deadline: z.date().optional(),
  progressPercentage: z.number().min(0).max(100),
  relatedTasksCount: z.number().min(0),
  completedTasksCount: z.number().min(0),
  isOverdue: z.boolean(),
});

export const HabitStreakSchema = z.object({
  id: z.string(),
  name: z.string(),
  currentStreak: z.number().min(0),
  bestStreak: z.number().min(0),
  frequency: z.string(),
  lastCompleted: z.date().optional(),
  completionRate: z.number().min(0).max(100),
});

export const FinanceSummarySchema = z.object({
  thisMonthIncome: z.number(),
  thisMonthExpenses: z.number(),
  thisMonthNet: z.number(),
  lastMonthIncome: z.number(),
  lastMonthExpenses: z.number(),
  lastMonthNet: z.number(),
  incomeChange: z.number(),
  expenseChange: z.number(),
  topExpenseCategories: z.array(
    z.object({
      category: z.string(),
      amount: z.number(),
      percentage: z.number().min(0).max(100),
    })
  ),
  recentTransactions: z.array(
    z.object({
      id: z.string(),
      date: z.date(),
      amount: z.number(),
      type: z.enum(["income", "expense"]),
      category: z.string(),
      note: z.string().optional(),
    })
  ),
});

export const WorkspaceStatsSchema = z.object({
  totalDatabases: z.number().min(0),
  totalRecords: z.number().min(0),
  totalViews: z.number().min(0),
  storageUsed: z.number().min(0),
  storageLimit: z.number().min(0),
  activeMembers: z.number().min(0),
  lastActivityAt: z.date(),
});

export const RecentlyVisitedItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal("page"),
  preview: z.string().optional(),
  route: z.string(),
  lastVisitedAt: z.date(),
  icon: z.string().optional(),
  color: z.string().optional(),
  moduleType: z.string(),
});

export const DashboardOverviewSchema = z.object({
  quickStats: QuickStatsSchema,
  recentActivity: z.array(ActivityFeedItemSchema),
  upcomingTasks: z.array(UpcomingTaskSchema),
  recentNotes: z.array(RecentNoteSchema),
  goalProgress: z.array(GoalProgressSchema),
  habitStreaks: z.array(HabitStreakSchema),
  financeSummary: FinanceSummarySchema,
  workspaceStats: WorkspaceStatsSchema,
  recentlyVisited: z.array(RecentlyVisitedItemSchema),
});

// Query schema
export const DashboardQuerySchema = z.object({
  workspaceId: z.string().optional(),
  period: z.enum(["day", "week", "month", "year"]).default("week"),
  includeActivity: z.coerce.boolean().default(true),
  includeStats: z.coerce.boolean().default(true),
  includeTrends: z.coerce.boolean().default(false),
  activityLimit: z.coerce.number().min(1).max(50).default(10),
  upcomingTasksLimit: z.coerce.number().min(1).max(20).default(5),
  recentNotesLimit: z.coerce.number().min(1).max(20).default(5),
});

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
