import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHeader } from "./table-header.tsx";
import { EditableCell } from "./editable-cell";
import { Users } from "lucide-react";
import type {
  TProperty,
  TPropertyOption,
  TRecord,
} from "@/modules/database-view/types";

export interface FrozenPropertyConfig {
  propertyId: string;
  reason?: string;
  allowEdit?: boolean;
  allowHide?: boolean;
  allowDelete?: boolean;
}

export interface ViewFrozenConfig {
  viewType?: string;
  moduleType?: string;
  frozenProperties: FrozenPropertyConfig[];
  description?: string;
}

export const isPropertyFrozen = (
  propertyId: string,
  frozenConfig?: ViewFrozenConfig | null
): FrozenPropertyConfig | null => {
  if (!frozenConfig) return null;
  return (
    frozenConfig?.frozenProperties?.find(
      (fp) => fp.propertyId === propertyId
    ) || null
  );
};

export const canEditProperty = (
  propertyId: string,
  frozenConfig?: ViewFrozenConfig | null
): boolean => {
  const frozenProp = isPropertyFrozen(propertyId, frozenConfig);
  return frozenProp ? frozenProp.allowEdit !== false : true;
};

export const canHideProperty = (
  propertyId: string,
  frozenConfig?: ViewFrozenConfig | null
): boolean => {
  const frozenProp = isPropertyFrozen(propertyId, frozenConfig);
  return frozenProp ? frozenProp.allowHide !== false : true;
};

export const canDeleteProperty = (
  propertyId: string,
  frozenConfig?: ViewFrozenConfig | null
): boolean => {
  const frozenProp = isPropertyFrozen(propertyId, frozenConfig);
  return frozenProp ? frozenProp.allowDelete !== false : true;
};

const statusColors = {
  Todo: "bg-gray-100 text-gray-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Done: "bg-green-100 text-green-800",
  Canceled: "bg-red-100 text-red-800",
  Planning: "bg-yellow-100 text-yellow-800",
  Active: "bg-blue-100 text-blue-800",
  "On Hold": "bg-orange-100 text-orange-800",
  Completed: "bg-green-100 text-green-800",
};

const priorityColors = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800",
  Urgent: "bg-red-100 text-red-800",
};

const renderCellValue = (property: TProperty, value: unknown) => {
  if (!value && value !== false && value !== 0) {
    return <span className="text-muted-foreground">-</span>;
  }

  switch (property.type) {
    case "select": {
      if (
        typeof value === "object" &&
        value !== null &&
        "name" in value &&
        "color" in value
      ) {
        const option = value as { id: string; name: string; color: string };
        return (
          <Badge
            className="text-white border-0"
            style={{ backgroundColor: option.color }}
          >
            {option.name}
          </Badge>
        );
      }

      if (typeof value === "string" && property.config?.options) {
        const option = property.config?.options?.find(
          (opt: TPropertyOption) => opt.id === value
        );
        if (option) {
          return (
            <Badge
              className="text-white border-0"
              style={{ backgroundColor: option.color }}
            >
              {option.label}
            </Badge>
          );
        }
      }

      return (
        <Badge className="bg-gray-100 text-gray-800">{value as string}</Badge>
      );
    }

    case "multi_select":
      if (!Array.isArray(value))
        return <span className="text-muted-foreground">-</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {value.map((option, index) => {
            if (
              typeof option === "object" &&
              option !== null &&
              "name" in option &&
              "color" in option
            ) {
              const optionObj = option as {
                id: string;
                name: string;
                color: string;
              };
              return (
                <Badge
                  key={optionObj.id || index}
                  className="text-white border-0"
                  style={{ backgroundColor: optionObj.color }}
                >
                  {optionObj.name}
                </Badge>
              );
            }

            return (
              <Badge
                key={index}
                className={
                  statusColors[option as keyof typeof statusColors] ||
                  priorityColors[option as keyof typeof priorityColors] ||
                  "bg-gray-100 text-gray-800"
                }
              >
                {option}
              </Badge>
            );
          })}
        </div>
      );

    case "checkbox":
      return <Checkbox checked={value === true || value === "true"} disabled />;

    case "date":
      return value ? new Date(value as string).toLocaleDateString() : "-";

    case "url":
      return (
        <a
          href={value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline truncate max-w-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {value as string}
        </a>
      );

    case "email":
      return (
        <a
          href={`mailto:${value}`}
          className="hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {value as string}
        </a>
      );

    case "phone":
      return (
        <a
          href={`tel:${value}`}
          className="hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {value as string}
        </a>
      );

    case "relation":
      return (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="truncate max-w-xs">{value as string}</span>
        </div>
      );

    case "formula":
    case "rollup":
      return (
        <span className="truncate max-w-xs font-mono text-sm">
          {String(value)}
        </span>
      );

    case "created_time":
    case "last_edited_time":
      return value ? new Date(String(value)).toLocaleString() : "-";

    case "created_by":
    case "last_edited_by":
      return (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs">
            {String(value).charAt(0).toUpperCase()}
          </div>
          <span className="truncate max-w-xs">{String(value)}</span>
        </div>
      );

    default:
      return (
        <span className="truncate max-w-xs" title={String(value)}>
          {String(value)}
        </span>
      );
  }
};

export const generateDocumentColumns = (
  properties: TProperty[],
  onUpdateRecord?: (
    recordId: string,
    propertyId: string,
    newValue: string
  ) => void
): ColumnDef<TRecord>[] => {
  const columns: ColumnDef<TRecord>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  properties.forEach((property) => {
    columns.push({
      accessorKey: `properties.${property.id}`,
      id: property.id,
      header: ({ column }) => {
        return (
          <TableHeader
            property={property}
            sortDirection={
              column.getIsSorted() === "asc"
                ? "asc"
                : column.getIsSorted() === "desc"
                ? "desc"
                : null
            }
          />
        );
      },
      cell: ({ row }) => {
        const value = row.original.properties[property.id];

        if (onUpdateRecord) {
          return (
            <EditableCell
              property={property}
              value={value}
              record={row.original}
            />
          );
        }

        return renderCellValue(property, value);
      },
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, _id, value) => {
        const cellValue = row.original.properties[property.id];

        if (property.type === "multi_select" && Array.isArray(cellValue)) {
          const cellArray = cellValue as (
            | string
            | { id: string; name?: string; label?: string; color?: string }
          )[];
          return value.some((v: string) => {
            return cellArray.some((option) => {
              if (
                typeof option === "object" &&
                option !== null &&
                "id" in option
              ) {
                return (
                  option.id === v || option.name === v || option.label === v
                );
              }
              return option === v;
            });
          });
        }

        if (property.type === "select") {
          if (
            typeof cellValue === "object" &&
            cellValue !== null &&
            "id" in cellValue
          ) {
            const option = cellValue as {
              id: string;
              name?: string;
              label?: string;
            };
            return (
              value.includes(option.id) ||
              (option.name && value.includes(option.name)) ||
              (option.label && value.includes(option.label))
            );
          }
          return value.includes(cellValue);
        }

        return value.includes(cellValue);
      },
    });
  });

  return columns;
};
