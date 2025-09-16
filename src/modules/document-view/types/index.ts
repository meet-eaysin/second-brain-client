import type { DatabaseView, DatabaseProperty, DatabaseRecord } from '@/types/document.types.ts';
import type { ReactNode } from 'react';

export type DocumentDialogType = 
    | 'create-record' 
    | 'edit-record' 
    | 'view-record' 
    | 'create-property' 
    | 'edit-property' 
    | 'create-view' 
    | 'edit-view' 
    | 'manage-sorts' 
    | 'manage-filters'
    | 'share-document'
    | 'delete-document';

export interface DocumentViewConfig {
    // Data source configuration
    dataSourceId?: string;
    dataSourceType?: 'database' | 'collection' | 'custom';
    
    // View configuration
    enableViews?: boolean;
    enableSearch?: boolean;
    enableFilters?: boolean;
    enableSorts?: boolean;
    enableGrouping?: boolean;
    
    // Permissions
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canShare?: boolean;
    isFrozen?: boolean;
    
    // Customization
    title?: string;
    icon?: string;
    description?: string;
    
    // Callbacks for data operations
    onDataChange?: () => void;
    onViewChange?: (viewId: string) => void;
}

export interface DocumentViewContextType {
    // Dialog state
    dialogOpen: DocumentDialogType | null;
    setDialogOpen: (dialog: DocumentDialogType | null) => void;
    
    // Current items
    currentRecord: DatabaseRecord | null;
    setCurrentRecord: React.Dispatch<React.SetStateAction<DatabaseRecord | null>>;
    currentProperty: DatabaseProperty | null;
    setCurrentProperty: React.Dispatch<React.SetStateAction<DatabaseProperty | null>>;
    currentView: DatabaseView | null;
    setCurrentView: React.Dispatch<React.SetStateAction<DatabaseView | null>>;
    
    // Selection state
    selectedRecords: string[];
    setSelectedRecords: React.Dispatch<React.SetStateAction<string[]>>;
    
    // Visibility state
    visibleProperties: Record<string, boolean>;
    setVisibleProperties: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    
    // Search and filters
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    filters: Array<{ property: string; operator: string; value: unknown }>;
    setFilters: React.Dispatch<React.SetStateAction<Array<{ property: string; operator: string; value: unknown }>>>;
    sorts: Array<{ property: string; direction: 'asc' | 'desc' }>;
    setSorts: React.Dispatch<React.SetStateAction<Array<{ property: string; direction: 'asc' | 'desc' }>>>;
    
    // Configuration
    config: DocumentViewConfig;
    setConfig: React.Dispatch<React.SetStateAction<DocumentViewConfig>>;
}

export interface DocumentViewProps {
    // Data
    data: DatabaseRecord[];
    properties: DatabaseProperty[];
    views?: DatabaseView[];
    
    // Configuration
    config?: DocumentViewConfig;
    
    // Event handlers
    onRecordSelect?: (record: DatabaseRecord) => void;
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
    onRecordCreate?: (groupValue?: string) => void;
    onRecordUpdate?: (recordId: string, updates: Record<string, unknown>) => void;
    onViewUpdate?: () => void;
    
    // Current state
    currentViewId?: string;
    onViewChange?: (viewId: string) => void;
    
    // Styling
    className?: string;
    children?: ReactNode;
}

export interface DocumentViewTabsProps {
    views: DatabaseView[];
    properties: DatabaseProperty[];
    records: DatabaseRecord[];
    currentViewId?: string;
    onViewChange: (viewId: string) => void;
    onViewUpdate?: () => void;
    config?: DocumentViewConfig;
}

export interface DocumentViewRendererProps {
    view: DatabaseView;
    properties: DatabaseProperty[];
    records: DatabaseRecord[];
    onRecordSelect?: (record: DatabaseRecord) => void;
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
    onRecordCreate?: (groupValue?: string) => void;
    onRecordUpdate?: (recordId: string, updates: Record<string, unknown>) => void;
    dataSourceId?: string;
    config?: DocumentViewConfig;
}

export interface DocumentPrimaryButtonsProps {
    config?: DocumentViewConfig;
    onCreateRecord?: () => void;
    onCreateProperty?: () => void;
    onCreateView?: () => void;
    onShare?: () => void;
    onFreeze?: () => void;
    onUnfreeze?: () => void;
}
