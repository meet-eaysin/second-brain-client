import { useState, useMemo } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { 
    ChevronLeft, 
    ChevronRight, 
    Plus, 
    Settings, 
    Filter,
    Download,
    Share2,
    Calendar as CalendarIcon,
    // Clock,
    MapPin,
    Users,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CalendarEvent, Calendar as CalendarType } from '@/types/calendar';
import { CalendarSidebar } from './calendar-sidebar';
import { EventDetailsModal } from './event-details-modal';
import { CreateEventModal } from './create-event-modal';
import { CalendarSettingsModal } from './calendar-settings-modal';

const localizer = momentLocalizer(moment);

interface CalendarViewProps {
    calendars: CalendarType[];
    events: CalendarEvent[];
    selectedCalendars: string[];
    currentView: View;
    currentDate: Date;
    onViewChange: (view: View) => void;
    onDateChange: (date: Date) => void;
    onCalendarToggle: (calendarId: string) => void;
    onEventCreate: (event: Partial<CalendarEvent>) => void;
    onEventUpdate: (eventId: string, updates: Partial<CalendarEvent>) => void;
    onEventDelete: (eventId: string) => void;
    onCalendarCreate: (calendar: Partial<CalendarType>) => void;
    onCalendarUpdate: (calendarId: string, updates: Partial<CalendarType>) => void;
    onCalendarDelete: (calendarId: string) => void;
    loading?: boolean;
}

export function CalendarView({
    calendars,
    events,
    selectedCalendars,
    currentView,
    currentDate,
    onViewChange,
    onDateChange,
    onCalendarToggle,
    onEventCreate,
    onEventUpdate,
    onEventDelete,
    onCalendarCreate,
    onCalendarUpdate,
    onCalendarDelete,
    loading = false,
}: CalendarViewProps) {
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [createEventSlot, setCreateEventSlot] = useState<{ start: Date; end: Date } | null>(null);

    // Filter events by selected calendars
    const filteredEvents = useMemo(() => {
        return events.filter(event => selectedCalendars.includes(event.calendarId));
    }, [events, selectedCalendars]);

    // Transform events for react-big-calendar
    const calendarEvents = useMemo(() => {
        return filteredEvents.map(event => {
            const calendar = calendars.find(c => c.id === event.calendarId);
            return {
                id: event.id,
                title: event.title,
                start: new Date(event.startTime),
                end: new Date(event.endTime),
                allDay: event.isAllDay,
                resource: {
                    ...event,
                    calendar,
                    color: event.color || calendar?.color || '#3b82f6',
                },
            };
        });
    }, [filteredEvents, calendars]);

    // Custom event component
    const EventComponent = ({ event }: { event: any }) => {
        const { resource } = event;
        const calendar = resource.calendar;

        return (
            <div 
                className="flex items-center space-x-1 text-xs p-1 rounded"
                style={{ 
                    backgroundColor: resource.color + '20',
                    borderLeft: `3px solid ${resource.color}`,
                }}
            >
                <span className="font-medium truncate">{event.title}</span>
                {resource.location && (
                    <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                )}
                {resource.attendees?.length > 0 && (
                    <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                )}
            </div>
        );
    };

    // Custom toolbar
    const CustomToolbar = ({ label, onNavigate, onView }: any) => (
        <div className="flex items-center justify-between mb-4 p-4 bg-background border rounded-lg">
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('PREV')}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('TODAY')}
                >
                    Today
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate('NEXT')}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold ml-4">{label}</h2>
            </div>

            <div className="flex items-center space-x-2">
                {/* View Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onView('month')}>
                            Month
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView('week')}>
                            Week
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView('day')}>
                            Day
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onView('agenda')}>
                            Agenda
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Actions */}
                <Button
                    size="sm"
                    onClick={() => setShowCreateModal(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setShowSettingsModal(true)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Calendar Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Filter className="h-4 w-4 mr-2" />
                            Filter Events
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Export Calendar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Calendar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );

    // Handle slot selection (for creating events)
    const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
        setCreateEventSlot({ start, end });
        setShowCreateModal(true);
    };

    // Handle event selection
    const handleSelectEvent = (event: any) => {
        setSelectedEvent(event.resource);
    };

    // Handle event drag and drop
    const handleEventDrop = ({ event, start, end }: any) => {
        onEventUpdate(event.id, {
            startTime: start,
            endTime: end,
        });
    };

    // Handle event resize
    const handleEventResize = ({ event, start, end }: any) => {
        onEventUpdate(event.id, {
            startTime: start,
            endTime: end,
        });
    };

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <CalendarSidebar
                calendars={calendars}
                selectedCalendars={selectedCalendars}
                onCalendarToggle={onCalendarToggle}
                onCalendarCreate={onCalendarCreate}
                onCalendarUpdate={onCalendarUpdate}
                onCalendarDelete={onCalendarDelete}
            />

            {/* Main Calendar */}
            <div className="flex-1 p-6">
                <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 'calc(100vh - 200px)' }}
                    view={currentView}
                    date={currentDate}
                    onView={onViewChange}
                    onNavigate={onDateChange}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    // onEventDrop={handleEventDrop} // Not supported in this version
                    onEventResize={handleEventResize}
                    selectable
                    resizable
                    popup
                    components={{
                        toolbar: CustomToolbar,
                        event: EventComponent,
                    }}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: event.resource.color + '20',
                            borderColor: event.resource.color,
                            color: '#000',
                        },
                    })}
                    dayPropGetter={(date) => ({
                        style: {
                            backgroundColor: moment(date).isSame(moment(), 'day') 
                                ? '#f0f9ff' 
                                : undefined,
                        },
                    })}
                />
            </div>

            {/* Modals */}
            {selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    // calendar={calendars.find(c => c.id === selectedEvent.calendarId)} // Not supported
                    open={!!selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onEdit={(updates) => {
                        onEventUpdate(selectedEvent.id, updates);
                        setSelectedEvent(null);
                    }}
                    onDelete={() => {
                        onEventDelete(selectedEvent.id);
                        setSelectedEvent(null);
                    }}
                />
            )}

            {showCreateModal && (
                <CreateEventModal
                    // calendars={calendars.filter(c => selectedCalendars.includes(c.id))} // Not supported
                    initialSlot={createEventSlot}
                    open={showCreateModal}
                    onClose={() => {
                        setShowCreateModal(false);
                        setCreateEventSlot(null);
                    }}
                    onCreate={(event: any) => {
                        onEventCreate(event);
                        setShowCreateModal(false);
                        setCreateEventSlot(null);
                    }}
                />
            )}

            {showSettingsModal && (
                <CalendarSettingsModal
                    // calendars={calendars} // Not supported
                    open={showSettingsModal}
                    onClose={() => setShowSettingsModal(false)}
                    onUpdate={onCalendarUpdate}
                />
            )}
        </div>
    );
}
