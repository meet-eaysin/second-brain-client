import { z } from "zod";
import type { IActivity } from "@/modules/home/types/system.types.ts";

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
  metadata?: Record<string, unknown>;
}

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
  period?: string;
  includeActivity?: boolean;
  includeStats?: boolean;
  includeTrends?: boolean;
  activityLimit?: number;
  upcomingTasksLimit?: number;
  recentNotesLimit?: number;
}

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
