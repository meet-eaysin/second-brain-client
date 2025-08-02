import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    CheckSquare, Plus, Filter, Search, Calendar,
    Clock, AlertCircle, Pause, CheckCircle2
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';
import { QuickCapture } from '../components/quick-capture';
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

    const tasks = tasksData?.data?.tasks || [];

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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <CheckSquare className="h-8 w-8 text-primary" />
                        Tasks
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your tasks and to-dos
                    </p>
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

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Smart Views */}
            <Tabs value={view} onValueChange={setView}>
                <TabsList>
                    <TabsTrigger value="all">All Tasks</TabsTrigger>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="next-actions">Next Actions</TabsTrigger>
                    <TabsTrigger value="waiting">Waiting</TabsTrigger>
                    <TabsTrigger value="someday">Someday</TabsTrigger>
                </TabsList>

                <TabsContent value={view} className="space-y-4">
                    {filteredTasks.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchQuery ? 'Try adjusting your search or filters' : 'Create your first task to get started'}
                                </p>
                                <QuickCapture 
                                    defaultType="task"
                                    trigger={
                                        <Button variant="outline" className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Create Task
                                        </Button>
                                    }
                                />
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {filteredTasks.map((task: any) => {
                                const StatusIcon = getStatusIcon(task.status);
                                return (
                                    <Card key={task._id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="p-1 h-auto"
                                                    onClick={() => {
                                                        const newStatus = task.status === 'completed' ? 'todo' : 'completed';
                                                        handleStatusChange(task._id, newStatus);
                                                    }}
                                                >
                                                    <StatusIcon className={`h-5 w-5 ${
                                                        task.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'
                                                    }`} />
                                                </Button>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className={`font-medium ${
                                                            task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                                                        }`}>
                                                            {task.title}
                                                        </h3>
                                                        <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                                                            {task.priority}
                                                        </Badge>
                                                    </div>
                                                    
                                                    {task.description && (
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                    
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        {task.dueDate && (
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(task.dueDate).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                        {task.area && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {task.area}
                                                            </Badge>
                                                        )}
                                                        {task.tags?.map((tag: string) => (
                                                            <Badge key={tag} variant="outline" className="text-xs">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
