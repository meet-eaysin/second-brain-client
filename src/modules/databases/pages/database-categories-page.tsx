import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
    Plus, 
    Edit, 
    Trash2, 
    GripVertical, 
    MoreHorizontal, 
    FolderPlus,
    ArrowLeft,
    Palette
} from 'lucide-react';
import { toast } from 'sonner';
import { categoryApi, type CreateCategoryRequest, type UpdateCategoryRequest } from '../services/categoryApi';
import type { DatabaseCategory } from '@/types/database.types';
import { getDatabasesLink } from '@/app/router/router-link';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Main } from '@/components/main';

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

const iconOptions = ['📁', '🗂️', '📋', '📊', '💼', '🎯', '🚀', '⭐', '🔥', '💡', '🎨', '🔧'];

export default function DatabaseCategoriesPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<DatabaseCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<DatabaseCategory | null>(null);
    const [formData, setFormData] = useState<CreateCategoryRequest>({
        name: '',
        description: '',
        icon: '📁',
        color: '#3b82f6'
    });

    // Load categories on mount
    React.useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setIsLoading(true);
            const data = await categoryApi.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        try {
            const newCategory = await categoryApi.createCategory(formData);
            setCategories(prev => [...prev, newCategory]);
            setIsCreateDialogOpen(false);
            setFormData({ name: '', description: '', icon: '📁', color: '#3b82f6' });
            toast.success('Category created successfully');
        } catch (error: any) {
            console.error('Failed to create category:', error);
            toast.error(error?.response?.data?.error?.message || 'Failed to create category');
        }
    };

    const handleEditCategory = async () => {
        if (!editingCategory) return;

        try {
            const updatedCategory = await categoryApi.updateCategory({
                id: editingCategory.id,
                ...formData
            });
            setCategories(prev => prev.map(cat => 
                cat.id === editingCategory.id ? updatedCategory : cat
            ));
            setIsEditDialogOpen(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '', icon: '📁', color: '#3b82f6' });
            toast.success('Category updated successfully');
        } catch (error: any) {
            console.error('Failed to update category:', error);
            toast.error(error?.response?.data?.error?.message || 'Failed to update category');
        }
    };

    const handleDeleteCategory = async (categoryId: string) => {
        if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return;
        }

        try {
            await categoryApi.deleteCategory(categoryId);
            setCategories(prev => prev.filter(cat => cat.id !== categoryId));
            toast.success('Category deleted successfully');
        } catch (error: any) {
            console.error('Failed to delete category:', error);
            toast.error(error?.response?.data?.error?.message || 'Failed to delete category');
        }
    };

    const handleDragEnd = async (result: any) => {
        if (!result.destination) return;

        const items = Array.from(categories);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setCategories(items);

        try {
            await categoryApi.reorderCategories(items.map(item => item.id));
            toast.success('Categories reordered successfully');
        } catch (error: any) {
            console.error('Failed to reorder categories:', error);
            toast.error('Failed to reorder categories');
            // Revert the change
            loadCategories();
        }
    };

    const openEditDialog = (category: DatabaseCategory) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            icon: category.icon || '📁',
            color: category.color || '#3b82f6'
        });
        setIsEditDialogOpen(true);
    };

    return (
        <>
            <EnhancedHeader showDatabaseActions={false} />
            
            <Main className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(getDatabasesLink())}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Databases
                            </Button>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Database Categories</h1>
                        <p className="text-muted-foreground">
                            Organize your databases with custom categories
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Category
                    </Button>
                </div>

                {/* Categories List */}
                {isLoading ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Loading categories...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <FolderPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Create your first category to organize your databases
                            </p>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Category
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="categories">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="space-y-3"
                                >
                                    {categories.map((category, index) => (
                                        <Draggable
                                            key={category.id}
                                            draggableId={category.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <Card
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`transition-shadow ${
                                                        snapshot.isDragging ? 'shadow-lg' : ''
                                                    }`}
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    {...provided.dragHandleProps}
                                                                    className="cursor-grab active:cursor-grabbing"
                                                                >
                                                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                                </div>
                                                                <div
                                                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                                                    style={{ backgroundColor: category.color }}
                                                                >
                                                                    {category.icon}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold">{category.name}</h3>
                                                                    {category.description && (
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {category.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDeleteCategory(category.id)}
                                                                        className="text-red-600"
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}

                {/* Create Category Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Category</DialogTitle>
                            <DialogDescription>
                                Create a new category to organize your databases
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter category name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description (optional)</Label>
                                <Input
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter category description"
                                />
                            </div>
                            <div>
                                <Label>Icon</Label>
                                <div className="flex gap-2 mt-2">
                                    {iconOptions.map((icon) => (
                                        <Button
                                            key={icon}
                                            variant={formData.icon === icon ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                        >
                                            {icon}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label>Color</Label>
                                <div className="flex gap-2 mt-2">
                                    {colorOptions.map((color) => (
                                        <Button
                                            key={color.value}
                                            variant={formData.color === color.value ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                                            className="w-8 h-8 p-0"
                                            style={{ backgroundColor: color.value }}
                                        >
                                            {formData.color === color.value && (
                                                <span className="text-white">✓</span>
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateCategory} disabled={!formData.name.trim()}>
                                Create Category
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Category Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>
                                Update the category information
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter category name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="edit-description">Description (optional)</Label>
                                <Input
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter category description"
                                />
                            </div>
                            <div>
                                <Label>Icon</Label>
                                <div className="flex gap-2 mt-2">
                                    {iconOptions.map((icon) => (
                                        <Button
                                            key={icon}
                                            variant={formData.icon === icon ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                        >
                                            {icon}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label>Color</Label>
                                <div className="flex gap-2 mt-2">
                                    {colorOptions.map((color) => (
                                        <Button
                                            key={color.value}
                                            variant={formData.color === color.value ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                                            className="w-8 h-8 p-0"
                                            style={{ backgroundColor: color.value }}
                                        >
                                            {formData.color === color.value && (
                                                <span className="text-white">✓</span>
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleEditCategory} disabled={!formData.name.trim()}>
                                Update Category
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Main>
        </>
    );
}
