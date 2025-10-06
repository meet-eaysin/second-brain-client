import { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type RowSelectionState,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  MoreHorizontal,
  Copy,
} from "lucide-react";
import { useDatabaseView } from "@/modules/database-view/context";
import type { TRecord, TProperty } from "@/modules/database-view/types";
import { NoDataMessage } from "@/components/no-data-message.tsx";
import {
  useDeleteRecord,
  useBulkDeleteRecords,
  useDuplicateRecord,
} from "@/modules/database-view/services/database-queries";
import { toast } from "sonner";

interface DocumentDataTableProps {
  columns: ColumnDef<TRecord, string>[];
  data: TRecord[];
  enablePagination?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  pageSize?: number;
  onBulkEdit?: () => void;
  onBulkDelete?: () => void;
  onRecordDelete?: (recordId: string) => void;
  onRecordDuplicate?: (recordId: string) => void;
  onRecordCreate?: () => void;
  onAddProperty?: () => void;
}

export function DataTable({
  columns,
  data,
  enablePagination = true,
  enableSorting = true,
  enableFiltering = true,
  pageSize = 25,
  onBulkEdit: propOnBulkEdit,
  onBulkDelete: propOnBulkDelete,
  onRecordDelete: propOnRecordDelete,
  onRecordDuplicate: propOnRecordDuplicate,
  onRecordCreate: propOnRecordCreate,
  onAddProperty: propOnAddProperty,
}: DocumentDataTableProps) {
  const {
    database,
    properties,
    isPropertiesLoading,
    isRecordsLoading,
    onDialogOpen,
    onBulkEdit: contextOnBulkEdit,
    onBulkDelete: contextOnBulkDelete,
    onRecordDelete: contextOnRecordDelete,
    onRecordDuplicate: contextOnRecordDuplicate,
    onRecordCreate: contextOnRecordCreate,
    onAddProperty: contextOnAddProperty,
  } = useDatabaseView();

  const isFrozen = database?.isFrozen;

  const onBulkEdit = propOnBulkEdit || contextOnBulkEdit;
  const onBulkDelete = propOnBulkDelete || contextOnBulkDelete;
  const onRecordDelete = propOnRecordDelete || contextOnRecordDelete;
  const onRecordDuplicate = propOnRecordDuplicate || contextOnRecordDuplicate;
  const onRecordCreate = propOnRecordCreate || contextOnRecordCreate;
  const onAddProperty = propOnAddProperty || contextOnAddProperty;

  const [columnStats, setColumnStats] = useState<Record<string, string>>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Database operation hooks
  const deleteRecordMutation = useDeleteRecord();
  const bulkDeleteMutation = useBulkDeleteRecords();
  const duplicateRecordMutation = useDuplicateRecord();

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      sorting,
      columnFilters,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    enableRowSelection: true,
    enableSorting,
    enableFilters: enableFiltering,
    enableColumnResizing: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
    columnResizeMode: "onChange",
  });

  const calculateStat = (columnId: string, statType: string): string => {
    const column = table.getColumn(columnId);
    if (!column) return "";

    const values = data
      .map((row) => {
        const property = columns.find((col) => col.id === columnId);
        if (!property) return null;
        return row.properties[columnId];
      })
      .filter((val) => val !== null && val !== undefined);

    switch (statType) {
      case "count-all":
        return `${data.length}`;
      case "count-values":
        return `${values.length}`;
      case "count-unique":
        return `${new Set(values).size}`;
      case "count-empty":
        return `${data.length - values.length}`;
      case "count-not-empty":
        return `${values.length}`;
      case "percent-empty":
        return `${Math.round(
          ((data.length - values.length) / data.length) * 100
        )}%`;
      case "percent-not-empty":
        return `${Math.round((values.length / data.length) * 100)}%`;
      default:
        return "";
    }
  };

  const handleStatSelection = (columnId: string, statType: string) => {
    const statValue = calculateStat(columnId, statType);
    setColumnStats((prev) => ({ ...prev, [columnId]: statValue }));
  };

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedRecords = selectedRows.map((row) => row.original);

  const handleBulkDelete = async () => {
    if (onBulkDelete) {
      onBulkDelete();
    } else if (!database?.id || selectedRecords.length === 0) {
      return;
    } else {
      try {
        const recordIds = selectedRecords.map((record) => record.id);
        await bulkDeleteMutation.mutateAsync({
          databaseId: database.id,
          data: { recordIds, permanent: false },
        });
        setRowSelection({});
        toast.success(`${selectedRecords.length} records deleted successfully`);
      } catch {
        toast.error("Failed to delete records");
      }
    }
  };

  const handleBulkEdit = () => {
    if (onBulkEdit) {
      onBulkEdit();
    } else {
      onDialogOpen?.("bulk-edit");
    }
  };

  const handleRecordDelete = async (recordId: string) => {
    if (onRecordDelete) {
      onRecordDelete(recordId);
    } else if (!database?.id) {
      return;
    } else {
      try {
        await deleteRecordMutation.mutateAsync({
          databaseId: database.id,
          recordId,
        });
        toast.success("Record deleted successfully");
      } catch {
        toast.error("Failed to delete record");
      }
    }
  };

  const handleRecordDuplicate = async (recordId: string) => {
    if (onRecordDuplicate) {
      onRecordDuplicate(recordId);
    } else if (!database?.id) {
      return;
    } else {
      try {
        await duplicateRecordMutation.mutateAsync({
          databaseId: database.id,
          recordId,
        });
        toast.success("Record duplicated successfully");
      } catch {
        toast.error("Failed to duplicate record");
      }
    }
  };

  const handleRecordCreate = () => {
    if (onRecordCreate) {
      onRecordCreate();
    } else {
      onDialogOpen?.("create-record");
    }
  };

  const handleAddProperty = () => {
    if (onAddProperty) {
      onAddProperty();
    } else {
      onDialogOpen?.("create-property");
    }
  };

  // Drag and drop handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Check if we're dragging a column (property ID) or a row (record ID)
    const isColumnDrag = properties.some(
      (prop: TProperty) => prop.id === activeId
    );

    if (isColumnDrag) {
      // Handle column reordering
      const oldIndex = properties.findIndex(
        (prop: TProperty) => prop.id === activeId
      );
      const newIndex = properties.findIndex(
        (prop: TProperty) => prop.id === overId
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        // Here you would typically call an API to update the column order
        // For now, we'll just reorder the local properties
        const reorderedProperties = arrayMove(properties, oldIndex, newIndex);
        console.log("Column reordered:", {
          oldIndex,
          newIndex,
          reorderedProperties,
        });
        // You might want to emit this change to parent component
      }
    } else {
      // Handle row reordering
      const oldIndex = data.findIndex((item) => item.id === activeId);
      const newIndex = data.findIndex((item) => item.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Here you would typically call an API to update the row order
        // For now, we'll just reorder the local data
        const reorderedData = arrayMove(data, oldIndex, newIndex);
        console.log("Row reordered:", { oldIndex, newIndex, reorderedData });
        // You might want to emit this change to parent component
      }
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Loading overlay */}
      {(isPropertiesLoading || isRecordsLoading) && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-md border">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">
              {isPropertiesLoading
                ? "Loading properties..."
                : "Loading records..."}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between min-h-[40px]">
        {selectedRecords.length > 0 ? (
          <>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {selectedRecords.length} record
                {selectedRecords.length !== 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkEdit}
                disabled={isFrozen}
              >
                <Plus className="h-4 w-4 mr-2" />
                Edit Selected
                {isFrozen && <span className="ml-1 text-xs">(Frozen)</span>}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending || isFrozen}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
                {isFrozen && <span className="ml-1 text-xs">(Frozen)</span>}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRowSelection({})}
              >
                Clear Selection
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium">Records</h3>
            <span className="text-sm text-muted-foreground">
              {data.length} total
            </span>
          </div>
        )}
      </div>

      <div className="rounded-md border border-border overflow-x-auto bg-background">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
        >
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border hover:bg-muted/30"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        minWidth: header.getSize(),
                      }}
                      className="relative bg-muted/20 border-r border-border last:border-r-0 h-8 px-3 py-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-border opacity-0 hover:opacity-100"
                        />
                      )}
                    </TableHead>
                  ))}
                  <TableHead className="w-12">
                    <div className="flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddProperty}
                        className="h-8 w-8 p-0 hover:bg-muted/50"
                        disabled={isFrozen}
                        title={
                          isFrozen
                            ? "Cannot add properties to frozen database"
                            : "Add property"
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.getSize(),
                        }}
                        className="relative group/cell border-r border-border last:border-r-0 px-3 py-2 align-middle [&:has([role=checkbox])]:pr-0"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="w-12">
                      <div className="flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-muted/50"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleRecordDuplicate(row.original.id)
                              }
                              disabled={
                                duplicateRecordMutation.isPending || isFrozen
                              }
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                              {isFrozen && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                  (Frozen)
                                </span>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleRecordDelete(row.original.id)
                              }
                              className="text-destructive focus:text-destructive"
                              disabled={
                                deleteRecordMutation.isPending || isFrozen
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                              {isFrozen && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                  (Frozen)
                                </span>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center"
                  >
                    <NoDataMessage message="No results." compact />
                  </TableCell>
                </TableRow>
              )}

              <TableRow className="hover:bg-muted/50 border-t-2">
                <TableCell
                  colSpan={columns.length + 1}
                  className={`text-center py-2 text-muted-foreground ${
                    isFrozen
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:text-foreground"
                  }`}
                  onClick={isFrozen ? undefined : handleRecordCreate}
                >
                  <div className="flex items-center justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    <span>New Record</span>
                    {isFrozen && <span className="ml-2 text-xs">(Frozen)</span>}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>

            <tfoot>
              <tr>
                <td className="border-t p-1" style={{ width: 50 }}></td>
                {table
                  .getHeaderGroups()[0]
                  ?.headers.filter((header) => header.id !== "select")
                  .map((header) => (
                    <td
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        minWidth: header.getSize(),
                      }}
                      className="border-t p-1 group"
                    >
                      <div className="relative">
                        {columnStats[header.id] ? (
                          <div className="flex items-center justify-between h-6 px-2 text-xs text-muted-foreground">
                            <span>{columnStats[header.id]}</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="start"
                                className="w-48"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatSelection(header.id, "count-all")
                                  }
                                >
                                  Count all
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatSelection(
                                      header.id,
                                      "count-values"
                                    )
                                  }
                                >
                                  Count values
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatSelection(
                                      header.id,
                                      "count-unique"
                                    )
                                  }
                                >
                                  Count unique values
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatSelection(
                                      header.id,
                                      "count-empty"
                                    )
                                  }
                                >
                                  Count empty
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatSelection(
                                      header.id,
                                      "count-not-empty"
                                    )
                                  }
                                >
                                  Count not empty
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatSelection(
                                      header.id,
                                      "percent-empty"
                                    )
                                  }
                                >
                                  Percent empty
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatSelection(
                                      header.id,
                                      "percent-not-empty"
                                    )
                                  }
                                >
                                  Percent not empty
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setColumnStats((prev) => ({
                                      ...prev,
                                      [header.id]: "",
                                    }))
                                  }
                                  className="text-destructive"
                                >
                                  Clear
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-full opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground hover:text-foreground"
                              >
                                Count <ChevronDown className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatSelection(header.id, "count-all")
                                }
                              >
                                Count all
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatSelection(header.id, "count-values")
                                }
                              >
                                Count values
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatSelection(header.id, "count-unique")
                                }
                              >
                                Count unique values
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatSelection(header.id, "count-empty")
                                }
                              >
                                Count empty
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatSelection(
                                    header.id,
                                    "count-not-empty"
                                  )
                                }
                              >
                                Count not empty
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatSelection(
                                    header.id,
                                    "percent-empty"
                                  )
                                }
                              >
                                Percent empty
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatSelection(
                                    header.id,
                                    "percent-not-empty"
                                  )
                                }
                              >
                                Percent not empty
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                  ))}
                <td className="border-t p-1 w-12"></td>
              </tr>
            </tfoot>
          </Table>
        </DndContext>
      </div>

      {enablePagination && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-[70px]">
                    {table.getState().pagination.pageSize}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                    <DropdownMenuItem
                      key={pageSize}
                      onClick={() => table.setPageSize(pageSize)}
                    >
                      {pageSize}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
