import { DocumentDataTable } from "../document-data-table";
import { generateDocumentColumns } from "../document-columns";
import { useDocumentView } from "../../context/document-view-context";
import { toast } from "sonner";
import {useMemo} from "react";
import {useUpdateRecord} from "@/modules/document-view/services/database-queries.ts";
import type {IDatabaseRecord} from "@/modules/document-view/types";

export function DocumentTableView() {
  const { database, currentView: view, visibleProperties, properties, records, searchQuery } = useDocumentView();
  const { mutateAsync: onRecordUpdate } = useUpdateRecord()


    const handleUpdateRecord = async (recordId: string, propertyId: string, newValue: unknown) => {
        if (!database?.id) return;
        const payload = { [propertyId]: newValue };
        await onRecordUpdate({ databaseId: database.id, recordId, payload });
    };


  const columns = generateDocumentColumns(properties, handleUpdateRecord);

  const filteredRecords = useMemo(() => {
    if (!records || !Array.isArray(records)) return [];

    let result = [...records];

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((record) => {
        return visibleProperties.some((property) => {
          const value = record.properties[property.id];
          if (value == null) return false;

          const stringValue = String(value).toLowerCase();
          return stringValue.includes(query);
        });
      });
    }

    if (view?.filters && view.filters.length > 0) {
      result = result.filter((record) => {
        return view.filters!.every((filter) => {
          const value = record.properties[filter.propertyId];

          switch (filter.operator) {
            case "equals":
              return value === filter.value;
            case "not_equals":
              return value !== filter.value;
            case "contains":
              return String(value)
                .toLowerCase()
                .includes(String(filter.value).toLowerCase());
            case "starts_with":
              return String(value)
                .toLowerCase()
                .startsWith(String(filter.value).toLowerCase());
            case "ends_with":
              return String(value)
                .toLowerCase()
                .endsWith(String(filter.value).toLowerCase());
            case "is_empty":
              return !value || value === "";
            case "is_not_empty":
              return value && value !== "";
            case "greater_than":
              return Number(value) > Number(filter.value);
            case "less_than":
              return Number(value) < Number(filter.value);
            default:
              return true;
          }
        });
      });
    }

    // Apply sorts
    if (view?.sorts && view.sorts.length > 0) {
      result.sort((a, b) => {
        for (const sort of view.sorts!) {
          const aValue = a.properties[sort.propertyId];
          const bValue = b.properties[sort.propertyId];

          let comparison = 0;

          if (aValue < bValue) comparison = -1;
          else if (aValue > bValue) comparison = 1;

          if (comparison !== 0) {
            return sort.direction === "desc" ? -comparison : comparison;
          }
        }
        return 0;
      });
    }

    return result;
  }, [records, view?.filters, view?.sorts, searchQuery, visibleProperties]);

  return (
    <div className="space-y-4">
      <DocumentDataTable
        columns={columns}
        data={filteredRecords}
      />
    </div>
  );
}
