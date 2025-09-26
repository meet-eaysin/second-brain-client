import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

interface NavItem {
  title: string;
  url?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  isDynamic?: boolean;
  items?: NavItem[];
  tooltip?: string;
}

interface NavGroupProps {
  title: string;
  items: NavItem[];
}

const NavBadge = ({ children }: { children: React.ReactNode }) => {
  if (children === "Upcoming") {
    return (
      <Badge className="rounded-full px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
        {children}
      </Badge>
    );
  }

  return <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>;
};

const NavItem = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
  const location = useLocation();
  const href = location.pathname;
  const isActive =
    item.items?.some((subItem: NavItem) => subItem.url === href) ||
    item.url === href;

  const hasChildren = item.items && item.items.length > 0;

  if (hasChildren) {
    return (
      <Collapsible defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              className={cn(
                "w-full justify-start gap-2 h-8 px-2 min-w-0",
                level > 0 && "ml-4"
              )}
            >
              {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
              <span className="flex-1 text-left truncate">{item.title}</span>
              {item.badge && <NavBadge>{item.badge}</NavBadge>}
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="CollapsibleContent">
            <SidebarMenuSub>
              {item.items?.map((subItem, index) => (
                <NavItem key={index} item={subItem} level={level + 1} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  if (level > 0) {
    // Sub-item
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild isActive={isActive}>
          <Link to={item.url || "#"}>
            {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  // Top-level item
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link to={item.url || "#"}>
          {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
          <span>{item.title}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export const NavGroup = ({ title, items }: NavGroupProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
