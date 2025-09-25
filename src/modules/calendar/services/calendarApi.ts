import { apiClient } from "@/services/api-client.ts";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  Calendar,
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
  EventsResponse,
  CalendarViewResponse,
  UpcomingEventsResponse,
  TodayEventsResponse,
  BusyTimesResponse,
  CalendarProvider,
  ConnectionTestResponse,
  ConnectionLogsResponse,
  CalendarConnectionStats,
} from "@/types/calendar";
import type { ApiResponse } from "@/types/api.types";

export const calendarApi = {
  // Calendar CRUD operations
  getCalendars: async (includeHidden = false): Promise<Calendar[]> => {
    const response = await apiClient.get<ApiResponse<Calendar[]>>(
      API_ENDPOINTS.CALENDAR.LIST,
      { params: { includeHidden } }
    );
    return response.data.data;
  },

  createCalendar: async (data: CreateCalendarRequest): Promise<Calendar> => {
    const response = await apiClient.post<ApiResponse<Calendar>>(
      API_ENDPOINTS.CALENDAR.CREATE,
      data
    );
    return response.data.data;
  },

  getCalendarById: async (id: string): Promise<Calendar> => {
    const response = await apiClient.get<ApiResponse<Calendar>>(
      API_ENDPOINTS.CALENDAR.BY_ID(id)
    );
    return response.data.data;
  },

  updateCalendar: async (
    id: string,
    data: UpdateCalendarRequest
  ): Promise<Calendar> => {
    const response = await apiClient.put<ApiResponse<Calendar>>(
      API_ENDPOINTS.CALENDAR.UPDATE(id),
      data
    );
    return response.data.data;
  },

  deleteCalendar: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CALENDAR.DELETE(id));
  },

  // Event operations
  getEvents: async (query?: CalendarEventsQuery): Promise<EventsResponse> => {
    const response = await apiClient.get<ApiResponse<EventsResponse>>(
      API_ENDPOINTS.CALENDAR.EVENTS,
      { params: query }
    );
    return response.data.data;
  },

  createEvent: async (data: CreateEventRequest): Promise<CalendarEvent> => {
    const response = await apiClient.post<ApiResponse<CalendarEvent>>(
      API_ENDPOINTS.CALENDAR.EVENTS,
      data
    );
    return response.data.data;
  },

  getEventById: async (id: string): Promise<CalendarEvent> => {
    const response = await apiClient.get<ApiResponse<CalendarEvent>>(
      API_ENDPOINTS.CALENDAR.EVENT_BY_ID(id)
    );
    return response.data.data;
  },

  updateEvent: async (
    id: string,
    data: UpdateEventRequest
  ): Promise<CalendarEvent> => {
    const response = await apiClient.put<ApiResponse<CalendarEvent>>(
      API_ENDPOINTS.CALENDAR.EVENT_BY_ID(id),
      data
    );
    return response.data.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CALENDAR.EVENT_BY_ID(id));
  },

  getUpcomingEvents: async (
    limit = 10,
    days = 7
  ): Promise<UpcomingEventsResponse> => {
    const response = await apiClient.get<ApiResponse<UpcomingEventsResponse>>(
      API_ENDPOINTS.CALENDAR.EVENTS_UPCOMING,
      { params: { limit, days } }
    );
    return response.data.data;
  },

  getTodayEvents: async (): Promise<TodayEventsResponse> => {
    const response = await apiClient.get<ApiResponse<TodayEventsResponse>>(
      API_ENDPOINTS.CALENDAR.EVENTS_TODAY
    );
    return response.data.data;
  },

  searchEvents: async (query: string, limit = 50): Promise<EventsResponse> => {
    const response = await apiClient.get<ApiResponse<EventsResponse>>(
      API_ENDPOINTS.CALENDAR.EVENTS_SEARCH,
      { params: { q: query, limit } }
    );
    return response.data.data;
  },

  getEventsByEntity: async (
    entityType: string,
    entityId: string
  ): Promise<EventsResponse> => {
    const response = await apiClient.get<ApiResponse<EventsResponse>>(
      API_ENDPOINTS.CALENDAR.EVENTS_BY_ENTITY(entityType, entityId)
    );
    return response.data.data;
  },

  // Calendar views and stats
  getCalendarView: async (
    view: CalendarView
  ): Promise<CalendarViewResponse> => {
    const response = await apiClient.get<ApiResponse<CalendarViewResponse>>(
      API_ENDPOINTS.CALENDAR.VIEW_CALENDAR,
      { params: view }
    );
    return response.data.data;
  },

  getBusyTimes: async (
    startDate: Date,
    endDate: Date,
    calendarIds?: string[]
  ): Promise<BusyTimesResponse> => {
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
    return response.data.data;
  },

  getCalendarStats: async (): Promise<CalendarStats> => {
    const response = await apiClient.get<ApiResponse<CalendarStats>>(
      API_ENDPOINTS.CALENDAR.STATS
    );
    return response.data.data;
  },

  syncTimeRelatedModules: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.CALENDAR.SYNC_TIME_RELATED);
  },

  // External calendar connections
  getCalendarProviders: async (): Promise<CalendarProvider[]> => {
    const response = await apiClient.get<ApiResponse<CalendarProvider[]>>(
      API_ENDPOINTS.CALENDAR.CONNECTIONS_PROVIDERS
    );
    return response.data.data;
  },

  getCalendarConnections: async (
    activeOnly = true
  ): Promise<CalendarConnection[]> => {
    const response = await apiClient.get<ApiResponse<CalendarConnection[]>>(
      API_ENDPOINTS.CALENDAR.CONNECTIONS,
      { params: { activeOnly } }
    );
    return response.data.data;
  },

  connectCalendar: async (
    data: ConnectCalendarRequest
  ): Promise<CalendarConnection> => {
    const response = await apiClient.post<ApiResponse<CalendarConnection>>(
      API_ENDPOINTS.CALENDAR.CONNECTIONS,
      data
    );
    return response.data.data;
  },

  getCalendarConnectionById: async (
    id: string
  ): Promise<CalendarConnection> => {
    const response = await apiClient.get<ApiResponse<CalendarConnection>>(
      API_ENDPOINTS.CALENDAR.CONNECTION_BY_ID(id)
    );
    return response.data.data;
  },

  updateCalendarConnection: async (
    id: string,
    data: {
      syncEnabled?: boolean;
      syncFrequency?: number;
      syncSettings?: Partial<CalendarConnection["syncSettings"]>;
    }
  ): Promise<CalendarConnection> => {
    const response = await apiClient.put<ApiResponse<CalendarConnection>>(
      API_ENDPOINTS.CALENDAR.CONNECTION_BY_ID(id),
      data
    );
    return response.data.data;
  },

  disconnectCalendar: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CALENDAR.CONNECTION_BY_ID(id));
  },

  syncCalendarConnection: async (id: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.CALENDAR.CONNECTION_SYNC(id));
  },

  testCalendarConnection: async (
    id: string
  ): Promise<ConnectionTestResponse> => {
    const response = await apiClient.post<ApiResponse<ConnectionTestResponse>>(
      API_ENDPOINTS.CALENDAR.CONNECTION_TEST(id)
    );
    return response.data.data;
  },

  resetCalendarConnectionErrors: async (
    id: string
  ): Promise<CalendarConnection> => {
    const response = await apiClient.post<ApiResponse<CalendarConnection>>(
      API_ENDPOINTS.CALENDAR.CONNECTION_RESET_ERRORS(id)
    );
    return response.data.data;
  },

  getCalendarConnectionLogs: async (
    id: string,
    limit = 50
  ): Promise<ConnectionLogsResponse> => {
    const response = await apiClient.get<ApiResponse<ConnectionLogsResponse>>(
      API_ENDPOINTS.CALENDAR.CONNECTION_LOGS(id),
      { params: { limit } }
    );
    return response.data.data;
  },

  getCalendarConnectionsStats: async (): Promise<CalendarConnectionStats> => {
    const response = await apiClient.get<ApiResponse<CalendarConnectionStats>>(
      API_ENDPOINTS.CALENDAR.CONNECTIONS_STATS
    );
    return response.data.data;
  },
};
