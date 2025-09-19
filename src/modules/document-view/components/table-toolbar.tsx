import { Badge } from "@/components/ui/badge";
import { SearchBar } from "./search-bar";
import { FilterManager } from "./filter-manager";
import { SortManager } from "./sort-manager";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ColumnVisibilityMenu } from "./column-visibility-menu";
import { useColumnVisibility } from "../hooks/use-column-visibility";
import {
    type DatabaseRecord,
    type DatabaseView,
    EDatabaseType,
    type IDatabaseProperty
} from "@/modules/document-view/types";

interface TableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  properties: IDatabaseProperty[];
  records: DatabaseRecord[];
  currentView: DatabaseView | undefined;
  onFiltersChange?: (filters) => void;
  onSortsChange?: (sorts) => void;
  onUpdateView?: (viewId, data) => Promise<void>;
  visibleProperties?: string[];
  moduleType: EDatabaseType;
  className?: string;
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
              properties={properties}
              currentView={currentView}
              onSave={handleFiltersChange}
            />

            <SortManager
              properties={properties}
              currentView={currentView}
              onSave={handleSortsChange}
            />

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
        </div>


      </div>
    </TooltipProvider>
  );
}
