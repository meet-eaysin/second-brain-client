import React from 'react';
import { Link } from 'react-router-dom';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    ArrowLeft, Shield, Key, Smartphone, Eye, EyeOff,
    AlertTriangle, CheckCircle, Clock, Download
} from 'lucide-react';

export const SecuritySettingsPage: React.FC = () => {
    const [showPassword, setShowPassword] = React.useState(false);

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
                            <Download className="h-4 w-4" />
                            Download Backup Codes
                        </Button>
                    </>
                }
            />
            
            <Main className="space-y-8">
                {/* Page Description */}
                <div className="space-y-2">
                    <p className="text-muted-foreground">
                        Manage your account security, password, and authentication settings
                    </p>
                </div>

                {/* Security Status */}
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                        Your account security is <strong>Good</strong>. Consider enabling two-factor authentication for enhanced security.
                    </AlertDescription>
                </Alert>

                {/* Password Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-4 w-4" />
                            Password
                        </CardTitle>
                        <CardDescription>
                            Update your password and manage password security
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Current Password</Label>
                                <div className="relative">
                                    <Input 
                                        id="currentPassword" 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter current password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input 
                                    id="newPassword" 
                                    type="password"
                                    placeholder="Enter new password"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input 
                                    id="confirmPassword" 
                                    type="password"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Password Requirements</h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• At least 8 characters long</li>
                                <li>• Contains uppercase and lowercase letters</li>
                                <li>• Contains at least one number</li>
                                <li>• Contains at least one special character</li>
                            </ul>
                        </div>
                        
                        <Button>Update Password</Button>
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
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="font-medium">Authenticator App</div>
                                <div className="text-sm text-muted-foreground">
                                    Use an authenticator app to generate verification codes
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">Not Enabled</Badge>
                                <Switch />
                            </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="font-medium">SMS Authentication</div>
                                <div className="text-sm text-muted-foreground">
                                    Receive verification codes via text message
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">Not Enabled</Badge>
                                <Switch />
                            </div>
                        </div>
                        
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                We recommend using an authenticator app over SMS for better security.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                {/* Login Sessions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Active Sessions
                        </CardTitle>
                        <CardDescription>
                            Manage your active login sessions across devices
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            {/* Current Session */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                    <div className="font-medium flex items-center gap-2">
                                        Chrome on Windows
                                        <Badge variant="secondary" className="text-xs">Current</Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        New York, United States • Last active now
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" disabled>
                                    Current Session
                                </Button>
                            </div>
                            
                            {/* Other Sessions */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                    <div className="font-medium">Safari on iPhone</div>
                                    <div className="text-sm text-muted-foreground">
                                        New York, United States • Last active 2 hours ago
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Revoke
                                </Button>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                    <div className="font-medium">Firefox on Mac</div>
                                    <div className="text-sm text-muted-foreground">
                                        San Francisco, United States • Last active 1 day ago
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Revoke
                                </Button>
                            </div>
                        </div>
                        
                        <Separator />
                        
                        <Button variant="destructive" size="sm">
                            Revoke All Other Sessions
                        </Button>
                    </CardContent>
                </Card>

                {/* Account Recovery */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Account Recovery
                        </CardTitle>
                        <CardDescription>
                            Set up recovery options in case you lose access to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="font-medium">Recovery Email</div>
                                    <div className="text-sm text-muted-foreground">
                                        backup@example.com
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Update
                                </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="font-medium">Backup Codes</div>
                                    <div className="text-sm text-muted-foreground">
                                        Generated on Jan 15, 2024 • 8 codes remaining
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    Regenerate
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Main>
        </>
    );
};

export default SecuritySettingsPage;
