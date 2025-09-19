/**
 * Books Document View Hooks
 *
 * React Query hooks for books document view operations.
 * Provides a specialized interface for books management.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  booksDocumentViewService,
  type BooksViewConfig,
  type BookRecord,
} from "../services/books-document-view.service";
import type { DocumentView } from "@/modules/document-view";

// Query Keys
export const BOOKS_DOCUMENT_VIEW_QUERY_KEYS = {
  config: () => ["books-document-view", "config"] as const,
  defaultProperties: () =>
    ["books-document-view", "default-properties"] as const,
  defaultViews: () => ["books-document-view", "default-views"] as const,
  frozenConfig: () => ["books-document-view", "frozen-config"] as const,
  views: () => ["books-document-view", "views"] as const,
  view: (viewId: string) => ["books-document-view", "views", viewId] as const,
  defaultView: () => ["books-document-view", "views", "default"] as const,
  books: (filters?: any, sorts?: any) =>
    ["books-document-view", "books", { filters, sorts }] as const,
  book: (bookId: string) => ["books-document-view", "books", bookId] as const,
};

// Query Hooks
export function useBooksViewConfigQuery() {
  return useQuery({
    queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.config(),
    queryFn: () => booksDocumentViewService.getBooksViewConfig(),
    staleTime: 10 * 60 * 1000, // 10 minutes - config doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook to get frozen configuration from API
export function useBooksFrozenConfigQuery() {
  const { data: config } = useBooksViewConfigQuery();

  return {
    frozenConfig: config?.frozenConfig || null,
    isLoading: !config,
    error: null,
  };
}

// New hooks for dynamic configuration endpoints
export function useDefaultBooksPropertiesQuery() {
  return useQuery({
    queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.defaultProperties(),
    queryFn: () => booksDocumentViewService.getDefaultBooksProperties(),
    staleTime: 15 * 60 * 1000, // 15 minutes - default properties rarely change
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useDefaultBooksViewsQuery() {
  return useQuery({
    queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.defaultViews(),
    queryFn: () => booksDocumentViewService.getDefaultBooksViews(),
    staleTime: 15 * 60 * 1000, // 15 minutes - default views rarely change
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useBooksFrozenConfigDirectQuery() {
  return useQuery({
    queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.frozenConfig(),
    queryFn: () => booksDocumentViewService.getBooksFrozenConfig(),
    staleTime: 30 * 60 * 1000, // 30 minutes - frozen config very rarely changes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}

export function useBooksViewsQuery() {
  return useQuery({
    queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.views(),
    queryFn: () => booksDocumentViewService.getUserBooksViews(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useBooksViewQuery(viewId: string) {
  return useQuery({
    queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.view(viewId),
    queryFn: () => booksDocumentViewService.getBooksView(viewId),
    enabled: !!viewId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useDefaultBooksViewQuery() {
  return useQuery({
    queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.defaultView(),
    queryFn: () => booksDocumentViewService.getDefaultBooksView(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useBooksQuery(
  filters?: any,
  sorts?: any,
  pagination?: any,
  viewId?: string
) {
  return useQuery({
    queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.books(filters, sorts),
    queryFn: () =>
      booksDocumentViewService.getBooks(filters, sorts, pagination, viewId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Enhanced hook for books with filters and sorts
export function useBooksWithFiltersAndSortsQuery(
  options: {
    filters?: Record<string, any>;
    sorts?: Array<{
      propertyId: string;
      direction: "asc" | "desc";
      order?: number;
    }>;
    pagination?: { page?: number; limit?: number };
    viewId?: string;
    search?: string;
    status?: string[];
    genre?: string[];
    author?: string;
    tags?: string[];
    rating?: number;
    favorite?: boolean;
    enabled?: boolean;
  } = {}
) {
  const { enabled = true, ...queryOptions } = options;

  return useQuery({
    queryKey: ["books-document-view", "books-enhanced", queryOptions],
    queryFn: () =>
      booksDocumentViewService.getBooksWithFiltersAndSorts(queryOptions),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for books with view-based filtering and sorting
export function useBooksWithViewQuery(
  viewId: string,
  additionalFilters?: Record<string, any>
) {
  return useQuery({
    queryKey: [
      "books-document-view",
      "books-with-view",
      viewId,
      additionalFilters,
    ],
    queryFn: () =>
      booksDocumentViewService.getBooksWithFiltersAndSorts({
        viewId,
        filters: additionalFilters,
      }),
    enabled: !!viewId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useBookQuery(bookId: string) {
  return useQuery({
    queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.book(bookId),
    queryFn: () => booksDocumentViewService.getBook(bookId),
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

// Books-specific query hooks
export function useBooksWithFiltersQuery(
  options: {
    status?: string[];
    genre?: string[];
    author?: string;
    tags?: string[];
    rating?: number;
    favorite?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  return useQuery({
    queryKey: ["books-document-view", "books-filtered", options],
    queryFn: () =>
      booksDocumentViewService.getBooksWithFiltersAndSorts(options),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useBooksByStatusQuery(status: string) {
  return useQuery({
    queryKey: ["books-document-view", "books-by-status", status],
    queryFn: () =>
      booksDocumentViewService.getBooksWithFiltersAndSorts({
        status: [status],
      }),
    enabled: !!status,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useBooksByGenreQuery(genre: string) {
  return useQuery({
    queryKey: ["books-document-view", "books-by-genre", genre],
    queryFn: () =>
      booksDocumentViewService.getBooksWithFiltersAndSorts({ genre: [genre] }),
    enabled: !!genre,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useFavoriteBooksQuery() {
  return useQuery({
    queryKey: ["books-document-view", "books-favorites"],
    queryFn: () =>
      booksDocumentViewService.getBooksWithFiltersAndSorts({ favorite: true }),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Mutation Hooks
export function useCreateBooksViewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (viewData: Partial<DocumentView>) =>
      booksDocumentViewService.createBooksView(viewData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.views(),
      });
    },
  });
}

export function useUpdateBooksViewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      viewId,
      updates,
    }: {
      viewId: string;
      updates: Partial<DocumentView>;
    }) => booksDocumentViewService.updateBooksView(viewId, updates),
    onSuccess: (_, { viewId }) => {
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.view(viewId),
      });
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.views(),
      });
    },
  });
}

export function useDeleteBooksViewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (viewId: string) =>
      booksDocumentViewService.deleteBooksView(viewId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.views(),
      });
    },
  });
}

export function useDuplicateBooksViewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ viewId, newName }: { viewId: string; newName?: string }) =>
      booksDocumentViewService.duplicateBooksView(viewId, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.views(),
      });
    },
  });
}

export function useUpdateBooksViewPropertiesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      viewId,
      properties,
    }: {
      viewId: string;
      properties: Array<{
        propertyId: string;
        order: number;
        width?: number;
        visible?: boolean;
        frozen?: boolean;
        displayConfig?: any;
      }>;
    }) =>
      booksDocumentViewService.updateBooksViewProperties(viewId, properties),
    onSuccess: (_, { viewId }) => {
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.view(viewId),
      });
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.views(),
      });
    },
  });
}

export function useUpdateBooksViewFiltersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ viewId, filters }: { viewId: string; filters: any[] }) =>
      booksDocumentViewService.updateBooksViewFilters(viewId, filters),
    onSuccess: (_, { viewId }) => {
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.view(viewId),
      });

      // Invalidate ALL books queries
      queryClient.invalidateQueries({
        queryKey: ["books-document-view", "books"],
        exact: false,
      });

      // Also invalidate the enhanced books queries
      queryClient.invalidateQueries({
        queryKey: ["books-document-view", "books-enhanced"],
        exact: false,
      });
    },
  });
}

export function useUpdateBooksViewSortsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ viewId, sorts }: { viewId: string; sorts: any[] }) =>
      booksDocumentViewService.updateBooksViewSorts(viewId, sorts),
    onSuccess: (_, { viewId }) => {
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.view(viewId),
      });

      // Invalidate ALL books queries
      queryClient.invalidateQueries({
        queryKey: ["books-document-view", "books"],
        exact: false,
      });

      // Also invalidate the enhanced books queries
      queryClient.invalidateQueries({
        queryKey: ["books-document-view", "books-enhanced"],
        exact: false,
      });
    },
  });
}

export function useCreateBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookData: Partial<BookRecord>) =>
      booksDocumentViewService.createBook(bookData),
    onSuccess: () => {
      // Invalidate ALL books queries
      queryClient.invalidateQueries({
        queryKey: ["books-document-view", "books"],
        exact: false,
      });

      // Also invalidate the enhanced books queries
      queryClient.invalidateQueries({
        queryKey: ["books-document-view", "books-enhanced"],
        exact: false,
      });
    },
  });
}

export function useUpdateBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookId,
      updates,
    }: {
      bookId: string;
      updates: Partial<BookRecord>;
    }) => booksDocumentViewService.updateBook(bookId, updates),
    onSuccess: (updatedBook, { bookId }) => {
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.book(bookId),
      });

      queryClient.invalidateQueries({
        queryKey: ["books-document-view"],
        exact: false,
      });

      queryClient.refetchQueries({
        queryKey: ["books-document-view", "books"],
        exact: false,
      });

      queryClient.refetchQueries({
        queryKey: ["books-document-view", "books-enhanced"],
        exact: false,
      });
    },
    onError: (error) => {
      console.error("❌ Failed to update book:", error);
    },
  });
}

export function useDeleteBookMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => booksDocumentViewService.deleteBook(bookId),
    onSuccess: (_, bookId) => {
      // Remove the specific book from cache
      queryClient.removeQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.book(bookId),
      });

      // Invalidate ALL books queries
      queryClient.invalidateQueries({
        queryKey: ["books-document-view", "books"],
        exact: false,
      });

      // Also invalidate the enhanced books queries
      queryClient.invalidateQueries({
        queryKey: ["books-document-view", "books-enhanced"],
        exact: false,
      });
    },
  });
}

// Property Management Mutations
export function useAddBooksPropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      viewId,
      property,
    }: {
      viewId: string;
      property: {
        name: string;
        type: string;
        description?: string;
        required?: boolean;
        order?: number;
        selectOptions?: Array<{ name: string; color: string }>;
      };
    }) => booksDocumentViewService.addBooksProperty(viewId, property),
    onSuccess: (updatedView, { viewId }) => {
      queryClient.invalidateQueries({
        queryKey: ["books-document-view"],
        exact: false,
      });

      // Specifically invalidate views and properties
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.views(),
      });
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.view(viewId),
      });
      queryClient.invalidateQueries({
        queryKey: BOOKS_DOCUMENT_VIEW_QUERY_KEYS.defaultProperties(),
      });
    },
    onError: (error) => {
      console.error("❌ Failed to add property:", error);
    },
  });
}
