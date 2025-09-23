import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  Calendar,
  CalendarEvent,
  CreateCalendarRequest,
  CreateEventRequest,
  UpdateCalendarRequest,
  UpdateEventRequest,
  CalendarEventsQuery,
  EventsResponse,
  UpcomingEventsResponse,
  TodayEventsResponse,
  CalendarStats,
} from "@/types/calendar";

class CalendarService {
  // Calendar Management
  async getCalendars(): Promise<Calendar[]> {
    const response = await apiClient.get<ApiResponse<Calendar[]>>("/calendars");
    return response.data.data || [];
  }

  async getCalendar(calendarId: string): Promise<Calendar> {
    const response = await apiClient.get<ApiResponse<Calendar>>(
      `/calendars/${calendarId}`
    );
    return response.data.data!;
  }

  async createCalendar(data: CreateCalendarRequest): Promise<Calendar> {
    const response = await apiClient.post<ApiResponse<Calendar>>(
      "/calendars",
      data
    );
    return response.data.data!;
  }

  async updateCalendar(
    calendarId: string,
    data: UpdateCalendarRequest
  ): Promise<Calendar> {
    const response = await apiClient.put<ApiResponse<Calendar>>(
      `/calendars/${calendarId}`,
      data
    );
    return response.data.data!;
  }

  async deleteCalendar(calendarId: string): Promise<void> {
    await apiClient.delete(`/calendars/${calendarId}`);
  }

  // Event Management
  async getEvents(query: CalendarEventsQuery): Promise<CalendarEvent[]> {
    const response = await apiClient.get<ApiResponse<EventsResponse>>(
      "/calendars/events",
      {
        params: query,
      }
    );
    return response.data.data?.events || [];
  }

  async getEvent(eventId: string): Promise<CalendarEvent> {
    const response = await apiClient.get<ApiResponse<CalendarEvent>>(
      `/calendars/events/${eventId}`
    );
    return response.data.data!;
  }

  async createEvent(data: CreateEventRequest): Promise<CalendarEvent> {
    const response = await apiClient.post<ApiResponse<CalendarEvent>>(
      "/calendars/events",
      data
    );
    return response.data.data!;
  }

  async updateEvent(
    eventId: string,
    data: UpdateEventRequest
  ): Promise<CalendarEvent> {
    const response = await apiClient.put<ApiResponse<CalendarEvent>>(
      `/calendars/events/${eventId}`,
      data
    );
    return response.data.data!;
  }

  async deleteEvent(eventId: string): Promise<void> {
    await apiClient.delete(`/calendars/events/${eventId}`);
  }

  // Additional methods matching backend API
  async getUpcomingEvents(limit = 10, days = 7): Promise<CalendarEvent[]> {
    const response = await apiClient.get<ApiResponse<UpcomingEventsResponse>>(
      "/calendars/events/upcoming",
      {
        params: { limit, days },
      }
    );
    return response.data.data?.events || [];
  }

  async getTodayEvents(): Promise<CalendarEvent[]> {
    const response = await apiClient.get<ApiResponse<TodayEventsResponse>>(
      "/calendars/events/today"
    );
    return response.data.data?.events || [];
  }

  async searchEvents(query: string, limit = 50): Promise<CalendarEvent[]> {
    const response = await apiClient.get<ApiResponse<EventsResponse>>(
      "/calendars/events/search",
      {
        params: { q: query, limit },
      }
    );
    return response.data.data?.events || [];
  }

  async syncTimeRelatedModules(): Promise<void> {
    await apiClient.post("/calendars/sync/time-related");
  }

  async getCalendarStats(): Promise<CalendarStats> {
    const response = await apiClient.get<ApiResponse<CalendarStats>>(
      "/calendars/stats"
    );
    return response.data.data!;
  }
}

export const calendarService = new CalendarService();
