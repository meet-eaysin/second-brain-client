import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Header } from '@/layout/header';
import { Main } from '@/layout/main';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Database as DatabaseIcon, Plus, Grid, List } from 'lucide-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import type { DatabaseQueryParams, Database } from '@/types/database.types';
import {
    DatabaseCard,
    DatabaseDialogs,
    DatabasePrimaryButtons,
    useDatabase,
    useDatabases,
    useDeleteDatabase
} from "@/modules/databases";

export const DatabasesPage: React.FC = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { setCurrentDatabase, setOpen } = useDatabase();
    const [queryParams, setQueryParams] = useState<DatabaseQueryParams>({
        page: 1,
        limit: 12,
    });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: databasesData, isLoading } = useDatabases(queryParams);
    const deleteDatabaseMutation = useDeleteDatabase();

    const handleSearch = (search: string) => {
        setSearchQuery(search);
        setQueryParams(prev => ({
            ...prev,
            page: 1,
        }));
    };

    const handleWorkspaceFilter = (workspaceId: string) => {
        setQueryParams(prev => ({
            ...prev,
            workspaceId: workspaceId === 'all' ? undefined : workspaceId,
            page: 1,
        }));
    };

    const handlePageChange = (page: number) => {
        setQueryParams(prev => ({ ...prev, page }));
    };

    const handleViewDatabase = (database: Database) => {
        setCurrentDatabase(database);
        navigate(`/app/databases/${database.id}`);
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

    const stats = databasesData ? {
        total: databasesData.total,
        owned: databasesData.databases.filter(d => d.ownerId === currentUser?.id).length,
        shared: databasesData.databases.filter(d => d.ownerId !== currentUser?.id).length,
        public: databasesData.databases.filter(d => d.isPublic).length,
    } : null;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
                    </div>
                    <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <Header fixed>
                <Search />
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Databases</h2>
                        <p className="text-muted-foreground">
                            Manage your databases and data collections
                        </p>
                    </div>
                    <DatabasePrimaryButtons />
                </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Databases</CardTitle>
                            <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Owned by You</CardTitle>
                            <Badge variant="default">{stats.owned}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.owned}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Shared with You</CardTitle>
                            <Badge variant="secondary">{stats.shared}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.shared}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Public Databases</CardTitle>
                            <Badge variant="outline">{stats.public}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.public}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters and View Toggle */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                    <CardDescription>Filter and search databases</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1 md:w-80">
                                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search databases..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            <Select onValueChange={handleWorkspaceFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Workspaces" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Workspaces</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="shared">Shared</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Databases Grid/List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {databasesData ? `${databasesData.databases.length} of ${databasesData.total} databases` : 'Loading...'}
                    </h2>
                </div>

                {databasesData?.databases.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <DatabaseIcon className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No databases found</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Get started by creating your first database
                            </p>
                            <Button onClick={handleCreateDatabase}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Database
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className={viewMode === 'grid' 
                        ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
                        : "space-y-4"
                    }>
                        {databasesData?.databases.map((database) => (
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
                )}

                {/* Pagination */}
                {databasesData && databasesData.totalPages > 1 && (
                    <div className="flex items-center justify-between space-x-2 py-4">
                        <div className="text-sm text-muted-foreground">
                            Page {databasesData.currentPage} of {databasesData.totalPages}
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(queryParams.page! - 1)}
                                disabled={queryParams.page === 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(queryParams.page! + 1)}
                                disabled={queryParams.page === databasesData.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            </Main>

            <DatabaseDialogs />
        </>
    );
};
