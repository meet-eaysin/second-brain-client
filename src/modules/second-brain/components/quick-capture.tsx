import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckSquare, BookOpen, Lightbulb, X } from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';
import type { QuickCaptureData } from '../services/second-brain-api';
import { toast } from 'sonner';

interface QuickCaptureProps {
    trigger?: React.ReactNode;
    defaultType?: 'task' | 'note' | 'idea';
}

export function QuickCapture({ trigger, defaultType = 'task' }: QuickCaptureProps) {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'task' | 'note' | 'idea'>(defaultType);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [area, setArea] = useState<'projects' | 'areas' | 'resources' | 'archive'>('projects');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
    const [tags, setTags] = useState<string[]>(['inbox']);
    const [newTag, setNewTag] = useState('');

    const queryClient = useQueryClient();

    const quickCaptureMutation = useMutation({
        mutationFn: secondBrainApi.quickCapture,
        onSuccess: () => {
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} captured successfully!`);

            // Add a small delay to ensure backend processing is complete
            setTimeout(() => {
                // Clear all task-related queries and force complete refetch
                queryClient.removeQueries({
                    predicate: (query) => query.queryKey[0] === 'tasks'
                });

                // Also invalidate other related queries
                queryClient.invalidateQueries({ queryKey: ['second-brain'] });
                queryClient.invalidateQueries({ queryKey: ['recent-captures'] });
            }, 100);

            resetForm();
            setOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to capture item');
        },
    });

    const resetForm = () => {
        setTitle('');
        setContent('');
        setArea('projects');
        setPriority('medium');
        setTags(['inbox']);
        setNewTag('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        const data: QuickCaptureData = {
            type,
            title: title.trim(),
            content: content.trim() || undefined,
            area,
            tags,
        };

        if (type === 'task') {
            data.priority = priority;
        }

        quickCaptureMutation.mutate(data);
    };

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit(e);
        }
    };

    const typeIcons = {
        task: CheckSquare,
        note: BookOpen,
        idea: Lightbulb,
    };

    const TypeIcon = typeIcons[type];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Quick Capture
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]" onKeyDown={handleKeyPress}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <TypeIcon className="h-5 w-5" />
                        Quick Capture
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type Selection */}
                    <div className="flex gap-2">
                        {(['task', 'note', 'idea'] as const).map((t) => {
                            const Icon = typeIcons[t];
                            return (
                                <Button
                                    key={t}
                                    type="button"
                                    variant={type === t ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setType(t)}
                                    className="gap-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </Button>
                            );
                        })}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={`Enter ${type} title...`}
                            autoFocus
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label htmlFor="content">
                            {type === 'task' ? 'Description' : 'Content'}
                        </Label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`Enter ${type} ${type === 'task' ? 'description' : 'content'}...`}
                            rows={3}
                        />
                    </div>

                    {/* Priority (for tasks only) */}
                    {type === 'task' && (
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* PARA Area */}
                    <div className="space-y-2">
                        <Label htmlFor="area">PARA Area</Label>
                        <Select value={area} onValueChange={(value: any) => setArea(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="projects">Projects</SelectItem>
                                <SelectItem value="areas">Areas</SelectItem>
                                <SelectItem value="resources">Resources</SelectItem>
                                <SelectItem value="archive">Archive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="gap-1">
                                    {tag}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => removeTag(tag)}
                                    />
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Add tag..."
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                            />
                            <Button type="button" variant="outline" size="sm" onClick={addTag}>
                                Add
                            </Button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={quickCaptureMutation.isPending}
                            className="gap-2"
                        >
                            {quickCaptureMutation.isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Capturing...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    Capture {type.charAt(0).toUpperCase() + type.slice(1)}
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Keyboard shortcut hint */}
                    <p className="text-xs text-muted-foreground text-center">
                        Press Cmd/Ctrl + Enter to capture quickly
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    );
}
