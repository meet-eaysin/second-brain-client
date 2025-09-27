import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/modules/calendar/services/calendar-queries";
import type { CalendarTypes } from "@/modules/calendar/types/calendar.types.ts";
import { toast } from "sonner";

interface CalendarListProps {
  selectedCalendars: string[];
  onCalendarSelectionChange: (calendarIds: string[]) => void;
  onCreateCalendar: () => void;
  onEditCalendar: (calendar: CalendarTypes) => void;
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

  const handleVisibilityToggle = async (calendar: CalendarTypes) => {
    try {
      await updateCalendarMutation.mutateAsync({
        calendarId: calendar.id,
        data: { isVisible: !calendar.isVisible },
      });
      toast.success(`Calendar ${calendar.isVisible ? "hidden" : "shown"}`);
    } catch {
      toast.error("Failed to update calendar visibility");
    }
  };

  const handleSetAsDefault = async (calendar: CalendarTypes) => {
    try {
      await updateCalendarMutation.mutateAsync({
        calendarId: calendar.id,
        data: { isDefault: true },
      });
      toast.success("Default calendar updated");
    } catch {
      toast.error("Failed to set default calendar");
    }
  };

  const handleDeleteCalendar = async (calendar: CalendarTypes) => {
    if (
      !confirm(
        `Are you sure you want to delete "${calendar.name}"? This will also delete all events in this calendar.`
      )
    ) {
      return;
    }

    try {
      await deleteCalendarMutation.mutateAsync(calendar.id);
      toast.success("CalendarTypes deleted successfully");
    } catch {
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
    <div className="bg-card rounded-lg border border-r-0 h-full">
      <div className="p-2 md:p-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <CalendarIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-lg truncate">Calendars</h3>
              <p className="text-sm text-muted-foreground">
                {calendars.length} calendar{calendars.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button variant="ghost" size="sm" onClick={onCalendarSettings}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onCreateCalendar}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {calendars.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="font-medium mb-2">No calendars yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first calendar to get started
            </p>
            <Button onClick={onCreateCalendar} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Calendar
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {calendars.map((calendar) => (
              <div
                key={calendar.id}
                className="group relative p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedCalendars.includes(calendar.id)}
                    onCheckedChange={(checked) =>
                      handleCalendarToggle(calendar.id, checked as boolean)
                    }
                    className="mt-0.5 flex-shrink-0"
                  />

                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 border-2 border-white shadow-sm"
                    style={{ backgroundColor: calendar.color }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">
                        {calendar.name}
                      </span>
                      <div className="flex flex-wrap items-center gap-1">
                        {calendar.isDefault && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-full">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-xs font-medium">Default</span>
                          </div>
                        )}
                        {calendar.provider !== "internal" && (
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded-full">
                            <span className="text-xs">
                              {getProviderIcon(calendar.provider)}
                            </span>
                            <span className="text-xs font-medium hidden sm:inline">
                              {getProviderName(calendar.provider)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{calendar.type}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">{calendar.timeZone}</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => onEditCalendar(calendar)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Calendar
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
                            Hide Calendar
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Show Calendar
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
                        className="text-destructive focus:text-destructive"
                        disabled={
                          calendar.isDefault &&
                          calendars.filter((c) => c.isDefault).length === 1
                        }
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Calendar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
