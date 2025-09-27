import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEvent } from "@/modules/calendar/services/calendar-queries";
import {
  type CreateEventRequest,
  type UpdateEventRequest,
  EEventType,
  EEventStatus,
  EEventVisibility,
} from "@/modules/calendar/types/calendar.types.ts";

const eventFormSchema = z.object({
  calendarId: z.string().min(1, "Calendar is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  startTime: z.date({ required_error: "Start time is required" }),
  endTime: z.date({ required_error: "End time is required" }),
  isAllDay: z.boolean(),
  timeZone: z.string().min(1, "Time zone is required"),
  type: z.nativeEnum(EEventType),
  status: z.nativeEnum(EEventStatus),
  visibility: z.nativeEnum(EEventVisibility),
  reminders: z
    .array(
      z.object({
        method: z.enum(["email", "popup", "sms", "push"]),
        minutes: z.number().min(0),
      })
    )
    .optional(),
  attendees: z
    .array(
      z.object({
        email: z.string(),
        name: z.string().optional(),
        role: z.enum(["required", "optional", "resource"]),
      })
    )
    .optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface UseEventFormProps {
  eventId?: string;
  initialStart?: Date;
  initialEnd?: Date;
  calendarId?: string;
}

export function useEventForm({
  eventId,
  initialStart,
  initialEnd,
  calendarId,
}: UseEventFormProps) {
  const { data: existingEvent } = useEvent(eventId || "");

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      calendarId: existingEvent?.data?.calendarId || calendarId || "",
      title: existingEvent?.data?.title || "",
      description: existingEvent?.data?.description || "",
      location: existingEvent?.data?.location || "",
      startTime: existingEvent?.data
        ? new Date(existingEvent.data.startTime)
        : initialStart || new Date(),
      endTime: existingEvent?.data
        ? new Date(existingEvent.data.endTime)
        : initialEnd || new Date(Date.now() + 60 * 60 * 1000),
      isAllDay: existingEvent?.data?.isAllDay || false,
      timeZone:
        existingEvent?.data?.timeZone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      type: existingEvent?.data?.type || EEventType.EVENT,
      status: existingEvent?.data?.status || EEventStatus.CONFIRMED,
      visibility: existingEvent?.data?.visibility || EEventVisibility.PUBLIC,
      reminders: existingEvent?.data?.reminders || [],
      attendees:
        existingEvent?.data?.attendees?.map((attendee) => ({
          email: attendee.email,
          name: attendee.name || "",
          role: attendee.role,
        })) || [],
    },
  });

  const watchedStartTime = form.watch("startTime");

  React.useEffect(() => {
    if (watchedStartTime && !form.getValues("endTime")) {
      const endTime = new Date(watchedStartTime.getTime() + 60 * 60 * 1000); // 1 hour later
      form.setValue("endTime", endTime);
    }
  }, [watchedStartTime, form]);

  const handleSubmit = (
    onSubmit: (data: CreateEventRequest | UpdateEventRequest) => void
  ) => {
    return form.handleSubmit((data: EventFormData) => {
      const isEditing = !!eventId;

      if (isEditing) {
        const updateData: UpdateEventRequest = {
          title: data.title,
          description: data.description,
          location: data.location,
          startTime: data.startTime,
          endTime: data.endTime,
          isAllDay: data.isAllDay,
          status: data.status,
          visibility: data.visibility,
          reminders: data.reminders,
          attendees: data.attendees?.map((attendee) => ({
            email: attendee.email,
            name: attendee.name,
            status: "needs_action",
            role: attendee.role,
          })),
        };
        onSubmit(updateData);
      } else {
        // Create new event
        const createData: CreateEventRequest = {
          calendarId: data.calendarId,
          title: data.title,
          description: data.description,
          location: data.location,
          startTime: data.startTime,
          endTime: data.endTime,
          isAllDay: data.isAllDay,
          timeZone: data.timeZone,
          type: data.type,
          status: data.status,
          visibility: data.visibility,
          reminders: data.reminders,
          attendees: data.attendees?.map((attendee) => ({
            email: attendee.email,
            name: attendee.name,
            status: "needs_action",
            role: attendee.role,
          })),
        };
        onSubmit(createData);
      }
    });
  };

  const addReminder = () => {
    const currentReminders = form.getValues("reminders") || [];
    form.setValue("reminders", [
      ...currentReminders,
      { method: "popup", minutes: 15 },
    ]);
  };

  const removeReminder = (index: number) => {
    const currentReminders = form.getValues("reminders") || [];
    form.setValue(
      "reminders",
      currentReminders.filter((_, i) => i !== index)
    );
  };

  const addAttendee = () => {
    const currentAttendees = form.getValues("attendees") || [];
    form.setValue("attendees", [
      ...currentAttendees,
      { email: "", name: "", role: "required" },
    ]);
  };

  const removeAttendee = (index: number) => {
    const currentAttendees = form.getValues("attendees") || [];
    form.setValue(
      "attendees",
      currentAttendees.filter((_, i) => i !== index)
    );
  };

  return {
    form,
    control: form.control,
    watchedIsAllDay: form.watch("isAllDay"),
    watchedStartTime,
    handleSubmit,
    addReminder,
    removeReminder,
    addAttendee,
    removeAttendee,
  };
}

export type { EventFormData };
export { eventFormSchema };
