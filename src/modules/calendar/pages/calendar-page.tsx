import React, { useState } from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Filter,
  ExternalLink,
  BarChart3,
  Users,
  Clock,
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
  const [showCalendarSettings, setShowCalendarSettings] = useState(false);
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
    } catch (error) {
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
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setActiveTab("connections")}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Connections
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setActiveTab("analytics")}
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Analytics
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowCalendarSettings(true)}
      >
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
      <Button onClick={() => handleCreateEvent()} size="sm">
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

      <Main className="space-y-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">
              Manage your events, meetings, and schedule across multiple
              calendars
            </p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="connections"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Connections
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            {/* Calendar Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Events
                  </CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalEvents || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All time events
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    This Week
                  </CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.weekEvents || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Events this week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Calendars
                  </CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{calendars.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active calendars
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    This Month
                  </CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.monthEvents || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Events this month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Calendar Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <CalendarList
                  selectedCalendars={selectedCalendars}
                  onCalendarSelectionChange={setSelectedCalendars}
                  onCreateCalendar={handleCreateCalendar}
                  onEditCalendar={handleEditCalendar}
                  onCalendarSettings={() => setActiveTab("settings")}
                />
              </div>

              {/* Main Calendar */}
              <div className="lg:col-span-3">
                <ShadcnBigCalendarComponent
                  selectedCalendars={selectedCalendars}
                  showCreateEvent={showCreateEvent}
                  onCreateEventClose={() => setShowCreateEvent(false)}
                  onCreateEvent={handleCreateEvent}
                />
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
