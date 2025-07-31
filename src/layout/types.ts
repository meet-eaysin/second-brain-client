import type {LinkProps} from "react-router-dom";

interface User {
    name: string
    email: string
    avatar: string
}

interface Team {
    name: string
    logo: React.ElementType
    plan: string
}

interface BaseNavItem {
    title: string
    badge?: string
    icon?: React.ElementType
    isDynamic?: boolean
}

interface NavItem extends BaseNavItem {
    url?: LinkProps['to']
    items?: NavItem[]
}

// Legacy types for backward compatibility
type NavLink = BaseNavItem & {
    url: LinkProps['to']
    items?: never
}

type NavCollapsible = BaseNavItem & {
    items: NavItem[]
    url?: LinkProps['to']
}

interface NavGroup {
    title: string
    items: NavItem[]
}

interface SidebarData {
    user: User
    teams: Team[]
    navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink }