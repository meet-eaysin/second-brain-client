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
import {
    BookOpen, Plus, Calendar, Search, Filter,
    Smile, Meh, Frown, Sun, Moon, Coffee,
    Heart, Star, Edit, Trash2, Eye,
    TrendingUp, BarChart3, Clock, Tag
} from 'lucide-react';
import { secondBrainApi } from '@/modules/second-brain/services/second-brain-api';
import { toast } from 'sonner';

interface JournalEntry {
    _id: string;
    title?: string;
    content: string;
    date: string;
    type: 'daily' | 'gratitude' | 'reflection' | 'goal-review' | 'free-form';
    mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
    energy?: 'high' | 'medium' | 'low';
    weather?: string;
    tags: string[];
    isPrivate: boolean;
    isFavorite: boolean;
    wordCount: number;
    createdAt: string;
    updatedAt: string;
}

const moodIcons = {
    great: { icon: Smile, color: 'text-green-500', label: 'Great' },
    good: { icon: Smile, color: 'text-blue-500', label: 'Good' },
    neutral: { icon: Meh, color: 'text-yellow-500', label: 'Neutral' },
    bad: { icon: Frown, color: 'text-orange-500', label: 'Bad' },
    terrible: { icon: Frown, color: 'text-red-500', label: 'Terrible' }
};

const journalTemplates = [
    {
        id: 'daily',
        title: 'Daily Reflection',
        content: `**Today's Highlights:**
- 

**Challenges I Faced:**
- 

**What I Learned:**
- 

**Tomorrow's Focus:**
- `
    },
    {
        id: 'gratitude',
        title: 'Gratitude Journal',
        content: `**Three Things I'm Grateful For:**
1. 
2. 
3. 

**Why I'm Grateful:**
- 

**How I Can Show Gratitude:**
- `
    },
    {
        id: 'goal-review',
        title: 'Goal Review',
        content: `**Progress on Goals:**
- 

**Obstacles Encountered:**
- 

**Adjustments Needed:**
- 

**Next Steps:**
- `
    }
];

export function JournalPage() {
    const [selectedView, setSelectedView] = useState('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
        type: 'daily',
        isPrivate: false,
        isFavorite: false,
        tags: [],
        date: new Date().toISOString().split('T')[0]
    });

    const queryClient = useQueryClient();

    const { data: journalData, isLoading } = useQuery({
        queryKey: ['second-brain', 'journal'],
        queryFn: secondBrainApi.journal.getAll,
    });

    const createEntryMutation = useMutation({
        mutationFn: secondBrainApi.journal.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'journal'] });
            toast.success('Journal entry created successfully');
            setIsCreateDialogOpen(false);
            setNewEntry({
                type: 'daily',
                isPrivate: false,
                isFavorite: false,
                tags: [],
                date: new Date().toISOString().split('T')[0]
            });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create journal entry');
        },
    });

    const updateEntryMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<JournalEntry> }) =>
            secondBrainApi.journal.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'journal'] });
            toast.success('Journal entry updated successfully');
        },
    });

    const entries = journalData?.data?.entries || [];

    const filteredEntries = entries.filter((entry: JournalEntry) => {
        const matchesSearch = searchQuery === '' || 
            entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesView = selectedView === 'recent' || 
            (selectedView === 'favorites' && entry.isFavorite) ||
            (selectedView === 'daily' && entry.type === 'daily') ||
            (selectedView === 'gratitude' && entry.type === 'gratitude') ||
            (selectedView === 'this-week' && new Date(entry.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

        return matchesSearch && matchesView;
    });

    const handleCreateEntry = () => {
        if (!newEntry.content) {
            toast.error('Journal content is required');
            return;
        }
        
        const entryData = {
            ...newEntry,
            wordCount: newEntry.content?.split(' ').length || 0
        };
        
        createEntryMutation.mutate(entryData);
    };

    const handleTemplateSelect = (template: typeof journalTemplates[0]) => {
        setNewEntry(prev => ({
            ...prev,
            title: template.title,
            content: template.content,
            type: template.id as any
        }));
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'daily': return 'bg-blue-500';
            case 'gratitude': return 'bg-green-500';
            case 'reflection': return 'bg-purple-500';
            case 'goal-review': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    const views = [
        { id: 'recent', label: 'Recent', count: entries.length },
        { id: 'favorites', label: 'Favorites', count: entries.filter((e: JournalEntry) => e.isFavorite).length },
        { id: 'daily', label: 'Daily', count: entries.filter((e: JournalEntry) => e.type === 'daily').length },
        { id: 'gratitude', label: 'Gratitude', count: entries.filter((e: JournalEntry) => e.type === 'gratitude').length },
        { id: 'this-week', label: 'This Week', count: entries.filter((e: JournalEntry) => new Date(e.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length }
    ];

    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum: number, entry: JournalEntry) => sum + entry.wordCount, 0);
    const averageWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
    const currentStreak = 7; // This would be calculated based on consecutive days

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
                        <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
                        <p className="text-muted-foreground">
                            Reflect, record, and remember your journey
                        </p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Entry
                            </Button>
                        </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Journal Entry</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {/* Templates */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Quick Templates</label>
                                <div className="flex gap-2">
                                    {journalTemplates.map((template) => (
                                        <Button
                                            key={template.id}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleTemplateSelect(template)}
                                        >
                                            {template.title}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title (Optional)</label>
                                    <Input
                                        placeholder="Entry title..."
                                        value={newEntry.title || ''}
                                        onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date</label>
                                    <Input
                                        type="date"
                                        value={newEntry.date || ''}
                                        onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type</label>
                                    <Select 
                                        value={newEntry.type} 
                                        onValueChange={(value) => setNewEntry(prev => ({ ...prev, type: value as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily Reflection</SelectItem>
                                            <SelectItem value="gratitude">Gratitude</SelectItem>
                                            <SelectItem value="reflection">Reflection</SelectItem>
                                            <SelectItem value="goal-review">Goal Review</SelectItem>
                                            <SelectItem value="free-form">Free Form</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Mood</label>
                                    <Select 
                                        value={newEntry.mood || ''} 
                                        onValueChange={(value) => setNewEntry(prev => ({ ...prev, mood: value as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="How are you feeling?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="great">😊 Great</SelectItem>
                                            <SelectItem value="good">🙂 Good</SelectItem>
                                            <SelectItem value="neutral">😐 Neutral</SelectItem>
                                            <SelectItem value="bad">🙁 Bad</SelectItem>
                                            <SelectItem value="terrible">😢 Terrible</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Content *</label>
                                <Textarea
                                    placeholder="Write your thoughts..."
                                    value={newEntry.content || ''}
                                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                                    rows={12}
                                    className="resize-none"
                                />
                                <div className="text-xs text-muted-foreground">
                                    {newEntry.content?.split(' ').length || 0} words
                                </div>
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
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Entries</p>
                                <p className="text-2xl font-bold">{totalEntries}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Current Streak</p>
                                <p className="text-2xl font-bold">{currentStreak} days</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Words</p>
                                <p className="text-2xl font-bold">{totalWords.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Avg Words/Entry</p>
                                <p className="text-2xl font-bold">{averageWordsPerEntry}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search journal entries..."
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
                    {filteredEntries.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No journal entries found</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Start your journaling journey by creating your first entry.
                                </p>
                                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Write First Entry
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredEntries.map((entry: JournalEntry) => (
                                <Card key={entry._id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${getTypeColor(entry.type)} flex items-center justify-center text-white`}>
                                                    <BookOpen className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        {entry.title || `${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} Entry`}
                                                    </CardTitle>
                                                    <CardDescription className="flex items-center gap-2">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(entry.date).toLocaleDateString()}
                                                        {entry.mood && (
                                                            <>
                                                                <span>•</span>
                                                                <span className={moodIcons[entry.mood].color}>
                                                                    {moodIcons[entry.mood].label}
                                                                </span>
                                                            </>
                                                        )}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {entry.isFavorite && (
                                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                )}
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-3 w-3" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={getTypeColor(entry.type) + ' text-white'}>
                                                {entry.type}
                                            </Badge>
                                            <Badge variant="outline">
                                                {entry.wordCount} words
                                            </Badge>
                                            {entry.isPrivate && (
                                                <Badge variant="outline" className="text-orange-600">
                                                    Private
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {entry.content}
                                        </p>

                                        {entry.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {entry.tags.map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs gap-1">
                                                        <Tag className="h-2 w-2" />
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
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
