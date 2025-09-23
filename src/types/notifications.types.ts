// Notification types matching backend
export enum ENotificationType {
  TASK_DUE = "task_due",
  TASK_OVERDUE = "task_overdue",
  TASK_ASSIGNED = "task_assigned",
  TASK_COMPLETED = "task_completed",
  MENTION = "mention",
  COMMENT = "comment",
  GOAL_DEADLINE = "goal_deadline",
  HABIT_REMINDER = "habit_reminder",
  PROJECT_UPDATE = "project_update",
  FINANCE_BUDGET = "finance_budget",
  SYSTEM_UPDATE = "system_update",
  COLLABORATION = "collaboration",
}

// Notification priority
export enum ENotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

// Notification delivery methods
export enum ENotificationMethod {
  IN_APP = "in_app",
  EMAIL = "email",
  PUSH = "push",
  SMS = "sms",
}

// Notification status
export enum ENotificationStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed",
}

// Core notification interface
export interface Notification {
  readonly id: string;
  readonly type: ENotificationType;
  readonly priority: ENotificationPriority;
  readonly title: string;
  readonly message: string;
  readonly entityId?: string;
  readonly entityType?: string;
  readonly metadata: Record<string, unknown>;
  readonly status: ENotificationStatus;
  readonly scheduledFor?: Date;
  readonly sentAt?: Date;
  readonly readAt?: Date;
  readonly createdAt: Date;
  readonly isRead: boolean;
  readonly isOverdue: boolean;
  readonly timeAgo: string;
}

// Notification query options
export interface NotificationQueryParams {
  readonly userId?: string;
  readonly workspaceId?: string;
  readonly type?: ENotificationType;
  readonly status?: ENotificationStatus;
  readonly priority?: ENotificationPriority;
  readonly unreadOnly?: boolean;
  readonly entityId?: string;
  readonly entityType?: string;
  readonly dateRange?: {
    readonly start: Date;
    readonly end: Date;
  };
  readonly limit?: number;
  readonly offset?: number;
  readonly sortBy?: "createdAt" | "priority" | "scheduledFor";
  readonly sortOrder?: "asc" | "desc";
}

// Notification list response
export interface NotificationsResponse {
  readonly notifications: readonly Notification[];
  readonly total: number;
  readonly unreadCount: number;
  readonly page: number;
  readonly limit: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

// Notification stats
export interface NotificationStats {
  readonly total: number;
  readonly unread: number;
  readonly byType: Record<ENotificationType, number>;
  readonly byPriority: Record<ENotificationPriority, number>;
  readonly byStatus: Record<ENotificationStatus, number>;
  readonly todayCount: number;
  readonly weekCount: number;
}

// Notification preferences
export interface NotificationPreferences {
  readonly userId: string;
  readonly workspaceId: string;
  readonly preferences: Record<
    ENotificationType,
    {
      readonly enabled: boolean;
      readonly methods: readonly ENotificationMethod[];
      readonly quietHours?: {
        readonly start: string;
        readonly end: string;
        readonly timezone: string;
      };
      readonly frequency?: "immediate" | "hourly" | "daily" | "weekly";
    }
  >;
  readonly globalSettings: {
    readonly enabled: boolean;
    readonly quietHours?: {
      readonly start: string;
      readonly end: string;
      readonly timezone: string;
    };
    readonly weekendNotifications: boolean;
    readonly emailDigest: boolean;
    readonly digestFrequency: "daily" | "weekly";
  };
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Device token types
export interface DeviceTokenData {
  type: "fcm" | "webpush";
  token?: string;
  endpoint?: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
}

export interface DeviceTokensResponse {
  fcmTokens: number;
  webPushSubscriptions: number;
  hasTokens: boolean;
}
