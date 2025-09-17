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
} from "lucide-react";
import { useDocumentView } from "../context/document-view-context";

export function DatabasePrimaryButtons() {
  const { setDialogOpen: setOpen, currentSchema } = useDocumentView();

  const handleCreateDatabase = () => setOpen("create-database");
  const handleImportData = () => setOpen("import-data");
  const handleExportData = () => setOpen("export-data");
  const handleShareDatabase = () => setOpen("share-database");
  const handleDatabaseSettings = () => setOpen("edit-database");

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
