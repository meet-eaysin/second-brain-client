import type { LucideIcon } from "lucide-react";

export interface SidebarUser {
  name: string;
  email: string;
  avatar: string;
}

export interface SidebarTeam {
  name: string;
  logo: LucideIcon;
  plan: string;
}

export interface SidebarNavItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  badge?: string;
  isDynamic?: boolean;
  items?: SidebarNavItem[];
}

export interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}

export interface SidebarData {
  user: SidebarUser;
  teams: SidebarTeam[];
  navGroups: SidebarNavGroup[];
}

// Additional types for dynamic nav group
export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  badge?: string;
  isDynamic?: boolean;
  items?: NavItem[];
  onClick?: () => void;
}
