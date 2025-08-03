import { databaseApi } from '@/modules/databases/services/databaseApi';
import { secondBrainApi } from '@/modules/second-brain/services/second-brain-api';
import type { DatabaseRecord, CreateRecordRequest, UpdateRecordRequest } from '@/types/database.types';
import type { Task, Project, Note, Person, Goal } from '@/types/second-brain.types';

// Universal data types
export type UniversalRecord = DatabaseRecord | Task | Project | Note | Person | Goal;
export type UniversalDataType = 'database' | 'tasks' | 'projects' | 'notes' | 'people' | 'goals' | 'habits' | 'journal' | 'books' | 'content' | 'finances' | 'mood';

export interface UniversalDataServiceConfig {
    dataType: UniversalDataType;
    databaseId?: string; // For database records
    apiEndpoint?: string; // For second-brain data
}

export interface UniversalCRUDOperations<T = UniversalRecord> {
    getAll: (params?: any) => Promise<{ data: T[]; total?: number }>;
    getById: (id: string) => Promise<T>;
    create: (data: any) => Promise<T>;
    update: (id: string, data: any) => Promise<T>;
    delete: (id: string) => Promise<void>;
    bulkUpdate?: (ids: string[], data: any) => Promise<void>;
    bulkDelete?: (ids: string[]) => Promise<void>;
}

class UniversalDataService {
    private config: UniversalDataServiceConfig;

    constructor(config: UniversalDataServiceConfig) {
        this.config = config;
    }

    /**
     * Get the appropriate API service based on data type
     */
    private getApiService(): UniversalCRUDOperations {
        const { dataType, databaseId } = this.config;

        if (dataType === 'database' && databaseId) {
            return {
                getAll: (params) => databaseApi.getRecords(databaseId, params),
                getById: (id) => databaseApi.getRecordById(databaseId, id),
                create: (data) => databaseApi.createRecord(databaseId, data),
                update: (id, data) => databaseApi.updateRecord(databaseId, id, data),
                delete: (id) => databaseApi.deleteRecord(databaseId, id),
                bulkUpdate: async (ids, data) => {
                    await Promise.all(ids.map(id => databaseApi.updateRecord(databaseId, id, data)));
                },
                bulkDelete: async (ids) => {
                    await Promise.all(ids.map(id => databaseApi.deleteRecord(databaseId, id)));
                }
            };
        }

        // Second-brain data services
        switch (dataType) {
            case 'tasks':
                return {
                    getAll: (params) => secondBrainApi.tasks.getAll(params).then(res => ({ data: res.data?.tasks || [], total: res.data?.tasks?.length })),
                    getById: (id) => secondBrainApi.tasks.getById(id),
                    create: (data) => secondBrainApi.tasks.create(data),
                    update: (id, data) => secondBrainApi.tasks.update(id, data),
                    delete: (id) => secondBrainApi.tasks.delete(id),
                    bulkUpdate: (ids, data) => secondBrainApi.tasks.bulkUpdate(ids, data),
                };

            case 'projects':
                return {
                    getAll: (params) => secondBrainApi.projects.getAll(params).then(res => ({ data: res.data?.projects || [], total: res.data?.projects?.length })),
                    getById: (id) => secondBrainApi.projects.getById(id),
                    create: (data) => secondBrainApi.projects.create(data),
                    update: (id, data) => secondBrainApi.projects.update(id, data),
                    delete: (id) => secondBrainApi.projects.delete(id),
                };

            case 'notes':
                return {
                    getAll: (params) => secondBrainApi.notes.getAll(params).then(res => ({ data: res.data?.notes || [], total: res.data?.notes?.length })),
                    getById: (id) => secondBrainApi.notes.getById(id),
                    create: (data) => secondBrainApi.notes.create(data),
                    update: (id, data) => secondBrainApi.notes.update(id, data),
                    delete: (id) => secondBrainApi.notes.delete(id),
                };

            case 'people':
                return {
                    getAll: (params) => secondBrainApi.people.getAll(params).then(res => ({ data: res.data?.people || [], total: res.data?.people?.length })),
                    getById: (id) => secondBrainApi.people.getById(id),
                    create: (data) => secondBrainApi.people.create(data),
                    update: (id, data) => secondBrainApi.people.update(id, data),
                    delete: (id) => secondBrainApi.people.delete(id),
                };

            case 'goals':
                return {
                    getAll: (params) => secondBrainApi.goals.getAll(params).then(res => ({ data: res.data?.goals || [], total: res.data?.goals?.length })),
                    getById: (id) => secondBrainApi.goals.getById(id),
                    create: (data) => secondBrainApi.goals.create(data),
                    update: (id, data) => secondBrainApi.goals.update(id, data),
                    delete: (id) => secondBrainApi.goals.delete(id),
                };

            case 'habits':
                return {
                    getAll: (params) => secondBrainApi.habits.getAll(params).then(res => ({ data: res.data?.habits || [], total: res.data?.habits?.length })),
                    getById: (id) => secondBrainApi.habits.getById(id),
                    create: (data) => secondBrainApi.habits.create(data),
                    update: (id, data) => secondBrainApi.habits.update(id, data),
                    delete: (id) => secondBrainApi.habits.delete(id),
                };

            default:
                throw new Error(`Unsupported data type: ${dataType}`);
        }
    }

    /**
     * Get all records
     */
    async getAll(params?: any) {
        const service = this.getApiService();
        return service.getAll(params);
    }

    /**
     * Get record by ID
     */
    async getById(id: string) {
        const service = this.getApiService();
        return service.getById(id);
    }

    /**
     * Create new record
     */
    async create(data: any) {
        const service = this.getApiService();
        return service.create(data);
    }

    /**
     * Update record
     */
    async update(id: string, data: any) {
        const service = this.getApiService();
        return service.update(id, data);
    }

    /**
     * Delete record
     */
    async delete(id: string) {
        const service = this.getApiService();
        return service.delete(id);
    }

    /**
     * Bulk update records
     */
    async bulkUpdate(ids: string[], data: any) {
        const service = this.getApiService();
        if (service.bulkUpdate) {
            return service.bulkUpdate(ids, data);
        }
        // Fallback to individual updates
        await Promise.all(ids.map(id => service.update(id, data)));
    }

    /**
     * Bulk delete records
     */
    async bulkDelete(ids: string[]) {
        const service = this.getApiService();
        if (service.bulkDelete) {
            return service.bulkDelete(ids);
        }
        // Fallback to individual deletes
        await Promise.all(ids.map(id => service.delete(id)));
    }
}

/**
 * Factory function to create a universal data service
 */
export function createUniversalDataService(config: UniversalDataServiceConfig): UniversalDataService {
    return new UniversalDataService(config);
}

/**
 * Hook factory for React Query integration
 */
export function createUniversalDataHooks(config: UniversalDataServiceConfig) {
    const service = createUniversalDataService(config);
    const { dataType, databaseId } = config;
    
    // Generate query keys
    const getQueryKey = (operation: string, params?: any) => {
        if (dataType === 'database' && databaseId) {
            return ['database', databaseId, operation, params];
        }
        return ['second-brain', dataType, operation, params];
    };

    return {
        service,
        queryKeys: {
            all: (params?: any) => getQueryKey('all', params),
            detail: (id: string) => getQueryKey('detail', id),
        }
    };
}

export default UniversalDataService;
