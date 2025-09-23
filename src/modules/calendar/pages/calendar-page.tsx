import React, { useState } from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Plus,
  Settings,
  Filter,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { useCalendars, useCalendarStats } from "../services/calendar-queries";
import ShadcnBigCalendarComponent from "../components/schedule-x-calendar";

export default function CalendarPage() {
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  // Fetch calendars
  const { data: calendars = [], isLoading: calendarsLoading } = useCalendars();

  // Fetch calendar stats
  const { data: stats } = useCalendarStats();

  // Set default selected calendars when calendars load
  React.useEffect(() => {
    if (calendars.length > 0 && selectedCalendars.length === 0) {
      setSelectedCalendars(
        calendars.filter((c) => c.isVisible).map((c) => c.id)
      );
    }
  }, [calendars, selectedCalendars.length]);

  const handleCreateEvent = () => {
    setShowCreateEvent(true);
  };

  const contextActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
      <Button variant="outline" size="sm">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
      <Button onClick={handleCreateEvent} size="sm">
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
              Manage your events, meetings, and schedule
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <CalendarDays className="h-4 w-4 mr-2" />
              Today
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
              <p className="text-xs text-muted-foreground">All time events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.weekEvents || 0}</div>
              <p className="text-xs text-muted-foreground">Events this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calendars</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calendars.length}</div>
              <p className="text-xs text-muted-foreground">Active calendars</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.monthEvents || 0}
              </div>
              <p className="text-xs text-muted-foreground">Events this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Component */}
        <Card>
          <CardContent className="p-6">
            <ShadcnBigCalendarComponent
              selectedCalendars={selectedCalendars}
              showCreateEvent={showCreateEvent}
              onCreateEventClose={() => setShowCreateEvent(false)}
            />
          </CardContent>
        </Card>
      </Main>
    </>
  );
}
