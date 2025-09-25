import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { calendarApi } from "./calendarApi";
import type {
  Calendar,
  CalendarEvent,
  CalendarConnection,
  CalendarStats,
  CreateCalendarRequest,
  UpdateCalendarRequest,
  CreateEventRequest,
  UpdateEventRequest,
  CalendarEventsQuery,
  ConnectCalendarRequest,
  CalendarProvider,
  ConnectionTestResponse,
  ConnectionLogsResponse,
  CalendarConnectionStats,
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
  config: () => [...CALENDAR_KEYS.all, "config"] as const,
  preferences: () => [...CALENDAR_KEYS.all, "preferences"] as const,
  connections: () => [...CALENDAR_KEYS.all, "connections"] as const,
  connectionDetail: (id: string) =>
    [...CALENDAR_KEYS.connections(), id] as const,
  providers: () => [...CALENDAR_KEYS.connections(), "providers"] as const,
};

// Calendar Queries
export const useCalendars = () => {
  return useQuery({
    queryKey: CALENDAR_KEYS.lists(),
    queryFn: () => calendarApi.getCalendars(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCalendar = (calendarId: string) => {
  return useQuery({
    queryKey: CALENDAR_KEYS.detail(calendarId),
    queryFn: () => calendarApi.getCalendarById(calendarId),
    enabled: !!calendarId,
    staleTime: 5 * 60 * 1000,
  });
};

// Event Queries
export const useEvents = (query: CalendarEventsQuery) => {
  return useQuery({
    queryKey: CALENDAR_KEYS.eventsList(query),
    queryFn: () => calendarApi.getEvents(query),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: CALENDAR_KEYS.eventDetail(eventId),
    queryFn: () => calendarApi.getEventById(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpcomingEvents = (limit: number = 10, days: number = 7) => {
  return useQuery({
    queryKey: [...CALENDAR_KEYS.upcoming(), { limit, days }],
    queryFn: () => calendarApi.getUpcomingEvents(limit, days),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTodayEvents = () => {
  return useQuery({
    queryKey: CALENDAR_KEYS.today(),
    queryFn: () => calendarApi.getTodayEvents(),
    staleTime: 2 * 60 * 1000,
  });
};

// Calendar Stats
export const useCalendarStats = () => {
  return useQuery({
    queryKey: CALENDAR_KEYS.stats(),
    queryFn: () => calendarApi.getCalendarStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Calendar Config
export const useCalendarConfig = () => {
  return useQuery({
    queryKey: CALENDAR_KEYS.config(),
    queryFn: () => calendarApi.getCalendarConfig(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Calendar Preferences
export const useCalendarPreferences = () => {
  return useQuery({
    queryKey: CALENDAR_KEYS.preferences(),
    queryFn: () => calendarApi.getCalendarPreferences(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Calendar Connections
export const useCalendarConnections = (activeOnly = true) => {
  return useQuery({
    queryKey: [...CALENDAR_KEYS.connections(), { activeOnly }],
    queryFn: () => calendarApi.getCalendarConnections(activeOnly),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCalendarConnection = (id: string) => {
  return useQuery({
    queryKey: CALENDAR_KEYS.connectionDetail(id),
    queryFn: () => calendarApi.getCalendarConnectionById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCalendarProviders = () => {
  return useQuery({
    queryKey: CALENDAR_KEYS.providers(),
    queryFn: () => calendarApi.getCalendarProviders(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCalendarConnectionStats = () => {
  return useQuery({
    queryKey: [...CALENDAR_KEYS.connections(), "stats"],
    queryFn: () => calendarApi.getCalendarConnectionsStats(),
    staleTime: 10 * 60 * 1000,
  });
};

// Calendar Mutations
export const useCreateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCalendarRequest) =>
      calendarApi.createCalendar(data),
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
    }) => calendarApi.updateCalendar(calendarId, data),
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
    mutationFn: (calendarId: string) => calendarApi.deleteCalendar(calendarId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.lists() });
    },
  });
};

// Event Mutations
export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => calendarApi.createEvent(data),
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
    }) => calendarApi.updateEvent(eventId, data),
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
    mutationFn: (eventId: string) => calendarApi.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.events() });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.upcoming() });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.today() });
    },
  });
};

// Connection Mutations
export const useConnectCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConnectCalendarRequest) =>
      calendarApi.connectCalendar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.connections() });
    },
  });
};

export const useUpdateCalendarConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        syncEnabled?: boolean;
        syncFrequency?: number;
        syncSettings?: Partial<CalendarConnection["syncSettings"]>;
      };
    }) => calendarApi.updateCalendarConnection(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: CALENDAR_KEYS.connectionDetail(id),
      });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.connections() });
    },
  });
};

export const useDisconnectCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => calendarApi.disconnectCalendar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.connections() });
    },
  });
};

export const useSyncCalendarConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => calendarApi.syncCalendarConnection(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: CALENDAR_KEYS.connectionDetail(id),
      });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.connections() });
    },
  });
};

export const useTestCalendarConnection = () => {
  return useMutation({
    mutationFn: (id: string) => calendarApi.testCalendarConnection(id),
  });
};

export const useResetCalendarConnectionErrors = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => calendarApi.resetCalendarConnectionErrors(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: CALENDAR_KEYS.connectionDetail(id),
      });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.connections() });
    },
  });
};

export const useSyncTimeRelatedModules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => calendarApi.syncTimeRelatedModules(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.events() });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.upcoming() });
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.today() });
    },
  });
};

export const useUpdateCalendarPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
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
    }) => {
      console.log("Updating calendar preferences:", data);
      return calendarApi.updateCalendarPreferences(data);
    },
    onSuccess: () => {
      console.log("Preferences updated successfully");
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEYS.preferences() });
    },
    onError: (error) => {
      console.error("Failed to update preferences:", error);
    },
  });
};
