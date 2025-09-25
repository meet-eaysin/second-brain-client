import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateCalendar,
  useUpdateCalendar,
} from "../services/calendar-queries";
import type { Calendar } from "@/types/calendar";
import { ECalendarType } from "@/types/calendar";
import { toast } from "sonner";

const calendarFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
  type: z.enum([
    "personal",
    "work",
    "shared",
    "project",
    "team",
    "holiday",
    "birthday",
  ] as const),
  timeZone: z.string().min(1, "Time zone is required"),
  isDefault: z.boolean().optional(),
  isVisible: z.boolean().optional(),
});

type CalendarFormData = z.infer<typeof calendarFormSchema>;

interface CalendarFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendar?: Calendar | null;
  onSuccess?: () => void;
}

const CALENDAR_TYPES: { value: ECalendarType; label: string }[] = [
  { value: "personal", label: "Personal" },
  { value: "work", label: "Work" },
  { value: "shared", label: "Shared" },
  { value: "project", label: "Project" },
  { value: "team", label: "Team" },
  { value: "holiday", label: "Holiday" },
  { value: "birthday", label: "Birthday" },
];

const TIME_ZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const PRESET_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#6B7280", // Gray
  "#F97316", // Orange
];

export function CalendarForm({
  open,
  onOpenChange,
  calendar,
  onSuccess,
}: CalendarFormProps) {
  const isEditing = !!calendar;
  const createCalendarMutation = useCreateCalendar();
  const updateCalendarMutation = useUpdateCalendar();

  const form = useForm<CalendarFormData>({
    resolver: zodResolver(calendarFormSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3B82F6",
      type: ECalendarType.PERSONAL,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      isDefault: false,
      isVisible: true,
    },
  });

  useEffect(() => {
    if (calendar) {
      form.reset({
        name: calendar.name,
        description: calendar.description || "",
        color: calendar.color,
        type: calendar.type,
        timeZone: calendar.timeZone,
        isDefault: calendar.isDefault,
        isVisible: calendar.isVisible,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        color: "#3B82F6",
        type: "personal",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isDefault: false,
        isVisible: true,
      });
    }
  }, [calendar, form]);

  const onSubmit = async (data: CalendarFormData) => {
    try {
      if (isEditing && calendar) {
        await updateCalendarMutation.mutateAsync({
          calendarId: calendar.id,
          data,
        });
        toast.success("Calendar updated successfully");
      } else {
        await createCalendarMutation.mutateAsync(data);
        toast.success("Calendar created successfully");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update calendar" : "Failed to create calendar"
      );
    }
  };

  const selectedColor = form.watch("color");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Calendar" : "Create New Calendar"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Calendar" {...field} />
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
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Calendar description..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CALENDAR_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
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
                name="timeZone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Zone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_ZONES.map((tz) => (
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

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${
                              selectedColor === color
                                ? "border-primary"
                                : "border-muted"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => field.onChange(color)}
                          />
                        ))}
                      </div>
                      <Input type="color" {...field} className="w-full h-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as default calendar</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Visible by default</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createCalendarMutation.isPending ||
                  updateCalendarMutation.isPending
                }
              >
                {createCalendarMutation.isPending ||
                updateCalendarMutation.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Update Calendar"
                  : "Create Calendar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
