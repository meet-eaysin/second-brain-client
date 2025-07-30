import React, { useState, useEffect } from 'react';
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateDatabase, useUpdateDatabase } from '../services/databaseQueries';
import type { Database } from '@/types/database.types';

const databaseFormSchema = z.object({
    name: z.string().min(1, 'Database name is required'),
    description: z.string().optional(),
    icon: z.string().optional(),
    cover: z.string().optional(),
    isPublic: z.boolean().default(false),
});

type DatabaseFormValues = z.infer<typeof databaseFormSchema>;

interface DatabaseFormProps {
    database?: Database | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: 'create' | 'edit';
}

export function DatabaseForm({ database, open, onOpenChange, mode = 'create' }: DatabaseFormProps) {
    const createDatabaseMutation = useCreateDatabase();
    const updateDatabaseMutation = useUpdateDatabase();

    const form = useForm<DatabaseFormValues>({
        resolver: zodResolver(databaseFormSchema),
        defaultValues: {
            name: '',
            description: '',
            icon: '📋',
            cover: '',
            isPublic: false,
        },
    });

    // Reset form when database changes or dialog opens/closes
    useEffect(() => {
        if (open) {
            if (database && mode === 'edit') {
                form.reset({
                    name: database.name,
                    description: database.description || '',
                    icon: database.icon || '📋',
                    cover: database.cover || '',
                    isPublic: database.isPublic,
                });
            } else {
                form.reset({
                    name: '',
                    description: '',
                    icon: '📋',
                    cover: '',
                    isPublic: false,
                });
            }
        }
    }, [database, mode, open, form]);

    const onSubmit = async (values: DatabaseFormValues) => {
        try {
            if (mode === 'edit' && database) {
                await updateDatabaseMutation.mutateAsync({
                    id: database.id,
                    data: values,
                });
            } else {
                await createDatabaseMutation.mutateAsync(values);
            }
            onOpenChange(false);
            form.reset();
        } catch (error) {
            console.error('Error saving database:', error);
        }
    };

    const isLoading = createDatabaseMutation.isPending || updateDatabaseMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Create Database' : 'Edit Database'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Create a new database to organize your data.'
                            : 'Update your database settings.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex gap-2">
                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="w-16 text-center text-lg"
                                                placeholder="📋"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Database name"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="What is this database for?"
                                            rows={3}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isPublic"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Make this database public</FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            Anyone with the link can view this database
                                        </p>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? mode === 'create'
                                        ? 'Creating...'
                                        : 'Saving...'
                                    : mode === 'create'
                                    ? 'Create Database'
                                    : 'Save Changes'
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
