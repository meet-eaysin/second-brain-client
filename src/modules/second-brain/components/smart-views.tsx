import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Eye, Clock, AlertTriangle, CheckSquare, 
    Target, Users, Calendar, TrendingUp,
    Filter, BarChart3, Zap, BookOpen,
    ArrowRight, Star, Pin
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';

interface SmartViewsProps {
    module?: 'tasks' | 'projects' | 'notes' | 'all';
    onItemClick?: (item: any, type: string) => void;
}

export function SmartViews({ module = 'all', onItemClick }: SmartViewsProps) {
    const [selectedView, setSelectedView] = useState('today');

    // Fetch data for smart views
    const { data: smartViewData, isLoading } = useQuery({
        queryKey: ['second-brain', 'smart-views', module],
        queryFn: async () => {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);

            const [tasks, projects, notes, people, habits] = await Promise.all([
                secondBrainApi.tasks.getAll(),
                secondBrainApi.projects.getAll(),
                secondBrainApi.notes.getAll(),
                secondBrainApi.people.getAll(),
                secondBrainApi.habits.getAll()
            ]);

            return { tasks, projects, notes, people, habits };
        }
    });

    const data = smartViewData?.data || {};

    // Smart view configurations
    const smartViews = [
        {
            id: 'today',
            title: 'Today',
            icon: Calendar,
            description: 'Items due or scheduled for today',
            color: 'text-blue-600',
            filter: (items: any[], type: string) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                return items.filter(item => {
                    if (type === 'tasks' && item.dueDate) {
                        const dueDate = new Date(item.dueDate);
                        return dueDate >= today && dueDate < tomorrow;
                    }
                    if (type === 'projects' && item.deadline) {
                        const deadline = new Date(item.deadline);
                        return deadline >= today && deadline < tomorrow;
                    }
                    if (type === 'habits') {
                        return item.frequency === 'daily' || 
                               (item.frequency === 'weekly' && item.customFrequency?.daysOfWeek?.includes(today.getDay()));
                    }
                    return false;
                });
            }
        },
        {
            id: 'overdue',
            title: 'Overdue',
            icon: AlertTriangle,
            description: 'Items past their due date',
            color: 'text-red-600',
            filter: (items: any[], type: string) => {
                const now = new Date();
                return items.filter(item => {
                    if (type === 'tasks' && item.dueDate && item.status !== 'completed') {
                        return new Date(item.dueDate) < now;
                    }
                    if (type === 'projects' && item.deadline && item.status !== 'completed') {
                        return new Date(item.deadline) < now;
                    }
                    return false;
                });
            }
        },
        {
            id: 'next-actions',
            title: 'Next Actions',
            icon: ArrowRight,
            description: 'Ready to work on',
            color: 'text-green-600',
            filter: (items: any[], type: string) => {
                if (type === 'tasks') {
                    return items.filter(item => 
                        item.status === 'todo' && 
                        item.priority === 'high' &&
                        (!item.dueDate || new Date(item.dueDate) >= new Date())
                    );
                }
                if (type === 'projects') {
                    return items.filter(item => 
                        item.status === 'active' && 
                        item.completionPercentage < 100
                    );
                }
                return [];
            }
        },
        {
            id: 'waiting',
            title: 'Waiting For',
            icon: Clock,
            description: 'Blocked or delegated items',
            color: 'text-yellow-600',
            filter: (items: any[], type: string) => {
                if (type === 'tasks') {
                    return items.filter(item => 
                        item.status === 'waiting' || 
                        item.status === 'delegated'
                    );
                }
                if (type === 'projects') {
                    return items.filter(item => item.status === 'paused');
                }
                return [];
            }
        },
        {
            id: 'high-priority',
            title: 'High Priority',
            icon: Star,
            description: 'Important items requiring attention',
            color: 'text-purple-600',
            filter: (items: any[], type: string) => {
                if (type === 'tasks') {
                    return items.filter(item => 
                        item.priority === 'high' && 
                        item.status !== 'completed'
                    );
                }
                if (type === 'projects') {
                    return items.filter(item => 
                        item.priority === 'high' && 
                        item.status === 'active'
                    );
                }
                if (type === 'notes') {
                    return items.filter(item => item.isFavorite || item.isPinned);
                }
                return [];
            }
        },
        {
            id: 'recent',
            title: 'Recently Updated',
            icon: TrendingUp,
            description: 'Items modified in the last 7 days',
            color: 'text-indigo-600',
            filter: (items: any[], type: string) => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                
                return items.filter(item => 
                    new Date(item.updatedAt) > weekAgo
                ).sort((a, b) => 
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
            }
        }
    ];

    const currentView = smartViews.find(view => view.id === selectedView);

    const getFilteredData = () => {
        if (!currentView || !data) return {};

        const result: Record<string, any[]> = {};

        if (module === 'all' || module === 'tasks') {
            result.tasks = currentView.filter(data.tasks?.data?.tasks || [], 'tasks');
        }
        if (module === 'all' || module === 'projects') {
            result.projects = currentView.filter(data.projects?.data?.projects || [], 'projects');
        }
        if (module === 'all' || module === 'notes') {
            result.notes = currentView.filter(data.notes?.data?.notes || [], 'notes');
        }
        if (module === 'all') {
            result.people = currentView.filter(data.people?.data?.people || [], 'people');
            result.habits = currentView.filter(data.habits?.data?.habits || [], 'habits');
        }

        return result;
    };

    const filteredData = getFilteredData();

    const renderItem = (item: any, type: string) => {
        const getIcon = () => {
            switch (type) {
                case 'tasks': return CheckSquare;
                case 'projects': return Target;
                case 'notes': return BookOpen;
                case 'people': return Users;
                case 'habits': return Zap;
                default: return CheckSquare;
            }
        };

        const getStatusColor = () => {
            if (type === 'tasks') {
                switch (item.status) {
                    case 'completed': return 'text-green-600';
                    case 'in-progress': return 'text-blue-600';
                    case 'waiting': return 'text-yellow-600';
                    default: return 'text-gray-600';
                }
            }
            if (type === 'projects') {
                switch (item.status) {
                    case 'completed': return 'text-green-600';
                    case 'active': return 'text-blue-600';
                    case 'paused': return 'text-yellow-600';
                    default: return 'text-gray-600';
                }
            }
            return 'text-gray-600';
        };

        const Icon = getIcon();

        return (
            <div
                key={item._id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onItemClick?.(item, type)}
            >
                <Icon className={`h-4 w-4 ${getStatusColor()}`} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{item.title || item.firstName + ' ' + item.lastName}</h4>
                        {item.priority && (
                            <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                                {item.priority}
                            </Badge>
                        )}
                        {item.status && (
                            <Badge variant="outline" className="text-xs">
                                {item.status}
                            </Badge>
                        )}
                        {item.isPinned && <Pin className="h-3 w-3 text-orange-500" />}
                        {item.isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {item.dueDate && (
                            <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        )}
                        {item.deadline && (
                            <span>Deadline: {new Date(item.deadline).toLocaleDateString()}</span>
                        )}
                        {item.completionPercentage !== undefined && (
                            <span>{item.completionPercentage}% complete</span>
                        )}
                        {item.area && (
                            <Badge variant="outline" className="text-xs">
                                {item.area}
                            </Badge>
                        )}
                    </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* View Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {smartViews.map((view) => {
                    const Icon = view.icon;
                    const totalItems = Object.values(filteredData).flat().length;
                    
                    return (
                        <Button
                            key={view.id}
                            variant={selectedView === view.id ? 'default' : 'outline'}
                            onClick={() => setSelectedView(view.id)}
                            className="gap-2 whitespace-nowrap"
                        >
                            <Icon className={`h-4 w-4 ${selectedView === view.id ? '' : view.color}`} />
                            {view.title}
                            {selectedView === view.id && totalItems > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {totalItems}
                                </Badge>
                            )}
                        </Button>
                    );
                })}
            </div>

            {/* Current View Content */}
            {currentView && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <currentView.icon className={`h-5 w-5 ${currentView.color}`} />
                            {currentView.title}
                        </CardTitle>
                        <CardDescription>{currentView.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {Object.keys(filteredData).length === 0 || Object.values(filteredData).every(arr => arr.length === 0) ? (
                            <div className="text-center py-8">
                                <currentView.icon className={`h-12 w-12 ${currentView.color} mx-auto mb-4 opacity-50`} />
                                <h3 className="text-lg font-medium mb-2">No items found</h3>
                                <p className="text-muted-foreground">
                                    No items match the "{currentView.title}" criteria
                                </p>
                            </div>
                        ) : (
                            <Tabs defaultValue={Object.keys(filteredData)[0]} className="w-full">
                                <TabsList className="grid w-full grid-cols-auto">
                                    {Object.entries(filteredData).map(([type, items]) => (
                                        items.length > 0 && (
                                            <TabsTrigger key={type} value={type} className="capitalize">
                                                {type} ({items.length})
                                            </TabsTrigger>
                                        )
                                    ))}
                                </TabsList>
                                
                                {Object.entries(filteredData).map(([type, items]) => (
                                    items.length > 0 && (
                                        <TabsContent key={type} value={type} className="space-y-3">
                                            {items.map(item => renderItem(item, type))}
                                        </TabsContent>
                                    )
                                ))}
                            </Tabs>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
