import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
    Zap, Plus, CheckCircle, XCircle, Calendar,
    TrendingUp, Target, Clock, Flame, Award,
    BarChart3, Edit, Trash2, Play, Pause,
    RotateCcw, Star, Filter
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';
import { toast } from 'sonner';

interface Habit {
    _id: string;
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    customFrequency?: {
        daysOfWeek?: number[];
        timesPerWeek?: number;
        timesPerMonth?: number;
    };
    targetValue?: number;
    unit?: string;
    category: 'health' | 'productivity' | 'learning' | 'social' | 'creative' | 'spiritual' | 'other';
    priority: 'low' | 'medium' | 'high';
    isActive: boolean;
    streak: number;
    longestStreak: number;
    completedToday: boolean;
    completionRate: number;
    reminderTime?: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export function HabitsPage() {
    const [selectedView, setSelectedView] = useState('active');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newHabit, setNewHabit] = useState<Partial<Habit>>({
        frequency: 'daily',
        category: 'health',
        priority: 'medium',
        isActive: true,
        tags: []
    });

    const queryClient = useQueryClient();

    const { data: habitsData, isLoading } = useQuery({
        queryKey: ['second-brain', 'habits'],
        queryFn: secondBrainApi.habits.getAll,
    });

    const createHabitMutation = useMutation({
        mutationFn: secondBrainApi.habits.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'habits'] });
            toast.success('Habit created successfully');
            setIsCreateDialogOpen(false);
            setNewHabit({
                frequency: 'daily',
                category: 'health',
                priority: 'medium',
                isActive: true,
                tags: []
            });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create habit');
        },
    });

    const trackHabitMutation = useMutation({
        mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
            secondBrainApi.habits.trackEntry(id, { completed, date: new Date() }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'habits'] });
            toast.success('Habit tracked successfully');
        },
    });

    const updateHabitMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Habit> }) =>
            secondBrainApi.habits.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'habits'] });
            toast.success('Habit updated successfully');
        },
    });

    const habits = habitsData?.data?.habits || [];

    const filteredHabits = habits.filter((habit: Habit) => {
        switch (selectedView) {
            case 'active':
                return habit.isActive;
            case 'completed-today':
                return habit.completedToday;
            case 'pending':
                return habit.isActive && !habit.completedToday;
            case 'high-streak':
                return habit.streak >= 7;
            case 'needs-attention':
                return habit.isActive && habit.completionRate < 70;
            default:
                return true;
        }
    });

    const handleCreateHabit = () => {
        if (!newHabit.title) {
            toast.error('Habit title is required');
            return;
        }
        createHabitMutation.mutate(newHabit);
    };

    const handleTrackHabit = (habitId: string, completed: boolean) => {
        trackHabitMutation.mutate({ id: habitId, completed });
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'health': return 'bg-green-500';
            case 'productivity': return 'bg-blue-500';
            case 'learning': return 'bg-purple-500';
            case 'social': return 'bg-orange-500';
            case 'creative': return 'bg-pink-500';
            case 'spiritual': return 'bg-indigo-500';
            default: return 'bg-gray-500';
        }
    };

    const getStreakColor = (streak: number) => {
        if (streak >= 30) return 'text-purple-600';
        if (streak >= 14) return 'text-blue-600';
        if (streak >= 7) return 'text-green-600';
        if (streak >= 3) return 'text-yellow-600';
        return 'text-gray-600';
    };

    const views = [
        { id: 'active', label: 'Active', count: habits.filter((h: Habit) => h.isActive).length },
        { id: 'completed-today', label: 'Completed Today', count: habits.filter((h: Habit) => h.completedToday).length },
        { id: 'pending', label: 'Pending', count: habits.filter((h: Habit) => h.isActive && !h.completedToday).length },
        { id: 'high-streak', label: 'High Streak', count: habits.filter((h: Habit) => h.streak >= 7).length },
        { id: 'needs-attention', label: 'Needs Attention', count: habits.filter((h: Habit) => h.isActive && h.completionRate < 70).length }
    ];

    const totalActiveHabits = habits.filter((h: Habit) => h.isActive).length;
    const completedToday = habits.filter((h: Habit) => h.completedToday).length;
    const averageStreak = habits.length > 0 ? Math.round(habits.reduce((sum: number, h: Habit) => sum + h.streak, 0) / habits.length) : 0;
    const overallCompletionRate = habits.length > 0 ? Math.round(habits.reduce((sum: number, h: Habit) => sum + h.completionRate, 0) / habits.length) : 0;

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
                        <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
                        <p className="text-muted-foreground">
                            Build positive habits and track your progress
                        </p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Habit
                            </Button>
                        </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Habit</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-medium">Habit Title *</label>
                                <Input
                                    placeholder="e.g., Exercise for 30 minutes"
                                    value={newHabit.title || ''}
                                    onChange={(e) => setNewHabit(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Describe your habit and why it's important..."
                                    value={newHabit.description || ''}
                                    onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Frequency</label>
                                <Select 
                                    value={newHabit.frequency} 
                                    onValueChange={(value) => setNewHabit(prev => ({ ...prev, frequency: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select 
                                    value={newHabit.category} 
                                    onValueChange={(value) => setNewHabit(prev => ({ ...prev, category: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="health">Health & Fitness</SelectItem>
                                        <SelectItem value="productivity">Productivity</SelectItem>
                                        <SelectItem value="learning">Learning</SelectItem>
                                        <SelectItem value="social">Social</SelectItem>
                                        <SelectItem value="creative">Creative</SelectItem>
                                        <SelectItem value="spiritual">Spiritual</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Priority</label>
                                <Select 
                                    value={newHabit.priority} 
                                    onValueChange={(value) => setNewHabit(prev => ({ ...prev, priority: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Reminder Time</label>
                                <Input
                                    type="time"
                                    value={newHabit.reminderTime || ''}
                                    onChange={(e) => setNewHabit(prev => ({ ...prev, reminderTime: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleCreateHabit}
                                disabled={createHabitMutation.isPending}
                            >
                                {createHabitMutation.isPending ? 'Creating...' : 'Create Habit'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Active Habits</p>
                                <p className="text-2xl font-bold">{totalActiveHabits}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Completed Today</p>
                                <p className="text-2xl font-bold">{completedToday}/{totalActiveHabits}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Flame className="h-5 w-5 text-orange-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Average Streak</p>
                                <p className="text-2xl font-bold">{averageStreak} days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Completion Rate</p>
                                <p className="text-2xl font-bold">{overallCompletionRate}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
                    {filteredHabits.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No habits found</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Start building positive habits to improve your life.
                                </p>
                                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create First Habit
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredHabits.map((habit: Habit) => (
                                <Card key={habit._id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${getCategoryColor(habit.category)} flex items-center justify-center text-white`}>
                                                    <Zap className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{habit.title}</CardTitle>
                                                    <CardDescription>{habit.frequency}</CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {habit.priority === 'high' && (
                                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                )}
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={getCategoryColor(habit.category) + ' text-white'}>
                                                    {habit.category}
                                                </Badge>
                                                <Badge variant="outline" className={getStreakColor(habit.streak)}>
                                                    {habit.streak} day streak
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span>Completion Rate</span>
                                                <span>{habit.completionRate}%</span>
                                            </div>
                                            <Progress value={habit.completionRate} className="h-2" />
                                        </div>

                                        {habit.longestStreak > 0 && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Award className="h-3 w-3" />
                                                Longest streak: {habit.longestStreak} days
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 pt-2">
                                            <Button 
                                                size="sm" 
                                                variant={habit.completedToday ? "default" : "outline"}
                                                className="flex-1 gap-2"
                                                onClick={() => handleTrackHabit(habit._id, !habit.completedToday)}
                                                disabled={trackHabitMutation.isPending}
                                            >
                                                {habit.completedToday ? (
                                                    <>
                                                        <CheckCircle className="h-3 w-3" />
                                                        Completed
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="h-3 w-3" />
                                                        Mark Done
                                                    </>
                                                )}
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
