
import {
    AudioWaveform,
    Command,
    GalleryVerticalEnd,
    LucideCheckLine, LucideDiameter, LucideHelpCircle,
    LucideLayoutDashboard, LucideNavigation,
    LucidePackage, LucideServer, LucideToolCase,
    LucideUserCog, Database as DatabaseIcon, Users, Shield, Brain,
    BookOpen, Search, Calendar, Archive, Tags,
    Network, FileText, Bookmark, File, Bell, Settings,
    User, CreditCard, Palette, Monitor, Building2
} from 'lucide-react'

export const sidebarData = {
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
                    tooltip: 'View your workspace overview and analytics',
                },
                {
                    title: 'Databases',
                    url: '/app/databases',
                    icon: DatabaseIcon,
                    isDynamic: true,
                },
                {
                    title: 'Users',
                    url: '/app/users',
                    icon: Users,
                    tooltip: 'Manage workspace members and user accounts',
                },
                {
                    title: 'Notifications',
                    url: '/app/notifications',
                    icon: Bell,
                    tooltip: 'View and manage your notifications',
                }
            ],
        },
        {
            title: 'Second Brain',
            items: [
                {
                    title: 'Knowledge Graph',
                    url: '/app/knowledge-graph',
                    icon: Network,
                    tooltip: 'Visualize connections between your ideas and data',
                },
                {
                    title: 'Notes & Ideas',
                    icon: BookOpen,
                    items: [
                        {
                            title: 'All Notes',
                            url: '/app/notes',
                        },
                        {
                            title: 'Ideas',
                            url: '/app/ideas',
                        },
                        {
                            title: 'Quick Capture',
                            url: '/app/capture',
                        },
                    ],
                },
                {
                    title: 'Collections',
                    icon: Bookmark,
                    items: [
                        {
                            title: 'All Collections',
                            url: '/app/collections',
                        },
                        {
                            title: 'Favorites',
                            url: '/app/favorites',
                        },
                        {
                            title: 'Recent',
                            url: '/app/recent',
                        },
                    ],
                },
                {
                    title: 'Smart Search',
                    url: '/app/search',
                    icon: Search,
                    tooltip: 'Search across all your databases and content',
                },
                {
                    title: 'AI Assistant',
                    url: '/app/ai-assistant',
                    icon: Brain,
                    badge: 'Upcoming',
                    tooltip: 'Get AI-powered insights and assistance (coming soon)',
                },
                {
                    title: 'Templates',
                    url: '/app/templates',
                    icon: FileText,
                    tooltip: 'Use pre-built database templates to get started quickly',
                },
                {
                    title: 'Calendar View',
                    url: '/app/calendar',
                    icon: Calendar,
                },
                {
                    title: 'Tags',
                    url: '/app/tags',
                    icon: Tags,
                    tooltip: 'Create and manage tags to organize your content',
                },
                {
                    title: 'Files',
                    url: '/app/files',
                    icon: File,
                    tooltip: 'Upload and manage files and attachments',
                },
                {
                    title: 'Archive',
                    url: '/app/archive',
                    icon: Archive,
                    tooltip: 'View archived databases and content',
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
                    icon: Settings,
                    items: [
                        {
                            title: 'Profile',
                            url: '/app/settings?tab=profile',
                            icon: User,
                        },
                        {
                            title: 'Account',
                            url: '/app/settings?tab=security',
                            icon: Shield,
                        },
                        {
                            title: 'Appearance',
                            url: '/app/settings?tab=appearance',
                            icon: Palette,
                        },
                        {
                            title: 'Notifications',
                            url: '/app/settings?tab=notifications',
                            icon: Bell,
                        },
                        {
                            title: 'Display',
                            url: '/app/settings?tab=appearance',
                            icon: Monitor,
                        },
                        {
                            title: 'Workspace',
                            url: '/app/settings?tab=workspace',
                            icon: Building2,
                        },
                    ],
                },
                {
                    title: 'Help Center',
                    url: '/help-center',
                    icon: LucideHelpCircle,
                },
            ],
        }
    ],
}