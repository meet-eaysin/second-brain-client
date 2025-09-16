import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { propertyVisibilityApi } from '../services/propertyVisibilityApi';
import { DATABASE_KEYS } from '../services/queryKeys';
import type { DatabaseProperty, DatabaseView } from '@/types/document.types.ts';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api.types';

// Hook to toggle global property visibility
export const useTogglePropertyVisibility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ 
            databaseId, 
            propertyId, 
            isVisible 
        }: { 
            databaseId: string; 
            propertyId: string; 
            isVisible: boolean; 
        }) =>
            propertyVisibilityApi.togglePropertyVisibility(databaseId, propertyId, isVisible),
        onSuccess: (updatedDatabase, { propertyId, isVisible }) => {
            // Invalidate database queries
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(updatedDatabase.id) });
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });
            
            // Show success toast
            toast.success(
                isVisible 
                    ? 'Property is now visible globally' 
                    : 'Property is now hidden globally'
            );
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to update property visibility';
            toast.error(message);
        },
    });
};

// Hook to update view visible properties
export const useUpdateViewVisibility = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ 
            databaseId, 
            viewId, 
            visibleProperties 
        }: { 
            databaseId: string; 
            viewId: string; 
            visibleProperties: string[]; 
        }) =>
            propertyVisibilityApi.updateViewVisibility(databaseId, viewId, visibleProperties),
        onSuccess: (updatedDatabase, { viewId }) => {
            // Invalidate database queries
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(updatedDatabase.id) });
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });
            
            toast.success('View column visibility updated');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to update view visibility';
            toast.error(message);
        },
    });
};

// Hook for bulk property operations
export const useBulkToggleProperties = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ 
            databaseId, 
            propertyUpdates 
        }: { 
            databaseId: string; 
            propertyUpdates: Array<{ propertyId: string; isVisible: boolean }>; 
        }) =>
            propertyVisibilityApi.bulkToggleProperties(databaseId, propertyUpdates),
        onSuccess: (updatedDatabase) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(updatedDatabase.id) });
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.lists() });
            
            toast.success('Property visibility updated');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to update properties';
            toast.error(message);
        },
    });
};

// Hook to show all properties in a view
export const useShowAllPropertiesInView = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, viewId }: { databaseId: string; viewId: string }) =>
            propertyVisibilityApi.showAllPropertiesInView(databaseId, viewId),
        onSuccess: (updatedDatabase) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(updatedDatabase.id) });
            toast.success('All properties are now visible in this view');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to show all properties';
            toast.error(message);
        },
    });
};

// Hook to hide non-required properties in a view
export const useHideNonRequiredProperties = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, viewId }: { databaseId: string; viewId: string }) =>
            propertyVisibilityApi.hideNonRequiredPropertiesInView(databaseId, viewId),
        onSuccess: (updatedDatabase) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.detail(updatedDatabase.id) });
            toast.success('Non-required properties are now hidden in this view');
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to hide properties';
            toast.error(message);
        },
    });
};

// Hook to get visibility statistics
export const useVisibilityStats = (databaseId: string) => {
    return useQuery({
        queryKey: [...DATABASE_KEYS.detail(databaseId), 'visibility-stats'],
        queryFn: () => propertyVisibilityApi.getVisibilityStats(databaseId),
        enabled: !!databaseId,
        staleTime: 30 * 1000, // 30 seconds
    });
};

// Helper hook to get property visibility state
export const usePropertyVisibilityState = (
    properties: DatabaseProperty[], 
    currentView?: DatabaseView
) => {
    const getVisibleProperties = () => {
        if (!currentView?.visibleProperties) {
            return properties.filter(prop => prop.isVisible !== false);
        }

        return properties.filter(prop =>
            prop.isVisible !== false &&
            currentView?.visibleProperties?.includes(prop.id)
        );
    };

    const getHiddenProperties = () => {
        const visibleProps = getVisibleProperties();
        return properties.filter(prop => !visibleProps.find(vp => vp.id === prop.id));
    };

    const getGloballyHiddenProperties = () => {
        return properties.filter(prop => prop.isVisible === false);
    };

    const getViewHiddenProperties = () => {
        if (!currentView?.visibleProperties) return [];

        return properties.filter(prop =>
            prop.isVisible !== false &&
            !currentView?.visibleProperties?.includes(prop.id)
        );
    };

    const isPropertyVisible = (propertyId: string) => {
        const property = properties.find(p => p.id === propertyId);
        if (!property || property.isVisible === false) return false;

        if (!currentView?.visibleProperties) return true;
        return currentView?.visibleProperties?.includes(propertyId) || false;
    };

    const isPropertyGloballyHidden = (propertyId: string) => {
        const property = properties.find(p => p.id === propertyId);
        return property?.isVisible === false;
    };

    const isPropertyViewHidden = (propertyId: string) => {
        const property = properties.find(p => p.id === propertyId);
        if (!property || property.isVisible === false) return false;

        if (!currentView?.visibleProperties) return false;
        return !currentView?.visibleProperties?.includes(propertyId);
    };

    return {
        visibleProperties: getVisibleProperties(),
        hiddenProperties: getHiddenProperties(),
        globallyHiddenProperties: getGloballyHiddenProperties(),
        viewHiddenProperties: getViewHiddenProperties(),
        isPropertyVisible,
        isPropertyGloballyHidden,
        isPropertyViewHidden,
        totalProperties: properties.length,
        visibleCount: getVisibleProperties().length,
        hiddenCount: getHiddenProperties().length,
    };
};
