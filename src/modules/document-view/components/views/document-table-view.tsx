import React from "react";
import { DocumentDataTable } from "../document-data-table";
import { generateDocumentColumns } from "../document-columns";
import { useDocumentView } from "../../context/document-view-context";
import { toast } from "sonner";
import type {
  IDatabaseProperty,
  IDatabaseView,
  DatabaseRecord,
} from "@/modules/document-view";

interface DocumentTableViewProps {
  view: IDatabaseView;
  properties: IDatabaseProperty[];
  records: DatabaseRecord[];
  onRecordSelect?: (record: DatabaseRecord) => void;
  onRecordEdit?: (record: DatabaseRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onRecordUpdate?: (recordId: string, updates: Record<string, unknown>) => void;
  onRecordCreate?: () => void;
  onAddProperty?: () => void;
  databaseId?: string;
  moduleType?: string;
  isFrozen?: boolean;
  disablePropertyManagement?: boolean;
  apiFrozenConfig?: Record<string, unknown>; // API-provided frozen configuration
}

export function DocumentTableView({
  view,
  properties,
  records,
  onRecordSelect,
  onRecordEdit,
  onRecordDelete,
  onRecordUpdate,
  onRecordCreate,
  onAddProperty,
  databaseId,
  moduleType,
  isFrozen = false,
  disablePropertyManagement = false,
  apiFrozenConfig,
}: DocumentTableViewProps) {
  console.log("PROPERITES", properties);
  
  const { config, currentSchema, searchQuery } = useDocumentView();

  // Get frozen configuration from context
  const frozenConfig =
    config?.frozenConfig || currentSchema?.config?.frozenConfig;
  // Filter properties based on view's visible properties
  const visibleProperties = properties.filter((property) => {
    // Check view's visible properties
    if (
      view?.settings?.visibleProperties &&
      view.settings.visibleProperties.length > 0
    ) {
      return view.settings.visibleProperties.includes(property.id);
    }
    return property.isVisible !== false;
  });

  // Handle record updates - delegate to parent component
  const handleUpdateRecord = (
    recordId: string,
    propertyId: string,
    newValue: unknown
  ) => {
    if (!databaseId) return;

    if (isFrozen) {
      toast.error("Database is frozen and cannot be edited");
      return;
    }

    // Call the parent's update handler with the property update
    if (onRecordUpdate) {
      const updates = { [propertyId]: newValue };
      onRecordUpdate(recordId, updates);
    } else {
      console.log("No update handler provided:", {
        recordId,
        propertyId,
        newValue,
      });
    }
  };

  // Generate columns for the table
  const columns = generateDocumentColumns(
    visibleProperties,
    databaseId || "",
    onRecordEdit,
    onRecordDelete,
    handleUpdateRecord,
    () => {
      // Refresh callback - could trigger a refetch of data
      console.log("Refreshing table data...");
    },
    isFrozen,
    frozenConfig,
    undefined, // onFilter
    undefined, // onFreeze
    disablePropertyManagement,
    moduleType || config?.moduleType || "database", // moduleType
    apiFrozenConfig // API-provided frozen configuration
  );

  // Apply view filters, search, and sorts to records
  const filteredRecords = React.useMemo(() => {
    // Safety check for records
    if (!records || !Array.isArray(records)) {
      return [];
    }

    let result = [...records];

    // Apply search query
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((record) => {
        // Search across all visible properties
        return visibleProperties.some((property) => {
          const value = record.properties[property.id];
          if (value == null) return false;

          // Convert value to string and search
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(query);
        });
      });
    }

    // Apply filters
    if (view.filters && view.filters.length > 0) {
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
    if (view.sorts && view.sorts.length > 0) {
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
  }, [records, view.filters, view.sorts, searchQuery, visibleProperties]);

  return (
    <div className="space-y-4">
      <DocumentDataTable
        columns={columns}
        data={filteredRecords}
        properties={properties} // Pass all properties, not just visible ones
        onRecordSelect={onRecordSelect}
        onRecordEdit={onRecordEdit}
        onRecordDelete={onRecordDelete}
        onRecordCreate={onRecordCreate}
        onAddProperty={onAddProperty}
      />
    </div>
  );
}
