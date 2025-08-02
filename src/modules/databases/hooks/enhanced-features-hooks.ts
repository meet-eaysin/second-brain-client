import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { databaseApi } from '../services/databaseApi';
import { categoryApi } from '../services/categoryApi';
import { DATABASE_KEYS } from '../services/databaseQueries';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api.types';

// Toggle favorite hook
export const useToggleFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (databaseId: string) => databaseApi.toggleFavorite(databaseId),
        onSuccess: (updatedDatabase) => {
            // Update the database in all relevant queries
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.all });
            queryClient.setQueryData(
                DATABASE_KEYS.detail(updatedDatabase.id),
                updatedDatabase
            );
            
            const message = updatedDatabase.isFavorite 
                ? 'Added to favorites' 
                : 'Removed from favorites';
            toast.success(message);
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to update favorite status';
            toast.error(message);
        },
    });
};

// Move to category hook
export const useMoveToCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ databaseId, categoryId }: { databaseId: string; categoryId: string | null }) =>
            databaseApi.moveToCategory(databaseId, categoryId),
        onSuccess: (updatedDatabase, { categoryId }) => {
            // Update the database in all relevant queries
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.all });
            queryClient.setQueryData(
                DATABASE_KEYS.detail(updatedDatabase.id),
                updatedDatabase
            );
            
            const message = categoryId 
                ? 'Database moved to category' 
                : 'Database removed from category';
            toast.success(message);
        },
        onError: (error: AxiosError<ApiResponse>) => {
            const message = error.response?.data?.message || 'Failed to move database';
            toast.error(message);
        },
    });
};

// Get categories hook (for category selection)
export const useCategories = () => {
    return {
        getCategories: async () => {
            try {
                return await categoryApi.getCategories();
            } catch (error) {
                console.error('Failed to load categories:', error);
                return [];
            }
        }
    };
};

// Bulk operations hooks
export const useBulkToggleFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (databaseIds: string[]) => {
            const results = await Promise.allSettled(
                databaseIds.map(id => databaseApi.toggleFavorite(id))
            );
            return results;
        },
        onSuccess: (results) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.all });
            
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            
            if (successful > 0) {
                toast.success(`Updated ${successful} database${successful > 1 ? 's' : ''}`);
            }
            if (failed > 0) {
                toast.error(`Failed to update ${failed} database${failed > 1 ? 's' : ''}`);
            }
        },
        onError: () => {
            toast.error('Failed to update databases');
        },
    });
};

export const useBulkMoveToCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ databaseIds, categoryId }: { databaseIds: string[]; categoryId: string | null }) => {
            const results = await Promise.allSettled(
                databaseIds.map(id => databaseApi.moveToCategory(id, categoryId))
            );
            return results;
        },
        onSuccess: (results, { categoryId }) => {
            queryClient.invalidateQueries({ queryKey: DATABASE_KEYS.all });
            
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            
            if (successful > 0) {
                const message = categoryId 
                    ? `Moved ${successful} database${successful > 1 ? 's' : ''} to category`
                    : `Removed ${successful} database${successful > 1 ? 's' : ''} from category`;
                toast.success(message);
            }
            if (failed > 0) {
                toast.error(`Failed to move ${failed} database${failed > 1 ? 's' : ''}`);
            }
        },
        onError: () => {
            toast.error('Failed to move databases');
        },
    });
};

// Access tracking hook (for analytics)
export const useTrackAccess = () => {
    return useMutation({
        mutationFn: async ({ databaseId, action }: { databaseId: string; action: 'view' | 'edit' | 'share' }) => {
            // This would typically send analytics data to a tracking service
            // For now, we'll just log it
            console.log(`Tracked access: ${action} on database ${databaseId}`);
            
            // In a real implementation, you might call an analytics API:
            // return analyticsApi.trackEvent('database_access', { databaseId, action });
        },
        onError: (error) => {
            // Silently fail for analytics - don't show user errors
            console.warn('Failed to track access:', error);
        },
    });
};

// Hook to get database statistics for sidebar
export const useDatabaseStats = () => {
    const queryClient = useQueryClient();
    
    return {
        getStats: () => {
            const databases = queryClient.getQueryData(DATABASE_KEYS.all) as any;
            
            if (!databases?.databases) {
                return {
                    total: 0,
                    favorites: 0,
                    recent: 0,
                    shared: 0,
                    public: 0,
                };
            }
            
            const dbList = databases.databases;
            
            return {
                total: dbList.length,
                favorites: dbList.filter((db: any) => db.isFavorite).length,
                recent: dbList.filter((db: any) => {
                    const updatedAt = new Date(db.updatedAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return updatedAt > weekAgo;
                }).length,
                shared: dbList.filter((db: any) => db.permissions?.length > 0).length,
                public: dbList.filter((db: any) => db.isPublic).length,
            };
        }
    };
};
