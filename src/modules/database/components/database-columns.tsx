import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./database-row-actions";
import type { ColumnDef } from "@tanstack/react-table";
import type { TDatabase } from "@/modules/database-view/types";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header.tsx";
import { Database, Archive } from "lucide-react";

export const columns: ColumnDef<TDatabase>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const database = row.original;
      return (
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-medium">{database.name}</div>
            {database.description && (
              <div className="text-sm text-muted-foreground truncate max-w-32">
                {database.description}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "recordCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Records" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("recordCount") || 0}</div>
    ),
  },
  {
    accessorKey: "properties",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Properties" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.original.properties?.length || 0}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const database = row.original;
      return (
        <div className="flex items-center gap-2">
          {database.isPublic && (
            <Badge variant="secondary" className="text-xs">
              Public
            </Badge>
          )}
          {database.isArchived && (
            <Badge variant="outline" className="text-xs">
              <Archive className="h-3 w-3 mr-1" />
              Archived
            </Badge>
          )}
          {!database.isPublic && !database.isArchived && (
            <Badge variant="outline" className="text-xs">
              Private
            </Badge>
          )}
        </div>
      );
    },
    accessorFn: (row) => {
      if (row.isArchived) return "archived";
      if (row.isPublic) return "public";
      return "private";
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      return (
        <div className="text-sm text-muted-foreground">
          {date ? new Date(date).toLocaleDateString() : "Never"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
];
