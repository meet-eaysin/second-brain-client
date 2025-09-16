// Calendar Types
export enum CalendarType {
    PERSONAL = 'PERSONAL',
    TEAM = 'TEAM',
    PROJECT = 'PROJECT',
    EXTERNAL = 'EXTERNAL',
    SYSTEM = 'SYSTEM',
}

export enum CalendarVisibility {
    PRIVATE = 'PRIVATE',
    SHARED = 'SHARED',
    PUBLIC = 'PUBLIC',
}

export interface Calendar {
    id: string;
    name: string;
    description?: string;
    type: CalendarType;
    visibility: CalendarVisibility;
    color: string;
    icon?: string;
    isActive: boolean;
    isDefault: boolean;
    sortOrder: number;
    ownerId: string;
    settings: {
        defaultView?: 'month' | 'week' | 'day' | 'agenda' | 'timeline';
        weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        workingHours?: {
            start: string;
            end: string;
            days: number[];
        };
        timeZone?: string;
        defaultEventDuration?: number;
        allowOverlapping?: boolean;
        showWeekends?: boolean;
        showDeclinedEvents?: boolean;
        defaultReminders?: Array<{
            type: 'popup' | 'email' | 'sms';
            minutes: number;
        }>;
        syncEnabled?: boolean;
        syncInterval?: number;
        lastSyncAt?: string;
        eventDisplayMode?: 'full' | 'compact' | 'minimal';
        showEventTime?: boolean;
        showEventLocation?: boolean;
        customCss?: string;
    };
    externalConfig?: {
        provider?: 'google' | 'outlook' | 'icloud' | 'caldav' | 'ical';
        externalId?: string;
        syncToken?: string;
        webhookUrl?: string;
        credentials?: any;
        lastSyncAt?: string;
        syncErrors?: Array<{
            timestamp: string;
            error: string;
            resolved: boolean;
        }>;
    };
    teamSettings?: {
        allowEventCreation?: boolean;
        allowEventEditing?: boolean;
        allowEventDeletion?: boolean;
        requireApproval?: boolean;
        moderators?: string[];
        autoAcceptInvites?: boolean;
        defaultEventVisibility?: 'public' | 'private';
    };
    integrations?: CalendarIntegration[];
    permissions?: CalendarPermission[];
    createdAt: string;
    updatedAt: string;
}

// Event Types
export enum EventStatus {
    CONFIRMED = 'CONFIRMED',
    TENTATIVE = 'TENTATIVE',
    CANCELLED = 'CANCELLED',
}

export enum EventVisibility {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
    CONFIDENTIAL = 'CONFIDENTIAL',
}

export enum EventBusyStatus {
    BUSY = 'BUSY',
    FREE = 'FREE',
    TENTATIVE = 'TENTATIVE',
    OUT_OF_OFFICE = 'OUT_OF_OFFICE',
}

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    location?: string;
    startTime: string;
    endTime: string;
    isAllDay: boolean;
    status: EventStatus;
    visibility: EventVisibility;
    busyStatus: EventBusyStatus;
    color?: string;
    priority?: number;
    calendarId: string;
    createdById: string;
    externalId?: string;
    externalProvider?: string;
    lastSyncAt?: string;
    isRecurring: boolean;
    recurringEventId?: string;
    recurrenceRule?: {
        frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
        interval?: number;
        count?: number;
        until?: string;
        byDay?: string[];
        byMonthDay?: number[];
        byMonth?: number[];
        exceptions?: string[];
    };
    metadata?: {
        meetingUrl?: string;
        meetingId?: string;
        meetingPassword?: string;
        meetingProvider?: 'zoom' | 'teams' | 'meet' | 'webex' | 'custom';
        attachments?: Array<{
            id: string;
            name: string;
            url: string;
            type: string;
            size: number;
        }>;
        customFields?: Record<string, any>;
        integrationData?: Record<string, any>;
        displaySettings?: {
            showInMiniCalendar?: boolean;
            highlightColor?: string;
            icon?: string;
        };
    };
    calendar?: Calendar;
    reminders?: CalendarEventReminder[];
    attendees?: CalendarEventAttendee[];
    createdAt: string;
    updatedAt: string;
}

// Reminder Types
export enum ReminderType {
    POPUP = 'POPUP',
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    PUSH = 'PUSH',
    WEBHOOK = 'WEBHOOK',
}

export enum ReminderStatus {
    PENDING = 'PENDING',
    SENT = 'SENT',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export interface CalendarEventReminder {
    id: string;
    eventId: string;
    userId?: string;
    type: ReminderType;
    minutesBefore: number;
    triggerAt: string;
    status: ReminderStatus;
    message?: string;
    config?: {
        emailTemplate?: string;
        emailSubject?: string;
        smsTemplate?: string;
        phoneNumber?: string;
        pushTitle?: string;
        pushBody?: string;
        pushIcon?: string;
        pushActions?: Array<{
            action: string;
            title: string;
            icon?: string;
        }>;
        webhookUrl?: string;
        webhookMethod?: 'GET' | 'POST';
        webhookHeaders?: Record<string, string>;
        webhookPayload?: Record<string, any>;
        popupDuration?: number;
        popupSound?: boolean;
        popupPersistent?: boolean;
    };
    sentAt?: string;
    errorMessage?: string;
    retryCount: number;
    nextRetryAt?: string;
    createdAt: string;
    updatedAt: string;
}

// Attendee Types
export enum AttendeeStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
    TENTATIVE = 'TENTATIVE',
    NEEDS_ACTION = 'NEEDS_ACTION',
}

export enum AttendeeRole {
    ORGANIZER = 'ORGANIZER',
    REQUIRED = 'REQUIRED',
    OPTIONAL = 'OPTIONAL',
    RESOURCE = 'RESOURCE',
}

export interface CalendarEventAttendee {
    id: string;
    eventId: string;
    userId?: string;
    name?: string;
    email: string;
    status: AttendeeStatus;
    role: AttendeeRole;
    comment?: string;
    sendInvitation: boolean;
    sendUpdates: boolean;
    externalId?: string;
    externalData?: {
        provider?: string;
        originalEmail?: string;
        displayName?: string;
        photoUrl?: string;
        organizationName?: string;
        title?: string;
    };
    respondedAt?: string;
    invitationSentAt?: string;
    lastReminderSentAt?: string;
    availability?: {
        busyTimes?: Array<{
            start: string;
            end: string;
        }>;
        timeZone?: string;
        lastChecked?: string;
    };
    createdAt: string;
    updatedAt: string;
}

// Integration Types
export enum IntegrationProvider {
    GOOGLE = 'GOOGLE',
    OUTLOOK = 'OUTLOOK',
    ICLOUD = 'ICLOUD',
    CALDAV = 'CALDAV',
    ICAL = 'ICAL',
    EXCHANGE = 'EXCHANGE',
    ZIMBRA = 'ZIMBRA',
}

export enum IntegrationStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ERROR = 'ERROR',
    EXPIRED = 'EXPIRED',
    REVOKED = 'REVOKED',
}

export enum SyncDirection {
    IMPORT_ONLY = 'IMPORT_ONLY',
    EXPORT_ONLY = 'EXPORT_ONLY',
    BIDIRECTIONAL = 'BIDIRECTIONAL',
}

export interface CalendarIntegration {
    id: string;
    calendarId: string;
    userId: string;
    name: string;
    provider: IntegrationProvider;
    status: IntegrationStatus;
    syncDirection: SyncDirection;
    externalCalendarId: string;
    externalCalendarName?: string;
    credentials?: any;
    syncConfig?: any;
    lastSyncAt?: string;
    nextSyncAt?: string;
    syncToken?: string;
    syncStats?: {
        totalEvents?: number;
        eventsCreated?: number;
        eventsUpdated?: number;
        eventsDeleted?: number;
        lastSyncDuration?: number;
        errorCount?: number;
        lastError?: string;
        lastErrorAt?: string;
    };
    webhookConfig?: any;
    errors?: Array<{
        timestamp: string;
        type: 'auth' | 'sync' | 'webhook' | 'network' | 'other';
        message: string;
        details?: any;
        resolved?: boolean;
        resolvedAt?: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

// Permission Types
export enum PermissionLevel {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    CONTRIBUTOR = 'CONTRIBUTOR',
    VIEWER = 'VIEWER',
}

export enum PermissionStatus {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING',
    DECLINED = 'DECLINED',
    REVOKED = 'REVOKED',
    EXPIRED = 'EXPIRED',
}

export interface CalendarPermission {
    id: string;
    calendarId: string;
    userId: string;
    level: PermissionLevel;
    status: PermissionStatus;
    permissions?: Record<string, boolean>;
    expiresAt?: string;
    timeRestrictions?: any;
    invitedBy?: string;
    invitedAt?: string;
    acceptedAt?: string;
    invitationMessage?: string;
    responseMessage?: string;
    notificationSettings?: any;
    lastAccessedAt?: string;
    accessCount: number;
    usageStats?: any;
    createdAt: string;
    updatedAt: string;
}

// Request/Response Types
export interface CreateCalendarRequest {
    name: string;
    description?: string;
    type?: CalendarType;
    visibility?: CalendarVisibility;
    color?: string;
    icon?: string;
    isDefault?: boolean;
    settings?: Calendar['settings'];
    teamSettings?: Calendar['teamSettings'];
}

export interface UpdateCalendarRequest extends Partial<CreateCalendarRequest> {}

export interface CreateEventRequest {
    calendarId: string;
    title: string;
    description?: string;
    location?: string;
    startTime: string;
    endTime: string;
    isAllDay?: boolean;
    status?: EventStatus;
    visibility?: EventVisibility;
    color?: string;
    priority?: number;
    recurrenceRule?: CalendarEvent['recurrenceRule'];
    reminders?: Array<{
        type: ReminderType;
        minutesBefore: number;
        message?: string;
        config?: any;
    }>;
    attendees?: Array<{
        email: string;
        name?: string;
        role?: AttendeeRole;
    }>;
    metadata?: CalendarEvent['metadata'];
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

export interface CalendarEventsQuery {
    startDate: string;
    endDate: string;
    calendarIds?: string[];
    status?: EventStatus[];
    includeRecurring?: boolean;
    includeDeclined?: boolean;
}
