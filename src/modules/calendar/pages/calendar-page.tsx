import React, { useState } from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  Calendar as CalendarIcon,
  Plus,
  Settings,
  ExternalLink,
  BarChart3,
  CalendarDays,
  Clock,
  Activity,
} from "lucide-react";
import {
  useCalendars,
  useCalendarStats,
  useCreateEvent,
  useCalendarPreferences,
  useUpdateCalendarPreferences,
  useCalendarConnectionStats,
  useDeleteCalendar,
} from "../services/calendar-queries";
import { CalendarList } from "@/modules/calendar/components/calendar-list";
import { CalendarForm } from "@/modules/calendar/components/calendar-form";
import { CalendarConnections } from "@/modules/calendar/components/calendar-connections";
import ShadcnBigCalendarComponent from "@/modules/calendar/components/schedule-x-calendar";
import EventForm from "@/modules/calendar/components/event-form";
import type {
  CalendarTypes,
  CreateEventRequest,
} from "@/modules/calendar/types/calendar.types";
import { toast } from "sonner";
import { CalendarSkeleton } from "@/modules/calendar/components/calendar-skeleton";

export default function CalendarPage() {
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("calendar");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateCalendar, setShowCreateCalendar] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<CalendarTypes | null>(
    null
  );
  const [eventStartTime, setEventStartTime] = useState<Date | undefined>();
  const [eventEndTime, setEventEndTime] = useState<Date | undefined>();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { data: calendars = [], isLoading: calendarsLoading } = useCalendars();
  const { data: stats } = useCalendarStats();
  const { data: preferences } = useCalendarPreferences();
  const { data: connectionStats } = useCalendarConnectionStats();
  const createEventMutation = useCreateEvent();
  const updatePreferencesMutation = useUpdateCalendarPreferences();
  const deleteCalendarMutation = useDeleteCalendar();

  React.useEffect(() => {
    if (calendars?.length > 0 && selectedCalendars.length === 0) {
      setSelectedCalendars(
        calendars.filter((c) => c.isVisible).map((c) => c.id)
      );
    }
  }, [calendars]); // Remove selectedCalendars.length to prevent infinite loop

  const handleCreateEvent = (start?: Date, end?: Date) => {
    setEventStartTime(start);
    setEventEndTime(end);
    setShowCreateEvent(true);
  };

  const handleEventSubmit = async (data: CreateEventRequest) => {
    try {
      await createEventMutation.mutateAsync(data);
      setShowCreateEvent(false);
      setEventStartTime(undefined);
      setEventEndTime(undefined);
      toast.success("Event created successfully");
    } catch {
      toast.error("Failed to create event");
    }
  };

  const handleCreateCalendar = () => {
    setEditingCalendar(null);
    setShowCreateCalendar(true);
  };

  const handleEditCalendar = (calendar: CalendarTypes) => {
    setEditingCalendar(calendar);
    setShowCreateCalendar(true);
  };

  const handleCalendarSuccess = () => {
    setShowCreateCalendar(false);
    setEditingCalendar(null);
  };

  const handleResetAllCalendars = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmResetAllCalendars = async () => {
    try {
      // Delete all non-default calendars
      const calendarsToDelete = calendars.filter((c) => !c.isDefault);
      await Promise.all(
        calendarsToDelete.map((calendar) =>
          deleteCalendarMutation.mutateAsync(calendar.id)
        )
      );
      toast.success("All calendars reset successfully");
      setShowResetConfirm(false);
    } catch {
      toast.error("Failed to reset calendars");
    }
  };

  const handleExportCalendarData = () => {
    const dataToExport = {
      calendars,
      stats,
      preferences,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calendar-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Calendar data exported successfully");
  };

  const contextActions = (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setActiveTab("connections")}
        className="text-muted-foreground hover:text-foreground"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Connections
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setActiveTab("analytics")}
        className="text-muted-foreground hover:text-foreground"
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Analytics
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setActiveTab("settings")}
        className="text-muted-foreground hover:text-foreground"
      >
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button
        onClick={() => handleCreateEvent()}
        size="sm"
        className="bg-primary hover:bg-primary/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Event
      </Button>
    </div>
  );

  if (calendarsLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <>
      <EnhancedHeader contextActions={contextActions} />

      <Main className="space-y-8">
        {/* CalendarTypes Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground text-lg">
              Manage your events, meetings, and schedule across multiple
              calendars
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateCalendar}
              className="hidden md:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Calendar
            </Button>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => setActiveTab("calendar")}
            variant={activeTab === "calendar" ? "default" : "outline"}
            className="p-4 h-auto justify-start"
          >
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium text-sm">Calendar</div>
                <div className="text-xs opacity-70">View & manage events</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => setActiveTab("connections")}
            variant={activeTab === "connections" ? "default" : "outline"}
            className="p-4 h-auto justify-start"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium text-sm">Connections</div>
                <div className="text-xs opacity-70">External calendars</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => setActiveTab("analytics")}
            variant={activeTab === "analytics" ? "default" : "outline"}
            className="p-4 h-auto justify-start"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium text-sm">Analytics</div>
                <div className="text-xs opacity-70">Calendar insights</div>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => setActiveTab("settings")}
            variant={activeTab === "settings" ? "default" : "outline"}
            className="p-4 h-auto justify-start"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium text-sm">Settings</div>
                <div className="text-xs opacity-70">Preferences</div>
              </div>
            </div>
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "calendar" && (
          <div className="space-y-8">
            {/* Calendar Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12">
              {/* Calendar List - Compact Sidebar */}
              <div className="xl:col-span-3">
                <div className="sticky top-6 h-full">
                  <CalendarList
                    selectedCalendars={selectedCalendars}
                    onCalendarSelectionChange={setSelectedCalendars}
                    onCreateCalendar={handleCreateCalendar}
                    onEditCalendar={handleEditCalendar}
                    onCalendarSettings={() => setActiveTab("settings")}
                  />
                </div>
              </div>

              {/* Main Calendar - Full Width */}
              <div className="xl:col-span-9">
                <div className="bg-card rounded-lg border overflow-hidden">
                  <ShadcnBigCalendarComponent
                    selectedCalendars={selectedCalendars}
                    showCreateEvent={showCreateEvent}
                    onCreateEventClose={() => setShowCreateEvent(false)}
                    onCreateEvent={handleCreateEvent}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "connections" && <CalendarConnections />}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Total Events
                    </p>
                    <p className="text-2xl font-bold">
                      {(stats as any)?.totalEvents || 0}
                    </p>
                  </div>
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Upcoming
                    </p>
                    <p className="text-2xl font-bold">
                      {stats?.upcomingEvents || 0}
                    </p>
                  </div>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      This Week
                    </p>
                    <p className="text-2xl font-bold">
                      {stats?.weekEvents || 0}
                    </p>
                  </div>
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="bg-card rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      This Month
                    </p>
                    <p className="text-2xl font-bold">
                      {stats?.monthEvents || 0}
                    </p>
                  </div>
                  <Activity className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Events by Type */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Events by Type</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {stats?.byType &&
                    Object.entries(stats.byType).length > 0 ? (
                      Object.entries(stats.byType)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([type, count]) => (
                          <div
                            key={type}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="capitalize text-muted-foreground">
                              {type.replace("_", " ")}
                            </span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No events</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Events by Status */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Events by Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {stats?.byStatus &&
                    Object.entries(stats.byStatus).length > 0 ? (
                      Object.entries(stats.byStatus)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([status, count]) => (
                          <div
                            key={status}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="capitalize text-muted-foreground">
                              {status.replace("_", " ")}
                            </span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))
                    ) : (
                      <p className="text-muted-foreground text-sm">No events</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Productivity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Productivity</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Focus Time</span>
                      <span className="font-medium">
                        {stats?.productivity?.focusTime || 0}h
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Meeting Time
                      </span>
                      <span className="font-medium">
                        {stats?.productivity?.meetingTime || 0}h
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Break Time</span>
                      <span className="font-medium">
                        {stats?.productivity?.breakTime || 0}h
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Free Time</span>
                      <span className="font-medium">
                        {stats?.productivity?.freeTime || 0}h
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events by CalendarTypes - Compact */}
            {stats?.byCalendar && Object.keys(stats.byCalendar).length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Events by Calendar</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(stats.byCalendar)
                      .sort(([, a], [, b]) => b - a)
                      .map(([calendarName, count]) => {
                        const calendar = calendars.find(
                          (c) => c.name === calendarName
                        );
                        return (
                          <div
                            key={calendarName}
                            className="flex items-center justify-between p-2 rounded border"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: calendar?.color || "#3B82F6",
                                }}
                              ></div>
                              <span className="text-sm font-medium truncate">
                                {calendarName}
                              </span>
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure your calendar preferences and default settings
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Default Calendar
                    </label>
                    <Select
                      value={preferences?.defaultCalendarId || ""}
                      onValueChange={(value) => {
                        console.log("Default calendar changed to:", value);
                        updatePreferencesMutation.mutate({
                          defaultCalendarId: value,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select default calendar" />
                      </SelectTrigger>
                      <SelectContent>
                        {calendars.map((calendar) => (
                          <SelectItem key={calendar.id} value={calendar.id}>
                            {calendar.name}{" "}
                            {calendar.isDefault ? "(Default)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Events will be created in this calendar by default
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Zone</label>
                    <Select
                      value={preferences?.timeZone || "UTC"}
                      onValueChange={(value) =>
                        updatePreferencesMutation.mutate({
                          timeZone: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">
                          Eastern Time
                        </SelectItem>
                        <SelectItem value="America/Chicago">
                          Central Time
                        </SelectItem>
                        <SelectItem value="America/Denver">
                          Mountain Time
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Pacific Time
                        </SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Europe/Paris">Paris</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                        <SelectItem value="Asia/Dhaka">Dhaka</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Your local time zone for calendar display
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Display Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">
                          Show Weekends
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Display Saturday and Sunday in calendar views
                        </p>
                      </div>
                      <Checkbox
                        checked={
                          preferences?.displayPreferences?.showWeekends ?? true
                        }
                        onCheckedChange={(checked) =>
                          updatePreferencesMutation.mutate({
                            displayPreferences: {
                              ...preferences?.displayPreferences,
                              showWeekends: checked as boolean,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">
                          Show Declined Events
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Include events you've declined in calendar views
                        </p>
                      </div>
                      <Checkbox
                        checked={
                          preferences?.displayPreferences?.showDeclinedEvents ??
                          false
                        }
                        onCheckedChange={(checked) =>
                          updatePreferencesMutation.mutate({
                            displayPreferences: {
                              ...preferences?.displayPreferences,
                              showDeclinedEvents: checked as boolean,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">
                          24-Hour Format
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Use 24-hour time format instead of AM/PM
                        </p>
                      </div>
                      <Checkbox
                        checked={
                          preferences?.displayPreferences?.use24HourFormat ??
                          false
                        }
                        onCheckedChange={(checked) =>
                          updatePreferencesMutation.mutate({
                            displayPreferences: {
                              ...preferences?.displayPreferences,
                              use24HourFormat: checked as boolean,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CalendarTypes Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Calendar Management
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage your calendars, colors, and visibility settings
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calendars.map((calendar) => (
                    <div
                      key={calendar.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: calendar.color }}
                        ></div>
                        <div>
                          <p className="font-medium">{calendar.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {calendar.type} •{" "}
                            {calendar.isVisible ? "Visible" : "Hidden"}
                            {calendar.isDefault && " • Default"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCalendar(calendar)}
                        >
                          Edit
                        </Button>
                        {!calendar.isDefault && (
                          <Button variant="outline" size="sm">
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={handleCreateCalendar}
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sync Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Synchronization Settings
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure how your calendars sync with external providers
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">
                        Auto-sync Enabled
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Automatically sync calendars in the background
                      </p>
                    </div>
                    <Checkbox
                      checked={
                        preferences?.syncSettings?.autoSyncEnabled ?? true
                      }
                      onCheckedChange={(checked) =>
                        updatePreferencesMutation.mutate({
                          syncSettings: {
                            ...preferences?.syncSettings,
                            autoSyncEnabled: checked as boolean,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Sync Frequency
                      </label>
                      <Select
                        value={
                          preferences?.syncSettings?.syncFrequency?.toString() ||
                          "15"
                        }
                        onValueChange={(value) =>
                          updatePreferencesMutation.mutate({
                            syncSettings: {
                              ...preferences?.syncSettings,
                              syncFrequency: parseInt(value),
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sync frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">Every 5 minutes</SelectItem>
                          <SelectItem value="15">Every 15 minutes</SelectItem>
                          <SelectItem value="30">Every 30 minutes</SelectItem>
                          <SelectItem value="60">Every hour</SelectItem>
                          <SelectItem value="240">Every 4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Conflict Resolution
                      </label>
                      <Select
                        value={
                          preferences?.syncSettings?.conflictResolution ||
                          "manual"
                        }
                        onValueChange={(value) =>
                          updatePreferencesMutation.mutate({
                            syncSettings: {
                              ...preferences?.syncSettings,
                              conflictResolution: value as
                                | "local"
                                | "remote"
                                | "manual",
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select conflict resolution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">
                            Prefer Local Changes
                          </SelectItem>
                          <SelectItem value="remote">
                            Prefer Remote Changes
                          </SelectItem>
                          <SelectItem value="manual">Ask Me</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Sync History</h4>
                  <div className="space-y-2">
                    {connectionStats?.recentSyncActivity?.length ? (
                      connectionStats.recentSyncActivity
                        .sort(
                          (a, b) =>
                            new Date(b.startedAt).getTime() -
                            new Date(a.startedAt).getTime()
                        )
                        .slice(0, 5)
                        .map((sync) => (
                          <div
                            key={sync.connectionId + sync.startedAt}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium">Last Sync</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  sync.completedAt || sync.startedAt
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`text-sm font-medium ${
                                  sync.status === "success"
                                    ? "text-green-600"
                                    : sync.status === "error"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {sync.status.charAt(0).toUpperCase() +
                                  sync.status.slice(1)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {sync.eventsProcessed} events synced
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">No sync history</p>
                          <p className="text-xs text-muted-foreground">
                            No recent sync activity found
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Configure how you receive calendar notifications and reminders
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">
                        Email Notifications
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Receive calendar updates via email
                      </p>
                    </div>
                    <Checkbox
                      checked={
                        preferences?.notificationSettings?.emailNotifications ??
                        true
                      }
                      onCheckedChange={(checked) =>
                        updatePreferencesMutation.mutate({
                          notificationSettings: {
                            ...preferences?.notificationSettings,
                            emailNotifications: checked as boolean,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">
                        Push Notifications
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Receive push notifications for events
                      </p>
                    </div>
                    <Checkbox
                      checked={
                        preferences?.notificationSettings?.pushNotifications ??
                        true
                      }
                      onCheckedChange={(checked) =>
                        updatePreferencesMutation.mutate({
                          notificationSettings: {
                            ...preferences?.notificationSettings,
                            pushNotifications: checked as boolean,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">
                        SMS Notifications
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Receive SMS alerts for important events
                      </p>
                    </div>
                    <Checkbox
                      checked={
                        preferences?.notificationSettings?.smsNotifications ??
                        false
                      }
                      onCheckedChange={(checked) =>
                        updatePreferencesMutation.mutate({
                          notificationSettings: {
                            ...preferences?.notificationSettings,
                            smsNotifications: checked as boolean,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">
                    Default Reminder Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Email Reminder
                      </label>
                      <Select
                        value={
                          preferences?.notificationSettings?.defaultEmailReminder?.toString() ||
                          "15"
                        }
                        onValueChange={(value) =>
                          updatePreferencesMutation.mutate({
                            notificationSettings: {
                              ...preferences?.notificationSettings,
                              defaultEmailReminder: parseInt(value),
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select email reminder" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No reminder</SelectItem>
                          <SelectItem value="5">5 minutes before</SelectItem>
                          <SelectItem value="15">15 minutes before</SelectItem>
                          <SelectItem value="30">30 minutes before</SelectItem>
                          <SelectItem value="60">1 hour before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Popup Reminder
                      </label>
                      <Select
                        value={
                          preferences?.notificationSettings?.defaultPopupReminder?.toString() ||
                          "15"
                        }
                        onValueChange={(value) =>
                          updatePreferencesMutation.mutate({
                            notificationSettings: {
                              ...preferences?.notificationSettings,
                              defaultPopupReminder: parseInt(value),
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select popup reminder" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No reminder</SelectItem>
                          <SelectItem value="5">5 minutes before</SelectItem>
                          <SelectItem value="15">15 minutes before</SelectItem>
                          <SelectItem value="30">30 minutes before</SelectItem>
                          <SelectItem value="60">1 hour before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Irreversible actions that affect your calendar data
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50">
                  <div>
                    <p className="font-medium text-red-900">
                      Reset All Calendars
                    </p>
                    <p className="text-sm text-red-700">
                      This will remove all your calendars and events. This
                      action cannot be undone.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleResetAllCalendars}
                    disabled={deleteCalendarMutation.isPending}
                  >
                    {deleteCalendarMutation.isPending
                      ? "Resetting..."
                      : "Reset All"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50">
                  <div>
                    <p className="font-medium text-red-900">
                      Export Calendar Data
                    </p>
                    <p className="text-sm text-red-700">
                      Download all your calendar data as a backup file.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportCalendarData}
                  >
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Event Dialog */}
        <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <EventForm
              initialStart={eventStartTime}
              initialEnd={eventEndTime}
              onSubmit={handleEventSubmit}
              onCancel={() => setShowCreateEvent(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Create/Edit Calendar Dialog */}
        <CalendarForm
          open={showCreateCalendar}
          onOpenChange={setShowCreateCalendar}
          calendar={editingCalendar}
          onSuccess={handleCalendarSuccess}
        />

        {/* Reset All Calendars Confirmation Dialog */}
        <ConfirmDialog
          open={showResetConfirm}
          onOpenChange={setShowResetConfirm}
          title="Reset All Calendars"
          desc="This will remove all your calendars and events. This action cannot be undone."
          confirmText="Reset All Calendars"
          destructive
          handleConfirm={handleConfirmResetAllCalendars}
          isLoading={deleteCalendarMutation.isPending}
        />
      </Main>
    </>
  );
}
