import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useCreateTag } from '../services/tagsQueries';
import type { CreateTagRequest } from '@/types/tags.types';

interface CreateTagDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e', '#64748b', '#6b7280', '#374151'
];

export const CreateTagDialog: React.FC<CreateTagDialogProps> = ({
    open,
    onOpenChange,
}) => {
    const [formData, setFormData] = useState<CreateTagRequest>({
        name: '',
        color: DEFAULT_COLORS[0],
        description: '',
    });

    const createTagMutation = useCreateTag();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            return;
        }

        try {
            await createTagMutation.mutateAsync({
                ...formData,
                name: formData.name.trim(),
                description: formData.description?.trim() || undefined,
            });
            
            // Reset form and close dialog
            setFormData({
                name: '',
                color: DEFAULT_COLORS[0],
                description: '',
            });
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    const handleInputChange = (field: keyof CreateTagRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Tag</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter tag name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter tag description (optional)"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="grid grid-cols-10 gap-2">
                            {DEFAULT_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`w-6 h-6 rounded-full border-2 ${
                                        formData.color === color
                                            ? 'border-gray-900 dark:border-gray-100'
                                            : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleInputChange('color', color)}
                                />
                            ))}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                            <Input
                                type="color"
                                value={formData.color}
                                onChange={(e) => handleInputChange('color', e.target.value)}
                                className="w-12 h-8 p-1 border rounded"
                            />
                            <span className="text-sm text-muted-foreground">
                                Or choose a custom color
                            </span>
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
                        <Button
                            type="submit"
                            disabled={!formData.name.trim() || createTagMutation.isPending}
                        >
                            {createTagMutation.isPending ? 'Creating...' : 'Create Tag'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
