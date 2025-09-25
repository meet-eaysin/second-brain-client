import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar as CalendarIcon,
  Plus,
  Settings,
  MoreHorizontal,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  Trash2,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCalendars,
  useUpdateCalendar,
  useDeleteCalendar,
} from "../services/calendar-queries";
import type { Calendar } from "@/types/calendar";
import { toast } from "sonner";

interface CalendarListProps {
  selectedCalendars: string[];
  onCalendarSelectionChange: (calendarIds: string[]) => void;
  onCreateCalendar: () => void;
  onEditCalendar: (calendar: Calendar) => void;
  onCalendarSettings: () => void;
}

export function CalendarList({
  selectedCalendars,
  onCalendarSelectionChange,
  onCreateCalendar,
  onEditCalendar,
  onCalendarSettings,
}: CalendarListProps) {
  const { data: calendars = [], isLoading } = useCalendars();
  const updateCalendarMutation = useUpdateCalendar();
  const deleteCalendarMutation = useDeleteCalendar();

  const handleCalendarToggle = (calendarId: string, checked: boolean) => {
    if (checked) {
      onCalendarSelectionChange([...selectedCalendars, calendarId]);
    } else {
      onCalendarSelectionChange(
        selectedCalendars.filter((id) => id !== calendarId)
      );
    }
  };

  const handleVisibilityToggle = async (calendar: Calendar) => {
    try {
      await updateCalendarMutation.mutateAsync({
        calendarId: calendar.id,
        data: { isVisible: !calendar.isVisible },
      });
      toast.success(`Calendar ${calendar.isVisible ? "hidden" : "shown"}`);
    } catch (error) {
      toast.error("Failed to update calendar visibility");
    }
  };

  const handleSetAsDefault = async (calendar: Calendar) => {
    try {
      await updateCalendarMutation.mutateAsync({
        calendarId: calendar.id,
        data: { isDefault: true },
      });
      toast.success("Default calendar updated");
    } catch (error) {
      toast.error("Failed to set default calendar");
    }
  };

  const handleDeleteCalendar = async (calendar: Calendar) => {
    if (
      !confirm(
        `Are you sure you want to delete "${calendar.name}"? This will also delete all events in this calendar.`
      )
    ) {
      return;
    }

    try {
      await deleteCalendarMutation.mutateAsync(calendar.id);
      toast.success("Calendar deleted successfully");
    } catch (error) {
      toast.error("Failed to delete calendar");
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return "🇬";
      case "outlook":
        return "📧";
      case "apple":
        return "🍎";
      case "caldav":
        return "📅";
      case "ical":
        return "📄";
      default:
        return "📅";
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google";
      case "outlook":
        return "Outlook";
      case "apple":
        return "Apple";
      case "caldav":
        return "CalDAV";
      case "ical":
        return "iCal";
      default:
        return "Internal";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendars
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendars
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onCalendarSettings}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onCreateCalendar}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {calendars.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No calendars yet</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={onCreateCalendar}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Calendar
            </Button>
          </div>
        ) : (
          calendars.map((calendar) => (
            <div
              key={calendar.id}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 group"
            >
              <Checkbox
                checked={selectedCalendars.includes(calendar.id)}
                onCheckedChange={(checked) =>
                  handleCalendarToggle(calendar.id, checked as boolean)
                }
              />

              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: calendar.color }}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium truncate">
                    {calendar.name}
                  </span>
                  {calendar.isDefault && (
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  )}
                  {calendar.provider !== "internal" && (
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {getProviderIcon(calendar.provider)}{" "}
                      {getProviderName(calendar.provider)}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {calendar.type} • {calendar.timeZone}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditCalendar(calendar)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSetAsDefault(calendar)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Set as Default
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleVisibilityToggle(calendar)}
                  >
                    {calendar.isVisible ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Show
                      </>
                    )}
                  </DropdownMenuItem>
                  {calendar.provider !== "internal" && (
                    <DropdownMenuItem>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View in {getProviderName(calendar.provider)}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeleteCalendar(calendar)}
                    className="text-destructive"
                    disabled={
                      calendar.isDefault &&
                      calendars.filter((c) => c.isDefault).length === 1
                    }
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
