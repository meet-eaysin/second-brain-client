import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    FileText, 
    Search, 
    Plus, 
    Filter, 
    BookOpen,
    Calendar,
    Tag
} from 'lucide-react';

const NotesPage: React.FC = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Notes</h1>
                    <p className="text-muted-foreground">
                        Capture and organize your thoughts, ideas, and knowledge
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Note
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search notes..."
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notes Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Sample Note Cards */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-base line-clamp-2">
                                    Sample Note Title {i}
                                </CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                This is a sample note content that demonstrates how notes will be displayed 
                                in the notes page. It includes some preview text to show the layout.
                            </p>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                                <Badge variant="secondary" className="text-xs">
                                    <Tag className="h-3 w-3 mr-1" />
                                    ideas
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                    <BookOpen className="h-3 w-3 mr-1" />
                                    research
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Dec {i}, 2024</span>
                                </div>
                                <span>2 min read</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State (when no notes) */}
            <Card className="hidden">
                <CardContent className="pt-6">
                    <div className="text-center py-12">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                        <p className="text-muted-foreground mb-4">
                            Start capturing your thoughts and ideas
                        </p>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create your first note
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Notes</p>
                                <p className="text-2xl font-bold">24</p>
                            </div>
                            <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">This Week</p>
                                <p className="text-2xl font-bold">5</p>
                            </div>
                            <Calendar className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Categories</p>
                                <p className="text-2xl font-bold">8</p>
                            </div>
                            <Tag className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Linked</p>
                                <p className="text-2xl font-bold">12</p>
                            </div>
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NotesPage;
