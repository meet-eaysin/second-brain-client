import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import {TeamSwitcher} from "@/layout/team-switcher.tsx";
import {NavGroup} from "@/layout/nav-group.tsx";
import {DynamicNavGroup} from "@/layout/dynamic-nav-group.tsx";
import {NavUser} from "@/layout/nav-user.tsx";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible='icon' variant='floating' {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={sidebarData.teams} />
            </SidebarHeader>
            <SidebarContent>
                {sidebarData.navGroups.map((props) => {
                    // Use DynamicNavGroup for groups that need active state handling
                    if (props.title === 'General' || props.title === 'Second Brain' || props.title === 'Other') {
                        return <DynamicNavGroup key={props.title} {...props} />
                    }
                    return <NavGroup key={props.title} {...props} />
                })}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={sidebarData.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}