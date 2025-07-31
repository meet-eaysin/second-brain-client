import React, { useEffect, useState } from 'react';
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
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Image, Camera, Globe, Lock } from 'lucide-react';
import type { Database } from '@/types/database.types';
import { useCreateDatabase, useUpdateDatabase } from "@/modules/databases";
import {Switch} from "@/components/ui/switch.tsx";

const databaseFormSchema = z.object({
    name: z.string().min(1, 'Database name is required'),
    description: z.string().optional(),
    icon: z.string().optional(),
    cover: z.string().optional(),
    isPublic: z.boolean(),
});

type DatabaseFormValues = z.infer<typeof databaseFormSchema>;

interface DatabaseFormProps {
    database?: Database | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: 'create' | 'edit';
}

const popularIcons = ['📊', '📋', '💼', '🎯', '📈', '🗂️', '💡', '🔬', '📚', '🎨', '🏗️', '⚡'];

export function DatabaseForm({ database, open, onOpenChange, mode = 'create' }: DatabaseFormProps) {
    const createDatabaseMutation = useCreateDatabase();
    const updateDatabaseMutation = useUpdateDatabase();
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);

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

    const watchedIcon = form.watch('icon');
    const watchedIsPublic = form.watch('isPublic');

    useEffect(() => {
        if (open) {
            if (database && mode === 'edit') {
                const formData = {
                    name: database.name,
                    description: database.description || '',
                    icon: database.icon || '📋',
                    cover: database.cover || '',
                    isPublic: database.isPublic,
                };
                form.reset(formData);
                setCoverPreview(database.cover || null);
            } else {
                const defaultData = {
                    name: '',
                    description: '',
                    icon: '📋',
                    cover: '',
                    isPublic: false,
                };
                form.reset(defaultData);
                setCoverPreview(null);
            }
        }
    }, [database, mode, open, form]);

    const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setIsUploadingCover(true);

        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setCoverPreview(result);
                form.setValue('cover', result);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading cover:', error);
            alert('Failed to upload cover image');
        } finally {
            setIsUploadingCover(false);
        }
    };

    const handleRemoveCover = () => {
        setCoverPreview(null);
        form.setValue('cover', '');
    };

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
            setCoverPreview(null);
        } catch (error) {
            console.error('Error saving database:', error);
        }
    };

    const isLoading = createDatabaseMutation.isPending || updateDatabaseMutation.isPending;

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl max-h-[95vh] overflow-hidden p-0 gap-0">
              <div className="relative">
                  <div className="relative h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden">
                      {coverPreview ? (
                        <>
                            <img
                              src={coverPreview}
                              alt="Cover"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white/80">
                                <Image className="mx-auto h-8 w-8 mb-2" />
                                <p className="text-sm font-medium">Add a cover image</p>
                            </div>
                        </div>
                      )}

                      {/* Cover Actions */}
                      <div className="absolute bottom-4 right-3 flex gap-2">
                          <label className="cursor-pointer">
                              <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium hover:bg-white/30 transition-colors">
                                  <Camera className="h-3 w-3" />
                                  {isUploadingCover ? 'Uploading...' : 'Change'}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverUpload}
                                disabled={isLoading || isUploadingCover}
                              />
                          </label>
                          {coverPreview && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-auto p-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full"
                              onClick={handleRemoveCover}
                              disabled={isLoading || isUploadingCover}
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
                      </div>

                      {/* Visibility Badge */}
                      <div className="absolute bottom-4 left-4">
                          <Badge variant={watchedIsPublic ? "default" : "secondary"} className="text-xs shadow-sm">
                              {watchedIsPublic ? (
                                <>
                                    <Globe className="h-3 w-3 mr-1" />
                                    Public
                                </>
                              ) : (
                                <>
                                    <Lock className="h-3 w-3 mr-1" />
                                    Private
                                </>
                              )}
                          </Badge>
                      </div>
                  </div>

                  <div className="px-6 pt-8 pb-4">
                      <DialogHeader className="text-left space-y-1">
                          <DialogTitle className="text-xl">
                              {mode === 'create' ? 'Create New Database' : 'Edit Database'}
                          </DialogTitle>
                          <DialogDescription>
                              {mode === 'create'
                                ? 'Set up your new database with a name, description, and settings.'
                                : 'Update your database information and settings.'
                              }
                          </DialogDescription>
                      </DialogHeader>
                  </div>
              </div>

              <div className="px-6 pb-6 overflow-y-auto flex-1">
                  <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          {showIconPicker && (
                            <Card className="p-4 border-dashed">
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium">Choose an icon</h4>
                                    <div className="grid grid-cols-6 gap-2">
                                        {popularIcons.map((icon) => (
                                          <Button
                                            key={icon}
                                            type="button"
                                            variant={watchedIcon === icon ? "default" : "ghost"}
                                            size="sm"
                                            className="h-10 w-10 p-0 text-lg"
                                            onClick={() => {
                                                form.setValue('icon', icon);
                                                setShowIconPicker(false);
                                            }}
                                          >
                                              {icon}
                                          </Button>
                                        ))}
                                    </div>
                                    <FormField
                                      control={form.control}
                                      name="icon"
                                      render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Or enter custom emoji
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                  {...field}
                                                  placeholder="Enter emoji..."
                                                  className="text-center"
                                                />
                                            </FormControl>
                                        </FormItem>
                                      )}
                                    />
                                </div>
                            </Card>
                          )}

                          <div className="grid grid-cols-10 gap-3 items-end">
                              <FormField
                                control={form.control}
                                name="icon"
                                render={({ field }) => (
                                  <FormItem className="col-span-2">
                                      <FormLabel>Icon</FormLabel>
                                      <FormControl>
                                          <Input
                                            {...field}
                                            className="w-full text-center"
                                            placeholder="📋"
                                            disabled={isLoading}
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
                                  <FormItem className="col-span-8">
                                      <FormLabel>Database Name</FormLabel>
                                      <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="Enter database name..."
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
                                        placeholder="What's this database about? Add tags, purpose, or any helpful context..."
                                        disabled={isLoading}
                                      />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Card className="p-4 border-2">
                              <FormField
                                control={form.control}
                                name="isPublic"
                                render={({ field }) => (
                                  <FormItem>
                                      <div className="flex items-center justify-between">
                                          <div className="space-y-1">
                                              <FormLabel className="text-sm font-medium flex items-center gap-2">
                                                  {field.value ? (
                                                    <Globe className="h-4 w-4 text-green-600" />
                                                  ) : (
                                                    <Lock className="h-4 w-4 text-gray-600" />
                                                  )}
                                                  {field.value ? 'Public Database' : 'Private Database'}
                                              </FormLabel>
                                              <p className="text-sm text-muted-foreground">
                                                  {field.value
                                                    ? 'Anyone with the link can view this database'
                                                    : 'Only you can access this database'
                                                  }
                                              </p>
                                          </div>
                                          <FormControl>
                                              <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isLoading}
                                              />
                                          </FormControl>
                                      </div>
                                  </FormItem>
                                )}
                              />
                          </Card>
                      </form>
                  </Form>
              </div>

              {/* Footer */}
              <DialogFooter className="px-6 py-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading || isUploadingCover}
                    className="min-w-[100px]"
                  >
                      Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isLoading || isUploadingCover}
                  >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            {mode === 'create' ? 'Creating...' : 'Saving...'}
                        </div>
                      ) : (
                        <>
                            {mode === 'create' ? 'Create Database' : 'Save Changes'}
                        </>
                      )}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    );
}