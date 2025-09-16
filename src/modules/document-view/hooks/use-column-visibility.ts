import { useQueryClient } from '@tanstack/react-query';
import { createStandardModuleApiService } from '../services/api-service.ts';

interface DocumentProperty {
    id: string;
    name: string;
    type: string;
    frozen?: boolean;
    required?: boolean;
}

interface DocumentView {
    id: string;
    name: string;
    visibleProperties?: string[];
    isDefault?: boolean;
}

interface UseColumnVisibilityProps {
    moduleType: string;
    properties: DocumentProperty[];
    currentView: DocumentView;
}

export function useColumnVisibility({
    moduleType,
    properties,
    currentView
}: UseColumnVisibilityProps) {
    const queryClient = useQueryClient();

    // Create API service for the module
    const apiService = createStandardModuleApiService(moduleType);

    // Invalidate relevant queries after view updates
    const invalidateQueries = () => {
        // Invalidate module-specific queries
        queryClient.invalidateQueries({ queryKey: [moduleType] });
        queryClient.invalidateQueries({ queryKey: ['second-brain'] });

        // Invalidate module-specific document-view queries
        if (moduleType === 'books') {
            queryClient.invalidateQueries({ queryKey: ['books-document-view-views'] });
            queryClient.invalidateQueries({ queryKey: ['books-document-view-config'] });
        } else if (moduleType === 'tasks') {
            queryClient.invalidateQueries({ queryKey: ['tasks-document-view-views'] });
            queryClient.invalidateQueries({ queryKey: ['tasks-document-view-config'] });
        } else if (moduleType === 'people') {
            queryClient.invalidateQueries({ queryKey: ['people-document-view'] });
            queryClient.invalidateQueries({ queryKey: ['people-views'] });
        }
    };

    // Toggle individual property visibility
    const toggleProperty = async (propertyId: string, visible: boolean): Promise<void> => {
        const currentVisible = currentView.visibleProperties || [];
        
        let updatedVisible: string[];
        if (visible) {
            // Add property to visible list
            updatedVisible = [...currentVisible, propertyId];
        } else {
            // Remove property from visible list
            updatedVisible = currentVisible.filter(id => id !== propertyId);
        }

        // Update view via API
        await apiService.updateView(currentView.id, {
            visibleProperties: updatedVisible
        });

        // Invalidate queries to refresh UI
        invalidateQueries();
    };

    // Show all properties
    const showAll = async (): Promise<void> => {
        const allPropertyIds = properties.map(prop => prop.id);
        
        await apiService.updateView(currentView.id, {
            visibleProperties: allPropertyIds
        });

        invalidateQueries();
    };

    // Hide all non-required/non-frozen properties
    const hideAll = async (): Promise<void> => {
        const requiredPropertyIds = properties
            .filter(prop => prop.frozen || prop.required)
            .map(prop => prop.id);
        
        await apiService.updateView(currentView.id, {
            visibleProperties: requiredPropertyIds
        });

        invalidateQueries();
    };

    // Reset to default view properties
    const resetToDefault = async (): Promise<void> => {
        // Get the default properties for this module
        const defaultProperties = properties
            .filter(prop => prop.frozen || prop.required || ['title', 'name', 'status'].includes(prop.id))
            .map(prop => prop.id);
        
        await apiService.updateView(currentView.id, {
            visibleProperties: defaultProperties
        });

        invalidateQueries();
    };

    // Get visibility statistics
    const getStats = () => {
        const visibleCount = currentView.visibleProperties?.length || 0;
        const totalCount = properties.length;
        const hiddenCount = totalCount - visibleCount;
        
        return {
            visible: visibleCount,
            hidden: hiddenCount,
            total: totalCount,
            percentage: totalCount > 0 ? Math.round((visibleCount / totalCount) * 100) : 0
        };
    };

    // Check if property can be hidden
    const canHideProperty = (property: DocumentProperty): boolean => {
        return !property.frozen && !property.required;
    };

    // Get properties by visibility status
    const getPropertiesByVisibility = () => {
        const visibleIds = currentView.visibleProperties || [];
        
        return {
            visible: properties.filter(prop => visibleIds.includes(prop.id)),
            hidden: properties.filter(prop => !visibleIds.includes(prop.id)),
            required: properties.filter(prop => prop.frozen || prop.required),
            optional: properties.filter(prop => !prop.frozen && !prop.required)
        };
    };

    return {
        // Actions
        toggleProperty,
        showAll,
        hideAll,
        resetToDefault,
        
        // Utilities
        canHideProperty,
        getStats,
        getPropertiesByVisibility,
        
        // State
        currentView,
        properties
    };
}
