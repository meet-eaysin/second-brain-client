/**
 * People Document View Hooks
 * 
 * React Query hooks for people (CRM) document view operations.
 * Provides a specialized interface for people management.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { peopleDocumentViewService, type PeopleViewConfig, type PersonRecord } from '../services/people-document-view.service';
import type { DocumentView } from '@/modules/document-view';

// Query Keys
export const PEOPLE_DOCUMENT_VIEW_QUERY_KEYS = {
    config: () => ['people-document-view', 'config'] as const,
    defaultProperties: () => ['people-document-view', 'default-properties'] as const,
    defaultViews: () => ['people-document-view', 'default-views'] as const,
    frozenConfig: () => ['people-document-view', 'frozen-config'] as const,
    views: () => ['people-document-view', 'views'] as const,
    view: (viewId: string) => ['people-document-view', 'views', viewId] as const,
    defaultView: () => ['people-document-view', 'views', 'default'] as const,
    people: (filters?: any, sorts?: any) => ['people-document-view', 'people', { filters, sorts }] as const,
    person: (personId: string) => ['people-document-view', 'people', personId] as const,
};

// Query Hooks
export function usePeopleViewConfigQuery() {
    return useQuery({
        queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.config(),
        queryFn: () => peopleDocumentViewService.getPeopleViewConfig(),
        staleTime: 10 * 60 * 1000, // 10 minutes - config doesn't change often
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
}

// Hook to get frozen configuration from API
export function usePeopleFrozenConfigQuery() {
    const { data: config } = usePeopleViewConfigQuery();

    return {
        frozenConfig: config?.frozenConfig || null,
        isLoading: !config,
        error: null
    };
}

// New hooks for dynamic configuration endpoints
export function useDefaultPeoplePropertiesQuery() {
    return useQuery({
        queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.defaultProperties(),
        queryFn: () => peopleDocumentViewService.getDefaultPeopleProperties(),
        staleTime: 15 * 60 * 1000, // 15 minutes - default properties rarely change
        gcTime: 60 * 60 * 1000, // 1 hour
    });
}

export function useDefaultPeopleViewsQuery() {
    return useQuery({
        queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.defaultViews(),
        queryFn: () => peopleDocumentViewService.getDefaultPeopleViews(),
        staleTime: 15 * 60 * 1000, // 15 minutes - default views rarely change
        gcTime: 60 * 60 * 1000, // 1 hour
    });
}

export function usePeopleFrozenConfigDirectQuery() {
    return useQuery({
        queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.frozenConfig(),
        queryFn: () => peopleDocumentViewService.getPeopleFrozenConfig(),
        staleTime: 30 * 60 * 1000, // 30 minutes - frozen config very rarely changes
        gcTime: 2 * 60 * 60 * 1000, // 2 hours
    });
}

export function usePeopleViewsQuery() {
    return useQuery({
        queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.views(),
        queryFn: () => peopleDocumentViewService.getUserPeopleViews(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
    });
}

export function usePeopleViewQuery(viewId: string) {
    return useQuery({
        queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.view(viewId),
        queryFn: () => peopleDocumentViewService.getPeopleView(viewId),
        enabled: !!viewId,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
}

export function useDefaultPeopleViewQuery() {
    return useQuery({
        queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.defaultView(),
        queryFn: () => peopleDocumentViewService.getDefaultPeopleView(),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}

export function usePeopleQuery(filters?: any, sorts?: any, pagination?: any, viewId?: string) {
    return useQuery({
        queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.people(filters, sorts),
        queryFn: () => peopleDocumentViewService.getPeople(filters, sorts, pagination, viewId),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

// Enhanced hook for people with filters and sorts
export function usePeopleWithFiltersAndSortsQuery(options: {
    filters?: Record<string, any>;
    sorts?: Array<{ propertyId: string; direction: 'asc' | 'desc'; order?: number }>;
    pagination?: { page?: number; limit?: number };
    viewId?: string;
    search?: string;
    relationship?: string[];
    tags?: string[];
    company?: string;
    needsContact?: boolean;
    status?: string[];
    enabled?: boolean;
} = {}) {
    const { enabled = true, ...queryOptions } = options;

    return useQuery({
        queryKey: ['people-document-view', 'people-enhanced', queryOptions],
        queryFn: () => peopleDocumentViewService.getPeopleWithFiltersAndSorts(queryOptions),
        enabled,
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

// Hook for people with view-based filtering and sorting
export function usePeopleWithViewQuery(viewId: string, additionalFilters?: Record<string, any>) {
    return useQuery({
        queryKey: ['people-document-view', 'people-with-view', viewId, additionalFilters],
        queryFn: () => peopleDocumentViewService.getPeopleWithFiltersAndSorts({
            viewId,
            filters: additionalFilters
        }),
        enabled: !!viewId,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function usePersonQuery(personId: string) {
    return useQuery({
        queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.person(personId),
        queryFn: () => peopleDocumentViewService.getPerson(personId),
        enabled: !!personId,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
}

// CRM-specific query hooks
export function usePeopleWithCRMFiltersQuery(options: {
    status?: string[];
    relationship?: string[];
    tags?: string[];
    company?: string;
    needsContact?: boolean;
    search?: string;
    page?: number;
    limit?: number;
} = {}) {
    return useQuery({
        queryKey: ['people-document-view', 'people-crm', options],
        queryFn: () => peopleDocumentViewService.getPeopleWithCRMFilters(options),
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function usePeopleNeedingContactQuery() {
    return useQuery({
        queryKey: ['people-document-view', 'people-needing-contact'],
        queryFn: () => peopleDocumentViewService.getPeopleNeedingContact(),
        staleTime: 1 * 60 * 1000, // 1 minute - more frequent updates for urgent contacts
        gcTime: 5 * 60 * 1000,
    });
}

export function usePeopleByStatusQuery(status: string) {
    return useQuery({
        queryKey: ['people-document-view', 'people-by-status', status],
        queryFn: () => peopleDocumentViewService.getPeopleByStatus(status),
        enabled: !!status,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

export function usePeopleByRelationshipQuery(relationship: string) {
    return useQuery({
        queryKey: ['people-document-view', 'people-by-relationship', relationship],
        queryFn: () => peopleDocumentViewService.getPeopleByRelationship(relationship),
        enabled: !!relationship,
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

// Mutation Hooks
export function useCreatePeopleViewMutation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (viewData: Partial<DocumentView>) => 
            peopleDocumentViewService.createPeopleView(viewData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.views() });
        },
    });
}

export function useUpdatePeopleViewMutation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ viewId, updates }: { viewId: string; updates: Partial<DocumentView> }) => 
            peopleDocumentViewService.updatePeopleView(viewId, updates),
        onSuccess: (_, { viewId }) => {
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.view(viewId) });
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.views() });
        },
    });
}

export function useDeletePeopleViewMutation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (viewId: string) => peopleDocumentViewService.deletePeopleView(viewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.views() });
        },
    });
}

export function useDuplicatePeopleViewMutation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ viewId, newName }: { viewId: string; newName?: string }) => 
            peopleDocumentViewService.duplicatePeopleView(viewId, newName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.views() });
        },
    });
}

export function useUpdatePeopleViewPropertiesMutation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ viewId, properties }: { 
            viewId: string; 
            properties: Array<{
                propertyId: string;
                order: number;
                width?: number;
                visible?: boolean;
                frozen?: boolean;
                displayConfig?: any;
            }>
        }) => peopleDocumentViewService.updatePeopleViewProperties(viewId, properties),
        onSuccess: (_, { viewId }) => {
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.view(viewId) });
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.views() });
        },
    });
}

export function useUpdatePeopleViewFiltersMutation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ viewId, filters }: { viewId: string; filters: any[] }) => 
            peopleDocumentViewService.updatePeopleViewFilters(viewId, filters),
        onSuccess: (_, { viewId }) => {
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.view(viewId) });

            // Invalidate ALL people queries
            queryClient.invalidateQueries({
                queryKey: ['people-document-view', 'people'],
                exact: false
            });

            // Also invalidate the enhanced people queries
            queryClient.invalidateQueries({
                queryKey: ['people-document-view', 'people-enhanced'],
                exact: false
            });
        },
    });
}

export function useUpdatePeopleViewSortsMutation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ viewId, sorts }: { viewId: string; sorts: any[] }) => 
            peopleDocumentViewService.updatePeopleViewSorts(viewId, sorts),
        onSuccess: (_, { viewId }) => {
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.view(viewId) });

            // Invalidate ALL people queries
            queryClient.invalidateQueries({
                queryKey: ['people-document-view', 'people'],
                exact: false
            });

            // Also invalidate the enhanced people queries
            queryClient.invalidateQueries({
                queryKey: ['people-document-view', 'people-enhanced'],
                exact: false
            });
        },
    });
}

export function useCreatePersonMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (personData: Partial<PersonRecord>) =>
            peopleDocumentViewService.createPerson(personData),
        onSuccess: () => {
            // Invalidate ALL people queries
            queryClient.invalidateQueries({
                queryKey: ['people-document-view', 'people'],
                exact: false
            });

            // Also invalidate the enhanced people queries
            queryClient.invalidateQueries({
                queryKey: ['people-document-view', 'people-enhanced'],
                exact: false
            });
        },
    });
}

export function useUpdatePersonMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ personId, updates }: { personId: string; updates: Partial<PersonRecord> }) =>
            peopleDocumentViewService.updatePerson(personId, updates),
        onSuccess: (updatedPerson, { personId }) => {
            console.log('✅ Person update successful:', { personId, updatedPerson });

            // Invalidate the specific person query
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.person(personId) });

            // Invalidate ALL people-related queries with comprehensive patterns
            queryClient.invalidateQueries({
                queryKey: ['people-document-view'],
                exact: false
            });

            // Force refetch of all people queries
            queryClient.refetchQueries({
                queryKey: ['people-document-view', 'people'],
                exact: false
            });

            queryClient.refetchQueries({
                queryKey: ['people-document-view', 'people-enhanced'],
                exact: false
            });

            console.log('✅ All people queries invalidated and refetched');
        },
        onError: (error) => {
            console.error('❌ Failed to update person:', error);
        },
    });
}

export function useDeletePersonMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (personId: string) => peopleDocumentViewService.deletePerson(personId),
        onSuccess: (_, personId) => {
            // Remove the specific person from cache
            queryClient.removeQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.person(personId) });

            // Invalidate ALL people queries
            queryClient.invalidateQueries({
                queryKey: ['people-document-view', 'people'],
                exact: false
            });

            // Also invalidate the enhanced people queries
            queryClient.invalidateQueries({
                queryKey: ['people-document-view', 'people-enhanced'],
                exact: false
            });
        },
    });
}

// Property Management Mutations
export function useAddPeoplePropertyMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ viewId, property }: {
            viewId: string;
            property: {
                name: string;
                type: string;
                description?: string;
                required?: boolean;
                order?: number;
                selectOptions?: Array<{ name: string; color: string }>;
            }
        }) => peopleDocumentViewService.addPeopleProperty(viewId, property),
        onSuccess: (updatedView, { viewId }) => {
            console.log('✅ Property added successfully to existing view:', {
                viewId,
                viewName: updatedView?.name,
                customProperties: updatedView?.customProperties
            });

            // Invalidate all people-related queries to refresh the UI
            queryClient.invalidateQueries({
                queryKey: ['people-document-view'],
                exact: false
            });

            // Specifically invalidate views and properties
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.views() });
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.view(viewId) });
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.defaultProperties() });

            console.log('✅ All people queries invalidated - property should now appear in table');
        },
        onError: (error) => {
            console.error('❌ Failed to add property:', error);
        },
    });
}

// Update custom property mutation
export const useUpdatePeopleCustomPropertyMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ viewId, propertyId, updates }: { viewId: string; propertyId: string; updates: any }) => {
            const response = await fetch(`/api/v1/document-views/people/views/${viewId}/properties/${propertyId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to update custom property');
            }

            return response.json();
        },
        onSuccess: (updatedView, { viewId, propertyId }) => {
            console.log('✅ Custom property updated successfully:', {
                viewId,
                propertyId,
                updatedView
            });

            // Invalidate all people-related queries to refresh the UI
            queryClient.invalidateQueries({
                queryKey: ['people-document-view'],
                exact: false
            });

            // Specifically invalidate views and properties
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.views() });
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.view(viewId) });

            console.log('✅ All people queries invalidated after custom property update');
        },
        onError: (error) => {
            console.error('❌ Failed to update custom property:', error);
        }
    });
};

// Delete custom property mutation
export const useDeletePeopleCustomPropertyMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ viewId, propertyId }: { viewId: string; propertyId: string }) => {
            const response = await fetch(`/api/v1/document-views/people/views/${viewId}/properties/${propertyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to delete custom property');
            }

            return response.json();
        },
        onSuccess: (updatedView, { viewId, propertyId }) => {
            console.log('✅ Custom property deleted successfully:', {
                viewId,
                propertyId,
                updatedView
            });

            // Invalidate all people-related queries to refresh the UI
            queryClient.invalidateQueries({
                queryKey: ['people-document-view'],
                exact: false
            });

            // Specifically invalidate views and properties
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.views() });
            queryClient.invalidateQueries({ queryKey: PEOPLE_DOCUMENT_VIEW_QUERY_KEYS.view(viewId) });

            console.log('✅ All people queries invalidated after custom property deletion');
        },
        onError: (error) => {
            console.error('❌ Failed to delete custom property:', error);
        }
    });
};
