import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent } from '@/components/ui/card';
import { Database as DatabaseIcon, Server, Star, Clock } from 'lucide-react';
import { DocumentView } from '@/modules/document-view';
import {
    useDatabasesViewsQuery,
    useDefaultDatabasesViewQuery,
    useDatabasesViewConfigQuery,
    useDatabasesFrozenConfigQuery,
    useDatabasesQuery,
    useUpdateDatabaseMutation,
    useDeleteDatabaseMutation,
} from '../hooks/use-databases-document-view';
import { useDatabases } from '../services/databaseQueries';

export function DatabasesPage() {
    // API Data Queries
    const { data: viewConfig } = useDatabasesViewConfigQuery();
    const { data: apiFrozenConfig } = useDatabasesFrozenConfigQuery();
    const { data: views, isLoading: viewsLoading } = useDatabasesViewsQuery();
    const { data: defaultView } = useDefaultDatabasesViewQuery();
    const { data: databasesResponse, isLoading: databasesLoading } = useDatabasesQuery();

    // Also get the actual databases list for records
    const { data: databasesList, isLoading: databasesListLoading } = useDatabases();

    console.log("** view Config", viewConfig);
    console.log("** apiFrozenConfig", apiFrozenConfig);
    console.log("** views", views);
    console.log("** defaultView", defaultView);
    console.log("** databasesResponse", databasesResponse);
    console.log("** databasesList", databasesList);

    // Extract data from API responses
    const databases = databasesList?.databases || [];
    const apiViews = views || [];
    const defaultProperties = viewConfig?.defaultProperties || [];
    const databaseMetadata = viewConfig?.database;

    // Merge default properties with custom properties from all views
    const allCustomProperties = apiViews?.flatMap(view => (view as any).customProperties || []) || [];
    const apiProperties = [
        ...defaultProperties,
        ...allCustomProperties
    ];

    // Get current user info (this should come from auth context in real app)
    const currentUserId = 'current-user'; // TODO: Get from auth context

    // Use database ID from API or generate dynamic one as fallback
    const databaseId = databaseMetadata?.id || `databases-${currentUserId}-db`;

    // Mutations
    const updateDatabaseMutation = useUpdateDatabaseMutation();
    const deleteDatabaseMutation = useDeleteDatabaseMutation();

    // Event Handlers
    const handleRecordEdit = (record: any) => {
        console.log('Edit database:', record);
        // TODO: Implement database editing
    };

    const handleRecordDelete = (recordId: string) => {
        deleteDatabaseMutation.mutate(recordId);
    };

    const handleRecordUpdate = (recordId: string, updates: Record<string, any>) => {
        // For now, pass updates directly to the mutation
        // The API service will handle custom properties separation
        updateDatabaseMutation.mutate({
            databaseId: recordId,
            updates
        });
    };

    // Transform databases data to database records format
    const databaseRecords = databases.map((database: any) => ({
        id: database.id,
        databaseId: databaseId,
        createdAt: database.createdAt || new Date().toISOString(),
        updatedAt: database.updatedAt || new Date().toISOString(),
        createdBy: database.createdBy || currentUserId,
        properties: {
            name: database.name,
            description: database.description,
            icon: database.icon,
            cover: database.cover,
            isPublic: database.isPublic,
            isFavorite: database.isFavorite,
            categoryId: database.categoryId,
            tags: database.tags || [],
            frozen: database.frozen,
            createdAt: database.createdAt,
            updatedAt: database.updatedAt,
            // Include any custom properties from database.customProperties
            ...(database.customProperties || {})
        }
    }));

    // Create database structure using API data with dynamic values
    const databasesDatabase = {
        id: databaseId,
        name: databaseMetadata?.displayNamePlural || 'Databases',
        icon: databaseMetadata?.icon || '🗄️',
        description: databaseMetadata?.description || 'Manage your databases and data collections',
        properties: apiProperties || [],
        views: Array.isArray(apiViews) ? apiViews : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        frozen: false,
        ownerId: currentUserId,
        isPublic: false,
        permissions: [],
        config: {
            moduleType: databaseMetadata?.entityKey || 'databases'
        }
    };

    // Loading state
    if (databasesLoading || viewsLoading || databasesListLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            <EnhancedHeader />

            <Main className="space-y-8">
                {/* Clean Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Databases</h1>
                        <p className="text-muted-foreground">
                            Manage your databases and data collections
                        </p>
                    </div>
                    {/* DocumentView component handles record creation via "New Record" row */}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Total Databases</p>
                                    <p className="text-2xl font-bold text-foreground">{databases.length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <DatabaseIcon className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Public</p>
                                    <p className="text-2xl font-bold text-foreground">{databases.filter((d: any) => d.isPublic).length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Server className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                                    <p className="text-2xl font-bold text-foreground">{databases.filter((d: any) => d.isFavorite).length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Star className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Recent</p>
                                    <p className="text-2xl font-bold text-foreground">{databases.filter((d: any) => {
                                        const updatedAt = new Date(d.updatedAt);
                                        const weekAgo = new Date();
                                        weekAgo.setDate(weekAgo.getDate() - 7);
                                        return updatedAt > weekAgo;
                                    }).length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Databases Document View */}
                <DocumentView
                    database={databasesDatabase}
                    records={databaseRecords}
                    moduleType="databases"
                    config={{
                        title: databaseMetadata?.displayNamePlural || 'Databases',
                        icon: databaseMetadata?.icon || '🗄️',
                        description: databaseMetadata?.description || 'Manage your databases and data collections',
                        canCreate: true,
                        canEdit: true,
                        canDelete: true,
                        canShare: true,
                        enableViews: true,
                        enableSearch: true,
                        enableFilters: true,
                        enableSorts: true,
                        disablePropertyManagement: false,
                        isFrozen: false,
                        defaultViewId: defaultView?.id,
                        apiFrozenConfig: apiFrozenConfig,
                    }}
                    onRecordEdit={handleRecordEdit}
                    onRecordDelete={handleRecordDelete}
                    onRecordUpdate={handleRecordUpdate}
                />
            </Main>
        </>
    );
}
export default DatabasesPage;