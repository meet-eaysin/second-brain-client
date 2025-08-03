import type { DatabaseProperty } from '@/types/database.types';
import type { ActionConfig, ToolbarActionConfig } from './action-system';
import {
    Edit, Trash2, Eye, Star, Archive, Share,
    CheckSquare, Target, User,
    BookOpen, Heart,
    Plus, Download, Upload
} from 'lucide-react';

export interface TableConfiguration {
    defaultProperties: DatabaseProperty[];
    customActions: ActionConfig[];
    toolbarActions: ToolbarActionConfig[];
    features: {
        enableRowSelection: boolean;
        enableBulkActions: boolean;
        enableColumnVisibility: boolean;
        enableSorting: boolean;
        enableFiltering: boolean;
        enablePagination: boolean;
    };
}

/**
 * Get table configuration based on table type
 */
export function getTableConfiguration(
    tableType: 'tasks' | 'projects' | 'goals' | 'notes' | 'people' | 'habits' | 'journal' | 'books' | 'content' | 'finances' | 'mood' | 'custom'
): TableConfiguration {
    switch (tableType) {
        case 'tasks':
            return getTasksConfiguration();
        case 'projects':
            return getProjectsConfiguration();
        case 'goals':
            return getGoalsConfiguration();
        case 'notes':
            return getNotesConfiguration();
        case 'people':
            return getPeopleConfiguration();
        case 'habits':
            return getHabitsConfiguration();
        case 'journal':
            return getJournalConfiguration();
        case 'books':
            return getBooksConfiguration();
        case 'content':
            return getContentConfiguration();
        case 'finances':
            return getFinancesConfiguration();
        case 'mood':
            return getMoodConfiguration();
        default:
            return getDefaultConfiguration();
    }
}

function getTasksConfiguration(): TableConfiguration {
    return {
        defaultProperties: [
            {
                id: 'title',
                name: 'Title',
                type: 'TEXT',
                required: true,
                isVisible: true,
                order: 0,
                hidden: false,
                frozen: false,
                orderIndex: 0,
                width: 250,
            },
            {
                id: 'status',
                name: 'Status',
                type: 'SELECT',
                isVisible: true,
                order: 1,
                selectOptions: [
                    { id: 'todo', name: 'To Do', color: '#6b7280' },
                    { id: 'in_progress', name: 'In Progress', color: '#3b82f6' },
                    { id: 'completed', name: 'Completed', color: '#10b981' },
                    { id: 'cancelled', name: 'Cancelled', color: '#ef4444' },
                ],
                hidden: false,
                frozen: false,
                orderIndex: 1,
                width: 120,
            },
            {
                id: 'priority',
                name: 'Priority',
                type: 'SELECT',
                isVisible: true,
                order: 2,
                selectOptions: [
                    { id: 'low', name: 'Low', color: '#10b981' },
                    { id: 'medium', name: 'Medium', color: '#f59e0b' },
                    { id: 'high', name: 'High', color: '#ef4444' },
                    { id: 'urgent', name: 'Urgent', color: '#dc2626' },
                ],
                hidden: false,
                frozen: false,
                orderIndex: 2,
                width: 100,
            },
            {
                id: 'dueDate',
                name: 'Due Date',
                type: 'DATE',
                isVisible: true,
                order: 3,
                hidden: false,
                frozen: false,
                orderIndex: 3,
                width: 150,
            },
            {
                id: 'assignee',
                name: 'Assignee',
                type: 'TEXT',
                isVisible: true,
                order: 4,
                hidden: false,
                frozen: false,
                orderIndex: 4,
                width: 150,
            },
        ],
        customActions: [
            {
                id: 'complete',
                label: 'Mark Complete',
                icon: CheckSquare,
                onClick: (record) => console.log('Complete task:', record),
                isVisible: (record) => record.properties.status !== 'completed',
                variant: 'default',
            },
            {
                id: 'edit',
                label: 'Edit',
                icon: Edit,
                onClick: (record) => console.log('Edit task:', record),
                variant: 'ghost',
            },
            {
                id: 'delete',
                label: 'Delete',
                icon: Trash2,
                onClick: (record) => console.log('Delete task:', record),
                variant: 'ghost',
                isDestructive: true,
            },
        ],
        toolbarActions: [
            {
                id: 'create',
                label: 'New Task',
                icon: Plus,
                onClick: () => console.log('Create new task'),
                variant: 'default',
                requiresSelection: false,
            },
            {
                id: 'bulk_complete',
                label: 'Mark Complete',
                icon: CheckSquare,
                onClick: (records) => console.log('Bulk complete:', records),
                variant: 'outline',
                requiresSelection: true,
            },
            {
                id: 'bulk_delete',
                label: 'Delete Selected',
                icon: Trash2,
                onClick: (records) => console.log('Bulk delete:', records),
                variant: 'outline',
                requiresSelection: true,
                isDestructive: true,
            },
        ],
        features: {
            enableRowSelection: true,
            enableBulkActions: true,
            enableColumnVisibility: true,
            enableSorting: true,
            enableFiltering: true,
            enablePagination: true,
        },
    };
}

function getProjectsConfiguration(): TableConfiguration {
    return {
        defaultProperties: [
            {
                id: 'name',
                name: 'Project Name',
                type: 'TEXT',
                required: true,
                isVisible: true,
                order: 0,
                hidden: false,
                frozen: false,
                orderIndex: 0,
                width: 250,
            },
            {
                id: 'status',
                name: 'Status',
                type: 'SELECT',
                isVisible: true,
                order: 1,
                selectOptions: [
                    { id: 'planning', name: 'Planning', color: '#6b7280' },
                    { id: 'active', name: 'Active', color: '#3b82f6' },
                    { id: 'on_hold', name: 'On Hold', color: '#f59e0b' },
                    { id: 'completed', name: 'Completed', color: '#10b981' },
                    { id: 'cancelled', name: 'Cancelled', color: '#ef4444' },
                ],
                hidden: false,
                frozen: false,
                orderIndex: 1,
                width: 120,
            },
            {
                id: 'progress',
                name: 'Progress',
                type: 'NUMBER',
                isVisible: true,
                order: 2,
                hidden: false,
                frozen: false,
                orderIndex: 2,
                width: 100,
            },
            {
                id: 'startDate',
                name: 'Start Date',
                type: 'DATE',
                isVisible: true,
                order: 3,
                hidden: false,
                frozen: false,
                orderIndex: 3,
                width: 150,
            },
            {
                id: 'endDate',
                name: 'End Date',
                type: 'DATE',
                isVisible: true,
                order: 4,
                hidden: false,
                frozen: false,
                orderIndex: 4,
                width: 150,
            },
        ],
        customActions: [
            {
                id: 'view',
                label: 'View Details',
                icon: Eye,
                onClick: (record) => console.log('View project:', record),
                variant: 'ghost',
            },
            {
                id: 'edit',
                label: 'Edit',
                icon: Edit,
                onClick: (record) => console.log('Edit project:', record),
                variant: 'ghost',
            },
            {
                id: 'archive',
                label: 'Archive',
                icon: Archive,
                onClick: (record) => console.log('Archive project:', record),
                variant: 'ghost',
            },
        ],
        toolbarActions: [
            {
                id: 'create',
                label: 'New Project',
                icon: Plus,
                onClick: () => console.log('Create new project'),
                variant: 'default',
                requiresSelection: false,
            },
            {
                id: 'export',
                label: 'Export',
                icon: Download,
                onClick: (records) => console.log('Export projects:', records),
                variant: 'outline',
                requiresSelection: false,
            },
        ],
        features: {
            enableRowSelection: true,
            enableBulkActions: true,
            enableColumnVisibility: true,
            enableSorting: true,
            enableFiltering: true,
            enablePagination: true,
        },
    };
}

function getDefaultConfiguration(): TableConfiguration {
    return {
        defaultProperties: [
            {
                id: 'name',
                name: 'Name',
                type: 'TEXT',
                required: true,
                isVisible: true,
                order: 0,
                hidden: false,
                frozen: false,
                orderIndex: 0,
                width: 200,
            },
            {
                id: 'createdAt',
                name: 'Created',
                type: 'CREATED_TIME',
                isVisible: true,
                order: 1,
                hidden: false,
                frozen: false,
                orderIndex: 1,
                width: 150,
            },
        ],
        customActions: [
            {
                id: 'edit',
                label: 'Edit',
                icon: Edit,
                onClick: (record) => console.log('Edit:', record),
                variant: 'ghost',
            },
            {
                id: 'delete',
                label: 'Delete',
                icon: Trash2,
                onClick: (record) => console.log('Delete:', record),
                variant: 'ghost',
                isDestructive: true,
            },
        ],
        toolbarActions: [
            {
                id: 'create',
                label: 'Create New',
                icon: Plus,
                onClick: () => console.log('Create new'),
                variant: 'default',
                requiresSelection: false,
            },
        ],
        features: {
            enableRowSelection: true,
            enableBulkActions: true,
            enableColumnVisibility: true,
            enableSorting: true,
            enableFiltering: true,
            enablePagination: true,
        },
    };
}

function getGoalsConfiguration(): TableConfiguration {
    return {
        defaultProperties: [
            {
                id: 'title',
                name: 'Goal',
                type: 'TEXT',
                required: true,
                isVisible: true,
                order: 0,
                hidden: false,
                frozen: false,
                orderIndex: 0,
                width: 250,
            },
            {
                id: 'category',
                name: 'Category',
                type: 'SELECT',
                isVisible: true,
                order: 1,
                selectOptions: [
                    { id: 'personal', name: 'Personal', color: '#3b82f6' },
                    { id: 'career', name: 'Career', color: '#10b981' },
                    { id: 'health', name: 'Health', color: '#f59e0b' },
                    { id: 'financial', name: 'Financial', color: '#ef4444' },
                    { id: 'learning', name: 'Learning', color: '#8b5cf6' },
                ],
                hidden: false,
                frozen: false,
                orderIndex: 1,
                width: 120,
            },
            {
                id: 'progress',
                name: 'Progress',
                type: 'NUMBER',
                isVisible: true,
                order: 2,
                hidden: false,
                frozen: false,
                orderIndex: 2,
                width: 100,
            },
            {
                id: 'targetDate',
                name: 'Target Date',
                type: 'DATE',
                isVisible: true,
                order: 3,
                hidden: false,
                frozen: false,
                orderIndex: 3,
                width: 150,
            },
        ],
        customActions: [
            {
                id: 'update_progress',
                label: 'Update Progress',
                icon: Target,
                onClick: (record) => console.log('Update progress:', record),
                variant: 'default',
            },
            {
                id: 'edit',
                label: 'Edit',
                icon: Edit,
                onClick: (record) => console.log('Edit goal:', record),
                variant: 'ghost',
            },
        ],
        toolbarActions: [
            {
                id: 'create',
                label: 'New Goal',
                icon: Plus,
                onClick: () => console.log('Create new goal'),
                variant: 'default',
                requiresSelection: false,
            },
        ],
        features: {
            enableRowSelection: true,
            enableBulkActions: true,
            enableColumnVisibility: true,
            enableSorting: true,
            enableFiltering: true,
            enablePagination: true,
        },
    };
}

function getNotesConfiguration(): TableConfiguration {
    return {
        defaultProperties: [
            {
                id: 'title',
                name: 'Title',
                type: 'TEXT',
                required: true,
                isVisible: true,
                order: 0,
                hidden: false,
                frozen: false,
                orderIndex: 0,
                width: 250,
            },
            {
                id: 'type',
                name: 'Type',
                type: 'SELECT',
                isVisible: true,
                order: 1,
                selectOptions: [
                    { id: 'note', name: 'Note', color: '#6b7280' },
                    { id: 'meeting', name: 'Meeting', color: '#3b82f6' },
                    { id: 'research', name: 'Research', color: '#10b981' },
                    { id: 'idea', name: 'Idea', color: '#f59e0b' },
                    { id: 'template', name: 'Template', color: '#8b5cf6' },
                ],
                hidden: false,
                frozen: false,
                orderIndex: 1,
                width: 120,
            },
            {
                id: 'tags',
                name: 'Tags',
                type: 'MULTI_SELECT',
                isVisible: true,
                order: 2,
                hidden: false,
                frozen: false,
                orderIndex: 2,
                width: 200,
            },
            {
                id: 'lastModified',
                name: 'Last Modified',
                type: 'LAST_EDITED_TIME',
                isVisible: true,
                order: 3,
                hidden: false,
                frozen: false,
                orderIndex: 3,
                width: 150,
            },
        ],
        customActions: [
            {
                id: 'open',
                label: 'Open',
                icon: BookOpen,
                onClick: (record) => console.log('Open note:', record),
                variant: 'default',
            },
            {
                id: 'favorite',
                label: 'Favorite',
                icon: Star,
                onClick: (record) => console.log('Favorite note:', record),
                variant: 'ghost',
            },
            {
                id: 'share',
                label: 'Share',
                icon: Share,
                onClick: (record) => console.log('Share note:', record),
                variant: 'ghost',
            },
        ],
        toolbarActions: [
            {
                id: 'create',
                label: 'New Note',
                icon: Plus,
                onClick: () => console.log('Create new note'),
                variant: 'default',
                requiresSelection: false,
            },
            {
                id: 'import',
                label: 'Import',
                icon: Upload,
                onClick: () => console.log('Import notes'),
                variant: 'outline',
                requiresSelection: false,
            },
        ],
        features: {
            enableRowSelection: true,
            enableBulkActions: true,
            enableColumnVisibility: true,
            enableSorting: true,
            enableFiltering: true,
            enablePagination: true,
        },
    };
}

function getPeopleConfiguration(): TableConfiguration {
    return {
        defaultProperties: [
            {
                id: 'name',
                name: 'Name',
                type: 'TEXT',
                required: true,
                isVisible: true,
                order: 0,
                hidden: false,
                frozen: false,
                orderIndex: 0,
                width: 200,
            },
            {
                id: 'relationship',
                name: 'Relationship',
                type: 'SELECT',
                isVisible: true,
                order: 1,
                selectOptions: [
                    { id: 'colleague', name: 'Colleague', color: '#3b82f6' },
                    { id: 'friend', name: 'Friend', color: '#10b981' },
                    { id: 'family', name: 'Family', color: '#f59e0b' },
                    { id: 'mentor', name: 'Mentor', color: '#8b5cf6' },
                    { id: 'client', name: 'Client', color: '#ef4444' },
                ],
                hidden: false,
                frozen: false,
                orderIndex: 1,
                width: 120,
            },
            {
                id: 'email',
                name: 'Email',
                type: 'EMAIL',
                isVisible: true,
                order: 2,
                hidden: false,
                frozen: false,
                orderIndex: 2,
                width: 200,
            },
            {
                id: 'lastContact',
                name: 'Last Contact',
                type: 'DATE',
                isVisible: true,
                order: 3,
                hidden: false,
                frozen: false,
                orderIndex: 3,
                width: 150,
            },
        ],
        customActions: [
            {
                id: 'contact',
                label: 'Contact',
                icon: User,
                onClick: (record) => console.log('Contact person:', record),
                variant: 'default',
            },
            {
                id: 'edit',
                label: 'Edit',
                icon: Edit,
                onClick: (record) => console.log('Edit person:', record),
                variant: 'ghost',
            },
        ],
        toolbarActions: [
            {
                id: 'create',
                label: 'Add Person',
                icon: Plus,
                onClick: () => console.log('Add new person'),
                variant: 'default',
                requiresSelection: false,
            },
        ],
        features: {
            enableRowSelection: true,
            enableBulkActions: true,
            enableColumnVisibility: true,
            enableSorting: true,
            enableFiltering: true,
            enablePagination: true,
        },
    };
}

function getHabitsConfiguration(): TableConfiguration {
    return {
        defaultProperties: [
            {
                id: 'name',
                name: 'Habit',
                type: 'TEXT',
                required: true,
                isVisible: true,
                order: 0,
                hidden: false,
                frozen: false,
                orderIndex: 0,
                width: 200,
            },
            {
                id: 'frequency',
                name: 'Frequency',
                type: 'SELECT',
                isVisible: true,
                order: 1,
                selectOptions: [
                    { id: 'daily', name: 'Daily', color: '#10b981' },
                    { id: 'weekly', name: 'Weekly', color: '#3b82f6' },
                    { id: 'monthly', name: 'Monthly', color: '#f59e0b' },
                ],
                hidden: false,
                frozen: false,
                orderIndex: 1,
                width: 120,
            },
            {
                id: 'streak',
                name: 'Current Streak',
                type: 'NUMBER',
                isVisible: true,
                order: 2,
                hidden: false,
                frozen: false,
                orderIndex: 2,
                width: 120,
            },
            {
                id: 'lastCompleted',
                name: 'Last Completed',
                type: 'DATE',
                isVisible: true,
                order: 3,
                hidden: false,
                frozen: false,
                orderIndex: 3,
                width: 150,
            },
        ],
        customActions: [
            {
                id: 'mark_done',
                label: 'Mark Done',
                icon: CheckSquare,
                onClick: (record) => console.log('Mark habit done:', record),
                variant: 'default',
            },
            {
                id: 'edit',
                label: 'Edit',
                icon: Edit,
                onClick: (record) => console.log('Edit habit:', record),
                variant: 'ghost',
            },
        ],
        toolbarActions: [
            {
                id: 'create',
                label: 'New Habit',
                icon: Plus,
                onClick: () => console.log('Create new habit'),
                variant: 'default',
                requiresSelection: false,
            },
        ],
        features: {
            enableRowSelection: true,
            enableBulkActions: true,
            enableColumnVisibility: true,
            enableSorting: true,
            enableFiltering: true,
            enablePagination: true,
        },
    };
}

function getJournalConfiguration(): TableConfiguration {
    return {
        defaultProperties: [
            {
                id: 'date',
                name: 'Date',
                type: 'DATE',
                required: true,
                isVisible: true,
                order: 0,
                hidden: false,
                frozen: false,
                orderIndex: 0,
                width: 150,
            },
            {
                id: 'mood',
                name: 'Mood',
                type: 'SELECT',
                isVisible: true,
                order: 1,
                selectOptions: [
                    { id: 'excellent', name: 'Excellent', color: '#10b981' },
                    { id: 'good', name: 'Good', color: '#3b82f6' },
                    { id: 'neutral', name: 'Neutral', color: '#6b7280' },
                    { id: 'bad', name: 'Bad', color: '#f59e0b' },
                    { id: 'terrible', name: 'Terrible', color: '#ef4444' },
                ],
                hidden: false,
                frozen: false,
                orderIndex: 1,
                width: 100,
            },
            {
                id: 'title',
                name: 'Title',
                type: 'TEXT',
                isVisible: true,
                order: 2,
                hidden: false,
                frozen: false,
                orderIndex: 2,
                width: 250,
            },
            {
                id: 'tags',
                name: 'Tags',
                type: 'MULTI_SELECT',
                isVisible: true,
                order: 3,
                hidden: false,
                frozen: false,
                orderIndex: 3,
                width: 150,
            },
        ],
        customActions: [
            {
                id: 'open',
                label: 'Open Entry',
                icon: BookOpen,
                onClick: (record) => console.log('Open journal entry:', record),
                variant: 'default',
            },
            {
                id: 'edit',
                label: 'Edit',
                icon: Edit,
                onClick: (record) => console.log('Edit journal entry:', record),
                variant: 'ghost',
            },
        ],
        toolbarActions: [
            {
                id: 'create',
                label: 'New Entry',
                icon: Plus,
                onClick: () => console.log('Create new journal entry'),
                variant: 'default',
                requiresSelection: false,
            },
        ],
        features: {
            enableRowSelection: true,
            enableBulkActions: true,
            enableColumnVisibility: true,
            enableSorting: true,
            enableFiltering: true,
            enablePagination: true,
        },
    };
}

function getBooksConfiguration(): TableConfiguration {
    return {
        defaultProperties: [
            {
                id: 'title',
                name: 'Title',
                type: 'TEXT',
                required: true,
                isVisible: true,
                order: 0,
                hidden: false,
                frozen: false,
                orderIndex: 0,
                width: 250,
            },
            {
                id: 'author',
                name: 'Author',
                type: 'TEXT',
                isVisible: true,
                order: 1,
                hidden: false,
                frozen: false,
                orderIndex: 1,
                width: 150,
            },
            {
                id: 'status',
                name: 'Status',
                type: 'SELECT',
                isVisible: true,
                order: 2,
                selectOptions: [
                    { id: 'want_to_read', name: 'Want to Read', color: '#6b7280' },
                    { id: 'reading', name: 'Reading', color: '#3b82f6' },
                    { id: 'completed', name: 'Completed', color: '#10b981' },
                    { id: 'paused', name: 'Paused', color: '#f59e0b' },
                    { id: 'abandoned', name: 'Abandoned', color: '#ef4444' },
                ],
                hidden: false,
                frozen: false,
                orderIndex: 2,
                width: 120,
            },
            {
                id: 'rating',
                name: 'Rating',
                type: 'NUMBER',
                isVisible: true,
                order: 3,
                hidden: false,
                frozen: false,
                orderIndex: 3,
                width: 100,
            },
        ],
        customActions: [
            {
                id: 'view',
                label: 'View Details',
                icon: BookOpen,
                onClick: (record) => console.log('View book:', record),
                variant: 'default',
            },
            {
                id: 'favorite',
                label: 'Favorite',
                icon: Heart,
                onClick: (record) => console.log('Favorite book:', record),
                variant: 'ghost',
            },
        ],
        toolbarActions: [
            {
                id: 'create',
                label: 'Add Book',
                icon: Plus,
                onClick: () => console.log('Add new book'),
                variant: 'default',
                requiresSelection: false,
            },
        ],
        features: {
            enableRowSelection: true,
            enableBulkActions: true,
            enableColumnVisibility: true,
            enableSorting: true,
            enableFiltering: true,
            enablePagination: true,
        },
    };
}

function getContentConfiguration(): TableConfiguration { return getDefaultConfiguration(); }
function getFinancesConfiguration(): TableConfiguration { return getDefaultConfiguration(); }
function getMoodConfiguration(): TableConfiguration { return getDefaultConfiguration(); }
