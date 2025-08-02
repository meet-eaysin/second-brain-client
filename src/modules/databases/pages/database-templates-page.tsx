import React, { useState, useEffect } from 'react';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Main } from '@/layout/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Layout,
    Database,
    Users,
    Calendar,
    ShoppingCart,
    BookOpen,
    Briefcase,
    Heart,
    Star,
    Zap,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDatabasesLink } from '@/app/router/router-link';
import { templateApi, type DatabaseTemplate } from '../services/templateApi';
import { toast } from 'sonner';

// Icon mapping for templates
const iconMap: Record<string, React.ElementType> = {
    'briefcase': Briefcase,
    'calendar': Calendar,
    'users': Users,
    'shopping-cart': ShoppingCart,
    'book-open': BookOpen,
    'heart': Heart,
    'database': Database,
    'layout': Layout,
    'star': Star,
    'zap': Zap,
};

// Fallback templates for development
const fallbackTemplates: DatabaseTemplate[] = [
    {
        id: 'project-management',
        name: 'Project Management',
        description: 'Track projects, tasks, deadlines, and team members',
        icon: Briefcase,
        category: 'Productivity',
        properties: 8,
        popular: true,
        preview: ['Task Name', 'Status', 'Assignee', 'Due Date', 'Priority']
    },
    {
        id: 'content-calendar',
        name: 'Content Calendar',
        description: 'Plan and organize your content creation schedule',
        icon: Calendar,
        category: 'Marketing',
        properties: 6,
        popular: true,
        preview: ['Content Title', 'Type', 'Status', 'Publish Date', 'Platform']
    },
    {
        id: 'reading-list',
        name: 'Reading List',
        description: 'Keep track of books, articles, and reading progress',
        icon: BookOpen,
        category: 'Personal',
        properties: 7,
        popular: false,
        preview: ['Title', 'Author', 'Status', 'Rating', 'Notes']
    },
    {
        id: 'customer-database',
        name: 'Customer Database',
        description: 'Manage customer information and interactions',
        icon: Users,
        category: 'Business',
        properties: 10,
        popular: true,
        preview: ['Name', 'Email', 'Company', 'Status', 'Last Contact']
    },
    {
        id: 'inventory-tracker',
        name: 'Inventory Tracker',
        description: 'Monitor stock levels and product information',
        icon: ShoppingCart,
        category: 'Business',
        properties: 9,
        popular: false,
        preview: ['Product', 'SKU', 'Quantity', 'Price', 'Supplier']
    },
    {
        id: 'habit-tracker',
        name: 'Habit Tracker',
        description: 'Build and maintain daily habits and routines',
        icon: Heart,
        category: 'Personal',
        properties: 5,
        popular: false,
        preview: ['Habit', 'Frequency', 'Streak', 'Last Done', 'Notes']
    }
];

export default function DatabaseTemplatesPage() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [templates, setTemplates] = useState<DatabaseTemplate[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [isLoading, setIsLoading] = useState(true);

    // Load templates on mount
    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setIsLoading(true);
            const data = await templateApi.getTemplates();
            setTemplates(data);

            // Extract categories
            const templateCategories = [...new Set(data.map(t => t.category))];
            setCategories(['All', ...templateCategories]);
        } catch (error) {
            console.error('Failed to load templates:', error);
            toast.error('Failed to load templates, using fallback data');
            // Use fallback templates
            setTemplates(fallbackTemplates);
            setCategories(['All', 'Productivity', 'Marketing', 'Personal', 'Business']);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTemplates = selectedCategory === 'All'
        ? templates
        : templates.filter(template => template.category === selectedCategory);

    const handleUseTemplate = async (template: DatabaseTemplate) => {
        try {
            const database = await templateApi.createDatabaseFromTemplate(template.id, {
                name: `${template.name} Database`,
                description: `Created from ${template.name} template`,
                includeSampleData: true
            });

            toast.success(`Database created from ${template.name} template`);
            navigate(`/app/databases/${database.id}`);
        } catch (error: any) {
            console.error('Failed to create database from template:', error);
            toast.error(error?.response?.data?.error?.message || 'Failed to create database from template');
        }
    };

    return (
        <>
            <EnhancedHeader showDatabaseActions={true} />
            
            <Main className="space-y-6">
                {/* Page Header */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Database Templates</h1>
                    <p className="text-muted-foreground">
                        Start with pre-built templates to quickly create your databases
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className={selectedCategory === category ? 
                                "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" : 
                                ""
                            }
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">Loading templates...</span>
                    </div>
                ) : (
                    /* Templates Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map((template) => {
                            // Get icon component - handle both API and fallback data
                            const IconComponent = typeof template.icon === 'string'
                                ? iconMap[template.icon] || Database
                                : template.icon || Database;

                            return (
                                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100">
                                                    <IconComponent className="h-5 w-5 text-purple-600" />
                                                </div>
                                        <div>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                {template.name}
                                                {template.popular && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Popular
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            <Badge variant="outline" className="text-xs mt-1">
                                                {template.category}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {template.description}
                                </p>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                                {/* Template Preview */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Includes:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {/* Handle both API preview structure and fallback preview array */}
                                        {(template.preview?.properties || template.preview || []).slice(0, 3).map((property: any, index: number) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {typeof property === 'string' ? property : property.name}
                                            </Badge>
                                        ))}
                                        {(template.preview?.properties || template.preview || []).length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{(template.preview?.properties || template.preview || []).length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>
                                        {template.preview?.properties?.length ||
                                         template.properties ||
                                         (Array.isArray(template.preview) ? template.preview.length : 0)} properties
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Database className="h-4 w-4" />
                                        <span>Template</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button 
                                        onClick={() => handleUseTemplate(template)}
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                        size="sm"
                                    >
                                        <Zap className="h-4 w-4 mr-1" />
                                        Use Template
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Preview
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredTemplates.length === 0 && (
                    <div className="text-center py-12">
                        <Layout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                        <p className="text-muted-foreground">
                            Try selecting a different category or check back later for new templates.
                        </p>
                    </div>
                )}
            </Main>
        </>
    );
}
