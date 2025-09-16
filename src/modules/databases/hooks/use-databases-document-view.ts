import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databasesDocumentViewService } from '../services/databases-document-view.service';

// Query keys
export const DATABASES_DOCUMENT_VIEW_QUERY_KEYS = {
    all: ['databases-document-view'] as const,
    views: () => [...DATABASES_DOCUMENT_VIEW_QUERY_KEYS.all, 'views'] as const,
    view: (id: string) => [...DATABASES_DOCUMENT_VIEW_QUERY_KEYS.views(), id] as const,
    database: () => [...DATABASES_DOCUMENT_VIEW_QUERY_KEYS.all, 'database'] as const,
    properties: () => [...DATABASES_DOCUMENT_VIEW_QUERY_KEYS.all, 'properties'] as const,
    records: () => [...DATABASES_DOCUMENT_VIEW_QUERY_KEYS.all, 'records'] as const,
    record: (id: string) => [...DATABASES_DOCUMENT_VIEW_QUERY_KEYS.records(), id] as const,
    config: () => [...DATABASES_DOCUMENT_VIEW_QUERY_KEYS.all, 'config'] as const,
    frozenConfig: () => [...DATABASES_DOCUMENT_VIEW_QUERY_KEYS.all, 'frozen-config'] as const,
};

// Hook for databases views
export function useDatabasesViewsQuery() {
    return useQuery({
        queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.views(),
        queryFn: () => databasesDocumentViewService.getViews(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for default databases view
export function useDefaultDatabasesViewQuery() {
    const { data: views } = useDatabasesViewsQuery();
    
    return useQuery({
        queryKey: [...DATABASES_DOCUMENT_VIEW_QUERY_KEYS.views(), 'default'],
        queryFn: () => {
            const defaultView = views?.find(view => view.isDefault) || views?.[0];
            return Promise.resolve(defaultView);
        },
        enabled: !!views && views.length > 0,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for specific databases view
export function useDatabasesViewQuery(viewId: string) {
    return useQuery({
        queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.view(viewId),
        queryFn: () => databasesDocumentViewService.getView(viewId),
        enabled: !!viewId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for databases view configuration
export function useDatabasesViewConfigQuery() {
    return useQuery({
        queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.config(),
        queryFn: () => databasesDocumentViewService.getConfig(),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

// Hook for databases frozen configuration
export function useDatabasesFrozenConfigQuery() {
    return useQuery({
        queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.frozenConfig(),
        queryFn: () => databasesDocumentViewService.getFrozenConfig(),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

// Hook for databases database
export function useDatabasesQuery() {
    return useQuery({
        queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.database(),
        queryFn: () => databasesDocumentViewService.getDatabase(),
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for databases records
export function useDatabasesRecordsQuery(filters?: Record<string, any>) {
    return useQuery({
        queryKey: [...DATABASES_DOCUMENT_VIEW_QUERY_KEYS.records(), filters],
        queryFn: () => databasesDocumentViewService.getRecords(filters),
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

// Hook for databases with view-based filtering and sorting
export function useDatabasesWithViewQuery(viewId: string, additionalFilters?: Record<string, any>) {
    return useQuery({
        queryKey: ['databases-document-view', 'databases-with-view', viewId, additionalFilters],
        queryFn: () => databasesDocumentViewService.getDatabasesWithFiltersAndSorts({
            viewId,
            filters: additionalFilters
        }),
        enabled: !!viewId,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function useDatabaseQuery(databaseId: string) {
    return useQuery({
        queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.record(databaseId),
        queryFn: () => databasesDocumentViewService.getRecord(databaseId),
        enabled: !!databaseId,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
}

// Mutations
export function useUpdateDatabaseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, updates }: { databaseId: string; updates: Record<string, any> }) =>
            databasesDocumentViewService.updateRecord(databaseId, updates),
        onSuccess: (data, variables) => {
            // Invalidate and refetch databases queries
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.record(variables.databaseId) });
            queryClient.invalidateQueries({ queryKey: ['databases-document-view', 'databases-with-view'] });
        },
    });
}

export function useDeleteDatabaseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (databaseId: string) => databasesDocumentViewService.deleteRecord(databaseId),
        onSuccess: (data, databaseId) => {
            // Remove the deleted database from cache
            queryClient.removeQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.record(databaseId) });
            // Invalidate databases list queries
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: ['databases-document-view', 'databases-with-view'] });
        },
    });
}

export function useCreateDatabaseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (databaseData: Record<string, any>) => databasesDocumentViewService.createRecord(databaseData),
        onSuccess: () => {
            // Invalidate databases queries to refetch the list
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: ['databases-document-view', 'databases-with-view'] });
        },
    });
}

// View management mutations
export function useCreateDatabasesViewMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (viewData: any) => databasesDocumentViewService.createView(viewData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.views() });
        },
    });
}

export function useUpdateDatabasesViewMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ viewId, updates }: { viewId: string; updates: any }) =>
            databasesDocumentViewService.updateView(viewId, updates),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.views() });
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.view(variables.viewId) });
        },
    });
}

export function useDeleteDatabasesViewMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (viewId: string) => databasesDocumentViewService.deleteView(viewId),
        onSuccess: (data, viewId) => {
            queryClient.removeQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.view(viewId) });
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.views() });
        },
    });
}

// Property management mutations
export function useCreateDatabasesPropertyMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (propertyData: any) => databasesDocumentViewService.createProperty(propertyData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.properties() });
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.database() });
        },
    });
}

export function useUpdateDatabasesPropertyMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ propertyId, updates }: { propertyId: string; updates: any }) =>
            databasesDocumentViewService.updateProperty(propertyId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.properties() });
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.database() });
        },
    });
}

export function useDeleteDatabasesPropertyMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (propertyId: string) => databasesDocumentViewService.deleteProperty(propertyId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.properties() });
            queryClient.invalidateQueries({ queryKey: DATABASES_DOCUMENT_VIEW_QUERY_KEYS.database() });
        },
    });
}
