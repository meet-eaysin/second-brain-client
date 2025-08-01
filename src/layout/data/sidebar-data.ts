
import {
    AudioWaveform,
    Command,
    GalleryVerticalEnd,
    LucideCheckLine, LucideDiameter, LucideHelpCircle,
    LucideLayoutDashboard, LucideNavigation,
    LucidePackage, LucideServer, LucideToolCase,
    LucideUserCog, Database as DatabaseIcon, Users, Shield, Brain,
    BookOpen, Search, Calendar, Archive, Tags,
    Network, FileText, Bookmark, TriangleDashed
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
                    title: 'Second Brain',
                    icon: TriangleDashed,
                    items: [
                        {
                            title: 'Knowledge Graph',
                            url: '/app/knowledge-graph',
                            icon: Network,
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
                        },
                        {
                            title: 'AI Assistant',
                            url: '/app/ai-assistant',
                            icon: Brain,
                            badge: 'Upcoming',
                        },
                        {
                            title: 'Templates',
                            url: '/app/templates',
                            icon: FileText,
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
                        },
                        {
                            title: 'Archive',
                            url: '/app/archive',
                            icon: Archive,
                        },
                    ],
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
                }
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
                        {
                            title: 'Data Tables',
                            url: '/app/data-tables',
                            icon: LucideCheckLine,
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
