// Book types based on server model
export interface Book {
    _id: string;
    // Book Details
    title: string;
    author: string;
    isbn?: string;
    genre?: string[];
    pages?: number;
    
    // Reading Status (must match server validation schema)
    status: 'want-to-read' | 'reading' | 'completed' | 'paused' | 'abandoned';
    startDate?: string; // ISO date string
    finishDate?: string; // ISO date string
    currentPage?: number;
    
    // Rating & Review
    rating?: number; // 1-5 stars
    review?: string;
    
    // Notes & Highlights
    notes: BookNote[];
    
    // Key Insights
    keyInsights?: string[];
    actionItems?: string[];
    
    // PARA Classification
    area: 'projects' | 'areas' | 'resources' | 'archive';
    tags: string[];
    
    // Relationships
    linkedProjects: string[];
    linkedGoals: string[];
    
    // Metadata
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    archivedAt?: string;
}

export interface BookNote {
    _id?: string;
    page?: number;
    chapter?: string;
    content: string;
    type: 'note' | 'highlight' | 'quote';
    createdAt: string;
}

export interface CreateBookRequest {
    title: string;
    author: string;
    isbn?: string;
    genre?: string[];
    status?: Book['status'];
    rating?: number;
    pages?: number;
    currentPage?: number;
    startDate?: string;
    endDate?: string;
    notes?: Omit<BookNote, '_id' | 'createdAt'>[];
    keyInsights?: string[];
    actionItems?: string[];
    area?: Book['area'];
    tags?: string[];
    linkedProjects?: string[];
    linkedGoals?: string[];
    review?: string;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
    archivedAt?: string;
}

export interface BookFilters {
    status?: string | string[];
    genre?: string | string[];
    area?: Book['area'];
    tags?: string | string[];
    rating?: number;
    search?: string;
}

export interface BookQueryOptions {
    page?: number;
    limit?: number;
    sort?: string;
    filters?: BookFilters;
}

export interface BooksResponse {
    books: Book[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface BookStats {
    overview: {
        totalBooks: number;
        completedBooks: number;
        currentlyReading: number;
        averageRating: number;
    };
    statusBreakdown: Array<{
        _id: string;
        count: number;
    }>;
    genreBreakdown: Array<{
        _id: string;
        count: number;
    }>;
    monthlyProgress: Array<{
        month: string;
        completed: number;
        started: number;
    }>;
}

export interface BookAnalytics {
    readingVelocity: {
        booksPerMonth: number;
        pagesPerDay: number;
        averageReadingTime: number;
    };
    preferences: {
        favoriteGenres: string[];
        averageBookLength: number;
        readingPatterns: any;
    };
    goals: {
        yearlyTarget: number;
        currentProgress: number;
        projectedCompletion: number;
    };
}

export interface BookProgress {
    currentPage: number;
    totalPages: number;
    progressPercentage: number;
    estimatedTimeRemaining: string;
    readingVelocity: number;
}

// Document-view specific types
export interface BookRecord {
    id: string;
    properties: {
        title: string;
        author: string;
        isbn?: string;
        genre?: string[];
        status: Book['status'];
        rating?: number;
        pages?: number;
        currentPage?: number;
        startDate?: string;
        endDate?: string;
        area: Book['area'];
        tags: string[];
        keyInsights?: string[];
        actionItems?: string[];
        review?: string;
        createdAt: string;
        updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface CreateBookRecordRequest {
    properties?: Partial<BookRecord['properties']>;
    // Allow direct properties as well
    title?: string;
    author?: string;
    isbn?: string;
    genre?: string[];
    status?: Book['status'];
    rating?: number;
    pages?: number;
    currentPage?: number;
    startDate?: string;
    endDate?: string;
    area?: Book['area'];
    tags?: string[];
    keyInsights?: string[];
    actionItems?: string[];
    review?: string;
}

export interface UpdateBookRecordRequest extends Partial<CreateBookRecordRequest> {}

// API Response types
export interface BookRecordsResponse {
    records: BookRecord[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Import/Export types
export interface ImportBooksRequest {
    books: CreateBookRequest[];
    skipDuplicates?: boolean;
}

export interface ImportBooksResponse {
    imported: number;
    skipped: number;
    errors: Array<{
        record: any;
        error: string;
    }>;
}

export interface ExportBooksOptions {
    format?: 'json' | 'csv';
    status?: string | string[];
    genre?: string | string[];
    area?: Book['area'];
}
