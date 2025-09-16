import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, TableIcon, Columns, List, Grid, Calendar, Clock, Database } from 'lucide-react';
import type { ViewType } from '@/types/document.types.ts';

interface DatabaseEmptyStateProps {
    viewType: ViewType;
    onAddRecord: () => void;
    databaseName?: string;
}

export function DatabaseEmptyState({ viewType, onAddRecord, databaseName }: DatabaseEmptyStateProps) {
    const getViewConfig = (type: ViewType) => {
        switch (type) {
            case 'TABLE':
                return {
                    icon: <TableIcon className="h-12 w-12" />,
                    title: 'No records in this table',
                    description: 'This table view is empty. Add your first record to get started with organizing your data in rows and columns.',
                    tips: [
                        'Use table view for detailed data analysis',
                        'Sort and filter columns easily',
                        'Perfect for spreadsheet-like data'
                    ]
                };
            case 'BOARD':
                return {
                    icon: <Columns className="h-12 w-12" />,
                    title: 'No cards in this board',
                    description: 'This board view is empty. Add records to see them organized as cards grouped by your select properties.',
                    tips: [
                        'Great for project management',
                        'Drag and drop between columns',
                        'Visual workflow management'
                    ]
                };
            case 'GALLERY':
                return {
                    icon: <Grid className="h-12 w-12" />,
                    title: 'No items in this gallery',
                    description: 'This gallery view is empty. Add records to see them displayed as visual cards in a grid layout.',
                    tips: [
                        'Perfect for visual content',
                        'Great for portfolios and catalogs',
                        'Easy to browse and preview'
                    ]
                };
            case 'LIST':
                return {
                    icon: <List className="h-12 w-12" />,
                    title: 'No items in this list',
                    description: 'This list view is empty. Add records to see them in a clean, simple list format.',
                    tips: [
                        'Clean and minimal design',
                        'Quick scanning of information',
                        'Mobile-friendly layout'
                    ]
                };
            case 'CALENDAR':
                return {
                    icon: <Calendar className="h-12 w-12" />,
                    title: 'No events in this calendar',
                    description: 'This calendar view is empty. Add records with dates to see them organized by time.',
                    tips: [
                        'Perfect for scheduling',
                        'Time-based organization',
                        'Coming soon!'
                    ]
                };
            case 'TIMELINE':
                return {
                    icon: <Clock className="h-12 w-12" />,
                    title: 'No events in this timeline',
                    description: 'This timeline view is empty. Add records to see them arranged chronologically.',
                    tips: [
                        'Great for project timelines',
                        'Chronological organization',
                        'Coming soon!'
                    ]
                };
            default:
                return {
                    icon: <Database className="h-12 w-12" />,
                    title: 'No records found',
                    description: 'This view is empty. Add your first record to get started.',
                    tips: ['Add records to populate this view']
                };
        }
    };

    const config = getViewConfig(viewType);

    return (
        <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardContent className="flex flex-col items-center justify-center py-16 px-8">
                {/* Icon */}
                <div className="rounded-full bg-muted p-6 mb-6 text-muted-foreground">
                    {config.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold mb-3 text-center">
                    {config.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-center mb-6 max-w-md leading-relaxed">
                    {config.description}
                </p>

                {/* Tips */}
                {config.tips.length > 0 && (
                    <div className="mb-8 text-center">
                        <p className="text-sm font-medium text-muted-foreground mb-3">
                            💡 {viewType.charAt(0) + viewType.slice(1).toLowerCase()} view tips:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            {config.tips.map((tip, index) => (
                                <li key={index}>• {tip}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action Button */}
                <Button onClick={onAddRecord} size="lg" className="min-w-[160px]">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Record
                </Button>

                {/* Database name */}
                {databaseName && (
                    <p className="text-xs text-muted-foreground mt-4">
                        in "{databaseName}"
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

// Alternative compact empty state for smaller spaces
export function CompactEmptyState({ viewType, onAddRecord }: Omit<DatabaseEmptyStateProps, 'databaseName'>) {
    const getViewIcon = (type: ViewType) => {
        switch (type) {
            case 'TABLE': return <TableIcon className="h-8 w-8" />;
            case 'BOARD': return <Columns className="h-8 w-8" />;
            case 'GALLERY': return <Grid className="h-8 w-8" />;
            case 'LIST': return <List className="h-8 w-8" />;
            case 'CALENDAR': return <Calendar className="h-8 w-8" />;
            case 'TIMELINE': return <Clock className="h-8 w-8" />;
            default: return <Database className="h-8 w-8" />;
        }
    };

    return (
        <div className="text-center py-12">
            <div className="rounded-full bg-muted p-4 mx-auto mb-4 w-fit text-muted-foreground">
                {getViewIcon(viewType)}
            </div>
            <h3 className="text-lg font-medium mb-2">No records in this {viewType.toLowerCase()}</h3>
            <p className="text-muted-foreground mb-6">Add your first record to get started</p>
            <Button onClick={onAddRecord}>
                <Plus className="mr-2 h-4 w-4" />
                Add Record
            </Button>
        </div>
    );
}
