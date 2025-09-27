import { useState, useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import type { SlotInfo, View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { useEvents } from "../services/calendar-queries";
import {
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "../services/calendar-queries";
import type { CreateEventRequest, UpdateEventRequest } from "@/modules/calendar/types/calendar.types.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import EventForm from "./event-form";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "./shadcn-big-calendar.css";

const DnDCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    calendarId: string;
    description?: string;
    location?: string;
  };
}

interface EventDropArgs {
  event: CalendarEvent;
  start: Date;
  end: Date;
}

interface EventResizeArgs {
  event: CalendarEvent;
  start: Date;
  end: Date;
}

// Custom event component for better UI
const CustomEvent = ({ event }: { event: CalendarEvent }) => {
  const getEventTypeIcon = (type?: string) => {
    switch (type) {
      case "meeting":
        return <Users className="h-3 w-3" />;
      case "task":
        return <CheckCircle className="h-3 w-3" />;
      case "reminder":
        return <AlertCircle className="h-3 w-3" />;
      case "deadline":
        return <XCircle className="h-3 w-3" />;
      case "milestone":
        return <Target className="h-3 w-3" />;
      case "habit":
        return <Coffee className="h-3 w-3" />;
      case "goal_review":
        return <Target className="h-3 w-3" />;
      case "break":
        return <Coffee className="h-3 w-3" />;
      case "focus_time":
        return <Clock className="h-3 w-3" />;
      case "travel":
        return <MapPin className="h-3 w-3" />;
      case "appointment":
        return <CalendarIcon className="h-3 w-3" />;
      default:
        return <CalendarIcon className="h-3 w-3" />;
    }
  };

  const formatTime = (date: Date) => {
    return moment(date).format("HH:mm");
  };

  const isAllDay = moment(event.end).diff(moment(event.start), "days") >= 1;

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      {getEventTypeIcon(event.resource?.type)}
      <span className="truncate">{event.title}</span>
      {!isAllDay && (
        <span className="opacity-75 ml-1">{formatTime(event.start)}</span>
      )}
    </div>
  );
};

interface ShadcnBigCalendarComponentProps {
  selectedCalendars: string[];
  showCreateEvent?: boolean;
  onCreateEventClose?: () => void;
}

export default function ShadcnBigCalendarComponent({
  selectedCalendars,
  showCreateEvent = false,
  onCreateEventClose,
}: ShadcnBigCalendarComponentProps) {
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [view, setView] = useState<(typeof Views)[keyof typeof Views]>(
    Views.WEEK
  );
  const [date, setDate] = useState(new Date());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  // Memoize query parameters to prevent infinite re-renders
  const queryParams = useMemo(
    () => ({
      startDate: new Date(date.getFullYear(), date.getMonth() - 1, 1),
      endDate: new Date(date.getFullYear(), date.getMonth() + 2, 0),
      calendarIds: selectedCalendars.length > 0 ? selectedCalendars : undefined,
    }),
    [date, selectedCalendars]
  );

  // Fetch events for current view
  const { data: eventsResponse } = useEvents(queryParams);

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  // Transform events to react-big-calendar format
  const calendarEvents = (eventsResponse?.events || []).map((event) => ({
    id: event.id,
    title: event.title,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
    resource: {
      calendarId: event.calendarId,
      description: event.description,
      location: event.location,
      type: event.type,
    },
  }));

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
  };

  const handleCreateEvent = async (
    data: CreateEventRequest | UpdateEventRequest
  ) => {
    try {
      if (selectedEvent) {
        // Update existing event
        await updateEventMutation.mutateAsync({
          eventId: selectedEvent.id,
          data: data as UpdateEventRequest,
        });
      } else {
        // Create new event
        await createEventMutation.mutateAsync(data as CreateEventRequest);
      }
      setSelectedSlot(null);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  const handleEventDrop = (args: EventDropArgs) => {
    updateEventMutation.mutate({
      eventId: args.event.id,
      data: {
        startTime: args.start,
        endTime: args.end,
      },
    });
  };

  const handleEventResize = (args: EventResizeArgs) => {
    updateEventMutation.mutate({
      eventId: args.event.id,
      data: {
        startTime: args.start,
        endTime: args.end,
      },
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    setEventToDelete(eventId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDeleteEvent = async () => {
    if (eventToDelete) {
      try {
        await deleteEventMutation.mutateAsync(eventToDelete);
        setSelectedEvent(null);
        setSelectedSlot(null);
        setShowDeleteConfirm(false);
        setEventToDelete(null);
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handleDialogClose = () => {
    setSelectedSlot(null);
    setSelectedEvent(null);
    onCreateEventClose?.();
  };

  return (
    <div className="space-y-4">
      <Dialog
        open={
          selectedSlot !== null || selectedEvent !== null || showCreateEvent
        }
        onOpenChange={handleDialogClose}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent ? "Edit Event" : "Create Event"}
            </DialogTitle>
          </DialogHeader>
          {(selectedSlot || selectedEvent || showCreateEvent) && (
            <EventForm
              eventId={selectedEvent?.id}
              initialStart={selectedSlot?.start || selectedEvent?.start}
              initialEnd={selectedSlot?.end || selectedEvent?.end}
              calendarId={selectedCalendars[0]}
              onSubmit={handleCreateEvent}
              onCancel={handleDialogClose}
              onDelete={selectedEvent ? handleDeleteEvent : undefined}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Event Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Event"
        desc="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete Event"
        destructive
        handleConfirm={handleConfirmDeleteEvent}
        isLoading={deleteEventMutation.isPending}
      />

      <DnDCalendar
        localizer={localizer}
        style={{ height: 600, width: "100%" }}
        className="border-border border-rounded-md border-solid border-2 rounded-lg"
        selectable
        date={date}
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
        resizable
        draggableAccessor={() => true}
        resizableAccessor={() => true}
        events={calendarEvents}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        components={{
          event: CustomEvent,
        }}
      />
    </div>
  );
}
