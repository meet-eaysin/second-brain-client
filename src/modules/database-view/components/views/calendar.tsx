import { useMemo } from "react";
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from "@/components/ui/kibo-ui/calendar";
import { useDatabaseView } from "@/modules/database-view/context";
import { NoDataMessage } from "@/components/no-data-message.tsx";
import type { TRecord } from "@/modules/database-view/types";
import { EPropertyType } from "@/modules/database-view/types";

interface CalendarProps {
  className?: string;
}

export function Calendar({ className = "" }: CalendarProps) {
  const {
    properties,
    records,
    isRecordsLoading,
    isPropertiesLoading,
    onRecordEdit,
  } = useDatabaseView();

  // Find date properties for calendar display
  const dateProperties = useMemo(() => {
    return properties.filter((p) => p.type === EPropertyType.DATE);
  }, [properties]);

  // Find title property for display
  const titleProperty = useMemo(() => {
    return (
      properties.find((p) => p.type === EPropertyType.TEXT) ||
      properties.find((p) => p.name.toLowerCase().includes("title")) ||
      properties.find((p) => p.name.toLowerCase().includes("name")) ||
      properties[0]
    );
  }, [properties]);

  // Transform records for calendar format
  const calendarFeatures = useMemo(() => {
    if (!records || !Array.isArray(records)) {
      return [];
    }

    const features: Array<{
      id: string;
      name: string;
      startAt: Date;
      endAt: Date;
      status: { id: string; name: string; color: string };
    }> = [];

    records.forEach((record: TRecord) => {
      // Use date properties if available, otherwise fall back to createdAt
      const dateSources =
        dateProperties.length > 0
          ? dateProperties
          : [{ id: "createdAt", name: "Created Date", type: "date" }];

      dateSources.forEach((dateSource) => {
        let dateValue: string | null = null;

        if (dateProperties.length > 0) {
          // Use actual date property
          dateValue = record.properties[dateSource.name] as string;
        } else {
          // Fall back to createdAt timestamp
          dateValue = record.createdAt || record.created_at;
        }

        if (dateValue) {
          const startDate = new Date(dateValue);
          const endDate = new Date(dateValue); // Single day event

          // Use title property for name
          const titleValue = titleProperty
            ? record.properties[titleProperty.name] ?? "Untitled"
            : "Untitled";
          const name = String(titleValue);

          // Create status based on date source
          const status = {
            id: dateSource.id,
            name: dateSource.name,
            color: dateProperties.length > 0 ? "#3B82F6" : "#10B981", // Blue for date props, green for created
          };

          features.push({
            id: `${record.id}-${dateSource.id}`,
            name,
            startAt: startDate,
            endAt: endDate,
            status,
          });
        }
      });
    });

    return features;
  }, [records, dateProperties, titleProperty]);

  // Create a map to store record data for click handling
  const recordMap = useMemo(() => {
    const map = new Map<string, TRecord>();
    if (!records || !Array.isArray(records)) {
      return map;
    }

    records.forEach((record: TRecord) => {
      // Use date properties if available, otherwise fall back to createdAt
      const dateSources =
        dateProperties.length > 0
          ? dateProperties
          : [{ id: "createdAt", name: "Created Date", type: "date" }];

      dateSources.forEach((dateSource) => {
        let dateValue: string | null = null;

        if (dateProperties.length > 0) {
          // Use actual date property
          dateValue = record.properties[dateSource.name] as string;
        } else {
          // Fall back to createdAt timestamp
          dateValue = record.createdAt || record.created_at;
        }

        if (dateValue) {
          const featureId = `${record.id}-${dateSource.id}`;
          map.set(featureId, record);
        }
      });
    });

    return map;
  }, [records, dateProperties]);

  // Calculate year range for the date picker
  const yearRange = useMemo(() => {
    if (calendarFeatures.length === 0) {
      const currentYear = new Date().getFullYear();
      return { start: currentYear, end: currentYear };
    }

    const years = calendarFeatures.flatMap((feature) => [
      feature.startAt.getFullYear(),
      feature.endAt.getFullYear(),
    ]);

    const start = Math.min(...years);
    const end = Math.max(...years);

    return { start, end };
  }, [calendarFeatures]);

  // Show loading state
  if (isPropertiesLoading || isRecordsLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">
            {isPropertiesLoading
              ? "Loading properties..."
              : "Loading records..."}
          </p>
        </div>
      </div>
    );
  }

  // Show empty state if no records
  if (!records || records.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <NoDataMessage message="No records to display" />
      </div>
    );
  }

  // Show message if no records (fallback to createdAt should work if records exist)
  if (dateProperties.length === 0 && (!records || records.length === 0)) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <NoDataMessage message="Calendar view requires records with creation dates or DATE properties" />
      </div>
    );
  }

  return (
    <div className={`w-full h-full overflow-auto ${className}`}>
      <CalendarProvider>
        <CalendarDate>
          <CalendarDatePicker>
            <CalendarMonthPicker />
            <CalendarYearPicker end={yearRange.end} start={yearRange.start} />
          </CalendarDatePicker>
          <CalendarDatePagination />
        </CalendarDate>
        <CalendarHeader />
        <CalendarBody features={calendarFeatures}>
          {({ feature }) => {
            const record = recordMap.get(feature.id);
            return (
              <div
                key={feature.id}
                className="cursor-pointer"
                onClick={() => record && onRecordEdit?.(record)}
              >
                <CalendarItem feature={feature} />
              </div>
            );
          }}
        </CalendarBody>
      </CalendarProvider>
    </div>
  );
}
