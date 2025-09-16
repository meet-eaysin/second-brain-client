import { useState, useEffect } from 'react';
import { CalendarView } from '../components/calendar-view';
import { Calendar, CalendarEvent } from '@/types/calendar';
import { usePageHeader } from '@/hooks/usePageHeader';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarPage() {
    usePageHeader({
        title: 'Calendar',
        description: 'Manage your events, meetings, and schedule',
        icon: CalendarIcon,
    });

    const [calendars, setCalendars] = useState<Calendar[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    // Mock data for demonstration
    useEffect(() => {
        // Simulate loading calendars and events
        const mockCalendars: Calendar[] = [
            {
                id: '1',
                name: 'Personal',
                description: 'Personal events and appointments',
                type: 'PERSONAL' as any,
                visibility: 'PRIVATE' as any,
                color: '#3b82f6',
                isActive: true,
                isDefault: true,
                sortOrder: 1,
                ownerId: 'user1',
                settings: {},
                permissions: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: '2',
                name: 'Work',
                description: 'Work meetings and deadlines',
                type: 'TEAM' as any,
                visibility: 'SHARED' as any,
                color: '#ef4444',
                isActive: true,
                isDefault: false,
                sortOrder: 2,
                ownerId: 'user1',
                settings: {},
                permissions: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];

        const mockEvents: CalendarEvent[] = [
            {
                id: '1',
                title: 'Team Meeting',
                description: 'Weekly team sync',
                location: 'Conference Room A',
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
                endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // Tomorrow + 1 hour
                isAllDay: false,
                status: 'CONFIRMED' as any,
                visibility: 'PUBLIC' as any,
                busyStatus: 'BUSY' as any,
                color: '#ef4444',
                calendarId: '2',
                createdById: 'user1',
                isRecurring: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: '2',
                title: 'Doctor Appointment',
                description: 'Annual checkup',
                startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
                endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // Day after tomorrow + 30 min
                isAllDay: false,
                status: 'CONFIRMED' as any,
                visibility: 'PRIVATE' as any,
                busyStatus: 'BUSY' as any,
                color: '#3b82f6',
                calendarId: '1',
                createdById: 'user1',
                isRecurring: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];

        setTimeout(() => {
            setCalendars(mockCalendars);
            setEvents(mockEvents);
            setSelectedCalendars(mockCalendars.map(c => c.id));
            setLoading(false);
        }, 1000);
    }, []);

    const handleCalendarToggle = (calendarId: string) => {
        setSelectedCalendars(prev => 
            prev.includes(calendarId)
                ? prev.filter(id => id !== calendarId)
                : [...prev, calendarId]
        );
    };

    const handleEventCreate = (eventData: any) => {
        const newEvent: CalendarEvent = {
            id: Date.now().toString(),
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            startTime: eventData.start.toISOString(),
            endTime: eventData.end.toISOString(),
            isAllDay: eventData.allDay || false,
            status: 'CONFIRMED' as any,
            visibility: 'PUBLIC' as any,
            busyStatus: 'BUSY' as any,
            color: eventData.color || '#3b82f6',
            calendarId: eventData.calendarId || calendars[0]?.id,
            createdById: 'user1',
            isRecurring: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setEvents(prev => [...prev, newEvent]);
    };

    const handleEventUpdate = (eventId: string, updates: Partial<CalendarEvent>) => {
        setEvents(prev => prev.map(event => 
            event.id === eventId ? { ...event, ...updates } : event
        ));
    };

    const handleEventDelete = (eventId: string) => {
        setEvents(prev => prev.filter(event => event.id !== eventId));
    };

    const handleCalendarCreate = (calendarData: any) => {
        const newCalendar: Calendar = {
            id: Date.now().toString(),
            name: calendarData.name,
            description: calendarData.description,
            type: calendarData.type,
            visibility: 'PRIVATE' as any,
            color: calendarData.color,
            isActive: true,
            isDefault: false,
            sortOrder: calendars.length + 1,
            ownerId: 'user1',
            settings: {},
            permissions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setCalendars(prev => [...prev, newCalendar]);
        setSelectedCalendars(prev => [...prev, newCalendar.id]);
    };

    const handleCalendarUpdate = (calendarId: string, updates: Partial<Calendar>) => {
        setCalendars(prev => prev.map(calendar => 
            calendar.id === calendarId ? { ...calendar, ...updates } : calendar
        ));
    };

    const handleCalendarDelete = (calendarId: string) => {
        setCalendars(prev => prev.filter(calendar => calendar.id !== calendarId));
        setSelectedCalendars(prev => prev.filter(id => id !== calendarId));
        setEvents(prev => prev.filter(event => event.calendarId !== calendarId));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="h-full">
            <CalendarView
                calendars={calendars}
                events={events}
                selectedCalendars={selectedCalendars}
                currentView={currentView}
                currentDate={currentDate}
                onViewChange={setCurrentView}
                onDateChange={setCurrentDate}
                onCalendarToggle={handleCalendarToggle}
                onEventCreate={handleEventCreate}
                onEventUpdate={handleEventUpdate}
                onEventDelete={handleEventDelete}
                onCalendarCreate={handleCalendarCreate}
                onCalendarUpdate={handleCalendarUpdate}
                onCalendarDelete={handleCalendarDelete}
                loading={loading}
            />
        </div>
    );
}
