import React from 'react';
import { Link } from 'react-router-dom';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    ArrowLeft, User, Camera, Mail, Phone, MapPin, 
    Calendar, Globe, Save, Upload
} from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
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
                            <Save className="h-4 w-4" />
                            Save Changes
                        </Button>
                    </>
                }
            />
            
            <Main className="space-y-8">
                {/* Page Description */}
                <div className="space-y-2">
                    <p className="text-muted-foreground">
                        Manage your personal information and profile preferences
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profile Picture */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="h-4 w-4" />
                                Profile Picture
                            </CardTitle>
                            <CardDescription>
                                Update your profile photo
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src="/placeholder-avatar.jpg" />
                                    <AvatarFallback className="text-lg">JD</AvatarFallback>
                                </Avatar>
                                <div className="space-y-2 text-center">
                                    <Button size="sm" variant="outline" className="gap-2">
                                        <Upload className="h-4 w-4" />
                                        Upload Photo
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        JPG, PNG up to 5MB
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Basic Information */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>
                                Your personal details and contact information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" placeholder="Doe" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="flex gap-2">
                                    <Input id="email" type="email" placeholder="john@example.com" />
                                    <Badge variant="secondary">Verified</Badge>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea 
                                    id="bio" 
                                    placeholder="Tell us about yourself..."
                                    className="min-h-[100px]"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Location & Timezone */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Location & Timezone
                        </CardTitle>
                        <CardDescription>
                            Set your location and timezone preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" placeholder="United States" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Input id="timezone" placeholder="America/New_York" />
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" placeholder="New York" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Input id="language" placeholder="English" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Professional Information
                        </CardTitle>
                        <CardDescription>
                            Your work and professional details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input id="company" placeholder="Acme Inc." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jobTitle">Job Title</Label>
                                <Input id="jobTitle" placeholder="Software Engineer" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" type="url" placeholder="https://example.com" />
                        </div>
                    </CardContent>
                </Card>

                {/* Account Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Account Information
                        </CardTitle>
                        <CardDescription>
                            Your account status and membership details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label className="text-sm font-medium">Member Since</Label>
                                <p className="text-sm text-muted-foreground">January 15, 2024</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Account Type</Label>
                                <div className="flex items-center gap-2">
                                    <Badge>Free Plan</Badge>
                                    <Button size="sm" variant="link" className="h-auto p-0">
                                        Upgrade
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label className="text-sm font-medium">Last Login</Label>
                                <p className="text-sm text-muted-foreground">2 hours ago</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Account Status</Label>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Active
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Main>
        </>
    );
};

export default ProfileSettingsPage;
