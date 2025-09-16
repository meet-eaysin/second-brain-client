import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Edit, Trash2 } from 'lucide-react';
import { CalendarEvent } from '@/types/calendar';

interface EventDetailsModalProps {
    event: CalendarEvent | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: (event: CalendarEvent) => void;
    onDelete?: (eventId: string) => void;
}

export function EventDetailsModal({ 
    event, 
    open, 
    onOpenChange, 
    onEdit, 
    onDelete 
}: EventDetailsModalProps) {
    if (!event) return null;

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: event.color || '#3b82f6' }}
                        />
                        {event.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {event.description && (
                        <div>
                            <h4 className="text-sm font-medium mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(new Date(event.startTime))}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {formatTime(new Date(event.startTime))} - {formatTime(new Date(event.endTime))}
                            </span>
                        </div>

                        {event.location && (
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{event.location}</span>
                            </div>
                        )}

                        {event.attendees && event.attendees.length > 0 && (
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{event.attendees.length} attendee(s)</span>
                            </div>
                        )}
                    </div>

                    {event.metadata?.customFields?.tags && event.metadata.customFields.tags.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium mb-2">Tags</h4>
                            <div className="flex flex-wrap gap-1">
                                {event.metadata.customFields.tags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 pt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => onEdit?.(event)}
                            className="flex-1"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => onDelete?.(event.id)}
                            className="flex-1"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
