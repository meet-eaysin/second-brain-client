import React, { useState } from 'react';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
    Database, Plus, Search, Filter, BookOpen,
    Link, FileText, Video, Mic, Image,
    Star, Calendar, Tag, ExternalLink
} from 'lucide-react';

const mockResources = [
    {
        id: '1',
        title: 'React Documentation',
        description: 'Official React documentation and guides',
        type: 'documentation',
        url: 'https://react.dev',
        tags: ['react', 'javascript', 'frontend'],
        category: 'Development',
        isFavorite: true,
        dateAdded: '2024-01-15',
        lastAccessed: '2024-01-14'
    },
    {
        id: '2',
        title: 'Design System Principles',
        description: 'Collection of design system best practices',
        type: 'article',
        tags: ['design', 'ui', 'ux'],
        category: 'Design',
        isFavorite: false,
        dateAdded: '2024-01-12',
        lastAccessed: '2024-01-13'
    },
    {
        id: '3',
        title: 'Productivity Masterclass',
        description: 'Video course on productivity techniques',
        type: 'video',
        tags: ['productivity', 'learning'],
        category: 'Personal Development',
        isFavorite: true,
        dateAdded: '2024-01-10',
        lastAccessed: '2024-01-11'
    }
];

const resourceTypes = [
    { id: 'all', label: 'All', icon: Database },
    { id: 'article', label: 'Articles', icon: FileText },
    { id: 'documentation', label: 'Documentation', icon: BookOpen },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'podcast', label: 'Podcasts', icon: Mic },
    { id: 'image', label: 'Images', icon: Image },
    { id: 'link', label: 'Links', icon: Link }
];

export function PARAResourcesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    const filteredResources = mockResources.filter(resource => {
        const matchesSearch = searchQuery === '' || 
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = selectedType === 'all' || resource.type === selectedType;

        return matchesSearch && matchesType;
    });

    const getTypeIcon = (type: string) => {
        const typeConfig = resourceTypes.find(t => t.id === type);
        return typeConfig?.icon || FileText;
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'article': return 'text-blue-600';
            case 'documentation': return 'text-green-600';
            case 'video': return 'text-red-600';
            case 'podcast': return 'text-purple-600';
            case 'image': return 'text-pink-600';
            case 'link': return 'text-orange-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <>
            <EnhancedHeader />

            <Main className="space-y-8">
                {/* Clean Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">PARA Resources</h1>
                        <p className="text-muted-foreground">
                            Reference materials for future use
                        </p>
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Resource
                    </Button>
                </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Resources</p>
                                <p className="text-2xl font-bold">{mockResources.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Favorites</p>
                                <p className="text-2xl font-bold">{mockResources.filter(r => r.isFavorite).length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Categories</p>
                                <p className="text-2xl font-bold">{new Set(mockResources.map(r => r.category)).size}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Added This Week</p>
                                <p className="text-2xl font-bold">2</p>
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
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {resourceTypes.slice(0, 4).map((type) => {
                        const Icon = type.icon;
                        return (
                            <Button
                                key={type.id}
                                variant={selectedType === type.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedType(type.id)}
                                className="gap-2"
                            >
                                <Icon className="h-3 w-3" />
                                {type.label}
                            </Button>
                        );
                    })}
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    More Filters
                </Button>
            </div>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Database className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No resources found</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Resources are reference materials for future use. Start building your knowledge base.
                        </p>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add First Resource
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResources.map((resource) => {
                        const Icon = getTypeIcon(resource.type);
                        return (
                            <Card key={resource.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center`}>
                                                <Icon className={`h-5 w-5 ${getTypeColor(resource.type)}`} />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {resource.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {resource.isFavorite && (
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                            )}
                                            {resource.url && (
                                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={getTypeColor(resource.type)}>
                                            {resource.type}
                                        </Badge>
                                        <Badge variant="outline">
                                            {resource.category}
                                        </Badge>
                                    </div>

                                    {resource.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {resource.tags.slice(0, 3).map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {resource.tags.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{resource.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span>Added: {new Date(resource.dateAdded).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>Accessed: {new Date(resource.lastAccessed).toLocaleDateString()}</span>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            {resource.url ? 'Open Link' : 'View Details'}
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <Star className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
            </Main>
        </>
    );
}
