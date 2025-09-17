import React from "react";
import { DocumentTableView } from "./views/document-table-view";
import { DocumentBoardView } from "./views/document-board-view";
import { DocumentGalleryView } from "./views/document-gallery-view";
import { DocumentListView } from "./views/document-list-view";
import { DocumentCalendarView } from "./views/document-calendar-view";
import { DocumentTimelineView } from "./views/document-timeline-view";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import type {
  IDatabaseView,
  IDatabaseProperty,
  DatabaseRecord,
} from "@/modules/document-view";

interface DocumentViewRendererProps {
  view: IDatabaseView;
  properties: IDatabaseProperty[];
  records: DatabaseRecord[];
  onRecordSelect?: (record: DatabaseRecord) => void;
  onRecordEdit?: (record: DatabaseRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onRecordCreate?: (groupValue?: string) => void;
  onRecordUpdate?: (recordId: string, updates: Record<string, string>) => void;
  onBulkDelete?: (recordIds: string[]) => void;
  onBulkEdit?: (records: DatabaseRecord[]) => void;
  onAddProperty?: () => void;
  databaseId?: string;
  moduleType?: string;
  isFrozen?: boolean;
  disablePropertyManagement?: boolean;
  apiFrozenConfig?: string;
}

export function DocumentViewRenderer({
  view,
  properties,
  records,
  onRecordSelect,
  onRecordEdit,
  onRecordDelete,
  onRecordCreate,
  onRecordUpdate,
  onBulkDelete,
  onBulkEdit,
  onAddProperty,
  databaseId,
  moduleType,
  isFrozen = false,
  disablePropertyManagement = false,
  apiFrozenConfig,
}: DocumentViewRendererProps) {
  const commonProps = {
    view,
    properties,
    records,
    onRecordSelect,
    onRecordEdit,
    onRecordDelete,
    onBulkDelete,
    onBulkEdit,
    onAddProperty,
    databaseId,
    moduleType,
    isFrozen,
    disablePropertyManagement,
    apiFrozenConfig,
  };

  const renderView = () => {
    const viewType = view.type || "table";

    switch (viewType) {
      case "table":
        return (
          <DocumentTableView
            {...commonProps}
            onRecordCreate={onRecordCreate}
            onRecordUpdate={onRecordUpdate}
          />
        );

      case "board":
      case "kanban":
        return (
          <DocumentBoardView
            {...commonProps}
            onRecordCreate={onRecordCreate}
            onRecordUpdate={onRecordUpdate}
          />
        );

      case "gallery":
        return <DocumentGalleryView {...commonProps} />;

      case "list":
        return (
          <DocumentListView {...commonProps} onRecordUpdate={onRecordUpdate} />
        );

      case "calendar":
        return <DocumentCalendarView {...commonProps} />;

      case "timeline":
        return <DocumentTimelineView {...commonProps} />;

      default:
        return (
          <Card className="border-destructive">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-destructive mb-2">
                  Unsupported View Type
                </h3>
                <p className="text-muted-foreground mb-4">
                  The view type "{viewType}" is not supported yet.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supported types: table, board, kanban, gallery, list,
                  calendar, timeline
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return <div className="w-full">{renderView()}</div>;
}
