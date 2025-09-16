import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Database as DatabaseIcon,
  Import,
  FileText,
  Settings,
  Share,
  MoreHorizontal,
  Lock,
  Unlock,
} from "lucide-react";
import { useDocumentView } from "../context/document-view-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStandardModuleApiService } from "../services/api-service.ts";
import { toast } from "sonner";

export function DatabasePrimaryButtons() {
  const { setDialogOpen: setOpen, currentSchema } = useDocumentView();
  const queryClient = useQueryClient();

  const isFrozen = currentSchema?.frozen || false;
  const moduleType = currentSchema?.config?.moduleType;

  const apiService = createStandardModuleApiService(moduleType);

  const freezeMutation = useMutation({
    mutationFn: ({
      databaseId,
      frozen,
      reason,
    }: {
      databaseId: string;
      frozen: boolean;
      reason?: string;
    }) => apiService.freezeDatabase(databaseId, frozen, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [moduleType] });
      queryClient.invalidateQueries({ queryKey: ["second-brain"] });
      queryClient.invalidateQueries({ queryKey: [moduleType, "views"] });
      queryClient.invalidateQueries({ queryKey: [moduleType, "view"] });
      queryClient.invalidateQueries({ queryKey: [moduleType, "config"] });
      queryClient.invalidateQueries({ queryKey: [moduleType, "default-view"] });
      toast.success(
        `Database ${isFrozen ? "unfrozen" : "frozen"} successfully`
      );
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update database freeze status");
    },
  });

  const handleCreateDatabase = () => setOpen("create-database");
  const handleImportData = () => setOpen("import-data");
  const handleExportData = () => setOpen("export-data");
  const handleShareDatabase = () => setOpen("share-database");
  const handleDatabaseSettings = () => setOpen("edit-database");

  const handleFreezeDatabase = async () => {
    if (!currentSchema?.id) return;

    const newFrozenState = !isFrozen;
    const reason = newFrozenState ? "Database frozen by user" : undefined;

    try {
      await freezeMutation.mutateAsync({
        databaseId: currentSchema.id,
        frozen: newFrozenState,
        reason,
      });
    } catch (error) {
      console.error("Failed to freeze/unfreeze database:", error);
    }
  };

  if (currentSchema) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleImportData}>
              <Import className="mr-2 h-4 w-4" />
              Import Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportData}>
              <FileText className="mr-2 h-4 w-4" />
              Export Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => currentSchema?.id && handleShareDatabase()}
              disabled={!currentSchema?.id}
            >
              <Share className="mr-2 h-4 w-4" />
              Share Document
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => currentSchema?.id && handleDatabaseSettings()}
              disabled={!currentSchema?.id}
            >
              <Settings className="mr-2 h-4 w-4" />
              Document Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => currentSchema?.id && handleFreezeDatabase()}
              disabled={!currentSchema?.id}
            >
              {isFrozen ? (
                <>
                  <Unlock className="mr-2 h-4 w-4" /> Unfreeze Document
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" /> Freeze Document
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleCreateDatabase}>
        <Plus className="mr-2 h-4 w-4" />
        New Database
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCreateDatabase}>
            <DatabaseIcon className="mr-2 h-4 w-4" />
            Create Database
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleImportData}>
            <Import className="mr-2 h-4 w-4" />
            Import Database
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
