import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, Settings } from 'lucide-react';
import type { Workspace, CreateWorkspaceRequest, UpdateWorkspaceRequest } from '@/types/workspace.types';

const workspaceFormSchema = z.object({
    name: z.string().min(1, 'Workspace name is required').max(100, 'Name must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    icon: z.string().max(10, 'Icon must be less than 10 characters').optional(),
    color: z.string().optional(),
    isPublic: z.boolean(),
    allowMemberInvites: z.boolean(),
});

type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;

interface WorkspaceFormProps {
    workspace?: Workspace | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CreateWorkspaceRequest | UpdateWorkspaceRequest) => Promise<void>;
    mode?: 'create' | 'edit';
    isLoading?: boolean;
}

const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Teal', value: '#14b8a6' },
];

const iconOptions = ['🏢', '🚀', '💼', '🎯', '⭐', '🔥', '💡', '🎨', '🔧', '⚡', '🌟', '🏆'];

export function WorkspaceForm({
    workspace,
    open,
    onOpenChange,
    onSubmit,
    mode = 'create',
    isLoading = false
}: WorkspaceFormProps) {
    const form = useForm<WorkspaceFormValues>({
        resolver: zodResolver(workspaceFormSchema),
        defaultValues: {
            name: '',
            description: '',
            icon: '🏢',
            color: '#3b82f6',
            isPublic: false,
            allowMemberInvites: true,
        },
    });

    // Initialize form with workspace data when editing
    useEffect(() => {
        if (open) {
            if (workspace && mode === 'edit') {
                const formData = {
                    name: workspace.name,
                    description: workspace.description || '',
                    icon: workspace.icon || '🏢',
                    color: workspace.color || '#3b82f6',
                    isPublic: workspace.isPublic ?? false,
                    allowMemberInvites: workspace.allowMemberInvites ?? true,
                };
                form.reset(formData);
            } else {
                const defaultData = {
                    name: '',
                    description: '',
                    icon: '🏢',
                    color: '#3b82f6',
                    isPublic: false,
                    allowMemberInvites: true,
                };
                form.reset(defaultData);
            }
        }
    }, [workspace, mode, open, form]);

    const handleSubmit = async (data: WorkspaceFormValues) => {
        try {
            await onSubmit(data);
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to submit workspace:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Create Workspace' : 'Edit Workspace'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Create a new workspace to organize your databases and collaborate with your team.'
                            : 'Update workspace information and settings.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {/* Basic Information */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Workspace Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter workspace name..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Describe your workspace..." 
                                            className="resize-none"
                                            rows={3}
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Icon Selection */}
                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2 flex-wrap">
                                            {iconOptions.map((icon) => (
                                                <Button
                                                    key={icon}
                                                    type="button"
                                                    variant={field.value === icon ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => field.onChange(icon)}
                                                    className="w-10 h-10 p-0"
                                                >
                                                    {icon}
                                                </Button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Color Selection */}
                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2 flex-wrap">
                                            {colorOptions.map((color) => (
                                                <Button
                                                    key={color.value}
                                                    type="button"
                                                    variant={field.value === color.value ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => field.onChange(color.value)}
                                                    className="w-8 h-8 p-0"
                                                    style={{ backgroundColor: color.value }}
                                                >
                                                    {field.value === color.value && (
                                                        <span className="text-white">✓</span>
                                                    )}
                                                </Button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Settings */}
                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="text-sm font-medium">Workspace Settings</h4>
                            
                            <FormField
                                control={form.control}
                                name="allowMemberInvites"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Member Invites</FormLabel>
                                            <FormDescription>
                                                Allow members to invite others to this workspace
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isPublic"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Public Workspace</FormLabel>
                                            <FormDescription>
                                                Make this workspace visible to everyone
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Settings className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {mode === 'create' ? 'Create Workspace' : 'Update Workspace'}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
