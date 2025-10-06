import { useMemo } from "react";
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from "@/components/ui/kibo-ui/calendar";
import { useDatabaseView } from "@/modules/database-view/context";
import { NoDataMessage } from "@/components/no-data-message.tsx";
import { CalendarSkeleton } from "../skeleton";
import type { TRecord, TPropertyValue } from "@/modules/database-view/types";
import { EPropertyType } from "@/modules/database-view/types";

interface CalendarProps {
  className?: string;
}

export const Calendar = ({ className = "" }: CalendarProps) => {
  const { properties, records, isRecordsLoading, isPropertiesLoading } =
    useDatabaseView();

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

  // Find display properties (excluding title and date properties)
  const displayProperties = useMemo(() => {
    const excludedIds = new Set(
      [titleProperty?.name, ...dateProperties.map((p) => p.name)].filter(
        Boolean
      )
    );

    return properties.filter((p) => !excludedIds.has(p.name) && p.isVisible);
  }, [properties, titleProperty?.name, dateProperties]);

  const renderPropertyValue = (
    property: (typeof properties)[0],
    value: TPropertyValue
  ) => {
    if (value === null || value === undefined || value === "") return null;

    switch (property.type) {
      case EPropertyType.SELECT:
        if (property.config?.options) {
          const option = property.config.options.find(
            (opt) => opt.id === value
          );
          if (option) {
            return (
              <span
                className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-xs"
                style={{
                  backgroundColor: option.color + "20",
                  color: option.color,
                }}
              >
                {option.label}
              </span>
            );
          }
        }
        return <span className="text-xs">{String(value)}</span>;

      case EPropertyType.MULTI_SELECT:
        if (Array.isArray(value) && property.config?.options) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 2).map((val) => {
                const option = property?.config?.options?.find(
                  (opt) => opt.id === val
                );
                return (
                  <span
                    key={String(val)}
                    className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: option?.color + "20",
                      color: option?.color,
                    }}
                  >
                    {option?.label || String(val)}
                  </span>
                );
              })}
              {value.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{value.length - 2}
                </span>
              )}
            </div>
          );
        }
        return null;

      case EPropertyType.CHECKBOX:
        return (
          <span
            className={`text-xs ${value ? "text-green-600" : "text-red-600"}`}
          >
            {value ? "✓" : "✗"}
          </span>
        );

      case EPropertyType.DATE:
        return (
          <span className="text-xs text-muted-foreground">
            {value ? new Date(String(value)).toLocaleDateString() : "-"}
          </span>
        );

      case EPropertyType.DATE_RANGE:
        if (value && typeof value === "object" && "start" in value) {
          const range = value as { start?: string | Date; end?: string | Date };
          const start = range.start
            ? new Date(range.start).toLocaleDateString()
            : null;
          const end = range.end
            ? new Date(range.end).toLocaleDateString()
            : null;
          if (start && end) {
            return (
              <span className="text-xs text-muted-foreground">
                {start} - {end}
              </span>
            );
          } else if (start) {
            return (
              <span className="text-xs text-muted-foreground">{start}</span>
            );
          } else if (end) {
            return <span className="text-xs text-muted-foreground">{end}</span>;
          }
        }
        return <span className="text-xs text-muted-foreground">-</span>;

      case EPropertyType.CREATED_TIME:
      case EPropertyType.LAST_EDITED_TIME:
        return (
          <span className="text-xs text-muted-foreground">
            {value
              ? new Date(value as string | Date).toLocaleDateString()
              : "-"}
          </span>
        );

      case EPropertyType.NUMBER:
        return <span className="text-xs font-medium">{String(value)}</span>;

      case EPropertyType.RICH_TEXT:
        return (
          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
            {String(value) || "-"}
          </span>
        );

      default:
        return (
          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
            {String(value)}
          </span>
        );
    }
  };

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
          dateValue = String(record.createdAt);
        }

        if (dateValue) {
          const startDate = new Date(dateValue);
          const endDate = new Date(dateValue); // Single day event

          // Use title property for name
          let name = "Untitled";
          if (titleProperty) {
            const titleValue = record.properties[titleProperty.name];

            if (
              titleValue !== null &&
              titleValue !== undefined &&
              titleValue !== ""
            ) {
              // For select/multi-select, try to get the label
              if (
                titleProperty.type === EPropertyType.SELECT ||
                titleProperty.type === EPropertyType.MULTI_SELECT
              ) {
                const option = titleProperty.config?.options?.find(
                  (opt) => opt.id === titleValue
                );
                name = option?.label || String(titleValue);
              } else {
                name = String(titleValue);
              }
            } else {
              // Fallback: try other text properties or use record ID
              const fallbackProps = properties.filter(
                (p) =>
                  p.type === EPropertyType.TEXT &&
                  p.name !== titleProperty.name &&
                  record.properties[p.name]
              );

              if (fallbackProps.length > 0) {
                const fallbackValue = record.properties[fallbackProps[0].name];
                name = String(fallbackValue);
              } else {
                // Use short record ID as last resort
                name = `Untitled`;
              }
            }
          }

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
          dateValue = String(record.createdAt);
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
    return <CalendarSkeleton />;
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
            if (!record) return null;

            return (
              <div
                key={feature.id}
                className="bg-background border rounded-md p-2 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Title and status */}
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: feature.status.color }}
                  />
                  <span className="font-medium text-sm truncate">
                    {feature.name}
                  </span>
                </div>

                {/* Display additional properties */}
                {displayProperties.length > 0 && (
                  <div className="space-y-1">
                    {displayProperties.slice(0, 2).map((property) => {
                      // Handle system properties that are stored at record level
                      let value;
                      if (property.type === EPropertyType.CREATED_TIME) {
                        value = record.createdAt;
                      } else if (
                        property.type === EPropertyType.LAST_EDITED_TIME
                      ) {
                        value = record.lastEditedAt || record.updatedAt;
                      } else if (property.type === EPropertyType.RICH_TEXT) {
                        // Extract plain text from content blocks
                        value = record.content
                          ? record.content
                              .map((block) =>
                                block.content
                                  .map((richText) => richText.plain_text)
                                  .join("")
                              )
                              .join("\n")
                          : "";
                      } else {
                        // Properties are stored by name, not ID
                        value = record.properties[property.name];
                      }
                      if (value === null || value === undefined || value === "")
                        return null;

                      return (
                        <div
                          key={property.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-muted-foreground">
                            {property.name}:
                          </span>
                          <div className="flex-shrink-0 ml-1">
                            {renderPropertyValue(property, value)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }}
        </CalendarBody>
      </CalendarProvider>
    </div>
  );
};
