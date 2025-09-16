// API Response Types based on actual server responses from info.txt

export interface BooksApiResponse {
    success: boolean;
    message: string;
    data: {
        books: BookApiData[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
    timestamp: string;
}

export interface BookApiData {
    _id: string;
    title: string;
    author: string;
    genre: string[];
    status: 'want_to_read' | 'currently_reading' | 'completed' | 'on_hold' | 'abandoned';
    notes: any[];
    keyInsights: any[];
    actionItems: any[];
    area: string;
    tags: string[];
    linkedProjects: any[];
    linkedGoals: any[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    // Optional fields
    isbn?: string;
    rating?: number;
    pages?: number;
    currentPage?: number;
    startDate?: string;
    finishDate?: string;
}

export interface BookStatsApiResponse {
    success: boolean;
    message: string;
    data: {
        overview: {
            _id: null;
            totalBooks: number;
            completedBooks: number;
            currentlyReading: number;
            wantToRead: number;
            totalPages: number;
            pagesRead: number;
            averageRating: number | null;
        };
        statusBreakdown: Array<{
            _id: string;
            count: number;
        }>;
        genreBreakdown: Array<{
            _id: string;
            count: number;
        }>;
    };
    timestamp: string;
}

export interface DocumentViewConfigApiResponse {
    success: boolean;
    message: string;
    data: {
        moduleType: string;
        displayName: string;
        displayNamePlural: string;
        description: string;
        icon: string;
        capabilities: {
            canCreate: boolean;
            canEdit: boolean;
            canDelete: boolean;
            canShare: boolean;
            canExport: boolean;
            canImport: boolean;
        };
        ui: {
            enableViews: boolean;
            enableSearch: boolean;
            enableFilters: boolean;
            enableSorts: boolean;
            enableGrouping: boolean;
            supportedViewTypes: string[];
            defaultViewType: string;
        };
        data: {
            defaultProperties: PropertyApiData[];
            defaultViews: ViewApiData[];
            requiredProperties: string[];
            frozenProperties: string[];
        };
        services: {
            recordService: string;
            modelName: string;
            databaseId: string;
        };
        frozenConfig: {
            viewType: string;
            moduleType: string;
            description: string;
            frozenProperties: Array<{
                propertyId: string;
                reason: string;
                allowEdit: boolean;
                allowHide: boolean;
                allowDelete: boolean;
            }>;
        };
    };
    timestamp: string;
}

export interface ViewsApiResponse {
    success: boolean;
    message: string;
    data: ViewApiData[];
    timestamp: string;
}

export interface ViewApiData {
    id: string;
    name: string;
    type: 'TABLE' | 'BOARD' | 'GALLERY' | 'LIST';
    description: string;
    isDefault: boolean;
    isPublic: boolean;
    filters: Array<{
        propertyId: string;
        operator: string;
        value: any;
        enabled: boolean;
    }>;
    sorts: Array<{
        propertyId: string;
        direction: 'asc' | 'desc';
        order: number;
        enabled?: boolean;
    }>;
    visibleProperties: string[];
    customProperties: any[];
    config: {
        canEdit: boolean;
        canDelete: boolean;
        isSystemView: boolean;
        groupProperty?: string;
        colorProperty?: string;
    };
    permissions: any[];
    createdAt: string;
    updatedAt: string;
    groupBy?: string;
}

export interface PropertiesApiResponse {
    success: boolean;
    message: string;
    data: PropertyApiData[];
    timestamp: string;
}

export interface PropertyApiData {
    id: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'multiSelect' | 'date' | 'boolean';
    description: string;
    required: boolean;
    options: Array<{
        name: string;
        color: string;
        value: any;
    }>;
    frozen: boolean;
    order: number;
    visible: boolean;
    width: number;
    defaultValue?: any;
    validation?: {
        min?: number;
        max?: number;
    };
}
