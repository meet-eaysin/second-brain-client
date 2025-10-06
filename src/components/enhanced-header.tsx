import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Command } from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { NotificationBell } from "@/modules/notifications";
import { Header } from "@/layout/header.tsx";
import type { ReactNode } from "react";

interface EnhancedHeaderProps {
  className?: string;
  showSearch?: boolean;
  contextActions?: ReactNode;
}

export function EnhancedHeader({
  className,
  showSearch = true,
  contextActions,
}: EnhancedHeaderProps) {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    const titleMap: Record<string, string> = {
      dashboard: "Dashboard",
      users: "Users",
      tasks: "Tasks",
      notifications: "Notifications",
      projects: "Projects",
      notes: "Notes",
      people: "People",
      journal: "Journal",
      search: "Search",
      finances: "Finances",
      books: "Book Log",
      para: "PARA System",
      areas: "Areas",
      resources: "Resources",
      archive: "Archive",
      profile: "Profile",
      security: "Security",
      appearance: "Appearance",
      notification: "Notification",
      workspace: "Workspace",
      billing: "Billing",
      "help-center": "Help Center",
    };

    return titleMap[lastSegment] || "Second Brain";
  };

  return (
    <Header className={cn("border-b px-4", className)}>
      {contextActions}
      <div className="flex h-12 flex-1 items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          {getPageTitle()}
        </span>

        {showSearch && (
          <div className="hidden md:block flex-1 max-w-sm mx-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 pr-12 h-8 bg-muted/50 border-0 focus:bg-background transition-colors text-sm"
              />
              <Badge
                variant="outline"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-4 px-1 text-xs font-mono"
              >
                <Command className="h-2.5 w-2.5 mr-0.5" />K
              </Badge>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1">
          <NotificationBell />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </div>
    </Header>
  );
}
