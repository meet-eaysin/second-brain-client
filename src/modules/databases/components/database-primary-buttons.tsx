import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Plus,
    Database as DatabaseIcon,
    Import,
    FileText,
    Settings,
    Share,
    MoreHorizontal,
    Columns,
} from 'lucide-react';
import {useDatabaseContext} from "@/modules/databases";

export function DatabasePrimaryButtons() {
    const { setOpen, currentDatabase } = useDatabaseContext();

    const handleCreateDatabase = () => {
        setOpen('create-database');
    };

    const handleImportData = () => {
        // Handle import data
        console.log('Import data');
    };

    const handleExportData = () => {
        // Handle export data
        console.log('Export data');
    };

    const handleShareDatabase = () => {
        setOpen('share-database');
    };

    const handleDatabaseSettings = () => {
        setOpen('edit-database');
    };

    // If we're in a database view, show database-specific actions
    if (currentDatabase) {
        return (
            <div className="flex items-center gap-2">
                <Button
                    onClick={() => {
                        if (currentDatabase?.id) {
                            setOpen('create-record');
                        }
                    }}
                    disabled={!currentDatabase?.id}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Record
                </Button>

                <Button
                    variant="outline"
                    onClick={() => {
                        if (currentDatabase?.id) {
                            setOpen('create-property');
                        }
                    }}
                    disabled={!currentDatabase?.id}
                >
                    <Columns className="mr-2 h-4 w-4" />
                    Add Property
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => {
                                if (currentDatabase?.id) {
                                    setOpen('create-view');
                                }
                            }}
                            disabled={!currentDatabase?.id}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add View
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleImportData}>
                            <Import className="mr-2 h-4 w-4" />
                            Import Data
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportData}>
                            <FileText className="mr-2 h-4 w-4" />
                            Export Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                if (currentDatabase?.id) {
                                    handleShareDatabase();
                                }
                            }}
                            disabled={!currentDatabase?.id}
                        >
                            <Share className="mr-2 h-4 w-4" />
                            Share Database
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                if (currentDatabase?.id) {
                                    handleDatabaseSettings();
                                }
                            }}
                            disabled={!currentDatabase?.id}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Database Settings
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    }

    // Default view - show create database button
    return (
        <div className="flex items-center gap-2">
            <Button onClick={handleCreateDatabase}>
                <Plus className="mr-2 h-4 w-4" />
                New Database
            </Button>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCreateDatabase}>
                        <DatabaseIcon className="mr-2 h-4 w-4" />
                        Create Database
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleImportData}>
                        <Import className="mr-2 h-4 w-4" />
                        Import Database
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
