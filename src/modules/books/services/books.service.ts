import { apiClient } from '@/services/api-client';
import type {
    Book,
    CreateBookRequest,
    UpdateBookRequest,
    BookQueryOptions,
    BooksResponse,
    BookStats,
    BookAnalytics,
    BookProgress,
    BookNote,
    ImportBooksRequest,
    ImportBooksResponse,
    ExportBooksOptions
} from '../types/books.types';
import type {
    BooksApiResponse,
    BookStatsApiResponse
} from '../types/books-api.types';

const BOOKS_BASE_URL = '/second-brain/books';

export class BooksService {
    // Basic CRUD operations
    static async getBooks(options: BookQueryOptions = {}): Promise<BooksResponse> {
        const params = new URLSearchParams();

        if (options.page) params.append('page', options.page.toString());
        if (options.limit) params.append('limit', options.limit.toString());
        if (options.sort) params.append('sort', options.sort);

        // Handle filters
        if (options.filters) {
            const { status, genre, area, tags, rating, search } = options.filters;

            if (status) {
                if (Array.isArray(status)) {
                    status.forEach(s => params.append('status', s));
                } else {
                    params.append('status', status);
                }
            }

            if (genre) {
                if (Array.isArray(genre)) {
                    genre.forEach(g => params.append('genre', g));
                } else {
                    params.append('genre', genre);
                }
            }

            if (area) params.append('area', area);
            if (rating) params.append('rating', rating.toString());
            if (search) params.append('search', search);

            if (tags) {
                if (Array.isArray(tags)) {
                    tags.forEach(tag => params.append('tags', tag));
                } else {
                    params.append('tags', tags);
                }
            }
        }

        const queryString = params.toString();
        const url = queryString ? `${BOOKS_BASE_URL}?${queryString}` : BOOKS_BASE_URL;

        const response = await apiClient.get(url);
        return response.data.data; // Server returns { success, message, data: { books, pagination } }
    }

    static async getBook(id: string): Promise<Book> {
        const response = await apiClient.get(`${BOOKS_BASE_URL}/${id}`);
        return response.data.data;
    }

    static async createBook(data: CreateBookRequest): Promise<Book> {
        const response = await apiClient.post(BOOKS_BASE_URL, data);
        return response.data.data;
    }

    static async updateBook(id: string, data: UpdateBookRequest): Promise<Book> {
        const response = await apiClient.put(`${BOOKS_BASE_URL}/${id}`, data);
        return response.data.data;
    }

    static async deleteBook(id: string): Promise<{ message: string }> {
        const response = await apiClient.delete(`${BOOKS_BASE_URL}/${id}`);
        return response.data.data;
    }

    // Analytics & Reporting
    static async getBookStats(): Promise<BookStats> {
        const response = await apiClient.get(`${BOOKS_BASE_URL}/stats`);
        return response.data.data;
    }

    static async getBookAnalytics(): Promise<BookAnalytics> {
        const response = await apiClient.get<BookAnalytics>(`${BOOKS_BASE_URL}/analytics`);
        return response.data;
    }

    // Import/Export
    static async importBooks(data: ImportBooksRequest): Promise<ImportBooksResponse> {
        const response = await apiClient.post<ImportBooksResponse>(`${BOOKS_BASE_URL}/import`, data);
        return response.data;
    }

    static async exportBooks(options: ExportBooksOptions = {}): Promise<any> {
        const params = new URLSearchParams();

        if (options.format) params.append('format', options.format);
        if (options.status) {
            if (Array.isArray(options.status)) {
                options.status.forEach(s => params.append('status', s));
            } else {
                params.append('status', options.status);
            }
        }
        if (options.genre) {
            if (Array.isArray(options.genre)) {
                options.genre.forEach(g => params.append('genre', g));
            } else {
                params.append('genre', options.genre);
            }
        }
        if (options.area) params.append('area', options.area);

        const queryString = params.toString();
        const url = queryString ? `${BOOKS_BASE_URL}/export?${queryString}` : `${BOOKS_BASE_URL}/export`;

        const response = await apiClient.get(url);
        return response.data;
    }

    // Bulk operations
    static async bulkUpdateBooks(bookIds: string[], updates: UpdateBookRequest): Promise<{ modifiedCount: number }> {
        const response = await apiClient.patch<{ modifiedCount: number }>(`${BOOKS_BASE_URL}/bulk`, {
            bookIds,
            updates
        });
        return response.data;
    }

    static async bulkDeleteBooks(bookIds: string[]): Promise<{ deletedCount: number }> {
        const response = await apiClient.delete<{ deletedCount: number }>(`${BOOKS_BASE_URL}/bulk`, {
            data: { bookIds }
        });
        return response.data;
    }

    // Book-specific operations
    static async updateReadingStatus(id: string, status: Book['status'], currentPage?: number): Promise<Book> {
        const response = await apiClient.patch<Book>(`${BOOKS_BASE_URL}/${id}/status`, {
            status,
            currentPage
        });
        return response.data;
    }

    static async toggleFavorite(id: string): Promise<Book> {
        const response = await apiClient.patch<Book>(`${BOOKS_BASE_URL}/${id}/favorite`);
        return response.data;
    }

    static async archiveBook(id: string): Promise<Book> {
        const response = await apiClient.patch<Book>(`${BOOKS_BASE_URL}/${id}/archive`);
        return response.data;
    }

    static async duplicateBook(id: string): Promise<Book> {
        const response = await apiClient.post<Book>(`${BOOKS_BASE_URL}/${id}/duplicate`);
        return response.data;
    }

    // Reading progress
    static async updateProgress(id: string, currentPage: number, status?: Book['status']): Promise<Book> {
        const response = await apiClient.patch<Book>(`${BOOKS_BASE_URL}/${id}/progress`, {
            currentPage,
            status
        });
        return response.data;
    }

    static async getProgress(id: string): Promise<BookProgress> {
        const response = await apiClient.get<BookProgress>(`${BOOKS_BASE_URL}/${id}/progress`);
        return response.data;
    }

    // Notes management
    static async addNote(id: string, noteData: Omit<BookNote, '_id' | 'createdAt'>): Promise<BookNote> {
        const response = await apiClient.post<BookNote>(`${BOOKS_BASE_URL}/${id}/notes`, noteData);
        return response.data;
    }

    static async getNotes(id: string): Promise<BookNote[]> {
        const response = await apiClient.get<BookNote[]>(`${BOOKS_BASE_URL}/${id}/notes`);
        return response.data;
    }

    static async updateNote(bookId: string, noteId: string, updates: Partial<BookNote>): Promise<BookNote> {
        const response = await apiClient.patch<BookNote>(`${BOOKS_BASE_URL}/${bookId}/notes/${noteId}`, updates);
        return response.data;
    }

    static async deleteNote(bookId: string, noteId: string): Promise<{ message: string }> {
        const response = await apiClient.delete<{ message: string }>(`${BOOKS_BASE_URL}/${bookId}/notes/${noteId}`);
        return response.data;
    }

    // Highlights management (using notes with type 'highlight')
    static async addHighlight(id: string, highlightData: { page?: number; chapter?: string; content: string }): Promise<BookNote> {
        const response = await apiClient.post<BookNote>(`${BOOKS_BASE_URL}/${id}/highlights`, highlightData);
        return response.data;
    }

    static async getHighlights(id: string): Promise<BookNote[]> {
        const response = await apiClient.get<BookNote[]>(`${BOOKS_BASE_URL}/${id}/highlights`);
        return response.data;
    }

    static async updateHighlight(bookId: string, highlightId: string, updates: { page?: number; chapter?: string; content?: string }): Promise<BookNote> {
        const response = await apiClient.patch<BookNote>(`${BOOKS_BASE_URL}/${bookId}/highlights/${highlightId}`, updates);
        return response.data;
    }

    static async deleteHighlight(bookId: string, highlightId: string): Promise<{ message: string }> {
        const response = await apiClient.delete<{ message: string }>(`${BOOKS_BASE_URL}/${bookId}/highlights/${highlightId}`);
        return response.data;
    }

    // Reviews management
    static async addReview(id: string, reviewData: { review?: string; rating?: number }): Promise<Book> {
        const response = await apiClient.post<Book>(`${BOOKS_BASE_URL}/${id}/review`, reviewData);
        return response.data;
    }

    static async getReview(id: string): Promise<{ review?: string; rating?: number }> {
        const response = await apiClient.get<{ review?: string; rating?: number }>(`${BOOKS_BASE_URL}/${id}/review`);
        return response.data;
    }

    static async updateReview(id: string, updates: { review?: string; rating?: number }): Promise<Book> {
        const response = await apiClient.patch<Book>(`${BOOKS_BASE_URL}/${id}/review`, updates);
        return response.data;
    }

    static async deleteReview(id: string): Promise<{ message: string }> {
        const response = await apiClient.delete<{ message: string }>(`${BOOKS_BASE_URL}/${id}/review`);
        return response.data;
    }

    // Utility methods
    static async searchBooks(query: string): Promise<BooksResponse> {
        return this.getBooks({ filters: { search: query } });
    }

    static async getBooksByStatus(status: Book['status']): Promise<BooksResponse> {
        return this.getBooks({ filters: { status } });
    }

    static async getBooksByGenre(genre: string): Promise<BooksResponse> {
        return this.getBooks({ filters: { genre } });
    }

    static async getFavoriteBooks(): Promise<BooksResponse> {
        return this.getBooks({ filters: { tags: 'favorite' } });
    }

    static async getCurrentlyReading(): Promise<BooksResponse> {
        return this.getBooks({ filters: { status: 'reading' } });
    }

    static async getCompletedBooks(): Promise<BooksResponse> {
        return this.getBooks({ filters: { status: 'completed' } });
    }

    static async getWantToRead(): Promise<BooksResponse> {
        return this.getBooks({ filters: { status: 'want-to-read' } });
    }

    static async getBooksByArea(area: Book['area']): Promise<BooksResponse> {
        return this.getBooks({ filters: { area } });
    }

}

export default BooksService;
