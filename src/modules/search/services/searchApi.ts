import { apiClient } from '@/services/api-client.ts';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import type { ApiResponse } from '@/types/api.types';
import type { Database, DatabaseRecord } from '@/types/database.types';

export interface GlobalSearchResult {
    databases: DatabaseSearchResult[];
    records: RecordSearchResult[];
    users: UserSearchResult[];
    totalResults: number;
    searchTime: number;
}

export interface DatabaseSearchResult {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    ownerId: string;
    ownerName: string;
    recordCount: number;
    lastModified: string;
    relevanceScore: number;
    matchedFields: string[];
}

export interface RecordSearchResult {
    id: string;
    databaseId: string;
    databaseName: string;
    properties: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    relevanceScore: number;
    matchedFields: string[];
    snippet: string;
}

export interface UserSearchResult {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    relevanceScore: number;
    matchedFields: string[];
}

export interface SearchFilters {
    type?: 'databases' | 'records' | 'users' | 'all';
    ownerId?: string;
    databaseId?: string;
    dateRange?: {
        start: string;
        end: string;
    };
    properties?: Record<string, any>;
    tags?: string[];
    categories?: string[];
}

export interface SearchOptions {
    limit?: number;
    offset?: number;
    sortBy?: 'relevance' | 'date' | 'name' | 'popularity';
    sortOrder?: 'asc' | 'desc';
    includeSnippets?: boolean;
    highlightMatches?: boolean;
}

export interface DatabaseSearchParams extends SearchOptions {
    query: string;
    filters?: {
        ownerId?: string;
        categoryId?: string;
        isPublic?: boolean;
        hasRecords?: boolean;
        dateRange?: {
            start: string;
            end: string;
        };
    };
}

export interface RecordSearchParams extends SearchOptions {
    query: string;
    databaseId?: string;
    filters?: {
        properties?: Record<string, any>;
        dateRange?: {
            start: string;
            end: string;
        };
        createdBy?: string;
    };
}

export interface SearchSuggestion {
    text: string;
    type: 'database' | 'record' | 'property' | 'user';
    count: number;
}

export interface SearchHistory {
    id: string;
    query: string;
    type: string;
    timestamp: string;
    resultCount: number;
}

export const searchApi = {
    // Global search across all content
    globalSearch: async (
        query: string,
        filters?: SearchFilters,
        options?: SearchOptions
    ): Promise<GlobalSearchResult> => {
        const response = await apiClient.get<ApiResponse<GlobalSearchResult>>(
            API_ENDPOINTS.SEARCH.GLOBAL,
            {
                params: {
                    q: query,
                    ...filters,
                    ...options,
                }
            }
        );
        return response.data.data;
    },

    // Search databases
    searchDatabases: async (params: DatabaseSearchParams): Promise<{
        databases: DatabaseSearchResult[];
        total: number;
        searchTime: number;
    }> => {
        const response = await apiClient.get<ApiResponse<{
            databases: DatabaseSearchResult[];
            total: number;
            searchTime: number;
        }>>(
            '/search/databases',
            { params }
        );
        return response.data.data;
    },

    // Search records within databases
    searchRecords: async (params: RecordSearchParams): Promise<{
        records: RecordSearchResult[];
        total: number;
        searchTime: number;
    }> => {
        const response = await apiClient.get<ApiResponse<{
            records: RecordSearchResult[];
            total: number;
            searchTime: number;
        }>>(
            '/search/records',
            { params }
        );
        return response.data.data;
    },

    // Get search suggestions
    getSearchSuggestions: async (
        query: string,
        type?: 'databases' | 'records' | 'all'
    ): Promise<SearchSuggestion[]> => {
        const response = await apiClient.get<ApiResponse<{ suggestions: SearchSuggestion[] }>>(
            '/search/suggestions',
            {
                params: {
                    q: query,
                    type,
                }
            }
        );
        return response.data.data.suggestions;
    },

    // Get search history
    getSearchHistory: async (params?: {
        limit?: number;
        type?: string;
    }): Promise<SearchHistory[]> => {
        const response = await apiClient.get<ApiResponse<{ history: SearchHistory[] }>>(
            '/search/history',
            { params }
        );
        return response.data.data.history;
    },

    // Clear search history
    clearSearchHistory: async (): Promise<void> => {
        await apiClient.delete('/search/history');
    },

    // Save search query
    saveSearch: async (data: {
        query: string;
        filters?: SearchFilters;
        name: string;
        description?: string;
    }): Promise<{ id: string }> => {
        const response = await apiClient.post<ApiResponse<{ id: string }>>(
            '/search/saved',
            data
        );
        return response.data.data;
    },

    // Get saved searches
    getSavedSearches: async (): Promise<Array<{
        id: string;
        name: string;
        description?: string;
        query: string;
        filters?: SearchFilters;
        createdAt: string;
        lastUsed?: string;
    }>> => {
        const response = await apiClient.get<ApiResponse<{
            searches: Array<{
                id: string;
                name: string;
                description?: string;
                query: string;
                filters?: SearchFilters;
                createdAt: string;
                lastUsed?: string;
            }>
        }>>(
            '/search/saved'
        );
        return response.data.data.searches;
    },

    // Delete saved search
    deleteSavedSearch: async (id: string): Promise<void> => {
        await apiClient.delete(`/search/saved/${id}`);
    },

    // Advanced search with complex queries
    advancedSearch: async (searchQuery: {
        query: string;
        filters: SearchFilters;
        options: SearchOptions;
        facets?: string[];
        aggregations?: Record<string, any>;
    }): Promise<{
        results: GlobalSearchResult;
        facets?: Record<string, any>;
        aggregations?: Record<string, any>;
    }> => {
        const response = await apiClient.post<ApiResponse<{
            results: GlobalSearchResult;
            facets?: Record<string, any>;
            aggregations?: Record<string, any>;
        }>>(
            '/search/advanced',
            searchQuery
        );
        return response.data.data;
    },
};
