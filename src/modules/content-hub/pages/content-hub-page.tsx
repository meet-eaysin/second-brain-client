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
    Megaphone, Plus, Search, Filter, Calendar,
    Edit, Trash2, Eye, Share, BarChart3,
    Youtube, Twitter, Linkedin, Instagram,
    FileText, Video, Mic, Image, Clock,
    TrendingUp, Target, CheckCircle, AlertCircle
} from 'lucide-react';
import { secondBrainApi } from '@/modules/second-brain/services/second-brain-api';
import { toast } from 'sonner';

interface ContentItem {
    _id: string;
    title: string;
    description?: string;
    type: 'blog-post' | 'video' | 'podcast' | 'social-post' | 'newsletter' | 'course' | 'ebook';
    platform: 'youtube' | 'twitter' | 'linkedin' | 'instagram' | 'blog' | 'podcast' | 'email' | 'other';
    status: 'idea' | 'planning' | 'writing' | 'editing' | 'scheduled' | 'published' | 'archived';
    content?: string;
    publishDate?: string;
    scheduledDate?: string;
    url?: string;
    tags: string[];
    category: string;
    targetAudience?: string;
    keywords: string[];
    metrics?: {
        views?: number;
        likes?: number;
        shares?: number;
        comments?: number;
        engagement?: number;
    };
    seoScore?: number;
    wordCount?: number;
    estimatedReadTime?: number;
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    updatedAt: string;
}

const contentTypes = [
    { id: 'blog-post', label: 'Blog Post', icon: FileText },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'podcast', label: 'Podcast', icon: Mic },
    { id: 'social-post', label: 'Social Post', icon: Share },
    { id: 'newsletter', label: 'Newsletter', icon: FileText },
    { id: 'course', label: 'Course', icon: Target },
    { id: 'ebook', label: 'E-book', icon: FileText }
];

const platforms = [
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
    { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { id: 'blog', label: 'Blog', icon: FileText, color: 'text-gray-600' },
    { id: 'podcast', label: 'Podcast', icon: Mic, color: 'text-purple-600' },
    { id: 'email', label: 'Email', icon: FileText, color: 'text-green-600' }
];

export function ContentHubPage() {
    const [selectedView, setSelectedView] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newContent, setNewContent] = useState<Partial<ContentItem>>({
        type: 'blog-post',
        platform: 'blog',
        status: 'idea',
        priority: 'medium',
        tags: [],
        keywords: []
    });

    const queryClient = useQueryClient();

    const { data: contentData, isLoading } = useQuery({
        queryKey: ['second-brain', 'content'],
        queryFn: () => secondBrainApi.content?.getAll() || Promise.resolve({ data: { content: [] } }),
    });

    const createContentMutation = useMutation({
        mutationFn: (data: Partial<ContentItem>) => secondBrainApi.content?.create(data) || Promise.resolve({}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'content'] });
            toast.success('Content item created successfully');
            setIsCreateDialogOpen(false);
            setNewContent({
                type: 'blog-post',
                platform: 'blog',
                status: 'idea',
                priority: 'medium',
                tags: [],
                keywords: []
            });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create content item');
        },
    });

    const content = contentData?.data?.content || [];

    const filteredContent = content.filter((item: ContentItem) => {
        const matchesSearch = searchQuery === '' || 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesView = selectedView === 'all' || 
            (selectedView === 'published' && item.status === 'published') ||
            (selectedView === 'in-progress' && ['writing', 'editing', 'planning'].includes(item.status)) ||
            (selectedView === 'scheduled' && item.status === 'scheduled') ||
            (selectedView === 'ideas' && item.status === 'idea') ||
            (selectedView === 'high-performing' && item.metrics && item.metrics.engagement && item.metrics.engagement > 5);

        return matchesSearch && matchesView;
    });

    const handleCreateContent = () => {
        if (!newContent.title) {
            toast.error('Content title is required');
            return;
        }
        createContentMutation.mutate(newContent);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-500';
            case 'scheduled': return 'bg-blue-500';
            case 'editing': return 'bg-orange-500';
            case 'writing': return 'bg-yellow-500';
            case 'planning': return 'bg-purple-500';
            case 'idea': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const getTypeIcon = (type: string) => {
        const typeConfig = contentTypes.find(t => t.id === type);
        return typeConfig?.icon || FileText;
    };

    const getPlatformIcon = (platform: string) => {
        const platformConfig = platforms.find(p => p.id === platform);
        return platformConfig?.icon || FileText;
    };

    const views = [
        { id: 'all', label: 'All Content', count: content.length },
        { id: 'published', label: 'Published', count: content.filter((c: ContentItem) => c.status === 'published').length },
        { id: 'in-progress', label: 'In Progress', count: content.filter((c: ContentItem) => ['writing', 'editing', 'planning'].includes(c.status)).length },
        { id: 'scheduled', label: 'Scheduled', count: content.filter((c: ContentItem) => c.status === 'scheduled').length },
        { id: 'ideas', label: 'Ideas', count: content.filter((c: ContentItem) => c.status === 'idea').length },
        { id: 'high-performing', label: 'High Performing', count: content.filter((c: ContentItem) => c.metrics && c.metrics.engagement && c.metrics.engagement > 5).length }
    ];

    const totalContent = content.length;
    const publishedContent = content.filter((c: ContentItem) => c.status === 'published').length;
    const scheduledContent = content.filter((c: ContentItem) => c.status === 'scheduled').length;
    const totalViews = content.reduce((sum: number, c: ContentItem) => sum + (c.metrics?.views || 0), 0);

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
                        <h1 className="text-3xl font-bold tracking-tight">Content Hub</h1>
                        <p className="text-muted-foreground">
                            Plan, create, and manage your content across all platforms
                        </p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Content
                            </Button>
                        </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create New Content</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-medium">Title *</label>
                                <Input
                                    placeholder="Content title"
                                    value={newContent.title || ''}
                                    onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <Select 
                                    value={newContent.type} 
                                    onValueChange={(value) => setNewContent(prev => ({ ...prev, type: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contentTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Platform</label>
                                <Select 
                                    value={newContent.platform} 
                                    onValueChange={(value) => setNewContent(prev => ({ ...prev, platform: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {platforms.map((platform) => (
                                            <SelectItem key={platform.id} value={platform.id}>
                                                {platform.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select 
                                    value={newContent.status} 
                                    onValueChange={(value) => setNewContent(prev => ({ ...prev, status: value as any }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="idea">Idea</SelectItem>
                                        <SelectItem value="planning">Planning</SelectItem>
                                        <SelectItem value="writing">Writing</SelectItem>
                                        <SelectItem value="editing">Editing</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Priority</label>
                                <Select 
                                    value={newContent.priority} 
                                    onValueChange={(value) => setNewContent(prev => ({ ...prev, priority: value as any }))}
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
                            <div className="col-span-2 space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Brief description of the content..."
                                    value={newContent.description || ''}
                                    onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target Audience</label>
                                <Input
                                    placeholder="Who is this content for?"
                                    value={newContent.targetAudience || ''}
                                    onChange={(e) => setNewContent(prev => ({ ...prev, targetAudience: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Input
                                    placeholder="Content category"
                                    value={newContent.category || ''}
                                    onChange={(e) => setNewContent(prev => ({ ...prev, category: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleCreateContent}
                                disabled={createContentMutation.isPending}
                            >
                                {createContentMutation.isPending ? 'Creating...' : 'Create Content'}
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
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Content</p>
                                <p className="text-2xl font-bold">{totalContent}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Published</p>
                                <p className="text-2xl font-bold">{publishedContent}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Scheduled</p>
                                <p className="text-2xl font-bold">{scheduledContent}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Views</p>
                                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
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
                        placeholder="Search content..."
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
                <TabsList className="grid w-full grid-cols-6">
                    {views.map((view) => (
                        <TabsTrigger key={view.id} value={view.id} className="text-xs">
                            {view.label} ({view.count})
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={selectedView} className="space-y-4">
                    {filteredContent.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No content found</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Start creating content to build your audience and share your expertise.
                                </p>
                                <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create First Content
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredContent.map((item: ContentItem) => {
                                const TypeIcon = getTypeIcon(item.type);
                                const PlatformIcon = getPlatformIcon(item.platform);
                                
                                return (
                                    <Card key={item._id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg ${getStatusColor(item.status)} flex items-center justify-center text-white`}>
                                                        <TypeIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                                                        <CardDescription className="flex items-center gap-2">
                                                            <PlatformIcon className="h-3 w-3" />
                                                            {item.platform}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={getStatusColor(item.status) + ' text-white'}>
                                                    {item.status}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {item.type.replace('-', ' ')}
                                                </Badge>
                                                {item.priority === 'high' && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        High Priority
                                                    </Badge>
                                                )}
                                            </div>

                                            {item.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}

                                            {item.metrics && (
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    {item.metrics.views && (
                                                        <div className="flex items-center gap-1">
                                                            <Eye className="h-3 w-3" />
                                                            {item.metrics.views.toLocaleString()}
                                                        </div>
                                                    )}
                                                    {item.metrics.engagement && (
                                                        <div className="flex items-center gap-1">
                                                            <TrendingUp className="h-3 w-3" />
                                                            {item.metrics.engagement}%
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {item.scheduledDate && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 pt-2">
                                                <Button size="sm" variant="outline" className="flex-1 gap-2">
                                                    <Eye className="h-3 w-3" />
                                                    View
                                                </Button>
                                                <Button size="sm" variant="outline" className="flex-1 gap-2">
                                                    <BarChart3 className="h-3 w-3" />
                                                    Analytics
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
            </Main>
        </>
    );
}
