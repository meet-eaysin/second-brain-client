import React, { useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  type RowSelectionState,
} from "@tanstack/react-table";
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
  Edit,
} from "lucide-react";
import type { DatabaseRecord, DocumentProperty } from "@/modules/document-view";

interface DocumentDataTableProps {
  columns: ColumnDef<DatabaseRecord, string>[];
  data: DatabaseRecord[];
  properties?: DocumentProperty[];
  onRecordSelect?: (record: DatabaseRecord) => void;
  onRecordEdit?: (record: DatabaseRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onRecordCreate?: () => void;
  onBulkDelete?: (recordIds: string[]) => void;
  onBulkEdit?: (records: DatabaseRecord[]) => void;
  onAddProperty?: () => void;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  pageSize?: number;
}

export function DocumentDataTable({
  columns,
  data,
  onRecordEdit,
  onRecordDelete,
  onRecordCreate,
  onBulkDelete,
  onBulkEdit,
  onAddProperty,
  enablePagination = true,
  enableRowSelection = true,
  pageSize = 50,
}: DocumentDataTableProps) {
  const [columnStats, setColumnStats] = useState<Record<string, string>>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getRowId: (row) => row.id,
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

  const handleBulkDelete = () => {
    if (selectedRecords.length > 0 && onBulkDelete) {
      const recordIds = selectedRecords.map((record) => record.id);
      onBulkDelete(recordIds);
      setRowSelection({});
    }
  };

  const handleBulkEdit = () => {
    if (selectedRecords.length > 0 && onBulkEdit) onBulkEdit(selectedRecords);
  };

  return (
    <div className="space-y-4 relative">
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
              {onBulkEdit && (
                <Button variant="outline" size="sm" onClick={handleBulkEdit}>
                  <Plus className="h-4 w-4 mr-2" />
                  Edit Selected
                </Button>
              )}
              {onBulkDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              )}
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
                {onAddProperty && (
                  <TableHead className="w-12">
                    <div className="flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onAddProperty}
                        className="h-8 w-8 p-0 hover:bg-muted/50"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {onAddProperty && (
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
                              onClick={() => onRecordEdit?.(row.original)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Record
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                console.log(
                                  "Duplicate record:",
                                  row.original.id
                                )
                              }
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onRecordDelete?.(row.original.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (onAddProperty ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}

            {onRecordCreate && (
              <TableRow className="hover:bg-muted/50 border-t-2">
                <TableCell
                  colSpan={columns.length + (onAddProperty ? 1 : 0)}
                  className="text-center py-2 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={onRecordCreate}
                >
                  <div className="flex items-center justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    <span>New Record</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <tfoot>
            <tr>
              {table.getHeaderGroups()[0]?.headers.map((header) => (
                <td key={header.id} className="border-t p-1 group">
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
                                handleStatSelection(header.id, "percent-empty")
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
                              handleStatSelection(header.id, "count-not-empty")
                            }
                          >
                            Count not empty
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatSelection(header.id, "percent-empty")
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
              {onAddProperty && <td className="border-t p-1 w-12"></td>}
            </tr>
          </tfoot>
        </Table>
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
