import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Target, Plus, Search, Calendar, TrendingUp,
    CheckSquare, Clock, AlertCircle, Trophy,
    MoreHorizontal, Edit, Trash2, Eye, BarChart3
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function GoalsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const queryClient = useQueryClient();

    const { data: goalsData, isLoading } = useQuery({
        queryKey: ['second-brain', 'goals', { type: typeFilter, status: statusFilter }],
        queryFn: () => secondBrainApi.goals.getAll({ 
            type: typeFilter !== 'all' ? typeFilter : undefined,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            includeProgress: true
        }),
    });

    const { data: goalsInsights } = useQuery({
        queryKey: ['second-brain', 'goals', 'insights'],
        queryFn: secondBrainApi.goals.getInsights,
    });

    const deleteGoalMutation = useMutation({
        mutationFn: secondBrainApi.goals.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'goals'] });
            toast.success('Goal deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete goal');
        },
    });

    const goals = goalsData?.data?.goals || [];
    const insights = goalsInsights?.data || {};

    const filteredGoals = goals.filter((goal: any) =>
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'default';
            case 'completed': return 'secondary';
            case 'paused': return 'outline';
            case 'planned': return 'secondary';
            default: return 'outline';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'outcome': return 'bg-blue-500';
            case 'process': return 'bg-green-500';
            case 'learning': return 'bg-purple-500';
            case 'habit': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'text-green-600';
        if (progress >= 50) return 'text-yellow-600';
        return 'text-red-600';
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
            <EnhancedHeader />

            <Main className="space-y-8">
                {/* Clean Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
                        <p className="text-muted-foreground">
                            Track your objectives and measure progress
                        </p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Goal
                    </Button>
                </div>

            {/* Insights Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-500" />
                            <div>
                                <div className="text-2xl font-bold">{insights.totalGoals || 0}</div>
                                <div className="text-sm text-muted-foreground">Total Goals</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                            <div>
                                <div className="text-2xl font-bold">{insights.averageProgress || 0}%</div>
                                <div className="text-sm text-muted-foreground">Avg Progress</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <div>
                                <div className="text-2xl font-bold">{insights.byStatus?.completed || 0}</div>
                                <div className="text-sm text-muted-foreground">Completed</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <div>
                                <div className="text-2xl font-bold">{insights.overdue || 0}</div>
                                <div className="text-sm text-muted-foreground">Overdue</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search goals..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="outcome">Outcome</SelectItem>
                                <SelectItem value="process">Process</SelectItem>
                                <SelectItem value="learning">Learning</SelectItem>
                                <SelectItem value="habit">Habit</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="planned">Planned</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Goals List */}
            <Tabs defaultValue="grid">
                <TabsList>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="space-y-4">
                    {filteredGoals.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No goals found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchQuery ? 'Try adjusting your search or filters' : 'Create your first goal to get started'}
                                </p>
                                <Button variant="outline" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Goal
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGoals.map((goal: any) => (
                                <Card key={goal._id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${getTypeColor(goal.type)}`} />
                                                <Badge variant={getStatusColor(goal.status) as any}>
                                                    {goal.status}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {goal.type}
                                                </Badge>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="text-destructive"
                                                        onClick={() => deleteGoalMutation.mutate(goal._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                                        {goal.description && (
                                            <CardDescription className="line-clamp-2">
                                                {goal.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Progress */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Progress</span>
                                                <span className={getProgressColor(goal.progressPercentage || 0)}>
                                                    {goal.progressPercentage || 0}%
                                                </span>
                                            </div>
                                            <Progress value={goal.progressPercentage || 0} className="h-2" />
                                        </div>

                                        {/* Target/Current Values */}
                                        {goal.targetValue && (
                                            <div className="flex justify-between text-sm">
                                                <span>Target:</span>
                                                <span>{goal.currentValue || 0} / {goal.targetValue} {goal.unit}</span>
                                            </div>
                                        )}

                                        {/* Timeline */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            {goal.startDate && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>Started: {new Date(goal.startDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {goal.endDate && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>Due: {new Date(goal.endDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Linked Items */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-muted-foreground" />
                                                <span>{goal.projects?.length || 0} projects</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                                <span>{goal.habits?.length || 0} habits</span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {goal.tags && goal.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {goal.tags.slice(0, 3).map((tag: string) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {goal.tags.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{goal.tags.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        {/* Parent Goal */}
                                        {goal.parentGoal && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Target className="h-4 w-4" />
                                                <span>Part of: {goal.parentGoal.title}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="list">
                    <Card>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {filteredGoals.map((goal: any) => (
                                    <div key={goal._id} className="p-4 hover:bg-muted/50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${getTypeColor(goal.type)}`} />
                                                    <h3 className="font-medium">{goal.title}</h3>
                                                    <Badge variant={getStatusColor(goal.status) as any}>
                                                        {goal.status}
                                                    </Badge>
                                                    <Badge variant="outline">{goal.type}</Badge>
                                                </div>
                                                {goal.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {goal.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className={`text-sm font-medium ${getProgressColor(goal.progressPercentage || 0)}`}>
                                                        {goal.progressPercentage || 0}%
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {goal.projects?.length || 0} projects
                                                    </div>
                                                </div>
                                                <div className="w-24">
                                                    <Progress value={goal.progressPercentage || 0} className="h-2" />
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="timeline">
                    <div className="space-y-6">
                        {['active', 'planned', 'paused', 'completed'].map((status) => {
                            const statusGoals = filteredGoals.filter((g: any) => g.status === status);
                            if (statusGoals.length === 0) return null;

                            return (
                                <Card key={status}>
                                    <CardHeader>
                                        <CardTitle className="capitalize flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${
                                                status === 'active' ? 'bg-green-500' :
                                                status === 'planned' ? 'bg-blue-500' :
                                                status === 'paused' ? 'bg-yellow-500' :
                                                'bg-gray-500'
                                            }`} />
                                            {status} Goals ({statusGoals.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {statusGoals.map((goal: any) => (
                                                <div key={goal._id} className="flex items-center gap-4 p-3 border rounded-lg">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{goal.title}</h4>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                            <span>{goal.type}</span>
                                                            {goal.endDate && (
                                                                <span>Due: {new Date(goal.endDate).toLocaleDateString()}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-lg font-bold ${getProgressColor(goal.progressPercentage || 0)}`}>
                                                            {goal.progressPercentage || 0}%
                                                        </div>
                                                        <Progress value={goal.progressPercentage || 0} className="w-20 h-2" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>
            </Tabs>
            </Main>
        </>
    );
}
