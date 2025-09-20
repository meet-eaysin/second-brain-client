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
// Native groupBy implementation
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

interface TimelineProps {
  className?: string;
}

export function Timeline({ className = "" }: TimelineProps) {
  const {
    database,
    properties,
    records,
    isRecordsLoading,
    isPropertiesLoading,
    onRecordEdit,
  } = useDatabaseView();

  const { mutateAsync: updateRecordMutation } = useUpdateRecord();

  // Find date properties for timeline
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

  // Transform records for timeline format
  const timelineFeatures = useMemo(() => {
    if (!records || !Array.isArray(records) || dateProperties.length === 0) {
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
      dateProperties.forEach((dateProperty) => {
        const dateValue = record.properties?.[dateProperty.id];

        if (dateValue && typeof dateValue === "string") {
          const startDate = new Date(dateValue);
          const endDate = new Date(dateValue); // Single day event

          // Use title property for name
          const titleValue = titleProperty
            ? record.properties?.[titleProperty.id] ?? "Untitled"
            : "Untitled";
          const name = String(titleValue);

          // Create status based on date property
          const status = {
            id: dateProperty.id,
            name: dateProperty.name,
            color: "#3B82F6",
          };

          // Create group based on grouping property or default
          const groupValue = groupingProperty
            ? record.properties?.[groupingProperty.id]
            : "ungrouped";
          const groupName = String(groupValue || "Ungrouped");
          const group = {
            id: groupingProperty?.id || "default",
            name: groupName,
          };

          features.push({
            id: `${record.id}-${dateProperty.id}`,
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
    return groupBy(timelineFeatures, (feature) => feature.group.name);
  }, [timelineFeatures]);

  // Sort grouped features
  const sortedGroupedFeatures = useMemo(() => {
    return Object.fromEntries(
      Object.entries(groupedFeatures).sort(([nameA], [nameB]) =>
        nameA.localeCompare(nameB)
      )
    );
  }, [groupedFeatures]);

  // Handle feature interactions
  const handleViewFeature = (id: string) => {
    const feature = timelineFeatures.find((f) => f.id === id);
    if (feature && onRecordEdit) {
      onRecordEdit(feature.record);
    }
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

    const feature = timelineFeatures.find((f) => f.id === id);
    if (!feature) return;

    // Find the date property used for this feature
    const datePropertyId = id.split("-").slice(1).join("-");
    const dateProperty = properties.find((p) => p.id === datePropertyId);
    if (!dateProperty) return;

    const payload: Record<string, string> = {
      [dateProperty.id]: startAt.toISOString(),
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

  // Show message if no date properties
  if (dateProperties.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <NoDataMessage message="Timeline view requires at least one DATE property" />
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
                            <p className="flex-1 truncate text-xs">
                              {feature.name}
                            </p>
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
                          Remove from timeline
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
