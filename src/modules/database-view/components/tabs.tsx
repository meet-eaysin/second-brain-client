import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  Table,
  Kanban,
  Grid3X3,
  List,
  Calendar,
  Clock,
  Plus,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  ChartGanttIcon,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useDeleteView, useDuplicateView } from "../services/database-queries";
import type { TView } from "@/modules/database-view/types";
import { useDatabaseView } from "@/modules/database-view/context";

const VIEW_TYPE_ICONS = {
  table: Table,
  board: Kanban,
  kanban: Kanban,
  gallery: Grid3X3,
  list: List,
  calendar: Calendar,
  timeline: Clock,
  gantt: ChartGanttIcon,
} as const;

export const ViewTabs = () => {
  const { onViewChange, onDialogOpen, currentView, database, views } =
    useDatabaseView();

  const deleteViewMutation = useDeleteView();
  const duplicateViewMutation = useDuplicateView();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [viewToDelete, setViewToDelete] = useState<TView | null>(null);

  const handleEditView = () => {
    onViewChange(currentView?.id || "");
    onDialogOpen("edit-view");
  };

  const handleDuplicateView = async () => {
    if (!database?.id) return;

    try {
      await duplicateViewMutation.mutateAsync({
        databaseId: database.id,
        viewId: currentView?.id || "",
        newName: `${currentView?.name} (Copy)`,
      });
    } catch (error) {
      console.error("Failed to duplicate view:", error);
    }
  };

  const handleDeleteView = () => {
    if (views.length <= 1) {
      toast.error("Cannot delete the last view");
      return;
    }

    setViewToDelete(currentView);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteView = async () => {
    if (!viewToDelete || !database?.id) return;

    try {
      await deleteViewMutation.mutateAsync({
        databaseId: database?.id,
        viewId: viewToDelete.id,
      });
    } catch (error) {
      console.error("Failed to delete view:", error);
    } finally {
      setDeleteConfirmOpen(false);
      setViewToDelete(null);
    }
  };

  return (
    <>
      <div className="border-b">
        <div className="flex items-center justify-between">
          <Tabs
            value={currentView?.id}
            onValueChange={(viewId: string) => onViewChange(viewId)}
            className="flex-1"
          >
            <div className="flex items-center justify-between py-2">
              <TabsList className="h-9">
                {views?.map((view) => {
                  const Icon = VIEW_TYPE_ICONS[view.type] || Table;
                  return (
                    <TabsTrigger
                      key={view.id}
                      value={view.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Icon className="h-3 w-3" />
                      {view.name}
                      {view.isDefault && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-1 ml-1"
                        >
                          Default
                        </Badge>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <div className="flex items-center gap-2">
                {database?.isFrozen && (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <Lock className="h-3 w-3" />
                    Frozen
                  </Badge>
                )}

                {currentView && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>View Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleEditView}
                        // disabled={
                        //   activeView.config?.canEdit === false ||
                        //   activeView.config?.isSystemView === true
                        // }
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit View
                        {/*{activeView.config?.isSystemView && (*/}
                        {/*  <Badge*/}
                        {/*    variant="secondary"*/}
                        {/*    className="ml-auto text-xs"*/}
                        {/*  >*/}
                        {/*    System*/}
                        {/*  </Badge>*/}
                        {/*)}*/}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDuplicateView}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate View
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleDeleteView}
                        // disabled={
                        //   activeView.config?.canDelete === false ||
                        //   activeView.config?.isSystemView === true ||
                        //   views.length <= 1
                        // }
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete View
                        {/*{activeView.config?.isSystemView && (*/}
                        {/*  <Badge*/}
                        {/*    variant="secondary"*/}
                        {/*    className="ml-auto text-xs"*/}
                        {/*  >*/}
                        {/*    Protected*/}
                        {/*  </Badge>*/}
                        {/*)}*/}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <Button
                  onClick={() => onDialogOpen("create-view")}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Tabs>
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete View"
        desc={`Are you sure you want to delete the view "${
          viewToDelete?.name || viewToDelete?.id || "Unknown View"
        }"? This action cannot be undone.`}
        confirmText="Delete"
        destructive={true}
        handleConfirm={confirmDeleteView}
      />
    </>
  );
};
