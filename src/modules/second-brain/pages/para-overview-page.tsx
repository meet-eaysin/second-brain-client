import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Folder, Target, Layers, BookOpen, Archive,
    CheckSquare, Users, Calendar, TrendingUp,
    Plus, ArrowRight, BarChart3
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';

export function PARAOverviewPage() {
    const [selectedArea, setSelectedArea] = useState<string | null>(null);

    // Fetch data for all PARA areas
    const { data: projectsData } = useQuery({
        queryKey: ['second-brain', 'projects', 'para'],
        queryFn: () => secondBrainApi.projects.getAll({ includeStats: true }),
    });

    const { data: tasksData } = useQuery({
        queryKey: ['second-brain', 'tasks', 'para'],
        queryFn: () => secondBrainApi.tasks.getAll(),
    });

    const { data: notesData } = useQuery({
        queryKey: ['second-brain', 'notes', 'para'],
        queryFn: () => secondBrainApi.notes.getAll(),
    });

    const { data: peopleData } = useQuery({
        queryKey: ['second-brain', 'people', 'para'],
        queryFn: () => secondBrainApi.people.getAll(),
    });

    // Organize data by PARA areas
    const organizeByArea = (items: any[], areaField = 'area') => {
        return {
            projects: items?.filter(item => item[areaField] === 'projects') || [],
            areas: items?.filter(item => item[areaField] === 'areas') || [],
            resources: items?.filter(item => item[areaField] === 'resources') || [],
            archive: items?.filter(item => item[areaField] === 'archive') || []
        };
    };

    const projects = organizeByArea(projectsData?.data?.projects || []);
    const tasks = organizeByArea(tasksData?.data?.tasks || []);
    const notes = organizeByArea(notesData?.data?.notes || []);
    const people = peopleData?.data?.people || [];

    const paraAreas = [
        {
            id: 'projects',
            title: 'Projects',
            description: 'Things with a deadline and specific outcome',
            icon: Target,
            color: 'bg-blue-500',
            items: {
                projects: projects.projects.length,
                tasks: tasks.projects.length,
                notes: notes.projects.length,
                people: people.filter((p: any) => p.projects?.length > 0).length
            }
        },
        {
            id: 'areas',
            title: 'Areas',
            description: 'Ongoing responsibilities to maintain',
            icon: Layers,
            color: 'bg-green-500',
            items: {
                projects: projects.areas.length,
                tasks: tasks.areas.length,
                notes: notes.areas.length,
                people: people.filter((p: any) => p.relationship === 'colleague' || p.relationship === 'client').length
            }
        },
        {
            id: 'resources',
            title: 'Resources',
            description: 'Topics of ongoing interest for future reference',
            icon: BookOpen,
            color: 'bg-purple-500',
            items: {
                projects: projects.resources.length,
                tasks: tasks.resources.length,
                notes: notes.resources.length,
                people: people.filter((p: any) => p.relationship === 'mentor').length
            }
        },
        {
            id: 'archive',
            title: 'Archive',
            description: 'Inactive items from the other three categories',
            icon: Archive,
            color: 'bg-gray-500',
            items: {
                projects: projects.archive.length,
                tasks: tasks.archive.length,
                notes: notes.archive.length,
                people: people.filter((p: any) => p.archivedAt).length
            }
        }
    ];

    const totalItems = paraAreas.reduce((sum, area) => 
        sum + area.items.projects + area.items.tasks + area.items.notes + area.items.people, 0
    );

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Folder className="h-8 w-8 text-primary" />
                        PARA System
                    </h1>
                    <p className="text-muted-foreground">
                        Projects, Areas, Resources, and Archives - Your organizational framework
                    </p>
                </div>
                <Button className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                </Button>
            </div>

            {/* PARA Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paraAreas.map((area) => {
                    const AreaIcon = area.icon;
                    const totalAreaItems = area.items.projects + area.items.tasks + area.items.notes + area.items.people;
                    const percentage = totalItems > 0 ? (totalAreaItems / totalItems) * 100 : 0;

                    return (
                        <Card 
                            key={area.id} 
                            className={`hover:shadow-md transition-all cursor-pointer ${
                                selectedArea === area.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedArea(selectedArea === area.id ? null : area.id)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${area.color} text-white`}>
                                        <AreaIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{area.title}</CardTitle>
                                        <Badge variant="outline" className="text-xs">
                                            {totalAreaItems} items
                                        </Badge>
                                    </div>
                                </div>
                                <CardDescription className="text-sm">
                                    {area.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Distribution */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Distribution</span>
                                        <span>{Math.round(percentage)}%</span>
                                    </div>
                                    <Progress value={percentage} className="h-2" />
                                </div>

                                {/* Item Breakdown */}
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Target className="h-3 w-3 text-muted-foreground" />
                                        <span>{area.items.projects} projects</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckSquare className="h-3 w-3 text-muted-foreground" />
                                        <span>{area.items.tasks} tasks</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-3 w-3 text-muted-foreground" />
                                        <span>{area.items.notes} notes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-3 w-3 text-muted-foreground" />
                                        <span>{area.items.people} people</span>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        View All
                                    </Button>
                                    <Button size="sm" className="gap-1">
                                        <Plus className="h-3 w-3" />
                                        Add
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Detailed View */}
            {selectedArea && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {React.createElement(paraAreas.find(a => a.id === selectedArea)?.icon || Folder, { className: "h-5 w-5" })}
                            {paraAreas.find(a => a.id === selectedArea)?.title} Details
                        </CardTitle>
                        <CardDescription>
                            {paraAreas.find(a => a.id === selectedArea)?.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="projects">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="projects">Projects</TabsTrigger>
                                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                                <TabsTrigger value="notes">Notes</TabsTrigger>
                                <TabsTrigger value="people">People</TabsTrigger>
                            </TabsList>

                            <TabsContent value="projects" className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Projects in {selectedArea}</h3>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        View All <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="grid gap-3">
                                    {projects[selectedArea as keyof typeof projects].slice(0, 5).map((project: any) => (
                                        <div key={project._id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                                <h4 className="font-medium">{project.title}</h4>
                                                <p className="text-sm text-muted-foreground">{project.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                                    {project.status}
                                                </Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {project.completionPercentage || 0}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="tasks" className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Tasks in {selectedArea}</h3>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        View All <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="grid gap-3">
                                    {tasks[selectedArea as keyof typeof tasks].slice(0, 5).map((task: any) => (
                                        <div key={task._id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <CheckSquare className={`h-4 w-4 ${
                                                    task.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'
                                                }`} />
                                                <div>
                                                    <h4 className="font-medium">{task.title}</h4>
                                                    {task.project && (
                                                        <p className="text-sm text-muted-foreground">{task.project.title}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                                                    {task.priority}
                                                </Badge>
                                                {task.dueDate && (
                                                    <span className="text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3 inline mr-1" />
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="notes" className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Notes in {selectedArea}</h3>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        View All <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="grid gap-3">
                                    {notes[selectedArea as keyof typeof notes].slice(0, 5).map((note: any) => (
                                        <div key={note._id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <h4 className="font-medium">{note.title}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(note.updatedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{note.type}</Badge>
                                                {note.isFavorite && (
                                                    <Badge variant="secondary" className="gap-1">
                                                        <TrendingUp className="h-3 w-3" />
                                                        Favorite
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="people" className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">People in {selectedArea}</h3>
                                    <Button variant="outline" size="sm" className="gap-1">
                                        View All <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </div>
                                <div className="grid gap-3">
                                    {people.slice(0, 5).map((person: any) => (
                                        <div key={person._id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <div>
                                                    <h4 className="font-medium">{person.fullName}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {person.company} • {person.position}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">{person.relationship}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Organize your Second Brain with the PARA method
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
                            <Target className="h-6 w-6" />
                            <span>Create Project</span>
                            <span className="text-xs text-muted-foreground">Start a new goal-oriented project</span>
                        </Button>
                        <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
                            <Layers className="h-6 w-6" />
                            <span>Define Area</span>
                            <span className="text-xs text-muted-foreground">Set up ongoing responsibility</span>
                        </Button>
                        <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
                            <BookOpen className="h-6 w-6" />
                            <span>Save Resource</span>
                            <span className="text-xs text-muted-foreground">Store reference material</span>
                        </Button>
                        <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
                            <Archive className="h-6 w-6" />
                            <span>Review Archive</span>
                            <span className="text-xs text-muted-foreground">Clean up completed items</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
