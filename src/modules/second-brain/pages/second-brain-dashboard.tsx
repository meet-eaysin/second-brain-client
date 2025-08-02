import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
    Brain, Plus, CheckSquare, Target, BookOpen, 
    Users, Calendar, TrendingUp, Clock, Zap,
    ArrowRight, Star, Lightbulb
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';

export function SecondBrainDashboard() {
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['second-brain', 'dashboard'],
        queryFn: secondBrainApi.getDashboard,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const {
        todayTasks = [],
        upcomingDeadlines = [],
        activeProjects = [],
        recentNotes = [],
        currentGoals = [],
        todayHabits = [],
        moodEntry,
        weeklyStats = {}
    } = dashboardData?.data || {};

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Brain className="h-8 w-8 text-primary" />
                        Second Brain
                    </h1>
                    <p className="text-muted-foreground">
                        Your personal productivity and knowledge management system
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Quick Capture
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                                <p className="text-2xl font-bold">{weeklyStats.tasksCompleted || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Active Projects</p>
                                <p className="text-2xl font-bold">{weeklyStats.projectsActive || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-purple-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Notes Created</p>
                                <p className="text-2xl font-bold">{weeklyStats.notesCreated || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">Habits Done</p>
                                <p className="text-2xl font-bold">{weeklyStats.habitsCompleted || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Tasks */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Today's Tasks
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="gap-1">
                            View All <ArrowRight className="h-3 w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {todayTasks.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No tasks for today</p>
                        ) : (
                            todayTasks.slice(0, 5).map((task: any) => (
                                <div key={task._id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm flex-1">{task.title}</span>
                                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                                        {task.priority}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Active Projects */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Active Projects
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="gap-1">
                            View All <ArrowRight className="h-3 w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {activeProjects.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No active projects</p>
                        ) : (
                            activeProjects.slice(0, 3).map((project: any) => (
                                <div key={project._id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{project.title}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {project.completionPercentage}%
                                        </span>
                                    </div>
                                    <Progress value={project.completionPercentage} className="h-2" />
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Current Goals */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Current Goals
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="gap-1">
                            View All <ArrowRight className="h-3 w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {currentGoals.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No active goals</p>
                        ) : (
                            currentGoals.map((goal: any) => (
                                <div key={goal._id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium">{goal.title}</span>
                                        <p className="text-xs text-muted-foreground">{goal.type}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {goal.progressPercentage || 0}%
                                    </Badge>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Secondary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Notes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Recent Notes
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="gap-1">
                            View All <ArrowRight className="h-3 w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {recentNotes.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent notes</p>
                        ) : (
                            recentNotes.slice(0, 4).map((note: any) => (
                                <div key={note._id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium">{note.title}</span>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(note.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        {note.type}
                                    </Badge>
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
                            View All <ArrowRight className="h-3 w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {todayHabits.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No habits for today</p>
                        ) : (
                            todayHabits.map((habit: any) => (
                                <div key={habit._id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50">
                                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm flex-1">{habit.title}</span>
                                    <Badge variant="outline" className="text-xs">
                                        {habit.frequency}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
