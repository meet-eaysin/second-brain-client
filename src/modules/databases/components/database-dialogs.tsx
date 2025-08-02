import { useState } from 'react';
import {
    useAddProperty,
    useUpdateProperty,
    useCreateRecord,
    useUpdateRecord,
    useAddView
} from '../services/databaseQueries';
import { RecordForm } from './record-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Mail, Trash2, Users, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';
import type { Database, PermissionLevel } from '@/types/database.types';
import { DatabaseForm } from "./database-form";
import { PropertyForm } from "./property-form";
import { ViewForm } from "./view-form";
import {useDatabaseContext} from "@/modules/databases";

// Share Database Dialog Component
interface ShareDatabaseDialogProps {
    database: Database | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function ShareDatabaseDialog({ database, open, onOpenChange }: ShareDatabaseDialogProps) {
    const [email, setEmail] = useState('');
    const [permission, setPermission] = useState<PermissionLevel>('read');
    const [isLoading, setIsLoading] = useState(false);

    const handleShare = async () => {
        if (!database || !email) return;

        setIsLoading(true);
        try {
            // First, we need to get the user ID from the email
            // For now, we'll use the email as userId (this should be improved to lookup user by email)
            await databaseApi.shareDatabase(database.id, {
                userId: email, // This should be the actual user ID, not email
                permission
            });
            toast.success(`Database shared with ${email}`);
            setEmail('');
            setPermission('read');
            onOpenChange(false);
        } catch (error: any) {
            console.error('Share database failed:', error);
            const errorMessage = error?.response?.data?.error?.message ||
                               error?.message ||
                               'Failed to share database';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const copyShareLink = () => {
        if (!database) return;
        const shareLink = `${window.location.origin}/databases/${database.id}`;
        navigator.clipboard.writeText(shareLink);
        toast.success('Share link copied to clipboard');
    };

    const getPermissionIcon = (level: PermissionLevel) => {
        switch (level) {
            case 'read': return <Lock className="h-4 w-4" />;
            case 'write': return <Users className="h-4 w-4" />;
            case 'admin': return <Globe className="h-4 w-4" />;
            default: return <Lock className="h-4 w-4" />;
        }
    };

    const getPermissionColor = (level: PermissionLevel) => {
        switch (level) {
            case 'read': return 'bg-gray-100 text-gray-800';
            case 'write': return 'bg-blue-100 text-blue-800';
            case 'admin': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Database</DialogTitle>
                    <DialogDescription>
                        Share "{database?.name}" with others by inviting them via email or sharing a link.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Share by email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Invite by email</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1"
                            />
                            <Select value={permission} onValueChange={(value: PermissionLevel) => setPermission(value)}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="read">Read</SelectItem>
                                    <SelectItem value="write">Write</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={handleShare}
                            disabled={!email || isLoading}
                            className="w-full"
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            {isLoading ? 'Sending...' : 'Send Invitation'}
                        </Button>
                    </div>

                    <Separator />

                    {/* Share link */}
                    <div className="space-y-2">
                        <Label>Share link</Label>
                        <div className="flex space-x-2">
                            <Input
                                value={database ? `${window.location.origin}/databases/${database.id}` : ''}
                                readOnly
                                className="flex-1"
                            />
                            <Button variant="outline" onClick={copyShareLink}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Anyone with this link can view the database
                        </p>
                    </div>

                    <Separator />

                    {/* Current permissions */}
                    <div className="space-y-2">
                        <Label>Current permissions</Label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {database?.permissions?.map((perm, index) => (
                                <div key={index} className="flex items-center justify-between p-2 border rounded">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                            {perm.userId.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm">{perm.userId}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge className={getPermissionColor(perm.permission)}>
                                            {getPermissionIcon(perm.permission)}
                                            <span className="ml-1 capitalize">{perm.permission}</span>
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={async () => {
                                                try {
                                                    await databaseApi.removeDatabaseAccess(database.id, perm.userId);
                                                    toast.success('Access removed');
                                                    // TODO: Refresh the database data
                                                } catch (error: any) {
                                                    toast.error('Failed to remove access');
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            )) || (
                                <p className="text-sm text-muted-foreground">No additional permissions set</p>
                            )}
                        </div>
                    </div>
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

// Delete Database Dialog Component
interface DeleteDatabaseDialogProps {
    database: Database | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function DeleteDatabaseDialog({ database, open, onOpenChange }: DeleteDatabaseDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [confirmText, setConfirmText] = useState('');

    const handleDelete = async () => {
        if (!database || confirmText !== database.name) return;

        setIsLoading(true);
        try {
            // TODO: Implement delete database API call
            // await deleteDatabase(database.id);
            toast.success('Database deleted successfully');
            onOpenChange(false);
            setConfirmText('');
            // Navigate away or refresh the page
        } catch {
            toast.error('Failed to delete database');
        } finally {
            setIsLoading(false);
        }
    };

    const isConfirmValid = confirmText === database?.name;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Delete Database
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                        <p>
                            Are you sure you want to delete <strong>"{database?.name}"</strong>?
                            This action cannot be undone.
                        </p>
                        <p className="text-sm">
                            This will permanently delete:
                        </p>
                        <ul className="text-sm list-disc list-inside space-y-1 ml-4">
                            <li>All database records and data</li>
                            <li>All properties and views</li>
                            <li>All permissions and sharing settings</li>
                            <li>All associated files and attachments</li>
                        </ul>
                        <div className="mt-4">
                            <Label htmlFor="confirm-name" className="text-sm font-medium">
                                Type <strong>{database?.name}</strong> to confirm:
                            </Label>
                            <Input
                                id="confirm-name"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder={database?.name || ''}
                                className="mt-2"
                                disabled={isLoading}
                            />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={!isConfirmValid || isLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isLoading ? 'Deleting...' : 'Delete Database'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function DatabaseDialogs() {
    const {
        dialogOpen: open,
        setDialogOpen: setOpen,
        currentDatabase,
        currentRecord,
        currentProperty,
        setCurrentDatabase,
        setCurrentProperty,
        setCurrentRecord
    } = useDatabaseContext();

    // Mutation hooks
    const addPropertyMutation = useAddProperty();
    const updatePropertyMutation = useUpdateProperty();
    const createRecordMutation = useCreateRecord();
    const updateRecordMutation = useUpdateRecord();
    const addViewMutation = useAddView();

    return (
        <>
            <DatabaseForm
                database={open === 'edit-database' ? currentDatabase : null}
                open={open === 'create-database' || open === 'edit-database'}
                onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
                mode={open === 'edit-database' ? 'edit' : 'create'}
            />

            <PropertyForm
                property={open === 'edit-property' ? currentProperty : null}
                open={open === 'create-property' || open === 'edit-property'}
                onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
                onSubmit={async (values) => {
                    if (!currentDatabase?.id) {
                        toast.error('Database is still loading. Please wait a moment and try again.');
                        return;
                    }

                    try {
                        if (open === 'edit-property' && currentProperty?.id) {
                            // Transform data for update API
                            const updateData = {
                                name: values.name,
                                description: values.description,
                                required: values.required,
                                selectOptions: values.selectOptions
                            };

                            // Update existing property using mutation hook
                            const updatedDatabase = await updatePropertyMutation.mutateAsync({
                                databaseId: currentDatabase.id,
                                propertyId: currentProperty.id,
                                data: updateData
                            });

                            // Update the current database in context
                            setCurrentDatabase(updatedDatabase);
                        } else {
                            // Transform data for create API
                            const createData = {
                                name: values.name!,
                                type: values.type!,
                                description: values.description,
                                required: values.required || false,
                                selectOptions: values.selectOptions?.map(option => ({
                                    name: option.name,
                                    color: option.color
                                }))
                            };

                            // Create new property using mutation hook
                            const updatedDatabase = await addPropertyMutation.mutateAsync({
                                databaseId: currentDatabase.id,
                                data: createData
                            });

                            // Update the current database in context
                            setCurrentDatabase(updatedDatabase);
                        }

                        setOpen(null);
                        setCurrentProperty(null);
                    } catch (error: any) {
                        console.error('Property operation failed:', error);
                        // Error handling is done by the mutation hooks
                    }
                }}
                mode={open === 'edit-property' ? 'edit' : 'create'}
                isLoading={addPropertyMutation.isPending || updatePropertyMutation.isPending}
            />

            {/* Record Form */}
            <RecordForm
                record={open === 'edit-record' ? currentRecord : null}
                properties={currentDatabase?.properties || []}
                open={open === 'create-record' || open === 'edit-record'}
                onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
                onSubmit={async (data) => {
                    if (!currentDatabase?.id) {
                        toast.error('Database is still loading. Please wait a moment and try again.');
                        return;
                    }

                    try {
                        if (open === 'edit-record' && currentRecord?.id) {
                            // Update existing record using mutation hook
                            await updateRecordMutation.mutateAsync({
                                databaseId: currentDatabase.id,
                                recordId: currentRecord.id,
                                data: { properties: data }
                            });
                        } else {
                            // Create new record using mutation hook
                            await createRecordMutation.mutateAsync({
                                databaseId: currentDatabase.id,
                                data: { properties: data }
                            });
                        }

                        setOpen(null);
                        setCurrentRecord(null);
                    } catch (error: any) {
                        console.error('Record operation failed:', error);
                        // Error handling is done by the mutation hooks
                    }
                }}
                mode={open === 'edit-record' ? 'edit' : 'create'}
                isLoading={createRecordMutation.isPending || updateRecordMutation.isPending}
            />

            {/* View Form */}
            <ViewForm
                open={open === 'create-view'}
                onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
                properties={currentDatabase?.properties || []}
                onSubmit={async (viewData) => {
                    if (!currentDatabase?.id) {
                        toast.error('Database is still loading. Please wait a moment and try again.');
                        return;
                    }

                    try {
                        // Create new view using mutation hook
                        const updatedDatabase = await addViewMutation.mutateAsync({
                            databaseId: currentDatabase.id,
                            data: viewData
                        });

                        // Update the current database in context
                        setCurrentDatabase(updatedDatabase);
                        setOpen(null);
                    } catch (error: any) {
                        console.error('View creation failed:', error);
                        // Error handling is done by the mutation hook
                    }
                }}
            />

            {/* Share Database Dialog */}
            <ShareDatabaseDialog
                database={currentDatabase}
                open={open === 'share-database'}
                onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
            />

            {/* Delete Database Dialog */}
            <DeleteDatabaseDialog
                database={currentDatabase}
                open={open === 'delete-database'}
                onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
            />
        </>
    );
}
