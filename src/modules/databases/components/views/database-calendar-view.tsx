import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDatabaseContext } from '../../context/database-context';
import type { DatabaseView, DatabaseProperty, DatabaseRecord } from '@/types/database.types';

interface DatabaseCalendarViewProps {
    view: DatabaseView;
    properties: DatabaseProperty[];
    records: DatabaseRecord[];
    onRecordSelect?: (record: DatabaseRecord) => void;
    onRecordEdit?: (record: DatabaseRecord) => void;
    onRecordDelete?: (recordId: string) => void;
}

export function DatabaseCalendarView({
    view,
    properties,
    records,
    onRecordSelect,
    onRecordEdit,
    onRecordDelete,
}: DatabaseCalendarViewProps) {
    const { setDialogOpen } = useDatabaseContext();
    const [currentDate, setCurrentDate] = React.useState(new Date());

    // Find date properties for calendar display
    const dateProperties = properties.filter(p => p.type === 'DATE');
    const primaryDateProperty = dateProperties[0]; // Use first date property

    // Get current month info
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    // Generate calendar days
    const calendarDays = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
        calendarDays.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
    }

    // Group records by date
    const recordsByDate = React.useMemo(() => {
        if (!primaryDateProperty) return {};

        const grouped: Record<string, DatabaseRecord[]> = {};
        
        records.forEach(record => {
            const dateValue = record.properties[primaryDateProperty.id];
            if (dateValue) {
                const date = new Date(String(dateValue));
                const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
                
                if (!grouped[dateKey]) {
                    grouped[dateKey] = [];
                }
                grouped[dateKey].push(record);
            }
        });

        return grouped;
    }, [records, primaryDateProperty]);

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === month;
    };

    const getDateKey = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    if (!primaryDateProperty) {
        return (
            <div className="flex items-center justify-center h-64 text-center">
                <div>
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                        Calendar view requires a DATE property
                    </p>
                    <Button variant="outline" onClick={() => setDialogOpen('create-property')}>
                        Add DATE Property
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                        Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <Card>
                <CardContent className="p-0">
                    {/* Days of week header */}
                    <div className="grid grid-cols-7 border-b">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7">
                        {calendarDays.map((date, index) => {
                            const dateKey = getDateKey(date);
                            const dayRecords = recordsByDate[dateKey] || [];
                            const isCurrentMonthDay = isCurrentMonth(date);
                            const isTodayDate = isToday(date);

                            return (
                                <div 
                                    key={index} 
                                    className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                                        !isCurrentMonthDay ? 'bg-muted/30' : ''
                                    } ${isTodayDate ? 'bg-primary/5' : ''}`}
                                >
                                    {/* Date number */}
                                    <div className={`text-sm font-medium mb-1 ${
                                        !isCurrentMonthDay ? 'text-muted-foreground' : 
                                        isTodayDate ? 'text-primary' : ''
                                    }`}>
                                        {date.getDate()}
                                    </div>

                                    {/* Records for this date */}
                                    <div className="space-y-1">
                                        {dayRecords.slice(0, 3).map(record => {
                                            const titleProperty = properties.find(p => p.type === 'TEXT') || properties[0];
                                            const title = titleProperty ? record.properties[titleProperty.id] : 'Untitled';

                                            return (
                                                <div
                                                    key={record.id}
                                                    className="text-xs p-1 bg-primary/10 text-primary rounded cursor-pointer hover:bg-primary/20 truncate"
                                                    onClick={() => onRecordEdit?.(record)}
                                                    title={String(title)}
                                                >
                                                    {String(title) || 'Untitled'}
                                                </div>
                                            );
                                        })}
                                        
                                        {dayRecords.length > 3 && (
                                            <div className="text-xs text-muted-foreground">
                                                +{dayRecords.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Legend */}
            <div className="text-sm text-muted-foreground">
                Showing records based on <strong>{primaryDateProperty.name}</strong> property
            </div>
        </div>
    );
}
