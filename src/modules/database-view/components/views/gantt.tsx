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
import { ConfirmDialog } from "@/components/confirm-dialog";
import type {TPropertyValue, TRecord} from "@/modules/database-view/types";
import { EPropertyType } from "@/modules/database-view/types";
import {
  useCreateRecord,
  useDeleteRecord,
  useUpdateRecord,
} from "@/modules/database-view/services/database-queries";
import { useState } from "react";

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

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);

  const { mutateAsync: updateRecordMutation } = useUpdateRecord();
  const { mutateAsync: createRecordMutation } = useCreateRecord();
  const { mutateAsync: deleteRecordMutation } = useDeleteRecord();

  // Find date properties for Gantt (DATE and DATE_RANGE)
  const dateProperties = useMemo(() => {
    return properties.filter(
      (p) =>
        p.type === EPropertyType.DATE || p.type === EPropertyType.DATE_RANGE
    );
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
          : [{ id: "createdAt", name: "createdAt", type: "date" }];

      dateSources.forEach((dateSource) => {
        let startDate: Date | null = null;
        let endDate: Date | null = null;

        if (dateProperties.length > 0) {
          // Use actual date property
          const dateValue = record.properties?.[dateSource.name];

          if (
            dateSource.type === EPropertyType.DATE_RANGE &&
            dateValue &&
            typeof dateValue === "object"
          ) {
            // Handle DATE_RANGE: { start: Date, end: Date }
            const range = dateValue as {
              start?: string | Date;
              end?: string | Date;
            };
            startDate = range.start ? new Date(range.start) : null;
            endDate = range.end ? new Date(range.end) : null;
          } else if (
            dateSource.type === EPropertyType.DATE &&
            dateValue &&
            typeof dateValue === "string"
          ) {
            // Handle DATE: single date string
            startDate = new Date(dateValue);
            endDate = new Date(dateValue); // Single day event
          }

          // If date value is empty/null, fall back to createdAt timestamp
          if (!startDate || !endDate) {
            const createdAt = record.createdAt || record.createdAt;
            if (createdAt) {
              startDate = new Date(createdAt);
              endDate = new Date(createdAt);
            }
          }
        } else {
          // Fall back to createdAt timestamp
          const createdAt = record.createdAt || record.createdBy;
          if (createdAt) {
            startDate = new Date(createdAt);
            endDate = new Date(createdAt);
          }
        }

        if (startDate && endDate) {
          // Use title property for name
          let name = "Untitled";
          if (titleProperty) {
            const titleValue = record.properties?.[titleProperty.name];

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
            id: `${record.id}-${dateSource.name}`,
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

  // Handle feature interactions
  const handleViewFeature = () => {
    // Gantt view doesn't open edit sheet on click
    // This keeps the timeline view clean and focused
  };

  const handleCopyLink = (id: string) => {
    // Copy link to clipboard
    const url = `${window.location.origin}/database/${database?.id}/record/${id}`;
    navigator.clipboard.writeText(url);
  };

  const handleRemoveFeature = (featureId: string) => {
    setFeatureToDelete(featureId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteFeature = async () => {
    if (!featureToDelete || !database?.id) return;

    // Find the feature to get the record ID
    const feature = ganttFeatures.find((f) => f.id === featureToDelete);
    if (!feature) return;

    try {
      await deleteRecordMutation({
        databaseId: database.id,
        recordId: feature.record.id,
      });
    } catch {
      // Error handling is done in the mutation hook
    } finally {
      setDeleteConfirmOpen(false);
      setFeatureToDelete(null);
    }
  };

  const handleCreateMarker = (date: Date) => {
    // Create a new record at the clicked date (same as handleAddFeature)
    handleAddFeature(date);
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
      return;
    }

    const dateProperty = properties.find((p) => p.name === datePropertyName);
    if (!dateProperty) return;

    const payload: Record<string, TPropertyValue> = {};

    if (dateProperty.type === EPropertyType.DATE_RANGE) {
      // For DATE_RANGE, update both start and end dates
      payload[dateProperty.name] = {
        start: startAt.toISOString(),
        end: endAt.toISOString(),
      };
    } else {
      // For DATE, just update the single date
      payload[dateProperty.name] = startAt.toISOString();
    }

    try {
      await updateRecordMutation({
        databaseId: database.id,
        recordId: feature.record.id,
        payload,
      });
    } catch {
      // Error handling is done in the mutation hook
    }
  };

  const handleAddFeature = async (date: Date) => {
    if (!database?.id) return;

    // Validate the date - use current date if invalid
    if (!date || isNaN(date.getTime())) {
      date = new Date();
    }

    // Prepare the record data
    const recordData: Record<string, TPropertyValue> = {};

    // Find the first available date property to set the timeline
    const dateProperty = dateProperties[0];

    if (dateProperty) {
      // Set the date property based on its type
      if (dateProperty.type === EPropertyType.DATE_RANGE) {
        // For DATE_RANGE, create a range starting from the clicked date
        recordData[dateProperty.name] = {
          start: date.toISOString(),
          end: new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 1 day later
        };
      } else if (dateProperty.type === EPropertyType.DATE) {
        // For DATE, set the single date
        recordData[dateProperty.name] = date.toISOString();
      }
    }
    // If no date properties exist, the record will be created without timeline data
    // and will use createdAt timestamp for display in the gantt

    // Set title if available
    if (titleProperty) {
      recordData[titleProperty.name] = "Untitled";
    }

    try {
      await createRecordMutation({
        databaseId: database.id,
        data: {
          properties: recordData,
        },
      });
    } catch {
      // Error handling is done in the mutation hook
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
                  onSelectItem={() => handleViewFeature()}
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
                          onClick={() => handleViewFeature()}
                          type="button"
                        >
                          <GanttFeatureItem
                            onMove={handleMoveFeature}
                            {...feature}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-xs font-medium">
                                {feature.name}
                              </p>
                            </div>
                          </GanttFeatureItem>
                        </button>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          className="flex items-center gap-2"
                          onClick={() => handleViewFeature()}
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

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Record"
        desc="Are you sure you want to delete this record? This action cannot be undone."
        confirmText="Delete"
        destructive={true}
        handleConfirm={confirmDeleteFeature}
      />
    </div>
  );
}
