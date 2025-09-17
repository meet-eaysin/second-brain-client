import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "./search-bar";
import { FilterManager } from "./filter-manager";
import { SortManager } from "./sort-manager";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import type {
  DocumentProperty,
  DatabaseView,
  DatabaseRecord,
} from "@/modules/document-view";
import { ColumnVisibilityMenu } from "./column-visibility-menu";
import { useColumnVisibility } from "../hooks/use-column-visibility";

interface TableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  properties: DocumentProperty[];
  records: DatabaseRecord[];
  currentView?: DatabaseView;
  onFiltersChange?: (filters) => void;
  onSortsChange?: (sorts) => void;
  onUpdateView?: (viewId, data) => Promise<void>;
  visibleProperties?: string[];
  className?: string;
  moduleType;
}

export function TableToolbar({
  searchValue,
  onSearchChange,
  properties,
  records,
  currentView,
  onFiltersChange,
  onSortsChange,
  onUpdateView,
  visibleProperties = [],
  moduleType,
  className = "",
}: TableToolbarProps) {
  const columnVisibility = useColumnVisibility({
    moduleType,
    properties,
    currentView,
    onUpdateView,
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const activeFiltersCount = currentView?.filters?.length || 0;
  const activeSortsCount = currentView?.sorts?.length || 0;
  const hiddenPropertiesCount = properties.length - visibleProperties.length;

  const handleFiltersChange = (filters) => onFiltersChange?.(filters);
  const handleSortsChange = async (sorts) => onSortsChange?.(sorts);

  return (
    <TooltipProvider>
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-lg">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              properties={properties}
              placeholder="Search records..."
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            {(activeFiltersCount > 0 ||
              activeSortsCount > 0 ||
              hiddenPropertiesCount > 0) && (
              <Tooltip>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-medium">Active Settings:</p>
                    {activeFiltersCount > 0 && (
                      <p>
                        • {activeFiltersCount} Filter
                        {activeFiltersCount !== 1 ? "s" : ""}
                      </p>
                    )}
                    {activeSortsCount > 0 && (
                      <p>
                        • {activeSortsCount} Sort
                        {activeSortsCount !== 1 ? "s" : ""}
                      </p>
                    )}
                    {hiddenPropertiesCount > 0 && (
                      <p>
                        • {hiddenPropertiesCount} Hidden Column
                        {hiddenPropertiesCount !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}

            <Badge variant="outline" className="text-sm hidden sm:flex">
              {records.length} record{records.length !== 1 ? "s" : ""}
            </Badge>

            <FilterManager
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
              properties={properties}
              currentView={currentView}
              onSave={handleFiltersChange}
            />

            <SortManager
              open={isSortOpen}
              onOpenChange={setIsSortOpen}
              properties={properties}
              currentView={currentView}
              onSave={handleSortsChange}
            />
          </div>
        </div>

        {currentView && moduleType && columnVisibility && (
          <ColumnVisibilityMenu
            properties={properties}
            currentView={currentView}
            onToggleProperty={columnVisibility.toggleProperty}
            onShowAll={columnVisibility.showAll}
            onHideAll={columnVisibility.hideAll}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
