import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesDocumentViewService } from '../services/notes-document-view.service';

// Query keys
export const NOTES_DOCUMENT_VIEW_QUERY_KEYS = {
    all: ['notes-database-view'] as const,
    views: () => [...NOTES_DOCUMENT_VIEW_QUERY_KEYS.all, 'views'] as const,
    view: (id: string) => [...NOTES_DOCUMENT_VIEW_QUERY_KEYS.views(), id] as const,
    database: () => [...NOTES_DOCUMENT_VIEW_QUERY_KEYS.all, 'database'] as const,
    properties: () => [...NOTES_DOCUMENT_VIEW_QUERY_KEYS.all, 'properties'] as const,
    records: () => [...NOTES_DOCUMENT_VIEW_QUERY_KEYS.all, 'records'] as const,
    record: (id: string) => [...NOTES_DOCUMENT_VIEW_QUERY_KEYS.records(), id] as const,
    config: () => [...NOTES_DOCUMENT_VIEW_QUERY_KEYS.all, 'config'] as const,
    frozenConfig: () => [...NOTES_DOCUMENT_VIEW_QUERY_KEYS.all, 'frozen-config'] as const,
};

// Hook for notes views
export function useNotesViewsQuery() {
    return useQuery({
        queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.views(),
        queryFn: () => notesDocumentViewService.getViews(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for default notes view
export function useDefaultNotesViewQuery() {
    const { data: views } = useNotesViewsQuery();
    
    return useQuery({
        queryKey: [...NOTES_DOCUMENT_VIEW_QUERY_KEYS.views(), 'default'],
        queryFn: () => {
            const defaultView = views?.find(view => view.isDefault) || views?.[0];
            return Promise.resolve(defaultView);
        },
        enabled: !!views && views.length > 0,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for specific notes view
export function useNotesViewQuery(viewId: string) {
    return useQuery({
        queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.view(viewId),
        queryFn: () => notesDocumentViewService.getView(viewId),
        enabled: !!viewId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for notes view configuration
export function useNotesViewConfigQuery() {
    return useQuery({
        queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.config(),
        queryFn: () => notesDocumentViewService.getConfig(),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

// Hook for notes frozen configuration
export function useNotesFrozenConfigQuery() {
    return useQuery({
        queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.frozenConfig(),
        queryFn: () => notesDocumentViewService.getFrozenConfig(),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

// Hook for notes database
export function useNotesQuery() {
    return useQuery({
        queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.database(),
        queryFn: () => notesDocumentViewService.getDatabase(),
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Hook for notes records
export function useNotesRecordsQuery(filters?: Record<string, any>) {
    return useQuery({
        queryKey: [...NOTES_DOCUMENT_VIEW_QUERY_KEYS.records(), filters],
        queryFn: () => notesDocumentViewService.getRecords(filters),
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

// Hook for notes with view-based filtering and sorting
export function useNotesWithViewQuery(viewId: string, additionalFilters?: Record<string, any>) {
    return useQuery({
        queryKey: ['notes-database-view', 'notes-with-view', viewId, additionalFilters],
        queryFn: () => notesDocumentViewService.getNotesWithFiltersAndSorts({
            viewId,
            filters: additionalFilters
        }),
        enabled: !!viewId,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function useNoteQuery(noteId: string) {
    return useQuery({
        queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.record(noteId),
        queryFn: () => notesDocumentViewService.getRecord(noteId),
        enabled: !!noteId,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
}

// Mutations
export function useUpdateNoteMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ noteId, updates }: { noteId: string; updates: Record<string, any> }) =>
            notesDocumentViewService.updateRecord(noteId, updates),
        onSuccess: (data, variables) => {
            // Invalidate and refetch notes queries
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.record(variables.noteId) });
            queryClient.invalidateQueries({ queryKey: ['notes-database-view', 'notes-with-view'] });
        },
    });
}

export function useDeleteNoteMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (noteId: string) => notesDocumentViewService.deleteRecord(noteId),
        onSuccess: (data, noteId) => {
            // Remove the deleted note from cache
            queryClient.removeQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.record(noteId) });
            // Invalidate notes list queries
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: ['notes-database-view', 'notes-with-view'] });
        },
    });
}

export function useCreateNoteMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (noteData: Record<string, any>) => notesDocumentViewService.createRecord(noteData),
        onSuccess: () => {
            // Invalidate notes queries to refetch the list
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.records() });
            queryClient.invalidateQueries({ queryKey: ['notes-database-view', 'notes-with-view'] });
        },
    });
}

// View management mutations
export function useCreateNotesViewMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (viewData: any) => notesDocumentViewService.createView(viewData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.views() });
        },
    });
}

export function useUpdateNotesViewMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ viewId, updates }: { viewId: string; updates: any }) =>
            notesDocumentViewService.updateView(viewId, updates),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.views() });
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.view(variables.viewId) });
        },
    });
}

export function useDeleteNotesViewMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (viewId: string) => notesDocumentViewService.deleteView(viewId),
        onSuccess: (data, viewId) => {
            queryClient.removeQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.view(viewId) });
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.views() });
        },
    });
}

// Property management mutations
export function useCreateNotesPropertyMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (propertyData: any) => notesDocumentViewService.createProperty(propertyData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.properties() });
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.database() });
        },
    });
}

export function useUpdateNotesPropertyMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ propertyId, updates }: { propertyId: string; updates: any }) =>
            notesDocumentViewService.updateProperty(propertyId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.properties() });
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.database() });
        },
    });
}

export function useDeleteNotesPropertyMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (propertyId: string) => notesDocumentViewService.deleteProperty(propertyId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.properties() });
            queryClient.invalidateQueries({ queryKey: NOTES_DOCUMENT_VIEW_QUERY_KEYS.database() });
        },
    });
}
