import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, MessageSquare, Users, Database, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const NotificationSettings: React.FC = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [workspaceInvites, setWorkspaceInvites] = useState(true);
    const [databaseShares, setDatabaseShares] = useState(true);
    const [mentions, setMentions] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(false);
    const [notificationFrequency, setNotificationFrequency] = useState('immediate');

    const handleSaveSettings = () => {
        toast.success('Notification settings saved');
    };

    return (
        <div className="space-y-6">
            {/* General Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        General Notifications
                    </CardTitle>
                    <CardDescription>
                        Control how you receive notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Notifications
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                            </p>
                        </div>
                        <Switch
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Push Notifications
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                Receive browser push notifications
                            </p>
                        </div>
                        <Switch
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Notification Frequency</Label>
                        <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
                            <SelectTrigger className="w-full md:w-64">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="immediate">Immediate</SelectItem>
                                <SelectItem value="hourly">Hourly Digest</SelectItem>
                                <SelectItem value="daily">Daily Digest</SelectItem>
                                <SelectItem value="weekly">Weekly Digest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Workspace Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Workspace Activity
                    </CardTitle>
                    <CardDescription>
                        Get notified about workspace-related activities
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Workspace Invites</Label>
                            <p className="text-sm text-muted-foreground">
                                When someone invites you to a workspace
                            </p>
                        </div>
                        <Switch
                            checked={workspaceInvites}
                            onCheckedChange={setWorkspaceInvites}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="flex items-center gap-2">
                                <Database className="h-4 w-4" />
                                Database Shares
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                When someone shares a database with you
                            </p>
                        </div>
                        <Switch
                            checked={databaseShares}
                            onCheckedChange={setDatabaseShares}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Comments & Mentions</Label>
                            <p className="text-sm text-muted-foreground">
                                When someone comments or mentions you
                            </p>
                        </div>
                        <Switch
                            checked={mentions}
                            onCheckedChange={setMentions}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Digest Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Digest & Summary
                    </CardTitle>
                    <CardDescription>
                        Periodic summaries of your activity
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Weekly Activity Digest</Label>
                            <p className="text-sm text-muted-foreground">
                                Get a weekly summary of your workspace activity
                            </p>
                        </div>
                        <Switch
                            checked={weeklyDigest}
                            onCheckedChange={setWeeklyDigest}
                        />
                    </div>
                </CardContent>
            </Card>

            <Separator />

            <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                    Save Notification Settings
                </Button>
            </div>
        </div>
    );
};
