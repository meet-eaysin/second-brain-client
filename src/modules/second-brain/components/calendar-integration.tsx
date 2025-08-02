import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Calendar, Clock, CheckSquare, Target, 
    Users, MapPin, Video, Plus, ChevronLeft, 
    ChevronRight, MoreHorizontal, Zap
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';

export function CalendarIntegration() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');

    // Get calendar data
    const { data: calendarData } = useQuery({
        queryKey: ['second-brain', 'calendar', currentDate.toISOString(), viewMode],
        queryFn: async () => {
            const startDate = getViewStartDate(currentDate, viewMode);
            const endDate = getViewEndDate(currentDate, viewMode);

            const [tasks, habits, meetings, deadlines] = await Promise.all([
                secondBrainApi.tasks.getAll({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                }),
                secondBrainApi.habits.getAll(),
                // In a real app, this would fetch from calendar API
                Promise.resolve({ data: { meetings: [] } }),
                secondBrainApi.projects.getAll({
                    hasDeadline: true
                })
            ]);

            return { tasks, habits, meetings, deadlines };
        }
    });

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        
        switch (viewMode) {
            case 'month':
                newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
                break;
            case 'week':
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
                break;
            case 'day':
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
                break;
        }
        
        setCurrentDate(newDate);
    };

    const getDateTitle = () => {
        switch (viewMode) {
            case 'month':
                return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            case 'week':
                const weekStart = getViewStartDate(currentDate, 'week');
                const weekEnd = getViewEndDate(currentDate, 'week');
                return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            case 'day':
                return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="h-6 w-6" />
                        Calendar
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-medium min-w-[200px] text-center">
                            {getDateTitle()}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                        <TabsList>
                            <TabsTrigger value="day">Day</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Event
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Calendar View */}
                <div className="lg:col-span-3">
                    <Card>
                        <CardContent className="p-0">
                            {viewMode === 'week' && <WeekView currentDate={currentDate} data={calendarData?.data} />}
                            {viewMode === 'day' && <DayView currentDate={currentDate} data={calendarData?.data} />}
                            {viewMode === 'month' && <MonthView currentDate={currentDate} data={calendarData?.data} />}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    {/* Today's Summary */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Today's Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <TodaysSummary data={calendarData?.data} />
                        </CardContent>
                    </Card>

                    {/* Upcoming Deadlines */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <UpcomingDeadlines deadlines={calendarData?.data?.deadlines?.data?.projects || []} />
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" size="sm" className="w-full gap-2">
                                <CheckSquare className="h-4 w-4" />
                                Add Task
                            </Button>
                            <Button variant="outline" size="sm" className="w-full gap-2">
                                <Target className="h-4 w-4" />
                                Create Project
                            </Button>
                            <Button variant="outline" size="sm" className="w-full gap-2">
                                <Zap className="h-4 w-4" />
                                Track Habit
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function WeekView({ currentDate, data }: { currentDate: Date; data: any }) {
    const weekStart = getViewStartDate(currentDate, 'week');
    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        return date;
    });

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="h-[600px] overflow-auto">
            {/* Header */}
            <div className="grid grid-cols-8 border-b sticky top-0 bg-background">
                <div className="p-2 border-r text-xs text-muted-foreground">Time</div>
                {days.map((day) => (
                    <div key={day.toISOString()} className="p-2 border-r text-center">
                        <div className="text-xs text-muted-foreground">
                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className={`text-lg font-medium ${
                            isToday(day) ? 'text-primary' : ''
                        }`}>
                            {day.getDate()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Time Grid */}
            <div className="relative">
                {hours.map((hour) => (
                    <div key={hour} className="grid grid-cols-8 border-b h-12">
                        <div className="p-2 border-r text-xs text-muted-foreground">
                            {hour.toString().padStart(2, '0')}:00
                        </div>
                        {days.map((day) => (
                            <div key={`${day.toISOString()}-${hour}`} className="border-r relative">
                                <DayEvents 
                                    date={day} 
                                    hour={hour}
                                    tasks={data?.tasks?.data?.tasks || []}
                                    habits={data?.habits?.data?.habits || []}
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function DayView({ currentDate, data }: { currentDate: Date; data: any }) {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="h-[600px] overflow-auto">
            <div className="space-y-1 p-4">
                {hours.map((hour) => (
                    <div key={hour} className="flex border-b pb-2">
                        <div className="w-16 text-xs text-muted-foreground pt-1">
                            {hour.toString().padStart(2, '0')}:00
                        </div>
                        <div className="flex-1 min-h-[40px] relative">
                            <DayEvents 
                                date={currentDate} 
                                hour={hour}
                                tasks={data?.tasks?.data?.tasks || []}
                                habits={data?.habits?.data?.habits || []}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MonthView({ currentDate, data }: { currentDate: Date; data: any }) {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= monthEnd || days.length < 42) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return (
        <div className="p-4">
            {/* Days of week header */}
            <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day) => (
                    <div
                        key={day.toISOString()}
                        className={`min-h-[100px] p-2 border rounded ${
                            day.getMonth() !== currentDate.getMonth() 
                                ? 'bg-muted/30 text-muted-foreground' 
                                : ''
                        } ${isToday(day) ? 'bg-primary/10 border-primary' : ''}`}
                    >
                        <div className={`text-sm font-medium mb-1 ${
                            isToday(day) ? 'text-primary' : ''
                        }`}>
                            {day.getDate()}
                        </div>
                        <div className="space-y-1">
                            <MonthDayEvents 
                                date={day}
                                tasks={data?.tasks?.data?.tasks || []}
                                habits={data?.habits?.data?.habits || []}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DayEvents({ date, hour, tasks, habits }: any) {
    const dayTasks = tasks.filter((task: any) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return isSameDay(taskDate, date) && taskDate.getHours() === hour;
    });

    const dayHabits = habits.filter((habit: any) => {
        // Check if habit should be done on this day
        return habit.frequency === 'daily' || 
               (habit.frequency === 'weekly' && habit.customFrequency?.daysOfWeek?.includes(date.getDay()));
    });

    return (
        <div className="space-y-1">
            {dayTasks.map((task: any) => (
                <div key={task._id} className="text-xs p-1 bg-blue-100 rounded truncate">
                    <CheckSquare className="h-3 w-3 inline mr-1" />
                    {task.title}
                </div>
            ))}
            {hour === 9 && dayHabits.slice(0, 2).map((habit: any) => (
                <div key={habit._id} className="text-xs p-1 bg-green-100 rounded truncate">
                    <Zap className="h-3 w-3 inline mr-1" />
                    {habit.title}
                </div>
            ))}
        </div>
    );
}

function MonthDayEvents({ date, tasks, habits }: any) {
    const dayTasks = tasks.filter((task: any) => {
        if (!task.dueDate) return false;
        return isSameDay(new Date(task.dueDate), date);
    });

    const dayHabits = habits.filter((habit: any) => {
        return habit.frequency === 'daily' || 
               (habit.frequency === 'weekly' && habit.customFrequency?.daysOfWeek?.includes(date.getDay()));
    });

    return (
        <>
            {dayTasks.slice(0, 2).map((task: any) => (
                <div key={task._id} className="text-xs p-1 bg-blue-100 rounded truncate">
                    {task.title}
                </div>
            ))}
            {dayHabits.slice(0, 1).map((habit: any) => (
                <div key={habit._id} className="text-xs p-1 bg-green-100 rounded truncate">
                    {habit.title}
                </div>
            ))}
            {(dayTasks.length + dayHabits.length) > 3 && (
                <div className="text-xs text-muted-foreground">
                    +{(dayTasks.length + dayHabits.length) - 3} more
                </div>
            )}
        </>
    );
}

function TodaysSummary({ data }: { data: any }) {
    const today = new Date();
    const todayTasks = data?.tasks?.data?.tasks?.filter((task: any) => {
        if (!task.dueDate) return false;
        return isSameDay(new Date(task.dueDate), today);
    }) || [];

    const todayHabits = data?.habits?.data?.habits?.filter((habit: any) => {
        return habit.frequency === 'daily' || 
               (habit.frequency === 'weekly' && habit.customFrequency?.daysOfWeek?.includes(today.getDay()));
    }) || [];

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tasks</span>
                <Badge variant="outline">{todayTasks.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Habits</span>
                <Badge variant="outline">{todayHabits.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Meetings</span>
                <Badge variant="outline">0</Badge>
            </div>
        </div>
    );
}

function UpcomingDeadlines({ deadlines }: { deadlines: any[] }) {
    const upcomingDeadlines = deadlines
        .filter(project => project.deadline && new Date(project.deadline) > new Date())
        .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-2">
            {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
            ) : (
                upcomingDeadlines.map((project) => (
                    <div key={project._id} className="flex items-center justify-between text-sm">
                        <span className="truncate">{project.title}</span>
                        <span className="text-muted-foreground">
                            {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
}

// Helper functions
function getViewStartDate(date: Date, view: 'month' | 'week' | 'day'): Date {
    const start = new Date(date);
    
    switch (view) {
        case 'month':
            start.setDate(1);
            start.setDate(start.getDate() - start.getDay());
            break;
        case 'week':
            start.setDate(start.getDate() - start.getDay());
            break;
        case 'day':
            // Already the correct date
            break;
    }
    
    start.setHours(0, 0, 0, 0);
    return start;
}

function getViewEndDate(date: Date, view: 'month' | 'week' | 'day'): Date {
    const end = new Date(date);
    
    switch (view) {
        case 'month':
            end.setMonth(end.getMonth() + 1, 0);
            end.setDate(end.getDate() + (6 - end.getDay()));
            break;
        case 'week':
            end.setDate(end.getDate() - end.getDay() + 6);
            break;
        case 'day':
            // Already the correct date
            break;
    }
    
    end.setHours(23, 59, 59, 999);
    return end;
}

function isToday(date: Date): boolean {
    const today = new Date();
    return isSameDay(date, today);
}

function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}
