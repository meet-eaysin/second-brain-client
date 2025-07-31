import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
    Users, 
    Calendar, 
    ShoppingCart, 
    BookOpen, 
    Briefcase, 
    Home,
    Target,
    Zap,
    Database as DatabaseIcon
} from 'lucide-react';

interface DatabaseTemplate {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    category: string;
    properties: Array<{
        name: string;
        type: string;
        required?: boolean;
    }>;
    sampleData?: any[];
}

const templates: DatabaseTemplate[] = [
    {
        id: 'project-management',
        name: 'Project Management',
        description: 'Track projects, tasks, and team progress',
        icon: Target,
        category: 'Business',
        properties: [
            { name: 'Task Name', type: 'TEXT', required: true },
            { name: 'Status', type: 'SELECT', required: true },
            { name: 'Priority', type: 'SELECT' },
            { name: 'Assignee', type: 'PERSON' },
            { name: 'Due Date', type: 'DATE' },
            { name: 'Progress', type: 'NUMBER' },
        ]
    },
    {
        id: 'crm',
        name: 'Customer Relationship Management',
        description: 'Manage customers, leads, and sales pipeline',
        icon: Users,
        category: 'Business',
        properties: [
            { name: 'Company Name', type: 'TEXT', required: true },
            { name: 'Contact Person', type: 'TEXT' },
            { name: 'Email', type: 'EMAIL' },
            { name: 'Phone', type: 'PHONE' },
            { name: 'Status', type: 'SELECT' },
            { name: 'Deal Value', type: 'NUMBER' },
            { name: 'Last Contact', type: 'DATE' },
        ]
    },
    {
        id: 'inventory',
        name: 'Inventory Management',
        description: 'Track products, stock levels, and suppliers',
        icon: ShoppingCart,
        category: 'Business',
        properties: [
            { name: 'Product Name', type: 'TEXT', required: true },
            { name: 'SKU', type: 'TEXT', required: true },
            { name: 'Category', type: 'SELECT' },
            { name: 'Stock Quantity', type: 'NUMBER' },
            { name: 'Unit Price', type: 'NUMBER' },
            { name: 'Supplier', type: 'TEXT' },
            { name: 'Reorder Level', type: 'NUMBER' },
        ]
    },
    {
        id: 'content-calendar',
        name: 'Content Calendar',
        description: 'Plan and schedule content across platforms',
        icon: Calendar,
        category: 'Marketing',
        properties: [
            { name: 'Content Title', type: 'TEXT', required: true },
            { name: 'Platform', type: 'MULTI_SELECT' },
            { name: 'Status', type: 'SELECT' },
            { name: 'Publish Date', type: 'DATE' },
            { name: 'Author', type: 'PERSON' },
            { name: 'Content Type', type: 'SELECT' },
            { name: 'Tags', type: 'MULTI_SELECT' },
        ]
    },
    {
        id: 'knowledge-base',
        name: 'Knowledge Base',
        description: 'Organize documentation and knowledge articles',
        icon: BookOpen,
        category: 'Documentation',
        properties: [
            { name: 'Article Title', type: 'TEXT', required: true },
            { name: 'Category', type: 'SELECT' },
            { name: 'Tags', type: 'MULTI_SELECT' },
            { name: 'Author', type: 'PERSON' },
            { name: 'Status', type: 'SELECT' },
            { name: 'Last Updated', type: 'DATE' },
            { name: 'Views', type: 'NUMBER' },
        ]
    },
    {
        id: 'job-applications',
        name: 'Job Applications',
        description: 'Track job applications and interview process',
        icon: Briefcase,
        category: 'Personal',
        properties: [
            { name: 'Company', type: 'TEXT', required: true },
            { name: 'Position', type: 'TEXT', required: true },
            { name: 'Status', type: 'SELECT' },
            { name: 'Application Date', type: 'DATE' },
            { name: 'Salary Range', type: 'TEXT' },
            { name: 'Contact Person', type: 'TEXT' },
            { name: 'Notes', type: 'TEXT' },
        ]
    },
];

interface DatabaseTemplatesProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectTemplate: (template: DatabaseTemplate) => void;
}

export const DatabaseTemplates: React.FC<DatabaseTemplatesProps> = ({
    open,
    onOpenChange,
    onSelectTemplate,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    
    const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
    
    const filteredTemplates = selectedCategory === 'All' 
        ? templates 
        : templates.filter(t => t.category === selectedCategory);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Choose a Template</DialogTitle>
                    <DialogDescription>
                        Start with a pre-built template or create a blank database
                    </DialogDescription>
                </DialogHeader>

                {/* Category Filter */}
                <div className="flex gap-2 mb-4">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Blank Database Option */}
                    <Card 
                        className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed"
                        onClick={() => onSelectTemplate(null)}
                    >
                        <CardHeader className="text-center">
                            <DatabaseIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                            <CardTitle className="text-lg">Blank Database</CardTitle>
                            <CardDescription>
                                Start from scratch with an empty database
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Template Options */}
                    {filteredTemplates.map((template) => (
                        <Card 
                            key={template.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => onSelectTemplate(template)}
                        >
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <template.icon className="h-8 w-8 text-primary" />
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{template.name}</CardTitle>
                                        <Badge variant="secondary" className="text-xs">
                                            {template.category}
                                        </Badge>
                                    </div>
                                </div>
                                <CardDescription className="mt-2">
                                    {template.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Includes {template.properties.length} properties:
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {template.properties.slice(0, 3).map((prop, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {prop.name}
                                            </Badge>
                                        ))}
                                        {template.properties.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{template.properties.length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
