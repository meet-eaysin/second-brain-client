import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { DevelopmentNotice } from '@/components/development-notice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Search as SearchIcon,
    Database as DatabaseIcon,
    Plus,
    Grid,
    List,
    SortAsc,
    SortDesc,
    Filter,
    MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import type { DatabaseQueryParams, Database } from '@/types/database.types';
import { PageErrorBoundary } from '@/components/error-boundary';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    DatabaseCard,
    DatabaseDialogs,
    DatabaseProvider,
    useDatabase,
    useDatabases,
    useDeleteDatabase
} from "@/modules/databases";

const DatabasesPageComponent: React.FC = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { setCurrentDatabase, setOpen } = useDatabase();

    // State for filters and sorting
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOwner, setFilterOwner] = useState<'all' | 'mine' | 'shared'>('all');
    const [filterPublic, setFilterPublic] = useState<'all' | 'public' | 'private'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated'>('updated');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Build query parameters based on current filters
    const [queryParams, setQueryParams] = useState<DatabaseQueryParams>({
        page: 1,
        limit: 12,
    });

    // Update query params when filters change
    useEffect(() => {
        const newParams: DatabaseQueryParams = {
            page: 1,
            limit: 12,
        };

        // Add search query
        if (searchQuery.trim()) {
            newParams.search = searchQuery.trim();
        }

        // Add owner filter
        if (filterOwner === 'mine') {
            newParams.ownerId = currentUser?.id;
        } else if (filterOwner === 'shared') {
            newParams.excludeOwnerId = currentUser?.id;
        }

        // Add public filter
        if (filterPublic === 'public') {
            newParams.isPublic = true;
        } else if (filterPublic === 'private') {
            newParams.isPublic = false;
        }

        // Add sorting
        newParams.sortBy = sortBy;
        newParams.sortOrder = sortOrder;

        setQueryParams(newParams);
    }, [searchQuery, filterOwner, filterPublic, sortBy, sortOrder, currentUser?.id]);

    const { data: databasesData, isLoading, error } = useDatabases(queryParams);
    const deleteDatabaseMutation = useDeleteDatabase();

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

    // Filter databases based on current filters (client-side filtering as backup)
    const filteredDatabases = useMemo(() => {
        if (!databasesData?.databases) return [];

        return databasesData.databases.filter(database => {
            // Search filter
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchesSearch = database.name.toLowerCase().includes(query) ||
                  database.description?.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Owner filter
            if (filterOwner === 'mine' && database.ownerId !== currentUser?.id) return false;
            if (filterOwner === 'shared' && database.ownerId === currentUser?.id) return false;

            // Public filter
            if (filterPublic === 'public' && !database.isPublic) return false;
            if (filterPublic === 'private' && database.isPublic) return false;

            return true;
        });
    }, [databasesData?.databases, searchQuery, filterOwner, filterPublic, currentUser?.id]);

    const stats = {
        total: databasesData?.total || 0,
        owned: databasesData?.databases?.filter(d => d.ownerId === currentUser?.id)?.length || 0,
        shared: databasesData?.databases?.filter(d => d.ownerId !== currentUser?.id)?.length || 0,
        public: databasesData?.databases?.filter(d => d.isPublic)?.length || 0,
    };

    if (error) {
        console.error('Database loading error:', error);
        return (
          <div className="flex items-center justify-center min-h-[400px]">
              <Card className="w-full max-w-md">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                      <DatabaseIcon className="h-12 w-12 text-destructive mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Connection Issue</h3>
                      <p className="text-muted-foreground text-center mb-4">
                          Unable to connect to the server. Using demo data for now.
                      </p>
                      <div className="text-xs text-muted-foreground text-center">
                          <p>Make sure the backend server is running at:</p>
                          <code className="bg-muted px-2 py-1 rounded mt-1 inline-block">
                              {import.meta.env.VITE_API_BASE_URL}
                          </code>
                      </div>
                  </CardContent>
              </Card>
          </div>
        );
    }

    if (isLoading) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading databases...</p>
              </div>
          </div>
        );
    }

    return (
      <>
          <EnhancedHeader showDatabaseActions={true} />

          <Main className="space-y-6">
              {/* Development Notice */}
              <DevelopmentNotice show={!!error} />

              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                      <h1 className="text-3xl font-bold tracking-tight">Databases</h1>
                      <p className="text-muted-foreground">
                          Manage your databases and data collections
                      </p>
                  </div>
              </div>

              {/* Stats Overview - Compact and clean */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total</CardTitle>
                          <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{stats.total}</div>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Owned</CardTitle>
                          <Badge variant="default" className="h-5 px-2 text-xs">
                              {stats.owned}
                          </Badge>
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{stats.owned}</div>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Shared</CardTitle>
                          <Badge variant="secondary" className="h-5 px-2 text-xs">
                              {stats.shared}
                          </Badge>
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{stats.shared}</div>
                      </CardContent>
                  </Card>
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Public</CardTitle>
                          <Badge variant="outline" className="h-5 px-2 text-xs">
                              {stats.public}
                          </Badge>
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{stats.public}</div>
                      </CardContent>
                  </Card>
              </div>

              {/* Search and Filters */}
              <Card className={'gap-3'}>
                  <CardHeader className="pb-1">
                      <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <CardTitle className="text-base">Search & Filter</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {/* Search Bar */}
                      <div className="relative">
                          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search databases by name or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                      </div>

                      {/*<Separator />*/}

                      {/* Filter Controls */}
                      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                          <div className="flex flex-wrap gap-3">
                              {/* Owner Filter */}
                              <div className="flex flex-col gap-1">
                                  <label className="text-xs font-medium text-muted-foreground">
                                      Ownership
                                  </label>
                                  <Select value={filterOwner} onValueChange={(value: 'all' | 'mine' | 'shared') => setFilterOwner(value)}>
                                      <SelectTrigger className="w-[120px] h-9">
                                          <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="all">All</SelectItem>
                                          <SelectItem value="mine">Mine</SelectItem>
                                          <SelectItem value="shared">Shared</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>

                              {/* Public Filter */}
                              <div className="flex flex-col gap-1">
                                  <label className="text-xs font-medium text-muted-foreground">
                                      Visibility
                                  </label>
                                  <Select value={filterPublic} onValueChange={(value: 'all' | 'public' | 'private') => setFilterPublic(value)}>
                                      <SelectTrigger className="w-[120px] h-9">
                                          <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                          <SelectItem value="all">All</SelectItem>
                                          <SelectItem value="public">Public</SelectItem>
                                          <SelectItem value="private">Private</SelectItem>
                                      </SelectContent>
                                  </Select>
                              </div>

                              {/* Sort Options */}
                              <div className="flex flex-col gap-1">
                                  <label className="text-xs font-medium text-muted-foreground">
                                      Sort
                                  </label>
                                  <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                          <Button variant="outline" size="sm" className="h-9 w-[140px] justify-between">
                                              <span className="flex items-center gap-2">
                                                  {sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />}
                                                  {sortBy === 'name' ? 'Name' : sortBy === 'created' ? 'Created' : 'Updated'}
                                              </span>
                                              <MoreHorizontal className="h-3 w-3" />
                                          </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="start" className="w-48">
                                          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuCheckboxItem
                                            checked={sortBy === 'name'}
                                            onCheckedChange={(checked) => checked && setSortBy('name')}
                                          >
                                              Name
                                          </DropdownMenuCheckboxItem>
                                          <DropdownMenuCheckboxItem
                                            checked={sortBy === 'created'}
                                            onCheckedChange={(checked) => checked && setSortBy('created')}
                                          >
                                              Created Date
                                          </DropdownMenuCheckboxItem>
                                          <DropdownMenuCheckboxItem
                                            checked={sortBy === 'updated'}
                                            onCheckedChange={(checked) => checked && setSortBy('updated')}
                                          >
                                              Updated Date
                                          </DropdownMenuCheckboxItem>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuCheckboxItem
                                            checked={sortOrder === 'asc'}
                                            onCheckedChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                          >
                                              Ascending
                                          </DropdownMenuCheckboxItem>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                              </div>
                          </div>

                          {/* View Mode Toggle */}
                          <div className="flex flex-col gap-1">
                              <label className="text-xs font-medium text-muted-foreground">
                                  View
                              </label>
                              <div className="flex items-center">
                                  <Button
                                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className="rounded-r-none h-9 px-3"
                                  >
                                      <Grid className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant={viewMode === 'list' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className="rounded-l-none h-9 px-3 border-l-0"
                                  >
                                      <List className="h-4 w-4" />
                                  </Button>
                              </div>
                          </div>
                      </div>
                  </CardContent>
              </Card>

              {/* Results Section */}
              <div className="space-y-4">
                  {/* Results Header */}
                  <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                          Showing {filteredDatabases.length} of {stats.total} databases
                      </p>
                  </div>

                  {/* Databases Grid/List */}
                  {(!filteredDatabases || filteredDatabases.length === 0) ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <DatabaseIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                {searchQuery || filterOwner !== 'all' || filterPublic !== 'all'
                                  ? 'No databases found'
                                  : 'No databases yet'
                                }
                            </h3>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                                {searchQuery || filterOwner !== 'all' || filterPublic !== 'all'
                                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                                  : 'Get started by creating your first database to store and organize your data.'
                                }
                            </p>
                            {(!searchQuery && filterOwner === 'all' && filterPublic === 'all') && (
                              <Button onClick={handleCreateDatabase} size="lg">
                                  <Plus className="mr-2 h-4 w-4" />
                                  Create Your First Database
                              </Button>
                            )}
                        </CardContent>
                    </Card>
                  ) : (
                    <div className={viewMode === 'grid'
                      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "space-y-3"
                    }>
                        {filteredDatabases.map((database) => (
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
                  {databasesData && (databasesData.totalPages || 0) > 1 && (
                    <Card>
                        <CardContent className="flex items-center justify-between py-4">
                            <div className="text-sm text-muted-foreground">
                                Page {databasesData.currentPage || 1} of {databasesData.totalPages || 1}
                            </div>
                            <div className="flex items-center space-x-2">
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
                                  disabled={queryParams.page === (databasesData.totalPages || 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                  )}
              </div>
          </Main>

          <DatabaseDialogs />
      </>
    );
};

// Wrap with provider and error boundary
export const DatabasesPage: React.FC = () => (
  <PageErrorBoundary>
      <DatabaseProvider>
          <DatabasesPageComponent />
      </DatabaseProvider>
  </PageErrorBoundary>
);

export default DatabasesPage;