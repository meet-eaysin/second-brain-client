import { useMemo } from 'react';
import { Database as DatabaseIcon, Plus, FolderOpen, Star, Clock, Users } from 'lucide-react';
import { useDatabases } from '../services/databaseQueries';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import type { NavCollapsible } from '@/layout/types';

export const useDatabaseSidebar = () => {
    const { user } = useAuth();
    const { data: databasesData, isLoading } = useDatabases({ limit: 50 });

    const databaseNavItems = useMemo((): NavCollapsible => {
        if (isLoading || !databasesData?.databases) {
            return {
                title: 'Databases',
                icon: DatabaseIcon,
                url: '/app/databases',
                items: [
                    {
                        title: 'Loading...',
                        url: '/app/databases',
                    }
                ]
            };
        }

        const databases = databasesData.databases;
        
        // Group databases by categories
        const myDatabases = databases.filter(db => db.ownerId === user?.id);
        const sharedDatabases = databases.filter(db => db.ownerId !== user?.id);
        const recentDatabases = databases
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5);
        const favoriteDatabases = databases.filter(db => db.isFavorite); // Assuming we add this field

        const items = [
            {
                title: 'All Databases',
                url: '/app/databases',
                icon: FolderOpen,
            },
            {
                title: 'Create New',
                url: '/app/databases?action=create',
                icon: Plus,
            }
        ];

        // Add recent databases if any
        if (recentDatabases.length > 0) {
            items.push({
                title: 'Recent',
                icon: Clock,
                items: recentDatabases.map(db => ({
                    title: db.name,
                    url: `/app/databases/${db.id}`,
                    badge: db.isPublic ? 'Public' : undefined,
                }))
            });
        }

        // Add favorite databases if any
        if (favoriteDatabases.length > 0) {
            items.push({
                title: 'Favorites',
                icon: Star,
                items: favoriteDatabases.map(db => ({
                    title: db.name,
                    url: `/app/databases/${db.id}`,
                    badge: db.isPublic ? 'Public' : undefined,
                }))
            });
        }

        // Add my databases
        if (myDatabases.length > 0) {
            items.push({
                title: 'My Databases',
                icon: DatabaseIcon,
                items: myDatabases.map(db => ({
                    title: db.name,
                    url: `/app/databases/${db.id}`,
                    badge: db.isPublic ? 'Public' : undefined,
                }))
            });
        }

        // Add shared databases
        if (sharedDatabases.length > 0) {
            items.push({
                title: 'Shared with Me',
                icon: Users,
                items: sharedDatabases.map(db => ({
                    title: db.name,
                    url: `/app/databases/${db.id}`,
                    badge: 'Shared',
                }))
            });
        }

        return {
            title: 'Databases',
            icon: DatabaseIcon,
            url: '/app/databases',
            badge: databases.length.toString(),
            items
        };
    }, [databasesData, isLoading, user?.id]);

    return { databaseNavItems };
};
