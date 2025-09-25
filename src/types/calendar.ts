// No external imports needed for calendar types

// Calendar Provider Types
export enum ECalendarProvider {
  INTERNAL = "internal",
  GOOGLE = "google",
  OUTLOOK = "outlook",
  APPLE = "apple",
  CALDAV = "caldav",
  EXCHANGE = "exchange",
  ICAL = "ical",
}

// Calendar Types
export enum ECalendarType {
  PERSONAL = "personal",
  WORK = "work",
  SHARED = "shared",
  PROJECT = "project",
  TEAM = "team",
  HOLIDAY = "holiday",
  BIRTHDAY = "birthday",
}

// Event Types
export enum EEventType {
  EVENT = "event",
  TASK = "task",
  MEETING = "meeting",
  REMINDER = "reminder",
  DEADLINE = "deadline",
  MILESTONE = "milestone",
  HABIT = "habit",
  GOAL_REVIEW = "goal_review",
  BREAK = "break",
  FOCUS_TIME = "focus_time",
  TRAVEL = "travel",
  APPOINTMENT = "appointment",
}

// Event Status
export enum EEventStatus {
  CONFIRMED = "confirmed",
  TENTATIVE = "tentative",
  CANCELLED = "cancelled",
  NEEDS_ACTION = "needs_action",
  COMPLETED = "completed",
  IN_PROGRESS = "in_progress",
}

// Event Visibility
export enum EEventVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
  CONFIDENTIAL = "confidential",
}

// Recurrence Frequency
export enum ERecurrenceFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
  HOURLY = "hourly",
}

// Calendar Access Level
export enum ECalendarAccessLevel {
  OWNER = "owner",
  EDITOR = "editor",
  VIEWER = "viewer",
  FREE_BUSY = "free_busy",
}

// Calendar Interface
export interface Calendar {
  id: string;
  name: string;
  description?: string;
  color: string;
  provider: ECalendarProvider;
  type: ECalendarType;
  externalId?: string;
  externalData?: Record<string, unknown>;
  ownerId: string;
  isDefault: boolean;
  isVisible: boolean;
  accessLevel: ECalendarAccessLevel;
  syncEnabled: boolean;
  lastSyncAt?: Date;
  syncToken?: string;
  timeZone: string;
  metadata?: {
    source?: string;
    tags?: string[];
    category?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Calendar Event Interface
export interface CalendarEvent {
  id: string;
  calendarId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  timeZone: string;
  type: EEventType;
  status: EEventStatus;
  visibility: EEventVisibility;
  externalId?: string;
  externalData?: Record<string, unknown>;
  recurrence?: RecurrenceRule;
  recurrenceId?: string;
  organizer?: EventOrganizer;
  attendees?: EventAttendee[];
  reminders?: EventReminder[];
  relatedEntityType?: string;
  relatedEntityId?: string;
  metadata?: {
    source?: string;
    tags?: string[];
    priority?: "low" | "medium" | "high" | "urgent";
    category?: string;
    url?: string;
    attachments?: EventAttachment[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// Recurrence Rule
export interface RecurrenceRule {
  frequency: ERecurrenceFrequency;
  interval: number;
  count?: number;
  until?: Date;
  byDay?: string[];
  byMonthDay?: number[];
  byMonth?: number[];
  bySetPos?: number[];
  weekStart?: string;
  exceptions?: Date[];
}

// Event Organizer
export interface EventOrganizer {
  email: string;
  name?: string;
  userId?: string;
}

// Event Attendee
export interface EventAttendee {
  email: string;
  name?: string;
  userId?: string;
  status: "accepted" | "declined" | "tentative" | "needs_action";
  role: "required" | "optional" | "resource";
  responseTime?: Date;
}

// Event Reminder
export interface EventReminder {
  method: "email" | "popup" | "sms" | "push";
  minutes: number;
}

// Event Attachment
export interface EventAttachment {
  title: string;
  url: string;
  mimeType?: string;
  size?: number;
}

// Calendar Connection (External)
export interface CalendarConnection {
  id: string;
  userId: string;
  provider: ECalendarProvider;
  accountEmail: string;
  accountName?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  isActive: boolean;
  syncEnabled: boolean;
  syncFrequency: number;
  lastSyncAt?: Date;
  syncSettings: {
    importEvents: boolean;
    exportEvents: boolean;
    bidirectionalSync: boolean;
    syncPastDays: number;
    syncFutureDays: number;
    conflictResolution: "local" | "remote" | "manual";
  };
  lastError?: string;
  errorCount: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Calendar View Configuration
export interface CalendarView {
  type: "month" | "week" | "day" | "agenda" | "year";
  startDate: Date;
  endDate: Date;
  timeZone: string;
  calendarIds?: string[];
  eventTypes?: EEventType[];
  statuses?: EEventStatus[];
  showWeekends: boolean;
  showAllDay: boolean;
  showDeclined: boolean;
  groupBy?: "calendar" | "type" | "status";
}

// Calendar Event Query Options
export interface CalendarEventsQuery {
  calendarIds?: string[];
  startDate?: Date;
  endDate?: Date;
  eventTypes?: EEventType[];
  statuses?: EEventStatus[];
  searchQuery?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  includeRecurring?: boolean;
  limit?: number;
  offset?: number;
}

// Calendar Statistics
export interface CalendarStats {
  totalEvents: number;
  upcomingEvents: number;
  todayEvents: number;
  weekEvents: number;
  monthEvents: number;
  byType: Record<EEventType, number>;
  byStatus: Record<EEventStatus, number>;
  byCalendar: Record<string, number>;
  busyHours: {
    date: string;
    hours: number;
  }[];
  productivity: {
    focusTime: number;
    meetingTime: number;
    breakTime: number;
    freeTime: number;
  };
}

// Request/Response Types
export interface CreateCalendarRequest {
  name: string;
  description?: string;
  color: string;
  type: ECalendarType;
  timeZone: string;
  isDefault?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdateCalendarRequest {
  name?: string;
  description?: string;
  color?: string;
  isVisible?: boolean;
  timeZone?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateEventRequest {
  calendarId: string;
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  isAllDay?: boolean;
  timeZone?: string;
  type?: EEventType;
  status?: EEventStatus;
  visibility?: EEventVisibility;
  recurrence?: RecurrenceRule;
  attendees?: Omit<EventAttendee, "responseTime">[];
  reminders?: EventReminder[];
  relatedEntityType?: string;
  relatedEntityId?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  location?: string;
  startTime?: Date;
  endTime?: Date;
  isAllDay?: boolean;
  status?: EEventStatus;
  visibility?: EEventVisibility;
  attendees?: Omit<EventAttendee, "responseTime">[];
  reminders?: EventReminder[];
  metadata?: Record<string, unknown>;
}

export interface ConnectCalendarRequest {
  provider: ECalendarProvider;
  authCode?: string;
  accessToken?: string;
  refreshToken?: string;
  accountEmail: string;
  syncSettings?: Partial<CalendarConnection["syncSettings"]>;
}

// Response Types
export interface CalendarResponse {
  calendars: Calendar[];
  total: number;
}

export interface EventsResponse {
  events: CalendarEvent[];
  total: number;
  query: CalendarEventsQuery;
}

export interface CalendarViewResponse {
  events: CalendarEvent[];
  calendars: Calendar[];
  view: CalendarView;
}

export interface UpcomingEventsResponse {
  events: CalendarEvent[];
  period: {
    startDate: Date;
    endDate: Date;
    days: number;
  };
}

export interface TodayEventsResponse {
  events: CalendarEvent[];
  date: string;
  count: number;
}

export interface BusyTimesResponse {
  busyTimes: {
    start: Date;
    end: Date;
    title: string;
    eventId: string;
    calendarId: string;
  }[];
  period: {
    startDate: Date;
    endDate: Date;
  };
  count: number;
}

// Calendar Provider Info
export interface CalendarProvider {
  id: ECalendarProvider;
  name: string;
  description: string;
  authType: "oauth2" | "basic" | "caldav" | "none";
  features: string[];
  setupInstructions: string;
}

// Connection Test Response
export interface ConnectionTestResponse {
  status: "connected" | "error";
  error?: string;
  calendarsFound?: number;
  provider: ECalendarProvider;
  accountEmail: string;
}

// Connection Logs Response
export interface ConnectionLogsResponse {
  logs: CalendarSyncLog[];
  connectionId: string;
  total: number;
}

// Sync Log
export interface CalendarSyncLog {
  id: string;
  connectionId: string;
  syncType: "full" | "incremental" | "manual";
  status: "success" | "error" | "partial";
  startedAt: Date;
  completedAt?: Date;
  eventsProcessed: number;
  eventsCreated: number;
  eventsUpdated: number;
  eventsDeleted: number;
  error?: string;
  metadata: Record<string, unknown>;
}

// Connection Stats
export interface CalendarConnectionStats {
  totalConnections: number;
  activeConnections: number;
  syncEnabledConnections: number;
  connectionsByProvider: Record<string, number>;
  recentSyncActivity: {
    connectionId: string;
    status: string;
    startedAt: Date;
    completedAt?: Date;
    eventsProcessed: number;
  }[];
}
