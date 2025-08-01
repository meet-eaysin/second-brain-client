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
import {Link, useLocation} from "react-router-dom";
import type {NavCollapsible, NavGroup, NavItem, NavLink} from "@/layout/types.ts";
import type {ReactNode} from "react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Badge} from "@/components/ui/badge.tsx";

export function NavGroup({ title, items }: NavGroup) {
    const { state, isMobile } = useSidebar()
    const location = useLocation()
    const href = location.pathname

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const key = `${item.title}-${item.url || 'no-url'}`

                    if (!item.items && item.url)
                        return <SidebarMenuLink key={key} item={item as NavLink} href={href} />

                    if (item.items) {
                        if (state === 'collapsed' && !isMobile)
                            return (
                                <SidebarMenuCollapsedDropdown key={key} item={item as NavCollapsible} href={href} />
                            )

                        return <SidebarMenuCollapsible key={key} item={item as NavCollapsible} href={href} />
                    }

                    return null;
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}

const NavBadge = ({ children }: { children: ReactNode }) => {
    if (children === 'Upcoming') {
        return (
            <Badge className='rounded-full px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'>
                {children}
            </Badge>
        );
    }
    
    return (
        <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
    );
}

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
    const { setOpenMobile } = useSidebar()
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={checkIsActive(href, item)}
                tooltip={item.title}
            >
                <Link to={item.url || '#'} onClick={() => setOpenMobile(false)}>
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
    item: NavCollapsible
    href: string
}) => {
    const { setOpenMobile } = useSidebar()
    return (
        <Collapsible
            asChild
            defaultOpen={checkIsActive(href, item, true)}
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
                        {item.items.filter(subItem => subItem.url).map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={checkIsActive(href, subItem)}
                                >
                                    <Link to={subItem.url!} onClick={() => setOpenMobile(false)}>
                                        {subItem.icon && <subItem.icon />}
                                        <span>{subItem.title}</span>
                                        {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
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
    item: NavCollapsible
    href: string
}) => {
    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        tooltip={item.title}
                        isActive={checkIsActive(href, item)}
                    >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.badge && <NavBadge>{item.badge}</NavBadge>}
                        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='right' align='start' sideOffset={4}>
                    <DropdownMenuLabel>
                        {item.title} {item.badge ? `(${item.badge})` : ''}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.items.filter(sub => sub.url).map((sub) => (
                        <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
                            <Link
                                to={sub.url!}
                                className={`${checkIsActive(href, sub) ? 'bg-secondary' : ''}`}
                            >
                                {sub.icon && <sub.icon />}
                                <span className='max-w-52 text-wrap'>{sub.title}</span>
                                {sub.badge && (
                                    <span className='ml-auto text-xs'>{sub.badge}</span>
                                )}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    )
}

function checkIsActive(currentPath: string, item: NavItem, mainNav = false) {
    const itemUrl = typeof item.url === 'string' ? item.url : item.url?.pathname || '';

    return (
        currentPath === itemUrl ||
        currentPath.split('?')[0] === itemUrl ||
        !!item?.items?.filter((i) => {
            const subItemUrl = typeof i.url === 'string' ? i.url : i.url?.pathname || '';
            return subItemUrl === currentPath;
        }).length ||
        (mainNav &&
            currentPath.split('/')[1] !== '' &&
            currentPath.split('/')[1] === itemUrl.split('/')[1])
    )
}
