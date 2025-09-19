import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import type {
  IDatabaseView,
  IDatabaseProperty,
  DatabaseRecord,
} from "@/modules/document-view";
import type { DocumentViewConfig } from "../../types/document-view.types";
import { NoDataMessage } from "../../../../components/no-data-message.tsx";

interface DocumentCalendarViewProps {
  view: IDatabaseView;
  properties: IDatabaseProperty[];
  records: DatabaseRecord[];
  onRecordSelect?: (record: DatabaseRecord) => void;
  onRecordEdit?: (record: DatabaseRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onRecordUpdate?: (recordId: string, updates: Record<string, unknown>) => void;
  dataSourceId?: string;
  config?: DocumentViewConfig;
}

export function DocumentCalendarView({
  properties,
  records,
  onRecordSelect,
}: DocumentCalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Find date properties
  const dateProperty =
    properties.find((p) => p.type === "date") ||
    properties.find((p) => p.name.toLowerCase().includes("date")) ||
    properties.find((p) => p.name.toLowerCase().includes("due"));

  const titleProperty =
    properties.find((p) => p.name.toLowerCase() === "title") ||
    properties.find((p) => p.type === "text");

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Group records by date
  const recordsByDate = React.useMemo(() => {
    if (!dateProperty) return {};

    const grouped: Record<string, DatabaseRecord[]> = {};

    records.forEach((record) => {
      const dateValue = record.properties?.[dateProperty.id];
      if (dateValue) {
        const date = new Date(String(dateValue));
        if (!isNaN(date.getTime())) {
          const dateKey = date.toISOString().split("T")[0];
          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }
          grouped[dateKey].push(record);
        }
      }
    });

    return grouped;
  }, [records, dateProperty]);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleRecordClick = (record: DatabaseRecord) => {
    if (onRecordSelect) {
      onRecordSelect(record);
    }
  };

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!dateProperty) {
    return (
      <NoDataMessage
        title="No Date Property Found"
        message="Add a date property to your data to use the calendar view."
        icon={CalendarIcon}
      />
    );
  }

  return (
    <div className="w-full h-full overflow-auto p-4">
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">
            {monthNames[month]} {year}
          </h2>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={index} className="p-2 h-32" />;
          }

          const dateKey = new Date(year, month, day)
            .toISOString()
            .split("T")[0];
          const dayRecords = recordsByDate[dateKey] || [];
          const isToday =
            new Date().toDateString() ===
            new Date(year, month, day).toDateString();

          return (
            <Card
              key={day}
              className={`h-32 overflow-hidden ${
                isToday ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardContent className="p-2 h-full flex flex-col">
                {/* Day number */}
                <div
                  className={`text-sm font-medium mb-1 ${
                    isToday ? "text-primary" : ""
                  }`}
                >
                  {day}
                </div>

                {/* Records for this day */}
                <div className="flex-1 overflow-hidden space-y-1">
                  {dayRecords.slice(0, 3).map((record) => {
                    const title = titleProperty
                      ? record.properties?.[titleProperty.id]
                      : record.id;

                    return (
                      <div
                        key={record.id}
                        className="text-xs p-1 bg-primary/10 text-primary rounded cursor-pointer hover:bg-primary/20 transition-colors truncate"
                        onClick={() => handleRecordClick(record)}
                        title={String(title)}
                      >
                        {String(title) || "Untitled"}
                      </div>
                    );
                  })}

                  {dayRecords.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayRecords.length - 3} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary/10 rounded" />
          <span>Events</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-primary rounded" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
