import React from 'react';
import { DatabaseTableView } from './views/database-table-view';
import { DatabaseBoardView } from './views/database-board-view';
import { DatabaseGalleryView } from './views/database-gallery-view';
import { DatabaseListView } from './views/database-list-view';
import { DatabaseCalendarView } from './views/database-calendar-view';
import { DatabaseTimelineView } from './views/database-timeline-view';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import type { DatabaseView, DatabaseProperty, DatabaseRecord } from '@/types/database.types';

interface DatabaseViewRendererProps {
    view: DatabaseView;
    properties: DatabaseProperty[];
    records: DatabaseRecord[];
    onRecordSelect?: (record: DatabaseRecord) => void;
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
    onRecordCreate?: (groupValue?: string) => void;
    onRecordUpdate?: (recordId: string, updates: Record<string, any>) => void;
    databaseId?: string;
    isFrozen?: boolean;
}

export function DatabaseViewRenderer({
    view,
    properties,
    records,
    onRecordSelect,
    onRecordEdit,
    onRecordDelete,
    onRecordCreate,
    onRecordUpdate,
    databaseId,
    isFrozen = false,
}: DatabaseViewRendererProps) {
    // Common props for all view components
    const commonProps = {
        view,
        properties,
        records,
        onRecordSelect,
        onRecordEdit,
        onRecordDelete,
        databaseId,
        isFrozen,
    };

    // Render the appropriate view based on view type
    const renderView = () => {
        switch (view.type) {
            case 'TABLE':
                return (
                    <DatabaseTableView
                        {...commonProps}
                        onRecordCreate={onRecordCreate}
                    />
                );

            case 'BOARD':
                return (
                    <DatabaseBoardView
                        {...commonProps}
                        onRecordCreate={onRecordCreate}
                    />
                );

            case 'GALLERY':
                return <DatabaseGalleryView {...commonProps} />;

            case 'LIST':
                return (
                    <DatabaseListView
                        {...commonProps}
                        onRecordUpdate={onRecordUpdate}
                    />
                );

            case 'CALENDAR':
                return <DatabaseCalendarView {...commonProps} />;

            case 'TIMELINE':
                return <DatabaseTimelineView {...commonProps} />;

            default:
                return (
                    <Card className="border-destructive">
                        <CardContent className="flex items-center justify-center p-8">
                            <div className="text-center">
                                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-destructive mb-2">
                                    Unsupported View Type
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    The view type "{view.type}" is not supported yet.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                >
                                    Refresh Page
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
        }
    };

    return (
        <div className="w-full">
            {renderView()}
        </div>
    );
}


