import React from 'react';
import { UniversalDataTable } from './universal-data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Task } from '@/types/second-brain.types';

// Sample test data
const sampleTasks: Task[] = [
    {
        _id: '1',
        id: '1',
        title: 'Complete project proposal',
        description: 'Write and submit the Q1 project proposal',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2024-02-15',
        estimatedTime: 120,
        actualTime: 60,
        parentTask: undefined,
        subtasks: [],
        project: undefined,
        area: 'projects',
        tags: ['work', 'proposal'],
        assignedTo: undefined,
        notes: [],
        isRecurring: false,
        energy: 'medium',
        context: ['@office'],
        createdBy: 'user1',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
    },
    {
        _id: '2',
        id: '2',
        title: 'Review team performance',
        description: 'Conduct quarterly performance reviews',
        status: 'todo',
        priority: 'medium',
        dueDate: '2024-02-20',
        estimatedTime: 180,
        actualTime: undefined,
        parentTask: undefined,
        subtasks: [],
        project: undefined,
        area: 'areas',
        tags: ['hr', 'review'],
        assignedTo: undefined,
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
        description: 'Refresh homepage and about page content',
        status: 'completed',
        priority: 'low',
        dueDate: '2024-01-30',
        estimatedTime: 90,
        actualTime: 85,
        parentTask: undefined,
        subtasks: [],
        project: undefined,
        area: 'projects',
        tags: ['website', 'content'],
        assignedTo: undefined,
        notes: [],
        isRecurring: false,
        energy: 'low',
        context: ['@computer'],
        createdBy: 'user1',
        createdAt: '2024-01-08T14:00:00Z',
        updatedAt: '2024-01-25T16:45:00Z',
        completedAt: '2024-01-25T16:45:00Z',
    },
];

export function UniversalDataTableTestPage() {
    const handleCustomAction = (actionId: string, record: Task) => {
        console.log('Custom action:', actionId, record);
        alert(`Action "${actionId}" triggered for task: ${record.title}`);
    };

    const handleToolbarAction = (actionId: string, records: Task[]) => {
        console.log('Toolbar action:', actionId, records);
        alert(`Toolbar action "${actionId}" triggered for ${records.length} tasks`);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">UniversalDataTable Test</h1>
                <p className="text-muted-foreground">
                    Testing the standalone UniversalDataTable component with sample task data.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Tasks Table Test</CardTitle>
                    <CardDescription>
                        This table should work without requiring DatabaseProvider context.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UniversalDataTable<Task>
                        tableType="tasks"
                        data={sampleTasks}
                        onCustomAction={handleCustomAction}
                        onToolbarAction={handleToolbarAction}
                        enableRowSelection={true}
                        enableBulkActions={true}
                        enableColumnVisibility={true}
                        enableSorting={true}
                        enableFiltering={true}
                        enablePagination={true}
                        context="second-brain"
                        idField="_id"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Features Tested</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium">✅ Context Independence</h4>
                            <p className="text-sm text-muted-foreground">
                                Works without DatabaseProvider context
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">✅ Type Safety</h4>
                            <p className="text-sm text-muted-foreground">
                                Full TypeScript support with proper Task types
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">✅ Custom Actions</h4>
                            <p className="text-sm text-muted-foreground">
                                Row-level actions (complete, edit, delete)
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">✅ Toolbar Actions</h4>
                            <p className="text-sm text-muted-foreground">
                                Bulk operations (create, bulk complete, bulk delete)
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">✅ Column Management</h4>
                            <p className="text-sm text-muted-foreground">
                                Show/hide columns, sorting, filtering
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">✅ Data Transformation</h4>
                            <p className="text-sm text-muted-foreground">
                                Automatic conversion to database format
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
