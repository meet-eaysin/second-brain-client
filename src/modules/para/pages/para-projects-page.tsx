import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
    Target, Plus, Search, Filter, Calendar,
    CheckCircle, Clock, AlertTriangle, Play,
    Pause, Archive, BarChart3, Users, Star
} from 'lucide-react';
import { secondBrainApi } from '@/modules/second-brain/services/second-brain-api';

export function PARAProjectsPage() {
    const [selectedView, setSelectedView] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: projectsData, isLoading } = useQuery({
        queryKey: ['second-brain', 'para-projects'],
        queryFn: secondBrainApi.projects.getAll,
    });

    const projects = projectsData?.data?.projects || [];

    const filteredProjects = projects.filter((project: any) => {
        const matchesSearch = searchQuery === '' || 
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesView = selectedView === 'all' || 
            (selectedView === 'active' && project.status === 'active') ||
            (selectedView === 'completed' && project.status === 'completed') ||
            (selectedView === 'paused' && project.status === 'paused') ||
            (selectedView === 'planning' && project.status === 'planning');

        return matchesSearch && matchesView;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'completed': return 'bg-blue-500';
            case 'paused': return 'bg-yellow-500';
            case 'planning': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const views = [
        { id: 'active', label: 'Active', count: projects.filter((p: any) => p.status === 'active').length },
        { id: 'planning', label: 'Planning', count: projects.filter((p: any) => p.status === 'planning').length },
        { id: 'paused', label: 'Paused', count: projects.filter((p: any) => p.status === 'paused').length },
        { id: 'completed', label: 'Completed', count: projects.filter((p: any) => p.status === 'completed').length },
        { id: 'all', label: 'All', count: projects.length }
    ];

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
                        <h1 className="text-3xl font-bold tracking-tight">PARA Projects</h1>
                        <p className="text-muted-foreground">
                            Projects with specific outcomes and deadlines
                        </p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Project
                    </Button>
                </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Play className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Active Projects</p>
                                <p className="text-2xl font-bold">{projects.filter((p: any) => p.status === 'active').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold">{projects.filter((p: any) => p.status === 'completed').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Pause className="h-5 w-5 text-yellow-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Paused</p>
                                <p className="text-2xl font-bold">{projects.filter((p: any) => p.status === 'paused').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Avg Progress</p>
                                <p className="text-2xl font-bold">
                                    {projects.length > 0 
                                        ? Math.round(projects.reduce((sum: number, p: any) => sum + (p.completionPercentage || 0), 0) / projects.length)
                                        : 0
                                    }%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                </Button>
            </div>

            {/* View Tabs */}
            <Tabs value={selectedView} onValueChange={setSelectedView}>
                <TabsList className="grid w-full grid-cols-5">
                    {views.map((view) => (
                        <TabsTrigger key={view.id} value={view.id} className="text-xs">
                            {view.label} ({view.count})
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={selectedView} className="space-y-4">
                    {filteredProjects.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Projects are specific outcomes with deadlines. Start by creating your first project.
                                </p>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create First Project
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredProjects.map((project: any) => (
                                <Card key={project._id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg ${getStatusColor(project.status)} flex items-center justify-center text-white`}>
                                                    <Target className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                                                    <CardDescription className="line-clamp-2">
                                                        {project.description}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {project.priority === 'high' && (
                                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={getStatusColor(project.status) + ' text-white'}>
                                                {project.status}
                                            </Badge>
                                            <Badge variant="outline">
                                                {project.area || 'General'}
                                            </Badge>
                                            {project.priority === 'high' && (
                                                <Badge variant="destructive" className="text-xs">
                                                    High Priority
                                                </Badge>
                                            )}
                                        </div>

                                        {project.completionPercentage !== undefined && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span>Progress</span>
                                                    <span>{project.completionPercentage}%</span>
                                                </div>
                                                <Progress value={project.completionPercentage} className="h-2" />
                                            </div>
                                        )}

                                        {project.deadline && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                Deadline: {new Date(project.deadline).toLocaleDateString()}
                                            </div>
                                        )}

                                        {project.tags && project.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {project.tags.slice(0, 3).map((tag: string) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                                {project.tags.length > 3 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{project.tags.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 pt-2">
                                            <Button size="sm" variant="outline" className="flex-1">
                                                View Details
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <BarChart3 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
            </Main>
        </>
    );
}
