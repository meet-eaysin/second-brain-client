import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Command,
  Bell,
  MoreHorizontal,
  Settings,
  Zap,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeSwitch } from "@/components/theme-switch";
import { ProfileDropdown } from "@/components/profile-dropdown";

interface EnhancedHeaderProps {
  className?: string;
  showSearch?: boolean;
  contextActions?: React.ReactNode;
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
      notifications: "Notifications",
      capture: "Quick Capture",
      "my-day": "My Day",
      projects: "Projects",
      notes: "Notes",
      people: "People",
      goals: "Goals",
      habits: "Habits",
      journal: "Journal",
      "mood-tracker": "Mood Tracker",
      search: "Search",
      finances: "Finances",
      "content-hub": "Content Hub",
      books: "Book Log",
      para: "PARA System",
      areas: "Areas",
      resources: "Resources",
      archive: "Archive",
    };

    return titleMap[lastSegment] || "Second Brain";
  };

  return (
    <header
      className={cn(
        "flex h-12 shrink-0 items-center gap-3 border-b bg-background px-4",
        className
      )}
    >
      {/* Left: Page title */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          {getPageTitle()}
        </span>
      </div>

      {/* Center: Compact search (when enabled) */}
      {showSearch && (
        <div className="flex-1 max-w-sm mx-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 pr-12 h-8 bg-muted/50 border-0 focus:bg-background transition-colors text-sm"
            />
            <Badge
              variant="outline"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 px-1 text-xs font-mono"
            >
              <Command className="h-2.5 w-2.5 mr-0.5" />K
            </Badge>
          </div>
        </div>
      )}

      {/* Right: Context actions and utilities */}
      <div className="flex items-center gap-1">
        {/* Context-specific actions */}
        {contextActions}

        {/* Utility dropdown for all essential functions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2">
              <Plus className="h-4 w-4" />
              Quick Add
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Zap className="h-4 w-4" />
              AI Assistant
              <Badge variant="secondary" className="ml-auto text-xs">
                Soon
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <ThemeSwitch />

        {/* Profile dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
