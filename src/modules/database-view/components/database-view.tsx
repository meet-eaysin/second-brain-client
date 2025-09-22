import { EDatabaseType } from "@/modules/database-view/types";
import { DatabasePrimaryButtons } from "@/modules/database-view/components/primary-buttons.tsx";
import { ViewTabs } from "@/modules/database-view/components/tabs.tsx";
import { TableToolbar } from "@/modules/database-view";
import { Renderer } from "@/modules/database-view/components/renderer.tsx";
import { DatabaseDialogs } from "@/modules/database-view/components/dialog-forms/dialogs.tsx";
import { NoDataMessage } from "@/components/no-data-message";
import {
  HeaderSkeleton,
  TableSkeleton,
  TabsSkeleton,
  ToolbarSkeleton,
} from "@/modules/database-view/components/skeleton";
import {
  DatabaseViewProvider,
  useDatabaseView,
} from "@/modules/database-view/context";

export interface DocumentViewProps {
  moduleType: EDatabaseType;
  databaseId?: string;
  className?: string;
}

function DocumentViewInternal({ className }: DocumentViewProps) {
  const {
    database,
    views,
    currentView,
    isDatabaseLoading,
    isViewsLoading,
    isPropertiesLoading,
    isCurrentViewLoading,
  } = useDatabaseView();

  return (
    <div className={`flex flex-col ${className || ""}`}>
      {isDatabaseLoading ? (
        <HeaderSkeleton />
      ) : (
        <div className="flex-shrink-0 mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {database?.name}
              {database?.isFrozen && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Frozen
                </span>
              )}
            </h2>
            <p className="text-muted-foreground">{database?.description}</p>
          </div>
          <DatabasePrimaryButtons />
        </div>
      )}

      <div className="flex-shrink-0 mb-4">
        {isViewsLoading ? <TabsSkeleton /> : views.length > 0 && <ViewTabs />}
      </div>

      <div className="flex-shrink-0 mb-4">
        {isPropertiesLoading ? (
          <ToolbarSkeleton />
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <TableToolbar />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {isDatabaseLoading && <TableSkeleton />}
        {!isDatabaseLoading && isCurrentViewLoading && <TableSkeleton />}
        {!isDatabaseLoading && !isCurrentViewLoading && !currentView && (
          <NoDataMessage
            title="No View Available"
            message={"No view has been selected"}
          />
        )}
        {!isDatabaseLoading && !isCurrentViewLoading && currentView && (
          <Renderer />
        )}
      </div>

      <DatabaseDialogs />
    </div>
  );
}

export function DatabaseView(props: DocumentViewProps) {
  return (
    <DatabaseViewProvider
      moduleType={props.moduleType}
      databaseId={props.databaseId}
    >
      <DocumentViewInternal {...props} />
    </DatabaseViewProvider>
  );
}
