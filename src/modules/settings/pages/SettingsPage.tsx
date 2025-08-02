import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Palette, Building2, Bell, Shield, Monitor } from 'lucide-react';
import { ProfileSettings } from '../components/ProfileSettings';
import { AppearanceSettings } from '../components/AppearanceSettings';
import { WorkspaceSettings } from '../components/WorkspaceSettings';
import { NotificationSettings } from '../components/NotificationSettings';
import { SecuritySettings } from '../components/SecuritySettings';

export const SettingsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('profile');

    // Handle URL tab parameter
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && ['profile', 'security', 'appearance', 'notifications', 'workspace'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    const settingsTabs = [
        {
            id: 'profile',
            label: 'Profile',
            icon: User,
            description: 'Manage your personal information and preferences',
        },
        {
            id: 'security',
            label: 'Account',
            icon: Shield,
            description: 'Manage your account security and privacy',
        },
        {
            id: 'appearance',
            label: 'Appearance',
            icon: Palette,
            description: 'Customize the look and feel of your workspace',
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: Bell,
            description: 'Control how and when you receive notifications',
        },
        {
            id: 'workspace',
            label: 'Workspace',
            icon: Building2,
            description: 'Configure workspace settings and permissions',
        },
    ];

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>
            
            <Separator />

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    {settingsTabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="flex items-center gap-2"
                            >
                                <Icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {settingsTabs.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <tab.icon className="h-5 w-5" />
                                    {tab.label}
                                </CardTitle>
                                <CardDescription>{tab.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {tab.id === 'profile' && <ProfileSettings />}
                                {tab.id === 'appearance' && <AppearanceSettings />}
                                {tab.id === 'workspace' && <WorkspaceSettings />}
                                {tab.id === 'notifications' && <NotificationSettings />}
                                {tab.id === 'security' && <SecuritySettings />}
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};
