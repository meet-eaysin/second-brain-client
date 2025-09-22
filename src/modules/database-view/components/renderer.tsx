import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useDatabaseView } from "@/modules/database-view/context";
import { EViewType } from "@/modules/database-view/types";
import {
  Board,
  Calendar,
  Gallery,
  List,
  Table,
  Gantt,
} from "@/modules/database-view/components/views";
import {
  TableSkeleton,
  GallerySkeleton,
  ListSkeleton,
} from "@/modules/database-view/components/skeleton";

interface RendererProps {
  className?: string;
}

export function Renderer({ className = "" }: RendererProps) {
  const { currentView, isCurrentViewLoading, database } = useDatabaseView();

  const renderSkeleton = () => {
    const viewType = currentView?.type || EViewType.TABLE;

    switch (viewType) {
      case EViewType.TABLE:
        return <TableSkeleton />;
      case EViewType.GALLERY:
        return <GallerySkeleton />;
      case EViewType.LIST:
        return <ListSkeleton />;
      case EViewType.BOARD:
      case EViewType.CALENDAR:
      case EViewType.GANTT:
      default:
        return <TableSkeleton />;
    }
  };

  if (isCurrentViewLoading) {
    return <div className={className}>{renderSkeleton()}</div>;
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

      case EViewType.GANTT:
        return <Gantt />;

      case EViewType.CHART:
        return (
          <Card className="border-yellow-500">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-yellow-600 mb-2">
                  Chart View Coming Soon
                </h3>
                <p className="text-muted-foreground mb-4">
                  The Chart view is currently under development.
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
      <Suspense fallback={renderSkeleton()}>{renderView()}</Suspense>
    </div>
  );
}
