import { useMemo } from "react";
import { DataTable } from "../data-table.tsx";
import { generateDocumentColumns } from "../columns.tsx";
import { useDatabaseView } from "@/modules/database-view/context";
import { useUpdateRecord } from "@/modules/database-view/services/database-queries";
import type { TPropertyValue } from "@/modules/database-view/types";

interface TableProps {
  className?: string;
}

export function Table({ className = "" }: TableProps) {
  const {
    database,
    properties,
    records,
    isRecordsLoading,
    isPropertiesLoading,
    onBulkEdit,
    onBulkDelete,
    onRecordEdit,
    onRecordDelete,
    onRecordDuplicate,
    onRecordCreate,
    onAddProperty,
    onRecordOpen,
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

  // Show loading state
  if (isPropertiesLoading || isRecordsLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">
            {isPropertiesLoading
              ? "Loading properties..."
              : "Loading records..."}
          </p>
        </div>
      </div>
    );
  }

  // Show empty state if no records
  if (!records || records.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No records found</p>
          <button
            onClick={onRecordCreate}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Create First Record
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <DataTable
        columns={columns}
        data={records}
        enablePagination={true}
        enableSorting={true}
        enableFiltering={true}
        pageSize={25}
        onBulkEdit={onBulkEdit}
        onBulkDelete={onBulkDelete}
        onRecordEdit={onRecordEdit}
        onRecordDelete={onRecordDelete}
        onRecordDuplicate={onRecordDuplicate}
        onRecordCreate={onRecordCreate}
        onAddProperty={onAddProperty}
        onRecordOpen={onRecordOpen}
      />
    </div>
  );
}
