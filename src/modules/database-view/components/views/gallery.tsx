import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Loader2,
} from "lucide-react";
import { useDatabaseView } from "@/modules/database-view/context";
import { useUpdateRecord } from "@/modules/database-view/services/database-queries";
import { EditableCell } from "@/modules/database-view/components/editable-cell";
import { GallerySkeleton } from "../skeleton";
import type { TRecord, TPropertyValue } from "@/modules/database-view/types";
import { EPropertyType } from "@/modules/database-view/types";

export function Gallery({ className = "" }: { className?: string }) {
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
    onRecordDelete,
    onRecordCreate,
    onLoadMoreRecords,
  } = useDatabaseView();

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const { mutateAsync: updateRecordMutation } = useUpdateRecord();

  const toggleCardExpansion = (recordId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  };

  // Find the grouping property (usually a SELECT property)
  const groupingProperty = useMemo(() => {
    return (
      properties.find((p) => p.type === EPropertyType.SELECT) ||
      properties.find((p) => p.type === EPropertyType.STATUS)
    );
  }, [properties]);

  // Handle drag and drop
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !database?.id || !groupingProperty) {
      return;
    }

    const { source, destination, draggableId } = result;

    // If dropped in the same position, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the record being moved
    const recordId = draggableId;
    const newGroupId = destination.droppableId;

    try {
      // Update the record's grouping property
      const payload: Record<string, TPropertyValue> = {
        [groupingProperty.id]: newGroupId === "ungrouped" ? null : newGroupId,
      };

      await updateRecordMutation({
        databaseId: database.id,
        recordId,
        payload,
      });
    } catch (error) {
      console.error("Failed to update record position:", error);
    }
  };

  // Get all possible groups from the grouping property
  const groups = useMemo(() => {
    if (!groupingProperty?.config?.options) {
      return [{ id: "ungrouped", name: "Ungrouped", color: "#6b7280" }];
    }

    const groups = groupingProperty.config.options.map((option) => ({
      id: option.id,
      name: option.label,
      color: option.color || "#6b7280",
    }));

    // Add ungrouped if Gallery settings allow it
    if (currentView?.settings?.showUngrouped !== false) {
      groups.push({ id: "ungrouped", name: "Ungrouped", color: "#6b7280" });
    }

    return groups;
  }, [groupingProperty, currentView?.settings?.showUngrouped]);

  // Group records by the grouping property
  const groupedRecords = useMemo(() => {
    const grouped: Record<string, TRecord[]> = {};

    // Initialize all groups
    groups.forEach((group) => {
      grouped[group.id] = [];
    });

    // Group records
    if (records && Array.isArray(records)) {
      records.forEach((record: TRecord) => {
        const groupValue = groupingProperty
          ? record.properties[groupingProperty.name]
          : "ungrouped";

        const groupId = String(groupValue || "ungrouped");

        if (grouped[groupId]) {
          grouped[groupId].push(record);
        } else {
          grouped["ungrouped"].push(record);
        }
      });
    }

    return grouped;
  }, [records, groupingProperty, groups]);

  const renderRecordCard = (record: TRecord, index: number) => {
    // Get the title property (first text property or first property)
    const titleProperty =
      properties.find((p) => p.type === EPropertyType.TEXT) || properties[0];
    const titleValue = titleProperty
      ? record.properties[titleProperty.name] ?? "Untitled"
      : "Untitled";
    const title = String(titleValue);

    // Get all visible properties except the grouping property and title property
    const visibleProperties = properties.filter(
      (p) => p.name !== groupingProperty?.name && p.name !== titleProperty?.name
    );

    const isExpanded = expandedCards.has(record.id);
    const displayedProperties = isExpanded
      ? visibleProperties
      : visibleProperties.slice(0, 4);

    return (
      <Draggable key={record.id} draggableId={record.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`group relative bg-card border rounded-xl shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer overflow-hidden ${
              snapshot.isDragging
                ? "shadow-xl rotate-1 scale-[1.02] bg-card border-primary/60"
                : "hover:border-primary/20"
            }`}
          >
            <CardHeader className="px-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    {...provided.dragHandleProps}
                    className={`cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-foreground transition-all duration-200 flex-shrink-0 ${
                      snapshot.isDragging
                        ? "text-primary opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    {titleProperty ? (
                      <div className="text-base font-semibold text-foreground line-clamp-2 break-words leading-6">
                        <EditableCell
                          record={record}
                          property={titleProperty}
                          value={record.properties[titleProperty.name]}
                        />
                      </div>
                    ) : (
                      <CardTitle className="text-base font-semibold text-foreground line-clamp-2 break-words leading-6">
                        {title || "Untitled"}
                      </CardTitle>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onRecordEdit?.(record);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Record
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onRecordDelete?.(record.id);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Record
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            {visibleProperties.length > 0 && (
              <CardContent className="px-4 pb-4 pt-0">
                <div className="space-y-3">
                  {displayedProperties.map((property) => {
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

                    return (
                      <div
                        key={property.id}
                        className="flex items-start gap-3 group/property"
                      >
                        <span className="text-sm font-medium text-muted-foreground flex-shrink-0 leading-5 min-w-[90px]">
                          {property.name}
                        </span>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="text-sm text-foreground leading-5 group-hover/property:text-primary/90 transition-colors">
                            <EditableCell
                              record={record}
                              property={property}
                              value={value}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {visibleProperties.length > 4 && (
                    <div
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer pt-2 border-t border-muted/50"
                      onClick={() => toggleCardExpansion(record.id)}
                    >
                      {isExpanded
                        ? "Show less"
                        : `+${visibleProperties.length - 4} more properties`}
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </Draggable>
    );
  };

  if (isPropertiesLoading || isInitialLoading) return <GallerySkeleton />;

  return (
    <div className={`space-y-6 ${className}`}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 px-1">
          {groups.map((group) => (
            <div key={group.id} className="flex-shrink-0 w-80">
              <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                {/* Group Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-muted/30 to-muted/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: group.color }}
                    />
                    <h3 className="font-semibold text-sm text-foreground">
                      {group.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium bg-muted/50"
                    >
                      {groupedRecords[group.id]?.length || 0}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-muted/50 transition-colors"
                    onClick={onRecordCreate}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Records */}
                <Droppable droppableId={group.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 min-h-[200px] transition-all duration-200 ${
                        snapshot.isDraggingOver
                          ? "bg-primary/5 border-2 border-dashed border-primary/20"
                          : ""
                      }`}
                    >
                      <div className="space-y-3">
                        {groupedRecords[group.id]?.map((record, index) =>
                          renderRecordCard(record, index)
                        )}

                        {groupedRecords[group.id]?.length === 0 && (
                          <div className="flex items-center justify-center h-32 text-muted-foreground">
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                No records in this group
                              </p>
                              <p className="text-xs mt-1 opacity-75">
                                Add a record to get started
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Load More Button - Full Width like Notion */}
      {hasMoreRecords && (
        <div className="border-t bg-muted/20 mt-6">
          <Button
            onClick={onLoadMoreRecords}
            disabled={isLoadingMore}
            variant="ghost"
            className="w-full h-12 rounded-none border-0 gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
