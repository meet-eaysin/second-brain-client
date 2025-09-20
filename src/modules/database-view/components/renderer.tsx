import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { useDatabaseView } from "@/modules/database-view/context";
import { EViewType } from "@/modules/database-view/types";
import {Board, Calendar, Gallery, List, Table, Timeline} from "@/modules/database-view/components/views";

interface RendererProps {
  className?: string;
}

export function Renderer({ className = "" }: RendererProps) {
  const { currentView, isCurrentViewLoading, database } = useDatabaseView();

  if (isCurrentViewLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading view...</p>
        </div>
      </div>
    );
  }

  if (!database?.id) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Database Not Found
            </h3>
            <p className="text-muted-foreground mb-4">
              Unable to load the database. Please check your connection and try
              again.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderView = () => {
    const viewType = currentView?.type || EViewType.TABLE;

    switch (viewType) {
      case EViewType.TABLE:
        return <Table />;

      case EViewType.BOARD:
        return <Board />;

      case EViewType.GALLERY:
        return <Gallery />;

      case EViewType.LIST:
        return <List />;

      case EViewType.CALENDAR:
        return <Calendar />;

      case EViewType.TIMELINE:
        return <Timeline />;

      case EViewType.GANTT:
        return (
          <Card className="border-yellow-500">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-yellow-600 mb-2">
                  Gantt View Coming Soon
                </h3>
                <p className="text-muted-foreground mb-4">
                  The Gantt view is currently under development.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Switch to Table View
                </Button>
              </div>
            </CardContent>
          </Card>
        );

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
                  The view type "{viewType}" is not supported.
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supported types: table, board, gallery, list, calendar,
                  timeline
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

  return (
    <div className={`w-full ${className}`}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Loading view component...
              </p>
            </div>
          </div>
        }
      >
        {renderView()}
      </Suspense>
    </div>
  );
}
