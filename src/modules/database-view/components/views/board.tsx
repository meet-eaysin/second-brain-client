import { useMemo } from "react";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kibo-ui/kanban";
import { Badge } from "@/components/ui/badge";
import { useDatabaseView } from "@/modules/database-view/context";
import { useUpdateRecord } from "@/modules/database-view/services/database-queries";
import { NoDataMessage } from "@/components/no-data-message.tsx";
import type { TRecord, TPropertyValue } from "@/modules/database-view/types";
import { EPropertyType } from "@/modules/database-view/types";

export function Board({ className = "" }: { className?: string }) {
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

  const groupingProperty = useMemo(() => {
    // First check if view has a configured grouping property
    if (currentView?.settings?.groupBy) {
      const configuredProperty = properties.find(
        (p) => p.name === currentView?.settings?.groupBy?.propertyId
      );
      if (configuredProperty) {
        return configuredProperty;
      }
    }

    // Fallback to finding SELECT or STATUS properties
    return (
      properties.find((p) => p.type === EPropertyType.SELECT) ||
      properties.find((p) => p.type === EPropertyType.STATUS)
    );
  }, [properties, currentView?.settings?.groupBy]);

  const columns = useMemo(() => {
    if (!groupingProperty?.config?.options) {
      return [{ id: "ungrouped", name: "Ungrouped", color: "#6b7280" }];
    }

    const cols = groupingProperty.config.options.map((option) => ({
      id: option.id,
      name: option.label,
      color: option.color || "#6b7280",
    }));

    if (currentView?.settings?.showUngrouped !== false) {
      cols.push({ id: "ungrouped", name: "Ungrouped", color: "#6b7280" });
    }

    return cols;
  }, [groupingProperty, currentView?.settings?.showUngrouped]);

  const titleProperty = useMemo(() => {
    return (
      properties.find((p) => p.type === EPropertyType.TEXT) ||
      properties.find((p) => p.name.toLowerCase().includes("title")) ||
      properties.find((p) => p.name.toLowerCase().includes("name")) ||
      properties[0]
    );
  }, [properties]);

  // Find display properties (excluding only grouping properties)
  const displayProperties = useMemo(() => {
    const excludedNames = new Set([groupingProperty?.name].filter(Boolean));

    const result = properties.filter((p) => !excludedNames.has(p.name));
    return result;
  }, [properties, groupingProperty?.name]);

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
                className="text-xs text-white border-0 truncate"
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
                    className="text-xs text-white border-0 truncate"
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

      case EPropertyType.URL:
        return (
          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
            {String(value)}
          </span>
        );

      case EPropertyType.RICH_TEXT:
        return (
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">
            {String(value) || "-"}
          </span>
        );

      default:
        return (
          <span className="text-xs text-muted-foreground truncate max-w-[120px]">
            {String(value)}
          </span>
        );
    }
  };

  const kanbanData = useMemo(() => {
    if (!records || !Array.isArray(records)) return [];

    return records.map((record: TRecord) => {
      const titleValue = titleProperty
        ? record.properties[titleProperty.name] ?? "Untitled"
        : "Untitled";
      const title = String(titleValue);

      const groupValue = groupingProperty
        ? record.properties[groupingProperty.name]
        : "ungrouped";
      const column = String(groupValue || "ungrouped");

      return {
        id: record.id,
        name: title,
        column,
        record,
      };
    });
  }, [records, titleProperty, groupingProperty]);

  const handleDataChange = async (newData: typeof kanbanData) => {
    const changedRecords = newData.filter((item, index) => {
      const original = kanbanData[index];
      return original && item.column !== original.column;
    });

    for (const item of changedRecords) {
      if (!groupingProperty || !database?.id) continue;

      const payload: Record<string, TPropertyValue> = {
        [groupingProperty.name]:
          item.column === "ungrouped" ? null : item.column,
      };

      try {
        await updateRecordMutation({
          databaseId: database.id,
          recordId: String(item.id),
          payload,
        });
      } catch (error) {
        console.error("Failed to update record position:", error);
      }
    }
  };

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

  // Allow board view to work without grouping property - records will be in "ungrouped" column

  return (
    <div className="overflow-x-auto w-full px-4 pb-4">
      <div className="flex gap-2 min-w-max">
        <KanbanProvider
          columns={columns}
          data={kanbanData}
          onDataChange={handleDataChange}
        >
          {(column) => (
            <KanbanBoard
              id={column.id}
              key={column.id}
              className="w-full flex-shrink-0"
            >
              <KanbanHeader>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <span className="font-medium">{column.name}</span>
                  <span className="text-sm text-muted-foreground">
                    (
                    {
                      kanbanData.filter((item) => item.column === column.id)
                        .length
                    }
                    )
                  </span>
                </div>
              </KanbanHeader>
              <KanbanCards id={column.id}>
                {(item: (typeof kanbanData)[number]) => {
                  return (
                    <KanbanCard
                      column={column.id}
                      id={item.id}
                      key={item.id}
                      name={item.name}
                    >
                      <div
                        className="p-2 cursor-pointer max-w-full overflow-hidden"
                        onClick={() => onRecordEdit?.(item.record)}
                      >
                        <p className="m-0 font-medium text-sm line-clamp-2">
                          {item.name}
                        </p>
                        {/* Display additional properties */}
                        {displayProperties.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {displayProperties.map((property) => {
                              // Handle system properties that are stored at record level
                              let value;
                              if (
                                property.type === EPropertyType.CREATED_TIME
                              ) {
                                value = item.record.createdAt;
                              } else if (
                                property.type === EPropertyType.LAST_EDITED_TIME
                              ) {
                                value =
                                  item.record.lastEditedAt ||
                                  item.record.updatedAt;
                              } else if (
                                property.type === EPropertyType.RICH_TEXT
                              ) {
                                // Extract plain text from content blocks
                                value = item.record.content
                                  ? item.record.content
                                      .map((block) =>
                                        block.content
                                          .map(
                                            (richText) => richText.plain_text
                                          )
                                          .join("")
                                      )
                                      .join("\n")
                                  : "";
                              } else {
                                // Properties are stored by name, not ID
                                value = item.record.properties[property.name];
                              }

                              return (
                                <div
                                  key={property.name}
                                  className="flex items-center justify-between"
                                >
                                  <span className="text-xs text-muted-foreground font-medium truncate">
                                    {property.name}:
                                  </span>
                                  <div className="ml-2 truncate max-w-[140px]">
                                    {renderPropertyValue(property, value)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </KanbanCard>
                  );
                }}
              </KanbanCards>
            </KanbanBoard>
          )}
        </KanbanProvider>
      </div>
    </div>
  );
}
