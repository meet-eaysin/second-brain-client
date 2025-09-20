import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitsDocumentViewService } from '../services/habits-document-view.service';

// Query keys
export const HABITS_DOCUMENT_VIEW_QUERY_KEYS = {
    all: ['habits-database-view'] as const,
    views: () => [...HABITS_DOCUMENT_VIEW_QUERY_KEYS.all, 'views'] as const,
    view: (id: string) => [...HABITS_DOCUMENT_VIEW_QUERY_KEYS.views(), id] as const,
    database: () => [...HABITS_DOCUMENT_VIEW_QUERY_KEYS.all, 'database'] as const,
    properties: () => [...HABITS_DOCUMENT_VIEW_QUERY_KEYS.all, 'properties'] as const,
    records: () => [...HABITS_DOCUMENT_VIEW_QUERY_KEYS.all, 'records'] as const,
    record: (id: string) => [...HABITS_DOCUMENT_VIEW_QUERY_KEYS.records(), id] as const,
    config: () => [...HABITS_DOCUMENT_VIEW_QUERY_KEYS.all, 'config'] as const,
    frozenConfig: () => [...HABITS_DOCUMENT_VIEW_QUERY_KEYS.all, 'frozen-config'] as const,
};

// Hook for habits views
export function useHabitViewsQuery() {
    return useQuery({
        queryKey: HABITS_DOCUMENT_VIEW_QUERY_KEYS.views(),
        queryFn: () => habitsDocumentViewService.getViews(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for default habits view
export function useDefaultHabitViewQuery() {
    const { data: views } = useHabitViewsQuery();
    
    return useQuery({
        queryKey: [...HABITS_DOCUMENT_VIEW_QUERY_KEYS.views(), 'default'],
        queryFn: () => {
            const defaultView = views?.find(view => view.isDefault) || views?.[0];
            return Promise.resolve(defaultView);
        },
        enabled: !!views && views.length > 0,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for specific habits view
export function useHabitViewQuery(viewId: string) {
    return useQuery({
        queryKey: HABITS_DOCUMENT_VIEW_QUERY_KEYS.view(viewId),
        queryFn: () => habitsDocumentViewService.getView(viewId),
        enabled: !!viewId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for habits view configuration
export function useHabitViewConfigQuery() {
    return useQuery({
        queryKey: HABITS_DOCUMENT_VIEW_QUERY_KEYS.config(),
        queryFn: () => habitsDocumentViewService.getConfig(),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

// Hook for habits frozen configuration
export function useHabitFrozenConfigQuery() {
    return useQuery({
        queryKey: HABITS_DOCUMENT_VIEW_QUERY_KEYS.frozenConfig(),
        queryFn: () => habitsDocumentViewService.getFrozenConfig(),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

// Hook for habits database
export function useHabitsQuery() {
    return useQuery({
        queryKey: HABITS_DOCUMENT_VIEW_QUERY_KEYS.database(),
        queryFn: () => habitsDocumentViewService.getDatabase(),
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for habits records
export function useHabitRecordsQuery(filters?: Record<string, any>) {
    return useQuery({
        queryKey: [...HABITS_DOCUMENT_VIEW_QUERY_KEYS.records(), filters],
        queryFn: () => habitsDocumentViewService.getRecords(filters),
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

// Hook for habits with view-based filtering and sorting
export function useHabitWithViewQuery(viewId: string, additionalFilters?: Record<string, any>) {
    return useQuery({
        queryKey: ['habits-database-view', 'habits-with-view', viewId, additionalFilters],
        queryFn: () => habitsDocumentViewService.getHabitWithFiltersAndSorts({
            viewId,
            filters: additionalFilters
        }),
        enabled: !!viewId,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function useHabitQuery(habitsId: string) {
    return useQuery({
        queryKey: HABITS_DOCUMENT_VIEW_QUERY_KEYS.record(habitsId),
        queryFn: () => habitsDocumentViewService.getRecord(habitsId),
        enabled: !!habitsId,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
}

// Mutations
export function useUpdateHabitMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ habitsId, updates }: { habitsId: string; updates: Record<string, any> }) =>
            habitsDocumentViewService.updateRecord(habitsId, updates),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: HABITS_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: HABITS_DOCUMENT_VIEW_QUERY_KEYS.record(variables.habitsId) });
            queryClient.invalidateQueries({ queryKey: ['habits-database-view', 'habits-with-view'] });
        },
    });
}

export function useDeleteHabitMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (habitsId: string) => habitsDocumentViewService.deleteRecord(habitsId),
        onSuccess: (data, habitsId) => {
            queryClient.removeQueries({ queryKey: HABITS_DOCUMENT_VIEW_QUERY_KEYS.record(habitsId) });
            queryClient.invalidateQueries({ queryKey: HABITS_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: ['habits-database-view', 'habits-with-view'] });
        },
    });
}

export function useCreateHabitMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (habitsData: Record<string, any>) => habitsDocumentViewService.createRecord(habitsData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: HABITS_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: ['habits-database-view', 'habits-with-view'] });
        },
    });
}