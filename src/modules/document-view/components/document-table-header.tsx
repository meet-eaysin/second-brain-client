import React from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Type,
  Hash,
  Mail,
  Link,
  Phone,
  CheckSquare,
  Calendar,
  List,
  Tags,
  Lock,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PropertyHeaderMenu } from "./property-header-menu";
import type { DocumentProperty, PropertyType } from "@/modules/document-view";

interface DocumentTableHeaderProps {
  property: DocumentProperty;
  documentId: string;
  sortDirection?: "asc" | "desc" | null;
  isFiltered?: boolean;
  isFrozen?: boolean;
  frozenReason?: string;
  disablePropertyManagement?: boolean;
  moduleType?: string;
  onEditName?: (property: DocumentProperty, newName: string) => void;
  onChangeType?: (property: DocumentProperty, newType: PropertyType) => void;
  onFilter?: (property: DocumentProperty) => void;
  onSort?: (property: DocumentProperty, direction: "asc" | "desc") => void;
  onFreeze?: (property: DocumentProperty) => void;
  onHide?: (property: DocumentProperty) => void;
  onInsertLeft?: (property: DocumentProperty) => void;
  onInsertRight?: (property: DocumentProperty) => void;
  onDuplicate?: (property: DocumentProperty) => void;
  onDelete?: (property: DocumentProperty) => void;
  onRefresh?: () => void;
}

const PROPERTY_TYPE_ICONS = {
  TEXT: Type,
  NUMBER: Hash,
  EMAIL: Mail,
  URL: Link,
  PHONE: Phone,
  CHECKBOX: CheckSquare,
  DATE: Calendar,
  SELECT: List,
  MULTI_SELECT: Tags,
} as const;

export function DocumentTableHeader({
  property,
  documentId,
  sortDirection,
  isFiltered,
  isFrozen,
  frozenReason,
  disablePropertyManagement = false,
  moduleType = "document",
  onEditName,
  onChangeType,
  onFilter,
  onSort,
  onFreeze,
  onHide,
  onInsertLeft,
  onInsertRight,
  onDuplicate,
  onDelete,
  onRefresh,
}: DocumentTableHeaderProps) {
  const IconComponent =
    PROPERTY_TYPE_ICONS[property.type as keyof typeof PROPERTY_TYPE_ICONS] ||
    Type;

  const getSortIcon = () => {
    if (sortDirection === "asc") return ArrowUp;
    if (sortDirection === "desc") return ArrowDown;
    return ArrowUpDown;
  };

  const SortIcon = getSortIcon();

  return (
    <PropertyHeaderMenu
      property={property}
      documentId={documentId}
      disablePropertyManagement={disablePropertyManagement}
      moduleType={moduleType}
      onEditName={onEditName}
      onChangeType={onChangeType}
      onFilter={onFilter}
      onSort={onSort}
      onFreeze={onFreeze}
      onHide={onHide}
      onInsertLeft={onInsertLeft}
      onInsertRight={onInsertRight}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      onRefresh={onRefresh}
    >
      <button className="flex items-center justify-between w-full cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors text-left">
        <div className="flex items-center space-x-1 min-w-0 flex-1">
          <IconComponent className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span
            className={`font-medium text-sm truncate ${
              isFrozen ? "text-amber-700" : ""
            }`}
          >
            {property.name}
          </span>
          {property.required && <span className="text-red-500 text-xs">*</span>}
          {isFrozen && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-shrink-0">
                  <Lock className="h-3 w-3 text-amber-600" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  <p className="font-medium">Protected Property</p>
                  {frozenReason && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {frozenReason}
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
          <div className="flex items-center space-x-1 ml-2">
            {isFiltered && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
            <SortIcon className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      </button>
    </PropertyHeaderMenu>
  );
}
