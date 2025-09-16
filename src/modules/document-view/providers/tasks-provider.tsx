import React from 'react';
import { DocumentViewProvider } from '../context/document-view-context';
import type { DocumentRecord, DocumentProperty, DocumentView, DocumentSchema } from '../context/document-view-context';

// Note: Task-specific frozen property configuration has been moved to the API.
// Use the tasks document-view service to get dynamic configuration.

// Task specific types
export interface TaskRecord extends DocumentRecord {
    properties: {
        title: string;
        description?: string;
        status: 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled';
        priority: 'low' | 'medium' | 'high' | 'urgent';
        assignee?: string;
        dueDate?: string;
        startDate?: string;
        completedDate?: string;
        estimatedHours?: number;
        actualHours?: number;
        project?: string;
        category?: string;
        tags?: string[];
        dependencies?: string[];
        subtasks?: string[];
        attachments?: Array<{
            id: string;
            name: string;
            url: string;
            type: string;
            size: number;
        }>;
        [key: string]: any;
    };
}

export interface TaskProperty extends DocumentProperty {
    type: 'TEXT' | 'TEXTAREA' | 'SELECT' | 'MULTI_SELECT' | 'DATE' | 'NUMBER' | 'PERSON' | 'CHECKBOX' | 'URL';
}

export interface TaskView extends DocumentView {
    type: 'table' | 'board' | 'calendar' | 'timeline' | 'gantt';
}

export interface TaskSchema extends DocumentSchema<TaskRecord, TaskProperty, TaskView> {
    config: {
        moduleType: 'TASKS';
        documentType: 'TASKS';
        frozenConfig: any; // Will be provided by API
        permissions: {
            canCreate: boolean;
            canEdit: boolean;
            canDelete: boolean;
            canShare: boolean;
            canExport: boolean;
            canImport: boolean;
        };
        ui: {
            defaultView: 'table';
            enableViews: true;
            enableSearch: true;
            enableFilters: true;
            enableSorts: true;
            enableGrouping: true;
            showRecordCount: true;
            compactMode: boolean;
        };
        data: {
            pageSize: 50;
            enablePagination: true;
            enableVirtualization: boolean;
            cacheResults: true;
        };
        integrations: {
            enableExternalSync: boolean;
            supportedProviders: ('JIRA' | 'ASANA' | 'TRELLO' | 'GITHUB' | 'LINEAR')[];
        };
    };
}

interface TasksProviderProps {
    children: React.ReactNode;
    initialSchema?: TaskSchema;
    enableIntegrations?: boolean;
    compactMode?: boolean;
    enableTimeTracking?: boolean;
}

export function TasksProvider({ 
    children, 
    initialSchema,
    enableIntegrations = false,
    compactMode = false,
    enableTimeTracking = true
}: TasksProviderProps) {
    const defaultConfig = {
        moduleType: 'TASKS' as const,
        documentType: 'TASKS' as const,
        frozenConfig: undefined, // Will be provided by API
        permissions: {
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canShare: true,
            canExport: true,
            canImport: true,
        },
        ui: {
            defaultView: 'table' as const,
            enableViews: true,
            enableSearch: true,
            enableFilters: true,
            enableSorts: true,
            enableGrouping: true,
            showRecordCount: true,
            compactMode,
        },
        data: {
            pageSize: 50,
            enablePagination: true,
            enableVirtualization: compactMode,
            cacheResults: true,
        },
        integrations: {
            enableExternalSync: enableIntegrations,
            supportedProviders: ['JIRA', 'ASANA', 'TRELLO', 'GITHUB', 'LINEAR'] as const,
        },
    };

    return (
        <DocumentViewProvider<TaskRecord, TaskProperty, TaskView, TaskSchema>
            initialConfig={defaultConfig}
            initialSchema={initialSchema}
        >
            {children}
        </DocumentViewProvider>
    );
}

// Default properties for Tasks
export const DEFAULT_TASK_PROPERTIES: TaskProperty[] = [
    {
        id: 'title',
        name: 'Title',
        type: 'TEXT',
        required: true,
        isVisible: true,
        order: 1,
        frozen: true,
        width: 300,
        description: 'Task title (required, frozen)',
    },
    {
        id: 'description',
        name: 'Description',
        type: 'TEXTAREA',
        required: false,
        isVisible: false,
        order: 2,
    },
    {
        id: 'status',
        name: 'Status',
        type: 'SELECT',
        required: true,
        isVisible: true,
        order: 3,
        frozen: false,
        width: 120,
        description: 'Current task status (required)',
        config: {
            options: [
                { id: 'todo', name: 'To Do', color: '#6b7280' },
                { id: 'in_progress', name: 'In Progress', color: '#3b82f6' },
                { id: 'review', name: 'Review', color: '#f59e0b' },
                { id: 'done', name: 'Done', color: '#10b981' },
                { id: 'cancelled', name: 'Cancelled', color: '#ef4444' },
            ],
        },
    },
    {
        id: 'priority',
        name: 'Priority',
        type: 'SELECT',
        required: true,
        isVisible: true,
        order: 4,
        frozen: false,
        width: 100,
        description: 'Task priority level (required)',
        config: {
            options: [
                { id: 'low', name: 'Low', color: '#10b981' },
                { id: 'medium', name: 'Medium', color: '#f59e0b' },
                { id: 'high', name: 'High', color: '#ef4444' },
                { id: 'urgent', name: 'Urgent', color: '#dc2626' },
            ],
        },
    },
    {
        id: 'assignee',
        name: 'Assignee',
        type: 'PERSON',
        required: false,
        isVisible: true,
        order: 5,
    },
    {
        id: 'dueDate',
        name: 'Due Date',
        type: 'DATE',
        required: false,
        isVisible: true,
        order: 6,
        frozen: false,
        width: 150,
        description: 'Task deadline',
    },
    {
        id: 'startDate',
        name: 'Start Date',
        type: 'DATE',
        required: false,
        isVisible: false,
        order: 7,
    },
    {
        id: 'completedDate',
        name: 'Completed Date',
        type: 'DATE',
        required: false,
        isVisible: false,
        order: 8,
    },
    {
        id: 'estimatedHours',
        name: 'Estimated Hours',
        type: 'NUMBER',
        required: false,
        isVisible: false,
        order: 9,
        config: {
            min: 0,
            step: 0.5,
            suffix: 'h',
        },
    },
    {
        id: 'actualHours',
        name: 'Actual Hours',
        type: 'NUMBER',
        required: false,
        isVisible: false,
        order: 10,
        config: {
            min: 0,
            step: 0.5,
            suffix: 'h',
        },
    },
    {
        id: 'project',
        name: 'Project',
        type: 'SELECT',
        required: false,
        isVisible: true,
        order: 11,
        config: {
            allowCustomOptions: true,
        },
    },
    {
        id: 'category',
        name: 'Category',
        type: 'SELECT',
        required: false,
        isVisible: false,
        order: 12,
        config: {
            options: [
                { id: 'feature', name: 'Feature', color: '#3b82f6' },
                { id: 'bug', name: 'Bug', color: '#ef4444' },
                { id: 'improvement', name: 'Improvement', color: '#10b981' },
                { id: 'research', name: 'Research', color: '#8b5cf6' },
                { id: 'documentation', name: 'Documentation', color: '#f59e0b' },
            ],
        },
    },
    {
        id: 'tags',
        name: 'Tags',
        type: 'MULTI_SELECT',
        required: false,
        isVisible: false,
        order: 13,
        config: {
            allowCustomOptions: true,
        },
    },
];

// Create task schema with frozen properties
export const createTaskSchema = (): TaskSchema => ({
    id: 'tasks-main-db',
    name: 'Tasks',
    description: 'Comprehensive task management with document-view integration',
    icon: '✅',
    properties: DEFAULT_TASK_PROPERTIES,
    views: DEFAULT_TASK_VIEWS,
    config: {
        moduleType: 'TASKS',
        documentType: 'TASKS',
        frozenConfig: undefined, // Will be provided by API
        permissions: {
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canShare: true,
            canExport: true,
            canImport: true,
        },
        ui: {
            defaultView: 'table',
            enableViews: true,
            enableSearch: true,
            enableFilters: true,
            enableSorts: true,
            enableGrouping: true,
            showRecordCount: true,
            compactMode: false,
        },
        data: {
            pageSize: 50,
            enablePagination: true,
            enableVirtualization: false,
            cacheResults: true,
        },
        integrations: {
            enableExternalSync: false,
            supportedProviders: ['JIRA', 'ASANA', 'TRELLO', 'GITHUB', 'LINEAR'],
        },
    },
});

// Default views for Tasks
export const DEFAULT_TASK_VIEWS: TaskView[] = [
    {
        id: 'all-tasks',
        name: 'All Tasks',
        type: 'table',
        isDefault: true,
        visibleProperties: ['title', 'status', 'priority', 'assignee', 'dueDate', 'project'],
        sorts: [
            { propertyId: 'priority', direction: 'desc', enabled: true },
            { propertyId: 'dueDate', direction: 'asc', enabled: true },
        ],
    },
    {
        id: 'my-tasks',
        name: 'My Tasks',
        type: 'table',
        filters: [
            { propertyId: 'assignee', operator: 'equals', value: 'current_user', enabled: true },
        ],
        visibleProperties: ['title', 'status', 'priority', 'dueDate', 'project'],
        sorts: [
            { propertyId: 'dueDate', direction: 'asc', enabled: true },
        ],
    },
    {
        id: 'active-tasks',
        name: 'Active Tasks',
        type: 'table',
        filters: [
            { propertyId: 'status', operator: 'in', value: ['todo', 'in_progress', 'review'], enabled: true },
        ],
        visibleProperties: ['title', 'status', 'priority', 'assignee', 'dueDate'],
        sorts: [
            { propertyId: 'priority', direction: 'desc', enabled: true },
        ],
    },
    {
        id: 'overdue-tasks',
        name: 'Overdue Tasks',
        type: 'table',
        filters: [
            { propertyId: 'dueDate', operator: 'less_than', value: 'today', enabled: true },
            { propertyId: 'status', operator: 'not_in', value: ['done', 'cancelled'], enabled: true },
        ],
        visibleProperties: ['title', 'status', 'priority', 'assignee', 'dueDate', 'project'],
        sorts: [
            { propertyId: 'dueDate', direction: 'asc', enabled: true },
        ],
    },
    {
        id: 'kanban-board',
        name: 'Kanban Board',
        type: 'board',
        groupBy: 'status',
        visibleProperties: ['title', 'priority', 'assignee', 'dueDate'],
    },
    {
        id: 'calendar-view',
        name: 'Calendar',
        type: 'calendar',
        visibleProperties: ['title', 'status', 'priority', 'assignee'],
        config: {
            dateProperty: 'dueDate',
            colorProperty: 'priority',
        },
    },
    {
        id: 'timeline-view',
        name: 'Timeline',
        type: 'timeline',
        visibleProperties: ['title', 'status', 'assignee', 'project'],
        config: {
            startDateProperty: 'startDate',
            endDateProperty: 'dueDate',
            groupByProperty: 'project',
        },
    },
];

// Utility function to create a custom Task schema
export function createCustomTaskSchema(
    id: string,
    name: string,
    description?: string,
    customProperties: TaskProperty[] = [],
    customViews: TaskView[] = []
): TaskSchema {
    return {
        id,
        name,
        description: description || 'Task management for projects and to-dos',
        icon: '✅',
        properties: [...DEFAULT_TASK_PROPERTIES, ...customProperties],
        views: [...DEFAULT_TASK_VIEWS, ...customViews],
        config: {
            moduleType: 'TASKS',
            documentType: 'TASKS',
            frozenConfig: undefined, // Will be provided by API
            permissions: {
                canCreate: true,
                canEdit: true,
                canDelete: true,
                canShare: true,
                canExport: true,
                canImport: true,
            },
            ui: {
                defaultView: 'table',
                enableViews: true,
                enableSearch: true,
                enableFilters: true,
                enableSorts: true,
                enableGrouping: true,
                showRecordCount: true,
                compactMode: false,
            },
            data: {
                pageSize: 50,
                enablePagination: true,
                enableVirtualization: false,
                cacheResults: true,
            },
            integrations: {
                enableExternalSync: false,
                supportedProviders: ['JIRA', 'ASANA', 'TRELLO', 'GITHUB', 'LINEAR'],
            },
        },
    };
}
