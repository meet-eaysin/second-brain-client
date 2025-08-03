import React, { useState } from 'react';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    Circle, Plus, Search, Filter, Target,
    CheckSquare, BookOpen, Users, TrendingUp,
    Calendar, Star, BarChart3
} from 'lucide-react';

const mockAreas = [
    {
        id: '1',
        title: 'Health & Fitness',
        description: 'Maintaining physical and mental well-being',
        color: 'bg-green-500',
        projects: 3,
        tasks: 12,
        notes: 8,
        lastActivity: '2024-01-15',
        status: 'active'
    },
    {
        id: '2', 
        title: 'Career Development',
        description: 'Professional growth and skill development',
        color: 'bg-blue-500',
        projects: 5,
        tasks: 18,
        notes: 15,
        lastActivity: '2024-01-14',
        status: 'active'
    },
    {
        id: '3',
        title: 'Personal Finance',
        description: 'Managing money and investments',
        color: 'bg-purple-500',
        projects: 2,
        tasks: 7,
        notes: 12,
        lastActivity: '2024-01-13',
        status: 'active'
    }
];

export function PARAAreasPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAreas = mockAreas.filter(area =>
        area.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <EnhancedHeader />

            <Main className="space-y-8">
                {/* Clean Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">PARA Areas</h1>
                        <p className="text-muted-foreground">
                            Ongoing areas of responsibility to maintain
                        </p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Area
                    </Button>
                </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Circle className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Areas</p>
                                <p className="text-2xl font-bold">{mockAreas.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Active Projects</p>
                                <p className="text-2xl font-bold">{mockAreas.reduce((sum, area) => sum + area.projects, 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-orange-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Open Tasks</p>
                                <p className="text-2xl font-bold">{mockAreas.reduce((sum, area) => sum + area.tasks, 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Notes</p>
                                <p className="text-2xl font-bold">{mockAreas.reduce((sum, area) => sum + area.notes, 0)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search areas..."
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

            {/* Areas Grid */}
            {filteredAreas.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Circle className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No areas found</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Areas are ongoing responsibilities to maintain. Create your first area of focus.
                        </p>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create First Area
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAreas.map((area) => (
                        <Card key={area.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-lg ${area.color} flex items-center justify-center text-white`}>
                                            <Circle className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{area.title}</CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {area.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                            <Target className="h-3 w-3" />
                                            Projects
                                        </div>
                                        <div className="text-lg font-semibold">{area.projects}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                            <CheckSquare className="h-3 w-3" />
                                            Tasks
                                        </div>
                                        <div className="text-lg font-semibold">{area.tasks}</div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                            <BookOpen className="h-3 w-3" />
                                            Notes
                                        </div>
                                        <div className="text-lg font-semibold">{area.notes}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    Last activity: {new Date(area.lastActivity).toLocaleDateString()}
                                </div>

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
            </Main>
        </>
    );
}
