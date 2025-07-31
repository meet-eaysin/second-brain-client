import { ChevronRight } from 'lucide-react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { Link, useLocation } from "react-router-dom";
import type { NavGroup } from "@/layout/types.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { useDatabaseSidebar } from '@/modules/databases/hooks/useDatabaseSidebar';

interface DynamicNavGroupProps extends NavGroup {
    isDynamic?: boolean;
}

export function DynamicNavGroup({ title, items }: DynamicNavGroupProps) {
    const { state, isMobile } = useSidebar()
    const location = useLocation()
    const href = location.pathname
    const { databaseNavItems } = useDatabaseSidebar();

    // Replace the databases item with dynamic content
    const processedItems = items.map(item => {
        if (item.title === 'Databases' && 'isDynamic' in item && item.isDynamic) {
            return databaseNavItems;
        }
        return item;
    });

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {processedItems.map((item) => {
                    const key = `${item.title}-${item.url}`

                    if (!item.items)
                        return <SidebarMenuLink key={key} item={item} href={href} />

                    if (state === 'collapsed' && !isMobile)
                        return (
                            <SidebarMenuCollapsedDropdown key={key} item={item} href={href} />
                        )

                    return <SidebarMenuCollapsible key={key} item={item} href={href} />
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}

const NavBadge = ({ children }: { children: React.ReactNode }) => (
    <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
)

const SidebarMenuLink = ({
    item,
    href,
}: {
    item: any
    href: string
}) => {
    const { setOpenMobile } = useSidebar()
    const isActive = item.url === href

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
            >
                <Link to={item.url} onClick={() => setOpenMobile(false)}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.badge && <NavBadge>{item.badge}</NavBadge>}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

const SidebarMenuCollapsible = ({
    item,
    href,
}: {
    item: any
    href: string
}) => {
    const { setOpenMobile } = useSidebar()
    const isActive = item.items?.some((subItem: any) => subItem.url === href)

    return (
        <Collapsible
            asChild
            defaultOpen={isActive}
            className='group/collapsible'
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.badge && <NavBadge>{item.badge}</NavBadge>}
                        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className='CollapsibleContent'>
                    <SidebarMenuSub>
                        {item.items.map((subItem: any) => {
                            const isSubActive = subItem.url === href
                            
                            if (subItem.items) {
                                // Nested submenu
                                return (
                                    <Collapsible key={subItem.title} asChild>
                                        <SidebarMenuSubItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuSubButton>
                                                    {subItem.icon && <subItem.icon />}
                                                    <span>{subItem.title}</span>
                                                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                                                    <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                                                </SidebarMenuSubButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {subItem.items.map((nestedItem: any) => (
                                                        <SidebarMenuSubItem key={nestedItem.title}>
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={nestedItem.url === href}
                                                            >
                                                                <Link 
                                                                    to={nestedItem.url} 
                                                                    onClick={() => setOpenMobile(false)}
                                                                >
                                                                    <span>{nestedItem.title}</span>
                                                                    {nestedItem.badge && <NavBadge>{nestedItem.badge}</NavBadge>}
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuSubItem>
                                    </Collapsible>
                                )
                            }

                            return (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                        asChild
                                        isActive={isSubActive}
                                    >
                                        <Link 
                                            to={subItem.url} 
                                            onClick={() => setOpenMobile(false)}
                                        >
                                            {subItem.icon && <subItem.icon />}
                                            <span>{subItem.title}</span>
                                            {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            )
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}

const SidebarMenuCollapsedDropdown = ({
    item,
    href,
}: {
    item: any
    href: string
}) => {
    // Implementation for collapsed dropdown (similar to existing)
    return <SidebarMenuLink item={item} href={href} />
}
