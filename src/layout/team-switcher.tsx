import * as React from 'react'
import { ChevronsUpDown, Plus, Building2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { useWorkspace } from '@/modules/workspaces/context/workspace-context'
import { WorkspaceForm } from '@/modules/workspaces/components/workspace-form'

export function TeamSwitcher({
                                 teams,
                             }: {
    teams: {
        name: string
        logo: React.ElementType
        plan: string
    }[]
}) {
    const { isMobile } = useSidebar()
    const { workspaces, currentWorkspace, setCurrentWorkspace, createWorkspace, isLoading } = useWorkspace()
    const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = React.useState(false)
    const [isCreatingWorkspace, setIsCreatingWorkspace] = React.useState(false)

    // Fallback to teams if no workspaces are available
    const [activeTeam, setActiveTeam] = React.useState(teams[0])
    const hasWorkspaces = workspaces.length > 0

    const handleCreateWorkspace = async (data: any) => {
        try {
            setIsCreatingWorkspace(true)
            const newWorkspace = await createWorkspace(data)
            setCurrentWorkspace(newWorkspace)
        } catch (error) {
            console.error('Failed to create workspace:', error)
        } finally {
            setIsCreatingWorkspace(false)
        }
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size='lg'
                                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                            >
                                {hasWorkspaces && currentWorkspace ? (
                                    <>
                                        <div
                                            className='flex aspect-square size-8 items-center justify-center rounded-lg text-white'
                                            style={{ backgroundColor: currentWorkspace.color || '#3b82f6' }}
                                        >
                                            <span className='text-lg'>{currentWorkspace.icon || '🏢'}</span>
                                        </div>
                                        <div className='grid flex-1 text-left text-sm leading-tight'>
                                            <span className='truncate font-semibold'>
                                                {currentWorkspace.name}
                                            </span>
                                            <span className='truncate text-xs'>
                                                {currentWorkspace.isPersonal ? 'Personal' : 'Team Workspace'}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                                            <activeTeam.logo className='size-4' />
                                        </div>
                                        <div className='grid flex-1 text-left text-sm leading-tight'>
                                            <span className='truncate font-semibold'>
                                                {activeTeam.name}
                                            </span>
                                            <span className='truncate text-xs'>{activeTeam.plan}</span>
                                        </div>
                                    </>
                                )}
                                <ChevronsUpDown className='ml-auto' />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                        align='start'
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        {hasWorkspaces ? (
                            <>
                                <DropdownMenuLabel className='text-muted-foreground text-xs'>
                                    Workspaces
                                </DropdownMenuLabel>
                                {workspaces.map((workspace, index) => (
                                    <DropdownMenuItem
                                        key={workspace.id}
                                        onClick={() => setCurrentWorkspace(workspace)}
                                        className='gap-2 p-2'
                                    >
                                        <div
                                            className='flex size-6 items-center justify-center rounded-sm text-white text-xs'
                                            style={{ backgroundColor: workspace.color || '#3b82f6' }}
                                        >
                                            {workspace.icon || '🏢'}
                                        </div>
                                        <div className='flex-1'>
                                            <div className='font-medium'>{workspace.name}</div>
                                            {workspace.description && (
                                                <div className='text-xs text-muted-foreground truncate'>
                                                    {workspace.description}
                                                </div>
                                            )}
                                        </div>
                                        <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className='gap-2 p-2'
                                    onClick={() => setIsCreateWorkspaceOpen(true)}
                                >
                                    <div className='bg-background flex size-6 items-center justify-center rounded-md border'>
                                        <Plus className='size-4' />
                                    </div>
                                    <div className='text-muted-foreground font-medium'>Create workspace</div>
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <>
                                <DropdownMenuLabel className='text-muted-foreground text-xs'>
                                    Teams
                                </DropdownMenuLabel>
                                {teams.map((team, index) => (
                                    <DropdownMenuItem
                                        key={team.name}
                                        onClick={() => setActiveTeam(team)}
                                        className='gap-2 p-2'
                                    >
                                        <div className='flex size-6 items-center justify-center rounded-sm border'>
                                            <team.logo className='size-4 shrink-0' />
                                        </div>
                                        {team.name}
                                        <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className='gap-2 p-2'
                                    onClick={() => setIsCreateWorkspaceOpen(true)}
                                >
                                    <div className='bg-background flex size-6 items-center justify-center rounded-md border'>
                                        <Plus className='size-4' />
                                    </div>
                                    <div className='text-muted-foreground font-medium'>Create workspace</div>
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>

        <WorkspaceForm
            open={isCreateWorkspaceOpen}
            onOpenChange={setIsCreateWorkspaceOpen}
            onSubmit={handleCreateWorkspace}
            mode="create"
            isLoading={isCreatingWorkspace}
        />
        </>
    )
}