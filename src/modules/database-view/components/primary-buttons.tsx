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
import { useDatabaseView } from "../context";

export function DatabasePrimaryButtons() {
  const { database, onDialogOpen } = useDatabaseView();

  if (database) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDialogOpen("import-data")}>
              <Import className="mr-2 h-4 w-4" />
              Import Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDialogOpen("export-data")}>
              <FileText className="mr-2 h-4 w-4" />
              Export Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => database?.id && onDialogOpen("share-database")}
              disabled={!database?.id}
            >
              <Share className="mr-2 h-4 w-4" />
              Share Document
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => database?.id && onDialogOpen("edit-database")}
              disabled={!database?.id || database?.isFrozen}
            >
              <Settings className="mr-2 h-4 w-4" />
              Document Settings
              {database?.isFrozen && (
                <span className="ml-auto text-xs text-muted-foreground">
                  (Frozen)
                </span>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => onDialogOpen("create-database")}>
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
          <DropdownMenuItem onClick={() => onDialogOpen("create-database")}>
            <DatabaseIcon className="mr-2 h-4 w-4" />
            Create Database
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onDialogOpen("import-data")}>
            <Import className="mr-2 h-4 w-4" />
            Import Database
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
