import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Clock } from 'lucide-react';

export function SearchPage() {
    const [query, setQuery] = useState('');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Search className="h-8 w-8" />
                    Search
                </h1>
                <p className="text-muted-foreground">Find anything across your Second Brain</p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks, notes, projects, people, and more..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-12 text-lg h-12"
                                autoFocus
                            />
                        </div>

                        {!query && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Recent Searches</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['project deadlines', 'meeting notes', 'exercise habits'].map((search) => (
                                        <Button
                                            key={search}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setQuery(search)}
                                            className="gap-2"
                                        >
                                            <Clock className="h-3 w-3" />
                                            {search}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {query && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Search className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Search functionality coming soon</h3>
                        <p className="text-muted-foreground text-center">
                            Advanced search across all your Second Brain data
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default SearchPage;
