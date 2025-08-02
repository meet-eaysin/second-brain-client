import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Network, Target, CheckSquare, BookOpen, Users, 
    Calendar, Zap, Search, Filter, Eye, Link,
    ArrowRight, BarChart3, Layers
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';

interface Node {
    id: string;
    type: 'project' | 'task' | 'note' | 'person' | 'goal' | 'habit';
    title: string;
    status?: string;
    connections: string[];
    metadata: any;
}

interface Connection {
    source: string;
    target: string;
    type: 'project-task' | 'project-note' | 'project-person' | 'goal-project' | 'note-task' | 'person-project';
    strength: number;
}

export function InterconnectionGraph() {
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);

    // Fetch all data for interconnection analysis
    const { data: allData, isLoading } = useQuery({
        queryKey: ['second-brain', 'interconnections'],
        queryFn: async () => {
            const [projects, tasks, notes, people, goals, habits] = await Promise.all([
                secondBrainApi.projects.getAll(),
                secondBrainApi.tasks.getAll(),
                secondBrainApi.notes.getAll(),
                secondBrainApi.people.getAll(),
                secondBrainApi.goals.getAll(),
                secondBrainApi.habits.getAll()
            ]);

            return { projects, tasks, notes, people, goals, habits };
        }
    });

    useEffect(() => {
        if (allData) {
            const { projects, tasks, notes, people, goals, habits } = allData;
            
            // Build nodes
            const nodeList: Node[] = [];
            const connectionList: Connection[] = [];

            // Add project nodes
            projects?.data?.projects?.forEach((project: any) => {
                nodeList.push({
                    id: project._id,
                    type: 'project',
                    title: project.title,
                    status: project.status,
                    connections: [
                        ...(project.tasks || []),
                        ...(project.notes || []),
                        ...(project.people || [])
                    ],
                    metadata: project
                });

                // Add connections
                project.tasks?.forEach((taskId: string) => {
                    connectionList.push({
                        source: project._id,
                        target: taskId,
                        type: 'project-task',
                        strength: 1
                    });
                });

                project.notes?.forEach((noteId: string) => {
                    connectionList.push({
                        source: project._id,
                        target: noteId,
                        type: 'project-note',
                        strength: 1
                    });
                });

                project.people?.forEach((personId: string) => {
                    connectionList.push({
                        source: project._id,
                        target: personId,
                        type: 'project-person',
                        strength: 1
                    });
                });
            });

            // Add task nodes
            tasks?.data?.tasks?.forEach((task: any) => {
                nodeList.push({
                    id: task._id,
                    type: 'task',
                    title: task.title,
                    status: task.status,
                    connections: [
                        ...(task.notes || []),
                        ...(task.project ? [task.project] : [])
                    ],
                    metadata: task
                });

                // Add note connections
                task.notes?.forEach((noteId: string) => {
                    connectionList.push({
                        source: task._id,
                        target: noteId,
                        type: 'note-task',
                        strength: 1
                    });
                });
            });

            // Add note nodes
            notes?.data?.notes?.forEach((note: any) => {
                nodeList.push({
                    id: note._id,
                    type: 'note',
                    title: note.title,
                    status: note.type,
                    connections: [
                        ...(note.tasks || []),
                        ...(note.project ? [note.project] : []),
                        ...(note.people || [])
                    ],
                    metadata: note
                });
            });

            // Add people nodes
            people?.data?.people?.forEach((person: any) => {
                nodeList.push({
                    id: person._id,
                    type: 'person',
                    title: `${person.firstName} ${person.lastName}`,
                    status: person.relationship,
                    connections: [
                        ...(person.projects || []),
                        ...(person.tasks || []),
                        ...(person.notes || [])
                    ],
                    metadata: person
                });
            });

            // Add goal nodes
            goals?.data?.goals?.forEach((goal: any) => {
                nodeList.push({
                    id: goal._id,
                    type: 'goal',
                    title: goal.title,
                    status: goal.status,
                    connections: [
                        ...(goal.projects || []),
                        ...(goal.habits || [])
                    ],
                    metadata: goal
                });

                // Add goal-project connections
                goal.projects?.forEach((projectId: string) => {
                    connectionList.push({
                        source: goal._id,
                        target: projectId,
                        type: 'goal-project',
                        strength: 2
                    });
                });
            });

            // Add habit nodes
            habits?.data?.habits?.forEach((habit: any) => {
                nodeList.push({
                    id: habit._id,
                    type: 'habit',
                    title: habit.title,
                    status: habit.isActive ? 'active' : 'inactive',
                    connections: [
                        ...(habit.goal ? [habit.goal] : [])
                    ],
                    metadata: habit
                });
            });

            setNodes(nodeList);
            setConnections(connectionList);
        }
    }, [allData]);

    const filteredNodes = nodes.filter(node => {
        const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' || node.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const getNodeIcon = (type: string) => {
        switch (type) {
            case 'project': return Target;
            case 'task': return CheckSquare;
            case 'note': return BookOpen;
            case 'person': return Users;
            case 'goal': return Target;
            case 'habit': return Zap;
            default: return Network;
        }
    };

    const getNodeColor = (type: string) => {
        switch (type) {
            case 'project': return 'bg-blue-500';
            case 'task': return 'bg-green-500';
            case 'note': return 'bg-purple-500';
            case 'person': return 'bg-orange-500';
            case 'goal': return 'bg-red-500';
            case 'habit': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    const getConnectionStats = () => {
        const stats = {
            totalNodes: nodes.length,
            totalConnections: connections.length,
            byType: nodes.reduce((acc, node) => {
                acc[node.type] = (acc[node.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
            mostConnected: nodes
                .sort((a, b) => b.connections.length - a.connections.length)
                .slice(0, 5)
        };
        return stats;
    };

    const stats = getConnectionStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Network className="h-6 w-6" />
                        Knowledge Graph
                    </h2>
                    <p className="text-muted-foreground">
                        Explore connections between your projects, tasks, notes, and people
                    </p>
                </div>
                <Button variant="outline" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    View Analytics
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Network className="h-5 w-5 text-blue-500" />
                            <div>
                                <div className="text-2xl font-bold">{stats.totalNodes}</div>
                                <div className="text-sm text-muted-foreground">Total Items</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Link className="h-5 w-5 text-green-500" />
                            <div>
                                <div className="text-2xl font-bold">{stats.totalConnections}</div>
                                <div className="text-sm text-muted-foreground">Connections</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-purple-500" />
                            <div>
                                <div className="text-2xl font-bold">{stats.byType.project || 0}</div>
                                <div className="text-sm text-muted-foreground">Projects</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Layers className="h-5 w-5 text-orange-500" />
                            <div>
                                <div className="text-2xl font-bold">
                                    {stats.mostConnected[0]?.connections.length || 0}
                                </div>
                                <div className="text-sm text-muted-foreground">Max Connections</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Filters and Search */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Explore Connections</CardTitle>
                            <CardDescription>
                                Search and filter your knowledge graph
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search items..."
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
                                        <SelectItem value="project">Projects</SelectItem>
                                        <SelectItem value="task">Tasks</SelectItem>
                                        <SelectItem value="note">Notes</SelectItem>
                                        <SelectItem value="person">People</SelectItem>
                                        <SelectItem value="goal">Goals</SelectItem>
                                        <SelectItem value="habit">Habits</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Node List */}
                            <div className="max-h-[400px] overflow-auto space-y-2">
                                {filteredNodes.map((node) => {
                                    const NodeIcon = getNodeIcon(node.type);
                                    return (
                                        <div
                                            key={node.id}
                                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                                                selectedNode?.id === node.id ? 'bg-muted border-primary' : ''
                                            }`}
                                            onClick={() => setSelectedNode(node)}
                                        >
                                            <div className={`p-2 rounded ${getNodeColor(node.type)} text-white`}>
                                                <NodeIcon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{node.title}</h4>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Badge variant="outline" className="text-xs">
                                                        {node.type}
                                                    </Badge>
                                                    {node.status && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {node.status}
                                                        </Badge>
                                                    )}
                                                    <span>{node.connections.length} connections</span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Selected Node Details */}
                <div className="space-y-4">
                    {selectedNode ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {React.createElement(getNodeIcon(selectedNode.type), { className: "h-5 w-5" })}
                                    {selectedNode.title}
                                </CardTitle>
                                <CardDescription>
                                    {selectedNode.type} • {selectedNode.connections.length} connections
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Node Details */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline">{selectedNode.type}</Badge>
                                        {selectedNode.status && (
                                            <Badge variant="secondary">{selectedNode.status}</Badge>
                                        )}
                                    </div>
                                    
                                    {selectedNode.metadata.description && (
                                        <p className="text-sm text-muted-foreground">
                                            {selectedNode.metadata.description}
                                        </p>
                                    )}
                                </div>

                                {/* Connected Items */}
                                <div className="space-y-3">
                                    <h4 className="font-medium">Connected Items</h4>
                                    <div className="space-y-2">
                                        {selectedNode.connections.slice(0, 5).map((connectionId) => {
                                            const connectedNode = nodes.find(n => n.id === connectionId);
                                            if (!connectedNode) return null;

                                            const ConnectedIcon = getNodeIcon(connectedNode.type);
                                            return (
                                                <div
                                                    key={connectionId}
                                                    className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted/50"
                                                    onClick={() => setSelectedNode(connectedNode)}
                                                >
                                                    <div className={`p-1 rounded ${getNodeColor(connectedNode.type)} text-white`}>
                                                        <ConnectedIcon className="h-3 w-3" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium">{connectedNode.title}</div>
                                                        <div className="text-xs text-muted-foreground">{connectedNode.type}</div>
                                                    </div>
                                                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                </div>
                                            );
                                        })}
                                        {selectedNode.connections.length > 5 && (
                                            <div className="text-sm text-muted-foreground text-center">
                                                +{selectedNode.connections.length - 5} more connections
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="space-y-2">
                                    <h4 className="font-medium">Quick Actions</h4>
                                    <div className="space-y-1">
                                        <Button variant="outline" size="sm" className="w-full gap-2">
                                            <Eye className="h-3 w-3" />
                                            View Details
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full gap-2">
                                            <Link className="h-3 w-3" />
                                            Add Connection
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full gap-2">
                                            <BarChart3 className="h-3 w-3" />
                                            View Analytics
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">Select an Item</h3>
                                <p className="text-muted-foreground">
                                    Click on any item to explore its connections
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Most Connected Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Most Connected</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {stats.mostConnected.slice(0, 5).map((node, index) => {
                                const NodeIcon = getNodeIcon(node.type);
                                return (
                                    <div
                                        key={node.id}
                                        className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted/50"
                                        onClick={() => setSelectedNode(node)}
                                    >
                                        <div className="text-sm font-medium w-4">#{index + 1}</div>
                                        <div className={`p-1 rounded ${getNodeColor(node.type)} text-white`}>
                                            <NodeIcon className="h-3 w-3" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium truncate">{node.title}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {node.connections.length} connections
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
