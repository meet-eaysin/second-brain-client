import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Settings,
    Share2,
    Download,
    Upload,
    Lock,
    Unlock,
    Copy,
    Trash2,
    Users,
    Shield,
    Database,
    FileText,
    FileSpreadsheet,
    FileJson,
    Plus,
    MoreHorizontal,
    Eye,
    EyeOff,
    Edit,
    Star,
    Archive
} from 'lucide-react';
import { useDatabaseManagement } from './database-context';
import { AddViewDialog } from './view-management';
import { AddPropertyDialog } from './property-management';
import { toast } from 'sonner';

interface DatabaseSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DatabaseSettingsDialog({ open, onOpenChange }: DatabaseSettingsDialogProps) {
    const { 
        databaseName, 
        databaseIcon, 
        databaseDescription,
        isFrozen,
        isShared,
        permissions,
        updateProperty // We'll need to add updateDatabase to context
    } = useDatabaseManagement();
    
    const [name, setName] = useState(databaseName);
    const [icon, setIcon] = useState(databaseIcon);
    const [description, setDescription] = useState(databaseDescription || '');

    const handleSave = () => {
        // Update database metadata
        toast.success('Database settings updated');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Database Settings</DialogTitle>
                    <DialogDescription>
                        Configure your database settings and permissions.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="permissions">Permissions</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="db-name">Database Name</Label>
                            <Input
                                id="db-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter database name..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="db-icon">Icon</Label>
                            <Input
                                id="db-icon"
                                value={icon}
                                onChange={(e) => setIcon(e.target.value)}
                                placeholder="Enter emoji or icon..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="db-description">Description</Label>
                            <Textarea
                                id="db-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what this database is for..."
                                rows={3}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="permissions" className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Shared Database</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow others to access this database
                                    </p>
                                </div>
                                <Switch checked={isShared} />
                            </div>

                            {isShared && (
                                <div className="space-y-3 pl-4 border-l-2 border-muted">
                                    <div className="flex items-center justify-between">
                                        <Label>Can Edit</Label>
                                        <Switch checked={permissions.canEdit} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label>Can Delete</Label>
                                        <Switch checked={permissions.canDelete} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label>Can Share</Label>
                                        <Switch checked={permissions.canShare} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label>Can Manage Views</Label>
                                        <Switch checked={permissions.canManageViews} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label>Can Manage Properties</Label>
                                        <Switch checked={permissions.canManageProperties} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Freeze Database</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Prevent any changes to data or structure
                                    </p>
                                </div>
                                <Switch checked={isFrozen} />
                            </div>

                            <div className="p-4 border rounded-lg bg-destructive/5 border-destructive/20">
                                <h4 className="font-medium text-destructive mb-2">Danger Zone</h4>
                                <div className="space-y-2">
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Database
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        This action cannot be undone. All data will be permanently deleted.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface ShareDatabaseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ShareDatabaseDialog({ open, onOpenChange }: ShareDatabaseDialogProps) {
    const [shareLink, setShareLink] = useState('');
    const [accessLevel, setAccessLevel] = useState('view');

    const generateShareLink = () => {
        const link = `${window.location.origin}/shared/database/${Date.now()}`;
        setShareLink(link);
        toast.success('Share link generated');
    };

    const copyShareLink = () => {
        navigator.clipboard.writeText(shareLink);
        toast.success('Share link copied to clipboard');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Database</DialogTitle>
                    <DialogDescription>
                        Generate a link to share this database with others.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Access Level</Label>
                        <Select value={accessLevel} onValueChange={setAccessLevel}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="view">View Only</SelectItem>
                                <SelectItem value="edit">Can Edit</SelectItem>
                                <SelectItem value="admin">Full Access</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {shareLink ? (
                        <div className="space-y-2">
                            <Label>Share Link</Label>
                            <div className="flex gap-2">
                                <Input value={shareLink} readOnly />
                                <Button onClick={copyShareLink}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button onClick={generateShareLink}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Generate Share Link
                        </Button>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface ImportExportDialogProps {
    mode: 'import' | 'export';
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ImportExportDialog({ mode, open, onOpenChange }: ImportExportDialogProps) {
    const { exportDatabase, importDatabase } = useDatabaseManagement();
    const [format, setFormat] = useState<'csv' | 'json' | 'excel'>('csv');
    const [file, setFile] = useState<File | null>(null);

    const handleExport = () => {
        exportDatabase(format);
        toast.success(`Database exported as ${format.toUpperCase()}`);
        onOpenChange(false);
    };

    const handleImport = () => {
        if (!file) {
            toast.error('Please select a file to import');
            return;
        }
        
        // Read file and import
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                importDatabase(data, format);
                toast.success('Data imported successfully');
                onOpenChange(false);
            } catch (error) {
                toast.error('Failed to import data');
            }
        };
        reader.readAsText(file);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'import' ? 'Import Data' : 'Export Data'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'import' 
                            ? 'Import data from a file into this database.'
                            : 'Export your database data to a file.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Format</Label>
                        <Select value={format} onValueChange={(value: string) => setFormat(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="csv">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        CSV
                                    </div>
                                </SelectItem>
                                <SelectItem value="excel">
                                    <div className="flex items-center gap-2">
                                        <FileSpreadsheet className="h-4 w-4" />
                                        Excel
                                    </div>
                                </SelectItem>
                                <SelectItem value="json">
                                    <div className="flex items-center gap-2">
                                        <FileJson className="h-4 w-4" />
                                        JSON
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {mode === 'import' && (
                        <div className="space-y-2">
                            <Label>File</Label>
                            <Input
                                type="file"
                                accept={format === 'csv' ? '.csv' : format === 'excel' ? '.xlsx,.xls' : '.json'}
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={mode === 'import' ? handleImport : handleExport}>
                        {mode === 'import' ? (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Import
                            </>
                        ) : (
                            <>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function DatabaseHeaderActions() {
    const { 
        databaseName, 
        databaseIcon, 
        isFrozen, 
        isShared,
        freezeDatabase,
        unfreezeDatabase,
        records,
        views
    } = useDatabaseManagement();
    
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);

    const handleFreeze = () => {
        if (isFrozen) {
            unfreezeDatabase();
            toast.success('Database unfrozen');
        } else {
            freezeDatabase();
            toast.success('Database frozen');
        }
    };

    return (
        <>
            {/* Database Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        {databaseIcon} {databaseName}
                        {isFrozen && (
                            <Badge variant="destructive" className="text-xs">
                                <Lock className="h-3 w-3 mr-1" />
                                Frozen
                            </Badge>
                        )}
                        {isShared && (
                            <Badge variant="secondary" className="text-xs">
                                <Share2 className="h-3 w-3 mr-1" />
                                Shared
                            </Badge>
                        )}
                    </h2>
                    <p className="text-muted-foreground">
                        {records.length} records • {views.length} views
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Quick Actions */}
                    <AddPropertyDialog 
                        trigger={
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Property
                            </Button>
                        }
                    />
                    
                    <AddViewDialog 
                        trigger={
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                View
                            </Button>
                        }
                    />

                    {/* Main Actions Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Database Actions</DropdownMenuLabel>
                            
                            <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                                <Settings className="mr-2 h-4 w-4" />
                                Database Settings
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => setShareOpen(true)}>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share Database
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={handleFreeze}>
                                {isFrozen ? (
                                    <>
                                        <Unlock className="mr-2 h-4 w-4" />
                                        Unfreeze Database
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Freeze Database
                                    </>
                                )}
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => setImportOpen(true)}>
                                <Upload className="mr-2 h-4 w-4" />
                                Import Data
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => setExportOpen(true)}>
                                <Download className="mr-2 h-4 w-4" />
                                Export Data
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Database
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Dialogs */}
            <DatabaseSettingsDialog 
                open={settingsOpen} 
                onOpenChange={setSettingsOpen} 
            />
            
            <ShareDatabaseDialog 
                open={shareOpen} 
                onOpenChange={setShareOpen} 
            />
            
            <ImportExportDialog 
                mode="import"
                open={importOpen} 
                onOpenChange={setImportOpen} 
            />
            
            <ImportExportDialog 
                mode="export"
                open={exportOpen} 
                onOpenChange={setExportOpen} 
            />
        </>
    );
}
