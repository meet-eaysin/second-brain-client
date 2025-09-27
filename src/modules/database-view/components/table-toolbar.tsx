import { SearchBar } from "./search-bar";
import { FilterManager } from "./filter-manager";
import { SortManager } from "./sort-manager";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { ColumnVisibilityMenu } from "./column-visibility-menu";
import { useDatabaseView } from "@/modules/database-view/context";

export function TableToolbar() {
  const { currentView, moduleType } = useDatabaseView();

  const activeFiltersCount = currentView?.filters?.length || 0;
  const activeSortsCount = currentView?.sorts?.length || 0;
  const hiddenPropertiesCount =
    currentView?.settings?.hiddenProperties?.length || 0;

  return (
    <TooltipProvider>
      <div className={`space-y-4`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-lg">
            <SearchBar placeholder="Search records..." className="w-full" />
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

            <FilterManager />

            <SortManager />

            {currentView && moduleType && <ColumnVisibilityMenu />}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
