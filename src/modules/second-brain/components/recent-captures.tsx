import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    CheckSquare, 
    BookOpen, 
    Lightbulb, 
    Clock, 
    Tag,
    MoreHorizontal,
    Edit,
    Trash2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { secondBrainApi } from '../services/second-brain-api';
import { formatDistanceToNow } from 'date-fns';

interface RecentCapturesProps {
    limit?: number;
    onItemEdit?: (item: any) => void;
    onItemDelete?: (item: any) => void;
}

export function RecentCaptures({ 
    limit = 20, 
    onItemEdit, 
    onItemDelete 
}: RecentCapturesProps) {
    const { data: captures, isLoading, error } = useQuery({
        queryKey: ['recent-captures', limit],
        queryFn: () => secondBrainApi.getRecentCaptures(limit),
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 60 * 1000, // Refetch every minute
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'task':
                return <CheckSquare className="h-4 w-4" />;
            case 'note':
                return <BookOpen className="h-4 w-4" />;
            case 'idea':
                return <Lightbulb className="h-4 w-4" />;
            default:
                return <BookOpen className="h-4 w-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'task':
                return 'bg-blue-100 text-blue-800';
            case 'note':
                return 'bg-green-100 text-green-800';
            case 'idea':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
            case 'urgent':
                return 'bg-red-100 text-red-800';
            case 'medium':
                return 'bg-orange-100 text-orange-800';
            case 'low':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Captures
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Captures
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Failed to load recent captures. Please try again.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const items = captures?.data || [];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Captures
                    <Badge variant="secondary" className="ml-auto">
                        {items.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Clock className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No captures yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Start capturing tasks, notes, and ideas to see them here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {Array.isArray(items) && items?.map((item: any) => (
                            <div
                                key={item._id || item.id}
                                className="group flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex-shrink-0 mt-0.5">
                                    {getTypeIcon(item.type)}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-medium text-sm line-clamp-2">
                                            {item.title}
                                        </h4>
                                        
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                                >
                                                    <MoreHorizontal className="h-3 w-3" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onItemEdit?.(item)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => onItemDelete?.(item)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    
                                    {item.content && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {item.content}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className={`text-xs ${getTypeColor(item.type)}`}>
                                            {item.type}
                                        </Badge>
                                        
                                        {item.priority && (
                                            <Badge variant="outline" className={`text-xs ${getPriorityColor(item.priority)}`}>
                                                {item.priority}
                                            </Badge>
                                        )}
                                        
                                        {item.area && (
                                            <Badge variant="outline" className="text-xs">
                                                {item.area}
                                            </Badge>
                                        )}
                                        
                                        {item.tags && item.tags.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Tag className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    {item.tags.slice(0, 2).join(', ')}
                                                    {item.tags.length > 2 && ` +${item.tags.length - 2}`}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <span className="text-xs text-muted-foreground ml-auto">
                                            {formatDistanceToNow(new Date(item.capturedAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
