import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, Key, Smartphone, Eye, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';

export const SecuritySettings: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState(true);

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        // TODO: Implement password change API
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleEnable2FA = () => {
        // TODO: Implement 2FA setup
        setTwoFactorEnabled(!twoFactorEnabled);
        toast.success(twoFactorEnabled ? '2FA disabled' : '2FA enabled');
    };

    const handleDownloadData = () => {
        // TODO: Implement data export
        toast.info('Data export will be available soon');
    };

    const handleDeleteAccount = () => {
        // TODO: Implement account deletion
        toast.error('Account deletion initiated');
    };

    return (
        <div className="space-y-6">
            {/* Password */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Password
                    </CardTitle>
                    <CardDescription>
                        Change your account password
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                            id="current-password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                        />
                    </div>
                    <Button onClick={handleChangePassword}>
                        Change Password
                    </Button>
                </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>
                        Add an extra layer of security to your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Enable 2FA</Label>
                            <p className="text-sm text-muted-foreground">
                                Require a verification code in addition to your password
                            </p>
                        </div>
                        <Switch
                            checked={twoFactorEnabled}
                            onCheckedChange={handleEnable2FA}
                        />
                    </div>
                    {twoFactorEnabled && (
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm">
                                Two-factor authentication is enabled. Use your authenticator app to generate codes.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Session Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Session Management
                    </CardTitle>
                    <CardDescription>
                        Manage your active sessions and security preferences
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Automatic Session Timeout</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically log out after 30 minutes of inactivity
                            </p>
                        </div>
                        <Switch
                            checked={sessionTimeout}
                            onCheckedChange={setSessionTimeout}
                        />
                    </div>
                    <Button variant="outline">
                        View Active Sessions
                    </Button>
                </CardContent>
            </Card>

            {/* Data & Privacy */}
            <Card>
                <CardHeader>
                    <CardTitle>Data & Privacy</CardTitle>
                    <CardDescription>
                        Manage your data and privacy settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        variant="outline"
                        onClick={handleDownloadData}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Download My Data
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Export all your data including workspaces, databases, and files
                    </p>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        Irreversible actions that will permanently affect your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete your account? This action cannot be undone 
                                    and will permanently delete all your workspaces, databases, and data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteAccount}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete Account
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
};
