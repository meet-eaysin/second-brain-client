import React, { useState } from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
} from "../services/calendar-queries";
import { CalendarList } from "../components/calendar-list";
import { CalendarForm } from "../components/calendar-form";
import { CalendarConnections } from "../components/calendar-connections";
import ShadcnBigCalendarComponent from "../components/schedule-x-calendar";
import EventForm from "../components/event-form";
import type { Calendar, CreateEventRequest } from "@/types/calendar";
import { toast } from "sonner";

export default function CalendarPage() {
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("calendar");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateCalendar, setShowCreateCalendar] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null);
  const [eventStartTime, setEventStartTime] = useState<Date | undefined>();
  const [eventEndTime, setEventEndTime] = useState<Date | undefined>();

  const { data: calendars = [], isLoading: calendarsLoading } = useCalendars();
  const { data: stats } = useCalendarStats();
  const createEventMutation = useCreateEvent();

  React.useEffect(() => {
    if (calendars.length > 0 && selectedCalendars.length === 0) {
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

  const handleEditCalendar = (calendar: Calendar) => {
    setEditingCalendar(calendar);
    setShowCreateCalendar(true);
  };

  const handleCalendarSuccess = () => {
    setShowCreateCalendar(false);
    setEditingCalendar(null);
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
    return (
      <>
        <EnhancedHeader />
        <Main className="space-y-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Main>
      </>
    );
  }

  return (
    <>
      <EnhancedHeader contextActions={contextActions} />

      <Main className="space-y-8">
        {/* Calendar Header */}
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

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger
              value="calendar"
              className="flex items-center gap-2 text-sm"
            >
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="connections"
              className="flex items-center gap-2 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              Connections
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 text-sm"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 text-sm"
            >
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Events
                    </p>
                    <p className="text-3xl font-bold">
                      {stats?.totalEvents || 0}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  All time events
                </p>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      This Week
                    </p>
                    <p className="text-3xl font-bold">
                      {stats?.weekEvents || 0}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Events this week
                </p>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Calendars
                    </p>
                    <p className="text-3xl font-bold">{calendars.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CalendarDays className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Active calendars
                </p>
              </div>

              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      This Month
                    </p>
                    <p className="text-3xl font-bold">
                      {stats?.monthEvents || 0}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Events this month
                </p>
              </div>
            </div>

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
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections">
            <CalendarConnections />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Events by Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Events by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats?.byType &&
                      Object.entries(stats.byType).map(([type, count]) => (
                        <div
                          key={type}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm capitalize">
                            {type.replace("_", " ")}
                          </span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Events by Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Events by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats?.byStatus &&
                      Object.entries(stats.byStatus).map(([status, count]) => (
                        <div
                          key={status}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm capitalize">
                            {status.replace("_", " ")}
                          </span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Events by Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Events by Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats?.byCalendar &&
                      Object.entries(stats.byCalendar).map(
                        ([calendar, count]) => (
                          <div
                            key={calendar}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm truncate">{calendar}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        )
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Calendar settings and preferences will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
      </Main>
    </>
  );
}
