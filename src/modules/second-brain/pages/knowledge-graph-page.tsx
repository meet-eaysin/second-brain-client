import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, Search, Filter, Settings } from 'lucide-react';

const KnowledgeGraphPage: React.FC = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Knowledge Graph</h1>
                    <p className="text-muted-foreground">
                        Visualize connections between your tasks, projects, notes, and ideas
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                    <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Network className="h-5 w-5" />
                        Knowledge Graph Visualization
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-96 bg-muted/20 rounded-lg border-2 border-dashed">
                        <div className="text-center space-y-4">
                            <Network className="h-12 w-12 mx-auto text-muted-foreground" />
                            <div>
                                <h3 className="text-lg font-medium">Knowledge Graph Coming Soon</h3>
                                <p className="text-muted-foreground">
                                    Interactive visualization of your Second Brain connections
                                </p>
                            </div>
                            <Button variant="outline">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Connection Types</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm">Task → Project</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">Project → Goal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="text-sm">Note → Book</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span className="text-sm">Habit → Goal</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Graph Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Nodes</span>
                            <span className="text-sm font-medium">0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Total Connections</span>
                            <span className="text-sm font-medium">0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Clusters</span>
                            <span className="text-sm font-medium">0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Orphaned Nodes</span>
                            <span className="text-sm font-medium">0</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                            Find Orphaned Items
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                            Suggest Connections
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                            Export Graph Data
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                            Generate Report
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default KnowledgeGraphPage;
