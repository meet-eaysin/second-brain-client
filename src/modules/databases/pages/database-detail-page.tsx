import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Header } from '@/layout/header';
import { Main } from '@/layout/main';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Lock } from 'lucide-react';
import { DatabaseViewTabs } from '../components/database-view-tabs';
import { DatabaseViewRenderer } from '../components/database-view-renderer';
import { DatabaseDialogs } from '../components/database-dialogs';
import { DatabasePrimaryButtons } from '../components/database-primary-buttons';
import { useDatabase, useRecords, useUpdateRecord } from '../services/databaseQueries';
import { useDatabaseContext } from '../context/database-context';
import type { DatabaseRecord } from '@/types/database.types';

export default function DatabaseDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [currentViewId, setCurrentViewId] = useState<string | undefined>();

    const {
        setCurrentDatabase,
        setCurrentRecord,
        setCurrentView,
        setOpen,
        searchQuery,
        filters,
        sorts,
        setVisibleProperties,
    } = useDatabaseContext();

    // Fetch database data
    const { data: database, isLoading: isDatabaseLoading, refetch: refetchDatabase } = useDatabase(id!);
    const { data: recordsData } = useRecords(id!, {
        search: searchQuery,
        filters: JSON.stringify(filters),
        sorts: JSON.stringify(sorts),
    });
    const updateRecordMutation = useUpdateRecord();

    // Set current database when data loads
    useEffect(() => {
        if (database) {
            setCurrentDatabase(database);
            // Initialize visible properties
            const initialVisibility = database.properties.reduce(
                (acc, prop) => ({ ...acc, [prop.id]: true }),
                {}
            );
            setVisibleProperties(initialVisibility);

            // Set default view if not already set
            if (!currentViewId && database.views?.length > 0) {
                const defaultView = database.views.find(v => v.isDefault) || database.views[0];
                setCurrentViewId(defaultView.id);
            }
        }
    }, [database, setCurrentDatabase, setVisibleProperties, currentViewId]);

    // Update current view in context when view changes
    useEffect(() => {
        if (database?.views && currentViewId) {
            const view = database.views.find(v => v.id === currentViewId);
            if (view) {
                setCurrentView(view);
            }
        }
    }, [database?.views, currentViewId, setCurrentView]);

    const records = recordsData?.data?.records || recordsData?.records || [];

    // Get frozen state from database
    const isFrozen = database?.frozen || false;

    // Get current view
    const currentView = database?.views?.find(v => v.id === currentViewId) ||
                       database?.views?.find(v => v.isDefault) ||
                       database?.views?.[0];

    const handleBack = () => {
        navigate('/app/databases');
    };

    // Handler functions
    const handleRecordSelect = (record: DatabaseRecord) => {
        setCurrentRecord(record);
        setOpen('view-record');
    };

    const handleRecordEdit = (record: DatabaseRecord) => {
        setCurrentRecord(record);
        setOpen('edit-record');
    };

    const handleRecordDelete = (recordId: string) => {
        // Handle record deletion
        console.log('Delete record:', recordId);
    };

    const handleRecordCreate = (groupValue?: string) => {
        // Pre-fill group value if creating from board view
        if (groupValue) {
            // Set initial values based on group
            console.log('Create record with group:', groupValue);
        }
        setOpen('create-record');
    };

    const handleRecordUpdate = async (recordId: string, updates: Record<string, unknown>) => {
        if (!database?.id) return;

        try {
            await updateRecordMutation.mutateAsync({
                databaseId: database.id,
                recordId,
                data: { properties: updates }
            });
        } catch (error) {
            console.error('Failed to update record:', error);
        }
    };

    const handleViewUpdate = () => {
        refetchDatabase();
    };

    if (isDatabaseLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!database) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Database not found</h1>
                <Button onClick={handleBack}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Databases
                </Button>
            </div>
        );
    }

    return (
        <>
            <Header fixed>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-lg font-semibold">{database.name}</h1>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <Search />
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <div className="mb-4 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            {database.icon} {database.name}
                            {isFrozen && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                    <Lock className="h-3 w-3" />
                                    Frozen
                                </span>
                            )}
                        </h2>
                        <p className="text-muted-foreground">
                            {recordsData?.total || 0} records • {database.views?.length || 0} views
                        </p>
                    </div>
                    <DatabasePrimaryButtons />
                </div>

                {/* View Tabs */}
                {database.views && database.views.length > 0 && (
                    <DatabaseViewTabs
                        views={database.views}
                        properties={database.properties}
                        records={records}
                        currentViewId={currentViewId}
                        onViewChange={setCurrentViewId}
                        onViewUpdate={handleViewUpdate}
                    />
                )}

                {/* View Content */}
                <div className="flex-1 overflow-auto py-4">
                    {currentView && (
                        <DatabaseViewRenderer
                            view={currentView}
                            properties={database.properties}
                            records={records}
                            onRecordSelect={handleRecordSelect}
                            onRecordEdit={handleRecordEdit}
                            onRecordDelete={handleRecordDelete}
                            onRecordCreate={handleRecordCreate}
                            onRecordUpdate={handleRecordUpdate}
                            databaseId={id}
                            isFrozen={isFrozen}
                        />
                    )}
                </div>
            </Main>

            <DatabaseDialogs />
        </>
    );
}
