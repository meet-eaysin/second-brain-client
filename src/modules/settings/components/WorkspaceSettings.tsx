import React, { useState } from 'react';
import { useWorkspace } from '@/modules/workspaces/context/workspace-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
    Settings, 
    Users, 
    Shield, 
    Trash2, 
    Copy, 
    Crown, 
    UserPlus,
    Globe,
    Edit3
} from 'lucide-react';
import { toast } from 'sonner';

export const WorkspaceSettings: React.FC = () => {
    const { currentWorkspace, updateWorkspace, deleteWorkspace } = useWorkspace();
    const [isEditing, setIsEditing] = useState(false);
    const [workspaceName, setWorkspaceName] = useState(currentWorkspace?.name || '');
    const [workspaceDescription, setWorkspaceDescription] = useState(currentWorkspace?.description || '');
    const [allowMemberInvites, setAllowMemberInvites] = useState(currentWorkspace?.allowMemberInvites || false);
    const [isPublic, setIsPublic] = useState(currentWorkspace?.isPublic || false);

    if (!currentWorkspace) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">No workspace selected</p>
            </div>
        );
    }

    const handleSaveChanges = async () => {
        try {
            await updateWorkspace(currentWorkspace.id, {
                name: workspaceName,
                description: workspaceDescription,
                allowMemberInvites,
                isPublic,
            });
            setIsEditing(false);
            toast.success('Workspace settings updated');
        } catch (error) {
            toast.error('Failed to update workspace settings');
        }
    };

    const handleDeleteWorkspace = async () => {
        try {
            await deleteWorkspace(currentWorkspace.id);
            toast.success('Workspace deleted');
        } catch (error) {
            toast.error('Failed to delete workspace');
        }
    };

    const handleDuplicateWorkspace = () => {
        // TODO: Implement workspace duplication
        toast.info('Workspace duplication coming soon');
    };

    return (
        <div className="space-y-6">
            {/* Workspace Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Workspace Information
                    </CardTitle>
                    <CardDescription>
                        Basic information about your workspace
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <Label>Workspace Name</Label>
                            {isEditing ? (
                                <Input
                                    value={workspaceName}
                                    onChange={(e) => setWorkspaceName(e.target.value)}
                                    placeholder="Enter workspace name"
                                />
                            ) : (
                                <p className="text-sm font-medium">{currentWorkspace.name}</p>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            <Edit3 className="h-4 w-4 mr-2" />
                            {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                    </div>

                    {isEditing && (
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={workspaceDescription}
                                onChange={(e) => setWorkspaceDescription(e.target.value)}
                                placeholder="Describe your workspace"
                                rows={3}
                            />
                        </div>
                    )}

                    {!isEditing && currentWorkspace.description && (
                        <div className="space-y-1">
                            <Label>Description</Label>
                            <p className="text-sm text-muted-foreground">{currentWorkspace.description}</p>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            Owner
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {currentWorkspace.memberCount || 1} members
                        </Badge>
                    </div>

                    {isEditing && (
                        <Button onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Privacy & Permissions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Privacy & Permissions
                    </CardTitle>
                    <CardDescription>
                        Control who can access and modify your workspace
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Public Workspace
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Allow anyone to discover and view this workspace
                            </p>
                        </div>
                        <Switch
                            checked={isPublic}
                            onCheckedChange={setIsPublic}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Member Invites
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Allow members to invite others to this workspace
                            </p>
                        </div>
                        <Switch
                            checked={allowMemberInvites}
                            onCheckedChange={setAllowMemberInvites}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Workspace Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Workspace Actions</CardTitle>
                    <CardDescription>
                        Manage your workspace with these actions
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="outline"
                            onClick={handleDuplicateWorkspace}
                            className="flex items-center gap-2"
                        >
                            <Copy className="h-4 w-4" />
                            Duplicate Workspace
                        </Button>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                            <p className="text-sm text-muted-foreground">
                                These actions cannot be undone
                            </p>
                        </div>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="flex items-center gap-2">
                                    <Trash2 className="h-4 w-4" />
                                    Delete Workspace
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{currentWorkspace.name}"? 
                                        This action cannot be undone and will permanently delete all 
                                        databases, records, and files in this workspace.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteWorkspace}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete Workspace
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
