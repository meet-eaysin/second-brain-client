import React from 'react';
import { Link } from 'react-router-dom';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    ArrowLeft, Shield, Link as LinkIcon, Github, Mail, 
    Chrome, Smartphone, AlertTriangle, CheckCircle, 
    ExternalLink, Unlink, Plus
} from 'lucide-react';

export const AccountSettingsPage: React.FC = () => {
    return (
        <>
            <EnhancedHeader 
                contextActions={
                    <>
                        <Button size="sm" variant="outline" className="h-8 gap-2" asChild>
                            <Link to="/app/settings">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Settings
                            </Link>
                        </Button>
                        <Button size="sm" className="h-8 gap-2">
                            <Shield className="h-4 w-4" />
                            Account Security
                        </Button>
                    </>
                }
            />
            
            <Main className="space-y-8">
                {/* Page Description */}
                <div className="space-y-2">
                    <p className="text-muted-foreground">
                        Manage your account settings, connected platforms, and integrations
                    </p>
                </div>

                {/* Account Status */}
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                        Your account is <strong>verified</strong> and in good standing.
                    </AlertDescription>
                </Alert>

                {/* Connected Platforms */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" />
                            Connected Platforms
                        </CardTitle>
                        <CardDescription>
                            Connect your accounts from other platforms to sync data and enable integrations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Google Account */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <Chrome className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <div className="font-medium">Google Account</div>
                                    <div className="text-sm text-muted-foreground">
                                        john.doe@gmail.com
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Connected
                                </Badge>
                                <Button variant="outline" size="sm">
                                    <Unlink className="h-4 w-4 mr-2" />
                                    Disconnect
                                </Button>
                            </div>
                        </div>

                        {/* GitHub Account */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <Github className="h-5 w-5 text-gray-800" />
                                </div>
                                <div>
                                    <div className="font-medium">GitHub</div>
                                    <div className="text-sm text-muted-foreground">
                                        Connect your GitHub account for code integration
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Connect
                            </Button>
                        </div>

                        {/* Microsoft Account */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-medium">Microsoft Account</div>
                                    <div className="text-sm text-muted-foreground">
                                        Connect for Office 365 and Outlook integration
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Connect
                            </Button>
                        </div>

                        {/* Slack */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Smartphone className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <div className="font-medium">Slack</div>
                                    <div className="text-sm text-muted-foreground">
                                        Connect for team communication and notifications
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Connect
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Preferences</CardTitle>
                        <CardDescription>
                            Configure how your account behaves and interacts with connected services
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Auto-sync data</div>
                                <div className="text-sm text-muted-foreground">
                                    Automatically sync data from connected platforms
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Cross-platform notifications</div>
                                <div className="text-sm text-muted-foreground">
                                    Receive notifications from connected platforms
                                </div>
                            </div>
                            <Switch />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Data sharing</div>
                                <div className="text-sm text-muted-foreground">
                                    Allow connected platforms to access your data
                                </div>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Danger Zone</CardTitle>
                        <CardDescription>
                            Irreversible actions that affect your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                These actions cannot be undone. Please proceed with caution.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium">Export Account Data</div>
                                    <div className="text-sm text-muted-foreground">
                                        Download all your data in a portable format
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Export Data
                                </Button>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-red-600">Delete Account</div>
                                    <div className="text-sm text-muted-foreground">
                                        Permanently delete your account and all data
                                    </div>
                                </div>
                                <Button variant="destructive" size="sm">
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Main>
        </>
    );
};

export default AccountSettingsPage;
