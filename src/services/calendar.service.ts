import { api } from './api';
import type { 
    Calendar, 
    CalendarEvent, 
    CalendarIntegration,
    CalendarPermission,
    CreateCalendarRequest,
    CreateEventRequest,
    UpdateCalendarRequest,
    UpdateEventRequest,
    CalendarEventsQuery,
    IntegrationProvider,
} from '@/types/calendar';

export interface CalendarSyncResult {
    success: boolean;
    eventsCreated: number;
    eventsUpdated: number;
    eventsDeleted: number;
    errors: string[];
    duration: number;
}

export interface ExternalCalendarAuth {
    provider: IntegrationProvider;
    authUrl: string;
    state: string;
}

class CalendarService {
    // Calendar Management
    async getCalendars(): Promise<Calendar[]> {
        const response = await api.get('/api/calendars');
        return response.data;
    }

    async getCalendar(calendarId: string): Promise<Calendar> {
        const response = await api.get(`/api/calendars/${calendarId}`);
        return response.data;
    }

    async createCalendar(data: CreateCalendarRequest): Promise<Calendar> {
        const response = await api.post('/api/calendars', data);
        return response.data;
    }

    async updateCalendar(calendarId: string, data: UpdateCalendarRequest): Promise<Calendar> {
        const response = await api.put(`/api/calendars/${calendarId}`, data);
        return response.data;
    }

    async deleteCalendar(calendarId: string): Promise<void> {
        await api.delete(`/api/calendars/${calendarId}`);
    }

    // Event Management
    async getEvents(query: CalendarEventsQuery): Promise<CalendarEvent[]> {
        const response = await api.get('/api/calendar-events', { params: query });
        return response.data;
    }

    async getEvent(eventId: string): Promise<CalendarEvent> {
        const response = await api.get(`/api/calendar-events/${eventId}`);
        return response.data;
    }

    async createEvent(data: CreateEventRequest): Promise<CalendarEvent> {
        const response = await api.post('/api/calendar-events', data);
        return response.data;
    }

    async updateEvent(eventId: string, data: UpdateEventRequest): Promise<CalendarEvent> {
        const response = await api.put(`/api/calendar-events/${eventId}`, data);
        return response.data;
    }

    async deleteEvent(eventId: string): Promise<void> {
        await api.delete(`/api/calendar-events/${eventId}`);
    }

    async duplicateEvent(eventId: string, newStartTime?: Date): Promise<CalendarEvent> {
        const response = await api.post(`/api/calendar-events/${eventId}/duplicate`, {
            newStartTime,
        });
        return response.data;
    }

    // Recurring Events
    async createRecurringEvent(data: CreateEventRequest & {
        recurrenceRule: {
            frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
            interval?: number;
            count?: number;
            until?: string;
            byDay?: string[];
            byMonthDay?: number[];
            byMonth?: number[];
        };
    }): Promise<CalendarEvent> {
        const response = await api.post('/api/calendar-events/recurring', data);
        return response.data;
    }

    async updateRecurringEvent(
        eventId: string,
        data: UpdateEventRequest,
        updateType: 'this' | 'following' | 'all' = 'this'
    ): Promise<CalendarEvent> {
        const response = await api.put(`/api/calendar-events/${eventId}/recurring`, {
            ...data,
            updateType,
        });
        return response.data;
    }

    async deleteRecurringEvent(
        eventId: string,
        deleteType: 'this' | 'following' | 'all' = 'this'
    ): Promise<void> {
        await api.delete(`/api/calendar-events/${eventId}/recurring`, {
            params: { deleteType },
        });
    }

    // Calendar Sharing & Permissions
    async shareCalendar(
        calendarId: string,
        email: string,
        level: 'VIEWER' | 'CONTRIBUTOR' | 'EDITOR' | 'ADMIN',
        message?: string
    ): Promise<CalendarPermission> {
        const response = await api.post(`/api/calendars/${calendarId}/share`, {
            email,
            level,
            message,
        });
        return response.data;
    }

    async updateCalendarPermission(
        calendarId: string,
        permissionId: string,
        level: string,
        permissions?: any
    ): Promise<CalendarPermission> {
        const response = await api.put(`/api/calendars/${calendarId}/permissions/${permissionId}`, {
            level,
            permissions,
        });
        return response.data;
    }

    async revokeCalendarAccess(calendarId: string, permissionId: string): Promise<void> {
        await api.delete(`/api/calendars/${calendarId}/permissions/${permissionId}`);
    }

    async getCalendarPermissions(calendarId: string): Promise<CalendarPermission[]> {
        const response = await api.get(`/api/calendars/${calendarId}/permissions`);
        return response.data;
    }

    // External Calendar Integration
    async getIntegrationAuthUrl(provider: IntegrationProvider): Promise<ExternalCalendarAuth> {
        const response = await api.get(`/api/calendar-integrations/auth/${provider}`);
        return response.data;
    }

    async connectExternalCalendar(
        calendarId: string,
        provider: IntegrationProvider,
        authCode: string
    ): Promise<CalendarIntegration> {
        const response = await api.post(`/api/calendar-integrations/connect`, {
            calendarId,
            provider,
            authCode,
        });
        return response.data;
    }

    async connectICalFeed(
        calendarId: string,
        feedUrl: string,
        name: string
    ): Promise<CalendarIntegration> {
        const response = await api.post(`/api/calendar-integrations/ical`, {
            calendarId,
            feedUrl,
            name,
        });
        return response.data;
    }

    async getCalendarIntegrations(calendarId: string): Promise<CalendarIntegration[]> {
        const response = await api.get(`/api/calendars/${calendarId}/integrations`);
        return response.data;
    }

    async syncCalendarIntegration(integrationId: string): Promise<CalendarSyncResult> {
        const response = await api.post(`/api/calendar-integrations/${integrationId}/sync`);
        return response.data;
    }

    async updateIntegrationSettings(
        integrationId: string,
        settings: {
            syncDirection?: 'IMPORT_ONLY' | 'EXPORT_ONLY' | 'BIDIRECTIONAL';
            syncConfig?: any;
            webhookConfig?: any;
        }
    ): Promise<CalendarIntegration> {
        const response = await api.put(`/api/calendar-integrations/${integrationId}`, settings);
        return response.data;
    }

    async disconnectIntegration(integrationId: string): Promise<void> {
        await api.delete(`/api/calendar-integrations/${integrationId}`);
    }

    // Reminders & Notifications
    async createEventReminder(
        eventId: string,
        reminder: {
            type: 'POPUP' | 'EMAIL' | 'SMS' | 'PUSH';
            minutesBefore: number;
            message?: string;
            config?: any;
        }
    ): Promise<void> {
        await api.post(`/api/calendar-events/${eventId}/reminders`, reminder);
    }

    async updateEventReminders(
        eventId: string,
        reminders: Array<{
            type: 'POPUP' | 'EMAIL' | 'SMS' | 'PUSH';
            minutesBefore: number;
            message?: string;
            config?: any;
        }>
    ): Promise<void> {
        await api.put(`/api/calendar-events/${eventId}/reminders`, { reminders });
    }

    async snoozeReminder(reminderId: string, snoozeMinutes: number = 5): Promise<void> {
        await api.post(`/api/calendar-reminders/${reminderId}/snooze`, { snoozeMinutes });
    }

    async dismissReminder(reminderId: string): Promise<void> {
        await api.post(`/api/calendar-reminders/${reminderId}/dismiss`);
    }

    // Calendar Export & Import
    async exportCalendar(
        calendarId: string,
        format: 'ical' | 'csv' | 'json' = 'ical',
        dateRange?: { start: Date; end: Date }
    ): Promise<Blob> {
        const response = await api.get(`/api/calendars/${calendarId}/export`, {
            params: { format, ...dateRange },
            responseType: 'blob',
        });
        return response.data;
    }

    async importEvents(
        calendarId: string,
        file: File,
        options?: {
            duplicateHandling?: 'skip' | 'update' | 'create';
            timeZone?: string;
        }
    ): Promise<{
        imported: number;
        skipped: number;
        errors: string[];
    }> {
        const formData = new FormData();
        formData.append('file', file);
        if (options) {
            formData.append('options', JSON.stringify(options));
        }

        const response = await api.post(`/api/calendars/${calendarId}/import`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }

    // Availability & Free/Busy
    async getFreeBusyInfo(
        userIds: string[],
        startTime: Date,
        endTime: Date
    ): Promise<Array<{
        userId: string;
        busyTimes: Array<{ start: Date; end: Date; status: string }>;
    }>> {
        const response = await api.post('/api/calendar/freebusy', {
            userIds,
            startTime,
            endTime,
        });
        return response.data;
    }

    async findMeetingTime(
        attendeeEmails: string[],
        duration: number, // minutes
        timeRange: { start: Date; end: Date },
        preferences?: {
            workingHours?: { start: string; end: string };
            workingDays?: number[];
            timeZone?: string;
        }
    ): Promise<Array<{ start: Date; end: Date; confidence: number }>> {
        const response = await api.post('/api/calendar/find-meeting-time', {
            attendeeEmails,
            duration,
            timeRange,
            preferences,
        });
        return response.data;
    }

    // Real-time Updates
    subscribeToCalendarUpdates(
        calendarIds: string[],
        onUpdate: (event: { type: string; data: any }) => void
    ): () => void {
        // WebSocket or Server-Sent Events implementation
        const eventSource = new EventSource(`/api/calendar/subscribe?calendars=${calendarIds.join(',')}`);
        
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onUpdate(data);
        };

        return () => {
            eventSource.close();
        };
    }

    // Utility Methods
    async validateEventConflicts(
        calendarId: string,
        startTime: Date,
        endTime: Date,
        excludeEventId?: string
    ): Promise<CalendarEvent[]> {
        const response = await api.post(`/api/calendars/${calendarId}/check-conflicts`, {
            startTime,
            endTime,
            excludeEventId,
        });
        return response.data;
    }

    async getCalendarStats(calendarId: string, period: 'week' | 'month' | 'year' = 'month'): Promise<{
        totalEvents: number;
        totalHours: number;
        eventsByType: Record<string, number>;
        busyHours: Array<{ hour: number; count: number }>;
        topLocations: Array<{ location: string; count: number }>;
    }> {
        const response = await api.get(`/api/calendars/${calendarId}/stats`, {
            params: { period },
        });
        return response.data;
    }
}

export const calendarService = new CalendarService();
