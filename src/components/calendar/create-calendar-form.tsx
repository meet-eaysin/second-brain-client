import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CalendarType } from '@/types/calendar';

interface CreateCalendarFormProps {
    onSubmit: (calendar: any) => void;
    onCancel: () => void;
    loading?: boolean;
}

export function CreateCalendarForm({ onSubmit, onCancel, loading = false }: CreateCalendarFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: CalendarType.PERSONAL,
        color: '#3b82f6',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Calendar Name</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter calendar name"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter calendar description"
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="type">Calendar Type</Label>
                <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as CalendarType }))}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={CalendarType.PERSONAL}>Personal</SelectItem>
                        <SelectItem value={CalendarType.TEAM}>Team</SelectItem>
                        <SelectItem value={CalendarType.PROJECT}>Project</SelectItem>
                        <SelectItem value={CalendarType.EXTERNAL}>External</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <div className="flex gap-2">
                    <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-16 h-10"
                    />
                    <Input
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        placeholder="#3b82f6"
                        className="flex-1"
                    />
                </div>
            </div>

            <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                    Cancel
                </Button>
                <Button type="submit" disabled={loading || !formData.name.trim()} className="flex-1">
                    {loading ? 'Creating...' : 'Create Calendar'}
                </Button>
            </div>
        </form>
    );
}
