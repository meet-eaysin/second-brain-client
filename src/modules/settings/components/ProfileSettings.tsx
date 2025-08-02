import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, User, Mail, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const ProfileSettings: React.FC = () => {
    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Doe');
    const [email, setEmail] = useState('john.doe@example.com');
    const [username, setUsername] = useState('johndoe');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const handleSaveProfile = () => {
        // TODO: Implement profile update API call
        toast.success('Profile updated successfully');
    };

    const handleUploadPicture = () => {
        // TODO: Implement file upload
        toast.info('Profile picture upload coming soon');
    };

    return (
        <div className="space-y-6">
            {/* Profile Picture */}
            <Card>
                <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                        Upload a profile picture to personalize your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={profilePicture} />
                        <AvatarFallback className="text-lg">
                            {firstName.charAt(0)}{lastName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <Button onClick={handleUploadPicture} className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Upload Picture
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            JPG, PNG or GIF. Max size 2MB.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Personal Information
                    </CardTitle>
                    <CardDescription>
                        Update your personal details and contact information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself"
                            rows={3}
                        />
                        <p className="text-sm text-muted-foreground">
                            {bio.length}/500 characters
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Account Information
                    </CardTitle>
                    <CardDescription>
                        View your account details and membership information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Member Since</Label>
                            <p className="text-sm text-muted-foreground">January 15, 2024</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Account Type</Label>
                            <p className="text-sm text-muted-foreground">Free Plan</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Last Login</Label>
                            <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Time Zone</Label>
                            <p className="text-sm text-muted-foreground">UTC-8 (Pacific Time)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                    Save Changes
                </Button>
            </div>
        </div>
    );
};
