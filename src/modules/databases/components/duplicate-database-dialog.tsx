import React, { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Copy, Database, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { databaseApi } from '../services/databaseApi';
// import { useWorkspace } from '@/modules/workspaces/context/workspace-context';
import type { Database, DatabaseCategory } from '@/types/database.types';

const duplicateFormSchema = z.object({
    name: z.string().min(1, 'Database name is required').max(100, 'Name must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    includeRecords: z.boolean().default(true),
    includeViews: z.boolean().default(true),
    workspaceId: z.string().optional(),
    categoryId: z.string().optional(),
});

type DuplicateFormValues = z.infer<typeof duplicateFormSchema>;

interface DuplicateDatabaseDialogProps {
    database: Database | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (newDatabase: Database) => void;
    categories?: DatabaseCategory[];
}

export function DuplicateDatabaseDialog({
    database,
    open,
    onOpenChange,
    onSuccess,
    categories = [],
}: DuplicateDatabaseDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [duplicatedDatabase, setDuplicatedDatabase] = useState<Database | null>(null);
    // Temporarily disable workspace functionality until WorkspaceProvider is set up
    const workspaces: any[] = [];
    const currentWorkspace = null;

    const form = useForm<DuplicateFormValues>({
        resolver: zodResolver(duplicateFormSchema),
        defaultValues: {
            name: '',
            description: '',
            includeRecords: true,
            includeViews: true,
            workspaceId: currentWorkspace?.id,
            categoryId: undefined,
        },
    });

    // Update form when database changes
    React.useEffect(() => {
        if (database && open) {
            form.reset({
                name: `${database.name} (Copy)`,
                description: database.description ? `Copy of ${database.description}` : '',
                includeRecords: true,
                includeViews: true,
                workspaceId: currentWorkspace?.id || database.workspaceId,
                categoryId: database.categoryId,
            });
        }
    }, [database, open, form, currentWorkspace]);

    const handleDuplicate = async (data: DuplicateFormValues) => {
        if (!database) return;

        try {
            setIsLoading(true);
            
            const duplicateData = {
                name: data.name,
                description: data.description,
                includeRecords: data.includeRecords,
                includeViews: data.includeViews,
                workspaceId: data.workspaceId,
                categoryId: data.categoryId,
            };

            const newDatabase = await databaseApi.duplicateDatabase(database.id, duplicateData);
            
            setDuplicatedDatabase(newDatabase);
            toast.success(`Database "${data.name}" duplicated successfully`);
            
            // Call success callback after a short delay to show success state
            setTimeout(() => {
                onSuccess?.(newDatabase);
                onOpenChange(false);
                setDuplicatedDatabase(null);
            }, 2000);

        } catch (error: any) {
            console.error('Failed to duplicate database:', error);
            const errorMessage = error?.response?.data?.error?.message || 'Failed to duplicate database';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onOpenChange(false);
            setDuplicatedDatabase(null);
            form.reset();
        }
    };

    if (!database) return null;

    // Success state
    if (duplicatedDatabase) {
        return (
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            Database Duplicated Successfully
                        </DialogTitle>
                        <DialogDescription>
                            Your database has been duplicated and is ready to use.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white">
                                    {duplicatedDatabase.icon || '📋'}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{duplicatedDatabase.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {duplicatedDatabase.description || 'No description'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Properties:</span>
                                <span className="ml-2 font-medium">
                                    {duplicatedDatabase.properties?.length || 0}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Views:</span>
                                <span className="ml-2 font-medium">
                                    {duplicatedDatabase.views?.length || 0}
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleClose} className="w-full">
                            Continue
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Copy className="h-5 w-5" />
                        Duplicate Database
                    </DialogTitle>
                    <DialogDescription>
                        Create a copy of "{database.name}" with customizable options.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleDuplicate)} className="space-y-4">
                        {/* Basic Information */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Database Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter database name..." {...field} />
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
                                            placeholder="Describe your database..." 
                                            className="resize-none"
                                            rows={2}
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Workspace Selection */}
                        {workspaces.length > 1 && (
                            <FormField
                                control={form.control}
                                name="workspaceId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Workspace</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select workspace" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {workspaces.map((workspace) => (
                                                    <SelectItem key={workspace.id} value={workspace.id}>
                                                        <div className="flex items-center gap-2">
                                                            <span style={{ color: workspace.color }}>
                                                                {workspace.icon || '🏢'}
                                                            </span>
                                                            {workspace.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Category Selection */}
                        {categories.length > 0 && (
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category (optional)</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="">No Category</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        <div className="flex items-center gap-2">
                                                            <span style={{ color: category.color }}>
                                                                {category.icon || '📁'}
                                                            </span>
                                                            {category.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Duplication Options */}
                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="text-sm font-medium">What to include</h4>
                            
                            <FormField
                                control={form.control}
                                name="includeRecords"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Include Records</FormLabel>
                                            <FormDescription>
                                                Copy all existing records to the new database
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
                                name="includeViews"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Include Views</FormLabel>
                                            <FormDescription>
                                                Copy all custom views and their configurations
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

                        {/* Original Database Info */}
                        <div className="p-3 bg-muted rounded-lg">
                            <h4 className="text-sm font-medium mb-2">Original Database</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                                    {database.icon || '📋'}
                                </div>
                                <div>
                                    <p className="font-medium">{database.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Badge variant="outline">
                                            {database.properties?.length || 0} properties
                                        </Badge>
                                        <Badge variant="outline">
                                            {database.views?.length || 0} views
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Duplicating...
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Duplicate Database
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
