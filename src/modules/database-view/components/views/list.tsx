import { useMemo } from "react";
import type { DragEndEvent } from "@/components/ui/kibo-ui/list";
import {
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from "@/components/ui/kibo-ui/list";
import { Badge } from "@/components/ui/badge";
import { useDatabaseView } from "@/modules/database-view/context";
import { useUpdateRecord } from "@/modules/database-view/services/database-queries";
import { NoDataMessage } from "@/components/no-data-message.tsx";
import type { TRecord, TPropertyValue } from "@/modules/database-view/types";
import { EPropertyType } from "@/modules/database-view/types";

interface ListProps {
  className?: string;
}

export function List({ className = "" }: ListProps) {
  const {
    database,
    properties,
    records,
    currentView,
    isRecordsLoading,
    isPropertiesLoading,
    onRecordEdit,
  } = useDatabaseView();

  const { mutateAsync: updateRecordMutation } = useUpdateRecord();

  // Find grouping property (SELECT or STATUS)
  const groupingProperty = useMemo(() => {
    return (
      properties.find((p) => p.type === EPropertyType.SELECT) ||
      properties.find((p) => p.type === EPropertyType.STATUS)
    );
  }, [properties]);

  // Create status groups from grouping property options
  const statuses = useMemo(() => {
    if (!groupingProperty?.config?.options) {
      return [{ id: "ungrouped", name: "Ungrouped", color: "#6b7280" }];
    }

    const statusList = groupingProperty.config.options.map((option) => ({
      id: option.id,
      name: option.label,
      color: option.color || "#6b7280",
    }));

    // Add ungrouped if view settings allow it
    if (currentView?.settings?.showUngrouped !== false) {
      statusList.push({ id: "ungrouped", name: "Ungrouped", color: "#6b7280" });
    }

    return statusList;
  }, [groupingProperty, currentView?.settings?.showUngrouped]);

  // Find title property
  const titleProperty = useMemo(() => {
    return (
      properties.find((p) => p.type === EPropertyType.TEXT) ||
      properties.find((p) => p.name.toLowerCase().includes("title")) ||
      properties.find((p) => p.name.toLowerCase().includes("name")) ||
      properties[0]
    );
  }, [properties]);

  // Find display properties (excluding title and grouping properties)
  const displayProperties = useMemo(() => {
    const excludedIds = new Set(
      [titleProperty?.id, groupingProperty?.id].filter(Boolean)
    );

    return properties.filter((p) => !excludedIds.has(p.id) && p.isVisible);
  }, [properties, titleProperty?.id, groupingProperty?.id]);

  // Helper function to render property values
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
              <Badge
                variant="outline"
                className="text-xs text-white border-0"
                style={{ backgroundColor: option.color || "#6b7280" }}
              >
                {option.label}
              </Badge>
            );
          }
        }
        return (
          <Badge variant="secondary" className="text-xs">
            {String(value)}
          </Badge>
        );

      case EPropertyType.MULTI_SELECT:
        if (Array.isArray(value) && property.config?.options) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 2).map((val, index) => {
                const option = property?.config?.options?.find(
                  (opt) => opt.id === val
                );
                return (
                  <Badge
                    key={String(val) || index}
                    variant="outline"
                    className="text-xs text-white border-0"
                    style={{ backgroundColor: option?.color || "#6b7280" }}
                  >
                    {option?.label || String(val)}
                  </Badge>
                );
              })}
              {value.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{value.length - 2}
                </Badge>
              )}
            </div>
          );
        }
        return null;

      case EPropertyType.CHECKBOX:
        return (
          <Badge variant={value ? "default" : "secondary"} className="text-xs">
            {value ? "Yes" : "No"}
          </Badge>
        );

      case EPropertyType.DATE:
        return (
          <span className="text-xs text-muted-foreground">
            {value ? new Date(String(value)).toLocaleDateString() : "-"}
          </span>
        );

      case EPropertyType.NUMBER:
        return <span className="text-xs font-medium">{String(value)}</span>;

      default:
        return (
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">
            {String(value)}
          </span>
        );
    }
  };

  // Transform records for List format
  const listFeatures = useMemo(() => {
    if (!records || !Array.isArray(records)) return [];

    return records.map((record: TRecord) => {
      const titleValue = titleProperty
        ? record.properties[titleProperty.id] ?? "Untitled"
        : "Untitled";
      const title = String(titleValue);

      // Get status/grouping value
      const statusValue = groupingProperty
        ? record.properties[groupingProperty.id]
        : "ungrouped";
      const statusId = String(statusValue || "ungrouped");

      // Find the status object
      const status = statuses.find((s) => s.id === statusId) || statuses[0];

      return {
        id: record.id,
        name: title,
        status,
        record, // Keep original record for access
      };
    });
  }, [records, titleProperty, groupingProperty, statuses]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !database?.id || !groupingProperty) {
      return;
    }

    const status = statuses.find((status) => status.name === over.id);

    if (!status) {
      return;
    }

    // Update the record in the database
    const payload: Record<string, TPropertyValue> = {
      [groupingProperty.id]: status.id === "ungrouped" ? null : status.id,
    };

    try {
      await updateRecordMutation({
        databaseId: database.id,
        recordId: String(active.id),
        payload,
      });
    } catch (error) {
      console.error("Failed to update record position:", error);
    }
  };

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

  // Show message if no grouping property
  if (!groupingProperty) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <NoDataMessage message="List view requires a SELECT property for grouping" />
      </div>
    );
  }

  return (
    <div className={`w-full h-full overflow-auto ${className}`}>
      <ListProvider onDragEnd={handleDragEnd}>
        {statuses.map((status) => (
          <ListGroup id={status.name} key={status.name}>
            <ListHeader color={status.color} name={status.name} />
            <ListItems>
              {listFeatures
                .filter((feature) => feature.status.name === status.name)
                .map((feature, index) => (
                  <ListItem
                    id={feature.id}
                    index={index}
                    key={feature.id}
                    name={feature.name}
                    parent={feature.status.name}
                  >
                    <div
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: feature.status.color }}
                    />
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => onRecordEdit?.(feature.record)}
                    >
                      <p className="m-0 font-medium text-sm">{feature.name}</p>
                      {/* Display additional properties */}
                      {displayProperties.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {displayProperties.map((property) => {
                            const value =
                              feature.record.properties[property.id];
                            if (
                              value === null ||
                              value === undefined ||
                              value === ""
                            )
                              return null;

                            return (
                              <div
                                key={property.id}
                                className="flex items-center justify-between"
                              >
                                <span className="text-xs text-muted-foreground font-medium">
                                  {property.name}:
                                </span>
                                <div className="ml-2">
                                  {renderPropertyValue(property, value)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </ListItem>
                ))}
            </ListItems>
          </ListGroup>
        ))}
      </ListProvider>
    </div>
  );
}
