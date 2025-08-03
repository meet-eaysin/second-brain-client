import React from 'react';
import { EnhancedUniversalDataTable } from './enhanced-universal-data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Task } from '@/types/second-brain.types';
import type { DatabaseView, DatabaseProperty } from '@/types/database.types';

// Sample comprehensive task data
const sampleTasks: Task[] = [
    {
        _id: '1',
        id: '1',
        title: 'Complete project proposal',
        description: 'Write and submit the Q1 project proposal for the new client',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-02-15',
        estimatedTime: 120,
        actualTime: 60,
        parentTask: undefined,
        subtasks: [],
        project: 'proj-1',
        area: 'projects',
        tags: ['work', 'proposal', 'client'],
        assignedTo: 'user-2',
        notes: [],
        isRecurring: false,
        energy: 'medium',
        context: ['@office', '@computer'],
        createdBy: 'user1',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
    },
    {
        _id: '2',
        id: '2',
        title: 'Review team performance',
        description: 'Conduct quarterly performance reviews for all team members',
        status: 'todo',
        priority: 'medium',
        dueDate: '2024-02-20',
        estimatedTime: 180,
        actualTime: undefined,
        parentTask: undefined,
        subtasks: ['3', '4'],
        project: 'proj-2',
        area: 'areas',
        tags: ['hr', 'review', 'team'],
        assignedTo: 'user-1',
        notes: [],
        isRecurring: false,
        energy: 'high',
        context: ['@office', '@meeting'],
        createdBy: 'user1',
        createdAt: '2024-01-12T09:00:00Z',
        updatedAt: '2024-01-12T09:00:00Z',
    },
    {
        _id: '3',
        id: '3',
        title: 'Update website content',
        description: 'Refresh homepage and about page content with latest information',
        status: 'completed',
        priority: 'low',
        dueDate: '2024-01-30',
        estimatedTime: 90,
        actualTime: 85,
        parentTask: undefined,
        subtasks: [],
        project: 'proj-3',
        area: 'projects',
        tags: ['website', 'content', 'marketing'],
        assignedTo: 'user-3',
        notes: [],
        isRecurring: false,
        energy: 'low',
        context: ['@computer', '@home'],
        createdBy: 'user1',
        createdAt: '2024-01-08T14:00:00Z',
        updatedAt: '2024-01-25T16:45:00Z',
        completedAt: '2024-01-25T16:45:00Z',
    },
    {
        _id: '4',
        id: '4',
        title: 'Prepare presentation slides',
        description: 'Create slides for the upcoming board meeting presentation',
        status: 'in-progress',
        priority: 'urgent',
        dueDate: '2024-02-10',
        estimatedTime: 240,
        actualTime: 120,
        parentTask: undefined,
        subtasks: [],
        project: 'proj-1',
        area: 'projects',
        tags: ['presentation', 'board', 'slides'],
        assignedTo: 'user-1',
        notes: [],
        isRecurring: false,
        energy: 'high',
        context: ['@office', '@computer'],
        createdBy: 'user1',
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
    },
    {
        _id: '5',
        id: '5',
        title: 'Schedule team meeting',
        description: 'Coordinate schedules and book meeting room for weekly sync',
        status: 'completed',
        priority: 'medium',
        dueDate: '2024-01-25',
        estimatedTime: 30,
        actualTime: 25,
        parentTask: '2',
        subtasks: [],
        project: undefined,
        area: 'areas',
        tags: ['meeting', 'coordination'],
        assignedTo: 'user-2',
        notes: [],
        isRecurring: true,
        recurrencePattern: {
            type: 'weekly',
            interval: 1,
            daysOfWeek: [1], // Monday
        },
        energy: 'low',
        context: ['@office', '@phone'],
        createdBy: 'user1',
        createdAt: '2024-01-20T16:00:00Z',
        updatedAt: '2024-01-25T10:15:00Z',
        completedAt: '2024-01-25T10:15:00Z',
    },
];

// Sample database views
const sampleViews: DatabaseView[] = [
    {
        id: 'all-tasks',
        name: 'All Tasks',
        type: 'TABLE',
        isDefault: true,
        filters: [],
        sorts: [{ propertyId: 'dueDate', direction: 'asc' }],
        visibleProperties: ['title', 'status', 'priority', 'dueDate', 'assignedTo', 'tags']
    },
    {
        id: 'kanban-board',
        name: 'Kanban Board',
        type: 'BOARD',
        isDefault: false,
        filters: [],
        sorts: [{ propertyId: 'priority', direction: 'desc' }],
        visibleProperties: ['title', 'status', 'priority', 'description', 'assignedTo']
    },
    {
        id: 'high-priority',
        name: 'High Priority',
        type: 'TABLE',
        isDefault: false,
        filters: [
            { propertyId: 'priority', operator: 'equals', value: 'high' },
            { propertyId: 'priority', operator: 'equals', value: 'urgent' }
        ],
        sorts: [{ propertyId: 'dueDate', direction: 'asc' }],
        visibleProperties: ['title', 'status', 'priority', 'dueDate', 'description']
    },
    {
        id: 'my-tasks',
        name: 'My Tasks',
        type: 'LIST',
        isDefault: false,
        filters: [{ propertyId: 'assignedTo', operator: 'equals', value: 'user-1' }],
        sorts: [{ propertyId: 'priority', direction: 'desc' }],
        visibleProperties: ['title', 'status', 'priority', 'dueDate']
    },
    {
        id: 'completed',
        name: 'Completed',
        type: 'GALLERY',
        isDefault: false,
        filters: [{ propertyId: 'status', operator: 'equals', value: 'completed' }],
        sorts: [{ propertyId: 'completedAt', direction: 'desc' }],
        visibleProperties: ['title', 'status', 'completedAt', 'actualTime']
    }
];

export function DatabaseDemoPage() {
    const handleCustomAction = (actionId: string, record: Task) => {
        console.log('Custom action:', actionId, record);
        alert(`Action "${actionId}" triggered for task: ${record.title}`);
    };

    const handleToolbarAction = (actionId: string, records: Task[]) => {
        console.log('Toolbar action:', actionId, records);
        alert(`Toolbar action "${actionId}" triggered for ${records.length} tasks`);
    };

    const handleViewChange = (viewId: string) => {
        console.log('View changed to:', viewId);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Database-Style Data Table Demo</h1>
                <p className="text-muted-foreground">
                    Complete database experience with views, filters, sorts, and all features from the database details page.
                </p>
            </div>

            {/* Feature Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">✅ Multiple Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Table, Board, List, Gallery, Calendar, Timeline views
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">🔍 Advanced Search</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Real-time search across all properties
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">🎛️ Column Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Show/hide columns, reorder, resize
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">📊 Filters & Sorts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            View-specific filtering and sorting
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">⚡ Bulk Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Select multiple rows for batch operations
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">🎨 Rich Rendering</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Badges, dates, links, checkboxes, and more
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Demo */}
            <Card>
                <CardHeader>
                    <CardTitle>Enhanced Universal Data Table</CardTitle>
                    <CardDescription>
                        This table includes all features from the database details page: multiple views, 
                        search, filters, sorts, column management, and more.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EnhancedUniversalDataTable<Task>
                        tableType="tasks"
                        data={sampleTasks}
                        databaseName="Project Tasks"
                        databaseIcon="📋"
                        views={sampleViews}
                        onViewChange={handleViewChange}
                        onCustomAction={handleCustomAction}
                        onToolbarAction={handleToolbarAction}
                        enableRowSelection={true}
                        enableBulkActions={true}
                        enableColumnVisibility={true}
                        enableSorting={true}
                        enableFiltering={true}
                        enablePagination={true}
                        enableSearch={true}
                        enableViews={true}
                        context="database"
                        idField="id"
                    />
                </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>Try These Features</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium">🔄 Switch Views</h4>
                            <p className="text-sm text-muted-foreground">
                                Click the view tabs to see Table, Board, List, and Gallery views
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🔍 Search</h4>
                            <p className="text-sm text-muted-foreground">
                                Use the search bar to filter across all task properties
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">👁️ Column Visibility</h4>
                            <p className="text-sm text-muted-foreground">
                                Click "Columns" to show/hide different properties
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">✅ Row Selection</h4>
                            <p className="text-sm text-muted-foreground">
                                Select rows to enable bulk actions in the toolbar
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
