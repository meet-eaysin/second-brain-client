import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Row, Table } from "@tanstack/react-table";
import type { TDatabase } from "@/modules/database-view/types";
import { Eye, Edit, Copy, Trash2, MoreHorizontal } from "lucide-react";

interface DatabaseActions {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (database: TDatabase) => void;
  onDuplicate: (database: TDatabase) => void;
}

export function DataTableRowActions({
  row,
  table,
}: {
  row: Row<TDatabase>;
  table: Table<TDatabase>;
}) {
  const database = row.original;
  const actions = table.options.meta as DatabaseActions;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            actions.onView(database.id);
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Database
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            actions.onEdit(database.id);
          }}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Database
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            actions.onDuplicate(database);
          }}
        >
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            actions.onDelete(database);
          }}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Database
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
