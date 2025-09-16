import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Plus, 
    Settings, 
    MoreHorizontal,
    Calendar as CalendarIcon,
    Users,
    Globe,
    Lock,
    // Sync, // Not available in lucide-react
    AlertCircle,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { Calendar } from '@/types/calendar';
import { CalendarType, CalendarVisibility } from '@/types/calendar';
import { CreateCalendarForm } from './create-calendar-form';

interface CalendarSidebarProps {
    calendars: Calendar[];
    selectedCalendars: string[];
    onCalendarToggle: (calendarId: string) => void;
    onCalendarCreate: (calendar: Partial<Calendar>) => void;
    onCalendarUpdate: (calendarId: string, updates: Partial<Calendar>) => void;
    onCalendarDelete: (calendarId: string) => void;
}

export function CalendarSidebar({
    calendars,
    selectedCalendars,
    onCalendarToggle,
    onCalendarCreate,
    onCalendarUpdate,
    onCalendarDelete,
}: CalendarSidebarProps) {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Group calendars by type
    const groupedCalendars = calendars.reduce((groups, calendar) => {
        const type = calendar.type || CalendarType.PERSONAL;
        if (!groups[type]) {
            groups[type] = [];
        }
        groups[type].push(calendar);
        return groups;
    }, {} as Record<CalendarType, Calendar[]>);

    // Filter calendars by search query
    const filteredCalendars = (calendarList: Calendar[]) => {
        if (!searchQuery) return calendarList;
        return calendarList.filter(calendar =>
            calendar.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const getCalendarIcon = (calendar: Calendar) => {
        switch (calendar.type) {
            case CalendarType.TEAM:
                return <Users className="h-4 w-4" />;
            case CalendarType.PROJECT:
                return <CalendarIcon className="h-4 w-4" />;
            case CalendarType.EXTERNAL:
                return <Globe className="h-4 w-4" />;
            default:
                return <CalendarIcon className="h-4 w-4" />;
        }
    };

    const getVisibilityIcon = (visibility: CalendarVisibility) => {
        switch (visibility) {
            case CalendarVisibility.PUBLIC:
                return <Globe className="h-3 w-3 text-green-500" />;
            case CalendarVisibility.SHARED:
                return <Users className="h-3 w-3 text-blue-500" />;
            default:
                return <Lock className="h-3 w-3 text-gray-500" />;
        }
    };

    const CalendarItem = ({ calendar }: { calendar: Calendar }) => {
        const isSelected = selectedCalendars.includes(calendar.id);
        const hasIntegrationErrors = calendar.integrations?.some(
            integration => integration.status === 'ERROR'
        );

        return (
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 group">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onCalendarToggle(calendar.id)}
                />
                
                <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: calendar.color }}
                />
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                        {getCalendarIcon(calendar)}
                        <span className="text-sm font-medium truncate">
                            {calendar.name}
                        </span>
                        {getVisibilityIcon(calendar.visibility)}
                        {hasIntegrationErrors && (
                            <AlertCircle className="h-3 w-3 text-red-500" />
                        )}
                    </div>
                    
                    {calendar.description && (
                        <p className="text-xs text-muted-foreground truncate">
                            {calendar.description}
                        </p>
                    )}
                    
                    <div className="flex items-center space-x-1 mt-1">
                        {calendar.integrations?.map(integration => (
                            <Badge 
                                key={integration.id} 
                                variant="outline" 
                                className="text-xs px-1 py-0"
                            >
                                {integration.provider.toLowerCase()}
                            </Badge>
                        ))}
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                            // Open calendar settings
                        }}>
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            // Share calendar
                        }}>
                            <Users className="h-4 w-4 mr-2" />
                            Share
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            // Sync calendar
                        }}>
                            <Globe className="h-4 w-4 mr-2" />
                            Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={() => onCalendarDelete(calendar.id)}
                            className="text-destructive focus:text-destructive"
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    };

    const CalendarGroup = ({ title, calendars: groupCalendars, type }: {
        title: string;
        calendars: Calendar[];
        type: CalendarType;
    }) => {
        const filtered = filteredCalendars(groupCalendars);
        if (filtered.length === 0) return null;

        return (
            <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
                    {title}
                </h3>
                <div className="space-y-1">
                    {filtered.map(calendar => (
                        <CalendarItem key={calendar.id} calendar={calendar} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="w-80 border-r bg-background p-4 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Calendars</h2>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            New
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Calendar</DialogTitle>
                        </DialogHeader>
                        <CreateCalendarForm
                            onSubmit={(calendar) => {
                                onCalendarCreate(calendar);
                                setShowCreateDialog(false);
                            }}
                            onCancel={() => setShowCreateDialog(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="mb-4">
                <Input
                    placeholder="Search calendars..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8"
                />
            </div>

            {/* Calendar Groups */}
            <div className="flex-1 overflow-y-auto">
                <CalendarGroup
                    title="Personal"
                    calendars={groupedCalendars[CalendarType.PERSONAL] || []}
                    type={CalendarType.PERSONAL}
                />
                
                <CalendarGroup
                    title="Team"
                    calendars={groupedCalendars[CalendarType.TEAM] || []}
                    type={CalendarType.TEAM}
                />
                
                <CalendarGroup
                    title="Projects"
                    calendars={groupedCalendars[CalendarType.PROJECT] || []}
                    type={CalendarType.PROJECT}
                />
                
                <CalendarGroup
                    title="External"
                    calendars={groupedCalendars[CalendarType.EXTERNAL] || []}
                    type={CalendarType.EXTERNAL}
                />
                
                <CalendarGroup
                    title="System"
                    calendars={groupedCalendars[CalendarType.SYSTEM] || []}
                    type={CalendarType.SYSTEM}
                />
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t">
                <div className="text-xs text-muted-foreground">
                    {selectedCalendars.length} of {calendars.length} calendars selected
                </div>
                
                <div className="flex items-center justify-between mt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            // Select all calendars
                            calendars.forEach(calendar => {
                                if (!selectedCalendars.includes(calendar.id)) {
                                    onCalendarToggle(calendar.id);
                                }
                            });
                        }}
                    >
                        Select All
                    </Button>
                    
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            // Deselect all calendars
                            selectedCalendars.forEach(calendarId => {
                                onCalendarToggle(calendarId);
                            });
                        }}
                    >
                        Clear All
                    </Button>
                </div>
            </div>
        </div>
    );
}
