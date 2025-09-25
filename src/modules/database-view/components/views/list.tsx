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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ListSkeleton } from "../skeleton";
import type { TRecord, TPropertyValue } from "@/modules/database-view/types";
import { EPropertyType } from "@/modules/database-view/types";

export function List({ className = "" }: { className?: string }) {
  const {
    database,
    properties,
    records,
    currentView,
    isInitialLoading,
    isPropertiesLoading,
    isLoadingMore,
    hasMoreRecords,
    onRecordEdit,
    onLoadMoreRecords,
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

  // Find display properties (excluding grouping property, but include title if there are few properties)
  const displayProperties = useMemo(() => {
    const excludedIds = new Set([groupingProperty?.id].filter(Boolean));

    // If we have very few visible properties, include the title property too
    const visibleProperties = properties.filter((p) => p.isVisible);
    if (visibleProperties.length <= 2) {
      // Include title property for more information
      return visibleProperties.filter((p) => !excludedIds.has(p.id));
    }

    // Otherwise exclude title property
    excludedIds.add(titleProperty?.id);
    return properties.filter((p) => !excludedIds.has(p.id) && p.isVisible);
  }, [properties, titleProperty?.id, groupingProperty?.id]);

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

    return records.map((record: TRecord, index: number) => {
      // Try to get a meaningful title
      let title = `Item ${index + 1}`; // Use sequential numbering

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
            title = option?.label || String(titleValue);
          } else {
            title = String(titleValue);
          }
        }
      }

      // If still default, try to use any non-empty property as title
      if (title === `Item ${index + 1}`) {
        for (const prop of properties) {
          if (prop.name !== titleProperty?.name && prop.isVisible) {
            const propValue = record.properties[prop.name];
            if (
              propValue !== null &&
              propValue !== undefined &&
              propValue !== ""
            ) {
              if (
                prop.type === EPropertyType.SELECT ||
                prop.type === EPropertyType.MULTI_SELECT
              ) {
                const option = prop.config?.options?.find(
                  (opt) => opt.id === propValue
                );
                if (option) {
                  title = `${option.label} Item`;
                  break;
                }
              } else if (
                typeof propValue === "string" &&
                propValue.length > 0
              ) {
                title =
                  propValue.length > 20
                    ? propValue.substring(0, 20) + "..."
                    : propValue;
                break;
              }
            }
          }
        }
      }

      // Get status/grouping value
      const statusValue = groupingProperty
        ? record.properties[groupingProperty.name]
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
      [groupingProperty.name]: status.id === "ungrouped" ? null : status.id,
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

  // Show loading state only for initial load
  if (isPropertiesLoading || isInitialLoading) {
    return <ListSkeleton />;
  }

  // Show empty state if no records
  if (!records || records.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <NoDataMessage message="No records to display" />
      </div>
    );
  }

  // Allow list view to work without grouping property - records will be in "ungrouped" group

  return (
    <div className={`w-full h-full overflow-auto ${className}`}>
      <ListProvider onDragEnd={handleDragEnd}>
        {statuses.map((status) => {
          const filteredFeatures = listFeatures.filter(
            (feature) => feature.status.name === status.name
          );

          return (
            <ListGroup id={status.name} key={status.name}>
              <ListHeader color={status.color} name={status.name} />
              <ListItems>
                {filteredFeatures.length === 0 ? (
                  <div className="text-xs text-muted-foreground p-2">
                    No items in {status.name}
                  </div>
                ) : (
                  filteredFeatures.map((feature, index) => (
                    <ListItem
                      id={feature.id}
                      index={index}
                      key={feature.id}
                      name={feature.name}
                      parent={feature.status.name}
                      className="p-4"
                    >
                      <div
                        className="h-3 w-3 shrink-0 rounded-full mr-3"
                        style={{ backgroundColor: feature.status.color }}
                      />
                      <div
                        className="flex-1 cursor-pointer min-w-0"
                        onClick={() => onRecordEdit?.(feature.record)}
                      >
                        <div className="font-medium text-sm mb-1">
                          {feature.name}
                        </div>
                        {/* Display additional properties */}
                        {displayProperties.length > 0 && (
                          <div className="space-y-1">
                            {displayProperties.map((property) => {
                              // Handle system properties that are stored at record level
                              let value;
                              if (
                                property.type === EPropertyType.CREATED_TIME
                              ) {
                                value = feature.record.createdAt;
                              } else if (
                                property.type === EPropertyType.LAST_EDITED_TIME
                              ) {
                                value =
                                  feature.record.lastEditedAt ||
                                  feature.record.updatedAt;
                              } else if (
                                property.type === EPropertyType.RICH_TEXT
                              ) {
                                value = feature.record.content;
                              } else {
                                // Properties are stored by name, not ID
                                value =
                                  feature.record.properties[property.name];
                              }

                              // Show property even if empty, but with "Not set" or similar
                              const isEmpty =
                                value === null ||
                                value === undefined ||
                                value === "" ||
                                (Array.isArray(value) && value.length === 0);

                              return (
                                <div
                                  key={property.id}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <span className="text-muted-foreground font-medium">
                                    {property.name}:
                                  </span>
                                  <div className="ml-2 flex-shrink-0">
                                    {isEmpty ? (
                                      <span className="text-muted-foreground italic">
                                        Not set
                                      </span>
                                    ) : (
                                      renderPropertyValue(property, value)
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </ListItem>
                  ))
                )}
              </ListItems>
            </ListGroup>
          );
        })}
      </ListProvider>

      {/* Load More Button - Full Width like Notion */}
      {hasMoreRecords && (
        <div className="border-t bg-muted/20">
          <Button
            onClick={onLoadMoreRecords}
            disabled={isLoadingMore}
            variant="ghost"
            className="w-full h-12 rounded-none border-0 gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
