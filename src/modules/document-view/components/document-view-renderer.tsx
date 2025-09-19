import { DocumentTableView } from "./views/document-table-view";
import { DocumentBoardView } from "./views/document-board-view";
import { DocumentGalleryView } from "./views/document-gallery-view";
import { DocumentListView } from "./views/document-list-view";
import { DocumentCalendarView } from "./views/document-calendar-view";
import { DocumentTimelineView } from "./views/document-timeline-view";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import {useDocumentView} from "@/modules/document-view/context/document-view-context.tsx";

export function DocumentViewRenderer() {
  const { view } = useDocumentView();

  const renderView = () => {
    const viewType = view.type || "table";

    switch (viewType) {
      case "table": return <DocumentTableView/>
      case "board":
      case "kanban": return <DocumentBoardView />
      case "gallery":return <DocumentGalleryView />
      case "list": return <DocumentListView />
      case "calendar": return <DocumentCalendarView />
      case "timeline": return <DocumentTimelineView />;

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
