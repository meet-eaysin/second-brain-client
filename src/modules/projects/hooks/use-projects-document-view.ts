import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsDocumentViewService } from '../services/projects-document-view.service';

// Query keys
export const PROJECTS_DOCUMENT_VIEW_QUERY_KEYS = {
    all: ['projects-database-view'] as const,
    views: () => [...PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.all, 'views'] as const,
    view: (id: string) => [...PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.views(), id] as const,
    database: () => [...PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.all, 'database'] as const,
    properties: () => [...PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.all, 'properties'] as const,
    records: () => [...PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.all, 'records'] as const,
    record: (id: string) => [...PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.records(), id] as const,
    config: () => [...PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.all, 'config'] as const,
    frozenConfig: () => [...PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.all, 'frozen-config'] as const,
};

// Hook for projects views
export function useProjectViewsQuery() {
    return useQuery({
        queryKey: PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.views(),
        queryFn: () => projectsDocumentViewService.getViews(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for default projects view
export function useDefaultProjectViewQuery() {
    const { data: views } = useProjectViewsQuery();
    
    return useQuery({
        queryKey: [...PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.views(), 'default'],
        queryFn: () => {
            const defaultView = views?.find(view => view.isDefault) || views?.[0];
            return Promise.resolve(defaultView);
        },
        enabled: !!views && views.length > 0,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for specific projects view
export function useProjectViewQuery(viewId: string) {
    return useQuery({
        queryKey: PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.view(viewId),
        queryFn: () => projectsDocumentViewService.getView(viewId),
        enabled: !!viewId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for projects view configuration
export function useProjectViewConfigQuery() {
    return useQuery({
        queryKey: PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.config(),
        queryFn: () => projectsDocumentViewService.getConfig(),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

// Hook for projects frozen configuration
export function useProjectFrozenConfigQuery() {
    return useQuery({
        queryKey: PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.frozenConfig(),
        queryFn: () => projectsDocumentViewService.getFrozenConfig(),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

// Hook for projects database
export function useProjectsQuery() {
    return useQuery({
        queryKey: PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.database(),
        queryFn: () => projectsDocumentViewService.getDatabase(),
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for projects records
export function useProjectRecordsQuery(filters?: Record<string, any>) {
    return useQuery({
        queryKey: [...PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.records(), filters],
        queryFn: () => projectsDocumentViewService.getRecords(filters),
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

// Hook for projects with view-based filtering and sorting
export function useProjectWithViewQuery(viewId: string, additionalFilters?: Record<string, any>) {
    return useQuery({
        queryKey: ['projects-database-view', 'projects-with-view', viewId, additionalFilters],
        queryFn: () => projectsDocumentViewService.getProjectWithFiltersAndSorts({
            viewId,
            filters: additionalFilters
        }),
        enabled: !!viewId,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function useProjectQuery(projectsId: string) {
    return useQuery({
        queryKey: PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.record(projectsId),
        queryFn: () => projectsDocumentViewService.getRecord(projectsId),
        enabled: !!projectsId,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
}

// Mutations
export function useUpdateProjectMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ projectsId, updates }: { projectsId: string; updates: Record<string, any> }) =>
            projectsDocumentViewService.updateRecord(projectsId, updates),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.record(variables.projectsId) });
            queryClient.invalidateQueries({ queryKey: ['projects-database-view', 'projects-with-view'] });
        },
    });
}

export function useDeleteProjectMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (projectsId: string) => projectsDocumentViewService.deleteRecord(projectsId),
        onSuccess: (data, projectsId) => {
            queryClient.removeQueries({ queryKey: PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.record(projectsId) });
            queryClient.invalidateQueries({ queryKey: PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: ['projects-database-view', 'projects-with-view'] });
        },
    });
}

export function useCreateProjectMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (projectsData: Record<string, any>) => projectsDocumentViewService.createRecord(projectsData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: ['projects-database-view', 'projects-with-view'] });
        },
    });
}