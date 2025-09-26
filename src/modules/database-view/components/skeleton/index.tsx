import { Skeleton } from "@/components/ui/skeleton";
import {Spinner} from "@/components/ui/kibo-ui/spinner";

export const HeaderSkeleton = () => (
  <div className="flex-shrink-0 mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-48" />
    </div>
    <Skeleton className="h-10 w-32" />
  </div>
);

export const TabsSkeleton = () => (
  <div className="flex-shrink-0 mb-4">
    <div className="flex space-x-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

export const ToolbarSkeleton = () => (
  <div className="flex-shrink-0 mb-4">
    <Skeleton className="h-12 w-full" />
  </div>
);

export const TableSkeleton = () => (
  <div className="space-y-4">
    {/* Table header skeleton */}
    <Skeleton className="h-12 w-full" />
    {/* Table rows skeleton */}
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
);

export const GallerySkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 3 }).map((_, groupIndex) => (
        <div key={groupIndex} className="flex-shrink-0 w-80">
          <div className="bg-muted/50 rounded-lg p-4">
            {/* Group header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-8" />
              </div>
              <Skeleton className="h-6 w-6 rounded" />
            </div>
            {/* Cards */}
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, cardIndex) => (
                <div key={cardIndex} className="border rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <Skeleton className="w-4 h-4" />
                        <Skeleton className="h-4 flex-1" />
                      </div>
                      <Skeleton className="w-6 h-6 rounded" />
                    </div>
                    <Skeleton className="h-3 w-3/4" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ListSkeleton = () => (
  <div className="w-full h-full overflow-auto space-y-4">
    {Array.from({ length: 4 }).map((_, groupIndex) => (
      <div key={groupIndex} className="space-y-2">
        {/* Group header */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="h-5 w-24" />
        </div>
        {/* List items */}
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, itemIndex) => (
            <div
              key={itemIndex}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <Skeleton className="w-2 h-2 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="w-6 h-6 rounded" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const DatabaseInitializationLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <Spinner/>
    <div className="text-center space-y-2">
      <h3 className="text-lg font-medium">Initializing Database</h3>
      <p className="text-sm text-muted-foreground">
        Setting up your database structure. This may take a few moments...
      </p>
    </div>
  </div>
);
