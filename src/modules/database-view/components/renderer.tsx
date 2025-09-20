
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import {useDatabaseView} from "@/modules/database-view/context";
import {Board, Calendar, Gallery, List, Table, Timeline} from "@/modules/database-view/components/views";

export function Renderer() {
  const { currentView } = useDatabaseView();

  const renderView = () => {
    const viewType = currentView?.type || "table";

    switch (viewType) {
      case "table": return <Table/>
      case "board": return <Board />
      case "gallery":return <Gallery />
      case "list": return <List />
      case "calendar": return <Calendar />
      case "timeline": return <Timeline />;

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
