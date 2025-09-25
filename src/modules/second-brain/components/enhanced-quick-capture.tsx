import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
    Plus, CheckSquare, BookOpen, Target, Users, 
    Calendar, Zap, Lightbulb, X,
    Mic, Camera, Link, Hash, Send
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';
import { toast } from 'sonner';

interface QuickCaptureItem {
    type: 'task' | 'note' | 'project' | 'person' | 'goal' | 'habit' | 'journal' | 'idea';
    title: string;
    content?: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
    area?: 'projects' | 'areas' | 'resources' | 'archive';
    dueDate?: string;
    metadata?: Record<string, any>;
}

interface FloatingQuickCaptureProps {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    hotkey?: string;
}

export function FloatingQuickCapture({ 
    position = 'bottom-right',
    hotkey = 'cmd+shift+n'
}: FloatingQuickCaptureProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedType, setSelectedType] = useState<QuickCaptureItem['type']>('task');
    const [formData, setFormData] = useState<QuickCaptureItem>({
        type: 'task',
        title: '',
        content: '',
        tags: [],
        area: 'projects'
    });
    const [tagInput, setTagInput] = useState('');
    
    const titleInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const captureTypes = [
        { type: 'task', label: 'Task', icon: CheckSquare, color: 'bg-blue-500' },
        { type: 'note', label: 'Note', icon: BookOpen, color: 'bg-purple-500' },
        { type: 'idea', label: 'Idea', icon: Lightbulb, color: 'bg-yellow-500' },
        { type: 'project', label: 'Project', icon: Target, color: 'bg-green-500' },
        { type: 'person', label: 'Person', icon: Users, color: 'bg-orange-500' },
        { type: 'goal', label: 'Goal', icon: Target, color: 'bg-red-500' },
        { type: 'habit', label: 'Habit', icon: Zap, color: 'bg-indigo-500' },
        { type: 'journal', label: 'Journal', icon: Calendar, color: 'bg-pink-500' }
    ];

    const createMutation = useMutation({
        mutationFn: async (data: QuickCaptureItem) => {
            const payload = {
                title: data.title,
                content: data.content,
                tags: data.tags,
                area: data.area,
                priority: data.priority,
                dueDate: data.dueDate,
                ...data.metadata
            };

            switch (data.type) {
                case 'task':
                    return secondBrainApi.tasks.create(payload);
                case 'note':
                    return secondBrainApi.notes.create({ ...payload, type: 'note' });
                case 'idea':
                    return secondBrainApi.notes.create({ ...payload, type: 'idea' });
                case 'project':
                    return secondBrainApi.projects.create(payload);
                case 'person':
                    const [firstName, ...lastNameParts] = data.title.split(' ');
                    return secondBrainApi.people.create({
                        firstName,
                        lastName: lastNameParts.join(' '),
                        notes: data.content,
                        tags: data.tags
                    });
                case 'goal':
                    return secondBrainApi.goals.create(payload);
                case 'habit':
                    return secondBrainApi.habits.create({
                        ...payload,
                        frequency: 'daily',
                        isActive: true
                    });
                case 'journal':
                    return secondBrainApi.journal.create({
                        ...payload,
                        type: 'daily',
                        date: new Date()
                    });
                default:
                    throw new Error('Unknown capture type');
            }
        },
        onSuccess: (data, variables) => {
            // Invalidate all relevant queries
            queryClient.invalidateQueries({ queryKey: ['second-brain'] });
            queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Add tasks query invalidation
            toast.success(`${variables.type.charAt(0).toUpperCase() + variables.type.slice(1)} created successfully`);
            handleClose();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create item');
        },
    });

    // Keyboard shortcut handler
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const cmdKey = isMac ? event.metaKey : event.ctrlKey;
            
            if (cmdKey && event.shiftKey && event.key.toLowerCase() === 'n') {
                event.preventDefault();
                setIsOpen(true);
            }
            
            if (event.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Focus title input when dialog opens
    useEffect(() => {
        if (isOpen && titleInputRef.current) {
            setTimeout(() => titleInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
        setIsExpanded(false);
        setFormData({
            type: 'task',
            title: '',
            content: '',
            tags: [],
            area: 'projects'
        });
        setTagInput('');
        setSelectedType('task');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;
        
        createMutation.mutate(formData);
    };

    const addTag = (tag: string) => {
        if (tag.trim() && !formData.tags?.includes(tag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tag.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
        }));
    };

    const getPositionClasses = () => {
        switch (position) {
            case 'bottom-right':
                return 'bottom-6 right-6';
            case 'bottom-left':
                return 'bottom-6 left-6';
            case 'top-right':
                return 'top-6 right-6';
            case 'top-left':
                return 'top-6 left-6';
            default:
                return 'bottom-6 right-6';
        }
    };

    const selectedTypeConfig = captureTypes.find(t => t.type === selectedType);

    return (
        <>
            {/* Floating Action Button */}
            <div className={`fixed ${getPositionClasses()} z-50`}>
                <Button
                    onClick={() => setIsOpen(true)}
                    size="lg"
                    className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </div>

            {/* Quick Capture Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Quick Capture
                            <Badge variant="outline" className="ml-auto">
                                {hotkey}
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Type Selection */}
                        <div className="grid grid-cols-4 gap-2">
                            {captureTypes.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <Button
                                        key={type.type}
                                        type="button"
                                        variant={selectedType === type.type ? 'default' : 'outline'}
                                        className="h-auto p-3 flex-col gap-1"
                                        onClick={() => {
                                            setSelectedType(type.type);
                                            setFormData(prev => ({ ...prev, type: type.type }));
                                        }}
                                    >
                                        <div className={`p-1 rounded ${type.color} text-white`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs">{type.label}</span>
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                {selectedTypeConfig?.label} Title *
                            </label>
                            <Input
                                ref={titleInputRef}
                                placeholder={`Enter ${selectedTypeConfig?.label.toLowerCase()} title...`}
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="gap-2"
                            >
                                {isExpanded ? 'Less' : 'More'} Options
                            </Button>
                            
                            {/* Quick Priority for Tasks */}
                            {selectedType === 'task' && (
                                <Select 
                                    value={formData.priority || ''} 
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}

                            {/* Quick Area Selection */}
                            <Select 
                                value={formData.area || ''} 
                                onValueChange={(value) => setFormData(prev => ({ ...prev, area: value as any }))}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Area" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="projects">Projects</SelectItem>
                                    <SelectItem value="areas">Areas</SelectItem>
                                    <SelectItem value="resources">Resources</SelectItem>
                                    <SelectItem value="archive">Archive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Expanded Options */}
                        {isExpanded && (
                            <div className="space-y-4 border-t pt-4">
                                {/* Content/Description */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {selectedType === 'note' || selectedType === 'idea' ? 'Content' : 'Description'}
                                    </label>
                                    <Textarea
                                        placeholder={`Add ${selectedType === 'note' ? 'content' : 'description'}...`}
                                        value={formData.content}
                                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                        rows={3}
                                    />
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tags</label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add tag..."
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTag(tagInput);
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => addTag(tagInput)}
                                            disabled={!tagInput.trim()}
                                        >
                                            <Hash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {formData.tags && formData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {formData.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="gap-1">
                                                    {tag}
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-3 w-3 p-0 hover:bg-transparent"
                                                        onClick={() => removeTag(tag)}
                                                    >
                                                        <X className="h-2 w-2" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Due Date for Tasks */}
                                {selectedType === 'task' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Due Date</label>
                                        <Input
                                            type="datetime-local"
                                            value={formData.dueDate || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={!formData.title.trim() || createMutation.isPending}
                                className="gap-2"
                            >
                                {createMutation.isPending ? (
                                    'Creating...'
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Create {selectedTypeConfig?.label}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
