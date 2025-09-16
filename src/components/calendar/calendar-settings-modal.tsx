import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CalendarSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (settings: any) => void;
    loading?: boolean;
}

export function CalendarSettingsModal({ 
    open, 
    onOpenChange, 
    onSave, 
    loading = false 
}: CalendarSettingsModalProps) {
    const [settings, setSettings] = useState({
        defaultView: 'month',
        weekStartsOn: 0, // Sunday
        workingHours: {
            start: '09:00',
            end: '17:00',
        },
        showWeekends: true,
        showWeekNumbers: false,
        timeFormat: '12h',
        dateFormat: 'MM/DD/YYYY',
        notifications: {
            enabled: true,
            defaultReminder: 15, // minutes
        },
        theme: {
            primaryColor: '#3b82f6',
            eventHeight: 'medium',
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(settings);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Calendar Settings</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* View Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">View Settings</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="defaultView">Default View</Label>
                                <Select 
                                    value={settings.defaultView} 
                                    onValueChange={(value) => setSettings(prev => ({ ...prev, defaultView: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="month">Month</SelectItem>
                                        <SelectItem value="week">Week</SelectItem>
                                        <SelectItem value="day">Day</SelectItem>
                                        <SelectItem value="agenda">Agenda</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="weekStartsOn">Week Starts On</Label>
                                <Select 
                                    value={settings.weekStartsOn.toString()} 
                                    onValueChange={(value) => setSettings(prev => ({ ...prev, weekStartsOn: parseInt(value) }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Sunday</SelectItem>
                                        <SelectItem value="1">Monday</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="showWeekends">Show Weekends</Label>
                            <Switch
                                id="showWeekends"
                                checked={settings.showWeekends}
                                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showWeekends: checked }))}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="showWeekNumbers">Show Week Numbers</Label>
                            <Switch
                                id="showWeekNumbers"
                                checked={settings.showWeekNumbers}
                                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showWeekNumbers: checked }))}
                            />
                        </div>
                    </div>

                    {/* Working Hours */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Working Hours</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="workStart">Start Time</Label>
                                <Input
                                    id="workStart"
                                    type="time"
                                    value={settings.workingHours.start}
                                    onChange={(e) => setSettings(prev => ({ 
                                        ...prev, 
                                        workingHours: { ...prev.workingHours, start: e.target.value }
                                    }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="workEnd">End Time</Label>
                                <Input
                                    id="workEnd"
                                    type="time"
                                    value={settings.workingHours.end}
                                    onChange={(e) => setSettings(prev => ({ 
                                        ...prev, 
                                        workingHours: { ...prev.workingHours, end: e.target.value }
                                    }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Format Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Format Settings</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="timeFormat">Time Format</Label>
                                <Select 
                                    value={settings.timeFormat} 
                                    onValueChange={(value) => setSettings(prev => ({ ...prev, timeFormat: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="12h">12 Hour</SelectItem>
                                        <SelectItem value="24h">24 Hour</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateFormat">Date Format</Label>
                                <Select 
                                    value={settings.dateFormat} 
                                    onValueChange={(value) => setSettings(prev => ({ ...prev, dateFormat: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notifications</h3>
                        
                        <div className="flex items-center justify-between">
                            <Label htmlFor="notificationsEnabled">Enable Notifications</Label>
                            <Switch
                                id="notificationsEnabled"
                                checked={settings.notifications.enabled}
                                onCheckedChange={(checked) => setSettings(prev => ({ 
                                    ...prev, 
                                    notifications: { ...prev.notifications, enabled: checked }
                                }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="defaultReminder">Default Reminder (minutes)</Label>
                            <Input
                                id="defaultReminder"
                                type="number"
                                min="0"
                                value={settings.notifications.defaultReminder}
                                onChange={(e) => setSettings(prev => ({ 
                                    ...prev, 
                                    notifications: { ...prev.notifications, defaultReminder: parseInt(e.target.value) }
                                }))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
