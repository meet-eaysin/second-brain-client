import React from 'react';
import {
    Plus,
    FolderPlus,
    Import,
    Layout,
    Database,
    Sparkles,
    ChevronDown,
    Zap,
    Copy,
    Download,
    Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { useDatabase } from "@/modules/databases";
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
    getDatabaseTemplatesLink,
    getDatabaseImportLink,
    getDatabaseCategoriesLink
} from '@/app/router/router-link';

interface DatabaseQuickActionsProps {
    className?: string;
    variant?: 'default' | 'compact';
}

export const DatabaseQuickActions: React.FC<DatabaseQuickActionsProps> = ({
    className,
    variant = 'default'
}) => {
    const { setOpen } = useDatabase();
    const navigate = useNavigate();

    const handleCreateDatabase = () => {
        setOpen('create-database');
    };

    const handleCreateFromTemplate = () => {
        navigate(getDatabaseTemplatesLink());
    };

    const handleImportDatabase = () => {
        navigate(getDatabaseImportLink());
    };

    const handleCreateCategory = () => {
        navigate(getDatabaseCategoriesLink());
    };

    const handleDuplicateDatabase = () => {
        // TODO: Implement database duplication
        console.log('Duplicate database');
    };

    const handleExportDatabase = () => {
        // TODO: Implement database export
        console.log('Export database');
    };

    const handleAIGenerate = () => {
        // TODO: Implement AI database generation
        console.log('Generate with AI');
    };

    if (variant === 'compact') {
        return (
            <div className={cn("flex items-center gap-1", className)}>
                <Button
                    onClick={handleCreateDatabase}
                    size="sm"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">New</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="px-2">
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuLabel className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Quick Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleCreateDatabase}>
                                <Database className="h-4 w-4 mr-2" />
                                Create Empty Database
                                <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleCreateFromTemplate}>
                                <Layout className="h-4 w-4 mr-2" />
                                Create from Template
                                <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleAIGenerate}>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate with AI
                                <Badge variant="secondary" className="ml-auto text-xs">New</Badge>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={handleImportDatabase}>
                                <Import className="h-4 w-4 mr-2" />
                                Import Database
                                <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleCreateCategory}>
                                <FolderPlus className="h-4 w-4 mr-2" />
                                Create Category
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-3", className)}>
            {/* Primary Action */}
            <Button
                onClick={handleCreateDatabase}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-sm"
            >
                <Plus className="h-4 w-4 mr-2" />
                New Database
            </Button>

            {/* Secondary Actions Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-dashed hover:border-solid hover:bg-muted/50 transition-all"
                    >
                        <Zap className="h-4 w-4 mr-2" />
                        More Actions
                        <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                    <DropdownMenuLabel className="flex items-center gap-2 text-sm font-medium">
                        <Database className="h-4 w-4" />
                        Database Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Create Group */}
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleCreateDatabase} className="py-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-purple-100 to-blue-100 mr-3">
                                <Database className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Create Empty Database</div>
                                <div className="text-xs text-muted-foreground">Start with a blank database</div>
                            </div>
                            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={handleCreateFromTemplate} className="py-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-green-100 to-emerald-100 mr-3">
                                <Layout className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Create from Template</div>
                                <div className="text-xs text-muted-foreground">Use pre-built templates</div>
                            </div>
                            <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={handleAIGenerate} className="py-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-purple-100 to-indigo-100 mr-3">
                                <Brain className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium flex items-center gap-2">
                                    Generate with AI
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                                        Upcoming
                                    </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">AI-powered database creation</div>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    {/* Import/Export Group */}
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleImportDatabase} className="py-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-blue-100 to-cyan-100 mr-3">
                                <Import className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Import Database</div>
                                <div className="text-xs text-muted-foreground">CSV, JSON, or other formats</div>
                            </div>
                            <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={handleDuplicateDatabase} className="py-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-indigo-100 to-purple-100 mr-3">
                                <Copy className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Duplicate Database</div>
                                <div className="text-xs text-muted-foreground">Copy existing database</div>
                            </div>
                            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={handleExportDatabase} className="py-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-teal-100 to-cyan-100 mr-3">
                                <Download className="h-4 w-4 text-teal-600" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Export Database</div>
                                <div className="text-xs text-muted-foreground">Download as CSV, JSON, etc.</div>
                            </div>
                            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    {/* Organization Group */}
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleCreateCategory} className="py-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-rose-100 to-pink-100 mr-3">
                                <FolderPlus className="h-4 w-4 text-rose-600" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium">Create Category</div>
                                <div className="text-xs text-muted-foreground">Organize your databases</div>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
