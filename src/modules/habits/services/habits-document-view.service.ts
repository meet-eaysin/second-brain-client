import { apiClient } from '@/services/api-client';
import { documentViewService } from '@/services/database-view.service';
import type { DatabaseView } from '@/modules/database-view';

// Habits-specific document view configuration
export interface HabitsViewConfig {
    moduleType: 'habits';
    documentType: 'HABITS';

    // Backend-controlled properties (cannot be removed/disabled)
    requiredProperties: string[];

    // Detailed frozen property configuration
    frozenConfig: {
        viewType: string;
        moduleType: string;
        description: string;
        frozenProperties: Array<{
            propertyId: string;
            reason?: string;
            allowEdit?: boolean;
            allowHide?: boolean;
            allowDelete?: boolean;
        }>;
    };
    
    // User-customizable properties
    customizableProperties: {
        description: { frozen: false; removable: true; visible: true };
        frequency: { frozen: false; removable: true; visible: true };
        category: { frozen: false; removable: true; visible: true };
        streak: { frozen: false; removable: true; visible: true };
        target: { frozen: false; removable: true; visible: false };
        unit: { frozen: false; removable: true; visible: false };
        reminder: { frozen: false; removable: true; visible: false };
        notes: { frozen: false; removable: true; visible: false };
        startDate: { frozen: false; removable: true; visible: false };
        endDate: { frozen: false; removable: true; visible: false };
    };
    
    // Default view configurations
    defaultViews: {
        table: {
            name: 'All Habits';
            type: 'TABLE';
            isDefault: true;
            visibleProperties: string[];
            sorts: Array<{ propertyId: string; direction: 'ASC' | 'DESC' }>;
        };
        kanban: {
            name: 'Habits by Status';
            type: 'KANBAN';
            isDefault: false;
            groupBy: 'status';
            visibleProperties: string[];
        };
    };
}

class HabitsDocumentViewService {
    private readonly moduleType = 'habits';
    private readonly documentType = 'HABITS';

    // Get all views for habits
    async getViews(): Promise<DatabaseView[]> {
        try {
            const response = await apiClient.get(`/document-views/${this.moduleType}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching habits views:', error);
            return this.getDefaultViews();
        }
    }

    // Get a specific view
    async getView(viewId: string): Promise<DatabaseView | null> {
        try {
            const response = await apiClient.get(`/document-views/${this.moduleType}/${viewId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching habits view:', error);
            return null;
        }
    }

    // Get habits database configuration
    async getDatabase(): Promise<any> {
        try {
            const response = await apiClient.get(`/databases/${this.moduleType}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching habits database:', error);
            return this.getDefaultDatabase();
        }
    }

    // Get habits records
    async getRecords(filters?: Record<string, any>): Promise<any[]> {
        try {
            const response = await apiClient.get(`/habits`, { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching habits records:', error);
            return [];
        }
    }

    // Get a specific habit record
    async getRecord(habitId: string): Promise<any | null> {
        try {
            const response = await apiClient.get(`/habits/${habitId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching habit record:', error);
            return null;
        }
    }

    // Create a new habit record
    async createRecord(habitData: Record<string, any>): Promise<any> {
        try {
            const response = await apiClient.post('/habits', habitData);
            return response.data;
        } catch (error) {
            console.error('Error creating habit record:', error);
            throw error;
        }
    }

    // Update a habit record
    async updateRecord(habitId: string, updates: Record<string, any>): Promise<any> {
        try {
            const response = await apiClient.patch(`/habits/${habitId}`, updates);
            return response.data;
        } catch (error) {
            console.error('Error updating habit record:', error);
            throw error;
        }
    }

    // Delete a habit record
    async deleteRecord(habitId: string): Promise<void> {
        try {
            await apiClient.delete(`/habits/${habitId}`);
        } catch (error) {
            console.error('Error deleting habit record:', error);
            throw error;
        }
    }

    // Get habits with filters and sorts based on view
    async getHabitWithFiltersAndSorts(params: {
        viewId?: string;
        filters?: Record<string, any>;
    }): Promise<any[]> {
        try {
            const response = await apiClient.get('/habits/view', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching habits with view:', error);
            return [];
        }
    }

    // Get view configuration
    async getConfig(): Promise<HabitsViewConfig> {
        try {
            const response = await apiClient.get(`/document-views/${this.moduleType}/config`);
            return response.data;
        } catch (error) {
            console.error('Error fetching habits config:', error);
            return this.getDefaultConfig();
        }
    }

    // Get frozen configuration
    async getFrozenConfig(): Promise<any> {
        try {
            const response = await apiClient.get(`/document-views/${this.moduleType}/frozen-config`);
            return response.data;
        } catch (error) {
            console.error('Error fetching habits frozen config:', error);
            return this.getDefaultFrozenConfig();
        }
    }

    // Default configurations
    private getDefaultViews(): DatabaseView[] {
        return [
            {
                id: 'default-habits-table',
                name: 'All Habits',
                type: 'TABLE',
                isDefault: true,
                filters: [],
                sorts: [{ propertyId: 'createdAt', direction: 'desc' }],
                visibleProperties: ['title', 'frequency', 'status', 'streak', 'category'],
                frozen: false,
            }
        ];
    }

    private getDefaultDatabase(): any {
        return {
            id: 'habits-db',
            name: 'Habits',
            type: this.documentType,
            properties: [
                { id: 'title', name: 'Title', type: 'text', required: true },
                { id: 'description', name: 'Description', type: 'text' },
                { id: 'frequency', name: 'Frequency', type: 'select', options: ['daily', 'weekly', 'monthly'] },
                { id: 'status', name: 'Status', type: 'select', options: ['active', 'paused', 'completed'] },
                { id: 'category', name: 'Category', type: 'text' },
                { id: 'streak', name: 'Streak', type: 'number' },
                { id: 'target', name: 'Target', type: 'number' },
                { id: 'unit', name: 'Unit', type: 'text' },
                { id: 'createdAt', name: 'Created', type: 'date' },
                { id: 'updatedAt', name: 'Updated', type: 'date' },
            ]
        };
    }

    private getDefaultConfig(): HabitsViewConfig {
        return {
            moduleType: 'habits',
            documentType: 'HABITS',
            requiredProperties: ['title', 'frequency', 'status'],
            frozenConfig: {
                viewType: 'TABLE',
                moduleType: 'habits',
                description: 'Default habits view configuration',
                frozenProperties: [
                    { propertyId: 'title', reason: 'Core identifier', allowEdit: true, allowHide: false, allowDelete: false },
                    { propertyId: 'frequency', reason: 'Essential for tracking', allowEdit: true, allowHide: false, allowDelete: false },
                    { propertyId: 'status', reason: 'Core status tracking', allowEdit: true, allowHide: false, allowDelete: false },
                ]
            },
            customizableProperties: {
                description: { frozen: false, removable: true, visible: true },
                frequency: { frozen: false, removable: true, visible: true },
                category: { frozen: false, removable: true, visible: true },
                streak: { frozen: false, removable: true, visible: true },
                target: { frozen: false, removable: true, visible: false },
                unit: { frozen: false, removable: true, visible: false },
                reminder: { frozen: false, removable: true, visible: false },
                notes: { frozen: false, removable: true, visible: false },
                startDate: { frozen: false, removable: true, visible: false },
                endDate: { frozen: false, removable: true, visible: false },
            },
            defaultViews: {
                table: {
                    name: 'All Habits',
                    type: 'TABLE',
                    isDefault: true,
                    visibleProperties: ['title', 'frequency', 'status', 'streak', 'category'],
                    sorts: [{ propertyId: 'createdAt', direction: 'DESC' }]
                },
                kanban: {
                    name: 'Habits by Status',
                    type: 'KANBAN',
                    isDefault: false,
                    groupBy: 'status',
                    visibleProperties: ['title', 'frequency', 'streak', 'category']
                }
            }
        };
    }

    private getDefaultFrozenConfig(): any {
        return {
            isFrozen: false,
            frozenProperties: [],
            allowPropertyManagement: true,
            allowViewCreation: true,
            allowViewEditing: true,
            allowViewDeletion: true,
        };
    }
}

export const habitsDocumentViewService = new HabitsDocumentViewService();
