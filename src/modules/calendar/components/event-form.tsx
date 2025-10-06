import React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useCalendars, useCalendarConfig } from "../services/calendar-queries";
import {
  type CreateEventRequest,
  type UpdateEventRequest,
  EEventStatus,
  EEventVisibility,
} from "@/modules/calendar/types/calendar.types.ts";
import { useEventForm } from "../hooks/useEventForm";

interface EventFormProps {
  eventId?: string;
  initialStart?: Date;
  initialEnd?: Date;
  calendarId?: string;
  onSubmit: (data: CreateEventRequest | UpdateEventRequest) => void;
  onCancel: () => void;
  onDelete?: (eventId: string) => void;
  submitLabel?: string;
}

// Event types and time zones will be loaded from config

export default function EventForm({
  eventId,
  initialStart,
  initialEnd,
  calendarId,
  onSubmit,
  onCancel,
  onDelete,
  submitLabel,
}: EventFormProps): React.JSX.Element {
  const { data: calendarsResponse } = useCalendars();
  const calendars = calendarsResponse?.data || [];
  const { data: config } = useCalendarConfig();
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const isEditing = !!eventId;
  const finalSubmitLabel =
    submitLabel || (isEditing ? "Update Event" : "Create Event");

  const {
    form,
    watchedIsAllDay,
    handleSubmit,
    addReminder,
    removeReminder,
    addAttendee,
    removeAttendee,
  } = useEventForm({
    eventId,
    initialStart,
    initialEnd,
    calendarId,
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="calendarId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calendar</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select calendar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {calendars.map((calendar) => (
                      <SelectItem key={calendar.id} value={calendar.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: calendar.color }}
                          />
                          {calendar.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {config?.data?.eventTypes?.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date & Time */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isAllDay"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-1 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>All day event</FormLabel>
                </div>
              </FormItem>
            )}
          />

          {!watchedIsAllDay ? (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Start Time
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Pick date and time</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              const newDate = new Date(date);
                              if (field.value) {
                                newDate.setHours(field.value.getHours());
                                newDate.setMinutes(field.value.getMinutes());
                              }
                              field.onChange(newDate);
                            }
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t">
                          <Input
                            type="time"
                            value={
                              field.value ? format(field.value, "HH:mm") : ""
                            }
                            onChange={(e) => {
                              const [hours, minutes] =
                                e.target.value.split(":");
                              const newDate = new Date(
                                field.value || new Date()
                              );
                              newDate.setHours(
                                parseInt(hours),
                                parseInt(minutes)
                              );
                              field.onChange(newDate);
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      End Time
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Pick date and time</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              const newDate = new Date(date);
                              if (field.value) {
                                newDate.setHours(field.value.getHours());
                                newDate.setMinutes(field.value.getMinutes());
                              }
                              field.onChange(newDate);
                            }
                          }}
                          initialFocus
                        />
                        <div className="p-3 border-t">
                          <Input
                            type="time"
                            value={
                              field.value ? format(field.value, "HH:mm") : ""
                            }
                            onChange={(e) => {
                              const [hours, minutes] =
                                e.target.value.split(":");
                              const newDate = new Date(
                                field.value || new Date()
                              );
                              newDate.setHours(
                                parseInt(hours),
                                parseInt(minutes)
                              );
                              field.onChange(newDate);
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="timeZone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Zone</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {config?.data?.timeZones?.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location & Description */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Event location or virtual meeting link"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Event description..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Advanced Options */}
        <div className="space-y-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full"
          >
            {showAdvanced ? "Hide" : "Show"} Advanced Options
          </Button>

          {showAdvanced && (
            <div className="space-y-4 p-3 sm:p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={EEventStatus.CONFIRMED}>
                            Confirmed
                          </SelectItem>
                          <SelectItem value={EEventStatus.TENTATIVE}>
                            Tentative
                          </SelectItem>
                          <SelectItem value={EEventStatus.CANCELLED}>
                            Cancelled
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={EEventVisibility.PUBLIC}>
                            Public
                          </SelectItem>
                          <SelectItem value={EEventVisibility.PRIVATE}>
                            Private
                          </SelectItem>
                          <SelectItem value={EEventVisibility.CONFIDENTIAL}>
                            Confidential
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Reminders */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <FormLabel className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Reminders
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addReminder}
                    className="w-full sm:w-auto"
                  >
                    Add Reminder
                  </Button>
                </div>
                {form.watch("reminders")?.map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`reminders.${index}.minutes`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Minutes before"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`reminders.${index}.method`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="w-full">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="popup">Popup</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="push">Push</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeReminder(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              {/* Attendees */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <FormLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Attendees
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAttendee}
                    className="w-full sm:w-auto"
                  >
                    Add Attendee
                  </Button>
                </div>
                {form.watch("attendees")?.map((_, index) => (
                  <div
                    key={index}
                    className="space-y-3 p-2 sm:p-3 border rounded-lg"
                  >
                    <div className="flex flex-col sm:flex-row gap-3">
                      <FormField
                        control={form.control}
                        name={`attendees.${index}.email`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="email@example.com"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`attendees.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Name (optional)"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <FormField
                        control={form.control}
                        name={`attendees.${index}.role`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="required">
                                  Required
                                </SelectItem>
                                <SelectItem value="optional">
                                  Optional
                                </SelectItem>
                                <SelectItem value="resource">
                                  Resource
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAttendee(index)}
                        className="flex-shrink-0"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div className="order-2 sm:order-1">
            {isEditing && onDelete && eventId && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onDelete(eventId)}
                className="w-full sm:w-auto"
              >
                Delete Event
              </Button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {finalSubmitLabel}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
