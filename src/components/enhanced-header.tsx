import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Plus,
    Command,
    Bell,
    Sparkles,
     TriangleDashed
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DatabaseQuickActions } from '@/modules/databases';

interface EnhancedHeaderProps {
    className?: string;
    showDatabaseActions?: boolean;
}

export function EnhancedHeader({ className, showDatabaseActions = false }: EnhancedHeaderProps) {
    const location = useLocation();
    
    const getBreadcrumbs = () => {
        const path = location.pathname;
        const segments = path.split('/').filter(Boolean);
        
        const segmentMap: Record<string, string> = {
            'app': 'App',
            'dashboard': 'Dashboard',
            'databases': 'Databases',
            'notes': 'Notes',
            'ideas': 'Ideas',
            'search': 'Smart Search',
            'settings': 'Settings',
            'favorites': 'Favorites',
            'tags': 'Tags',
            'collections': 'Collections',
            'calendar': 'Calendar View',
            'recent': 'Recent',
            'templates': 'Templates',
            'archive': 'Archive',
            'capture': 'Quick Capture',
            'knowledge-graph': 'Knowledge Graph',
            'ai-assistant': 'AI Assistant',
        };
        
        return segments.map(segment => segmentMap[segment] || segment);
    };
    
    const breadcrumbs = getBreadcrumbs();

    return (
        <header className={cn("flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4", className)}>
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            
            {/* Breadcrumbs */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="/app/dashboard" className="flex items-center gap-2">
                            <TriangleDashed className="h-4 w-4" />
                            {/*<TriangleDashed />*/}
                            Second Brain
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                {index === breadcrumbs.length - 1 ? (
                                    <BreadcrumbPage>{crumb}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={`/${breadcrumbs.slice(0, index + 1).join('/').toLowerCase()}`}>
                                        {crumb}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </div>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>

            {/* Center Search */}
            <div className="flex-1 flex justify-center max-w-md mx-auto">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search your second brain..."
                        className="pl-10 pr-20 bg-muted/50 border-0 focus:bg-background transition-colors"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        <Badge variant="outline" className="h-5 px-1.5 text-xs font-mono">
                            <Command className="h-3 w-3 mr-1" />K
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Bell className="h-4 w-4" />
                </Button>
                
                {/* Show Database Quick Actions on database pages */}
                {showDatabaseActions && (
                    <DatabaseQuickActions variant="compact" />
                )}
                
                {/* Default Quick Add button when not on database pages */}
                {!showDatabaseActions && (
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                        <Plus className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Quick Add</span>
                    </Button>
                )}
                
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    AI Assistant
                    <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                        Upcoming
                    </Badge>
                </Button>
            </div>
        </header>
    );
}