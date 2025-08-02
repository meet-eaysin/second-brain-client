import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { DevelopmentNotice } from '@/components/development-notice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Database as DatabaseIcon,
    Plus,
    Search,
    Grid,
    List,
    ArrowUpDown,
    Clock,
} from 'lucide-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { DatabaseQueryParams, Database } from '@/types/database.types';
import { PageErrorBoundary } from '@/components/error-boundary';

import {
    DatabaseCard,
    DatabaseDialogs,
    DatabaseProvider,
    useDatabaseContext,
    useDatabases,
    useDeleteDatabase
} from "@/modules/databases";
import { getDatabasesTableColumns } from '../components/databases-table-columns';
import { DatabasesDataTable } from '../components/databases-data-table';

const DatabasesPageComponent: React.FC = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { setCurrentDatabase, setDialogOpen: setOpen } = useDatabaseContext();

    // Simplified state management
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'shared' | 'public'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [sortBy, setSortBy] = useState<'updatedAt' | 'name' | 'createdAt'>('updatedAt');
    const [isSearching, setIsSearching] = useState(false);

    // Build query parameters
    const [queryParams, setQueryParams] = useState<DatabaseQueryParams>({
        page: 1,
        limit: 12,
        sortBy: 'updatedAt',
        sortOrder: 'desc',
    });

    // Debounced search and filter updates
    useEffect(() => {
        setIsSearching(true);
        
        const timer = setTimeout(() => {
            const newParams: DatabaseQueryParams = {
                page: 1,
                limit: 12,
                sortBy,
                sortOrder: 'desc',
            };

            if (searchQuery.trim()) {
                newParams.search = searchQuery.trim();
            }

            // Tab-based filtering
            switch (activeTab) {
                case 'mine':
                    newParams.ownerId = currentUser?.id;
                    break;
                case 'shared':
                    newParams.excludeOwnerId = currentUser?.id;
                    newParams.isPublic = false;
                    break;
                case 'public':
                    newParams.isPublic = true;
                    break;
            }

            setQueryParams(newParams);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, activeTab, sortBy, currentUser?.id]);

    const { data: databasesData, isLoading, error } = useDatabases(queryParams);
    const deleteDatabaseMutation = useDeleteDatabase();

    // Event handlers
    const handleViewDatabase = (database: Database) => {
        console.log('handleViewDatabase called with:', database);

        // API response has id field, so use it directly
        const databaseId = database?.id;

        console.log('Database ID check:', {
            id: database?.id,
            hasId: !!database?.id,
            databaseObject: database
        });

        if (!databaseId) {
            console.error('Database ID is missing:', database);
            console.error('Full database object:', JSON.stringify(database, null, 2));
            alert('Cannot view database: Missing database ID. Please check the console for details.');
            return;
        }

        console.log('Navigating to:', `/app/databases/${databaseId}`);
        setCurrentDatabase(database);
        navigate(`/app/databases/${databaseId}`);
    };

    const handleEditDatabase = (database: Database) => {
        setCurrentDatabase(database);
        setOpen('edit-database');
    };

    const handleShareDatabase = (database: Database) => {
        setCurrentDatabase(database);
        setOpen('share-database');
    };

    const handleDeleteDatabase = (databaseId: string) => {
        if (confirm('Are you sure you want to delete this database? This action cannot be undone.')) {
            deleteDatabaseMutation.mutate(databaseId);
        }
    };

    const handleCreateDatabase = () => {
        setOpen('create-database');
    };

    // Computed values
    const databases = useMemo(() => databasesData?.databases || [], [databasesData?.databases]);
    const totalCount = databasesData?.total || 0;
    const isLoadingState = isLoading || isSearching;

    // Tab counts for better UX
    const tabCounts = useMemo(() => {
        if (!databases.length) return { all: 0, mine: 0, shared: 0, public: 0 };
        
        return {
            all: totalCount,
            mine: databases.filter(d => d.ownerId === currentUser?.id).length,
            shared: databases.filter(d => d.ownerId !== currentUser?.id && !d.isPublic).length,
            public: databases.filter(d => d.isPublic).length,
        };
    }, [databases, totalCount, currentUser?.id]);

    // Error state
    if (error) {
        return (
            <div>
                <EnhancedHeader showDatabaseActions={true} />
                <Main className="flex items-center justify-center min-h-[60vh]">
                    <Card className="w-full max-w-md">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <DatabaseIcon className="h-12 w-12 text-destructive mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Connection Issue</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Unable to connect to the server. Please try again.
                            </p>
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                Retry
                            </Button>
                        </CardContent>
                    </Card>
                </Main>
            </div>
        );
    }

    // Loading state
    if (isLoadingState && !databases.length) {
        return (
            <div>
                <EnhancedHeader showDatabaseActions={true} />
                <Main className="space-y-8">
                    <DevelopmentNotice show={!!error} />
                    
                    {/* Header skeleton */}
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-96" />
                    </div>

                    {/* Tabs skeleton */}
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full max-w-md" />
                        <div className="flex gap-4">
                            <Skeleton className="h-10 w-64" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>

                    {/* Content skeleton */}
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <Skeleton className="h-6 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-full mb-4" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </Main>
            </div>
        );
    }

    return (
        <>
            <EnhancedHeader showDatabaseActions={true} />
            
            <Main className="space-y-8">
                <DevelopmentNotice show={!!error} />

                {/* Clean Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Databases</h1>
                    <p className="text-muted-foreground">
                        Manage your databases and data collections
                    </p>
                </div>

                {/* Simplified Navigation Tabs */}
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'mine' | 'shared' | 'public')} className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <TabsList className="grid w-full max-w-md grid-cols-4">
                            <TabsTrigger value="all" className="text-xs">
                                All {tabCounts.all > 0 && `(${tabCounts.all})`}
                            </TabsTrigger>
                            <TabsTrigger value="mine" className="text-xs">
                                Mine {tabCounts.mine > 0 && `(${tabCounts.mine})`}
                            </TabsTrigger>
                            <TabsTrigger value="shared" className="text-xs">
                                Shared {tabCounts.shared > 0 && `(${tabCounts.shared})`}
                            </TabsTrigger>
                            <TabsTrigger value="public" className="text-xs">
                                Public {tabCounts.public > 0 && `(${tabCounts.public})`}
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search databases..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 w-64"
                                />
                            </div>

                            {/* Sort */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <ArrowUpDown className="h-4 w-4 mr-2" />
                                        Sort
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setSortBy('updatedAt')}>
                                        <Clock className="h-4 w-4 mr-2" />
                                        Recently Updated
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy('name')}>
                                        <DatabaseIcon className="h-4 w-4 mr-2" />
                                        Name
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy('createdAt')}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Date Created
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* View Toggle */}
                            <div className="flex items-center border rounded-lg overflow-hidden">
                                <Button
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="rounded-none h-8 px-3 border-0"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="rounded-none h-8 px-3 border-0"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tab Content - Clean and Focused */}
                    <TabsContent value={activeTab} className="space-y-6">
                        {databases.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-16">
                                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <DatabaseIcon className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">
                                        {searchQuery ? 'No databases found' : 
                                         activeTab === 'mine' ? 'No databases created yet' :
                                         activeTab === 'shared' ? 'No shared databases' :
                                         activeTab === 'public' ? 'No public databases' : 
                                         'No databases yet'}
                                    </h3>
                                    <p className="text-muted-foreground text-center max-w-md mb-6">
                                        {searchQuery ? 'Try adjusting your search terms.' :
                                         activeTab === 'mine' ? 'Create your first database to get started.' :
                                         activeTab === 'shared' ? 'Databases shared with you will appear here.' :
                                         activeTab === 'public' ? 'Public databases from the community will appear here.' :
                                         'Create your first database to get started.'}
                                    </p>
                                    {(!searchQuery && (activeTab === 'all' || activeTab === 'mine')) && (
                                        <Button onClick={handleCreateDatabase} size="lg">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Database
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Results Summary */}
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        {databases.length} database{databases.length !== 1 ? 's' : ''} found
                                        {searchQuery && ` for "${searchQuery}"`}
                                    </p>
                                    {isLoadingState && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                                            Searching...
                                        </div>
                                    )}
                                </div>

                                {/* Database Grid/List */}
                                {viewMode === 'grid' ? (
                                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                        {databases.map((database) => (
                                            <DatabaseCard
                                                key={database.id}
                                                database={database}
                                                onView={handleViewDatabase}
                                                onEdit={handleEditDatabase}
                                                onShare={handleShareDatabase}
                                                onDelete={handleDeleteDatabase}
                                                currentUserId={currentUser?.id}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <DatabasesDataTable
                                        columns={getDatabasesTableColumns({
                                            onView: handleViewDatabase,
                                            onEdit: handleEditDatabase,
                                            onShare: handleShareDatabase,
                                            onDelete: handleDeleteDatabase,
                                            currentUserId: currentUser?.id,
                                        })}
                                        data={databases}
                                        searchQuery={searchQuery}
                                        onSearchChange={setSearchQuery}
                                        filterOwner="all"
                                        onFilterOwnerChange={() => {}}
                                        filterPublic="all"
                                        onFilterPublicChange={() => {}}
                                        sortBy={sortBy}
                                        onSortByChange={setSortBy}
                                        sortOrder="desc"
                                        onSortOrderChange={() => {}}
                                        onCreateDatabase={handleCreateDatabase}
                                        onRowClick={handleViewDatabase}
                                    />
                                )}
                            </>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Floating Action Button for Mobile */}
                <div className="fixed bottom-6 right-6 sm:hidden">
                    <Button
                        onClick={handleCreateDatabase}
                        size="lg"
                        className="h-14 w-14 rounded-full shadow-lg"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
            </Main>

            <DatabaseDialogs />
        </>
    );
};

export const DatabasesPage: React.FC = () => (
    <PageErrorBoundary>
        <DatabaseProvider>
            <DatabasesPageComponent />
        </DatabaseProvider>
    </PageErrorBoundary>
);

export default DatabasesPage;