import { useQuery } from '@tanstack/react-query';
import { databaseApi } from '../services/databaseApi';
import { DATABASE_KEYS } from '../services/queryKeys';

export const useDatabaseById = (databaseId: string) => {
    return useQuery({
        queryKey: DATABASE_KEYS.detail(databaseId),
        queryFn: () => databaseApi.getDatabase(databaseId),
        enabled: !!databaseId,
    });
};

export const useDatabases = (filters?: Record<string, any>) => {
    return useQuery({
        queryKey: DATABASE_KEYS.list(filters || {}),
        queryFn: () => databaseApi.getDatabases(filters || {}),
    });
};
