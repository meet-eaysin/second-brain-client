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
    Target, Plus, Search, Calendar, Users,
    CheckSquare, BookOpen, TrendingUp, Clock,
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

export function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [areaFilter, setAreaFilter] = useState('all');

    const queryClient = useQueryClient();

    const { data: projectsData, isLoading } = useQuery({
        queryKey: ['second-brain', 'projects', { status: statusFilter, area: areaFilter }],
        queryFn: () => secondBrainApi.projects.getAll({ 
            status: statusFilter !== 'all' ? statusFilter : undefined,
            area: areaFilter !== 'all' ? areaFilter : undefined,
            includeStats: true
        }),
    });

    const deleteProjectMutation = useMutation({
        mutationFn: secondBrainApi.projects.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'projects'] });
            toast.success('Project deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete project');
        },
    });

    const projects = projectsData?.data?.projects || [];

    const filteredProjects = projects.filter((project: any) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return TrendingUp;
            case 'completed': return CheckSquare;
            case 'paused': return Clock;
            case 'planned': return Target;
            default: return Target;
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
                            <BarChart3 className="h-4 w-4" />
                            Analytics
                        </Button>
                        <Button size="sm" className="h-8 gap-2">
                            <Plus className="h-4 w-4" />
                            New Project
                        </Button>
                    </>
                }
            />

            <Main className="space-y-8">
                {/* Page Description */}
                <div className="space-y-2">
                    <p className="text-muted-foreground">
                        Goal-oriented containers for tasks and notes
                    </p>
                </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search projects..."
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
                                <SelectItem value="planned">Planned</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={areaFilter} onValueChange={setAreaFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Area" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Areas</SelectItem>
                                <SelectItem value="projects">Projects</SelectItem>
                                <SelectItem value="areas">Areas</SelectItem>
                                <SelectItem value="resources">Resources</SelectItem>
                                <SelectItem value="archive">Archive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Projects Grid */}
            <Tabs defaultValue="grid">
                <TabsList>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="kanban">Kanban</TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="space-y-4">
                    {filteredProjects.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchQuery ? 'Try adjusting your search or filters' : 'Create your first project to get started'}
                                </p>
                                <Button variant="outline" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Project
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project: any) => {
                                const StatusIcon = getStatusIcon(project.status);
                                return (
                                    <Card key={project._id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <StatusIcon className="h-5 w-5 text-primary" />
                                                    <Badge variant={getStatusColor(project.status) as any}>
                                                        {project.status}
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
                                                            onClick={() => deleteProjectMutation.mutate(project._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                            <CardTitle className="text-lg">{project.title}</CardTitle>
                                            {project.description && (
                                                <CardDescription className="line-clamp-2">
                                                    {project.description}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Progress */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Progress</span>
                                                    <span>{project.completionPercentage || 0}%</span>
                                                </div>
                                                <Progress value={project.completionPercentage || 0} className="h-2" />
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                                    <span>{project.tasks?.length || 0} tasks</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                    <span>{project.notes?.length || 0} notes</span>
                                                </div>
                                                {project.people && project.people.length > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span>{project.people.length} people</span>
                                                    </div>
                                                )}
                                                {project.deadline && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Tags */}
                                            {project.tags && project.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {project.tags.slice(0, 3).map((tag: string) => (
                                                        <Badge key={tag} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    {project.tags.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{project.tags.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            {/* Goal Link */}
                                            {project.goal && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Target className="h-4 w-4" />
                                                    <span>Linked to: {project.goal.title}</span>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="list">
                    <Card>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {filteredProjects.map((project: any) => (
                                    <div key={project._id} className="p-4 hover:bg-muted/50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-medium">{project.title}</h3>
                                                    <Badge variant={getStatusColor(project.status) as any}>
                                                        {project.status}
                                                    </Badge>
                                                    <Badge variant="outline">{project.area}</Badge>
                                                </div>
                                                {project.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {project.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-sm font-medium">
                                                        {project.completionPercentage || 0}%
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {project.tasks?.length || 0} tasks
                                                    </div>
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

                <TabsContent value="kanban">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {['planned', 'active', 'paused', 'completed'].map((status) => (
                            <Card key={status}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium capitalize">
                                        {status} ({filteredProjects.filter((p: any) => p.status === status).length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {filteredProjects
                                        .filter((project: any) => project.status === status)
                                        .map((project: any) => (
                                            <Card key={project._id} className="p-3">
                                                <h4 className="font-medium text-sm mb-2">{project.title}</h4>
                                                <div className="space-y-2">
                                                    <Progress value={project.completionPercentage || 0} className="h-1" />
                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                        <span>{project.tasks?.length || 0} tasks</span>
                                                        <span>{project.completionPercentage || 0}%</span>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
            </Main>
        </>
    );
}
