import {
  DocumentViewProvider,
  useDocumentView,
} from "@/modules/document-view/context/document-view-context";
import {
  EDatabaseType,
  type IDatabaseView,
} from "@/modules/document-view/types";
import { DatabasePrimaryButtons } from "@/modules/document-view/components/document-primary-buttons";
import { DocumentViewTabs } from "@/modules/document-view/components/document-view-tabs";
import { TableToolbar } from "@/modules/document-view";
import { DocumentViewRenderer } from "@/modules/document-view/components/document-view-renderer";
import { DatabaseDialogs } from "@/modules/document-view/components/document-view-dialogs";
import { NoDataMessage } from "@/components/no-data-message";
import {
  HeaderSkeleton,
  TableSkeleton,
  TabsSkeleton,
  ToolbarSkeleton,
} from "@/modules/document-view/components/skeleton";

export interface DocumentViewProps {
  moduleType: EDatabaseType;
  databaseId?: string;
  className?: string;
}

interface DocumentContentProps {
  isLoadingDatabase: boolean;
  currentView: IDatabaseView | undefined;
}

const DocumentContent = ({
  isLoadingDatabase,
  currentView,
}: DocumentContentProps) => {
  if (isLoadingDatabase) return <TableSkeleton />;
  if (!currentView)
    return (
      <NoDataMessage
        title="No View Available"
        message={"No view has been selected"}
      />
    );

  return <DocumentViewRenderer />;
};

function DocumentViewInternal({ className }: DocumentViewProps) {
  const {
    database,
    views,
    isLoadingDatabase,
    isLoadingViews,
    isLoadingProperties,
  } = useDocumentView();

  return (
    <div className={`flex flex-col ${className || ""}`}>
      {isLoadingDatabase ? (
        <HeaderSkeleton />
      ) : (
        <div className="flex-shrink-0 mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {database?.name}
              {/*{shouldShowFrozenBadge() && (*/}
              {/*    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">*/}
              {/*      Frozen*/}
              {/*    </span>*/}
              {/*)}*/}
            </h2>
            <p className="text-muted-foreground">{database?.description}</p>
          </div>
          <DatabasePrimaryButtons />
        </div>
      )}

      <div className="flex-shrink-0 mb-4">
        {isLoadingViews ? (
          <TabsSkeleton />
        ) : (
          views.length > 0 && <DocumentViewTabs />
        )}
      </div>

      <div className="flex-shrink-0 mb-4">
        {isLoadingProperties ? (
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
        <DocumentContent />
      </div>

      <DatabaseDialogs />
    </div>
  );
}

export function DocumentView(props: DocumentViewProps) {
  return (
    <DocumentViewProvider
      moduleType={props.moduleType}
      databaseId={props.databaseId}
    >
      <DocumentViewInternal {...props} />
    </DocumentViewProvider>
  );
}
