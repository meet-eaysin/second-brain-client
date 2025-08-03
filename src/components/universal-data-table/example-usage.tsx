import React, { useState } from 'react';
import { UniversalDataTable } from './universal-data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Star, Plus, Download } from 'lucide-react';
import { toast } from 'sonner';

// Example data for different table types
const sampleTasks = [
    {
        id: '1',
        title: 'Complete project proposal',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2024-02-15',
        assignee: 'John Doe',
        description: 'Write and submit the Q1 project proposal',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
    },
    {
        id: '2',
        title: 'Review team performance',
        status: 'todo',
        priority: 'medium',
        dueDate: '2024-02-20',
        assignee: 'Jane Smith',
        description: 'Conduct quarterly performance reviews',
        createdAt: '2024-01-12T09:00:00Z',
        updatedAt: '2024-01-12T09:00:00Z',
    },
    {
        id: '3',
        title: 'Update website content',
        status: 'completed',
        priority: 'low',
        dueDate: '2024-01-30',
        assignee: 'Bob Wilson',
        description: 'Refresh homepage and about page content',
        createdAt: '2024-01-08T14:00:00Z',
        updatedAt: '2024-01-25T16:45:00Z',
    },
];

const sampleProjects = [
    {
        id: '1',
        name: 'Website Redesign',
        status: 'active',
        progress: 75,
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        owner: 'Design Team',
        budget: 50000,
        createdAt: '2023-12-15T10:00:00Z',
    },
    {
        id: '2',
        name: 'Mobile App Development',
        status: 'planning',
        progress: 15,
        startDate: '2024-02-01',
        endDate: '2024-08-31',
        owner: 'Dev Team',
        budget: 120000,
        createdAt: '2024-01-10T14:30:00Z',
    },
];

const sampleNotes = [
    {
        id: '1',
        title: 'Meeting Notes - Q1 Planning',
        type: 'meeting',
        tags: ['planning', 'q1', 'strategy'],
        lastModified: '2024-01-15T10:30:00Z',
        author: 'John Doe',
        wordCount: 1250,
        favorite: true,
    },
    {
        id: '2',
        title: 'Research: Market Trends 2024',
        type: 'research',
        tags: ['research', 'market', '2024'],
        lastModified: '2024-01-20T16:45:00Z',
        author: 'Jane Smith',
        wordCount: 3400,
        favorite: false,
    },
];

export function UniversalDataTableExample() {
    const [activeTab, setActiveTab] = useState('tasks');

    // Custom action handlers
    const handleTaskAction = (actionId: string, record: any) => {
        switch (actionId) {
            case 'complete':
                toast.success(`Task "${record.title}" marked as ${record.status === 'completed' ? 'incomplete' : 'complete'}`);
                break;
            case 'edit':
                toast.info(`Editing task: ${record.title}`);
                break;
            case 'delete':
                toast.error(`Deleted task: ${record.title}`);
                break;
            default:
                toast.info(`Action "${actionId}" triggered for: ${record.title}`);
        }
    };

    const handleProjectAction = (actionId: string, record: any) => {
        switch (actionId) {
            case 'view':
                toast.info(`Viewing project: ${record.name}`);
                break;
            case 'edit':
                toast.info(`Editing project: ${record.name}`);
                break;
            case 'archive':
                toast.success(`Archived project: ${record.name}`);
                break;
            default:
                toast.info(`Action "${actionId}" triggered for: ${record.name}`);
        }
    };

    const handleNoteAction = (actionId: string, record: any) => {
        switch (actionId) {
            case 'open':
                toast.info(`Opening note: ${record.title}`);
                break;
            case 'favorite':
                toast.success(`${record.favorite ? 'Removed from' : 'Added to'} favorites: ${record.title}`);
                break;
            case 'share':
                toast.info(`Sharing note: ${record.title}`);
                break;
            default:
                toast.info(`Action "${actionId}" triggered for: ${record.title}`);
        }
    };

    // Toolbar action handlers
    const handleToolbarAction = (actionId: string, records: any[]) => {
        switch (actionId) {
            case 'create':
                toast.info(`Creating new ${activeTab.slice(0, -1)}`);
                break;
            case 'bulk_complete':
                toast.success(`Marked ${records.length} tasks as complete`);
                break;
            case 'bulk_delete':
                toast.error(`Deleted ${records.length} items`);
                break;
            case 'export':
                toast.info(`Exporting ${records.length || 'all'} items`);
                break;
            case 'import':
                toast.info(`Importing ${activeTab}`);
                break;
            default:
                toast.info(`Toolbar action "${actionId}" triggered with ${records.length} selected items`);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">UniversalDataTable Examples</h1>
                <p className="text-muted-foreground">
                    Demonstration of the UniversalDataTable component with different table types and configurations.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tasks Table</CardTitle>
                            <CardDescription>
                                Example of a tasks table with predefined configuration, custom actions, and toolbar actions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UniversalDataTable
                                tableType="tasks"
                                data={sampleTasks}
                                onCustomAction={handleTaskAction}
                                onToolbarAction={handleToolbarAction}
                                enableRowSelection={true}
                                enableBulkActions={true}
                                enableColumnVisibility={true}
                                enableSorting={true}
                                enableFiltering={true}
                                enablePagination={true}
                                context="second-brain"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Projects Table</CardTitle>
                            <CardDescription>
                                Example of a projects table with different column types and actions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UniversalDataTable
                                tableType="projects"
                                data={sampleProjects}
                                onCustomAction={handleProjectAction}
                                onToolbarAction={handleToolbarAction}
                                enableRowSelection={true}
                                enableBulkActions={true}
                                enableColumnVisibility={true}
                                enableSorting={true}
                                enableFiltering={true}
                                enablePagination={true}
                                context="second-brain"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes Table</CardTitle>
                            <CardDescription>
                                Example of a notes table with tags, favorites, and content management features.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UniversalDataTable
                                tableType="notes"
                                data={sampleNotes}
                                onCustomAction={handleNoteAction}
                                onToolbarAction={handleToolbarAction}
                                enableRowSelection={true}
                                enableBulkActions={true}
                                enableColumnVisibility={true}
                                enableSorting={true}
                                enableFiltering={true}
                                enablePagination={true}
                                context="second-brain"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Features</CardTitle>
                    <CardDescription>
                        Key features of the UniversalDataTable component
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium">Predefined Configurations</h4>
                            <p className="text-sm text-muted-foreground">
                                Built-in configurations for tasks, projects, notes, and more with appropriate columns and actions.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Custom Actions</h4>
                            <p className="text-sm text-muted-foreground">
                                Flexible action system with row-level and toolbar actions that can be customized per use case.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Data Transformation</h4>
                            <p className="text-sm text-muted-foreground">
                                Automatic data transformation from any format to database-compatible records.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Column Management</h4>
                            <p className="text-sm text-muted-foreground">
                                Show/hide columns, resize, freeze, and reorder columns with full persistence.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Filtering & Sorting</h4>
                            <p className="text-sm text-muted-foreground">
                                Advanced filtering and sorting capabilities with multiple criteria support.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Bulk Operations</h4>
                            <p className="text-sm text-muted-foreground">
                                Select multiple rows and perform bulk operations with confirmation dialogs.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
