import { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import type { SlotInfo, View } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import { useEvents } from "../services/calendar-queries";
import { useCreateEvent, useUpdateEvent } from "../services/calendar-queries";
import { EEventType, EEventStatus, EEventVisibility } from "@/types/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [view, setView] = useState<(typeof Views)[keyof typeof Views]>(
    Views.WEEK
  );
  const [date, setDate] = useState(new Date());

  // Fetch events for current view
  const { data: events = [] } = useEvents({
    startDate: new Date(date.getFullYear(), date.getMonth() - 1, 1),
    endDate: new Date(date.getFullYear(), date.getMonth() + 2, 0),
    calendarIds: selectedCalendars.length > 0 ? selectedCalendars : undefined,
  });

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();

  // Transform events to react-big-calendar format
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
    resource: {
      calendarId: event.calendarId,
      description: event.description,
      location: event.location,
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
  };

  const handleCreateEvent = async (data: {
    title: string;
    start: string;
    end: string;
    description?: string;
    location?: string;
  }) => {
    try {
      await createEventMutation.mutateAsync({
        calendarId: selectedCalendars[0] || "",
        title: data.title,
        description: data.description || "",
        location: data.location || "",
        startTime: new Date(data.start),
        endTime: new Date(data.end),
        isAllDay: false,
        type: EEventType.EVENT,
        status: EEventStatus.CONFIRMED,
        visibility: EEventVisibility.PUBLIC,
      });
      setSelectedSlot(null);
    } catch (error) {
      console.error("Failed to create event:", error);
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

  const handleDialogClose = () => {
    setSelectedSlot(null);
    onCreateEventClose?.();
  };

  return (
    <div className="space-y-4">
      <Dialog
        open={selectedSlot !== null || showCreateEvent}
        onOpenChange={handleDialogClose}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          {(selectedSlot || showCreateEvent) && (
            <EventForm
              start={selectedSlot?.start || new Date()}
              end={selectedSlot?.end || new Date(Date.now() + 60 * 60 * 1000)}
              onSubmit={handleCreateEvent}
              onCancel={handleDialogClose}
            />
          )}
        </DialogContent>
      </Dialog>

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
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
      />
    </div>
  );
}
