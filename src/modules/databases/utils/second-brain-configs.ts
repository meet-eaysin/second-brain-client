import { 
    CheckSquare, Target, Users, BookOpen, Calendar, 
    Zap, Heart, DollarSign, Megaphone, Star,
    Edit, Trash2, Eye, Play, Pause, Archive,
    Phone, Mail, MessageCircle, Video, Coffee,
    Plus, Copy, Share, Download
} from 'lucide-react';
import type { DatabaseProperty, PropertyType } from '@/types/database.types';

export interface SecondBrainConfig {
    type: string;
    coreProperties: string[];
    defaultProperties: DatabaseProperty[];
    customActions: any[];
    toolbarActions: any[];
}

// Core properties that cannot have their types changed
export const SECOND_BRAIN_CORE_PROPERTIES = {
    tasks: ['title', 'status', 'priority', 'dueDate', 'assignee'],
    projects: ['title', 'status', 'progress', 'deadline', 'area'],
    goals: ['title', 'status', 'progress', 'targetDate', 'category'],
    notes: ['title', 'content', 'tags', 'createdAt', 'updatedAt'],
    people: ['name', 'email', 'phone', 'company', 'relationship'],
    habits: ['name', 'frequency', 'streak', 'lastCompleted', 'category'],
    journal: ['date', 'mood', 'content', 'tags', 'weather'],
    books: ['title', 'author', 'status', 'rating', 'genre'],
    content: ['title', 'type', 'platform', 'status', 'publishDate'],
    finances: ['description', 'amount', 'type', 'category', 'date'],
    mood: ['date', 'mood', 'energy', 'stress', 'sleep']
};

// Default property configurations for each Second Brain type
export const getSecondBrainProperties = (type: string): DatabaseProperty[] => {
    const baseProps = {
        id: '',
        description: '',
        required: false,
        isVisible: true,
        order: 0,
    };

    switch (type) {
        case 'tasks':
            return [
                { ...baseProps, id: 'title', name: 'Title', type: 'TEXT' as PropertyType, required: true, order: 1 },
                { ...baseProps, id: 'status', name: 'Status', type: 'SELECT' as PropertyType, order: 2, 
                  selectOptions: [
                    { id: '1', name: 'To Do', color: 'gray' },
                    { id: '2', name: 'In Progress', color: 'blue' },
                    { id: '3', name: 'Done', color: 'green' },
                    { id: '4', name: 'Cancelled', color: 'red' }
                  ]
                },
                { ...baseProps, id: 'priority', name: 'Priority', type: 'SELECT' as PropertyType, order: 3,
                  selectOptions: [
                    { id: '1', name: 'Low', color: 'green' },
                    { id: '2', name: 'Medium', color: 'yellow' },
                    { id: '3', name: 'High', color: 'red' }
                  ]
                },
                { ...baseProps, id: 'dueDate', name: 'Due Date', type: 'DATE' as PropertyType, order: 4 },
                { ...baseProps, id: 'assignee', name: 'Assignee', type: 'TEXT' as PropertyType, order: 5 },
                { ...baseProps, id: 'project', name: 'Project', type: 'TEXT' as PropertyType, order: 6 },
                { ...baseProps, id: 'tags', name: 'Tags', type: 'MULTI_SELECT' as PropertyType, order: 7 }
            ];

        case 'projects':
            return [
                { ...baseProps, id: 'title', name: 'Title', type: 'TEXT' as PropertyType, required: true, order: 1 },
                { ...baseProps, id: 'status', name: 'Status', type: 'SELECT' as PropertyType, order: 2,
                  selectOptions: [
                    { id: '1', name: 'Planning', color: 'purple' },
                    { id: '2', name: 'Active', color: 'blue' },
                    { id: '3', name: 'On Hold', color: 'yellow' },
                    { id: '4', name: 'Completed', color: 'green' },
                    { id: '5', name: 'Cancelled', color: 'red' }
                  ]
                },
                { ...baseProps, id: 'progress', name: 'Progress', type: 'NUMBER' as PropertyType, order: 3 },
                { ...baseProps, id: 'deadline', name: 'Deadline', type: 'DATE' as PropertyType, order: 4 },
                { ...baseProps, id: 'area', name: 'Area', type: 'SELECT' as PropertyType, order: 5 },
                { ...baseProps, id: 'priority', name: 'Priority', type: 'SELECT' as PropertyType, order: 6 }
            ];

        case 'people':
            return [
                { ...baseProps, id: 'name', name: 'Name', type: 'TEXT' as PropertyType, required: true, order: 1 },
                { ...baseProps, id: 'email', name: 'Email', type: 'EMAIL' as PropertyType, order: 2 },
                { ...baseProps, id: 'phone', name: 'Phone', type: 'PHONE' as PropertyType, order: 3 },
                { ...baseProps, id: 'company', name: 'Company', type: 'TEXT' as PropertyType, order: 4 },
                { ...baseProps, id: 'relationship', name: 'Relationship', type: 'SELECT' as PropertyType, order: 5,
                  selectOptions: [
                    { id: '1', name: 'Family', color: 'red' },
                    { id: '2', name: 'Friend', color: 'blue' },
                    { id: '3', name: 'Colleague', color: 'green' },
                    { id: '4', name: 'Client', color: 'purple' },
                    { id: '5', name: 'Other', color: 'gray' }
                  ]
                },
                { ...baseProps, id: 'avatar', name: 'Avatar', type: 'URL' as PropertyType, order: 6 },
                { ...baseProps, id: 'lastContact', name: 'Last Contact', type: 'DATE' as PropertyType, order: 7 }
            ];

        case 'goals':
            return [
                { ...baseProps, id: 'title', name: 'Title', type: 'TEXT' as PropertyType, required: true, order: 1 },
                { ...baseProps, id: 'status', name: 'Status', type: 'SELECT' as PropertyType, order: 2,
                  selectOptions: [
                    { id: '1', name: 'Not Started', color: 'gray' },
                    { id: '2', name: 'In Progress', color: 'blue' },
                    { id: '3', name: 'Completed', color: 'green' },
                    { id: '4', name: 'On Hold', color: 'yellow' }
                  ]
                },
                { ...baseProps, id: 'progress', name: 'Progress', type: 'NUMBER' as PropertyType, order: 3 },
                { ...baseProps, id: 'targetDate', name: 'Target Date', type: 'DATE' as PropertyType, order: 4 },
                { ...baseProps, id: 'category', name: 'Category', type: 'SELECT' as PropertyType, order: 5 }
            ];

        default:
            return [
                { ...baseProps, id: 'title', name: 'Title', type: 'TEXT' as PropertyType, required: true, order: 1 },
                { ...baseProps, id: 'status', name: 'Status', type: 'SELECT' as PropertyType, order: 2 },
                { ...baseProps, id: 'createdAt', name: 'Created', type: 'CREATED_TIME' as PropertyType, order: 3 }
            ];
    }
};

// Default custom actions for each Second Brain type
export const getSecondBrainActions = (type: string) => {
    const baseActions = [
        {
            id: 'edit',
            label: 'Edit',
            icon: Edit,
            variant: 'ghost' as const,
            onClick: (record: any) => console.log('Edit', record)
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: Trash2,
            variant: 'ghost' as const,
            onClick: (record: any) => console.log('Delete', record)
        }
    ];

    switch (type) {
        case 'tasks':
            return [
                {
                    id: 'complete',
                    label: 'Complete',
                    icon: CheckSquare,
                    variant: 'default' as const,
                    onClick: (record: any) => console.log('Complete task', record),
                    isVisible: (record: any) => record.properties.status !== 'Done'
                },
                ...baseActions
            ];

        case 'people':
            return [
                {
                    id: 'call',
                    label: 'Call',
                    icon: Phone,
                    variant: 'outline' as const,
                    onClick: (record: any) => console.log('Call', record),
                    isVisible: (record: any) => !!record.properties.phone
                },
                {
                    id: 'email',
                    label: 'Email',
                    icon: Mail,
                    variant: 'outline' as const,
                    onClick: (record: any) => console.log('Email', record),
                    isVisible: (record: any) => !!record.properties.email
                },
                {
                    id: 'schedule',
                    label: 'Schedule',
                    icon: Calendar,
                    variant: 'outline' as const,
                    onClick: (record: any) => console.log('Schedule meeting', record)
                },
                ...baseActions
            ];

        case 'projects':
            return [
                {
                    id: 'view',
                    label: 'View',
                    icon: Eye,
                    variant: 'outline' as const,
                    onClick: (record: any) => console.log('View project', record)
                },
                {
                    id: 'archive',
                    label: 'Archive',
                    icon: Archive,
                    variant: 'ghost' as const,
                    onClick: (record: any) => console.log('Archive project', record),
                    isVisible: (record: any) => record.properties.status === 'Completed'
                },
                ...baseActions
            ];

        default:
            return baseActions;
    }
};

// Default toolbar actions for each Second Brain type
export const getSecondBrainToolbarActions = (type: string) => {
    const baseToolbarActions = [
        {
            id: 'bulk-delete',
            label: 'Delete Selected',
            icon: Trash2,
            variant: 'destructive' as const,
            onClick: (records: any[]) => console.log('Bulk delete', records),
            requiresSelection: true
        }
    ];

    switch (type) {
        case 'tasks':
            return [
                {
                    id: 'bulk-complete',
                    label: 'Mark Complete',
                    icon: CheckSquare,
                    variant: 'default' as const,
                    onClick: (records: any[]) => console.log('Bulk complete', records),
                    requiresSelection: true
                },
                {
                    id: 'bulk-assign',
                    label: 'Assign To',
                    icon: Users,
                    variant: 'outline' as const,
                    onClick: (records: any[]) => console.log('Bulk assign', records),
                    requiresSelection: true
                },
                ...baseToolbarActions
            ];

        case 'people':
            return [
                {
                    id: 'bulk-email',
                    label: 'Send Email',
                    icon: Mail,
                    variant: 'outline' as const,
                    onClick: (records: any[]) => console.log('Bulk email', records),
                    requiresSelection: true
                },
                {
                    id: 'export-contacts',
                    label: 'Export',
                    icon: Download,
                    variant: 'outline' as const,
                    onClick: (records: any[]) => console.log('Export contacts', records),
                    requiresSelection: false
                },
                ...baseToolbarActions
            ];

        default:
            return baseToolbarActions;
    }
};

// Get complete configuration for a Second Brain type
export const getSecondBrainConfig = (type: string): SecondBrainConfig => {
    return {
        type,
        coreProperties: SECOND_BRAIN_CORE_PROPERTIES[type as keyof typeof SECOND_BRAIN_CORE_PROPERTIES] || [],
        defaultProperties: getSecondBrainProperties(type),
        customActions: getSecondBrainActions(type),
        toolbarActions: getSecondBrainToolbarActions(type)
    };
};
