"use client";

import { useMemo } from "react";
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
} from "@/components/ui/kibo-ui/gantt";
import { EyeIcon, LinkIcon, TrashIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDatabaseView } from "@/modules/database-view/context";
import { NoDataMessage } from "@/components/no-data-message.tsx";
import type { TRecord } from "@/modules/database-view/types";
import { EPropertyType } from "@/modules/database-view/types";
import { useUpdateRecord } from "@/modules/database-view/services/database-queries";

const groupBy = <T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<K, T[]>);
};

export function Gantt({ className = "" }: { className?: string }) {
  const {
    database,
    properties,
    records,
    isRecordsLoading,
    isPropertiesLoading,
  } = useDatabaseView();

  const { mutateAsync: updateRecordMutation } = useUpdateRecord();

  // Find date properties for Gantt
  const dateProperties = useMemo(() => {
    return properties.filter((p) => p.type === EPropertyType.DATE);
  }, [properties]);

  // Find grouping property (SELECT or STATUS)
  const groupingProperty = useMemo(() => {
    return (
      properties.find((p) => p.type === EPropertyType.SELECT) ||
      properties.find((p) => p.type === EPropertyType.STATUS)
    );
  }, [properties]);

  // Find title property
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
      [titleProperty?.name, ...dateProperties.map(p => p.name)].filter(Boolean)
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
                style={{ backgroundColor: option.color + "20", color: option.color }}
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
                    key={val}
                    className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-xs"
                    style={{ backgroundColor: option?.color + "20", color: option?.color }}
                  >
                    {option?.label || String(val)}
                  </span>
                );
              })}
              {value.length > 2 && (
                <span className="text-xs text-muted-foreground">+{value.length - 2}</span>
              )}
            </div>
          );
        }
        return null;

      case EPropertyType.CHECKBOX:
        return (
          <span className={`text-xs ${value ? 'text-green-600' : 'text-red-600'}`}>
            {value ? "✓" : "✗"}
          </span>
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
          <span className="text-xs text-muted-foreground truncate max-w-[100px]">
            {String(value)}
          </span>
        );
    }
  };

  // Transform records for Gantt format
  const ganttFeatures = useMemo(() => {
    if (!records || !Array.isArray(records)) {
      return [];
    }

    const features: Array<{
      id: string;
      name: string;
      startAt: Date;
      endAt: Date;
      status: { id: string; name: string; color: string };
      group: { id: string; name: string };
      record: TRecord;
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
          dateValue = record.properties?.[dateSource.name] as string;
        } else {
          // Fall back to createdAt timestamp
          dateValue = record.createdAt || record.created_at;
        }

        if (dateValue && typeof dateValue === "string") {
          const startDate = new Date(dateValue);
          const endDate = new Date(dateValue); // Single day event

          // Use title property for name
          let name = "Untitled";
          if (titleProperty) {
            const titleValue = record.properties?.[titleProperty.name];

            if (titleValue !== null && titleValue !== undefined && titleValue !== "") {
              // For select/multi-select, try to get the label
              if (titleProperty.type === EPropertyType.SELECT || titleProperty.type === EPropertyType.MULTI_SELECT) {
                const option = titleProperty.config?.options?.find((opt) => opt.id === titleValue);
                name = option?.label || String(titleValue);
              } else {
                name = String(titleValue);
              }
            } else {
              // Fallback: try other text properties or use record ID
              const fallbackProps = properties.filter(p =>
                p.type === EPropertyType.TEXT &&
                p.name !== titleProperty.name &&
                record.properties?.[p.name]
              );

              if (fallbackProps.length > 0) {
                const fallbackValue = record.properties[fallbackProps[0].name];
                name = String(fallbackValue);
              } else {
                // Use short record ID as last resort
                name = `Item ${record.id.slice(-4)}`;
              }
            }
          }

          // Create status based on date source
          const status = {
            id: dateSource.id,
            name: dateSource.name,
            color: dateProperties.length > 0 ? "#3B82F6" : "#10B981", // Different color for created date
          };

          // Create group based on grouping property or default
          const groupValue = groupingProperty
            ? record.properties?.[groupingProperty.name]
            : "ungrouped";
          const groupName = String(groupValue || "Ungrouped");
          const group = {
            id: groupingProperty?.name || "default",
            name: groupName,
          };

          features.push({
            id: `${record.id}-${dateSource.id}`,
            name,
            startAt: startDate,
            endAt: endDate,
            status,
            group,
            record,
          });
        }
      });
    });

    return features;
  }, [records, dateProperties, titleProperty, groupingProperty]);

  // Group features by group name
  const groupedFeatures = useMemo(() => {
    return groupBy(ganttFeatures, (feature) => feature.group.name);
  }, [ganttFeatures]);

  // Sort grouped features
  const sortedGroupedFeatures = useMemo(() => {
    return Object.fromEntries(
      Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
        nameA.localeCompare(nameB)
      )
    );
  }, [groupedFeatures]);

  // Handle feature interactions - disabled to prevent modal opening
  const handleViewFeature = (id: string) => {
    // Click handlers disabled as requested
    console.log(`Feature clicked: ${id}`);
  };

  const handleCopyLink = (id: string) => {
    console.log(`Copy link: ${id}`);
  };

  const handleRemoveFeature = (id: string) => {
    console.log(`Remove feature: ${id}`);
  };

  const handleCreateMarker = (date: Date) => {
    console.log(`Create marker: ${date.toISOString()}`);
  };

  const handleMoveFeature = async (
    id: string,
    startAt: Date,
    endAt: Date | null
  ) => {
    if (!endAt || !database?.id) return;

    const feature = ganttFeatures.find((f) => f.id === id);
    if (!feature) return;

    // Find the date property used for this feature
    const datePropertyName = id.split("-").slice(1).join("-");

    // If using createdAt (fallback), don't allow moving
    if (datePropertyName === "createdAt") {
      console.log("Cannot move features based on creation date");
      return;
    }

    const dateProperty = properties.find((p) => p.name === datePropertyName);
    if (!dateProperty) return;

    const payload: Record<string, string> = {
      [dateProperty.name]: startAt.toISOString(),
    };

    try {
      await updateRecordMutation({
        databaseId: database.id,
        recordId: feature.record.id,
        payload,
      });
    } catch (error) {
      console.error("Failed to update record position:", error);
    }
  };

  const handleAddFeature = (date: Date) => {
    console.log(`Add feature: ${date.toISOString()}`);
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

  // Show message if no records (fallback to createdAt should work if records exist)
  if (dateProperties.length === 0 && (!records || records.length === 0)) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <NoDataMessage message="Gantt view requires records with creation dates or DATE properties" />
      </div>
    );
  }

  return (
    <div className={`w-full h-full overflow-auto ${className}`}>
      <GanttProvider
        className="border"
        onAddItem={handleAddFeature}
        range="monthly"
        zoom={100}
      >
        <GanttSidebar>
          {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
            <GanttSidebarGroup key={group} name={group}>
              {features.map((feature) => (
                <GanttSidebarItem
                  feature={feature}
                  key={feature.id}
                  onSelectItem={handleViewFeature}
                />
              ))}
            </GanttSidebarGroup>
          ))}
        </GanttSidebar>
        <GanttTimeline>
          <GanttHeader />
          <GanttFeatureList>
            {Object.entries(sortedGroupedFeatures).map(([group, features]) => (
              <GanttFeatureListGroup key={group}>
                {features.map((feature) => (
                  <div className="flex" key={feature.id}>
                    <ContextMenu>
                      <ContextMenuTrigger asChild>
                        <button
                          onClick={() => handleViewFeature(feature.id)}
                          type="button"
                        >
                          <GanttFeatureItem
                            onMove={handleMoveFeature}
                            {...feature}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-xs font-medium mb-1">
                                {feature.name}
                              </p>
                              {/* Display additional properties */}
                              {displayProperties.length > 0 && (
                                <div className="space-y-0.5">
                                  {displayProperties.slice(0, 1).map((property) => {
                                    const value = feature.record.properties[property.name];
                                    if (value === null || value === undefined || value === "") return null;

                                    return (
                                      <div key={property.name} className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground truncate mr-1">
                                          {property.name}:
                                        </span>
                                        <div className="flex-shrink-0">
                                          {renderPropertyValue(property, value)}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </GanttFeatureItem>
                        </button>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          className="flex items-center gap-2"
                          onClick={() => handleViewFeature(feature.id)}
                        >
                          <EyeIcon
                            className="text-muted-foreground"
                            size={16}
                          />
                          View feature
                        </ContextMenuItem>
                        <ContextMenuItem
                          className="flex items-center gap-2"
                          onClick={() => handleCopyLink(feature.id)}
                        >
                          <LinkIcon
                            className="text-muted-foreground"
                            size={16}
                          />
                          Copy link
                        </ContextMenuItem>
                        <ContextMenuItem
                          className="flex items-center gap-2 text-destructive"
                          onClick={() => handleRemoveFeature(feature.id)}
                        >
                          <TrashIcon size={16} />
                          Remove from gantt
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </div>
                ))}
              </GanttFeatureListGroup>
            ))}
          </GanttFeatureList>
          <GanttToday />
          <GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
        </GanttTimeline>
      </GanttProvider>
    </div>
  );
}
