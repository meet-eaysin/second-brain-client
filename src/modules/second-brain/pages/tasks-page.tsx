import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    CheckSquare, Plus, Search, Filter,
    Clock, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';
import { QuickCapture } from '../components/quick-capture';
import { SecondBrainTable, createSecondBrainColumns } from '../../databases/components/second-brain-table';
import { getSecondBrainConfig } from '../../databases/utils/second-brain-configs';
import { toast } from 'sonner';

export function TasksPage() {
    const [view, setView] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    const queryClient = useQueryClient();

    const { data: tasksData, isLoading } = useQuery({
        queryKey: ['second-brain', 'tasks', { view, status: statusFilter, priority: priorityFilter }],
        queryFn: () => secondBrainApi.tasks.getAll({ 
            view: view !== 'all' ? view : undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            priority: priorityFilter !== 'all' ? priorityFilter : undefined
        }),
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => 
            secondBrainApi.tasks.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'tasks'] });
            toast.success('Task updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update task');
        },
    });

    // Mock data for demonstration
    const mockTasks = [
        {
            _id: '1',
            title: 'Complete project proposal',
            description: 'Write and submit the Q1 project proposal',
            status: 'in-progress',
            priority: 'high',
            dueDate: '2024-02-15',
            assignee: 'John Doe',
            project: 'Q1 Planning',
            area: 'Work',
            tags: ['urgent', 'proposal'],
            createdAt: '2024-01-10',
            updatedAt: '2024-01-14'
        },
        {
            _id: '2',
            title: 'Review team performance',
            description: 'Conduct quarterly performance reviews',
            status: 'todo',
            priority: 'medium',
            dueDate: '2024-02-20',
            assignee: 'Jane Smith',
            project: 'HR Management',
            area: 'Management',
            tags: ['review', 'team'],
            createdAt: '2024-01-12',
            updatedAt: '2024-01-12'
        },
        {
            _id: '3',
            title: 'Update website content',
            description: 'Refresh homepage and about page content',
            status: 'completed',
            priority: 'low',
            dueDate: '2024-01-30',
            assignee: 'Mike Johnson',
            project: 'Website Refresh',
            area: 'Marketing',
            tags: ['content', 'website'],
            createdAt: '2024-01-08',
            updatedAt: '2024-01-15'
        }
    ];

    const tasks = tasksData?.data?.tasks || mockTasks;

    const filteredTasks = tasks.filter((task: any) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStatusChange = (taskId: string, newStatus: string) => {
        updateTaskMutation.mutate({
            id: taskId,
            data: { status: newStatus }
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'destructive';
            case 'high': return 'destructive';
            case 'medium': return 'default';
            case 'low': return 'secondary';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return CheckCircle2;
            case 'in-progress': return Clock;
            case 'cancelled': return Pause;
            default: return CheckSquare;
        }
    };

    // Transform tasks to database records format
    const taskRecords = filteredTasks.map((task: any) => ({
        id: task._id,
        properties: {
            title: task.title,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            assignee: task.assignee,
            project: task.project,
            area: task.area,
            tags: task.tags,
            description: task.description,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        }
    }));

    // Get configuration and create columns
    const config = getSecondBrainConfig('tasks');
    const columns = createSecondBrainColumns('tasks', config.defaultProperties);

    // Handle custom actions
    const handleCustomAction = (actionId: string, record: any) => {
        switch (actionId) {
            case 'complete':
                handleStatusChange(record.id, record.properties.status === 'completed' ? 'todo' : 'completed');
                break;
            case 'edit':
                // Handle edit action
                console.log('Edit task:', record);
                break;
            case 'delete':
                // Handle delete action
                console.log('Delete task:', record);
                break;
        }
    };

    // Handle toolbar actions
    const handleToolbarAction = (actionId: string, records: any[]) => {
        switch (actionId) {
            case 'bulk-complete':
                records.forEach(record => {
                    if (record.properties.status !== 'completed') {
                        handleStatusChange(record.id, 'completed');
                    }
                });
                break;
            case 'bulk-delete':
                // Handle bulk delete
                console.log('Bulk delete tasks:', records);
                break;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            <EnhancedHeader
                contextActions={
                    <>
                        <Button size="sm" variant="outline" className="h-8 gap-2">
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>
                        <Button size="sm" className="h-8 gap-2">
                            <Plus className="h-4 w-4" />
                            New Task
                        </Button>
                    </>
                }
            />

            <Main className="space-y-8">
                {/* Page Description */}
                <div className="space-y-2">
                    <p className="text-muted-foreground">
                        Manage your tasks and to-dos efficiently
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                                    <p className="text-2xl font-bold text-foreground">{tasks.length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <CheckSquare className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                    <p className="text-2xl font-bold text-foreground">{tasks.filter((t: any) => t.status === 'completed').length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <CheckCircle2 className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                                    <p className="text-2xl font-bold text-foreground">{tasks.filter((t: any) => t.status === 'in-progress').length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                                    <p className="text-2xl font-bold text-foreground">{tasks.filter((t: any) => t.priority === 'high').length}</p>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <AlertTriangle className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 w-64"
                            />
                        </div>

                        {/* Filters */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <QuickCapture
                        defaultType="task"
                        trigger={
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Task
                            </Button>
                        }
                    />
                </div>

                {/* Tasks Table */}
                {taskRecords.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <CheckSquare className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                {searchQuery ? 'No tasks found' : 'No tasks yet'}
                            </h3>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                                {searchQuery ? 'Try adjusting your search terms.' : 'Create your first task to get started.'}
                            </p>
                            {!searchQuery && (
                                <QuickCapture
                                    defaultType="task"
                                    trigger={
                                        <Button size="lg">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create First Task
                                        </Button>
                                    }
                                />
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <SecondBrainTable
                        type="tasks"
                        data={taskRecords}
                        columns={columns}
                        properties={config.defaultProperties}
                        onCustomAction={handleCustomAction}
                        onToolbarAction={handleToolbarAction}
                        enableRowSelection={true}
                        enableBulkActions={true}
                    />
                )}
            </Main>
        </>
    );
}
