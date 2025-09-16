import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsDocumentViewService } from '../services/goals-document-view.service';

// Query keys
export const GOALS_DOCUMENT_VIEW_QUERY_KEYS = {
    all: ['goals-document-view'] as const,
    views: () => [...GOALS_DOCUMENT_VIEW_QUERY_KEYS.all, 'views'] as const,
    view: (id: string) => [...GOALS_DOCUMENT_VIEW_QUERY_KEYS.views(), id] as const,
    database: () => [...GOALS_DOCUMENT_VIEW_QUERY_KEYS.all, 'database'] as const,
    properties: () => [...GOALS_DOCUMENT_VIEW_QUERY_KEYS.all, 'properties'] as const,
    records: () => [...GOALS_DOCUMENT_VIEW_QUERY_KEYS.all, 'records'] as const,
    record: (id: string) => [...GOALS_DOCUMENT_VIEW_QUERY_KEYS.records(), id] as const,
    config: () => [...GOALS_DOCUMENT_VIEW_QUERY_KEYS.all, 'config'] as const,
    frozenConfig: () => [...GOALS_DOCUMENT_VIEW_QUERY_KEYS.all, 'frozen-config'] as const,
};

// Hook for goals views
export function useGoalViewsQuery() {
    return useQuery({
        queryKey: GOALS_DOCUMENT_VIEW_QUERY_KEYS.views(),
        queryFn: () => goalsDocumentViewService.getViews(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for default goals view
export function useDefaultGoalViewQuery() {
    const { data: views } = useGoalViewsQuery();
    
    return useQuery({
        queryKey: [...GOALS_DOCUMENT_VIEW_QUERY_KEYS.views(), 'default'],
        queryFn: () => {
            const defaultView = views?.find(view => view.isDefault) || views?.[0];
            return Promise.resolve(defaultView);
        },
        enabled: !!views && views.length > 0,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for specific goals view
export function useGoalViewQuery(viewId: string) {
    return useQuery({
        queryKey: GOALS_DOCUMENT_VIEW_QUERY_KEYS.view(viewId),
        queryFn: () => goalsDocumentViewService.getView(viewId),
        enabled: !!viewId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for goals view configuration
export function useGoalViewConfigQuery() {
    return useQuery({
        queryKey: GOALS_DOCUMENT_VIEW_QUERY_KEYS.config(),
        queryFn: () => goalsDocumentViewService.getConfig(),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

// Hook for goals frozen configuration
export function useGoalFrozenConfigQuery() {
    return useQuery({
        queryKey: GOALS_DOCUMENT_VIEW_QUERY_KEYS.frozenConfig(),
        queryFn: () => goalsDocumentViewService.getFrozenConfig(),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

// Hook for goals database
export function useGoalsQuery() {
    return useQuery({
        queryKey: GOALS_DOCUMENT_VIEW_QUERY_KEYS.database(),
        queryFn: () => goalsDocumentViewService.getDatabase(),
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for goals records
export function useGoalRecordsQuery(filters?: Record<string, any>) {
    return useQuery({
        queryKey: [...GOALS_DOCUMENT_VIEW_QUERY_KEYS.records(), filters],
        queryFn: () => goalsDocumentViewService.getRecords(filters),
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

// Hook for goals with view-based filtering and sorting
export function useGoalWithViewQuery(viewId: string, additionalFilters?: Record<string, any>) {
    return useQuery({
        queryKey: ['goals-document-view', 'goals-with-view', viewId, additionalFilters],
        queryFn: () => goalsDocumentViewService.getGoalWithFiltersAndSorts({
            viewId,
            filters: additionalFilters
        }),
        enabled: !!viewId,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// export function useGoalQuery(goalsId: string) {
//     return useQuery({
//         queryKey: GOALS_DOCUMENT_VIEW_QUERY_KEYS.record(goalsId),
//         queryFn: () => goalsDocumentViewService.getRecord(goalsId),
//         enabled: !!goalsId,
//         staleTime: 5 * 60 * 1000,
//         gcTime: 15 * 60 * 1000,
//     });
// }

// Mutations
export function useUpdateGoalMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ goalsId, updates }: { goalsId: string; updates: Record<string, any> }) =>
            goalsDocumentViewService.updateRecord(goalsId, updates),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: GOALS_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: GOALS_DOCUMENT_VIEW_QUERY_KEYS.record(variables.goalsId) });
            queryClient.invalidateQueries({ queryKey: ['goals-document-view', 'goals-with-view'] });
        },
    });
}

export function useDeleteGoalMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (goalsId: string) => goalsDocumentViewService.deleteRecord(goalsId),
        onSuccess: (data, goalsId) => {
            queryClient.removeQueries({ queryKey: GOALS_DOCUMENT_VIEW_QUERY_KEYS.record(goalsId) });
            queryClient.invalidateQueries({ queryKey: GOALS_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: ['goals-document-view', 'goals-with-view'] });
        },
    });
}

export function useCreateGoalMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (goalsData: Record<string, any>) => goalsDocumentViewService.createRecord(goalsData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: GOALS_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: ['goals-document-view', 'goals-with-view'] });
        },
    });
}