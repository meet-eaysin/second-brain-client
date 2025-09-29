import type { CalendarEventsQuery } from "@/modules/calendar/types/calendar.types.ts";
import type {
  IDashboardQueryParams,
  IActivityQueryOptions,
  IAnalyticsQueryParams,
} from "@/modules/home/types";
import type {
  IParaQueryParams,
  EParaStatus,
  EParaPriority,
} from "@/modules/para/types/para.types";
import type {
  UserQueryParams,
  UserStatsQueryParams,
} from "@/modules/users/types/users.types";
import type { SearchWorkspacesQuery } from "@/modules/workspaces/types/workspaces.types";
import type { NotificationQueryParams } from "@/modules/notifications/types/notifications.types";
import type { TemplateSearchParams } from "@/modules/templates/services/templates-api.ts";

export const CALENDAR_KEYS = {
  all: ["calendars"] as const,
  lists: () => [...CALENDAR_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...CALENDAR_KEYS.lists(), filters] as const,
  details: () => [...CALENDAR_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CALENDAR_KEYS.details(), id] as const,
  events: () => [...CALENDAR_KEYS.all, "events"] as const,
  eventsList: (filters: CalendarEventsQuery) =>
    [...CALENDAR_KEYS.events(), filters] as const,
  eventDetail: (id: string) => [...CALENDAR_KEYS.events(), id] as const,
  upcoming: () => [...CALENDAR_KEYS.events(), "upcoming"] as const,
  today: () => [...CALENDAR_KEYS.events(), "today"] as const,
  stats: () => [...CALENDAR_KEYS.all, "stats"] as const,
  config: () => [...CALENDAR_KEYS.all, "config"] as const,
  preferences: () => [...CALENDAR_KEYS.all, "preferences"] as const,
  connections: () => [...CALENDAR_KEYS.all, "connections"] as const,
  connectionDetail: (id: string) =>
    [...CALENDAR_KEYS.connections(), id] as const,
  providers: () => [...CALENDAR_KEYS.connections(), "providers"] as const,
};

export const SYSTEM_KEYS = {
  all: ["system"] as const,
  activities: (params?: IActivityQueryOptions) =>
    [...SYSTEM_KEYS.all, "activities", params] as const,
  activityFeed: (params?: { limit?: number; workspaceId?: string }) =>
    [...SYSTEM_KEYS.all, "activity-feed", params] as const,
  activitySummary: () => [...SYSTEM_KEYS.all, "activity-summary"] as const,
  activityAnalytics: (params?: IActivityQueryOptions) =>
    [...SYSTEM_KEYS.all, "activity-analytics", params] as const,
  activityById: (id: string) => [...SYSTEM_KEYS.all, "activity", id] as const,
  workspaceActivityOverview: () =>
    [...SYSTEM_KEYS.all, "workspace-activity-overview"] as const,
  auditTrail: (params?: Record<string, unknown>) =>
    [...SYSTEM_KEYS.all, "audit-trail", params] as const,
  securityEvents: (params?: Record<string, unknown>) =>
    [...SYSTEM_KEYS.all, "security-events", params] as const,
  complianceReport: (params?: { period?: string }) =>
    [...SYSTEM_KEYS.all, "compliance-report", params] as const,
  activityHeatmap: (params?: { period?: string }) =>
    [...SYSTEM_KEYS.all, "activity-heatmap", params] as const,
  analyticsDashboard: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "analytics-dashboard", params] as const,
  analyticsSummary: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "analytics-summary", params] as const,
  analyticsInsights: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "analytics-insights", params] as const,
  productivityAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "productivity-analytics", params] as const,
  taskAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "task-analytics", params] as const,
  timeTrackingAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "time-tracking-analytics", params] as const,
  goalAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "goal-analytics", params] as const,
  financeAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "finance-analytics", params] as const,
  contentAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "content-analytics", params] as const,
  workspaceAnalytics: (params?: IAnalyticsQueryParams) =>
    [...SYSTEM_KEYS.all, "workspace-analytics", params] as const,
};

export const DASHBOARD_KEYS = {
  all: ["dashboard"] as const,
  overview: (params?: IDashboardQueryParams) =>
    [...DASHBOARD_KEYS.all, "overview", params] as const,
  stats: (params?: IDashboardQueryParams) =>
    [...DASHBOARD_KEYS.all, "stats", params] as const,
  activity: (params?: { limit?: number }) =>
    [...DASHBOARD_KEYS.all, "activity", params] as const,
  quickStats: () => [...DASHBOARD_KEYS.all, "quick-stats"] as const,
  upcomingTasks: (params?: { limit?: number }) =>
    [...DASHBOARD_KEYS.all, "upcoming-tasks", params] as const,
  recentNotes: (params?: { limit?: number }) =>
    [...DASHBOARD_KEYS.all, "recent-notes", params] as const,
  goalProgress: () => [...DASHBOARD_KEYS.all, "goal-progress"] as const,
  habitStreaks: () => [...DASHBOARD_KEYS.all, "habit-streaks"] as const,
  financeSummary: (params?: { period?: string }) =>
    [...DASHBOARD_KEYS.all, "finance-summary", params] as const,
  upcomingEvents: (params?: { limit?: number }) =>
    [...DASHBOARD_KEYS.all, "upcoming-events", params] as const,
  recentlyVisited: (limit: number) =>
    [...DASHBOARD_KEYS.all, "recently-visited", limit] as const,
  systemActivity: () => [...SYSTEM_KEYS.all, "activity"] as const,
  feed: (workspaceId: string, limit: number) =>
    [...DASHBOARD_KEYS.systemActivity(), "feed", workspaceId, limit] as const,
};

export const PARA_KEYS = {
  all: ["para"] as const,
  items: (params?: IParaQueryParams) =>
    [...PARA_KEYS.all, "items", params] as const,
  item: (id: string) => [...PARA_KEYS.all, "item", id] as const,
  stats: (params?: IParaQueryParams) =>
    [...PARA_KEYS.all, "stats", params] as const,
  search: (query: string, params?: IParaQueryParams) =>
    [...PARA_KEYS.all, "search", query, params] as const,
  categories: {
    projects: (params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "categories", "projects", params] as const,
    areas: (params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "categories", "areas", params] as const,
    resources: (params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "categories", "resources", params] as const,
    archive: (params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "categories", "archive", params] as const,
  },
  analytics: {
    byStatus: (status: EParaStatus, params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "analytics", "status", status, params] as const,
    byPriority: (priority: EParaPriority, params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "analytics", "priority", priority, params] as const,
    reviewsOverdue: (params?: IParaQueryParams) =>
      [...PARA_KEYS.all, "analytics", "reviews-overdue", params] as const,
  },
};

export const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  list: (params?: UserQueryParams) => [...USER_KEYS.lists(), params] as const,
  details: () => [...USER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USER_KEYS.details(), id] as const,
  profile: () => [...USER_KEYS.all, "profile"] as const,
  stats: (params?: UserStatsQueryParams) =>
    [...USER_KEYS.all, "stats", params] as const,
};

export const PROFILE_KEYS = {
  all: ["profile"] as const,
  update: () => [...PROFILE_KEYS.all, "update"] as const,
  avatar: () => [...PROFILE_KEYS.all, "avatar"] as const,
};

export const WORKSPACE_KEYS = {
  all: ["workspaces"] as const,
  userWorkspaces: () => [...WORKSPACE_KEYS.all, "user"] as const,
  current: () => [...WORKSPACE_KEYS.all, "current"] as const,
  primary: () => [...WORKSPACE_KEYS.all, "primary"] as const,
  stats: () => [...WORKSPACE_KEYS.all, "stats"] as const,
  access: () => [...WORKSPACE_KEYS.all, "access"] as const,
  modules: () => [...WORKSPACE_KEYS.all, "modules"] as const,
  lists: () => [...WORKSPACE_KEYS.all, "lists"] as const,
  detail: (id: string) => [...WORKSPACE_KEYS.all, "detail", id] as const,
  public: () => [...WORKSPACE_KEYS.all, "public"] as const,
  search: (params: SearchWorkspacesQuery) =>
    [...WORKSPACE_KEYS.all, "search", params] as const,
  members: (workspaceId: string) =>
    [...WORKSPACE_KEYS.all, "members", workspaceId] as const,
  permissions: (workspaceId: string) =>
    [...WORKSPACE_KEYS.all, "permissions", workspaceId] as const,
  activity: (workspaceId: string) =>
    [...WORKSPACE_KEYS.all, "activity", workspaceId] as const,
};

export const SECOND_BRAIN_ANALYTICS_KEYS = {
  all: ["second-brain-analytics"] as const,
  productivity: (params?: IAnalyticsQueryParams) =>
    [...SECOND_BRAIN_ANALYTICS_KEYS.all, "productivity", params] as const,
  tasks: (params?: IAnalyticsQueryParams) =>
    [...SECOND_BRAIN_ANALYTICS_KEYS.all, "tasks", params] as const,
  timeTracking: (params?: IAnalyticsQueryParams) =>
    [...SECOND_BRAIN_ANALYTICS_KEYS.all, "time-tracking", params] as const,
  goals: (params?: IAnalyticsQueryParams) =>
    [...SECOND_BRAIN_ANALYTICS_KEYS.all, "goals", params] as const,
  finance: (params?: IAnalyticsQueryParams) =>
    [...SECOND_BRAIN_ANALYTICS_KEYS.all, "finance", params] as const,
  content: (params?: IAnalyticsQueryParams) =>
    [...SECOND_BRAIN_ANALYTICS_KEYS.all, "content", params] as const,
};

export const AUTH_KEYS = {
  user: ["auth", "user"] as const,
  login: ["auth", "login"] as const,
  register: ["auth", "register"] as const,
  googleLogin: ["auth", "google"] as const,
};

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_KEYS.all, "list"] as const,
  list: () => [...CATEGORY_KEYS.lists()] as const,
  details: () => [...CATEGORY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,
  withCounts: () => [...CATEGORY_KEYS.all, "withCounts"] as const,
};

export const DATABASE_KEYS = {
  all: ["databases"] as const,
  lists: () => [...DATABASE_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...DATABASE_KEYS.lists(), filters] as const,
  details: () => [...DATABASE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...DATABASE_KEYS.details(), id] as const,
  stats: (id: string) => [...DATABASE_KEYS.detail(id), "stats"] as const,
  properties: (databaseId: string) =>
    [...DATABASE_KEYS.detail(databaseId), "properties"] as const,
  property: (databaseId: string, propertyId: string) =>
    [...DATABASE_KEYS.properties(databaseId), propertyId] as const,
  records: (databaseId: string) =>
    [...DATABASE_KEYS.detail(databaseId), "records"] as const,
  record: (databaseId: string, recordId: string) =>
    [...DATABASE_KEYS.records(databaseId), recordId] as const,
  views: (databaseId: string) =>
    [...DATABASE_KEYS.detail(databaseId), "views"] as const,
  view: (databaseId: string, viewId: string) =>
    [...DATABASE_KEYS.views(databaseId), viewId] as const,
  relations: ["relations"] as const,
  relation: (id: string) => [...DATABASE_KEYS.relations, id] as const,
  relationConnections: (relationId: string) =>
    [...DATABASE_KEYS.relation(relationId), "connections"] as const,
  blocks: (databaseId: string, recordId: string) =>
    [...DATABASE_KEYS.record(databaseId, recordId), "blocks"] as const,
  block: (databaseId: string, recordId: string, blockId: string) =>
    [...DATABASE_KEYS.blocks(databaseId, recordId), blockId] as const,
};

export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  lists: () => [...NOTIFICATION_KEYS.all, "list"] as const,
  list: (params?: NotificationQueryParams) =>
    [...NOTIFICATION_KEYS.lists(), params] as const,
  details: () => [...NOTIFICATION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...NOTIFICATION_KEYS.details(), id] as const,
  unread: () => [...NOTIFICATION_KEYS.all, "unread"] as const,
  unreadCount: () => [...NOTIFICATION_KEYS.all, "unread-count"] as const,
  byType: (type: string) => [...NOTIFICATION_KEYS.all, "type", type] as const,
  recent: () => [...NOTIFICATION_KEYS.all, "recent"] as const,
  stats: () => [...NOTIFICATION_KEYS.all, "stats"] as const,
  devices: () => [...NOTIFICATION_KEYS.all, "devices"] as const,
};

export const TEMPLATE_KEYS = {
  all: ["templates"] as const,
  lists: () => [...TEMPLATE_KEYS.all, "list"] as const,
  list: (params: TemplateSearchParams) =>
    [...TEMPLATE_KEYS.lists(), params] as const,
  featured: () => [...TEMPLATE_KEYS.all, "featured"] as const,
  official: () => [...TEMPLATE_KEYS.all, "official"] as const,
  popular: () => [...TEMPLATE_KEYS.all, "popular"] as const,
  categories: () => [...TEMPLATE_KEYS.all, "categories"] as const,
  types: () => [...TEMPLATE_KEYS.all, "types"] as const,
  gallery: () => [...TEMPLATE_KEYS.all, "gallery"] as const,
  byCategory: (category: string) =>
    [...TEMPLATE_KEYS.all, "category", category] as const,
  byModule: (moduleType: string) =>
    [...TEMPLATE_KEYS.all, "module", moduleType] as const,
  details: () => [...TEMPLATE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...TEMPLATE_KEYS.details(), id] as const,
  userTemplates: () => [...TEMPLATE_KEYS.all, "user"] as const,
  userHistory: () => [...TEMPLATE_KEYS.all, "user", "history"] as const,
  suggestions: (databaseId: string) =>
    [...TEMPLATE_KEYS.all, "suggestions", databaseId] as const,
  analytics: (id: string) => [...TEMPLATE_KEYS.all, "analytics", id] as const,
};

export const WORKSPACE_DEPENDENT_QUERIES = [
  CALENDAR_KEYS.all,
  DASHBOARD_KEYS.all,
  SYSTEM_KEYS.all,
  PARA_KEYS.all,
  SECOND_BRAIN_ANALYTICS_KEYS.all,
  DATABASE_KEYS.all,
  NOTIFICATION_KEYS.all,
  CATEGORY_KEYS.all,
  ["tasks"],
  ["notes"],
  ["projects"],
  ["analytics"],
  ["second-brain"],
  ["people-database-view"],
  ["people-views"],
  ["notes-database-view"],
  ["notes-with-view"],
  ["recently-visited"],
  ["files"],
] as const;
