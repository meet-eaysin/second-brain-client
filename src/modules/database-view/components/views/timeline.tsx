import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  IDatabaseProperty,
  DatabaseRecord,
} from "@/modules/database-view";
import type { DocumentViewConfig } from "../../types/database-view.types";
import { NoDataMessage } from "../../../../components/no-data-message.tsx";

interface DocumentTimelineViewProps {
  properties: IDatabaseProperty[];
  records: DatabaseRecord[];
  onRecordSelect?: (record: DatabaseRecord) => void;
  onRecordEdit?: (record: DatabaseRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onRecordUpdate?: (recordId: string, updates: Record<string, unknown>) => void;
  dataSourceId?: string;
  config?: DocumentViewConfig;
}

export function Timeline({
  properties,
  records,
  onRecordSelect,
  onRecordEdit,
  onRecordDelete,
  config = {},
}: DocumentTimelineViewProps) {
  // Find date properties
  const dateProperty =
    properties.find((p) => p.type === "date") ||
    properties.find((p) => p.name.toLowerCase().includes("date")) ||
    properties.find((p) => p.name.toLowerCase().includes("created"));

  const titleProperty =
    properties.find((p) => p.name.toLowerCase() === "title") ||
    properties.find((p) => p.type === "text");

  const descriptionProperty =
    properties.find((p) => p.name.toLowerCase().includes("description")) ||
    properties.find((p) => p.name.toLowerCase().includes("summary"));

  // Sort records by date
  const sortedRecords = React.useMemo(() => {
    if (!dateProperty) {
      return records.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }

    return [...records].sort((a, b) => {
      const dateA = a.properties?.[dateProperty.id]
        ? new Date(String(a.properties[dateProperty.id]))
        : new Date(0);
      const dateB = b.properties?.[dateProperty.id]
        ? new Date(String(b.properties[dateProperty.id]))
        : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [records, dateProperty]);

  // Group records by date periods
  const groupedRecords = React.useMemo(() => {
    const groups: Record<string, DatabaseRecord[]> = {};

    sortedRecords.forEach((record) => {
      let date: Date;

      if (dateProperty && record.properties?.[dateProperty.id]) {
        date = new Date(String(record.properties[dateProperty.id]));
      } else {
        date = new Date(record.createdAt || 0);
      }

      if (isNaN(date.getTime())) {
        date = new Date(0);
      }

      const now = new Date();
      const diffTime = now.getTime() - date.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let groupKey: string;

      if (diffDays === 0) {
        groupKey = "Today";
      } else if (diffDays === 1) {
        groupKey = "Yesterday";
      } else if (diffDays <= 7) {
        groupKey = "This Week";
      } else if (diffDays <= 30) {
        groupKey = "This Month";
      } else if (diffDays <= 365) {
        groupKey = date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      } else {
        groupKey = date.getFullYear().toString();
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(record);
    });

    return groups;
  }, [sortedRecords, dateProperty]);

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

  const formatDate = (record: DatabaseRecord) => {
    let date: Date;

    if (dateProperty && record.properties?.[dateProperty.id]) {
      date = new Date(String(record.properties[dateProperty.id]));
    } else {
      date = new Date(record.createdAt || 0);
    }

    if (isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render a single record
  const renderRecord = (record: DatabaseRecord, isLast: boolean) => {
    const title = titleProperty
      ? record.properties?.[titleProperty.id]
      : record.id;
    const description = descriptionProperty
      ? record.properties?.[descriptionProperty.id]
      : null;

    return (
      <div key={record.id} className="relative">
        {/* Timeline line */}
        {!isLast && (
          <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-border" />
        )}

        <div className="flex gap-4">
          {/* Timeline dot */}
          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-2">
            <Clock className="h-4 w-4 text-primary-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleRecordClick(record)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base font-medium line-clamp-2">
                      {title || "Untitled"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(record)}
                    </p>
                  </div>

                  {(config.canEdit || config.canDelete) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
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
              </CardHeader>

              <CardContent className="pt-0">
                {/* Description */}
                {description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {String(description)}
                  </p>
                )}

                {/* Other properties */}
                <div className="flex flex-wrap gap-2">
                  {properties
                    .filter(
                      (p) =>
                        p.id !== titleProperty?.id &&
                        p.id !== descriptionProperty?.id &&
                        p.id !== dateProperty?.id &&
                        record.properties?.[p.id]
                    )
                    .slice(0, 3)
                    .map((property) => {
                      const value = record.properties?.[property.id];
                      if (!value) return null;

                      return (
                        <Badge
                          key={property.id}
                          variant="secondary"
                          className="text-xs"
                        >
                          {property.name}: {String(value)}
                        </Badge>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  if (records.length === 0) {
    return (
      <NoDataMessage
        title="No items to display"
        message={
          config.canCreate
            ? "Create your first item to see it in the timeline view."
            : "No items are available to display."
        }
        icon={Clock}
      />
    );
  }

  return (
    <div className="w-full h-full overflow-auto p-4">
      <div className="max-w-4xl mx-auto">
        {Object.entries(groupedRecords).map(([groupName, groupRecords]) => (
          <div key={groupName} className="mb-8">
            {/* Group header */}
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-lg font-semibold">{groupName}</h3>
              <Badge variant="secondary" className="text-xs">
                {groupRecords.length} items
              </Badge>
            </div>

            {/* Group records */}
            <div className="space-y-0">
              {groupRecords.map((record, index) =>
                renderRecord(record, index === groupRecords.length - 1)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
