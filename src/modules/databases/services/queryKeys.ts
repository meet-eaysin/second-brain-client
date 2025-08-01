export const DATABASE_KEYS = {
    all: ['databases'] as const,
    lists: () => [...DATABASE_KEYS.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...DATABASE_KEYS.lists(), filters] as const,
    details: () => [...DATABASE_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...DATABASE_KEYS.details(), id] as const,
    records: (databaseId: string) => [...DATABASE_KEYS.detail(databaseId), 'records'] as const,
    recordsList: (databaseId: string, filters: Record<string, any>) => 
        [...DATABASE_KEYS.records(databaseId), filters] as const,
};
