import React, { useState, createContext, useContext } from 'react';
import type { Database, DatabaseRecord, DatabaseProperty, DatabaseView } from '@/types/database.types';
import useDialogState from '@/hooks/use-dialog-state';

type DatabaseDialogType = 'create-database' | 'edit-database' | 'create-property' | 'edit-property' | 'create-record' | 'edit-record' | 'view-record' | 'create-view' | 'edit-view' | 'share-database' | 'delete-database';

interface DatabaseContextType {
    // Dialog state
    open: DatabaseDialogType | null;
    setOpen: (str: DatabaseDialogType | null) => void;
    
    // Current items
    currentDatabase: Database | null;
    setCurrentDatabase: React.Dispatch<React.SetStateAction<Database | null>>;
    currentRecord: DatabaseRecord | null;
    setCurrentRecord: React.Dispatch<React.SetStateAction<DatabaseRecord | null>>;
    currentProperty: DatabaseProperty | null;
    setCurrentProperty: React.Dispatch<React.SetStateAction<DatabaseProperty | null>>;
    currentView: DatabaseView | null;
    setCurrentView: React.Dispatch<React.SetStateAction<DatabaseView | null>>;
    
    // View state
    selectedRecords: Set<string>;
    setSelectedRecords: React.Dispatch<React.SetStateAction<Set<string>>>;
    visibleProperties: Record<string, boolean>;
    setVisibleProperties: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    
    // Search and filters
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    filters: Array<{ property: string; operator: string; value: any }>;
    setFilters: React.Dispatch<React.SetStateAction<Array<{ property: string; operator: string; value: any }>>>;
    sorts: Array<{ property: string; direction: 'asc' | 'desc' }>;
    setSorts: React.Dispatch<React.SetStateAction<Array<{ property: string; direction: 'asc' | 'desc' }>>>;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

export default function DatabaseProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<DatabaseDialogType>(null);
    
    // Current items
    const [currentDatabase, setCurrentDatabase] = useState<Database | null>(null);
    const [currentRecord, setCurrentRecord] = useState<DatabaseRecord | null>(null);
    const [currentProperty, setCurrentProperty] = useState<DatabaseProperty | null>(null);
    const [currentView, setCurrentView] = useState<DatabaseView | null>(null);
    
    // View state
    const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
    const [visibleProperties, setVisibleProperties] = useState<Record<string, boolean>>({});
    
    // Search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Array<{ property: string; operator: string; value: unknown }>>([]);
    const [sorts, setSorts] = useState<Array<{ property: string; direction: 'asc' | 'desc' }>>([]);

    return (
        <DatabaseContext.Provider value={{
            open,
            setOpen,
            currentDatabase,
            setCurrentDatabase,
            currentRecord,
            setCurrentRecord,
            currentProperty,
            setCurrentProperty,
            currentView,
            setCurrentView,
            selectedRecords,
            setSelectedRecords,
            visibleProperties,
            setVisibleProperties,
            searchQuery,
            setSearchQuery,
            filters,
            setFilters,
            sorts,
            setSorts,
        }}>
            {children}
        </DatabaseContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDatabaseContext = () => {
    const databaseContext = useContext(DatabaseContext);

    if (!databaseContext) {
        throw new Error('useDatabaseContext has to be used within <DatabaseProvider>');
    }

    return databaseContext;
};
