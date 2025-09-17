import { useState } from "react";
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
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useDocumentView } from "../context/document-view-context";
import { useDeleteView, useDuplicateView } from "../services/database-queries";
import type { IDatabaseView } from "../types";

interface DocumentViewTabsProps {
  views: IDatabaseView[];
  currentViewId?: string;
  databaseId?: string;
  moduleType?: string;
  isFrozen?: boolean;
  onViewChange: (viewId: string) => void;
  onViewUpdate?: () => void;
}

const VIEW_TYPE_ICONS = {
  table: Table,
  board: Kanban,
  kanban: Kanban,
  gallery: Grid3X3,
  list: List,
  calendar: Calendar,
  timeline: Clock,
} as const;

export function DocumentViewTabs({
  views,
  currentViewId,
  databaseId,
  isFrozen = false,
  onViewChange,
}: DocumentViewTabsProps) {
  const { setDialogOpen, setCurrentView } = useDocumentView();

  const deleteViewMutation = useDeleteView();
  const duplicateViewMutation = useDuplicateView();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [viewToDelete, setViewToDelete] = useState<IDatabaseView | null>(null);

  const activeViewId =
    currentViewId || views.find((v) => v.isDefault)?.id || views[0]?.id;
  const activeView = views.find((v) => v.id === activeViewId) || views[0];

  const handleViewChange = (viewId: string) => onViewChange(viewId);
  const handleAddView = () => setDialogOpen("create-view");

  const handleEditView = (view: IDatabaseView) => {
    if (view.config?.canEdit === false || view.config?.isSystemView === true) {
      toast.error("This view cannot be edited");
      return;
    }
    setCurrentView(view);
    setDialogOpen("edit-view");
  };

  const handleDuplicateView = async (view: IDatabaseView) => {
    if (!databaseId) return;

    try {
      await duplicateViewMutation.mutateAsync({
        databaseId,
        viewId: view.id,
        newName: `${view.name} (Copy)`,
      });
    } catch (error) {
      console.error("Failed to duplicate view:", error);
    }
  };

  const handleDeleteView = (view: IDatabaseView) => {
    if (views.length <= 1) {
      toast.error("Cannot delete the last view");
      return;
    }

    if (
      view.config?.canDelete === false ||
      view.config?.isSystemView === true
    ) {
      toast.error("This view cannot be deleted");
      return;
    }

    setViewToDelete(view);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteView = async () => {
    if (!viewToDelete || !databaseId) return;

    try {
      await deleteViewMutation.mutateAsync({
        databaseId,
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
            value={activeViewId}
            onValueChange={handleViewChange}
            className="flex-1"
          >
            <div className="flex items-center justify-between py-2">
              <TabsList className="h-9">
                {views.map((view) => {
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
                {isFrozen && (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <Lock className="h-3 w-3" />
                    Frozen
                  </Badge>
                )}

                {activeView && (
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
                        onClick={() => handleEditView(activeView)}
                        disabled={
                          activeView.config?.canEdit === false ||
                          activeView.config?.isSystemView === true
                        }
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit View
                        {activeView.config?.isSystemView && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs"
                          >
                            System
                          </Badge>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicateView(activeView)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate View
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteView(activeView)}
                        disabled={
                          activeView.config?.canDelete === false ||
                          activeView.config?.isSystemView === true ||
                          views.length <= 1
                        }
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete View
                        {activeView.config?.isSystemView && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs"
                          >
                            Protected
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <Button onClick={handleAddView} size="sm" variant="outline">
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
}
