
import {
    AudioWaveform,
    Command,
    GalleryVerticalEnd,
    LucideCheckLine, LucideDiameter, LucideHelpCircle,
    LucideLayoutDashboard, LucideNavigation,
    LucidePackage, LucideServer, LucideToolCase,
    LucideUserCog, Database as DatabaseIcon, Users, Shield, LucideShield, Brain,
    BookOpen, Search, Calendar, Archive, Tags,
    Network, FileText, Bookmark, File, Bell, Settings,
    User, CreditCard, Palette, Monitor, Building2,
    CheckSquare, Target, Lightbulb, Heart, DollarSign,
    TrendingUp, Zap, PenTool, Video, Smile, Plus,
    Clock, Filter, BarChart3, Repeat, Star, Folder
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
                    title: 'Dashboard',
                    url: '/app/second-brain',
                    icon: Brain,
                    tooltip: 'Your Second Brain overview and today\'s focus',
                },
                {
                    title: 'Quick Capture',
                    url: '/app/second-brain/capture',
                    icon: Plus,
                    tooltip: 'Quickly capture tasks, notes, and ideas',
                },
                {
                    title: 'My Day',
                    url: '/app/second-brain/my-day',
                    icon: Clock,
                    tooltip: 'Today\'s tasks, habits, and focus',
                },
                {
                    title: 'Tasks',
                    icon: CheckSquare,
                    items: [
                        {
                            title: 'All Tasks',
                            url: '/app/second-brain/tasks',
                        },
                        {
                            title: 'Today',
                            url: '/app/second-brain/tasks?view=today',
                        },
                        {
                            title: 'Next Actions',
                            url: '/app/second-brain/tasks?view=next-actions',
                        },
                        {
                            title: 'Waiting',
                            url: '/app/second-brain/tasks?view=waiting',
                        },
                        {
                            title: 'Someday',
                            url: '/app/second-brain/tasks?view=someday',
                        },
                    ],
                },
                {
                    title: 'Projects',
                    url: '/app/second-brain/projects',
                    icon: Target,
                    tooltip: 'Goal-oriented containers for tasks and notes',
                },
                {
                    title: 'Notes',
                    icon: BookOpen,
                    items: [
                        {
                            title: 'All Notes',
                            url: '/app/second-brain/notes',
                        },
                        {
                            title: 'Meeting Notes',
                            url: '/app/second-brain/notes?type=meeting',
                        },
                        {
                            title: 'Research',
                            url: '/app/second-brain/notes?type=research',
                        },
                        {
                            title: 'Templates',
                            url: '/app/second-brain/notes?type=template',
                        },
                    ],
                },
                {
                    title: 'People (CRM)',
                    url: '/app/second-brain/people',
                    icon: Users,
                    tooltip: 'Personal and professional relationship manager',
                },
                {
                    title: 'Goals',
                    url: '/app/second-brain/goals',
                    icon: Target,
                    tooltip: 'Annual, quarterly, and monthly goals',
                },
                {
                    title: 'Habits',
                    url: '/app/second-brain/habits',
                    icon: Repeat,
                    tooltip: 'Daily and weekly habit tracking',
                },
                {
                    title: 'Journal',
                    url: '/app/second-brain/journal',
                    icon: PenTool,
                    tooltip: 'Daily reflections and thought tracking',
                },
                {
                    title: 'Book Log',
                    url: '/app/second-brain/books',
                    icon: BookOpen,
                    tooltip: 'Track reading, notes, and highlights',
                },
                {
                    title: 'Content Hub',
                    url: '/app/second-brain/content',
                    icon: Video,
                    tooltip: 'Plan, create, and publish content',
                },
                {
                    title: 'Finances',
                    url: '/app/second-brain/finances',
                    icon: DollarSign,
                    tooltip: 'Income, expenses, and invoices',
                },
                {
                    title: 'Mood Tracker',
                    url: '/app/second-brain/mood',
                    icon: Smile,
                    tooltip: 'Energy and mood monitoring',
                },
                {
                    title: 'PARA System',
                    icon: Folder,
                    items: [
                        {
                            title: 'Projects',
                            url: '/app/second-brain/para/projects',
                        },
                        {
                            title: 'Areas',
                            url: '/app/second-brain/para/areas',
                        },
                        {
                            title: 'Resources',
                            url: '/app/second-brain/para/resources',
                        },
                        {
                            title: 'Archive',
                            url: '/app/second-brain/para/archive',
                        },
                    ],
                },
                {
                    title: 'Search',
                    url: '/app/second-brain/search',
                    icon: Search,
                    tooltip: 'Search across all Second Brain modules',
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
                            url: '/app/settings/profile',
                            icon: User,
                        },
                        {
                            title: 'Account',
                            url: '/app/settings/account',
                            icon: Shield,
                        },
                        {
                            title: 'Security',
                            url: '/app/settings/security',
                            icon: LucideShield,
                        },
                        {
                            title: 'Billing',
                            url: '/app/settings/billing',
                            icon: CreditCard,
                        },
                        {
                            title: 'Appearance',
                            url: '/app/settings/appearance',
                            icon: Palette,
                        },
                        {
                            title: 'Display',
                            url: '/app/settings/display',
                            icon: Monitor,
                        },
                        {
                            title: 'Notifications',
                            url: '/app/settings/notifications',
                            icon: Bell,
                        },
                        {
                            title: 'Workspace',
                            url: '/app/settings/workspace',
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