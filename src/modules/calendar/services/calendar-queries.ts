import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { calendarService } from "./calendar.service";
import type {
  CreateCalendarRequest,
  UpdateCalendarRequest,
  CreateEventRequest,
  UpdateEventRequest,
  CalendarEventsQuery,
} from "@/types/calendar";

// Query Keys
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
};

// Calendar Queries
export const useCalendars = () => {
  return useQuery({
    queryKey: CALENDAR_KEYS.lists(),
    queryFn: () => calendarService.getCalendars(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCalendar = (calendarId: string) => {
  return useQuery({
    queryKey: CALENDAR_KEYS.detail(calendarId),
    queryFn: () => calendarService.getCalendar(calendarId),
    enabled: !!calendarId,
    staleTime: 5 * 60 * 1000,
  });
};

// Event Queries
export const useEvents = (query: CalendarEventsQuery) => {
  return useQuery({
    queryKey: CALENDAR_KEYS.eventsList(query),
    queryFn: () => calendarService.getEvents(query),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: CALENDAR_KEYS.eventDetail(eventId),
    queryFn: () => calendarService.getEvent(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpcomingEvents = (limit: number = 10, days: number = 7) => {
  return useQuery({
    queryKey: [...CALENDAR_KEYS.upcoming(), { limit, days }],
    queryFn: () => calendarService.getUpcomingEvents(limit, days),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTodayEvents = () => {
  return useQuery({
    queryKey: CALENDAR_KEYS.today(),
    queryFn: () => calendarService.getTodayEvents(),
    staleTime: 2 * 60 * 1000,
  });
};

// Calendar Mutations
export const useCreateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCalendarRequest) =>
      calendarService.createCalendar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.lists() });
    },
  });
};

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      calendarId,
      data,
    }: {
      calendarId: string;
      data: UpdateCalendarRequest;
    }) => calendarService.updateCalendar(calendarId, data),
    onSuccess: (_, { calendarId }) => {
      queryClient.invalidateQueries({
        queryKey: CALENDAR_KEYS.detail(calendarId),
      });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.lists() });
    },
  });
};

export const useDeleteCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (calendarId: string) =>
      calendarService.deleteCalendar(calendarId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.lists() });
    },
  });
};

// Event Mutations
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => calendarService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.events() });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.upcoming() });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.today() });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: UpdateEventRequest;
    }) => calendarService.updateEvent(eventId, data),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({
        queryKey: CALENDAR_KEYS.eventDetail(eventId),
      });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.events() });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.upcoming() });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.today() });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => calendarService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.events() });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.upcoming() });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.today() });
    },
  });
};

// Calendar Stats - TODO: Implement when backend supports it
// export const useCalendarStats = () => {
//   return useQuery({
export const useCalendarStats = () => {
  return useQuery({
    queryKey: CALENDAR_KEYS.stats(),
    queryFn: () => calendarService.getCalendarStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
//   });
// };
