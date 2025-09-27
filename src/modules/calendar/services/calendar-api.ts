import { apiClient } from "@/services/api-client.ts";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  CalendarTypes,
  CalendarEvent,
  CalendarConnection,
  CalendarView,
  CalendarStats,
  CreateCalendarRequest,
  UpdateCalendarRequest,
  CreateEventRequest,
  UpdateEventRequest,
  CalendarEventsQuery,
  ConnectCalendarRequest,
  CalendarViewResponse,
  UpcomingEventsResponse,
  TodayEventsResponse,
  BusyTimesResponse,
  CalendarProvider,
  ConnectionTestResponse,
  ConnectionLogsResponse,
  CalendarConnectionStats,
} from "@/modules/calendar/types/calendar.types.ts";
import type { ApiResponse } from "@/types/api.types";

export const calendarApi = {
  getCalendars: async (
    includeHidden = false
  ): Promise<ApiResponse<CalendarTypes[]>> => {
    const response = await apiClient.get<ApiResponse<CalendarTypes[]>>(
      API_ENDPOINTS.CALENDAR.LIST,
      { params: { includeHidden } }
    );
    return response.data;
  },

  createCalendar: async (
    data: CreateCalendarRequest
  ): Promise<ApiResponse<CalendarTypes>> => {
    const response = await apiClient.post<ApiResponse<CalendarTypes>>(
      API_ENDPOINTS.CALENDAR.CREATE,
      data
    );
    return response.data;
  },

  getCalendarById: async (id: string): Promise<ApiResponse<CalendarTypes>> => {
    const response = await apiClient.get<ApiResponse<CalendarTypes>>(
      API_ENDPOINTS.CALENDAR.BY_ID(id)
    );
    return response.data;
  },

  updateCalendar: async (
    id: string,
    data: UpdateCalendarRequest
  ): Promise<ApiResponse<CalendarTypes>> => {
    const response = await apiClient.put<ApiResponse<CalendarTypes>>(
      API_ENDPOINTS.CALENDAR.UPDATE(id),
      data
    );
    return response.data;
  },

  deleteCalendar: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CALENDAR.DELETE(id));
  },

  // Event operations
  getEvents: async (
    query?: CalendarEventsQuery
  ): Promise<ApiResponse<CalendarEvent[]>> => {
    const response = await apiClient.get<ApiResponse<CalendarEvent[]>>(
      API_ENDPOINTS.CALENDAR.EVENTS,
      { params: query }
    );
    return response.data;
  },

  createEvent: async (
    data: CreateEventRequest
  ): Promise<ApiResponse<CalendarEvent>> => {
    const response = await apiClient.post<ApiResponse<CalendarEvent>>(
      API_ENDPOINTS.CALENDAR.EVENTS,
      data
    );
    return response.data;
  },

  getEventById: async (id: string): Promise<ApiResponse<CalendarEvent>> => {
    const response = await apiClient.get<ApiResponse<CalendarEvent>>(
      API_ENDPOINTS.CALENDAR.EVENT_BY_ID(id)
    );
    return response.data;
  },

  updateEvent: async (
    id: string,
    data: UpdateEventRequest
  ): Promise<ApiResponse<CalendarEvent>> => {
    const response = await apiClient.put<ApiResponse<CalendarEvent>>(
      API_ENDPOINTS.CALENDAR.EVENT_BY_ID(id),
      data
    );
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CALENDAR.EVENT_BY_ID(id));
  },

  getUpcomingEvents: async (
    limit = 10,
    days = 7
  ): Promise<ApiResponse<UpcomingEventsResponse>> => {
    const response = await apiClient.get<ApiResponse<UpcomingEventsResponse>>(
      API_ENDPOINTS.CALENDAR.EVENTS_UPCOMING,
      { params: { limit, days } }
    );
    return response.data;
  },

  getTodayEvents: async (): Promise<ApiResponse<TodayEventsResponse>> => {
    const response = await apiClient.get<ApiResponse<TodayEventsResponse>>(
      API_ENDPOINTS.CALENDAR.EVENTS_TODAY
    );
    return response.data;
  },

  searchEvents: async (
    query: string,
    limit = 50
  ): Promise<ApiResponse<CalendarEvent[]>> => {
    const response = await apiClient.get<ApiResponse<CalendarEvent[]>>(
      API_ENDPOINTS.CALENDAR.EVENTS_SEARCH,
      { params: { q: query, limit } }
    );
    return response.data;
  },

  getEventsByEntity: async (
    entityType: string,
    entityId: string
  ): Promise<ApiResponse<CalendarEvent[]>> => {
    const response = await apiClient.get<ApiResponse<CalendarEvent[]>>(
      API_ENDPOINTS.CALENDAR.EVENTS_BY_ENTITY(entityType, entityId)
    );
    return response.data;
  },

  getCalendarView: async (
    view: CalendarView
  ): Promise<ApiResponse<CalendarViewResponse>> => {
    const response = await apiClient.get<ApiResponse<CalendarViewResponse>>(
      API_ENDPOINTS.CALENDAR.VIEW_CALENDAR,
      { params: view }
    );
    return response.data;
  },

  getBusyTimes: async (
    startDate: Date,
    endDate: Date,
    calendarIds?: string[]
  ): Promise<ApiResponse<BusyTimesResponse>> => {
    const response = await apiClient.get<ApiResponse<BusyTimesResponse>>(
      API_ENDPOINTS.CALENDAR.VIEW_BUSY_TIMES,
      {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          calendarIds: calendarIds?.join(","),
        },
      }
    );
    return response.data;
  },

  getCalendarStats: async (): Promise<ApiResponse<CalendarStats>> => {
    const response = await apiClient.get<ApiResponse<CalendarStats>>(
      API_ENDPOINTS.CALENDAR.STATS
    );
    return response.data;
  },

  getCalendarConfig: async (): Promise<
    ApiResponse<{
      timeZones: string[];
      presetColors: string[];
      eventTypes: { value: string; label: string; icon: string }[];
      calendarTypes: { value: string; label: string }[];
    }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{
        timeZones: string[];
        presetColors: string[];
        eventTypes: { value: string; label: string; icon: string }[];
        calendarTypes: { value: string; label: string }[];
      }>
    >(API_ENDPOINTS.CALENDAR.CONFIG);
    return response.data;
  },

  getCalendarPreferences: async (): Promise<
    ApiResponse<{
      userId: string;
      defaultCalendarId?: string;
      timeZone: string;
      displayPreferences: {
        showWeekends: boolean;
        showDeclinedEvents: boolean;
        use24HourFormat: boolean;
      };
      syncSettings: {
        autoSyncEnabled: boolean;
        syncFrequency: number;
        conflictResolution: "local" | "remote" | "manual";
      };
      notificationSettings: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        smsNotifications: boolean;
        defaultEmailReminder: number;
        defaultPopupReminder: number;
      };
      createdAt: string;
      updatedAt: string;
    }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{
        userId: string;
        defaultCalendarId?: string;
        timeZone: string;
        displayPreferences: {
          showWeekends: boolean;
          showDeclinedEvents: boolean;
          use24HourFormat: boolean;
        };
        syncSettings: {
          autoSyncEnabled: boolean;
          syncFrequency: number;
          conflictResolution: "local" | "remote" | "manual";
        };
        notificationSettings: {
          emailNotifications: boolean;
          pushNotifications: boolean;
          smsNotifications: boolean;
          defaultEmailReminder: number;
          defaultPopupReminder: number;
        };
        createdAt: string;
        updatedAt: string;
      }>
    >(API_ENDPOINTS.CALENDAR.PREFERENCES);
    return response.data;
  },

  updateCalendarPreferences: async (data: {
    defaultCalendarId?: string;
    timeZone?: string;
    displayPreferences?: {
      showWeekends?: boolean;
      showDeclinedEvents?: boolean;
      use24HourFormat?: boolean;
    };
    syncSettings?: {
      autoSyncEnabled?: boolean;
      syncFrequency?: number;
      conflictResolution?: "local" | "remote" | "manual";
    };
    notificationSettings?: {
      emailNotifications?: boolean;
      pushNotifications?: boolean;
      smsNotifications?: boolean;
      defaultEmailReminder?: number;
      defaultPopupReminder?: number;
    };
  }): Promise<
    ApiResponse<{
      userId: string;
      defaultCalendarId?: string;
      timeZone: string;
      displayPreferences: {
        showWeekends: boolean;
        showDeclinedEvents: boolean;
        use24HourFormat: boolean;
      };
      syncSettings: {
        autoSyncEnabled: boolean;
        syncFrequency: number;
        conflictResolution: "local" | "remote" | "manual";
      };
      notificationSettings: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        smsNotifications: boolean;
        defaultEmailReminder: number;
        defaultPopupReminder: number;
      };
      createdAt: string;
      updatedAt: string;
    }>
  > => {
    const response = await apiClient.put<
      ApiResponse<{
        userId: string;
        defaultCalendarId?: string;
        timeZone: string;
        displayPreferences: {
          showWeekends: boolean;
          showDeclinedEvents: boolean;
          use24HourFormat: boolean;
        };
        syncSettings: {
          autoSyncEnabled: boolean;
          syncFrequency: number;
          conflictResolution: "local" | "remote" | "manual";
        };
        notificationSettings: {
          emailNotifications: boolean;
          pushNotifications: boolean;
          smsNotifications: boolean;
          defaultEmailReminder: number;
          defaultPopupReminder: number;
        };
        createdAt: string;
        updatedAt: string;
      }>
    >(API_ENDPOINTS.CALENDAR.PREFERENCES, data);
    return response.data;
  },

  syncTimeRelatedModules: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.CALENDAR.SYNC_TIME_RELATED);
  },

  // External calendar connections
  getCalendarProviders: async (): Promise<ApiResponse<CalendarProvider[]>> => {
    const response = await apiClient.get<ApiResponse<CalendarProvider[]>>(
      API_ENDPOINTS.CALENDAR.CONNECTIONS_PROVIDERS
    );
    return response.data;
  },

  getCalendarConnections: async (
    activeOnly = true
  ): Promise<ApiResponse<CalendarConnection[]>> => {
    const response = await apiClient.get<ApiResponse<CalendarConnection[]>>(
      API_ENDPOINTS.CALENDAR.CONNECTIONS,
      { params: { activeOnly } }
    );
    return response.data;
  },

  connectCalendar: async (
    data: ConnectCalendarRequest
  ): Promise<ApiResponse<CalendarConnection>> => {
    const response = await apiClient.post<ApiResponse<CalendarConnection>>(
      API_ENDPOINTS.CALENDAR.CONNECTIONS,
      data
    );
    return response.data;
  },

  getCalendarConnectionById: async (
    id: string
  ): Promise<ApiResponse<CalendarConnection>> => {
    const response = await apiClient.get<ApiResponse<CalendarConnection>>(
      API_ENDPOINTS.CALENDAR.CONNECTION_BY_ID(id)
    );
    return response.data;
  },

  updateCalendarConnection: async (
    id: string,
    data: {
      syncEnabled?: boolean;
      syncFrequency?: number;
      syncSettings?: Partial<CalendarConnection["syncSettings"]>;
    }
  ): Promise<ApiResponse<CalendarConnection>> => {
    const response = await apiClient.put<ApiResponse<CalendarConnection>>(
      API_ENDPOINTS.CALENDAR.CONNECTION_BY_ID(id),
      data
    );
    return response.data;
  },

  disconnectCalendar: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CALENDAR.CONNECTION_BY_ID(id));
  },

  syncCalendarConnection: async (id: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.CALENDAR.CONNECTION_SYNC(id));
  },

  testCalendarConnection: async (
    id: string
  ): Promise<ApiResponse<ConnectionTestResponse>> => {
    const response = await apiClient.post<ApiResponse<ConnectionTestResponse>>(
      API_ENDPOINTS.CALENDAR.CONNECTION_TEST(id)
    );
    return response.data;
  },

  resetCalendarConnectionErrors: async (
    id: string
  ): Promise<ApiResponse<CalendarConnection>> => {
    const response = await apiClient.post<ApiResponse<CalendarConnection>>(
      API_ENDPOINTS.CALENDAR.CONNECTION_RESET_ERRORS(id)
    );
    return response.data;
  },

  getCalendarConnectionLogs: async (
    id: string,
    limit = 50
  ): Promise<ApiResponse<ConnectionLogsResponse>> => {
    const response = await apiClient.get<ApiResponse<ConnectionLogsResponse>>(
      API_ENDPOINTS.CALENDAR.CONNECTION_LOGS(id),
      { params: { limit } }
    );
    return response.data;
  },

  getCalendarConnectionsStats: async (): Promise<
    ApiResponse<CalendarConnectionStats>
  > => {
    const response = await apiClient.get<ApiResponse<CalendarConnectionStats>>(
      API_ENDPOINTS.CALENDAR.CONNECTIONS_STATS
    );
    return response.data;
  },
};
