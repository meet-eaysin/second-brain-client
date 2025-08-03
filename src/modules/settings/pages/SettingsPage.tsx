import React from 'react';
import { Link } from 'react-router-dom';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    User, Palette, Building2, Bell, Shield, CreditCard,
    ChevronRight, Settings, Zap, Database, Key, Globe
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const settingsCategories = [
        {
            id: 'account',
            title: 'Account & Profile',
            description: 'Manage your personal information, security, and account preferences',
            icon: User,
            color: 'bg-blue-500',
            items: [
                {
                    name: 'Profile',
                    description: 'Personal information and preferences',
                    href: '/app/settings/profile',
                    icon: User
                },
                {
                    name: 'Security',
                    description: 'Password, 2FA, and security settings',
                    href: '/app/settings/security',
                    icon: Shield
                }
            ]
        },
        {
            id: 'billing',
            title: 'Billing & Subscription',
            description: 'Manage your subscription, billing, and payment methods',
            icon: CreditCard,
            color: 'bg-green-500',
            items: [
                {
                    name: 'Subscription',
                    description: 'Current plan and billing information',
                    href: '/app/settings/billing',
                    icon: CreditCard
                },
                {
                    name: 'Usage',
                    description: 'Storage and feature usage statistics',
                    href: '/app/settings/usage',
                    icon: Database
                }
            ]
        },
        {
            id: 'workspace',
            title: 'Workspace & Preferences',
            description: 'Customize your workspace appearance and behavior',
            icon: Settings,
            color: 'bg-purple-500',
            items: [
                {
                    name: 'Appearance',
                    description: 'Theme, layout, and visual preferences',
                    href: '/app/settings/appearance',
                    icon: Palette
                },
                {
                    name: 'Notifications',
                    description: 'Email, push, and in-app notifications',
                    href: '/app/settings/notifications',
                    icon: Bell
                },
                {
                    name: 'Workspace',
                    description: 'Team settings and permissions',
                    href: '/app/settings/workspace',
                    icon: Building2
                }
            ]
        },
        {
            id: 'integrations',
            title: 'Integrations & API',
            description: 'Connect external services and manage API access',
            icon: Zap,
            color: 'bg-orange-500',
            items: [
                {
                    name: 'Connected Apps',
                    description: 'Third-party integrations and connections',
                    href: '/app/settings/integrations',
                    icon: Globe
                },
                {
                    name: 'API Keys',
                    description: 'Manage API keys and developer access',
                    href: '/app/settings/api',
                    icon: Key
                }
            ]
        }
    ];

    return (
        <>
            <EnhancedHeader
                showSearch={false}
                contextActions={
                    <Button size="sm" variant="outline" className="h-8 gap-2">
                        <Settings className="h-4 w-4" />
                        Export Settings
                    </Button>
                }
            />

            <Main className="space-y-8">
                {/* Page Description */}
                <div className="space-y-2">
                    <p className="text-muted-foreground">
                        Manage your account, workspace, and application preferences
                    </p>
                </div>

                {/* Settings Categories */}
                <div className="grid gap-6">
                    {settingsCategories.map((category) => {
                        const CategoryIcon = category.icon;
                        return (
                            <Card key={category.id} className="overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${category.color} text-white`}>
                                            <CategoryIcon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{category.title}</CardTitle>
                                            <CardDescription className="text-sm">
                                                {category.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid gap-3">
                                        {category.items.map((item) => {
                                            const ItemIcon = item.icon;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    to={item.href}
                                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <ItemIcon className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <div className="font-medium text-sm">{item.name}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {item.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                        <CardDescription>
                            Common settings and account actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button variant="outline" className="justify-start h-auto p-4">
                                <div className="text-left">
                                    <div className="font-medium">Export Data</div>
                                    <div className="text-xs text-muted-foreground">Download your data</div>
                                </div>
                            </Button>
                            <Button variant="outline" className="justify-start h-auto p-4">
                                <div className="text-left">
                                    <div className="font-medium">Reset Preferences</div>
                                    <div className="text-xs text-muted-foreground">Restore defaults</div>
                                </div>
                            </Button>
                            <Button variant="outline" className="justify-start h-auto p-4 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                                <div className="text-left">
                                    <div className="font-medium">Delete Account</div>
                                    <div className="text-xs opacity-70">Permanently delete</div>
                                </div>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </Main>
        </>
    );
};

export default SettingsPage;
