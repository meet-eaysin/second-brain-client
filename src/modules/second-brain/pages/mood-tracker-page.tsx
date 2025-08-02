import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
    Smile, Meh, Frown, Heart, Plus, Calendar,
    TrendingUp, BarChart3, Sun, Cloud, CloudRain,
    Coffee, Utensils, Dumbbell, Users, Briefcase,
    Home, Music, Book, Gamepad2, Filter, Search
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';
import { toast } from 'sonner';

interface MoodEntry {
    _id: string;
    date: string;
    mood: 1 | 2 | 3 | 4 | 5; // 1 = terrible, 5 = excellent
    energy: 1 | 2 | 3 | 4 | 5;
    stress: 1 | 2 | 3 | 4 | 5;
    sleep: 1 | 2 | 3 | 4 | 5;
    weather?: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
    activities: string[];
    notes?: string;
    factors: string[];
    gratitude?: string[];
    createdAt: string;
    updatedAt: string;
}

const moodLevels = [
    { value: 1, label: 'Terrible', emoji: '😢', color: 'text-red-500' },
    { value: 2, label: 'Bad', emoji: '🙁', color: 'text-orange-500' },
    { value: 3, label: 'Okay', emoji: '😐', color: 'text-yellow-500' },
    { value: 4, label: 'Good', emoji: '🙂', color: 'text-blue-500' },
    { value: 5, label: 'Excellent', emoji: '😊', color: 'text-green-500' }
];

const activities = [
    { id: 'exercise', label: 'Exercise', icon: Dumbbell },
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'family', label: 'Family', icon: Home },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'reading', label: 'Reading', icon: Book },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'eating', label: 'Eating Out', icon: Utensils },
    { id: 'coffee', label: 'Coffee', icon: Coffee }
];

const factors = [
    'Sleep Quality', 'Weather', 'Work Stress', 'Exercise', 'Diet',
    'Social Interaction', 'Productivity', 'Health', 'Relationships', 'Finances'
];

export function MoodTrackerPage() {
    const [selectedView, setSelectedView] = useState('recent');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newEntry, setNewEntry] = useState<Partial<MoodEntry>>({
        date: new Date().toISOString().split('T')[0],
        mood: 3,
        energy: 3,
        stress: 3,
        sleep: 3,
        activities: [],
        factors: [],
        gratitude: []
    });

    const queryClient = useQueryClient();

    const { data: moodData, isLoading } = useQuery({
        queryKey: ['second-brain', 'mood'],
        queryFn: () => secondBrainApi.mood?.getAll() || Promise.resolve({ data: { entries: [] } }),
    });

    const createEntryMutation = useMutation({
        mutationFn: (data: Partial<MoodEntry>) => secondBrainApi.mood?.create(data) || Promise.resolve({}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'mood'] });
            toast.success('Mood entry recorded successfully');
            setIsCreateDialogOpen(false);
            setNewEntry({
                date: new Date().toISOString().split('T')[0],
                mood: 3,
                energy: 3,
                stress: 3,
                sleep: 3,
                activities: [],
                factors: [],
                gratitude: []
            });
        },
    });

    const entries = moodData?.data?.entries || [];

    const handleCreateEntry = () => {
        createEntryMutation.mutate(newEntry);
    };

    const getMoodEmoji = (mood: number) => {
        const moodLevel = moodLevels.find(m => m.value === mood);
        return moodLevel?.emoji || '😐';
    };

    const getMoodColor = (mood: number) => {
        const moodLevel = moodLevels.find(m => m.value === mood);
        return moodLevel?.color || 'text-gray-500';
    };

    const getAverageMood = () => {
        if (entries.length === 0) return 0;
        const sum = entries.reduce((acc: number, entry: MoodEntry) => acc + entry.mood, 0);
        return (sum / entries.length).toFixed(1);
    };

    const getAverageEnergy = () => {
        if (entries.length === 0) return 0;
        const sum = entries.reduce((acc: number, entry: MoodEntry) => acc + entry.energy, 0);
        return (sum / entries.length).toFixed(1);
    };

    const getCurrentStreak = () => {
        // Calculate consecutive days with mood entries
        return 7; // Mock value
    };

    const views = [
        { id: 'recent', label: 'Recent', count: entries.length },
        { id: 'this-week', label: 'This Week', count: entries.filter((e: MoodEntry) => new Date(e.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length },
        { id: 'this-month', label: 'This Month', count: entries.filter((e: MoodEntry) => new Date(e.date).getMonth() === new Date().getMonth()).length },
        { id: 'analytics', label: 'Analytics', count: 0 }
    ];

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
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Heart className="h-8 w-8" />
                        Mood Tracker
                    </h1>
                    <p className="text-muted-foreground">Track your daily mood and discover patterns in your well-being</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Log Mood
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Log Your Mood</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date</label>
                                <Input
                                    type="date"
                                    value={newEntry.date || ''}
                                    onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                                />
                            </div>

                            {/* Mood Rating */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">How are you feeling?</label>
                                <div className="flex items-center justify-between">
                                    {moodLevels.map((mood) => (
                                        <Button
                                            key={mood.value}
                                            variant={newEntry.mood === mood.value ? "default" : "outline"}
                                            className="flex-col h-auto p-3"
                                            onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.value as any }))}
                                        >
                                            <span className="text-2xl mb-1">{mood.emoji}</span>
                                            <span className="text-xs">{mood.label}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Energy, Stress, Sleep */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Energy Level</label>
                                    <Select 
                                        value={newEntry.energy?.toString()} 
                                        onValueChange={(value) => setNewEntry(prev => ({ ...prev, energy: parseInt(value) as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Very Low</SelectItem>
                                            <SelectItem value="2">Low</SelectItem>
                                            <SelectItem value="3">Medium</SelectItem>
                                            <SelectItem value="4">High</SelectItem>
                                            <SelectItem value="5">Very High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Stress Level</label>
                                    <Select 
                                        value={newEntry.stress?.toString()} 
                                        onValueChange={(value) => setNewEntry(prev => ({ ...prev, stress: parseInt(value) as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Very Low</SelectItem>
                                            <SelectItem value="2">Low</SelectItem>
                                            <SelectItem value="3">Medium</SelectItem>
                                            <SelectItem value="4">High</SelectItem>
                                            <SelectItem value="5">Very High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Sleep Quality</label>
                                    <Select 
                                        value={newEntry.sleep?.toString()} 
                                        onValueChange={(value) => setNewEntry(prev => ({ ...prev, sleep: parseInt(value) as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">Very Poor</SelectItem>
                                            <SelectItem value="2">Poor</SelectItem>
                                            <SelectItem value="3">Fair</SelectItem>
                                            <SelectItem value="4">Good</SelectItem>
                                            <SelectItem value="5">Excellent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Activities */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Activities Today</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {activities.map((activity) => {
                                        const Icon = activity.icon;
                                        const isSelected = newEntry.activities?.includes(activity.id);
                                        return (
                                            <Button
                                                key={activity.id}
                                                variant={isSelected ? "default" : "outline"}
                                                size="sm"
                                                className="gap-2"
                                                onClick={() => {
                                                    const currentActivities = newEntry.activities || [];
                                                    if (isSelected) {
                                                        setNewEntry(prev => ({
                                                            ...prev,
                                                            activities: currentActivities.filter(a => a !== activity.id)
                                                        }));
                                                    } else {
                                                        setNewEntry(prev => ({
                                                            ...prev,
                                                            activities: [...currentActivities, activity.id]
                                                        }));
                                                    }
                                                }}
                                            >
                                                <Icon className="h-3 w-3" />
                                                {activity.label}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Notes (Optional)</label>
                                <Textarea
                                    placeholder="How was your day? Any thoughts or reflections..."
                                    value={newEntry.notes || ''}
                                    onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleCreateEntry}
                                disabled={createEntryMutation.isPending}
                            >
                                {createEntryMutation.isPending ? 'Saving...' : 'Save Entry'}
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
                            <Smile className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Average Mood</p>
                                <p className="text-2xl font-bold">{getAverageMood()}/5</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Average Energy</p>
                                <p className="text-2xl font-bold">{getAverageEnergy()}/5</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Current Streak</p>
                                <p className="text-2xl font-bold">{getCurrentStreak()} days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-orange-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Entries</p>
                                <p className="text-2xl font-bold">{entries.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* View Tabs */}
            <Tabs value={selectedView} onValueChange={setSelectedView}>
                <TabsList className="grid w-full grid-cols-4">
                    {views.map((view) => (
                        <TabsTrigger key={view.id} value={view.id}>
                            {view.label} {view.count > 0 && `(${view.count})`}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={selectedView} className="space-y-4">
                    {entries.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No mood entries yet</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Start tracking your mood to discover patterns and improve your well-being.
                                </p>
                                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Log First Mood
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {entries.map((entry: MoodEntry) => (
                                <Card key={entry._id}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="text-4xl">
                                                    {getMoodEmoji(entry.mood)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium">
                                                            {new Date(entry.date).toLocaleDateString('en-US', { 
                                                                weekday: 'long', 
                                                                month: 'long', 
                                                                day: 'numeric' 
                                                            })}
                                                        </h4>
                                                        <Badge variant="outline" className={getMoodColor(entry.mood)}>
                                                            Mood: {entry.mood}/5
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span>Energy: {entry.energy}/5</span>
                                                        <span>Stress: {entry.stress}/5</span>
                                                        <span>Sleep: {entry.sleep}/5</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {entry.activities.length > 0 && (
                                                    <div className="flex gap-1">
                                                        {entry.activities.slice(0, 3).map((activityId) => {
                                                            const activity = activities.find(a => a.id === activityId);
                                                            if (!activity) return null;
                                                            const Icon = activity.icon;
                                                            return (
                                                                <Badge key={activityId} variant="secondary" className="gap-1">
                                                                    <Icon className="h-3 w-3" />
                                                                    {activity.label}
                                                                </Badge>
                                                            );
                                                        })}
                                                        {entry.activities.length > 3 && (
                                                            <Badge variant="secondary">
                                                                +{entry.activities.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {entry.notes && (
                                            <div className="mt-3 pt-3 border-t">
                                                <p className="text-sm text-muted-foreground">{entry.notes}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
