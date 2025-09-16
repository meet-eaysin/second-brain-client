import { useState } from 'react';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, Clock, TrendingUp, Plus } from 'lucide-react';
import { DocumentView } from '@/modules/document-view';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BooksService } from '../services/books.service';
import { BooksDocumentViewService } from '../services/books-document-view.service';
import { transformBooksProperties } from '@/modules/document-view/utils/property-transform';
import type { Book, BookQueryOptions } from '../types/books.types';

export function BooksPage() {
    const queryClient = useQueryClient();
    const [queryOptions] = useState<BookQueryOptions>({
        page: 1,
        limit: 50,
        filters: {}
    });

    // Queries
    const { data: booksResponse, isLoading: booksLoading, error: booksError } = useQuery({
        queryKey: ['books', queryOptions],
        queryFn: () => BooksService.getBooks(queryOptions),
    });

    // Document View Configuration from APIs with fallbacks
    const { data: viewConfig, isLoading: configLoading, error: configError } = useQuery({
        queryKey: ['books-document-view-config'],
        queryFn: () => BooksDocumentViewService.getConfig(),
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const { data: views, isLoading: viewsLoading, error: viewsError } = useQuery({
        queryKey: ['books-document-view-views'],
        queryFn: () => BooksDocumentViewService.getViews(),
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const { data: properties, isLoading: propertiesLoading, error: propertiesError } = useQuery({
        queryKey: ['books-document-view-properties'],
        queryFn: () => BooksDocumentViewService.getProperties(),
        retry: false,
        staleTime: 5 * 60 * 1000,
    });



    const { data: bookStats } = useQuery({
        queryKey: ['books-stats'],
        queryFn: () => BooksService.getBookStats(),
    });

    // Mutations
    const createBookMutation = useMutation({
        mutationFn: BooksService.createBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });

    const updateBookMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => BooksService.updateBook(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['books-document-view'] });
        },
    });

    const deleteBookMutation = useMutation({
        mutationFn: BooksService.deleteBook,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });

    // Extract data
    const books = booksResponse?.books || [];



    // Handlers
    const handleCreateBook = async () => {
        try {
            // Create a default book with minimal required fields
            const defaultBook = {
                title: 'New Book',
                author: 'Unknown Author',
                status: 'want-to-read' as const,  // ✅ Use hyphen to match server validation
                area: 'resources' as const,
                tags: []
            };
            await createBookMutation.mutateAsync(defaultBook);
        } catch (error) {
            console.error('Failed to create book:', error);
        }
    };

    // DocumentView create handler - called when user clicks create in DocumentView
    const handleDocumentViewCreate = async () => {
        await handleCreateBook();
    };



    const handleUpdateBook = async (id: string, updates: any) => {
        try {
            await updateBookMutation.mutateAsync({ id, data: updates });
        } catch (error) {
            console.error('Failed to update book:', error);
        }
    };

    const handleDeleteBook = async (id: string) => {
        try {
            await deleteBookMutation.mutateAsync(id);
        } catch (error) {
            console.error('Failed to delete book:', error);
        }
    };

    // Transform server properties to client format using centralized transformation
    const transformedProperties = properties ? transformBooksProperties(properties) : [];

    // Loading states
    const isLoading = booksLoading || configLoading || viewsLoading || propertiesLoading;

    // Debug logging
    console.log('📚 Books API Debug:', {
        books: books ? `Array(${books.length})` : 'null',
        booksResponse: booksResponse ? 'loaded' : 'null',
        viewConfig: viewConfig ? 'loaded' : 'null',
        views: Array.isArray(views) ? `Array(${views.length})` : typeof views,
        properties: Array.isArray(properties) ? `Array(${properties.length})` : typeof properties,
        transformedProperties: transformedProperties ? `Array(${transformedProperties.length})` : 'null',
        loading: {
            books: booksLoading,
            config: configLoading,
            views: viewsLoading,
            properties: propertiesLoading,
            overall: isLoading
        },
        errors: {
            books: booksError ? (booksError as Error).message : null,
            config: configError ? (configError as Error).message : null,
            views: viewsError ? (viewsError as Error).message : null,
            properties: propertiesError ? (propertiesError as Error).message : null
        }
    });

    if (process.env.NODE_ENV === 'development' && properties && properties.length > 0) {
        const multiSelectProps = transformedProperties.filter(p => p.type === 'MULTI_SELECT');
        if (multiSelectProps.length > 0) {
            console.log('🔀 MultiSelect Properties:', multiSelectProps.map(p => ({
                id: p.id,
                name: p.name,
                type: p.type,
                selectOptionsCount: p.selectOptions?.length || 0,
                selectOptions: p.selectOptions
            })));
        }
    }

    return (
        <Main>
            <EnhancedHeader />
            {/* Page Header */}
            <div className="mb-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Total Books</span>
                            </div>
                            <p className="text-2xl font-bold mt-1">
                                {bookStats?.overview?.totalBooks?.toString() || books.length.toString()}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Currently Reading</span>
                            </div>
                            <p className="text-2xl font-bold mt-1">
                                {bookStats?.overview?.currentlyReading?.toString() ||
                                 books.filter((book: Book) => book.status === 'reading').length.toString()}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Completed</span>
                            </div>
                            <p className="text-2xl font-bold mt-1">
                                {bookStats?.overview?.completedBooks?.toString() ||
                                 books.filter((book: Book) => book.status === 'completed').length.toString()}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Average Rating</span>
                            </div>
                            <p className="text-2xl font-bold mt-1">
                                {bookStats?.overview?.averageRating?.toFixed(1) || '0.0'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center h-32">
                                <div className="text-muted-foreground">Loading books...</div>
                            </div>
                        </CardContent>
                    </Card>
                ) : booksError ? (
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center h-32">
                                <div className="text-destructive">Error loading books: {(booksError as Error).message}</div>
                            </div>
                        </CardContent>
                    </Card>
                ) : !Array.isArray(transformedProperties) || !Array.isArray(views) ? (
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center justify-center h-32 space-y-4">
                                <div className="text-muted-foreground text-center">
                                    Document view configuration not available. Please ensure the server APIs are running.
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Properties: {Array.isArray(transformedProperties) ? `✓ ${transformedProperties.length} loaded` : '✗ Not loaded'}<br/>
                                    Views: {Array.isArray(views) ? `✓ ${views.length} loaded` : '✗ Not loaded'}
                                </div>
                                <Button onClick={handleCreateBook} disabled={createBookMutation.isPending}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Book (Fallback)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className={"py-0"}>
                        <CardContent className="p-6">
                            <DocumentView
                                database={{
                                    id: (viewConfig)?.services?.databaseId || 'books-database',
                                    name: (viewConfig)?.displayNamePlural || 'Books',
                                    description: (viewConfig)?.description || 'Manage your reading list and track your progress',
                                    icon: (viewConfig)?.icon || '📚',
                                    properties: transformedProperties,
                                    views: Array.isArray(views) ? views : [],
                                    config: {
                                        moduleType: 'books'
                                    }
                                }}
                                records={books.map((book: Book) => {
                                    let transformedStatus = book.status;
                                    if (typeof book.status === 'string' && book.status.includes('_')) {
                                        transformedStatus = book.status.replace(/_/g, '-') as Book['status'];
                                    }

                                    return {
                                        id: book._id,
                                        documentId: 'books',
                                        properties: {
                                            title: book.title,
                                            author: book.author,
                                            isbn: book.isbn,
                                            genre: book.genre,
                                            status: transformedStatus,
                                            rating: book.rating,
                                            pages: book.pages,
                                            currentPage: book.currentPage,
                                            startDate: book.startDate,
                                            finishDate: book.finishDate,
                                            notes: book.notes,
                                            tags: book.tags,
                                            keyInsights: book.keyInsights,
                                            actionItems: book.actionItems,
                                            linkedProjects: book.linkedProjects,
                                            linkedGoals: book.linkedGoals,
                                            area: book.area,
                                            createdAt: book.createdAt,
                                            updatedAt: book.updatedAt,
                                        },
                                        createdBy: book.createdBy,
                                        createdAt: book.createdAt,
                                        updatedAt: book.updatedAt,
                                    };
                                })}
                                moduleType="books"
                                config={{
                                    // Use server-provided capabilities and UI settings
                                    ...(viewConfig)?.capabilities,
                                    ...(viewConfig)?.ui,
                                    // Display configuration
                                    title: (viewConfig)?.displayNamePlural || 'Books',
                                    icon: (viewConfig)?.icon || '📚',
                                    description: (viewConfig)?.description || 'Manage your reading list and track your progress',
                                    // Data source configuration
                                    dataSourceId: (viewConfig)?.services?.databaseId,
                                    dataSourceType: (viewConfig)?.services?.modelName,
                                    // Frozen configuration from server
                                    apiFrozenConfig: (viewConfig)?.frozenConfig,
                                    // Let server control property management through capabilities
                                    // If server says canCreate/canEdit/canDelete are true, property management is enabled
                                    // If server provides frozenConfig, those properties will be protected
                                }}
                                onRecordCreate={handleDocumentViewCreate}
                                onRecordEdit={(record) => console.log('Edit:', record)}
                                onRecordDelete={(recordId) => handleDeleteBook(recordId)}
                                onRecordUpdate={(recordId, updates) => handleUpdateBook(recordId, updates)}
                                isLoading={isLoading}
                                error={booksError ? (booksError as Error).message : null}
                            />


                        </CardContent>
                    </Card>
                )}
            </div>
        </Main>
    );
}

export default BooksPage;