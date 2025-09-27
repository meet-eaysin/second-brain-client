export { default as CalendarPage } from "./pages/calendar-page";

export { calendarApi } from "./services/calendar-api.ts";

export {
  CALENDAR_KEYS,
  useCalendars,
  useCalendar,
  useEvents,
  useEvent,
  useUpcomingEvents,
  useTodayEvents,
  useCalendarStats,
  useCalendarConnections,
  useCalendarConnection,
  useCalendarProviders,
  useCalendarConnectionStats,
  useCreateCalendar,
  useUpdateCalendar,
  useDeleteCalendar,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useConnectCalendar,
  useUpdateCalendarConnection,
  useDisconnectCalendar,
  useSyncCalendarConnection,
  useTestCalendarConnection,
  useResetCalendarConnectionErrors,
  useSyncTimeRelatedModules,
} from "./services/calendar-queries";

export { default as EventForm } from "./components/event-form";
export { default as ShadcnBigCalendarComponent } from "./components/schedule-x-calendar";
export { CalendarList } from "./components/calendar-list";
export { CalendarForm } from "./components/calendar-form";
export { CalendarConnections } from "./components/calendar-connections";
export { ConnectCalendarForm } from "./components/connect-calendar-form";

export type * from "@/modules/calendar/types/calendar.types.ts";
