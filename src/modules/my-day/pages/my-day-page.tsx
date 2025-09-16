import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
    Clock, CheckSquare, Target, Zap, Smile,
    Plus, Calendar, TrendingUp, BookOpen,
    Sun, Moon, Coffee, Star
} from 'lucide-react';
import { secondBrainApi } from '@/modules/second-brain/services/second-brain-api';
import { toast } from 'sonner';

export function MyDayPage() {
    const [moodValue, setMoodValue] = useState(5);
    const [energyValue, setEnergyValue] = useState(5);
    const [journalContent, setJournalContent] = useState('');

    const queryClient = useQueryClient();

    const { data: myDayData, isLoading } = useQuery({
        queryKey: ['second-brain', 'my-day'],
        queryFn: secondBrainApi.getMyDay,
    });

    const { data: todayHabits } = useQuery({
        queryKey: ['second-brain', 'habits', 'today'],
        queryFn: secondBrainApi.habits.getAll,
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => 
            secondBrainApi.tasks.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain'] });
            toast.success('Task updated successfully');
        },
    });

    const trackHabitMutation = useMutation({
        mutationFn: ({ id, entry }: { id: string; entry: any }) => 
            secondBrainApi.habits.trackEntry(id, entry),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'habits'] });
            toast.success('Habit tracked successfully');
        },
    });

    const createMoodMutation = useMutation({
        mutationFn: secondBrainApi.mood.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain'] });
            toast.success('Mood recorded successfully');
        },
    });

    const createJournalMutation = useMutation({
        mutationFn: secondBrainApi.journal.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain'] });
            toast.success('Journal entry saved successfully');
            setJournalContent('');
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const {
        plannedTasks = [],
        inProgressTasks = [],
        todayHabits: dayHabits = [],
        journalEntry,
        moodEntry
    } = myDayData?.data || {};

    const allTodayTasks = [...plannedTasks, ...inProgressTasks];
    const completedTasks = allTodayTasks.filter(task => task.status === 'completed');
    const completionRate = allTodayTasks.length > 0 ? (completedTasks.length / allTodayTasks.length) * 100 : 0;

    const handleTaskToggle = (taskId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
        updateTaskMutation.mutate({ id: taskId, data: { status: newStatus } });
    };

    const handleHabitToggle = (habitId: string, completed: boolean) => {
        trackHabitMutation.mutate({
            id: habitId,
            entry: {
                date: new Date(),
                completed: !completed
            }
        });
    };

    const handleMoodSubmit = () => {
        createMoodMutation.mutate({
            mood: { value: moodValue },
            energy: { value: energyValue },
            date: new Date()
        });
    };

    const handleJournalSubmit = () => {
        if (!journalContent.trim()) return;
        
        createJournalMutation.mutate({
            type: 'daily',
            title: `Daily Reflection - ${new Date().toDateString()}`,
            content: journalContent,
            date: new Date()
        });
    };

    const today = new Date();
    const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 18 ? 'Good afternoon' : 'Good evening';
    const greetingIcon = today.getHours() < 12 ? Sun : today.getHours() < 18 ? Coffee : Moon;
    const GreetingIcon = greetingIcon;

    return (
        <>
            <EnhancedHeader />

            <Main className="space-y-8">
                {/* Clean Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                            <GreetingIcon className="h-8 w-8 text-primary" />
                            {greeting}!
                        </h1>
                        <p className="text-muted-foreground">
                            {today.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                            <CheckSquare className="h-3 w-3" />
                            {completedTasks.length}/{allTodayTasks.length} tasks
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {Math.round(completionRate)}% complete
                        </Badge>
                    </div>
                </div>

            {/* Progress Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Today's Progress
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Daily Completion</span>
                                <span>{Math.round(completionRate)}%</span>
                            </div>
                            <Progress value={completionRate} className="h-3" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
                                <div className="text-muted-foreground">Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{inProgressTasks.length}</div>
                                <div className="text-muted-foreground">In Progress</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{plannedTasks.filter(t => t.status === 'todo').length}</div>
                                <div className="text-muted-foreground">Remaining</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Tasks */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <CheckSquare className="h-4 w-4" />
                            Today's Tasks
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="gap-1">
                            <Plus className="h-3 w-3" />
                            Add Task
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {allTodayTasks.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No tasks planned for today</p>
                                <Button variant="outline" size="sm" className="mt-2">
                                    Plan Your Day
                                </Button>
                            </div>
                        ) : (
                            allTodayTasks.map((task: any) => (
                                <div key={task._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1 h-auto"
                                        onClick={() => handleTaskToggle(task._id, task.status)}
                                    >
                                        <CheckSquare className={`h-5 w-5 ${
                                            task.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'
                                        }`} />
                                    </Button>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-medium ${
                                                task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                                            }`}>
                                                {task.title}
                                            </span>
                                            <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                                                {task.priority}
                                            </Badge>
                                        </div>
                                        {task.project && (
                                            <div className="text-xs text-muted-foreground">
                                                {task.project.title}
                                            </div>
                                        )}
                                    </div>
                                    {task.dueDate && (
                                        <div className="text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3 inline mr-1" />
                                            {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Today's Habits */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Today's Habits
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="gap-1">
                            <Plus className="h-3 w-3" />
                            Add Habit
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {dayHabits.length === 0 ? (
                            <div className="text-center py-8">
                                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No habits for today</p>
                                <Button variant="outline" size="sm" className="mt-2">
                                    Create Habit
                                </Button>
                            </div>
                        ) : (
                            dayHabits.map((habit: any) => (
                                <div key={habit._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-1 h-auto"
                                        onClick={() => handleHabitToggle(habit._id, habit.todayCompleted)}
                                    >
                                        <CheckSquare className={`h-5 w-5 ${
                                            habit.todayCompleted ? 'text-green-500' : 'text-muted-foreground'
                                        }`} />
                                    </Button>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{habit.title}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {habit.frequency}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Current streak: {habit.currentStreak || 0} days
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {habit.completionRate || 0}% rate
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mood & Energy */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smile className="h-5 w-5" />
                            How are you feeling?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {moodEntry ? (
                            <div className="text-center py-4">
                                <div className="text-2xl mb-2">{moodEntry.mood?.emoji || '😊'}</div>
                                <p className="text-sm text-muted-foreground">
                                    Mood: {moodEntry.mood?.value}/10 | Energy: {moodEntry.energy?.value}/10
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Recorded at {new Date(moodEntry.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Mood (1-10)</label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={moodValue}
                                            onChange={(e) => setMoodValue(Number(e.target.value))}
                                            className="flex-1"
                                        />
                                        <span className="text-sm font-medium w-8">{moodValue}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Energy (1-10)</label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={energyValue}
                                            onChange={(e) => setEnergyValue(Number(e.target.value))}
                                            className="flex-1"
                                        />
                                        <span className="text-sm font-medium w-8">{energyValue}</span>
                                    </div>
                                </div>
                                <Button onClick={handleMoodSubmit} className="w-full">
                                    Record Mood
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Journal */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Quick Reflection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {journalEntry ? (
                            <div className="space-y-2">
                                <p className="text-sm">{journalEntry.content}</p>
                                <p className="text-xs text-muted-foreground">
                                    Written at {new Date(journalEntry.createdAt).toLocaleTimeString()}
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    Edit Entry
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Textarea
                                    placeholder="How was your day? What are you grateful for? What did you learn?"
                                    value={journalContent}
                                    onChange={(e) => setJournalContent(e.target.value)}
                                    rows={4}
                                />
                                <Button 
                                    onClick={handleJournalSubmit} 
                                    className="w-full"
                                    disabled={!journalContent.trim()}
                                >
                                    Save Reflection
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            </Main>
        </>
    );
}
