import { useMemo } from "react";
import { DataTable } from "../data-table.tsx";
import { generateDocumentColumns } from "../columns.tsx";
import { useDatabaseView } from "@/modules/database-view/context";
import { useUpdateRecord } from "@/modules/database-view/services/database-queries";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TableSkeleton } from "../skeleton";
import type { TPropertyValue } from "@/modules/database-view/types";

interface TableProps {
  className?: string;
}

export function Table({ className = "" }: TableProps) {
  const {
    database,
    properties,
    records,
    isInitialLoading,
    isPropertiesLoading,
    isLoadingMore,
    hasMoreRecords,
    onBulkEdit,
    onBulkDelete,
    onRecordDelete,
    onRecordDuplicate,
    onRecordCreate,
    onAddProperty,
    onLoadMoreRecords,
  } = useDatabaseView();

  const { mutateAsync: updateRecordMutation } = useUpdateRecord();

  const columns = useMemo(() => {
    const handleUpdateRecord = async (
      recordId: string,
      propertyId: string,
      newValue: TPropertyValue
    ) => {
      if (!database?.id) return;

      const payload: Record<string, TPropertyValue> = {
        [propertyId]: newValue,
      };
      await updateRecordMutation({
        databaseId: database.id,
        recordId,
        payload,
      });
    };

    return generateDocumentColumns(properties, handleUpdateRecord);
  }, [properties, database?.id, updateRecordMutation]);

  if (isPropertiesLoading || isInitialLoading) return <TableSkeleton />;

  return (
    <div className={`space-y-4 ${className}`}>
      <DataTable
        columns={columns}
        data={records || []}
        enablePagination={false}
        enableSorting={true}
        enableFiltering={true}
        pageSize={25}
        onBulkEdit={onBulkEdit}
        onBulkDelete={onBulkDelete}
        onRecordDelete={onRecordDelete}
        onRecordDuplicate={onRecordDuplicate}
        onRecordCreate={onRecordCreate}
        onAddProperty={onAddProperty}
      />

      {/* Load More Button - Full Width like Notion */}
      {hasMoreRecords && (
        <div className="border-t bg-muted/20">
          <Button
            onClick={onLoadMoreRecords}
            disabled={isLoadingMore}
            variant="ghost"
            className="w-full h-12 rounded-none border-0 gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            {isLoadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
