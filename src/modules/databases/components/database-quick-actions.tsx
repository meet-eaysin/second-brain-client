import React from 'react';
import { Plus, FolderPlus, Import, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {useDatabase} from "@/modules/databases";

export const DatabaseQuickActions: React.FC = () => {
    const { setOpen } = useDatabase();

    const handleCreateDatabase = () => {
        setOpen('create-database');
    };

    const handleCreateFromTemplate = () => {
        // TODO: Implement template selection
        console.log('Create from template');
    };

    const handleImportDatabase = () => {
        // TODO: Implement database import
        console.log('Import database');
    };

    const handleCreateCategory = () => {
        // TODO: Implement category creation
        console.log('Create category');
    };

    return (
        <div className="flex items-center gap-2">
            <Button onClick={handleCreateDatabase} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Database
            </Button>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <FolderPlus className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={handleCreateDatabase}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Empty Database
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={handleCreateFromTemplate}>
                        <Layout className="h-4 w-4 mr-2" />
                        Create from Template
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={handleImportDatabase}>
                        <Import className="h-4 w-4 mr-2" />
                        Import Database
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={handleCreateCategory}>
                        <FolderPlus className="h-4 w-4 mr-2" />
                        Create Category
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
