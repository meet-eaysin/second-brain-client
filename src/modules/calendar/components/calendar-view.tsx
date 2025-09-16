import React, { useState, useEffect } from 'react';
import { Calendar, CalendarEvent, calendarService } from '@/services/calendar.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
    ChevronLeft, 
    ChevronRight, 
    Plus, 
    Settings, 
    Share2, 
    Download,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Users,
    Filter,
    Search,
    Grid3X3,
    List,
    MoreHorizontal
} from 'lucide-react';
import { CalendarMonthView } from './calendar-month-view';
import { CalendarWeekView } from './calendar-week-view';
import { CalendarDayView } from './calendar-day-view';
import { CalendarAgendaView } from './calendar-agenda-view';
import { CalendarTimelineView } from './calendar-timeline-view';
import { CreateEventDialog } from './create-event-dialog';
import { CalendarSidebar } from './calendar-sidebar';

export type CalendarViewType = 'month' | 'week' | 'day' | 'agenda' | 'timeline';

interface CalendarViewProps {
    className?: string;
}

export function CalendarView({ className }: CalendarViewProps) {
    const [calendars, setCalendars] = useState<Calendar[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewType, setViewType] = useState<CalendarViewType>('month');
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadCalendars();
    }, []);

    useEffect(() => {
        if (selectedCalendars.length > 0) {
            loadEvents();
        }
    }, [selectedCalendars, currentDate, viewType]);

    const loadCalendars = async () => {
        try {
            const userCalendars = await calendarService.getUserCalendars();
            setCalendars(userCalendars);
            
            // Select active calendars by default
            const activeCalendarIds = userCalendars
                .filter(cal => cal.isActive)
                .map(cal => cal.id);
            setSelectedCalendars(activeCalendarIds);
        } catch (error) {
            console.error('Failed to load calendars:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadEvents = async () => {
        try {
            const { startDate, endDate } = getDateRange();
            const eventList = await calendarService.getEvents({
                startDate,
                endDate,
                calendarIds: selectedCalendars,
                search: searchQuery || undefined,
            });
            setEvents(eventList);
        } catch (error) {
            console.error('Failed to load events:', error);
        }
    };

    const getDateRange = () => {
        const start = new Date(currentDate);
        const end = new Date(currentDate);

        switch (viewType) {
            case 'month':
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
                end.setMonth(end.getMonth() + 1, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'week':
                const dayOfWeek = start.getDay();
                start.setDate(start.getDate() - dayOfWeek);
                start.setHours(0, 0, 0, 0);
                end.setDate(start.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                break;
            case 'day':
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                break;
            case 'agenda':
            case 'timeline':
                start.setDate(start.getDate() - 7);
                start.setHours(0, 0, 0, 0);
                end.setDate(end.getDate() + 30);
                end.setHours(23, 59, 59, 999);
                break;
        }

        return { startDate: start, endDate: end };
    };

    const navigateDate = (direction: 'prev' | 'next' | 'today') => {
        const newDate = new Date(currentDate);

        if (direction === 'today') {
            setCurrentDate(new Date());
            return;
        }

        const increment = direction === 'next' ? 1 : -1;

        switch (viewType) {
            case 'month':
                newDate.setMonth(newDate.getMonth() + increment);
                break;
            case 'week':
                newDate.setDate(newDate.getDate() + (7 * increment));
                break;
            case 'day':
                newDate.setDate(newDate.getDate() + increment);
                break;
            case 'agenda':
            case 'timeline':
                newDate.setDate(newDate.getDate() + (7 * increment));
                break;
        }

        setCurrentDate(newDate);
    };

    const formatDateHeader = () => {
        const options: Intl.DateTimeFormatOptions = {};

        switch (viewType) {
            case 'month':
                options.year = 'numeric';
                options.month = 'long';
                break;
            case 'week':
                const weekStart = new Date(currentDate);
                const dayOfWeek = weekStart.getDay();
                weekStart.setDate(weekStart.getDate() - dayOfWeek);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                
                if (weekStart.getMonth() === weekEnd.getMonth()) {
                    return `${weekStart.toLocaleDateString([], { month: 'long', day: 'numeric' })} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
                } else {
                    return `${weekStart.toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${weekStart.getFullYear()}`;
                }
            case 'day':
                options.weekday = 'long';
                options.year = 'numeric';
                options.month = 'long';
                options.day = 'numeric';
                break;
            case 'agenda':
            case 'timeline':
                options.year = 'numeric';
                options.month = 'long';
                break;
        }

        return currentDate.toLocaleDateString([], options);
    };

    const handleCalendarToggle = (calendarId: string) => {
        setSelectedCalendars(prev => 
            prev.includes(calendarId)
                ? prev.filter(id => id !== calendarId)
                : [...prev, calendarId]
        );
    };

    const handleEventCreate = async (eventData: any) => {
        try {
            const defaultCalendar = calendars.find(cal => cal.isDefault) || calendars[0];
            if (defaultCalendar) {
                await calendarService.createEvent(defaultCalendar.id, eventData);
                await loadEvents();
            }
        } catch (error) {
            console.error('Failed to create event:', error);
        }
    };

    const renderCalendarView = () => {
        const viewProps = {
            events,
            calendars,
            currentDate,
            onEventClick: (event: CalendarEvent) => console.log('Event clicked:', event),
            onDateClick: (date: Date) => setCurrentDate(date),
            onEventCreate: handleEventCreate,
        };

        switch (viewType) {
            case 'month':
                return <CalendarMonthView {...viewProps} />;
            case 'week':
                return <CalendarWeekView {...viewProps} />;
            case 'day':
                return <CalendarDayView {...viewProps} />;
            case 'agenda':
                return <CalendarAgendaView {...viewProps} />;
            case 'timeline':
                return <CalendarTimelineView {...viewProps} />;
            default:
                return <CalendarMonthView {...viewProps} />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className={`flex h-full ${className}`}>
            {/* Sidebar */}
            {showSidebar && (
                <CalendarSidebar
                    calendars={calendars}
                    selectedCalendars={selectedCalendars}
                    onCalendarToggle={handleCalendarToggle}
                    onCalendarCreate={() => console.log('Create calendar')}
                    onCalendarEdit={(calendar) => console.log('Edit calendar:', calendar)}
                    className="w-80 border-r"
                />
            )}

            {/* Main Calendar Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="border-b p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowSidebar(!showSidebar)}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            
                            <h1 className="text-2xl font-bold">Calendar</h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setShowCreateDialog(true)}
                                size="sm"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                New Event
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share Calendar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Navigation and View Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigateDate('today')}
                            >
                                Today
                            </Button>
                            
                            <div className="flex items-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigateDate('prev')}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigateDate('next')}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>

                            <h2 className="text-lg font-semibold ml-4">
                                {formatDateHeader()}
                            </h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={viewType} onValueChange={(value: CalendarViewType) => setViewType(value)}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="month">Month</SelectItem>
                                    <SelectItem value="week">Week</SelectItem>
                                    <SelectItem value="day">Day</SelectItem>
                                    <SelectItem value="agenda">Agenda</SelectItem>
                                    <SelectItem value="timeline">Timeline</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Calendar Content */}
                <div className="flex-1 overflow-hidden">
                    {renderCalendarView()}
                </div>
            </div>

            {/* Create Event Dialog */}
            <CreateEventDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                calendars={calendars}
                onEventCreate={handleEventCreate}
                defaultDate={currentDate}
            />
        </div>
    );
}
