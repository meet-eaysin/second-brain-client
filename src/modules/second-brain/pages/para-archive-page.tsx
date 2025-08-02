import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Archive, Search, Filter, Target, Circle,
    Database, CheckSquare, BookOpen, Calendar,
    RotateCcw, Trash2, Download, Eye
} from 'lucide-react';

const mockArchivedItems = [
    {
        id: '1',
        title: 'Website Redesign Project',
        description: 'Complete redesign of company website',
        type: 'project',
        originalArea: 'Work',
        archivedDate: '2024-01-10',
        completedDate: '2024-01-08',
        status: 'completed',
        tags: ['web', 'design', 'frontend']
    },
    {
        id: '2',
        title: 'Marketing Strategy Notes',
        description: 'Q3 marketing strategy and campaign ideas',
        type: 'note',
        originalArea: 'Marketing',
        archivedDate: '2024-01-05',
        status: 'archived',
        tags: ['marketing', 'strategy', 'q3']
    },
    {
        id: '3',
        title: 'Personal Finance Management',
        description: 'Area for managing personal finances',
        type: 'area',
        archivedDate: '2023-12-20',
        status: 'archived',
        tags: ['finance', 'personal']
    },
    {
        id: '4',
        title: 'React Best Practices Guide',
        description: 'Comprehensive guide to React development',
        type: 'resource',
        originalArea: 'Development',
        archivedDate: '2023-12-15',
        status: 'archived',
        tags: ['react', 'development', 'guide']
    }
];

const itemTypes = [
    { id: 'all', label: 'All Items', icon: Archive },
    { id: 'project', label: 'Projects', icon: Target },
    { id: 'area', label: 'Areas', icon: Circle },
    { id: 'resource', label: 'Resources', icon: Database },
    { id: 'note', label: 'Notes', icon: BookOpen },
    { id: 'task', label: 'Tasks', icon: CheckSquare }
];

export function PARAArchivePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [sortBy, setSortBy] = useState('archived-date');

    const filteredItems = mockArchivedItems.filter(item => {
        const matchesSearch = searchQuery === '' || 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = selectedType === 'all' || item.type === selectedType;

        return matchesSearch && matchesType;
    });

    const getTypeIcon = (type: string) => {
        const typeConfig = itemTypes.find(t => t.id === type);
        return typeConfig?.icon || Archive;
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'project': return 'text-green-600';
            case 'area': return 'text-blue-600';
            case 'resource': return 'text-purple-600';
            case 'note': return 'text-orange-600';
            case 'task': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-500 text-white">Completed</Badge>;
            case 'archived':
                return <Badge variant="secondary">Archived</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Archive className="h-8 w-8" />
                        PARA Archive
                    </h1>
                    <p className="text-muted-foreground">Inactive items from all PARA categories</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export Archive
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Cleanup
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Archive className="h-5 w-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Archived</p>
                                <p className="text-2xl font-bold">{mockArchivedItems.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Completed Projects</p>
                                <p className="text-2xl font-bold">
                                    {mockArchivedItems.filter(item => item.type === 'project' && item.status === 'completed').length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">This Month</p>
                                <p className="text-2xl font-bold">
                                    {mockArchivedItems.filter(item => 
                                        new Date(item.archivedDate).getMonth() === new Date().getMonth()
                                    ).length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Storage Used</p>
                                <p className="text-2xl font-bold">2.4 GB</p>
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
                        placeholder="Search archived items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {itemTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="archived-date">Archived Date</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="type">Type</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    More Filters
                </Button>
            </div>

            {/* Archived Items */}
            {filteredItems.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Archive className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No archived items found</h3>
                        <p className="text-muted-foreground text-center">
                            {searchQuery ? 'Try adjusting your search terms' : 'Completed and inactive items will appear here'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredItems.map((item) => {
                        const Icon = getTypeIcon(item.type);
                        return (
                            <Card key={item.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <Icon className={`h-5 w-5 ${getTypeColor(item.type)}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-medium line-clamp-1">{item.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    {getStatusBadge(item.status)}
                                                    <Badge variant="outline" className={getTypeColor(item.type)}>
                                                        {item.type}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>Archived: {new Date(item.archivedDate).toLocaleDateString()}</span>
                                                    {item.originalArea && (
                                                        <>
                                                            <span>•</span>
                                                            <span>From: {item.originalArea}</span>
                                                        </>
                                                    )}
                                                    {item.completedDate && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Completed: {new Date(item.completedDate).toLocaleDateString()}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" className="gap-2">
                                                        <Eye className="h-3 w-3" />
                                                        View
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="gap-2">
                                                        <RotateCcw className="h-3 w-3" />
                                                        Restore
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="gap-2 text-red-600">
                                                        <Trash2 className="h-3 w-3" />
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>

                                            {item.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {item.tags.slice(0, 4).map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    {item.tags.length > 4 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{item.tags.length - 4}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
