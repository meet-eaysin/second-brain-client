import * as React from 'react'
import { ChevronsUpDown, Plus, Building2 } from 'lucide-react'
import { TooltipWrapper } from '@/components/ui/tooltip-wrapper'
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

    // TODO: Remove mock workspaces when CORS issue is fixed
    // Mock workspaces for demonstration (API calls are failing due to CORS policy)
    const mockWorkspaces = [
        {
            id: '1',
            name: 'Personal Workspace',
            description: 'My personal knowledge base',
            icon: '🧠',
            color: '#3b82f6',
            isPersonal: true
        },
        {
            id: '2',
            name: 'Work Projects',
            description: 'Professional work and projects',
            icon: '💼',
            color: '#10b981',
            isPersonal: false
        },
        {
            id: '3',
            name: 'Learning Hub',
            description: 'Courses, books, and learning materials',
            icon: '📚',
            color: '#f59e0b',
            isPersonal: false
        }
    ]

    // Use mock data if no workspaces loaded (for demo purposes)
    const displayWorkspaces = workspaces.length > 0 ? workspaces : mockWorkspaces
    const displayCurrentWorkspace = currentWorkspace || mockWorkspaces[0]

    // Fallback to teams if no workspaces are available
    const [activeTeam, setActiveTeam] = React.useState(teams[0])
    const hasWorkspaces = displayWorkspaces.length > 0



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
                                {hasWorkspaces && displayCurrentWorkspace ? (
                                    <>
                                        <div
                                            className='flex aspect-square size-8 items-center justify-center rounded-lg text-white'
                                            style={{ backgroundColor: displayCurrentWorkspace.color || '#3b82f6' }}
                                        >
                                            <span className='text-lg'>{displayCurrentWorkspace.icon || '🏢'}</span>
                                        </div>
                                        <div className='grid flex-1 text-left text-sm leading-tight'>
                                            <span className='truncate font-semibold'>
                                                {displayCurrentWorkspace.name}
                                            </span>
                                            <span className='truncate text-xs'>
                                                {(displayCurrentWorkspace as any).isPersonal ? 'Personal' : 'Team Workspace'}
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
                                {displayWorkspaces.map((workspace, index) => (
                                    <DropdownMenuItem
                                        key={workspace.id}
                                        onClick={() => {
                                            // Use real setCurrentWorkspace if available, otherwise just update display
                                            if (workspaces.length > 0) {
                                                setCurrentWorkspace(workspace as any)
                                            }
                                        }}
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