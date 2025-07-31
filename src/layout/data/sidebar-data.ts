
import {
    AudioWaveform,
    Command,
    GalleryVerticalEnd, LucideBarChart, LucideBug,
    LucideCheckLine, LucideDiameter, LucideFerrisWheel, LucideHelpCircle,
    LucideLayoutDashboard, LucideLock, LucideNavigation,
    LucidePackage, LucideServer, LucideShare2, LucideSignal, LucideToolCase,
    LucideUserCog, Database as DatabaseIcon, Users, Shield
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
    user: {
        name: 'satnaing',
        email: 'satnaingdev@gmail.com',
        avatar: '/avatars/shadcn.jpg',
    },
    teams: [
        {
            name: 'Shadcn Admin',
            logo: Command,
            plan: 'Vite + ShadcnUI',
        },
        {
            name: 'Acme Inc',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup',
        },
    ],
    navGroups: [
        {
            title: 'General',
            items: [
                {
                    title: 'Dashboard',
                    url: '/app/dashboard',
                    icon: LucideLayoutDashboard,
                },
                {
                    title: 'Databases',
                    url: '/app/databases',
                    icon: DatabaseIcon,
                    isDynamic: true,
                },
                {
                    title: 'Data Tables',
                    url: '/app/data-tables',
                    icon: LucideCheckLine,
                },
                {
                    title: 'Users',
                    url: '/app/users',
                    icon: Users,
                },
                {
                    title: 'Social Connect',
                    icon: LucideShare2,
                    items: [
                        {
                            title: 'Dashboard',
                            url: '/app/social-connect/dashboard',
                        },
                        {
                            title: 'LinkedIn',
                            url: '/app/social-connect/linkedin',
                        },
                    ],
                },
                {
                    title: 'Secured by Clerk',
                    icon: LucideSignal,
                    items: [
                        {
                            title: 'Sign In',
                            url: '/clerk/sign-in',
                        },
                        {
                            title: 'Sign Up',
                            url: '/clerk/sign-up',
                        },
                        {
                            title: 'User Management',
                            url: '/clerk/user-management',
                        },
                    ],
                },
            ],
        },
        {
            title: 'Pages',
            items: [
                {
                    title: 'Auth',
                    icon: LucideLock,
                    items: [
                        {
                            title: 'Sign In',
                            url: '/sign-in',
                        },
                        {
                            title: 'Sign In (2 Col)',
                            url: '/sign-in-2',
                        },
                        {
                            title: 'Sign Up',
                            url: '/sign-up',
                        },
                        {
                            title: 'Forgot Password',
                            url: '/forgot-password',
                        },
                        {
                            title: 'OTP',
                            url: '/otp',
                        },
                    ],
                },
                {
                    title: 'Errors',
                    icon: LucideBug,
                    items: [
                        {
                            title: 'Unauthorized',
                            url: '/401',
                            icon: LucideLock,
                        },
                        {
                            title: 'Forbidden',
                            url: '/403',
                            icon: LucideUserCog,
                        },
                        {
                            title: 'Not Found',
                            url: '/404',
                            icon: LucideFerrisWheel,
                        },
                        {
                            title: 'Internal Server Error',
                            url: '/500',
                            icon: LucideServer,
                        },
                        {
                            title: 'Maintenance Error',
                            url: '/503',
                            icon: LucideBarChart,
                        },
                    ],
                },
            ],
        },
        {
            title: 'Administration',
            items: [
                {
                    title: 'Admin Dashboard',
                    url: '/app/admin',
                    icon: Shield,
                },
                {
                    title: 'User Management',
                    url: '/app/admin/users',
                    icon: LucideUserCog,
                },
            ],
        },
        {
            title: 'Other',
            items: [
                {
                    title: 'Settings',
                    icon: LucideServer,
                    items: [
                        {
                            title: 'Profile',
                            url: '/settings',
                            icon: LucideUserCog,
                        },
                        {
                            title: 'Account',
                            url: '/settings/account',
                            icon: LucideToolCase,
                        },
                        {
                            title: 'Appearance',
                            url: '/settings/appearance',
                            icon: LucidePackage,
                        },
                        {
                            title: 'Notifications',
                            url: '/settings/notifications',
                            icon: LucideNavigation,
                        },
                        {
                            title: 'Display',
                            url: '/settings/display',
                            icon: LucideDiameter,
                        },
                    ],
                },
                {
                    title: 'Help Center',
                    url: '/help-center',
                    icon: LucideHelpCircle,
                },
            ],
        },
    ],
}