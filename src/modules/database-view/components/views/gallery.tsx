import { useMemo } from "react";
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
import { MoreHorizontal, Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { useDatabaseView } from "@/modules/database-view/context";
import { useUpdateRecord } from "@/modules/database-view/services/database-queries";
import { NoDataMessage } from "@/components/no-data-message.tsx";
import type { TRecord, TPropertyValue } from "@/modules/database-view/types";
import { EPropertyType } from "@/modules/database-view/types";

export function Gallery({ className = "" }: { className?: string }) {
  const {
    database,
    properties,
    records,
    currentView,
    isRecordsLoading,
    isPropertiesLoading,
    onRecordEdit,
    onRecordDelete,
    onRecordCreate,
    onDialogOpen,
  } = useDatabaseView();

  const { mutateAsync: updateRecordMutation } = useUpdateRecord();
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
          ? record.properties[groupingProperty.id]
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
      ? record.properties[titleProperty.id] ?? "Untitled"
      : "Untitled";
    const title = String(titleValue);

    // Get other visible properties
    const visibleProperties = properties
      .filter(
        (p) =>
          p.id !== groupingProperty?.id &&
          p.id !== titleProperty?.id &&
          currentView?.settings?.visibleProperties?.includes(p.id)
      )
      .slice(0, 3); // Show max 3 additional properties

    return (
      <Draggable key={record.id} draggableId={record.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`mb-3 cursor-pointer hover:shadow-md transition-all duration-200 group ${
              snapshot.isDragging
                ? "shadow-xl rotate-2 scale-105 bg-background border-primary"
                : "hover:shadow-md"
            }`}
            onClick={() => onRecordEdit?.(record)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    {...provided.dragHandleProps}
                    className={`cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-all duration-200 ${
                      snapshot.isDragging
                        ? "text-primary"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-sm font-medium line-clamp-2 flex-1">
                    {title || "Untitled"}
                  </CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onRecordEdit?.(record);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onRecordDelete?.(record.id);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            {visibleProperties.length > 0 && (
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {visibleProperties.map((property) => {
                    const value = record.properties[property.id];
                    if (value === null || value === undefined || value === "")
                      return null;

                    return (
                      <div
                        key={property.id}
                        className="text-xs text-muted-foreground"
                      >
                        <span className="font-medium">{property.name}:</span>{" "}
                        {property.type === EPropertyType.SELECT ? (
                          <Badge
                            variant="outline"
                            className="text-xs text-white border-0"
                            style={{
                              backgroundColor:
                                property.config?.options?.find(
                                  (opt) => opt.id === value
                                )?.color || "#6b7280",
                            }}
                          >
                            {property.config?.options?.find(
                              (opt) => opt.id === value
                            )?.label || String(value)}
                          </Badge>
                        ) : property.type === EPropertyType.MULTI_SELECT ? (
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(value) &&
                              value.map((val: unknown, index: number) => {
                                const stringVal = String(val);
                                const option = property.config?.options?.find(
                                  (opt) => opt.id === stringVal
                                );
                                return (
                                  <Badge
                                    key={stringVal || index}
                                    variant="outline"
                                    className="text-xs text-white border-0"
                                    style={{
                                      backgroundColor:
                                        option?.color || "#6b7280",
                                    }}
                                  >
                                    {option?.label || stringVal}
                                  </Badge>
                                );
                              })}
                          </div>
                        ) : (
                          <span>{String(value)}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </Draggable>
    );
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
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No records found</p>
          <Button onClick={onRecordCreate}>Create First Record</Button>
        </div>
      </div>
    );
  }

  if (!groupingProperty) {
    return (
      <NoDataMessage
        message="Gallery view requires a SELECT property for grouping"
        action={{
          label: "Add SELECT Property",
          onClick: () => onDialogOpen?.("create-property"),
        }}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {groups.map((group) => (
            <div key={group.id} className="flex-shrink-0 w-80">
              <div className="bg-muted/50 rounded-lg p-4">
                {/* Group Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: group.color }}
                    />
                    <h3 className="font-medium">{group.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {groupedRecords[group.id]?.length || 0}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={onRecordCreate}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Records */}
                <Droppable droppableId={group.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-2 min-h-[200px] transition-all duration-200 rounded-md ${
                        snapshot.isDraggingOver
                          ? "bg-primary/10 border-2 border-dashed border-primary/30 scale-[1.02]"
                          : "border-2 border-transparent"
                      }`}
                    >
                      {groupedRecords[group.id]?.map((record, index) =>
                        renderRecordCard(record, index)
                      )}

                      {groupedRecords[group.id]?.length === 0 && (
                        <NoDataMessage
                          message="No records in this group"
                          compact
                        />
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
