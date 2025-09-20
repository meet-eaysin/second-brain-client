
export const HeaderSkeleton = () => (
    <div className="flex-shrink-0 mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
    </div>
);

export const TabsSkeleton = () => (
    <div className="flex-shrink-0 mb-4">
        <div className="animate-pulse flex space-x-2">
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
            <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
    </div>
);

export const ToolbarSkeleton = () => (
    <div className="flex-shrink-0 mb-4">
        <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
    </div>
);

export const TableSkeleton = () => (
    <div className="space-y-4">
        {/* Table header skeleton */}
        <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded"></div>
        </div>
        {/* Table rows skeleton */}
        {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-100 rounded"></div>
            </div>
        ))}
    </div>
);