import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Search, 
    Filter, 
    Clock,
    FileText,
    CheckSquare,
    Target,
    User,
    BookOpen,
    Calendar,
    TrendingUp
} from 'lucide-react';

const SearchPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const searchResults = {
        all: 42,
        tasks: 15,
        projects: 8,
        notes: 12,
        people: 4,
        books: 3
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Search</h1>
                    <p className="text-muted-foreground">
                        Find anything across your Second Brain
                    </p>
                </div>
                <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Advanced Filters
                </Button>
            </div>

            {/* Search Input */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search across tasks, projects, notes, and more..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 text-lg h-12"
                        />
                    </div>
                    
                    {searchQuery && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Found {searchResults.all} results for "{searchQuery}"</span>
                            <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                0.23s
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Search Results */}
            {searchQuery ? (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="all">
                            All ({searchResults.all})
                        </TabsTrigger>
                        <TabsTrigger value="tasks">
                            <CheckSquare className="h-4 w-4 mr-1" />
                            Tasks ({searchResults.tasks})
                        </TabsTrigger>
                        <TabsTrigger value="projects">
                            <Target className="h-4 w-4 mr-1" />
                            Projects ({searchResults.projects})
                        </TabsTrigger>
                        <TabsTrigger value="notes">
                            <FileText className="h-4 w-4 mr-1" />
                            Notes ({searchResults.notes})
                        </TabsTrigger>
                        <TabsTrigger value="people">
                            <User className="h-4 w-4 mr-1" />
                            People ({searchResults.people})
                        </TabsTrigger>
                        <TabsTrigger value="books">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Books ({searchResults.books})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {/* Mixed Results */}
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-blue-100">
                                                <CheckSquare className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium mb-1">
                                                    Sample Task Result {i}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    This is a sample search result that shows how content 
                                                    will be displayed with highlighted search terms.
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                    <span>Task</span>
                                                    <span>•</span>
                                                    <span>Project Alpha</span>
                                                    <span>•</span>
                                                    <span>Updated 2 days ago</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="tasks" className="space-y-4">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <CheckSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                                            <div className="flex-1">
                                                <h3 className="font-medium mb-1">Task Result {i}</h3>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Task description with search term highlighted
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">In Progress</Badge>
                                                    <Badge variant="outline" className="text-xs">High Priority</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="projects" className="space-y-4">
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <Target className="h-5 w-5 text-green-600 mt-0.5" />
                                            <div className="flex-1">
                                                <h3 className="font-medium mb-1">Project Result {i}</h3>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Project description with search term highlighted
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">Active</Badge>
                                                    <span className="text-xs text-muted-foreground">5 tasks</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Other tab contents would be similar */}
                </Tabs>
            ) : (
                /* Recent Searches & Suggestions */
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Recent Searches
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {['project planning', 'meeting notes', 'quarterly goals', 'book recommendations'].map((term) => (
                                <button
                                    key={term}
                                    onClick={() => setSearchQuery(term)}
                                    className="block w-full text-left p-2 rounded hover:bg-muted/50 text-sm"
                                >
                                    <Search className="h-3 w-3 inline mr-2 text-muted-foreground" />
                                    {term}
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Popular Searches
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {['productivity tips', 'team collaboration', 'project status', 'weekly review'].map((term) => (
                                <button
                                    key={term}
                                    onClick={() => setSearchQuery(term)}
                                    className="block w-full text-left p-2 rounded hover:bg-muted/50 text-sm"
                                >
                                    <TrendingUp className="h-3 w-3 inline mr-2 text-muted-foreground" />
                                    {term}
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Search Tips */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Search Tips</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2 md:grid-cols-2 text-sm">
                        <div>
                            <strong>Use quotes</strong> for exact phrases: "project planning"
                        </div>
                        <div>
                            <strong>Filter by type:</strong> type:task, type:project, type:note
                        </div>
                        <div>
                            <strong>Search by date:</strong> created:today, updated:this-week
                        </div>
                        <div>
                            <strong>Find by status:</strong> status:active, status:completed
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SearchPage;
