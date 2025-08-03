import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { 
    DatabaseRecord, 
    DatabaseProperty, 
    DatabaseView, 
    DatabaseFilter, 
    DatabaseSort 
} from '@/types/database.types';

// Database state interface
export interface DatabaseState {
    // Core data
    records: DatabaseRecord[];
    properties: DatabaseProperty[];
    views: DatabaseView[];
    
    // Current state
    currentViewId: string | null;
    selectedRecords: string[];
    searchQuery: string;
    
    // UI state
    isLoading: boolean;
    error: string | null;
    
    // Database metadata
    databaseId?: string;
    databaseName: string;
    databaseIcon: string;
    databaseDescription?: string;
    isFrozen: boolean;
    isShared: boolean;
    permissions: {
        canEdit: boolean;
        canDelete: boolean;
        canShare: boolean;
        canManageViews: boolean;
        canManageProperties: boolean;
    };
    
    // View state
    currentFilters: DatabaseFilter[];
    currentSorts: DatabaseSort[];
    groupBy?: string;
    
    // Pagination
    currentPage: number;
    pageSize: number;
    totalRecords: number;
}

// Database actions interface
export interface DatabaseActions {
    // Record management
    addRecord: (record: Partial<DatabaseRecord>) => void;
    updateRecord: (recordId: string, updates: Partial<DatabaseRecord>) => void;
    deleteRecord: (recordId: string) => void;
    deleteRecords: (recordIds: string[]) => void;
    duplicateRecord: (recordId: string) => void;
    
    // Property management
    addProperty: (property: Omit<DatabaseProperty, 'id'>) => void;
    updateProperty: (propertyId: string, updates: Partial<DatabaseProperty>) => void;
    deleteProperty: (propertyId: string) => void;
    reorderProperties: (propertyIds: string[]) => void;
    togglePropertyVisibility: (propertyId: string, isVisible: boolean) => void;
    
    // View management
    addView: (view: Omit<DatabaseView, 'id'>) => void;
    updateView: (viewId: string, updates: Partial<DatabaseView>) => void;
    deleteView: (viewId: string) => void;
    setCurrentView: (viewId: string) => void;
    duplicateView: (viewId: string) => void;
    
    // Selection management
    selectRecord: (recordId: string) => void;
    selectRecords: (recordIds: string[]) => void;
    selectAllRecords: () => void;
    clearSelection: () => void;
    toggleRecordSelection: (recordId: string) => void;
    
    // Search and filters
    setSearchQuery: (query: string) => void;
    setFilters: (filters: DatabaseFilter[]) => void;
    addFilter: (filter: DatabaseFilter) => void;
    removeFilter: (index: number) => void;
    clearFilters: () => void;
    
    // Sorting
    setSorts: (sorts: DatabaseSort[]) => void;
    addSort: (sort: DatabaseSort) => void;
    removeSort: (propertyId: string) => void;
    clearSorts: () => void;
    
    // Grouping
    setGroupBy: (propertyId: string | undefined) => void;
    
    // Pagination
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    
    // Database operations
    freezeDatabase: () => void;
    unfreezeDatabase: () => void;
    shareDatabase: (permissions: any) => void;
    exportDatabase: (format: 'csv' | 'json' | 'excel') => void;
    importDatabase: (data: any, format: 'csv' | 'json' | 'excel') => void;
    
    // UI state
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

// Combined context type
export type DatabaseContextType = DatabaseState & DatabaseActions;

// Create context
const DatabaseContext = createContext<DatabaseContextType | null>(null);

// Default state
const defaultState: DatabaseState = {
    records: [],
    properties: [],
    views: [],
    currentViewId: null,
    selectedRecords: [],
    searchQuery: '',
    isLoading: false,
    error: null,
    databaseName: 'Untitled Database',
    databaseIcon: '🗄️',
    isFrozen: false,
    isShared: false,
    permissions: {
        canEdit: true,
        canDelete: true,
        canShare: true,
        canManageViews: true,
        canManageProperties: true,
    },
    currentFilters: [],
    currentSorts: [],
    currentPage: 1,
    pageSize: 50,
    totalRecords: 0,
};

// Provider props
interface DatabaseProviderProps {
    children: ReactNode;
    initialState?: Partial<DatabaseState>;
    onStateChange?: (state: DatabaseState) => void;
}

// Provider component
export function DatabaseProvider({ 
    children, 
    initialState = {},
    onStateChange 
}: DatabaseProviderProps) {
    const [state, setState] = useState<DatabaseState>({
        ...defaultState,
        ...initialState,
    });

    // Helper to update state
    const updateState = useCallback((updates: Partial<DatabaseState>) => {
        setState(prev => {
            const newState = { ...prev, ...updates };
            if (onStateChange) {
                onStateChange(newState);
            }
            return newState;
        });
    }, [onStateChange]);

    // Generate unique ID
    const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Record management actions
    const addRecord = useCallback((record: Partial<DatabaseRecord>) => {
        const newRecord: DatabaseRecord = {
            id: generateId(),
            properties: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...record,
        };
        
        updateState({
            records: [...state.records, newRecord],
            totalRecords: state.totalRecords + 1,
        });
    }, [state.records, state.totalRecords, updateState]);

    const updateRecord = useCallback((recordId: string, updates: Partial<DatabaseRecord>) => {
        updateState({
            records: state.records.map(record =>
                record.id === recordId
                    ? { ...record, ...updates, updatedAt: new Date().toISOString() }
                    : record
            ),
        });
    }, [state.records, updateState]);

    const deleteRecord = useCallback((recordId: string) => {
        updateState({
            records: state.records.filter(record => record.id !== recordId),
            selectedRecords: state.selectedRecords.filter(id => id !== recordId),
            totalRecords: state.totalRecords - 1,
        });
    }, [state.records, state.selectedRecords, state.totalRecords, updateState]);

    const deleteRecords = useCallback((recordIds: string[]) => {
        updateState({
            records: state.records.filter(record => !recordIds.includes(record.id)),
            selectedRecords: state.selectedRecords.filter(id => !recordIds.includes(id)),
            totalRecords: state.totalRecords - recordIds.length,
        });
    }, [state.records, state.selectedRecords, state.totalRecords, updateState]);

    const duplicateRecord = useCallback((recordId: string) => {
        const originalRecord = state.records.find(record => record.id === recordId);
        if (originalRecord) {
            const duplicatedRecord: DatabaseRecord = {
                ...originalRecord,
                id: generateId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            
            updateState({
                records: [...state.records, duplicatedRecord],
                totalRecords: state.totalRecords + 1,
            });
        }
    }, [state.records, state.totalRecords, updateState]);

    // Property management actions
    const addProperty = useCallback((property: Omit<DatabaseProperty, 'id'>) => {
        const newProperty: DatabaseProperty = {
            ...property,
            id: generateId(),
            order: state.properties.length,
        };
        
        updateState({
            properties: [...state.properties, newProperty],
        });
    }, [state.properties, updateState]);

    const updateProperty = useCallback((propertyId: string, updates: Partial<DatabaseProperty>) => {
        updateState({
            properties: state.properties.map(property =>
                property.id === propertyId ? { ...property, ...updates } : property
            ),
        });
    }, [state.properties, updateState]);

    const deleteProperty = useCallback((propertyId: string) => {
        updateState({
            properties: state.properties.filter(property => property.id !== propertyId),
            // Also remove property data from all records
            records: state.records.map(record => ({
                ...record,
                properties: Object.fromEntries(
                    Object.entries(record.properties).filter(([key]) => key !== propertyId)
                ),
            })),
        });
    }, [state.properties, state.records, updateState]);

    const reorderProperties = useCallback((propertyIds: string[]) => {
        const reorderedProperties = propertyIds.map((id, index) => {
            const property = state.properties.find(p => p.id === id);
            return property ? { ...property, order: index } : null;
        }).filter(Boolean) as DatabaseProperty[];
        
        updateState({
            properties: reorderedProperties,
        });
    }, [state.properties, updateState]);

    const togglePropertyVisibility = useCallback((propertyId: string, isVisible: boolean) => {
        updateProperty(propertyId, { isVisible });
    }, [updateProperty]);

    // View management actions
    const addView = useCallback((view: Omit<DatabaseView, 'id'>) => {
        const newView: DatabaseView = {
            ...view,
            id: generateId(),
        };
        
        updateState({
            views: [...state.views, newView],
        });
    }, [state.views, updateState]);

    const updateView = useCallback((viewId: string, updates: Partial<DatabaseView>) => {
        updateState({
            views: state.views.map(view =>
                view.id === viewId ? { ...view, ...updates } : view
            ),
        });
    }, [state.views, updateState]);

    const deleteView = useCallback((viewId: string) => {
        const newViews = state.views.filter(view => view.id !== viewId);
        const newCurrentViewId = state.currentViewId === viewId 
            ? (newViews[0]?.id || null) 
            : state.currentViewId;
        
        updateState({
            views: newViews,
            currentViewId: newCurrentViewId,
        });
    }, [state.views, state.currentViewId, updateState]);

    const setCurrentView = useCallback((viewId: string) => {
        const view = state.views.find(v => v.id === viewId);
        if (view) {
            updateState({
                currentViewId: viewId,
                currentFilters: view.filters || [],
                currentSorts: view.sorts || [],
            });
        }
    }, [state.views, updateState]);

    const duplicateView = useCallback((viewId: string) => {
        const originalView = state.views.find(view => view.id === viewId);
        if (originalView) {
            const duplicatedView: DatabaseView = {
                ...originalView,
                id: generateId(),
                name: `${originalView.name} (Copy)`,
                isDefault: false,
            };
            
            updateState({
                views: [...state.views, duplicatedView],
            });
        }
    }, [state.views, updateState]);

    // Selection management
    const selectRecord = useCallback((recordId: string) => {
        updateState({
            selectedRecords: [recordId],
        });
    }, [updateState]);

    const selectRecords = useCallback((recordIds: string[]) => {
        updateState({
            selectedRecords: recordIds,
        });
    }, [updateState]);

    const selectAllRecords = useCallback(() => {
        updateState({
            selectedRecords: state.records.map(record => record.id),
        });
    }, [state.records, updateState]);

    const clearSelection = useCallback(() => {
        updateState({
            selectedRecords: [],
        });
    }, [updateState]);

    const toggleRecordSelection = useCallback((recordId: string) => {
        const isSelected = state.selectedRecords.includes(recordId);
        updateState({
            selectedRecords: isSelected
                ? state.selectedRecords.filter(id => id !== recordId)
                : [...state.selectedRecords, recordId],
        });
    }, [state.selectedRecords, updateState]);

    // Search and filters
    const setSearchQuery = useCallback((query: string) => {
        updateState({ searchQuery: query });
    }, [updateState]);

    const setFilters = useCallback((filters: DatabaseFilter[]) => {
        updateState({ currentFilters: filters });
    }, [updateState]);

    const addFilter = useCallback((filter: DatabaseFilter) => {
        updateState({
            currentFilters: [...state.currentFilters, filter],
        });
    }, [state.currentFilters, updateState]);

    const removeFilter = useCallback((index: number) => {
        updateState({
            currentFilters: state.currentFilters.filter((_, i) => i !== index),
        });
    }, [state.currentFilters, updateState]);

    const clearFilters = useCallback(() => {
        updateState({ currentFilters: [] });
    }, [updateState]);

    // Sorting
    const setSorts = useCallback((sorts: DatabaseSort[]) => {
        updateState({ currentSorts: sorts });
    }, [updateState]);

    const addSort = useCallback((sort: DatabaseSort) => {
        // Remove existing sort for the same property
        const filteredSorts = state.currentSorts.filter(s => s.propertyId !== sort.propertyId);
        updateState({
            currentSorts: [...filteredSorts, sort],
        });
    }, [state.currentSorts, updateState]);

    const removeSort = useCallback((propertyId: string) => {
        updateState({
            currentSorts: state.currentSorts.filter(sort => sort.propertyId !== propertyId),
        });
    }, [state.currentSorts, updateState]);

    const clearSorts = useCallback(() => {
        updateState({ currentSorts: [] });
    }, [updateState]);

    // Grouping
    const setGroupBy = useCallback((propertyId: string | undefined) => {
        updateState({ groupBy: propertyId });
    }, [updateState]);

    // Pagination
    const setCurrentPage = useCallback((page: number) => {
        updateState({ currentPage: page });
    }, [updateState]);

    const setPageSize = useCallback((size: number) => {
        updateState({ 
            pageSize: size,
            currentPage: 1, // Reset to first page when changing page size
        });
    }, [updateState]);

    // Database operations
    const freezeDatabase = useCallback(() => {
        updateState({ isFrozen: true });
    }, [updateState]);

    const unfreezeDatabase = useCallback(() => {
        updateState({ isFrozen: false });
    }, [updateState]);

    const shareDatabase = useCallback((permissions: any) => {
        updateState({ 
            isShared: true,
            permissions: { ...state.permissions, ...permissions },
        });
    }, [state.permissions, updateState]);

    const exportDatabase = useCallback((format: 'csv' | 'json' | 'excel') => {
        // Implementation for export
        console.log('Exporting database in format:', format);
    }, []);

    const importDatabase = useCallback((data: any, format: 'csv' | 'json' | 'excel') => {
        // Implementation for import
        console.log('Importing database from format:', format, data);
    }, []);

    // UI state
    const setLoading = useCallback((loading: boolean) => {
        updateState({ isLoading: loading });
    }, [updateState]);

    const setError = useCallback((error: string | null) => {
        updateState({ error });
    }, [updateState]);

    // Context value
    const contextValue: DatabaseContextType = {
        // State
        ...state,
        
        // Actions
        addRecord,
        updateRecord,
        deleteRecord,
        deleteRecords,
        duplicateRecord,
        addProperty,
        updateProperty,
        deleteProperty,
        reorderProperties,
        togglePropertyVisibility,
        addView,
        updateView,
        deleteView,
        setCurrentView,
        duplicateView,
        selectRecord,
        selectRecords,
        selectAllRecords,
        clearSelection,
        toggleRecordSelection,
        setSearchQuery,
        setFilters,
        addFilter,
        removeFilter,
        clearFilters,
        setSorts,
        addSort,
        removeSort,
        clearSorts,
        setGroupBy,
        setCurrentPage,
        setPageSize,
        freezeDatabase,
        unfreezeDatabase,
        shareDatabase,
        exportDatabase,
        importDatabase,
        setLoading,
        setError,
    };

    return (
        <DatabaseContext.Provider value={contextValue}>
            {children}
        </DatabaseContext.Provider>
    );
}

// Hook to use database context
export function useDatabaseManagement() {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error('useDatabaseManagement must be used within a DatabaseProvider');
    }
    return context;
}

// Hook to use database state only
export function useDatabaseState() {
    const context = useDatabaseManagement();
    const {
        // Extract only state properties
        records,
        properties,
        views,
        currentViewId,
        selectedRecords,
        searchQuery,
        isLoading,
        error,
        databaseId,
        databaseName,
        databaseIcon,
        databaseDescription,
        isFrozen,
        isShared,
        permissions,
        currentFilters,
        currentSorts,
        groupBy,
        currentPage,
        pageSize,
        totalRecords,
    } = context;

    return {
        records,
        properties,
        views,
        currentViewId,
        selectedRecords,
        searchQuery,
        isLoading,
        error,
        databaseId,
        databaseName,
        databaseIcon,
        databaseDescription,
        isFrozen,
        isShared,
        permissions,
        currentFilters,
        currentSorts,
        groupBy,
        currentPage,
        pageSize,
        totalRecords,
    };
}

// Hook to use database actions only
export function useDatabaseActions() {
    const context = useDatabaseManagement();
    const {
        // Extract only action properties
        addRecord,
        updateRecord,
        deleteRecord,
        deleteRecords,
        duplicateRecord,
        addProperty,
        updateProperty,
        deleteProperty,
        reorderProperties,
        togglePropertyVisibility,
        addView,
        updateView,
        deleteView,
        setCurrentView,
        duplicateView,
        selectRecord,
        selectRecords,
        selectAllRecords,
        clearSelection,
        toggleRecordSelection,
        setSearchQuery,
        setFilters,
        addFilter,
        removeFilter,
        clearFilters,
        setSorts,
        addSort,
        removeSort,
        clearSorts,
        setGroupBy,
        setCurrentPage,
        setPageSize,
        freezeDatabase,
        unfreezeDatabase,
        shareDatabase,
        exportDatabase,
        importDatabase,
        setLoading,
        setError,
    } = context;

    return {
        addRecord,
        updateRecord,
        deleteRecord,
        deleteRecords,
        duplicateRecord,
        addProperty,
        updateProperty,
        deleteProperty,
        reorderProperties,
        togglePropertyVisibility,
        addView,
        updateView,
        deleteView,
        setCurrentView,
        duplicateView,
        selectRecord,
        selectRecords,
        selectAllRecords,
        clearSelection,
        toggleRecordSelection,
        setSearchQuery,
        setFilters,
        addFilter,
        removeFilter,
        clearFilters,
        setSorts,
        addSort,
        removeSort,
        clearSorts,
        setGroupBy,
        setCurrentPage,
        setPageSize,
        freezeDatabase,
        unfreezeDatabase,
        shareDatabase,
        exportDatabase,
        importDatabase,
        setLoading,
        setError,
    };
}
