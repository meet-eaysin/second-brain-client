import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
    BookOpen, Plus, Search, Filter, Star,
    Calendar, Clock, TrendingUp, Target,
    Edit, Trash2, Eye, Play, Pause,
    CheckCircle, BarChart3, Award, Bookmark
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';
import { toast } from 'sonner';

interface Book {
    _id: string;
    title: string;
    author: string;
    isbn?: string;
    genre: string;
    pages: number;
    currentPage: number;
    status: 'want-to-read' | 'reading' | 'completed' | 'paused' | 'abandoned';
    rating?: number;
    startDate?: string;
    finishDate?: string;
    notes?: string;
    quotes: string[];
    tags: string[];
    priority: 'low' | 'medium' | 'high';
    format: 'physical' | 'ebook' | 'audiobook';
    source?: string;
    recommendedBy?: string;
    createdAt: string;
    updatedAt: string;
}

const bookGenres = [
    'Fiction', 'Non-Fiction', 'Biography', 'History', 'Science',
    'Technology', 'Business', 'Self-Help', 'Philosophy', 'Psychology',
    'Health', 'Travel', 'Cooking', 'Art', 'Religion', 'Other'
];

export function BooksPage() {
    const [selectedView, setSelectedView] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [newBook, setNewBook] = useState<Partial<Book>>({
        status: 'want-to-read',
        priority: 'medium',
        format: 'physical',
        currentPage: 0,
        quotes: [],
        tags: []
    });

    const queryClient = useQueryClient();

    const { data: booksData, isLoading } = useQuery({
        queryKey: ['second-brain', 'books'],
        queryFn: () => secondBrainApi.books?.getAll() || Promise.resolve({ data: { books: [] } }),
    });

    const createBookMutation = useMutation({
        mutationFn: (data: Partial<Book>) => secondBrainApi.books?.create(data) || Promise.resolve({}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'books'] });
            toast.success('Book added successfully');
            setIsCreateDialogOpen(false);
            setNewBook({
                status: 'want-to-read',
                priority: 'medium',
                format: 'physical',
                currentPage: 0,
                quotes: [],
                tags: []
            });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add book');
        },
    });

    const updateBookMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Book> }) =>
            secondBrainApi.books?.update(id, data) || Promise.resolve({}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'books'] });
            toast.success('Book updated successfully');
        },
    });

    const books = booksData?.data?.books || [];

    const filteredBooks = books.filter((book: Book) => {
        const matchesSearch = searchQuery === '' || 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.genre.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesView = selectedView === 'all' || 
            (selectedView === 'reading' && book.status === 'reading') ||
            (selectedView === 'completed' && book.status === 'completed') ||
            (selectedView === 'want-to-read' && book.status === 'want-to-read') ||
            (selectedView === 'favorites' && book.rating && book.rating >= 4) ||
            (selectedView === 'this-year' && book.finishDate && new Date(book.finishDate).getFullYear() === new Date().getFullYear());

        return matchesSearch && matchesView;
    });

    const handleCreateBook = () => {
        if (!newBook.title || !newBook.author) {
            toast.error('Title and author are required');
            return;
        }
        createBookMutation.mutate(newBook);
    };

    const handleUpdateProgress = (bookId: string, currentPage: number) => {
        const book = books.find((b: Book) => b._id === bookId);
        if (!book) return;

        const updates: Partial<Book> = { currentPage };
        
        if (currentPage >= book.pages) {
            updates.status = 'completed';
            updates.finishDate = new Date().toISOString();
            updates.currentPage = book.pages;
        }

        updateBookMutation.mutate({ id: bookId, data: updates });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'reading': return 'bg-blue-500';
            case 'completed': return 'bg-green-500';
            case 'want-to-read': return 'bg-yellow-500';
            case 'paused': return 'bg-orange-500';
            case 'abandoned': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getFormatIcon = (format: string) => {
        switch (format) {
            case 'ebook': return '📱';
            case 'audiobook': return '🎧';
            default: return '📖';
        }
    };

    const views = [
        { id: 'all', label: 'All Books', count: books.length },
        { id: 'reading', label: 'Currently Reading', count: books.filter((b: Book) => b.status === 'reading').length },
        { id: 'completed', label: 'Completed', count: books.filter((b: Book) => b.status === 'completed').length },
        { id: 'want-to-read', label: 'Want to Read', count: books.filter((b: Book) => b.status === 'want-to-read').length },
        { id: 'favorites', label: 'Favorites', count: books.filter((b: Book) => b.rating && b.rating >= 4).length },
        { id: 'this-year', label: 'This Year', count: books.filter((b: Book) => b.finishDate && new Date(b.finishDate).getFullYear() === new Date().getFullYear()).length }
    ];

    const totalBooks = books.length;
    const completedBooks = books.filter((b: Book) => b.status === 'completed').length;
    const currentlyReading = books.filter((b: Book) => b.status === 'reading').length;
    const averageRating = books.filter((b: Book) => b.rating).length > 0 
        ? (books.filter((b: Book) => b.rating).reduce((sum: number, b: Book) => sum + (b.rating || 0), 0) / books.filter((b: Book) => b.rating).length).toFixed(1)
        : 0;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <BookOpen className="h-8 w-8" />
                        Book Log
                    </h1>
                    <p className="text-muted-foreground">Track your reading journey and build your personal library</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Book
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Book</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title *</label>
                                <Input
                                    placeholder="Book title"
                                    value={newBook.title || ''}
                                    onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Author *</label>
                                <Input
                                    placeholder="Author name"
                                    value={newBook.author || ''}
                                    onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Genre</label>
                                <Select 
                                    value={newBook.genre || ''} 
                                    onValueChange={(value) => setNewBook(prev => ({ ...prev, genre: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select genre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bookGenres.map((genre) => (
                                            <SelectItem key={genre} value={genre.toLowerCase()}>
                                                {genre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pages</label>
                                <Input
                                    type="number"
                                    placeholder="Number of pages"
                                    value={newBook.pages || ''}
                                    onChange={(e) => setNewBook(prev => ({ ...prev, pages: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select 
                                    value={newBook.status} 
                                    onValueChange={(value) => setNewBook(prev => ({ ...prev, status: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="want-to-read">Want to Read</SelectItem>
                                        <SelectItem value="reading">Currently Reading</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="paused">Paused</SelectItem>
                                        <SelectItem value="abandoned">Abandoned</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Format</label>
                                <Select 
                                    value={newBook.format} 
                                    onValueChange={(value) => setNewBook(prev => ({ ...prev, format: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="physical">Physical Book</SelectItem>
                                        <SelectItem value="ebook">E-book</SelectItem>
                                        <SelectItem value="audiobook">Audiobook</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Priority</label>
                                <Select 
                                    value={newBook.priority} 
                                    onValueChange={(value) => setNewBook(prev => ({ ...prev, priority: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Recommended By</label>
                                <Input
                                    placeholder="Who recommended this book?"
                                    value={newBook.recommendedBy || ''}
                                    onChange={(e) => setNewBook(prev => ({ ...prev, recommendedBy: e.target.value }))}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-medium">Notes</label>
                                <Textarea
                                    placeholder="Your thoughts about this book..."
                                    value={newBook.notes || ''}
                                    onChange={(e) => setNewBook(prev => ({ ...prev, notes: e.target.value }))}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleCreateBook}
                                disabled={createBookMutation.isPending}
                            >
                                {createBookMutation.isPending ? 'Adding...' : 'Add Book'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Books</p>
                                <p className="text-2xl font-bold">{totalBooks}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold">{completedBooks}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Play className="h-5 w-5 text-orange-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Currently Reading</p>
                                <p className="text-2xl font-bold">{currentlyReading}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Average Rating</p>
                                <p className="text-2xl font-bold">{averageRating}/5</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </div>

            {/* View Tabs */}
            <Tabs value={selectedView} onValueChange={setSelectedView}>
                <TabsList className="grid w-full grid-cols-6">
                    {views.map((view) => (
                        <TabsTrigger key={view.id} value={view.id} className="text-xs">
                            {view.label} ({view.count})
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={selectedView} className="space-y-4">
                    {filteredBooks.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No books found</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Start building your personal library by adding books.
                                </p>
                                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add First Book
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredBooks.map((book: Book) => (
                                <Card key={book._id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg ${getStatusColor(book.status)} flex items-center justify-center text-white text-lg`}>
                                                    {getFormatIcon(book.format)}
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                                                    <CardDescription>by {book.author}</CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {book.rating && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                        <span className="text-xs">{book.rating}</span>
                                                    </div>
                                                )}
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={getStatusColor(book.status) + ' text-white'}>
                                                {book.status.replace('-', ' ')}
                                            </Badge>
                                            <Badge variant="outline">
                                                {book.genre}
                                            </Badge>
                                            {book.priority === 'high' && (
                                                <Badge variant="destructive" className="text-xs">
                                                    High Priority
                                                </Badge>
                                            )}
                                        </div>

                                        {book.status === 'reading' && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Progress</span>
                                                    <span>{book.currentPage}/{book.pages} pages</span>
                                                </div>
                                                <Progress value={(book.currentPage / book.pages) * 100} className="h-2" />
                                            </div>
                                        )}

                                        {book.pages && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Bookmark className="h-3 w-3" />
                                                {book.pages} pages
                                            </div>
                                        )}

                                        {book.startDate && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                Started: {new Date(book.startDate).toLocaleDateString()}
                                            </div>
                                        )}

                                        {book.finishDate && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircle className="h-3 w-3" />
                                                Finished: {new Date(book.finishDate).toLocaleDateString()}
                                            </div>
                                        )}

                                        {book.recommendedBy && (
                                            <div className="text-sm text-muted-foreground">
                                                Recommended by {book.recommendedBy}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 pt-2">
                                            {book.status === 'reading' && (
                                                <Button size="sm" variant="outline" className="flex-1 gap-2">
                                                    <Play className="h-3 w-3" />
                                                    Update Progress
                                                </Button>
                                            )}
                                            <Button size="sm" variant="outline" className="flex-1 gap-2">
                                                <Eye className="h-3 w-3" />
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
