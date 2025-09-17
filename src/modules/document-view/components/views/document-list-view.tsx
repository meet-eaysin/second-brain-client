import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, GripVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  IDatabaseView,
  IDatabaseProperty,
  DatabaseRecord,
} from "@/modules/document-view";
import type { DocumentViewConfig } from "../../types/document-view.types";

interface DocumentListViewProps {
  view: IDatabaseView;
  properties: IDatabaseProperty[];
  records: DatabaseRecord[];
  onRecordSelect?: (record: DatabaseRecord) => void;
  onRecordEdit?: (record: DatabaseRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onRecordUpdate?: (recordId: string, updates: Record<string, unknown>) => void;
  dataSourceId?: string;
  config?: DocumentViewConfig;
}

export function DocumentListView({
  properties,
  records,
  onRecordSelect,
  onRecordEdit,
  onRecordDelete,
  config = {},
}: DocumentListViewProps) {
  const [selectedRecords, setSelectedRecords] = React.useState<string[]>([]);

  const handleRecordClick = (record: DatabaseRecord) => {
    if (onRecordSelect) {
      onRecordSelect(record);
    }
  };

  const handleRecordEdit = (e: React.MouseEvent, record: DatabaseRecord) => {
    e.stopPropagation();
    if (onRecordEdit) {
      onRecordEdit(record);
    }
  };

  const handleRecordDelete = (e: React.MouseEvent, recordId: string) => {
    e.stopPropagation();
    if (onRecordDelete) {
      onRecordDelete(recordId);
    }
  };

  const handleSelectRecord = (recordId: string, checked: boolean) => {
    if (checked) {
      setSelectedRecords((prev) => [...prev, recordId]);
    } else {
      setSelectedRecords((prev) => prev.filter((id) => id !== recordId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRecords(records.map((r) => r.id));
    } else {
      setSelectedRecords([]);
    }
  };

  // Get key properties to display
  const titleProperty =
    properties.find((p) => p.name.toLowerCase() === "title") ||
    properties.find((p) => p.type === "text");
  const statusProperty = properties.find((p) =>
    p.name.toLowerCase().includes("status")
  );
  const priorityProperty = properties.find((p) =>
    p.name.toLowerCase().includes("priority")
  );

  // Render a single record row
  const renderRecordRow = (record: DatabaseRecord, index: number) => {
    const title = titleProperty
      ? record.properties?.[titleProperty.id]
      : record.id;
    const status = statusProperty
      ? record.properties?.[statusProperty.id]
      : null;
    const priority = priorityProperty
      ? record.properties?.[priorityProperty.id]
      : null;
    const isSelected = selectedRecords.includes(record.id);

    return (
      <div
        key={record.id}
        className={`
                    group flex items-center gap-3 p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors
                    ${isSelected ? "bg-muted/30" : ""}
                `}
        onClick={() => handleRecordClick(record)}
      >
        {/* Drag handle */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
        </div>

        {/* Selection checkbox */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            handleSelectRecord(record.id, !!checked)
          }
          onClick={(e) => e.stopPropagation()}
        />

        {/* Record number */}
        <div className="w-8 text-sm text-muted-foreground">{index + 1}</div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            {/* Title */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{title || "Untitled"}</h4>
            </div>

            {/* Status badge */}
            {status && (
              <Badge variant="secondary" className="text-xs">
                {String(status)}
              </Badge>
            )}

            {/* Priority badge */}
            {priority && (
              <Badge
                variant={
                  String(priority).toLowerCase() === "high"
                    ? "destructive"
                    : String(priority).toLowerCase() === "medium"
                    ? "default"
                    : "secondary"
                }
                className="text-xs"
              >
                {String(priority)}
              </Badge>
            )}

            {/* Additional properties */}
            <div className="flex items-center gap-2">
              {properties
                .filter(
                  (p) =>
                    p.id !== titleProperty?.id &&
                    p.id !== statusProperty?.id &&
                    p.id !== priorityProperty?.id &&
                    record.properties?.[p.id]
                )
                .slice(0, 2)
                .map((property) => {
                  const value = record.properties?.[property.id];
                  if (!value) return null;

                  return (
                    <div
                      key={property.id}
                      className="text-xs text-muted-foreground"
                    >
                      <span className="font-medium">{property.name}:</span>{" "}
                      {String(value)}
                    </div>
                  );
                })}
            </div>

            {/* Actions */}
            {(config.canEdit || config.canDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {config.canEdit && (
                    <DropdownMenuItem
                      onClick={(e) => handleRecordEdit(e, record)}
                    >
                      Edit
                    </DropdownMenuItem>
                  )}
                  {config.canDelete && (
                    <DropdownMenuItem
                      onClick={(e) => handleRecordDelete(e, record.id)}
                      className="text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b bg-muted/30 sticky top-0 z-10">
        <div className="w-4" /> {/* Drag handle space */}
        {/* Select all checkbox */}
        <Checkbox
          checked={
            selectedRecords.length === records.length && records.length > 0
          }
          indeterminate={
            selectedRecords.length > 0 &&
            selectedRecords.length < records.length
          }
          onCheckedChange={handleSelectAll}
        />
        <div className="w-8 text-sm font-medium text-muted-foreground">#</div>
        <div className="flex-1 text-sm font-medium">
          Items ({records.length})
        </div>
        {selectedRecords.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {selectedRecords.length} selected
          </div>
        )}
      </div>

      {/* Records */}
      <div className="divide-y">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium mb-2">No items to display</h3>
            <p className="text-muted-foreground">
              {config.canCreate
                ? "Create your first item to see it in the list view."
                : "No items are available to display."}
            </p>
          </div>
        ) : (
          records.map((record, index) => renderRecordRow(record, index))
        )}
      </div>
    </div>
  );
}
